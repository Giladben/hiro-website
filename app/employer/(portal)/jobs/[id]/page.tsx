import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { jobCommandAction } from '@/app/employer/actions'
import { ApplicantsBoard } from '@/components/employer/ApplicantsBoard'
import { StatusPill } from '@/components/employer/StatusPill'
import { requireEmployer } from '@/lib/employer/portal'
import { EmployerError, getJob, listApplications, listTemplates, employerTaxonomy, employerSource } from '@/lib/employer/source'
import { labelsFrom } from '@/lib/jobs/labels'
import s from '@/components/employer/employer.module.css'

// Demo jobs aren't on the public board, so there is no page to link to
const onBoard = employerSource !== 'fixtures'

export const metadata: Metadata = { title: 'מועמדים' }

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ a?: string }> }

export default async function ApplicantsPage({ params, searchParams }: Props) {
  const [{ id }, { a }] = await Promise.all([params, searchParams])
  const { session, org } = await requireEmployer()
  const job = await getJob(session, id).catch(e => { if (e instanceof EmployerError && e.status === 404) notFound(); throw e })
  const [applications, templates, tax] = await Promise.all([listApplications(session, id), listTemplates(session), employerTaxonomy()])
  const lx = labelsFrom(tax)

  return (
    <>
      <Link href="/employer" className={s.back}>→ המשרות שלי</Link>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>{job.title}</h1>
          <p className={s.sub}>
            <StatusPill status={job.status} /> · {lx.category(job.categorySlug)} · {lx.city(job.citySlug)} · <span dir="ltr">{job.jobNumber}</span>
            {job.status === 'live' && <> · {job.counts.views.toLocaleString('he-IL')} צפיות</>}
          </p>
        </div>
        <div className={s.row}>
          {job.status === 'live' && job.slug && onBoard && <a href={`/jobs/${job.slug}`} target="_blank" rel="noopener" className={`btn btn-ghost ${s.small}`}>צפייה באתר ↗</a>}
          <Link href={`/employer/jobs/${job.id}/edit`} className={`btn btn-ghost ${s.small}`}>עריכה</Link>
          {job.status === 'live' && (
            <form action={jobCommandAction}>
              <input type="hidden" name="id" value={job.id} />
              <button name="command" value="close" className={`btn btn-ghost ${s.small}`}>סגירה</button>
            </form>
          )}
        </div>
      </div>

      {job.status === 'pending_review' && (
        <div className={`${s.notice} ${s.noticeWarn}`} role="note"><div><b>המשרה ממתינה לאישור.</b> ברגע שתאושר היא תעלה לאתר, והמועמדים יופיעו כאן.</div></div>
      )}

      {applications.length ? (
        <ApplicantsBoard job={{ id: job.id, title: job.title }} orgName={org.name} applications={applications} templates={templates} initialId={a} />
      ) : (
        <div className={s.empty}>
          <b>עוד אין מועמדים</b>
          <p>{job.status === 'live' ? 'המשרה באוויר. נשלח מייל ל-' + org.notifyEmail + ' על כל מועמד חדש.' : 'כשהמשרה תעלה לאוויר, המועמדים יופיעו כאן.'}</p>
          {job.status === 'live' && job.slug && onBoard && <a href={`/jobs/${job.slug}`} target="_blank" rel="noopener" className="btn btn-ghost">צפייה במשרה באתר</a>}
        </div>
      )}
    </>
  )
}
