import { NextResponse } from 'next/server'
import { getJob, jobsSource } from '@/lib/jobs/source'

const MAX = 5 * 1024 * 1024
// PDF, DOC (OLE) and DOCX (zip) magic bytes, so a renamed file can't slip through
const SIGNATURES = [[0x25, 0x50, 0x44, 0x46], [0xd0, 0xcf, 0x11, 0xe0], [0x50, 0x4b, 0x03, 0x04]]

const invalid = (field: string, message: string) => NextResponse.json({ code: 'VALIDATION', field, message }, { status: 422 })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (jobsSource === 'off') return NextResponse.json({ message: 'Not found' }, { status: 404 })
  const { id } = await params
  if (!/^[\w-]{1,80}$/.test(id)) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  let form: FormData
  try { form = await req.formData() } catch { return NextResponse.json({ message: 'בקשה לא תקינה' }, { status: 400 }) }

  // Honeypot: bots fill every field. Pretend success so they don't retry.
  if (String(form.get('website') ?? '').trim()) return NextResponse.json({ applicationId: 'ok' }, { status: 201 })

  const fullName = String(form.get('fullName') ?? '').trim()
  const phone = String(form.get('phone') ?? '').replace(/[^\d+]/g, '').replace(/^\+972/, '0')
  const email = String(form.get('email') ?? '').trim()
  const consent = form.get('consent') === 'true'
  const cv = form.get('cv')

  if (fullName.length < 2 || fullName.length > 80) return invalid('fullName', 'צריך למלא שם מלא')
  if (!/^0\d{8,9}$/.test(phone)) return invalid('phone', 'מספר הטלפון לא תקין')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return invalid('email', 'כתובת האימייל לא תקינה')
  if (!consent) return invalid('consent', 'צריך לאשר את מדיניות הפרטיות')
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX) return invalid('cv', 'הקובץ גדול מ-5MB')
    const head = new Uint8Array(await cv.slice(0, 4).arrayBuffer())
    if (!SIGNATURES.some(sig => sig.every((b, i) => head[i] === b))) return invalid('cv', 'אפשר להעלות PDF או Word בלבד')
  }

  let optIns = { otherJobs: false, candidatePool: false }
  try {
    const o = JSON.parse(String(form.get('optIns') ?? '{}'))
    optIns = { otherJobs: o.otherJobs === true, candidatePool: o.candidatePool === true }
  } catch { /* defaults: both off */ }

  if (jobsSource === 'fixtures') {
    // Preview/dev: nothing is stored or sent anywhere. Mirror the API's closed-job check.
    const job = await getJob(id)
    if (!job) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    if (job.status === 'closed') return NextResponse.json({ code: 'JOB_CLOSED' }, { status: 410 })
    return NextResponse.json({ applicationId: 'preview', preview: true }, { status: 201 })
  }

  const out = new FormData()
  out.set('fullName', fullName)
  out.set('phone', phone)
  if (email) out.set('email', email)
  out.set('consent', 'true')
  out.set('optIns', JSON.stringify(optIns))
  for (const k of ['answers', 'utm'] as const) {
    const v = form.get(k)
    if (typeof v === 'string' && v.length < 5000) out.set(k, v)
  }
  if (cv instanceof File && cv.size > 0) out.set('cv', cv, cv.name)

  let res: Response
  try {
    res = await fetch(`${process.env.HIRO_JOBS_API_URL!.replace(/\/$/, '')}/api/public/v1/jobs/${encodeURIComponent(id)}/applications`, {
      method: 'POST',
      headers: { 'X-Hiro-Site-Key': process.env.HIRO_JOBS_SITE_KEY!, 'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? '' },
      body: out,
      signal: AbortSignal.timeout(20000),
    })
  } catch {
    return NextResponse.json({ message: 'השרת לא הגיב. אפשר לנסות שוב בעוד רגע.' }, { status: 504 })
  }

  const body = await res.json().catch(() => ({})) as { applicationId?: string; field?: string; message?: string }
  switch (res.status) {
    case 201: case 200: return NextResponse.json({ applicationId: body.applicationId }, { status: 201 })
    case 409: return NextResponse.json({ code: 'ALREADY_APPLIED' }, { status: 409 })
    case 410: return NextResponse.json({ code: 'JOB_CLOSED' }, { status: 410 })
    case 422: return invalid(body.field ?? '', body.message ?? 'אחד השדות לא תקין')
    case 429: return NextResponse.json({ code: 'RATE_LIMITED', message: 'יותר מדי ניסיונות. אפשר לנסות שוב בעוד כמה דקות.' }, { status: 429 })
    default: return NextResponse.json({ message: 'משהו השתבש. אפשר לנסות שוב.' }, { status: 502 })
  }
}
