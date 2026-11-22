import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseQuery, toHref, withExtras } from '@/lib/jobs/query'

// Old job landing links (/jobs?category=warehouse&city=netivot) move for good to their clean path
// (/jobs/category/warehouse/city/netivot) with a 301, so Google and shared links carry over.
// Searches that don't fit a landing page (free text, several filters) stay on /jobs as they are.
export function proxy(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  if (!sp.size) return NextResponse.next()
  const raw: Record<string, string[]> = {}
  for (const k of new Set(sp.keys())) raw[k] = sp.getAll(k)
  const href = toHref(parseQuery(raw))
  if (href.split('?')[0] === '/jobs') return NextResponse.next()
  return NextResponse.redirect(new URL(withExtras(href, sp.entries()), request.url), 301)
}

export const config = { matcher: '/jobs' }
