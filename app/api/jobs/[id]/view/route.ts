import { NextResponse } from 'next/server'
import { jobsSource } from '@/lib/jobs/source'

/** Forwards a page view to Hiro (POST /api/public/v1/jobs/{id}/view). Best effort, never blocks the page. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (jobsSource !== 'api' || !/^[\w-]{1,80}$/.test(id)) return new NextResponse(null, { status: 204 })
  const raw = await req.text().catch(() => '')
  const body = raw.length < 2000 ? raw : '{}'
  try {
    await fetch(`${process.env.HIRO_JOBS_API_URL!.replace(/\/$/, '')}/api/public/v1/jobs/${encodeURIComponent(id)}/view`, {
      method: 'POST',
      headers: {
        'X-Hiro-Site-Key': process.env.HIRO_JOBS_SITE_KEY!,
        'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? '',
        'User-Agent': req.headers.get('user-agent') ?? '',
        'Content-Type': 'application/json',
      },
      body,
      signal: AbortSignal.timeout(3000),
    })
  } catch { /* views are best effort */ }
  return new NextResponse(null, { status: 204 })
}
