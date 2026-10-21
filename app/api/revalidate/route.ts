import { createHmac, timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'
import { JOBS_TAG } from '@/lib/jobs/source'

/** Webhook from Hiro: job.published / job.updated / job.closed / taxonomy.updated / company.updated (Notion spec, "Webhook"). */
export async function POST(req: Request) {
  // The API doc is ambiguous on the signing key ("the site's key" vs the webhook
  // secret shown on creation), so accept either until that's confirmed.
  const keys = [process.env.HIRO_WEBHOOK_SECRET, process.env.HIRO_JOBS_SITE_KEY].filter((k): k is string => !!k)
  if (!keys.length) return NextResponse.json({ message: 'Not configured' }, { status: 404 })

  const raw = await req.text()
  const sig = Buffer.from((req.headers.get('x-hiro-signature') ?? '').replace(/^sha256=/, '').toLowerCase(), 'utf8')
  const ok = keys.some(k => {
    const expected = Buffer.from(createHmac('sha256', k).update(raw).digest('hex'), 'utf8')
    return sig.length === expected.length && timingSafeEqual(sig, expected)
  })
  if (!ok) return NextResponse.json({ message: 'Bad signature' }, { status: 401 })

  // expire immediately: a closed job must not keep showing to the next visitor
  revalidateTag(JOBS_TAG, { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
