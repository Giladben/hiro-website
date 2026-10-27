import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { employerEnabled, employerSource } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

// The portal is private: never indexed, never in the sitemap
export const metadata: Metadata = {
  title: { default: 'אזור המעסיקים', template: '%s | אזור המעסיקים | HirO' },
  robots: { index: false, follow: false },
}

export default function EmployerRoot({ children }: { children: React.ReactNode }) {
  if (!employerEnabled) notFound()
  return (
    <div className={s.shell}>
      {employerSource === 'fixtures' && (
        <p className={s.demo} role="note">מצב הדגמה: נתונים בדויים, שום מייל לא נשלח באמת, ושינויים עשויים להתאפס.</p>
      )}
      {children}
    </div>
  )
}
