import { redirect } from 'next/navigation'
import { getSession, type Session } from './session'
import { EmployerError, getMe } from './source'
import type { EmployerOrg, EmployerUser } from './types'

/** The signed-in employer, or null when the session is missing or no longer valid (expired token, demo reset) */
export async function currentEmployer(): Promise<{ session: Session; user: EmployerUser; org: EmployerOrg | null } | null> {
  const session = await getSession()
  if (!session) return null
  try {
    return { session, ...await getMe(session) }
  } catch (e) {
    if (e instanceof EmployerError && e.status === 401) return null
    throw e
  }
}

/** For portal pages: signed in and with a business, or sent where they need to go */
export async function requireEmployer() {
  const me = await currentEmployer()
  if (!me) redirect('/employer/login')
  if (!me.org) redirect('/employer/onboarding')
  return { ...me, org: me.org }
}
