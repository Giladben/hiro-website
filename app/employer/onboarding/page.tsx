import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { OnboardingForm } from '@/components/employer/OnboardingForm'
import { TopBar } from '@/components/employer/TopBar'
import { currentEmployer } from '@/lib/employer/portal'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = { title: 'פרטי העסק' }

export default async function OnboardingPage() {
  const me = await currentEmployer()
  if (!me) redirect('/employer/login')
  if (me.org) redirect('/employer')
  const { session } = me
  return (
    <>
      <TopBar />
      <main id="main-content" className={s.auth}>
        <OnboardingForm email={session.email} />
      </main>
    </>
  )
}
