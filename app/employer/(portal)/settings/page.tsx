import type { Metadata } from 'next'
import { SettingsForm } from '@/components/employer/SettingsForm'
import { requireEmployer } from '@/lib/employer/portal'
import { listForwards } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = { title: 'הגדרות' }

export default async function SettingsPage() {
  const { session, org } = await requireEmployer()
  const forwards = await listForwards(session)
  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>הגדרות</h1>
          <p className={s.sub}>מחוברים כ-<span dir="ltr">{session.email}</span></p>
        </div>
      </div>
      <div className={s.form}>
        <div className={s.formMain}>
          <SettingsForm org={org} />
          <section className={s.box} aria-labelledby="fw-log">
            <h2 id="fw-log">יומן העברות קורות חיים</h2>
            {forwards.length ? (
              <ul className={s.thread}>
                {forwards.map(f => (
                  <li key={f.id} className={s.msg}>
                    <b>{f.applicationIds.length === 1 ? 'קורות חיים אחד' : `${f.applicationIds.length} קורות חיים`} ← <span dir="ltr">{f.to}</span></b>
                    {f.note && <p>{f.note}</p>}
                    <time dateTime={f.sentAt}>{new Date(f.sentAt).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' })}</time>
                  </li>
                ))}
              </ul>
            ) : <p className={s.hint}>עוד לא הועברו קורות חיים. כל העברה תירשם כאן.</p>}
          </section>
        </div>
        <aside className={s.aside}>
          <div className={s.box}>
            <h2>פרטיות המועמדים</h2>
            <p className={s.hint} style={{ fontSize: '.88rem' }}>
              לפי <a href="/terms" className="link-u" target="_blank">תנאי השימוש</a>, מידע על מועמדים משמש רק לגיוס למשרה שאליה הגישו.
              הגשות נמחקות 12 חודשים אחרי שהמשרה נסגרת.
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
