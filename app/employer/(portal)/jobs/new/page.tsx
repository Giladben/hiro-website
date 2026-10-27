import type { Metadata } from 'next'
import Link from 'next/link'
import { JobForm } from '@/components/employer/JobForm'
import { requireEmployer } from '@/lib/employer/portal'
import { employerTaxonomy } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = { title: 'משרה חדשה' }

export default async function NewJobPage() {
  const [{ org }, taxonomy] = await Promise.all([requireEmployer(), employerTaxonomy()])
  return (
    <>
      <Link href="/employer" className={s.back}>→ המשרות שלי</Link>
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>משרה חדשה</h1>
          <p className={s.sub}>פרסום חינם בלוח המשרות של HirO ובגוגל. המועמדים יגיעו אליכם לאזור הזה.</p>
        </div>
      </div>
      <JobForm taxonomy={taxonomy} orgName={org.name} orgStatus={org.status} />
    </>
  )
}
