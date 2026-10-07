'use client'

import { useId, useRef, useState } from 'react'
import type { ApplyConfig } from '@/lib/jobs/types'
import s from './jobs.module.css'

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done' } | { kind: 'error'; message: string }

const MAX = 5 * 1024 * 1024
const OK_TYPES = /\.(pdf|docx?|rtf)$/i

export function ApplyForm({ jobId, jobTitle, apply }: { jobId: string; jobTitle: string; apply: ApplyConfig }) {
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [drag, setDrag] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const uid = useId()

  if (apply.method === 'external' && apply.externalUrl) {
    return (
      <a className={`btn btn-primary ${s.applyWide}`} href={apply.externalUrl} target="_blank" rel="noopener">
        להגשה באתר המעסיק <span className="arr" aria-hidden="true">←</span>
      </a>
    )
  }

  if (state.kind === 'done') {
    return (
      <div className={s.applyDone} role="status">
        <b>קורות החיים התקבלו</b>
        <p>המגייסת של המשרה תעבור עליהם, וניצור קשר אם יש התאמה.</p>
        <p className={s.applyUpsell}>
          רוצה לראות את הסטטוס של כל ההגשות שלך במקום אחד?{' '}
          <a className="link-u" href="https://app.hiro.co.il">פתיחת פרופיל בחינם ב-Hiro</a>
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
    for (const q of apply.questions ?? []) {
      const v = fd.get(`q_${q.id}`)
      if (typeof v === 'string' && v) answers[q.id] = v
      fd.delete(`q_${q.id}`)
    }
    fd.set('answers', JSON.stringify(answers))
    const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')))
    if (Object.keys(utm).length) fd.set('utm', JSON.stringify(utm))

    setState({ kind: 'sending' })
    try {
      const res = await fetch(`/api/jobs/${encodeURIComponent(jobId)}/apply`, { method: 'POST', body: fd })
      if (res.ok) { setState({ kind: 'done' }); return }
      const body = await res.json().catch(() => ({}))
      setState({ kind: 'error', message: body.code === 'ALREADY_APPLIED' ? 'כבר הגשת מועמדות למשרה הזו. ניצור קשר אם יש התאמה.' : body.message || 'משהו השתבש. אפשר לנסות שוב.' })
    } catch {
      setState({ kind: 'error', message: 'אין חיבור. כדאי לבדוק את האינטרנט ולנסות שוב.' })
    }
  }

  return (
    <form className={s.apply} onSubmit={submit} noValidate={false} aria-label={`הגשת מועמדות למשרה ${jobTitle}`}>
      <div className={s.fieldRow}>
        <label htmlFor={`${uid}-name`}>שם מלא</label>
        <input id={`${uid}-name`} name="fullName" required autoComplete="name" />
      </div>
      <div className={s.fieldRow}>
        <label htmlFor={`${uid}-phone`}>טלפון נייד</label>
        <input id={`${uid}-phone`} name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" dir="ltr" />
      </div>
      <div className={s.fieldRow}>
        <label htmlFor={`${uid}-email`}>אימייל <span className={s.opt2}>(לא חובה)</span></label>
        <input id={`${uid}-email`} name="email" type="email" autoComplete="email" dir="ltr" />
      </div>

      <div className={s.fieldRow}>
        <span id={`${uid}-cv-l`} className={s.lbl}>קורות חיים{!apply.requiresCv && <span className={s.opt2}> (לא חובה)</span>}</span>
        <div
          className={`${s.drop} ${drag ? s.dropOn : ''} ${file ? s.dropHas : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files[0]) }}
        >
          <input
            ref={input} id={`${uid}-cv`} type="file" className="sr-only"
            accept=".pdf,.doc,.docx,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            aria-labelledby={`${uid}-cv-l`} aria-describedby={`${uid}-cv-h`}
            onChange={e => pickFile(e.target.files?.[0])}
          />
          <label htmlFor={`${uid}-cv`} className={s.dropLabel}>
            {file ? <><b>{file.name}</b><span>להחלפת הקובץ</span></> : <><b>בחירת קובץ</b><span>או גרירה לכאן</span></>}
          </label>
          <span id={`${uid}-cv-h`} className={s.dropHint}>PDF או Word, עד 5MB</span>
        </div>
        {fileError && <span className={s.err} role="alert">{fileError}</span>}
      </div>

      {(apply.questions ?? []).map(q => (
        <div key={q.id} className={s.fieldRow}>
          {q.type === 'yes_no' ? (
            <fieldset className={s.yesno}>
              <legend>{q.label}{!q.required && <span className={s.opt2}> (לא חובה)</span>}</legend>
              <label><input type="radio" name={`q_${q.id}`} value="yes" required={q.required} /> כן</label>
              <label><input type="radio" name={`q_${q.id}`} value="no" /> לא</label>
            </fieldset>
          ) : q.type === 'select' ? (
            <>
              <label htmlFor={`${uid}-${q.id}`}>{q.label}</label>
              <select id={`${uid}-${q.id}`} name={`q_${q.id}`} required={q.required} defaultValue="">
                <option value="" disabled>בחירה</option>
                {q.options?.map(o => <option key={o}>{o}</option>)}
              </select>
            </>
          ) : (
            <>
              <label htmlFor={`${uid}-${q.id}`}>{q.label}{!q.required && <span className={s.opt2}> (לא חובה)</span>}</label>
              <input id={`${uid}-${q.id}`} name={`q_${q.id}`} type={q.type === 'number' ? 'number' : 'text'} required={q.required} />
            </>
          )}
        </div>
      ))}

      <label className={s.consent}>
        <input type="checkbox" name="consent" value="true" required />
        <span>אני מסכים/ה ששמירת הפרטים ושליחתם למגייסים תיעשה לפי <a href="/privacy" className="link-u" target="_blank">מדיניות הפרטיות</a></span>
      </label>

      {state.kind === 'error' && <p className={s.err} role="alert">{state.message}</p>}

      <button type="submit" className={`btn btn-primary ${s.applyWide}`} disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? 'שולח…' : 'הגשת מועמדות'}
      </button>
    </form>
  )
}
