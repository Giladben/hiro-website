import Link from 'next/link'
import { logoutAction } from '@/app/employer/actions'
import { PortalNav } from './PortalNav'
import s from './employer.module.css'

export function TopBar({ orgName }: { orgName?: string }) {
  return (
    <header className={s.top}>
      <div className={`wrap ${s.topIn}`}>
        <Link href={orgName ? '/employer' : '/employers'} className={s.logo} aria-label="HirO, אזור המעסיקים">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
          <img src="/images/hiro-lockup.svg" alt="HirO" width={86} height={26} />
          <span>מעסיקים</span>
        </Link>
        {orgName ? <PortalNav /> : <span style={{ flex: 1 }} />}
        {orgName && (
          <div className={s.who}>
            <b title={orgName}>{orgName}</b>
            <form action={logoutAction}><button className={s.linkish}>יציאה</button></form>
          </div>
        )}
      </div>
    </header>
  )
}
