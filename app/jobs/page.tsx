import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { parseQuery } from '@/lib/jobs/query'
import { getTaxonomy, jobsEnabled } from '@/lib/jobs/source'
import { JobsListing, type RawParams, jobsMetadata, redirectTarget } from './listing'

type Props = { searchParams: Promise<RawParams> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  return jobsMetadata(parseQuery(await searchParams))
}

export default async function JobsPage({ searchParams }: Props) {
  if (!jobsEnabled) notFound()
  const raw = await searchParams
  const q = parseQuery(raw)
  const tax = await getTaxonomy()
  // proxy.ts already 301s old landing links (?category=...) to their clean path; this catches the rest
  const to = redirectTarget(q, tax, '/jobs', raw)
  if (to) permanentRedirect(to)
  return <JobsListing q={q} tax={tax} />
}
