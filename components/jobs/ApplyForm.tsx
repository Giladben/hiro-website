'use client'

import { useId, useRef, useState } from 'react'
import type { ApplyConfig } from '@/lib/jobs/types'
import s from './jobs.module.css'

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'done'; hasVideo: boolean }
  | { kind: 'closed' }
  | { kind: 'error'; message: string; field?: string }

const MAX = 5 * 1024 * 1024
const OK_TYPES = /\.(pdf|docx?)$/i

export function ApplyForm({ jobId, jobTitle, apply }: { jobId: string; jobTitle: string; apply: ApplyConfig }) {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const uid = useId()

  const formQuestions = (apply.questions ?? []).filter(q => q.type !== 'video')
  const videoQuestions = (apply.questions ?? []).filter(q => q.type === 'video')

  if (apply.method === 'external' && apply.externalUrl) {
    return (
      <a className={`btn btn-primary ${s.applyWide}`} href={apply.externalUrl} target="_blank" rel="noopener">
        להגשה באתר המעסיק <span className="arr" aria-hidden="true">←</span>
      </a>
    )
  }

  if (state.kind === 'closed') {
    return (
      <div className={s.applyDone} role="alert">
        <b>המשרה נסגרה</b>
        <p>המשרה הזו נסגרה ממש עכשיו, ולכן לא ניתן להגיש אליה. אפשר לראות משרות דומות בהמשך העמוד.</p>
      </div>
    )
  }

  if (state.kind === 'done') {
    return (
      <div className={s.applyDone} role="status">
        <b>קורות החיים התקבלו</b>
        <p>צוות הגיוס של המשרה יעבור עליהם, וניצור קשר אם יש התאמה.</p>
        {state.hasVideo && <p>יישלח אליך קישור להשלמת שאלות הווידאו של המשרה באזור האישי. כדאי להשלים אותן כדי שהמועמדות תהיה מלאה.</p>}
        <p className={s.applyUpsell}>
          רוצה לראות את הסטטוס של כל ההגשות שלך במקום אחד?{' '}
          <a className="link-u" href="https://app.hiro.co.il">לאזור האישי ב-Hiro</a>
        </p>
      </div>
    )
  }

  const pickFile = (f: File | undefined) => {
    setFileError('')
    if (!f) return
    if (!OK_TYPES.test(f.name)) { setFileError('אפשר להעלות PDF או Word בלבד'); return }
    if (f.size > MAX) { setFileError('הקובץ גדול מ-5MB'); return }
    setFile(f)
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (apply.requiresCv && !file) { setFileError('צריך לצרף קורות חיים'); input.current?.focus(); return }
    const fd = new FormData(e.currentTarget)
    if (file) fd.set('cv', file)

    const answers: Record<string, string> = {}
    for (const q of formQuestions) {
      const v = fd.get(`q_${q.id}`)
      if (typeof v === 'string' && v) answers[q.id] = v
      fd.delete(`q_${q.id}`)
    }
    fd.set('answers', JSON.stringify(answers))
    fd.set('optIns', JSON.stringify({ otherJobs: fd.get('optOtherJobs') === 'on', candidatePool: fd.get('optPool') === 'on' }))
    fd.delete('optOtherJobs')
    fd.delete('optPool')
    const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')))
    if (Object.keys(utm).length) fd.set('utm', JSON.stringify(utm))

    setState({ kind: 'sending' })
    try {
      const res = await fetch(`/api/jobs/${encodeURIComponent(jobId)}/apply`, { method: 'POST', body: fd })
      if (res.ok) { setState({ kind: 'done', hasVideo: videoQuestions.length > 0 }); return }
      const body = await res.json().catch(() => ({})) as { code?: string; message?: string; field?: string }
      if (res.status === 410 || body.code === 'JOB_CLOSED') { setState({ kind: 'closed' }); return }
      if (res.status === 409 || body.code === 'ALREADY_APPLIED') {
        setState({ kind: 'error', message: 'כבר הגשת מועמדות למשרה הזו. ניצור קשר אם יש התאמה.' })
        return
      }
      if (res.status === 422) {
        setState({ kind: 'error', message: body.message || 'אחד השדות לא תקין', field: body.field })
        if (body.field) document.getElementById(`${uid}-${body.field}`)?.focus()
        return
      }
      setState({ kind: 'error', message: body.message || 'משהו השתבש. אפשר לנסות שוב.' })
    } catch {
      setState({ kind: 'error', message: 'אין חיבור. כדאי לבדוק את האינטרנט ולנסות שוב.' })
    }
  }

  const err = state.kind === 'error' ? state : null
  const fieldError = (name: string) => (err?.field === name ? err.message : '')
  const row = (name: string) => `${s.fieldRow} ${fieldError(name) ? s.fieldErr : ''}`
  const describedBy = (name: string) => (fieldError(name) ? `${uid}-${name}-err` : undefined)

  return (
    // method/action matter only if JS hasn't loaded yet: a native submit must be a POST,
    // never a GET that would put the candidate's name and phone in the URL.
    <form
      className={s.apply}
      onSubmit={submit}
      method="post"
      action={`/api/jobs/${encodeURIComponent(jobId)}/apply`}
      encType="multipart/form-data"
      aria-label={`הגשת מועמדות למשרה ${jobTitle}`}
    >
      {/* honeypot: real users never see or fill this */}
      <div className={s.hp} aria-hidden="true">
        <label htmlFor={`${uid}-website`}>אתר</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={row('fullName')}>
        <label htmlFor={`${uid}-fullName`}>שם מלא</label>
        <input id={`${uid}-fullName`} name="fullName" required autoComplete="name" aria-invalid={!!fieldError('fullName')} aria-describedby={describedBy('fullName')} />
        {fieldError('fullName') && <span id={`${uid}-fullName-err`} className={s.err}>{fieldError('fullName')}</span>}
      </div>
      <div className={row('phone')}>
        <label htmlFor={`${uid}-phone`}>טלפון נייד</label>
        <input id={`${uid}-phone`} name="phone" type="tel" required autoComplete="tel" inputMode="tel" dir="ltr" aria-invalid={!!fieldError('phone')} aria-describedby={describedBy('phone')} />
        {fieldError('phone') && <span id={`${uid}-phone-err`} className={s.err}>{fieldError('phone')}</span>}
      </div>
      <div className={row('email')}>
        <label htmlFor={`${uid}-email`}>אימייל <span className={s.opt2}>(לא חובה)</span></label>
        <input id={`${uid}-email`} name="email" type="email" autoComplete="email" dir="ltr" aria-invalid={!!fieldError('email')} aria-describedby={describedBy('email')} />
        {fieldError('email') && <span id={`${uid}-email-err`} className={s.err}>{fieldError('email')}</span>}
      </div>

      <div className={row('cv')}>
        <span id={`${uid}-cv-l`} className={s.lbl}>קורות חיים{!apply.requiresCv && <span className={s.opt2}> (לא חובה)</span>}</span>
        <div
          className={`${s.drop} ${drag ? s.dropOn : ''} ${file ? s.dropHas : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]) }}
        >
          <input
            ref={input} id={`${uid}-cv`} type="file" className="sr-only"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-labelledby={`${uid}-cv-l`} aria-describedby={`${uid}-cv-h`}
            onChange={e => pickFile(e.target.files?.[0])}
          />
          <label htmlFor={`${uid}-cv`} className={s.dropLabel}>
            {file ? <><b>{file.name}</b><span>להחלפת הקובץ</span></> : <><b>בחירת קובץ</b><span>או גרירה לכאן</span></>}
          </label>
          <span id={`${uid}-cv-h`} className={s.dropHint}>PDF או Word, עד 5MB</span>
        </div>
        {(fileError || fieldError('cv')) && <span className={s.err} role="alert">{fileError || fieldError('cv')}</span>}
      </div>

      {formQuestions.map(q => {
        const name = `q_${q.id}`
        const id = `${uid}-${q.id}`
        const optional = !q.required && <span className={s.opt2}> (לא חובה)</span>
        return (
          <div key={q.id} className={row(q.id)}>
            {q.type === 'yes_no' ? (
              <fieldset className={s.yesno}>
                <legend>{q.label}{optional}</legend>
                <label><input type="radio" id={id} name={name} value="yes" required={q.required} /> כן</label>
                <label><input type="radio" name={name} value="no" /> לא</label>
              </fieldset>
            ) : q.type === 'select' ? (
              <>
                <label htmlFor={id}>{q.label}{optional}</label>
                <select id={id} name={name} required={q.required} defaultValue="">
                  <option value="" disabled>בחירה</option>
                  {q.options?.map(o => <option key={o}>{o}</option>)}
                </select>
              </>
            ) : (
              <>
                <label htmlFor={id}>{q.label}{optional}</label>
                <input id={id} name={name} type={q.type === 'number' ? 'number' : 'text'} inputMode={q.type === 'number' ? 'numeric' : undefined} required={q.required} />
              </>
            )}
            {fieldError(q.id) && <span className={s.err}>{fieldError(q.id)}</span>}
          </div>
        )
      })}

      {videoQuestions.length > 0 && (
        <p className={s.videoNote}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" strokeLinejoin="round" /></svg>
          <span>במשרה הזו יש גם {videoQuestions.length === 1 ? 'שאלת וידאו קצרה' : `${videoQuestions.length} שאלות וידאו קצרות`}. אחרי ההגשה יישלח אליך קישור להשלים אותן באזור האישי.</span>
        </p>
      )}

      <div className={s.consents}>
        <label className={s.consent}>
          <input type="checkbox" name="consent" value="true" required />
          <span>קראתי ואני מסכים/ה ל<a href="/privacy" className="link-u" target="_blank">מדיניות הפרטיות</a></span>
        </label>
        <label className={s.consent}>
          <input type="checkbox" name="optOtherJobs" />
          <span>אפשר לפנות אליי גם לגבי משרות נוספות שמתאימות לי</span>
        </label>
        <label className={s.consent}>
          <input type="checkbox" name="optPool" />
          <span>אפשר לשמור את הפרטים שלי במאגר המועמדים</span>
        </label>
      </div>

      {err && !err.field && <p className={s.err} role="alert">{err.message}</p>}
      {err?.field && <p className="sr-only" role="alert">{err.message}</p>}

      <button type="submit" className={`btn btn-primary ${s.applyWide}`} disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? 'שולח…' : 'הגשת מועמדות'}
      </button>
    </form>
  )
}
