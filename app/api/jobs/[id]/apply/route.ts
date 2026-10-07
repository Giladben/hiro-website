import { NextResponse } from 'next/server'
import { jobsSource } from '@/lib/jobs/source'

const MAX = 5 * 1024 * 1024
// PDF, DOC (OLE), DOCX (zip), RTF magic bytes, so a renamed file can't slip through
const SIGNATURES = [[0x25, 0x50, 0x44, 0x46], [0xd0, 0xcf, 0x11, 0xe0], [0x50, 0x4b, 0x03, 0x04], [0x7b, 0x5c, 0x72, 0x74]]

const bad = (message: string, status = 400) => NextResponse.json({ message }, { status })

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (jobsSource === 'off') return bad('Not found', 404)
  const { id } = await params
  if (!/^[\w-]{1,80}$/.test(id)) return bad('Not found', 404)

  let form: FormData
  try { form = await req.formData() } catch { return bad('בקשה לא תקינה') }

  const fullName = String(form.get('fullName') ?? '').trim()
  const phone = String(form.get('phone') ?? '').replace(/[^\d+]/g, '')
  const email = String(form.get('email') ?? '').trim()
  const consent = form.get('consent') === 'true'
  const cv = form.get('cv')

  if (fullName.length < 2 || fullName.length > 80) return bad('צריך למלא שם מלא')
  if (!/^(\+972|0)\d{8,9}$/.test(phone)) return bad('מספר הטלפון לא תקין')
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad('כתובת האימייל לא תקינה')
  if (!consent) return bad('צריך לאשר את מדיניות הפרטיות')

  if (cv instanceof File && cv.size > 0) {
    if (cv.size > MAX) return bad('הקובץ גדול מ-5MB')
    const head = new Uint8Array(await cv.slice(0, 4).arrayBuffer())
    if (!SIGNATURES.some(sig => sig.every((b, i) => head[i] === b))) return bad('אפשר להעלות PDF או Word בלבד')
  }

  if (jobsSource === 'fixtures') {
    // Preview/dev: nothing is stored or sent anywhere.
    return NextResponse.json({ applicationId: 'preview', candidateCreated: false, preview: true }, { status: 201 })
  }

  const out = new FormData()
  out.set('fullName', fullName)
  out.set('phone', phone)
  if (email) out.set('email', email)
  out.set('consent', 'true')
  out.set('source', 'hiro.co.il')
  for (const k of ['answers', 'utm'] as const) {
    const v = form.get(k)
    if (typeof v === 'string' && v.length < 5000) out.set(k, v)
  }
  if (cv instanceof File && cv.size > 0) out.set('cv', cv, cv.name)

  const res = await fetch(`${process.env.HIRO_JOBS_API_URL!.replace(/\/$/, '')}/api/public/v1/jobs/${encodeURIComponent(id)}/applications`, {
    method: 'POST',
    headers: {
      'X-Hiro-Site-Key': process.env.HIRO_JOBS_SITE_KEY!,
      'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? '',
    },
    body: out,
  })
  const body = await res.json().catch(() => ({}))
  if (res.status === 409) return NextResponse.json({ code: 'ALREADY_APPLIED' }, { status: 409 })
  if (!res.ok) return NextResponse.json({ message: res.status === 429 ? 'יותר מדי ניסיונות. אפשר לנסות שוב בעוד כמה דקות.' : 'משהו השתבש. אפשר לנסות שוב.' }, { status: res.status === 429 ? 429 : 502 })
  return NextResponse.json({ applicationId: body.applicationId }, { status: 201 })
}
