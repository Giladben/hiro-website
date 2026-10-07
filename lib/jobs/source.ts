import { FIXTURE_JOBS, fixtureTaxonomy } from './fixtures'
import { labelsFrom } from './labels'
import type { FacetKey, FacetValue, JobDetail, JobSummary, JobsPage, JobsQuery, Taxonomy } from './types'

/**
 * Where job data comes from:
 * - HIRO_JOBS_API_URL + HIRO_JOBS_SITE_KEY set → the real Public Jobs API.
 * - otherwise, outside Vercel production → fictional fixtures (dev + previews).
 * - otherwise (production with no API) → jobs are disabled; pages 404.
 */
const API = process.env.HIRO_JOBS_API_URL?.replace(/\/$/, '')
const KEY = process.env.HIRO_JOBS_SITE_KEY
const IS_PROD = process.env.VERCEL_ENV === 'production'

export const jobsSource: 'api' | 'fixtures' | 'off' = API && KEY ? 'api' : IS_PROD ? 'off' : 'fixtures'
export const jobsEnabled = jobsSource !== 'off'

export const JOBS_TAG = 'jobs'
const REVALIDATE = 300

async function api<T>(path: string, params?: URLSearchParams): Promise<T | null> {
  const url = `${API}/api/public/v1${path}${params && [...params].length ? `?${params}` : ''}`
  const res = await fetch(url, {
    headers: { 'X-Hiro-Site-Key': KEY!, Accept: 'application/json' },
    next: { revalidate: REVALIDATE, tags: [JOBS_TAG] },
  })
  if (res.status === 404 || res.status === 410) return null
  if (!res.ok) throw new Error(`Hiro jobs API ${res.status} on ${path}`)
  return res.json() as Promise<T>
}

function toParams(q: JobsQuery) {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(q)) {
    if (v == null || v === '' || v === false) continue
    if (Array.isArray(v)) v.forEach(x => p.append(k, String(x)))
    else p.set(k, String(v))
  }
  p.set('facets', 'true')
  return p
}

/* ───────────────────────── Public functions ───────────────────────── */

export async function listJobs(q: JobsQuery): Promise<JobsPage> {
  if (jobsSource === 'api') return (await api<JobsPage>('/jobs', toParams(q)))!
  return fixtureSearch(q)
}

export async function getJob(slugOrId: string): Promise<JobDetail | null> {
  if (jobsSource === 'api') {
    const r = await api<{ data: JobDetail }>(`/jobs/${encodeURIComponent(slugOrId)}`)
    return r?.data ?? null
  }
  return FIXTURE_JOBS.find(j => j.slug === slugOrId || j.id === slugOrId) ?? null
}

export async function getSimilar(job: JobSummary, limit = 4): Promise<JobSummary[]> {
  if (jobsSource === 'api') {
    const r = await api<{ data: JobSummary[] }>(`/jobs/${job.id}/similar`, new URLSearchParams({ limit: String(limit) }))
    return r?.data ?? []
  }
  return FIXTURE_JOBS
    .filter(j => j.id !== job.id)
    .map(j => ({ j, s: (j.category.slug === job.category.slug ? 3 : 0) + (j.cluster.slug === job.cluster.slug ? 2 : 0) + (j.locations[0]?.regionSlug === job.locations[0]?.regionSlug ? 1 : 0) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => toSummary(x.j))
}

export async function getTaxonomy(): Promise<Taxonomy> {
  if (jobsSource === 'api') return (await api<Taxonomy>('/taxonomy'))!
  return fixtureTaxonomy()
}

export async function listJobSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (jobsSource === 'api') return (await api<{ data: { slug: string; updatedAt: string }[] }>('/sitemap/jobs'))?.data ?? []
  if (jobsSource === 'fixtures') return FIXTURE_JOBS.map(j => ({ slug: j.slug, updatedAt: j.updatedAt }))
  return []
}

/* ───────────────────────── Fixture search engine ─────────────────────────
   Same semantics the real API must implement: OR inside a filter, AND between
   filters, disjunctive facet counts, synonyms from the taxonomy. Labels come
   from the (fixture) taxonomy, never from lists in the site. */

const norm = (s: string) => s
  .replace(/[֑-ׇ]/g, '')
  .replace(/\/(ת|ית|ה|ות|ים|אשת)\b/g, '')
  .replace(/["'״׳]/g, '')
  .toLowerCase()

/** Expand a free-text query with category synonyms: "מחסנאי" also matches "מחסנאות וליקוט". */
function expandQuery(q: string, tax: Taxonomy) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  const cats = tax.clusters.flatMap(c => c.categories)
  const hits = cats.filter(c => [c.label, ...(c.synonyms ?? [])].some(s => { const n = norm(s); return n.includes(norm(q)) || norm(q).includes(n) }))
  return { words, categorySlugs: new Set(hits.map(c => c.slug)) }
}

function haystack(j: JobDetail) {
  const company = j.company.confidential ? '' : j.company.name
  return norm([j.title, j.teaser, company, j.cluster.label, j.category.label, j.industry?.label, j.role?.label, ...(j.skills ?? []).map(s => s.label), ...j.requirements].join(' '))
}

const any = (sel: string[] | undefined, test: (v: string) => boolean) => !sel?.length || sel.some(test)

function fixtureSearch(q: JobsQuery): JobsPage {
  const tax = fixtureTaxonomy()
  const exp = q.q ? expandQuery(q.q, tax) : null
  const postedMs = q.postedWithin ? { '1d': 1, '3d': 3, '7d': 7, '30d': 30 }[q.postedWithin] * 864e5 : 0

  const preds: Record<FacetKey | 'rest', (j: JobDetail) => boolean> = {
    cluster: j => any(q.cluster, v => j.cluster.slug === v),
    category: j => any(q.category, v => j.category.slug === v),
    industry: j => any(q.industry, v => j.industry?.slug === v),
    region: j => any(q.region, v => j.locations.some(l => l.regionSlug === v)),
    city: j => any(q.city, v => j.locations.some(l => l.citySlug === v)),
    employmentType: j => any(q.employmentType, v => j.employmentType.includes(v)),
    workModel: j => any(q.workModel, v => j.workModel === v),
    seniority: j => any(q.seniority, v => j.seniority === v),
    suitableFor: j => any(q.suitableFor, v => !!j.suitableFor?.includes(v)),
    rest: j => {
      if (exp) {
        const h = haystack(j)
        if (!exp.categorySlugs.has(j.category.slug) && !exp.words.every(w => h.includes(w))) return false
      }
      if (q.noExperience && !(j.noExperience || j.experienceYearsMin === 0)) return false
      if (q.companySlug && (j.company.confidential || j.company.slug !== q.companySlug)) return false
      if (q.salaryMin && j.salary) {
        const monthly = (j.salary.max ?? j.salary.min ?? 0) * (j.salary.period === 'hour' ? 186 : j.salary.period === 'year' ? 1 / 12 : 1)
        if (monthly < q.salaryMin) return false
      }
      if (postedMs && Date.now() - new Date(j.publishedAt).getTime() > postedMs) return false
      return true
    },
  }
  const keys = Object.keys(preds) as (keyof typeof preds)[]
  const matchExcept = (j: JobDetail, skip?: FacetKey) => keys.every(k => k === skip || preds[k](j))

  let rows = FIXTURE_JOBS.filter(j => matchExcept(j))
  const monthly = (j: JobDetail) => (j.salary ? (j.salary.max ?? j.salary.min ?? 0) * (j.salary.period === 'hour' ? 186 : 1) : -1)
  const sort = q.sort ?? (q.q ? 'relevance' : 'newest')
  rows = [...rows].sort((a, b) =>
    sort === 'salary' ? monthly(b) - monthly(a)
      : sort === 'relevance' && exp ? Number(exp.categorySlugs.has(b.category.slug)) - Number(exp.categorySlugs.has(a.category.slug)) || +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : +new Date(b.publishedAt) - +new Date(a.publishedAt))

  const lx = labelsFrom(tax)
  const facet = (key: FacetKey, values: (j: JobDetail) => string[], label: (v: string) => string): FacetValue[] => {
    const counts = new Map<string, number>()
    for (const j of FIXTURE_JOBS) {
      if (!matchExcept(j, key)) continue
      for (const v of new Set(values(j))) counts.set(v, (counts.get(v) ?? 0) + 1)
    }
    return [...counts].map(([value, count]) => ({ value, label: label(value), count })).sort((a, b) => b.count - a.count)
  }

  const limit = Math.min(q.limit ?? 20, 50)
  const page = Math.max(1, q.page ?? 1)
  return {
    data: rows.slice((page - 1) * limit, page * limit).map(toSummary),
    total: rows.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
    facets: {
      cluster: facet('cluster', j => [j.cluster.slug], lx.cluster),
      category: facet('category', j => [j.category.slug], lx.category),
      industry: facet('industry', j => (j.industry ? [j.industry.slug] : []), lx.industry),
      region: facet('region', j => j.locations.map(l => l.regionSlug), lx.region),
      city: facet('city', j => j.locations.map(l => l.citySlug), lx.city),
      employmentType: facet('employmentType', j => j.employmentType, lx.employmentType),
      workModel: facet('workModel', j => [j.workModel], lx.workModel),
      seniority: facet('seniority', j => (j.seniority ? [j.seniority] : []), lx.seniority),
      suitableFor: facet('suitableFor', j => j.suitableFor ?? [], lx.suitableFor),
    },
  }
}

function toSummary(j: JobDetail): JobSummary {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { description, responsibilities, requirements, niceToHave, benefits, startDate, recruiter, apply, status, ...summary } = j
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return summary
}
