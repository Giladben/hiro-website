import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { parsePath, parseQuery } from '@/lib/jobs/query'
import { getTaxonomy, jobsEnabled } from '@/lib/jobs/source'
import type { JobsQuery } from '@/lib/jobs/types'
import { JobsListing, type RawParams, jobsMetadata, redirectTarget } from '../../listing'

// Clean landing paths: /jobs/category/<slug>, /jobs/city/<slug>, /jobs/category/<slug>/city/<slug> ...
// (the first segment shares the [slug] position with job pages; a job page never has a second segment)
type Props = { params: Promise<{ slug: string; rest: string[] }>; searchParams: Promise<RawParams> }

async function resolve({ params, searchParams }: Props) {
  const { slug, rest } = await params
  const part = parsePath([slug, ...rest])
  if (!part) return null
  const raw = await searchParams
  const q: JobsQuery = { ...parseQuery(raw) }
  // the path's field/place, plus any of the same kind still in the query string
  for (const [k, v] of Object.entries(part) as [keyof JobsQuery, string[]][]) {
    q[k] = [...new Set([...v, ...((q[k] as string[] | undefined) ?? [])])] as never
  }
  return { q, raw, path: `/jobs/${[slug, ...rest].join('/')}` }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  const r = await resolve(props)
  return r ? jobsMetadata(r.q) : {}
}

export default async function JobsLandingPage(props: Props) {
  if (!jobsEnabled) notFound()
  const r = await resolve(props)
  if (!r) notFound()
  const tax = await getTaxonomy()
  const to = redirectTarget(r.q, tax, r.path, r.raw)
  if (to) permanentRedirect(to)
  return <JobsListing q={r.q} tax={tax} />
}
