import type { Metadata } from 'next'
import Link from 'next/link'
import { jobCommandAction } from '@/app/employer/actions'
import { StatusPill } from '@/components/employer/StatusPill'
import { requireEmployer } from '@/lib/employer/portal'
import { listJobs, employerTaxonomy, employerSource } from '@/lib/employer/source'
import type { EmployerJob } from '@/lib/employer/types'
import { labelsFrom } from '@/lib/jobs/labels'
import s from '@/components/employer/employer.module.css'

// Demo jobs aren't on the public board, so there is no page to link to
const onBoard = employerSource !== 'fixtures'

export const metadata: Metadata = { title: 'המשרות שלי' }

type Props = { searchParams: Promise<{ done?: string; job?: string }> }

/** Live and due to come down within 4 days: worth a renew button */
const expiresSoon = (j: EmployerJob, now = Date.now()) => j.status === 'live' && !!j.validThrough && +new Date(j.validThrough) - now < 4 * 864e5
const date = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'short' }) : '')

export default async function Dashboard({ searchParams }: Props) {
  const { session, org } = await requireEmployer()
  const [jobs, tax, sp] = await Promise.all([listJobs(session), employerTaxonomy(), searchParams])
  const lx = labelsFrom(tax)
  const live = jobs.filter(j => j.status === 'live')
  const done = sp.done && jobs.find(j => j.id === sp.job)

  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>המשרות שלי</h1>
          <p className={s.sub}>פרסום חינם, עד 30 יום לכל משרה. אפשר לחדש בלחיצה.</p>
        </div>
        <Link href="/employer/jobs/new" className="btn btn-primary">+ משרה חדשה</Link>
      </div>

      {done && sp.done === 'live' && (
        <div className={`${s.notice} ${s.noticeOk}`} role="status">
          <div><b>המשרה &quot;{done.title}&quot; באוויר.</b> היא תופיע בלוח המשרות של HirO ובגוגל תוך כמה דקות. נעדכן במייל על כל מועמד חדש.</div>
        </div>
      )}
      {done && sp.done === 'pending_review' && (
        <div className={`${s.notice} ${s.noticeWarn}`} role="status">
          <div><b>המשרה &quot;{done.title}&quot; נשלחה לאישור.</b> אנחנו בודקים את המשרות הראשונות של כל עסק חדש, בדרך כלל באותו יום. נעדכן במייל כשהיא עולה.</div>
        </div>
      )}
      {done && sp.done === 'saved' && (
        <div className={`${s.notice} ${s.noticeOk}`} role="status"><div><b>נשמר כטיוטה.</b> אפשר להמשיך לערוך ולפרסם מתי שרוצים.</div></div>
      )}
      {org.status === 'pending_review' && !done && (
        <div className={`${s.notice} ${s.noticeWarn}`} role="note">
          <div><b>חשבון חדש.</b> {org.reviewQuota > 1 ? `${org.reviewQuota} המשרות הראשונות שלכם` : 'המשרה הבאה שלכם'} יעברו בדיקה קצרה לפני שהן עולות. אחר כך משרות עולות מיד.</div>
        </div>
      )}
      {org.status === 'blocked' && (
        <div className={`${s.notice} ${s.noticeBad}`} role="alert"><div><b>החשבון מושהה.</b> לבירור אפשר לכתוב לנו ל-demo@hiro.co.il.</div></div>
      )}

      {!!jobs.length && (
        <dl className={s.stats}>
          <div className={s.stat}><dt>משרות באוויר</dt><dd>{live.length}</dd></div>
          <div className={s.stat}><dt>מועמדים חדשים</dt><dd>{jobs.reduce((n, j) => n + j.counts.new, 0)}</dd></div>
          <div className={s.stat}><dt>סה״כ מועמדים</dt><dd>{jobs.reduce((n, j) => n + j.counts.applications, 0)}</dd></div>
          <div className={s.stat}><dt>צפיות במשרות</dt><dd>{jobs.reduce((n, j) => n + j.counts.views, 0).toLocaleString('he-IL')}</dd></div>
        </dl>
      )}

      {jobs.length ? (
        <ul className={s.jobs}>
          {jobs.map(j => <JobRow key={j.id} job={j} city={lx.city(j.citySlug)} category={lx.category(j.categorySlug)} />)}
        </ul>
      ) : (
        <div className={s.empty}>
          <b>עוד אין משרות</b>
          <p>משרה ראשונה לוקחת כחמש דקות. המועמדים יגיעו לכאן, עם קורות החיים והתשובות לשאלות שתגדירו.</p>
          <Link href="/employer/jobs/new" className="btn btn-primary">פרסום משרה ראשונה</Link>
        </div>
      )}
    </>
  )
}

function JobRow({ job: j, city, category }: { job: EmployerJob; city: string; category: string }) {
  const soon = expiresSoon(j)
  return (
    <li className={s.job}>
      <div>
        <h2 className={s.jobTitle}>
          <Link href={j.status === 'draft' || j.status === 'rejected' ? `/employer/jobs/${j.id}/edit` : `/employer/jobs/${j.id}`}>{j.title}</Link>
          <StatusPill status={j.status} />
        </h2>
        <p className={s.jobMeta}>
          <span>{category} · {city}</span>
          <span dir="ltr">{j.jobNumber}</span>
          {j.status === 'live' && <span>פורסמה {date(j.publishedAt)} · {soon ? <b>יורדת {date(j.validThrough)}</b> : <>עד {date(j.validThrough)}</>}</span>}
          {j.status === 'draft' && <span>נוצרה {date(j.createdAt)}</span>}
          {j.status === 'rejected' && j.rejectReason && <span>סיבה: {j.rejectReason}</span>}
        </p>
      </div>
      <div className={s.jobSide}>
        {j.status !== 'draft' && (
          <Link href={`/employer/jobs/${j.id}`} className={s.count}>
            {j.counts.applications} <em>מועמדים</em>
            {j.counts.new > 0 && <span className={s.newDot}>{j.counts.new} חדשים</span>}
          </Link>
        )}
        {j.status === 'draft' && (
          <form action={jobCommandAction}>
            <input type="hidden" name="id" value={j.id} />
            <button name="command" value="publish" className={`btn btn-primary ${s.small}`}>פרסום</button>
          </form>
        )}
        {soon && (
          <form action={jobCommandAction}>
            <input type="hidden" name="id" value={j.id} />
            <button name="command" value="renew" className={`btn btn-ghost ${s.small}`}>חידוש ל-30 יום</button>
          </form>
        )}
        <details className={s.menu}>
          <summary aria-label={`פעולות למשרה ${j.title}`}>⋯</summary>
          <div className={s.menuList}>
            <Link href={`/employer/jobs/${j.id}/edit`}>עריכה</Link>
            {j.status === 'live' && j.slug && onBoard && <a href={`/jobs/${j.slug}`} target="_blank" rel="noopener">צפייה במשרה באתר</a>}
            <form action={jobCommandAction}>
              <input type="hidden" name="id" value={j.id} />
              <button name="command" value="duplicate">שכפול</button>
              {j.status === 'live' && <button name="command" value="close">סגירת המשרה</button>}
              {j.status === 'closed' && <button name="command" value="renew">פתיחה מחדש ל-30 יום</button>}
            </form>
          </div>
        </details>
      </div>
    </li>
  )
}
