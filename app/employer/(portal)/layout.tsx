import { TopBar } from '@/components/employer/TopBar'
import { requireEmployer } from '@/lib/employer/portal'
import s from '@/components/employer/employer.module.css'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { org } = await requireEmployer()
  return (
    <>
      <TopBar orgName={org.name} />
      <main id="main-content" tabIndex={-1} className={s.main}>
        <div className="wrap">{children}</div>
      </main>
    </>
  )
}
