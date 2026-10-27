import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/employer/LoginForm'
import { TopBar } from '@/components/employer/TopBar'
import { DEMO_CODE, DEMO_EMAIL } from '@/lib/employer/fixtures'
import { currentEmployer } from '@/lib/employer/portal'
import { employerSource } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = { title: 'כניסה' }

export default async function LoginPage() {
  // Only a session that still works skips the login; a stale cookie just shows the form
  const me = await currentEmployer()
  if (me) redirect(me.org ? '/employer' : '/employer/onboarding')
  return (
    <>
      <TopBar />
      <main id="main-content" className={s.auth}>
        <LoginForm demo={employerSource === 'fixtures' ? { email: DEMO_EMAIL, code: DEMO_CODE } : undefined} />
      </main>
    </>
  )
}
