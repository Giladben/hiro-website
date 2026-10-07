import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { JOBS_TAG } from '@/lib/jobs/source'

/** Webhook from Hiro on job.published / job.updated / job.closed (see docs/HIRO_PUBLIC_JOBS_API.md §6). */
export async function POST(req: Request) {
  const secret = process.env.HIRO_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ message: 'Not configured' }, { status: 404 })

  const raw = await req.text()
  const sig = req.headers.get('x-hiro-signature') ?? ''
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(sig, 'utf8')
  const b = Buffer.from(expected, 'utf8')
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ message: 'Bad signature' }, { status: 401 })

  // expire immediately: a closed job must not keep showing to the next visitor
  revalidateTag(JOBS_TAG, { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
