'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import s from './employer.module.css'

const LINKS = [
  { href: '/employer', label: 'המשרות שלי', match: (p: string) => p === '/employer' || (/^\/employer\/jobs\/[^/]+$/.test(p) && !p.endsWith('/new')) },
  { href: '/employer/jobs/new', label: 'משרה חדשה', match: (p: string) => p === '/employer/jobs/new' },
  { href: '/employer/settings', label: 'הגדרות', match: (p: string) => p.startsWith('/employer/settings') },
]

export function PortalNav() {
  const path = usePathname()
  return (
    <nav className={s.nav} aria-label="אזור המעסיקים">
      {LINKS.map(l => <Link key={l.href} href={l.href} aria-current={l.match(path) ? 'page' : undefined}>{l.label}</Link>)}
    </nav>
  )
}
