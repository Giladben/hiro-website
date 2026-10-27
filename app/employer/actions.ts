'use server'

import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'
import { TERMS_VERSION } from '@/lib/legal'
import {
  EmployerError, closeJob, createOrg, duplicateJob, employerEnabled, forwardApplications, publishJob, renewJob,
  requestCode, saveJob, sendMessage, updateApplication, updateOrg, verifyCode,
} from '@/lib/employer/source'
import { clearSession, getSession, setSession, type Session } from '@/lib/employer/session'
import type { ActionResult, ApplicationStatus, EmployerQuestion, JobInput } from '@/lib/employer/types'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const str = (fd: FormData, k: string) => String(fd.get(k) ?? '').trim()
const fail = (error: string, field?: string): ActionResult => ({ ok: false, error, field })

async function requireSession(): Promise<Session> {
  if (!employerEnabled) redirect('/')
  const s = await getSession()
  if (!s) redirect('/employer/login')
  return s
}

/** Turn API errors into form errors; anything else is a bug and should surface */
function asResult(e: unknown): ActionResult {
  if (e instanceof EmployerError) {
    if (e.status === 401) redirect('/employer/login')
    if (e.status === 429) return fail('יותר מדי פעולות בזמן קצר. אפשר לנסות שוב בעוד כמה דקות.')
    return fail(e.message, e.field)
  }
  throw e
}

/* ───────── Sign-in ───────── */

export type LoginState = ActionResult & { step?: 'email' | 'code'; email?: string }

export async function loginAction(_: LoginState, fd: FormData): Promise<LoginState> {
  const email = str(fd, 'email').toLowerCase()
  if (!EMAIL.test(email)) return { ...fail('כתובת המייל לא תקינה', 'email'), step: 'email' }
  const code = str(fd, 'code')
  if (!code) {
    try { await requestCode(email) } catch (e) { return { ...asResult(e), step: 'email' } }
    return { ok: true, step: 'code', email }
  }
  if (!/^\d{6}$/.test(code)) return { ...fail('הקוד הוא 6 ספרות', 'code'), step: 'code', email }
  let session: Session
  try { session = await verifyCode(email, code) } catch (e) { return { ...asResult(e), step: 'code', email } }
  await setSession(session)
  redirect(session.orgId ? '/employer' : '/employer/onboarding')
}

export async function logoutAction() {
  await clearSession()
  redirect('/employer/login')
}

export async function onboardingAction(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const s = await requireSession()
  const name = str(fd, 'name'), contactName = str(fd, 'contactName')
  const phone = str(fd, 'phone').replace(/[^\d+]/g, '').replace(/^\+972/, '0')
  const businessId = str(fd, 'businessId') || undefined
  if (name.length < 2) return fail('צריך למלא את שם העסק', 'name')
  if (contactName.length < 2) return fail('צריך למלא שם איש/אשת קשר', 'contactName')
  if (!/^0\d{8,9}$/.test(phone)) return fail('מספר הטלפון לא תקין', 'phone')
  if (businessId && !/^\d{8,9}$/.test(businessId)) return fail('מספר העסק (ח.פ / ע.מ) הוא 8–9 ספרות', 'businessId')
  if (fd.get('terms') !== 'on') return fail('צריך לאשר את תנאי השימוש', 'terms')
  try {
    const org = await createOrg(s, { name, contactName, phone, businessId, acceptTermsVersion: TERMS_VERSION })
    await setSession({ ...s, orgId: org.id })
  } catch (e) { return asResult(e) }
  redirect('/employer/jobs/new')
}

/* ───────── Jobs ───────── */

const escapeHtml = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
/** Plain text from the form → paragraphs; the API stores the same HTML subset the board renders */
const toHtml = (t: string) => t.split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('')
const lines = (t: string) => t.split('\n').map(l => l.replace(/^[\s\-–•*]+/, '').trim()).filter(Boolean).slice(0, 15)
const num = (t: string) => (t && Number.isFinite(Number(t)) ? Number(t) : undefined)

function parseJob(fd: FormData): JobInput | ActionResult {
  const title = str(fd, 'title')
  const description = str(fd, 'description')
  const employmentType = fd.getAll('employmentType').map(String).filter(Boolean)
  if (title.length < 3 || title.length > 80) return fail('כותרת המשרה צריכה להיות 3–80 תווים', 'title')
  if (!str(fd, 'categorySlug')) return fail('צריך לבחור תחום', 'categorySlug')
  if (!str(fd, 'citySlug')) return fail('צריך לבחור עיר', 'citySlug')
  if (!employmentType.length) return fail('צריך לבחור היקף משרה', 'employmentType')
  if (description.length < 40) return fail('כדאי לכתוב לפחות שני משפטים על התפקיד', 'description')
  if (/https?:\/\/|www\./i.test(description)) return fail('אי אפשר לשים קישורים בתיאור. המועמדים מגישים דרך HirO.', 'description')

  const min = num(str(fd, 'salaryMin')), max = num(str(fd, 'salaryMax'))
  if (min != null && max != null && min > max) return fail('השכר המינימלי גבוה מהמקסימלי', 'salaryMin')
  const period = str(fd, 'salaryPeriod') === 'hour' ? 'hour' : 'month'

  let questions: EmployerQuestion[] = []
  try {
    const raw = JSON.parse(str(fd, 'questions') || '[]') as EmployerQuestion[]
    questions = raw.slice(0, 5).map((q, i): EmployerQuestion => ({
      id: q.id || `q${i + 1}`,
      type: q.type === 'text' || q.type === 'choice' ? q.type : 'yes_no',
      label: String(q.label ?? '').trim().slice(0, 140),
      required: q.required === true,
      ...(q.type === 'choice' && { options: (q.options ?? []).map(o => String(o).trim()).filter(Boolean).slice(0, 8) }),
    })).filter(q => q.label)
  } catch { return fail('שאלות הסינון לא נשמרו. אפשר לנסות שוב.', 'questions') }
  if (questions.some(q => q.type === 'choice' && (q.options?.length ?? 0) < 2)) return fail('שאלת בחירה צריכה לפחות שתי אפשרויות', 'questions')

  return {
    title, description: toHtml(description),
    categorySlug: str(fd, 'categorySlug'), citySlug: str(fd, 'citySlug'), employmentType,
    workModel: str(fd, 'workModel') || 'onsite',
    hoursDescription: str(fd, 'hoursDescription') || undefined,
    salary: min != null || max != null ? { min, max, currency: 'ILS', period } : undefined,
    publishSalary: fd.get('publishSalary') === 'on',
    requirements: lines(str(fd, 'requirements')), benefits: lines(str(fd, 'benefits')),
    noExperience: fd.get('noExperience') === 'on',
    experienceYearsMin: num(str(fd, 'experienceYearsMin')),
    suitableFor: fd.getAll('suitableFor').map(String),
    requiresCv: fd.get('requiresCv') === 'on',
    questions,
    confidential: fd.get('confidential') === 'on',
  }
}

export async function saveJobAction(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const s = await requireSession()
  const input = parseJob(fd)
  if ('ok' in input) return input
  const id = str(fd, 'id') || null
  let saved
  try {
    saved = await saveJob(s, id, input)
    if (fd.get('intent') === 'publish') saved = await publishJob(s, saved.id)
  } catch (e) { return asResult(e) }
  redirect(`/employer?${new URLSearchParams({ done: fd.get('intent') === 'publish' ? saved.status : 'saved', job: saved.id })}`)
}

export async function jobCommandAction(fd: FormData) {
  const s = await requireSession()
  const id = str(fd, 'id'), command = str(fd, 'command')
  if (command === 'duplicate') {
    const copy = await duplicateJob(s, id)
    redirect(`/employer/jobs/${copy.id}/edit`)
  }
  if (command === 'close') await closeJob(s, id)
  else if (command === 'renew') await renewJob(s, id)
  else if (command === 'publish') await publishJob(s, id)
  refresh()
}

/* ───────── Applicants ───────── */

const STATUSES: ApplicationStatus[] = ['new', 'reviewed', 'shortlisted', 'rejected']

export async function updateApplicationAction(id: string, patch: { status?: ApplicationStatus; note?: string }): Promise<ActionResult> {
  const s = await requireSession()
  if (patch.status && !STATUSES.includes(patch.status)) return fail('סטטוס לא מוכר')
  try { await updateApplication(s, id, { ...patch, ...(patch.note !== undefined && { note: patch.note.slice(0, 1000) }) }) } catch (e) { return asResult(e) }
  refresh()
  return { ok: true }
}

export async function sendMessageAction(id: string, msg: { subject: string; body: string; templateId?: string }): Promise<ActionResult> {
  const s = await requireSession()
  const subject = msg.subject.trim().slice(0, 150), body = msg.body.trim().slice(0, 5000)
  if (!subject) return fail('צריך נושא למייל', 'subject')
  if (body.length < 5) return fail('המייל ריק', 'body')
  try { await sendMessage(s, id, { subject, body, templateId: msg.templateId }) } catch (e) { return asResult(e) }
  refresh()
  return { ok: true, message: 'המייל נשלח' }
}

export async function forwardAction(input: { applicationIds: string[]; to: string; note?: string }): Promise<ActionResult> {
  const s = await requireSession()
  const to = input.to.trim().toLowerCase()
  if (!EMAIL.test(to)) return fail('כתובת המייל לא תקינה', 'to')
  if (!input.applicationIds.length) return fail('לא נבחרו מועמדים')
  if (input.applicationIds.length > 200) return fail('אפשר להעביר עד 200 מועמדים בבת אחת')
  try { await forwardApplications(s, { applicationIds: input.applicationIds, to, note: input.note?.trim().slice(0, 1000) || undefined }) } catch (e) { return asResult(e) }
  const n = input.applicationIds.length
  return { ok: true, message: n === 1 ? `קורות החיים נשלחו ל-${to}` : `${n} קורות חיים נשלחו ל-${to}${n > 10 ? ' (בקישור מאובטח לקובץ אחד)' : ''}` }
}

/* ───────── Settings ───────── */

export async function settingsAction(_: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const s = await requireSession()
  const notifyEmail = str(fd, 'notifyEmail').toLowerCase()
  if (!EMAIL.test(notifyEmail)) return fail('כתובת המייל לא תקינה', 'notifyEmail')
  const notify = str(fd, 'notify')
  try {
    await updateOrg(s, {
      name: str(fd, 'name') || undefined, contactName: str(fd, 'contactName') || undefined, phone: str(fd, 'phone') || undefined,
      notifyEmail, notify: notify === 'daily' || notify === 'off' ? notify : 'instant',
    })
  } catch (e) { return asResult(e) }
  refresh()
  return { ok: true, message: 'נשמר' }
}
