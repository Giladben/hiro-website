import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Employer session: an HMAC-signed cookie holding who is signed in and, once
// the Employer API is live, Hiro's bearer token. httpOnly, so the browser
// never sees the token and never calls Hiro directly.

const COOKIE = 'hiro_employer'
const MAX_AGE = 60 * 60 * 24 * 14

export type Session = { userId: string; email: string; orgId?: string; token?: string }

function secret() {
  const s = process.env.EMPLOYER_SESSION_SECRET
  if (s) return s
  if (process.env.VERCEL_ENV === 'production') throw new Error('EMPLOYER_SESSION_SECRET is not set')
  return 'dev-only-employer-session-secret'
}

const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url')

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(COOKIE)?.value
  if (!raw) return null
  const [payload, sig] = raw.split('.')
  if (!payload || !sig) return null
  const a = Buffer.from(sig), b = Buffer.from(sign(payload))
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session } catch { return null }
}

/** Only from Server Actions / Route Handlers */
export async function setSession(s: Session) {
  const payload = Buffer.from(JSON.stringify(s)).toString('base64url')
  ;(await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE,
  })
}

export async function clearSession() {
  (await cookies()).delete(COOKIE)
}
