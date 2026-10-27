import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JobForm } from '@/components/employer/JobForm'
import { StatusPill } from '@/components/employer/StatusPill'
import { requireEmployer } from '@/lib/employer/portal'
import { EmployerError, getJob, employerTaxonomy } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = { title: 'עריכת משרה' }

type Props = { params: Promise<{ id: string }> }

export default async function EditJobPage({ params }: Props) {
  const { id } = await params
  const [{ session, org }, taxonomy] = await Promise.all([requireEmployer(), employerTaxonomy()])
  const job = await getJob(session, id).catch(e => { if (e instanceof EmployerError && e.status === 404) notFound(); throw e })
  return (
    <>
      <Link href={job.status === 'draft' ? '/employer' : `/employer/jobs/${job.id}`} className={s.back}>→ {job.status === 'draft' ? 'המשרות שלי' : 'המועמדים למשרה'}</Link>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>עריכת משרה</h1>
          <p className={s.sub}><StatusPill status={job.status} /> <span dir="ltr">{job.jobNumber}</span></p>
        </div>
      </div>
      {job.status === 'rejected' && job.rejectReason && (
        <div className={`${s.notice} ${s.noticeBad}`} role="note"><div><b>המשרה לא אושרה:</b> {job.rejectReason}. אפשר לתקן ולשלוח שוב.</div></div>
      )}
      <JobForm job={job} taxonomy={taxonomy} orgName={org.name} orgStatus={org.status} />
    </>
  )
}
