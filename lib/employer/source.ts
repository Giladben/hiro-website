// Where employer data comes from:
// - HIRO_EMPLOYER_API_URL set → Hiro's Employer API (/api/employer/v1).
// - otherwise, outside Vercel production → the in-memory demo (./fixtures).
// - otherwise → the portal is off and its pages 404.
//
// Every function takes the session and returns the same shapes in both modes,
// so pages and actions never know which one is behind them.

import { randomUUID } from 'node:crypto'
import { DEMO_CODE, TEMPLATES, store } from './fixtures'
import type { Session } from './session'
import type { Application, ApplicationStatus, EmployerJob, EmployerOrg, EmployerUser, ForwardLog, JobInput, MessageTemplate } from './types'

const API = process.env.HIRO_EMPLOYER_API_URL?.replace(/\/$/, '')
const IS_PROD = process.env.VERCEL_ENV === 'production'

export const employerSource: 'api' | 'fixtures' | 'off' = API ? 'api' : IS_PROD ? 'off' : 'fixtures'
export const employerEnabled = employerSource !== 'off'

export class EmployerError extends Error {
  constructor(public status: number, public code: string, message: string, public field?: string) { super(message) }
}

async function api<T>(s: Session | null, method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}/api/employer/v1${path}`, {
    method,
    headers: { Accept: 'application/json', ...(body !== undefined && { 'Content-Type': 'application/json' }), ...(s?.token && { Authorization: `Bearer ${s.token}` }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  })
  const data = await res.json().catch(() => ({})) as T & { code?: string; message?: string; field?: string }
  if (!res.ok) throw new EmployerError(res.status, data.code ?? 'ERROR', data.message ?? 'משהו השתבש', data.field)
  return data
}

const now = () => new Date().toISOString()
const notFound = () => new EmployerError(404, 'NOT_FOUND', 'לא נמצא')

/** The org of the signed-in user; every demo read and write is scoped to it */
function demoOrg(s: Session) {
  const org = s.orgId ? store().orgs.get(s.orgId) : undefined
  if (!org) throw new EmployerError(401, 'NO_ORG', 'צריך להשלים את פרטי העסק')
  return org
}
function demoJob(s: Session, id: string) {
  const j = store().jobs.get(id)
  if (!j || j.orgId !== demoOrg(s).id) throw notFound()
  return j
}
function demoApp(s: Session, id: string) {
  const a = store().applications.get(id)
  if (!a) throw notFound()
  demoJob(s, a.jobId) // ownership
  return a
}
const strip = <T extends { orgId: string }>({ orgId: _, ...rest }: T) => rest // eslint-disable-line @typescript-eslint/no-unused-vars

/* ───────── Auth ───────── */

export async function requestCode(email: string): Promise<void> {
  if (employerSource === 'api') return void await api(null, 'POST', '/auth/request-code', { email })
  // Demo: the code is fixed and shown on the login screen
}

export async function verifyCode(email: string, code: string): Promise<Session> {
  if (employerSource === 'api') {
    const r = await api<{ token: string; user: EmployerUser; organization: EmployerOrg | null }>(null, 'POST', '/auth/verify', { email, code })
    return { userId: r.user.id, email: r.user.email, orgId: r.organization?.id, token: r.token }
  }
  if (code !== DEMO_CODE) throw new EmployerError(422, 'VALIDATION', 'הקוד לא נכון', 'code')
  const st = store()
  const u = st.users.get(email) ?? { id: `u-${++st.seq}`, email }
  st.users.set(email, u)
  return { userId: u.id, email, orgId: u.orgId }
}

export async function getMe(s: Session): Promise<{ user: EmployerUser; org: EmployerOrg | null }> {
  if (employerSource === 'api') {
    const r = await api<{ user: EmployerUser; organization: EmployerOrg | null }>(s, 'GET', '/me')
    return { user: r.user, org: r.organization }
  }
  const u = store().users.get(s.email)
  if (!u) throw new EmployerError(401, 'UNAUTHORIZED', 'צריך להתחבר')
  return { user: u, org: u.orgId ? store().orgs.get(u.orgId) ?? null : null }
}

export async function createOrg(s: Session, input: Pick<EmployerOrg, 'name' | 'contactName' | 'phone' | 'businessId'> & { acceptTermsVersion: string }): Promise<EmployerOrg> {
  if (employerSource === 'api') return api(s, 'POST', '/organizations', input)
  const st = store()
  const org: EmployerOrg = {
    id: `org-${++st.seq}`, name: input.name, contactName: input.contactName, phone: input.phone, businessId: input.businessId,
    notifyEmail: s.email, notify: 'instant', status: 'pending_review', reviewQuota: 3,
  }
  st.orgs.set(org.id, org)
  const u = st.users.get(s.email)
  if (u) u.orgId = org.id
  return org
}

export async function updateOrg(s: Session, patch: Partial<Pick<EmployerOrg, 'name' | 'contactName' | 'phone' | 'businessId' | 'notifyEmail' | 'notify'>>): Promise<EmployerOrg> {
  if (employerSource === 'api') return api(s, 'PATCH', '/organizations/me', patch)
  return Object.assign(demoOrg(s), patch)
}

/* ───────── Jobs ───────── */

export async function listJobs(s: Session): Promise<EmployerJob[]> {
  if (employerSource === 'api') return (await api<{ items: EmployerJob[] }>(s, 'GET', '/jobs')).items
  const org = demoOrg(s)
  return [...store().jobs.values()].filter(j => j.orgId === org.id).map(strip)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export async function getJob(s: Session, id: string): Promise<EmployerJob> {
  if (employerSource === 'api') return api(s, 'GET', `/jobs/${encodeURIComponent(id)}`)
  return strip(demoJob(s, id))
}

export async function saveJob(s: Session, id: string | null, input: JobInput): Promise<EmployerJob> {
  if (employerSource === 'api') return id ? api(s, 'PATCH', `/jobs/${encodeURIComponent(id)}`, input) : api(s, 'POST', '/jobs', input)
  if (id) return strip(Object.assign(demoJob(s, id), input))
  const st = store(), org = demoOrg(s)
  const job = { ...input, orgId: org.id, id: `ej-${++st.seq}`, jobNumber: `E-${st.seq}`, status: 'draft' as const, createdAt: now(), counts: { applications: 0, new: 0, views: 0 } }
  st.jobs.set(job.id, job)
  return strip(job)
}

/** Publish: live at once for a trusted employer, otherwise into Hiro's manual review queue */
export async function publishJob(s: Session, id: string): Promise<EmployerJob> {
  if (employerSource === 'api') return api(s, 'POST', `/jobs/${encodeURIComponent(id)}/publish`)
  const j = demoJob(s, id), org = demoOrg(s)
  if (org.status === 'approved') {
    Object.assign(j, { status: 'live', publishedAt: now(), validThrough: new Date(Date.now() + 30 * 864e5).toISOString(), slug: j.slug ?? `demo-${j.id}` })
  } else {
    j.status = 'pending_review'
  }
  return strip(j)
}

export async function closeJob(s: Session, id: string): Promise<EmployerJob> {
  if (employerSource === 'api') return api(s, 'POST', `/jobs/${encodeURIComponent(id)}/close`)
  return strip(Object.assign(demoJob(s, id), { status: 'closed' as const }))
}

export async function renewJob(s: Session, id: string): Promise<EmployerJob> {
  if (employerSource === 'api') return api(s, 'POST', `/jobs/${encodeURIComponent(id)}/renew`)
  const j = demoJob(s, id)
  return strip(Object.assign(j, { status: 'live' as const, validThrough: new Date(Date.now() + 30 * 864e5).toISOString() }))
}

export async function duplicateJob(s: Session, id: string): Promise<EmployerJob> {
  if (employerSource === 'api') return api(s, 'POST', `/jobs/${encodeURIComponent(id)}/duplicate`)
  const { id: _id, slug: _slug, jobNumber: _n, status: _st, publishedAt: _p, validThrough: _v, counts: _c, createdAt: _cr, rejectReason: _r, orgId: _o, ...input } = demoJob(s, id) // eslint-disable-line @typescript-eslint/no-unused-vars
  return saveJob(s, null, { ...input, title: `${input.title} (עותק)` })
}

/* ───────── Applications ───────── */

export async function listApplications(s: Session, jobId: string): Promise<Application[]> {
  if (employerSource === 'api') return (await api<{ items: Application[] }>(s, 'GET', `/jobs/${encodeURIComponent(jobId)}/applications?limit=200`)).items
  demoJob(s, jobId)
  return [...store().applications.values()].filter(a => a.jobId === jobId)
    .sort((a, b) => +new Date(b.submittedAt) - +new Date(a.submittedAt))
}

export async function updateApplication(s: Session, id: string, patch: { status?: ApplicationStatus; note?: string }): Promise<Application> {
  if (employerSource === 'api') return api(s, 'PATCH', `/applications/${encodeURIComponent(id)}`, patch)
  const a = demoApp(s, id)
  if (patch.status && a.status === 'new' && patch.status !== 'new') {
    const j = store().jobs.get(a.jobId)
    if (j) j.counts.new = Math.max(0, j.counts.new - 1)
  }
  return Object.assign(a, patch)
}

export async function sendMessage(s: Session, id: string, msg: { subject: string; body: string; templateId?: string }): Promise<Application> {
  if (employerSource === 'api') {
    await api(s, 'POST', `/applications/${encodeURIComponent(id)}/messages`, msg)
    return api(s, 'GET', `/applications/${encodeURIComponent(id)}`)
  }
  const a = demoApp(s, id)
  if (!a.email) throw new EmployerError(422, 'VALIDATION', 'למועמד/ת אין כתובת מייל. אפשר להתקשר בטלפון.')
  a.messages.push({ id: randomUUID(), direction: 'out', sentAt: now(), ...msg })
  return a
}

export async function forwardApplications(s: Session, input: { applicationIds: string[]; to: string; note?: string }): Promise<ForwardLog> {
  if (employerSource === 'api') return api(s, 'POST', '/applications/forward', input)
  input.applicationIds.forEach(id => demoApp(s, id))
  const log = { id: randomUUID(), sentAt: now(), orgId: demoOrg(s).id, ...input }
  store().forwards.push(log)
  return strip(log)
}

export async function listForwards(s: Session): Promise<ForwardLog[]> {
  if (employerSource === 'api') return (await api<{ items: ForwardLog[] }>(s, 'GET', '/applications/forwards')).items
  const org = demoOrg(s)
  return store().forwards.filter(f => f.orgId === org.id).map(strip).reverse()
}

export async function listTemplates(s: Session): Promise<MessageTemplate[]> {
  if (employerSource === 'api') return (await api<{ items: MessageTemplate[] }>(s, 'GET', '/message-templates')).items
  return TEMPLATES
}

/**
 * Catalogs for the job form and labels. The demo jobs use the demo catalog's
 * slugs, so in preview the portal reads that one even when the public board
 * is wired to the real API.
 */
export async function employerTaxonomy() {
  if (employerSource === 'fixtures') return (await import('@/lib/jobs/fixtures')).fixtureTaxonomy()
  return (await import('@/lib/jobs/source')).getTaxonomy()
}
