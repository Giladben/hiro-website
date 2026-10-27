'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { saveJobAction } from '@/app/employer/actions'
import { JobCard } from '@/components/jobs/JobCard'
import { htmlToText, previewSummary } from '@/lib/employer/preview'
import type { ActionResult, EmployerJob, EmployerQuestion, OrgStatus } from '@/lib/employer/types'
import { labelsFrom } from '@/lib/jobs/labels'
import type { Taxonomy } from '@/lib/jobs/types'
import { useSubmit } from './useSubmit'
import s from './employer.module.css'

type Props = { job?: EmployerJob; taxonomy: Taxonomy; orgName: string; orgStatus: OrgStatus }

const Q_TYPES: [EmployerQuestion['type'], string][] = [['yes_no', 'כן / לא'], ['text', 'תשובה חופשית'], ['choice', 'בחירה מרשימה']]

export function JobForm({ job, taxonomy, orgName, orgStatus }: Props) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(saveJobAction, null)
  const submit = useSubmit(action)
  const lx = useMemo(() => labelsFrom(taxonomy), [taxonomy])
  const formRef = useRef<HTMLFormElement>(null)

  // Only what the live preview needs is held in state; the rest are plain form fields
  const [title, setTitle] = useState(job?.title ?? '')
  const [categorySlug, setCategory] = useState(job?.categorySlug ?? '')
  const [citySlug, setCity] = useState(job?.citySlug ?? '')
  const [employmentType, setEmployment] = useState<string[]>(job?.employmentType ?? [])
  const [workModel, setWorkModel] = useState(job?.workModel ?? taxonomy.workModels[0]?.value ?? 'onsite')
  const [hours, setHours] = useState(job?.hoursDescription ?? '')
  const [salaryMin, setMin] = useState(job?.salary?.min?.toString() ?? '')
  const [salaryMax, setMax] = useState(job?.salary?.max?.toString() ?? '')
  const [period, setPeriod] = useState<'month' | 'hour'>(job?.salary?.period === 'hour' ? 'hour' : 'month')
  const [publishSalary, setPublishSalary] = useState(job?.publishSalary ?? true)
  const [description, setDescription] = useState(() => (job ? htmlToText(job.description) : ''))
  const [noExperience, setNoExperience] = useState(job?.noExperience ?? false)
  const [confidential, setConfidential] = useState(job?.confidential ?? false)
  const [questions, setQuestions] = useState<EmployerQuestion[]>(job?.questions ?? [])

  const err = state && !state.ok ? state : null
  useEffect(() => {
    if (!err?.field) return
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${err.field}"]`)
    el?.focus()
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [err])
  const bad = (f: string) => (err?.field === f ? s.invalid : '')

  const salary = salaryMin || salaryMax ? { min: Number(salaryMin) || undefined, max: Number(salaryMax) || undefined, currency: 'ILS' as const, period } : undefined
  const preview = previewSummary({ title, categorySlug, citySlug, employmentType, workModel, hoursDescription: hours, salary, publishSalary, noExperience, confidential }, orgName, taxonomy, description)

  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v])
  const updateQ = (i: number, patch: Partial<EmployerQuestion>) => setQuestions(qs => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)))
  const published = job && job.status !== 'draft' && job.status !== 'rejected'

  return (
    <form ref={formRef} action={action} onSubmit={submit} className={s.form} noValidate>
      {job && <input type="hidden" name="id" value={job.id} />}
      <input type="hidden" name="questions" value={JSON.stringify(questions)} />

      <div className={s.formMain}>
        <section className={s.box} aria-labelledby="f-job">
          <h2 id="f-job">המשרה</h2>
          <div className={s.field}>
            <label className={s.label} htmlFor="title">כותרת</label>
            <input id="title" name="title" className={`${s.input} ${bad('title')}`} value={title} onChange={e => setTitle(e.target.value)} maxLength={80} placeholder="למשל: מחסנאי/ת למשמרות בוקר" />
            <p className={s.hint}>כותרת קצרה עם שם התפקיד. בלי שם העסק ובלי טלפון.</p>
          </div>
          <div className={s.grid2}>
            <div className={s.field}>
              <label className={s.label} htmlFor="categorySlug">תחום</label>
              <select id="categorySlug" name="categorySlug" className={`${s.select} ${bad('categorySlug')}`} value={categorySlug} onChange={e => setCategory(e.target.value)}>
                <option value="">בחירת תחום...</option>
                {taxonomy.clusters.map(c => (
                  <optgroup key={c.slug} label={c.label}>
                    {c.categories.map(k => <option key={k.slug} value={k.slug}>{k.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="citySlug">עיר</label>
              <select id="citySlug" name="citySlug" className={`${s.select} ${bad('citySlug')}`} value={citySlug} onChange={e => setCity(e.target.value)}>
                <option value="">בחירת עיר...</option>
                {taxonomy.regions.map(r => (
                  <optgroup key={r.slug} label={r.label}>
                    {[...r.cities].sort((a, b) => a.label.localeCompare(b.label, 'he')).map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>
          <fieldset className={s.field} style={{ border: 0, padding: 0, margin: '1rem 0 0' }}>
            <legend className={s.label} style={{ marginBottom: '.4rem' }}>היקף משרה</legend>
            <div className={`${s.checks} ${bad('employmentType')}`}>
              {taxonomy.employmentTypes.map(t => (
                <label key={t.value} className={s.check}>
                  <input type="checkbox" name="employmentType" value={t.value} checked={employmentType.includes(t.value)} onChange={() => setEmployment(v => toggle(v, t.value))} />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className={s.field} style={{ border: 0, padding: 0, margin: '1rem 0 0' }}>
            <legend className={s.label} style={{ marginBottom: '.4rem' }}>מקום העבודה</legend>
            <div className={s.checks}>
              {taxonomy.workModels.map(t => (
                <label key={t.value} className={s.check}>
                  <input type="radio" name="workModel" value={t.value} checked={workModel === t.value} onChange={() => setWorkModel(t.value)} />
                  {t.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className={s.field}>
            <label className={s.label} htmlFor="hoursDescription">שעות ומשמרות <em>(מומלץ)</em></label>
            <input id="hoursDescription" name="hoursDescription" className={s.input} value={hours} onChange={e => setHours(e.target.value)} maxLength={120} placeholder="למשל: א׳–ה׳ 07:00–16:00, שישי לסירוגין" />
          </div>
        </section>

        <section className={s.box} aria-labelledby="f-salary">
          <h2 id="f-salary">שכר <small>משרות עם שכר מקבלות יותר פניות</small></h2>
          <div className={s.grid3}>
            <div className={s.field}>
              <label className={s.label} htmlFor="salaryMin">מ-</label>
              <input id="salaryMin" name="salaryMin" inputMode="numeric" dir="ltr" className={`${s.input} ${bad('salaryMin')}`} value={salaryMin} onChange={e => setMin(e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="salaryMax">עד</label>
              <input id="salaryMax" name="salaryMax" inputMode="numeric" dir="ltr" className={s.input} value={salaryMax} onChange={e => setMax(e.target.value.replace(/\D/g, ''))} />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="salaryPeriod">לפי</label>
              <select id="salaryPeriod" name="salaryPeriod" className={s.select} value={period} onChange={e => setPeriod(e.target.value as 'month' | 'hour')}>
                <option value="month">חודש</option>
                <option value="hour">שעה</option>
              </select>
            </div>
          </div>
          <label className={s.toggle} style={{ marginTop: '1rem' }}>
            <input type="checkbox" name="publishSalary" checked={publishSalary} onChange={e => setPublishSalary(e.target.checked)} />
            <span>להציג את השכר במשרה<small>כבוי: השכר נשמר אצלכם ולא מוצג למועמדים</small></span>
          </label>
        </section>

        <section className={s.box} aria-labelledby="f-desc">
          <h2 id="f-desc">על התפקיד</h2>
          <div className={s.field}>
            <label className={s.label} htmlFor="description">תיאור</label>
            <textarea id="description" name="description" className={`${s.textarea} ${bad('description')}`} value={description} onChange={e => setDescription(e.target.value)}
              placeholder="מה עושים ביום-יום, עם מי עובדים, ומה מיוחד אצלכם. שורה ריקה מתחילה פסקה חדשה." />
            <p className={s.hint}>שתי השורות הראשונות מופיעות בכרטיס המשרה ברשימה. בלי קישורים ובלי פרטי קשר: המועמדים מגישים דרך HirO.</p>
          </div>
          <div className={s.grid2}>
            <div className={s.field}>
              <label className={s.label} htmlFor="requirements">דרישות <em>(שורה לכל דרישה)</em></label>
              <textarea id="requirements" name="requirements" className={`${s.textarea} ${s.textareaSm}`} defaultValue={job?.requirements.join('\n')} placeholder={'רישיון נהיגה ב׳\nזמינות למשמרות'} />
            </div>
            <div className={s.field}>
              <label className={s.label} htmlFor="benefits">מה מקבלים <em>(שורה לכל הטבה)</em></label>
              <textarea id="benefits" name="benefits" className={`${s.textarea} ${s.textareaSm}`} defaultValue={job?.benefits.join('\n')} placeholder={'ארוחות\nהסעות\nבונוסים'} />
            </div>
          </div>
        </section>

        <section className={s.box} aria-labelledby="f-who">
          <h2 id="f-who">למי מתאים</h2>
          <label className={s.toggle}>
            <input type="checkbox" name="noExperience" checked={noExperience} onChange={e => setNoExperience(e.target.checked)} />
            <span>מתאים גם ללא ניסיון</span>
          </label>
          {!noExperience && (
            <div className={s.field} style={{ maxWidth: 220 }}>
              <label className={s.label} htmlFor="experienceYearsMin">שנות ניסיון מינימום <em>(לא חובה)</em></label>
              <input id="experienceYearsMin" name="experienceYearsMin" inputMode="numeric" dir="ltr" className={s.input} defaultValue={job?.experienceYearsMin} />
            </div>
          )}
          {!!taxonomy.suitableFor.length && (
            <fieldset className={s.field} style={{ border: 0, padding: 0, margin: '1rem 0 0' }}>
              <legend className={s.label} style={{ marginBottom: '.4rem' }}>מתאים במיוחד ל... <em>(לא חובה)</em></legend>
              <div className={s.checks}>
                {taxonomy.suitableFor.map(t => (
                  <label key={t.value} className={s.check}>
                    <input type="checkbox" name="suitableFor" value={t.value} defaultChecked={job?.suitableFor.includes(t.value)} />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <p className={s.hint} style={{ marginTop: '1rem' }}>לפי חוק שוויון ההזדמנויות בעבודה אין לציין גיל, מגדר, מצב משפחתי או דת כדרישה.</p>
        </section>

        <section className={s.box} aria-labelledby="f-apply">
          <h2 id="f-apply">הגשת מועמדות</h2>
          <label className={s.toggle}>
            <input type="checkbox" name="requiresCv" defaultChecked={job?.requiresCv ?? false} />
            <span>קורות חיים חובה<small>כבוי: אפשר להגיש גם עם שם וטלפון בלבד. מתאים לתפקידי שטח ומשמרות.</small></span>
          </label>

          <div style={{ marginTop: '1.25rem' }}>
            <span className={s.label}>שאלות סינון <em>(עד 5, לא חובה)</em></span>
            <p className={s.hint}>המועמדים עונים בזמן ההגשה, ואתם רואים את התשובות ליד כל מועמד.</p>
            <div style={{ marginTop: '.6rem' }} className={bad('questions')}>
              {questions.map((q, i) => (
                <div key={q.id} className={s.q}>
                  <div className={s.qRow}>
                    <input className={s.input} aria-label={`שאלה ${i + 1}`} value={q.label} maxLength={140} placeholder="למשל: יש לך רישיון למלגזה?" onChange={e => updateQ(i, { label: e.target.value })} />
                    <select className={s.select} aria-label={`סוג שאלה ${i + 1}`} value={q.type} onChange={e => updateQ(i, { type: e.target.value as EmployerQuestion['type'], ...(e.target.value === 'choice' && !q.options?.length && { options: ['', ''] }) })}>
                      {Q_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <button type="button" className={s.iconBtn} aria-label={`מחיקת שאלה ${i + 1}`} onClick={() => setQuestions(qs => qs.filter((_, j) => j !== i))}>×</button>
                  </div>
                  {q.type === 'choice' && (
                    <input className={s.input} aria-label={`אפשרויות לשאלה ${i + 1}`} value={(q.options ?? []).join(', ')} placeholder="אפשרויות, מופרדות בפסיק: בוקר, ערב, לילה"
                      onChange={e => updateQ(i, { options: e.target.value.split(',').map(o => o.trimStart()) })} />
                  )}
                  <label className={s.toggle} style={{ fontSize: '.85rem' }}>
                    <input type="checkbox" checked={q.required} onChange={e => updateQ(i, { required: e.target.checked })} />
                    <span>חובה לענות</span>
                  </label>
                </div>
              ))}
              {questions.length < 5 && (
                <button type="button" className={s.addBtn} onClick={() => setQuestions(qs => [...qs, { id: `q${Date.now()}`, type: 'yes_no', label: '', required: true }])}>
                  + הוספת שאלה
                </button>
              )}
            </div>
          </div>
        </section>

        <section className={s.box} aria-labelledby="f-priv">
          <h2 id="f-priv">פרסום חסוי</h2>
          <label className={s.toggle}>
            <input type="checkbox" name="confidential" checked={confidential} onChange={e => setConfidential(e.target.checked)} />
            <span>לא להציג את שם העסק במשרה<small>המועמדים יראו תיאור כללי (תחום ואזור). השם שלכם יופיע להם רק כשתפנו אליהם.</small></span>
          </label>
        </section>
      </div>

      <aside className={s.aside}>
        <div className={s.preview}>
          <p className={s.previewLbl}>כך זה ייראה בלוח המשרות</p>
          <ol><li><JobCard job={preview} lx={lx} /></li></ol>
        </div>
        <div className={`${s.box} ${s.actions}`}>
          {err && <p className={s.err} role="alert">{err.error}</p>}
          {published ? (
            <button className="btn btn-primary" name="intent" value="save" disabled={pending}>{pending ? 'שומרים...' : 'שמירת השינויים'}</button>
          ) : (
            <>
              <button className="btn btn-primary" name="intent" value="publish" disabled={pending}>{pending ? 'רגע...' : orgStatus === 'approved' ? 'פרסום המשרה' : 'שליחה לאישור ופרסום'}</button>
              <button className="btn btn-ghost" name="intent" value="draft" disabled={pending}>שמירה כטיוטה</button>
            </>
          )}
          <p className={s.hint}>
            {published ? 'השינויים יופיעו במשרה באתר תוך כמה דקות.'
              : orgStatus === 'approved' ? 'המשרה עולה מיד, לחודש. חינם.'
                : 'המשרות הראשונות של עסק חדש עוברות בדיקה קצרה, בדרך כלל באותו יום. חינם.'}
          </p>
        </div>
      </aside>
    </form>
  )
}
