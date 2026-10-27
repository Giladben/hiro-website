'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { forwardAction, sendMessageAction, updateApplicationAction } from '@/app/employer/actions'
import type { ActionResult, Application, ApplicationStatus, MessageTemplate } from '@/lib/employer/types'
import s from './employer.module.css'

type Props = {
  job: { id: string; title: string }
  orgName: string
  applications: Application[]
  templates: MessageTemplate[]
  initialId?: string
}

const STATUS: Record<ApplicationStatus, string> = { new: 'חדש', reviewed: 'נבדק', shortlisted: 'מתאים', rejected: 'לא מתאים' }
const FILTERS: [ApplicationStatus | 'all', string][] = [['all', 'הכל'], ['new', 'חדשים'], ['shortlisted', 'מתאימים'], ['reviewed', 'נבדקו'], ['rejected', 'לא מתאימים']]

const when = (iso: string) => {
  const h = Math.floor((Date.now() - +new Date(iso)) / 36e5)
  if (h < 1) return 'עכשיו'
  if (h < 24) return `לפני ${h} שע׳`
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })
}

export function ApplicantsBoard({ job, orgName, applications, templates, initialId }: Props) {
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState(initialId && applications.some(a => a.id === initialId) ? initialId : applications[0]?.id)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [forwardIds, setForwardIds] = useState<string[] | null>(null)
  const [, startTransition] = useTransition()
  const detailRef = useRef<HTMLDivElement>(null)

  const visible = useMemo(() => (filter === 'all' ? applications : applications.filter(a => a.status === filter)), [applications, filter])
  const selected = applications.find(a => a.id === selectedId)
  const allChecked = visible.length > 0 && visible.every(a => checked.has(a.id))

  // Opening a new applicant marks them as reviewed, like an inbox marks mail as read
  useEffect(() => {
    if (selected?.status === 'new') startTransition(async () => { await updateApplicationAction(selected.id, { status: 'reviewed' }) })
  }, [selected?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const open = (id: string) => {
    setSelectedId(id)
    history.replaceState(null, '', `?a=${id}`)
    if (window.matchMedia('(max-width: 1000px)').matches) requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
  const toggleCheck = (id: string) => setChecked(c => { const n = new Set(c); if (n.has(id)) n.delete(id); else n.add(id); return n })

  return (
    <div className={s.board}>
      <section className={s.listCol} aria-label="רשימת מועמדים">
        <div className={s.listTools}>
          <div className={s.tabs} role="group" aria-label="סינון לפי סטטוס">
            {FILTERS.map(([v, l]) => {
              const n = v === 'all' ? applications.length : applications.filter(a => a.status === v).length
              return <button key={v} type="button" className={s.tab} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l} {n}</button>
            })}
          </div>
          <div className={s.bulk}>
            <label>
              <input type="checkbox" checked={allChecked} onChange={() => setChecked(allChecked ? new Set() : new Set(visible.map(a => a.id)))} />
              בחירת הכל
            </label>
            <button type="button" className={`btn btn-ghost ${s.small}`} disabled={!checked.size} onClick={() => setForwardIds([...checked])}>
              העברת קו״ח{checked.size ? ` (${checked.size})` : ''}
            </button>
          </div>
        </div>
        <ul className={s.apps}>
          {visible.map(a => (
            <li key={a.id} className={s.app} aria-current={a.id === selectedId} onClick={() => open(a.id)}>
              <input type="checkbox" checked={checked.has(a.id)} onChange={() => toggleCheck(a.id)} onClick={e => e.stopPropagation()} aria-label={`בחירת ${a.fullName}`} />
              <div style={{ minWidth: 0 }}>
                <button type="button" className={s.appName} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, display: 'flex', gap: '.45rem', alignItems: 'center' }} onClick={() => open(a.id)}>
                  {a.fullName}{a.status === 'new' && <span className={s.newDot}>חדש</span>}
                </button>
                <div className={s.appLine}>{a.headline ?? a.city ?? ''}</div>
                <div className={s.appWhen}>{when(a.submittedAt)} · {STATUS[a.status]}</div>
              </div>
            </li>
          ))}
          {!visible.length && <li className={s.app} style={{ cursor: 'default', display: 'block', color: 'var(--text2)' }}>אין מועמדים בסינון הזה.</li>}
        </ul>
      </section>

      <div ref={detailRef} className={s.detail}>
        {selected && <Applicant key={selected.id} a={selected} job={job} orgName={orgName} templates={templates} onForward={() => setForwardIds([selected.id])} />}
      </div>

      {forwardIds && <ForwardDialog ids={forwardIds} names={applications.filter(a => forwardIds.includes(a.id)).map(a => a.fullName)} onClose={() => setForwardIds(null)} />}
    </div>
  )
}

function Applicant({ a, job, orgName, templates, onForward }: { a: Application; job: { title: string }; orgName: string; templates: MessageTemplate[]; onForward: () => void }) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState(a.note ?? '')
  const [result, setResult] = useState<ActionResult | null>(null)
  const first = a.fullName.split(' ')[0]
  const fill = (t: string) => t.replace(/\{first\}/g, first).replace(/\{job\}/g, job.title).replace(/\{org\}/g, orgName)
  const [tpl, setTpl] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  const setStatus = (status: ApplicationStatus) => startTransition(async () => { setResult(await updateApplicationAction(a.id, { status })) })
  const saveNote = () => { if (note !== (a.note ?? '')) startTransition(async () => { setResult(await updateApplicationAction(a.id, { note })) }) }
  const pickTemplate = (id: string) => {
    setTpl(id)
    const t = templates.find(x => x.id === id)
    if (t) { setSubject(fill(t.subject)); setBody(fill(t.body)) }
  }
  const send = () => startTransition(async () => {
    const r = await sendMessageAction(a.id, { subject, body, templateId: tpl || undefined })
    setResult(r)
    if (r.ok) { setSubject(''); setBody(''); setTpl('') }
  })

  return (
    <>
      <section className={s.person} aria-labelledby="p-name">
        <div>
          <h2 id="p-name">{a.fullName}</h2>
          {a.headline && <p className={s.sub} style={{ margin: '.25rem 0 0' }}>{a.headline}</p>}
          <p className={s.contact}>
            <a href={`tel:${a.phone}`} dir="ltr">{a.phone}</a>
            {a.email && <a href={`mailto:${a.email}`} dir="ltr">{a.email}</a>}
            {a.city && <span>{a.city}</span>}
            <span style={{ color: 'var(--text3)' }}>הגיש/ה {when(a.submittedAt)}</span>
          </p>
        </div>
        <div className={s.row} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <label className={s.label} htmlFor="st">סטטוס</label>
          <select id="st" className={s.statusSel} value={a.status} disabled={pending} onChange={e => setStatus(e.target.value as ApplicationStatus)}>
            {Object.entries(STATUS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </section>

      {!!a.answers.length && (
        <section className={s.box} aria-labelledby="p-ans">
          <h2 id="p-ans">תשובות לשאלות הסינון</h2>
          <dl className={s.answers}>{a.answers.map(x => <div key={x.questionId}><dt>{x.label}</dt><dd>{x.answer}</dd></div>)}</dl>
        </section>
      )}

      <section className={s.box} aria-labelledby="p-cv">
        <div className={s.cvBar}>
          <h2 id="p-cv" style={{ margin: 0 }}>קורות חיים</h2>
          <div className={s.row}>
            {a.cv && <a href={a.cv.url} target="_blank" rel="noopener" className={`btn btn-ghost ${s.small}`}>פתיחה בחלון ↗</a>}
            <button type="button" className={`btn btn-ghost ${s.small}`} onClick={onForward} disabled={!a.cv}>העברה למייל</button>
          </div>
        </div>
        {a.cv
          ? <iframe className={s.cvFrame} src={a.cv.url} title={`קורות החיים של ${a.fullName}`} />
          : <p className={s.hint}>המועמד/ת הגיש/ה בלי קובץ קורות חיים. אפשר להתקשר או לבקש במייל.</p>}
      </section>

      <section className={s.box} aria-labelledby="p-msg">
        <h2 id="p-msg">מייל למועמד/ת</h2>
        {!!a.messages.length && (
          <ul className={s.thread}>
            {a.messages.map(m => (
              <li key={m.id} className={s.msg}>
                <b>{m.direction === 'out' ? 'נשלח' : 'התקבל'}: {m.subject}</b>
                <p>{m.body}</p>
                <time dateTime={m.sentAt}>{when(m.sentAt)}</time>
              </li>
            ))}
          </ul>
        )}
        {a.email ? (
          <>
            <div className={s.field}>
              <label className={s.label} htmlFor="tpl">תבנית</label>
              <select id="tpl" className={s.select} value={tpl} onChange={e => pickTemplate(e.target.value)}>
                <option value="">מייל חופשי</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="subj">נושא</label>
              <input id="subj" className={s.input} value={subject} onChange={e => setSubject(e.target.value)} maxLength={150} />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="body">תוכן</label>
              <textarea id="body" className={`${s.textarea} ${s.textareaSm}`} value={body} onChange={e => setBody(e.target.value)} />
              <p className={s.hint}>יישלח מ-&quot;{orgName} דרך HirO&quot;. תשובה של המועמד/ת תגיע ישירות למייל שלכם.</p>
            </div>
            <div className={s.row} style={{ marginTop: '.75rem' }}>
              <button type="button" className="btn btn-primary" onClick={send} disabled={pending || !subject || !body}>{pending ? 'שולחים...' : 'שליחה'}</button>
            </div>
          </>
        ) : (
          <p className={s.hint}>למועמד/ת אין כתובת מייל. אפשר להתקשר: <a href={`tel:${a.phone}`} dir="ltr">{a.phone}</a></p>
        )}
      </section>

      <section className={s.box} aria-labelledby="p-note">
        <h2 id="p-note">הערה פנימית</h2>
        <textarea className={`${s.textarea} ${s.textareaSm}`} aria-labelledby="p-note" value={note} onChange={e => setNote(e.target.value)} onBlur={saveNote} placeholder="רק אתם רואים את זה" maxLength={1000} />
      </section>

      <div aria-live="polite">
        {result && !result.ok && <p className={s.err}>{result.error}</p>}
        {result?.ok && result.message && <p className={s.okMsg}>{result.message}</p>}
      </div>
    </>
  )
}

function ForwardDialog({ ids, names, onClose }: { ids: string[]; names: string[]; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const [to, setTo] = useState('')
  const [note, setNote] = useState('')
  const [result, setResult] = useState<ActionResult | null>(null)
  const [pending, startTransition] = useTransition()
  useEffect(() => { ref.current?.showModal() }, [])

  const submit = () => startTransition(async () => setResult(await forwardAction({ applicationIds: ids, to, note })))

  return (
    <dialog ref={ref} className={s.dialog} onClose={onClose} aria-labelledby="fw-h">
      <div className={s.dialogIn}>
        <h2 id="fw-h">העברת קורות חיים</h2>
        {result?.ok ? (
          <>
            <p className={s.okMsg}>{result.message}</p>
            <button type="button" className="btn btn-primary" onClick={() => ref.current?.close()}>סגירה</button>
          </>
        ) : (
          <>
            <p>{ids.length === 1 ? <>של <b>{names[0]}</b></> : <><b>{ids.length}</b> מועמדים: {names.slice(0, 3).join(', ')}{names.length > 3 ? ` ועוד ${names.length - 3}` : ''}</>}. {ids.length > 10 ? 'יישלחו בקישור מאובטח לקובץ אחד, בתוקף 7 ימים.' : 'יישלחו כקבצים מצורפים.'}</p>
            <div className={s.field}>
              <label className={s.label} htmlFor="fw-to">למייל</label>
              <input id="fw-to" type="email" dir="ltr" className={`${s.input} ${result && !result.ok && result.field === 'to' ? s.invalid : ''}`} value={to} onChange={e => setTo(e.target.value)} autoFocus />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="fw-note">הודעה <em>(לא חובה)</em></label>
              <textarea id="fw-note" className={`${s.textarea} ${s.textareaSm}`} value={note} onChange={e => setNote(e.target.value)} />
            </div>
            <p className={s.hint}>המידע נמסר לצורך גיוס למשרה הזו בלבד. כל העברה נרשמת ביומן.</p>
            {result && !result.ok && <p className={s.err} role="alert">{result.error}</p>}
            <div className={s.row}>
              <button type="button" className="btn btn-primary" onClick={submit} disabled={pending || !to}>{pending ? 'שולחים...' : 'שליחה'}</button>
              <button type="button" className="btn btn-ghost" onClick={() => ref.current?.close()}>ביטול</button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
