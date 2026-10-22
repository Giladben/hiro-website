import { FIXTURE_JOBS, fixtureTaxonomy } from './fixtures'
import { labelsFrom } from './labels'
import { toDetail, toPage, toSummary as apiSummary, toTaxonomy } from './adapter'
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
    // the API takes multiple values comma-separated (OR within a filter)
    if (Array.isArray(v)) p.set(k, v.join(','))
    else p.set(k, String(v))
  }
  if (q.sort === 'distance') p.delete('sort') // not supported by the API
  p.set('facets', '1')
  return p
}

/* ───────────────────────── Public functions ───────────────────────── */

// Up to this many jobs the whole catalog is pulled once (cached, purged by the
// webhook) and searched in-process: every filter/facet combination is instant
// instead of a multi-second API round trip per URL. Above it, query the API.
const CATALOG_MAX = 1500

/** All open jobs as summaries, or null when the catalog is too big to hold. */
async function getCatalog(): Promise<JobSummary[] | null> {
  const page = (n: number) => api<unknown>('/jobs', new URLSearchParams({ limit: '50', page: String(n), facets: '0', sort: 'newest' }))
  const first = await page(1)
  const tax = await getTaxonomy()
  const head = toPage(first, tax)
  if (head.total > CATALOG_MAX) return null
  const rest = await Promise.all(Array.from({ length: head.totalPages - 1 }, (_, i) => page(i + 2)))
  const all = [...head.data, ...rest.flatMap(r => toPage(r, tax).data)]
  return repairDates([...new Map(all.map(j => [j.id, j])).values()])
}

/**
 * A bulk import stamps every job with the same publishedAt, which would mark
 * all of them "new". When most of a sizeable catalog shares one timestamp,
 * treat those dates as unknown (still sent to Google as datePosted).
 */
function repairDates(jobs: JobSummary[]): JobSummary[] {
  if (jobs.length < 20) return jobs
  const counts = new Map<string, number>()
  for (const j of jobs) counts.set(j.publishedAt, (counts.get(j.publishedAt) ?? 0) + 1)
  const [stamp, n] = [...counts].sort((a, b) => b[1] - a[1])[0]
  if (n < jobs.length * 0.3) return jobs
  return jobs.map(j => (j.publishedAt === stamp ? { ...j, postedDateUnknown: true } : j))
}

export async function listJobs(q: JobsQuery): Promise<JobsPage> {
  if (jobsSource === 'api') {
    const [catalog, tax] = await Promise.all([getCatalog(), getTaxonomy()])
    if (catalog) return search(catalog, tax, q)
    const raw = await api<unknown>('/jobs', toParams(q))
    return toPage(raw, tax)
  }
  return search(FIXTURE_JOBS, fixtureTaxonomy(), q)
}

export async function getJob(slugOrId: string): Promise<JobDetail | null> {
  if (jobsSource === 'api') {
    let r = await api<Record<string, unknown>>(`/jobs/${encodeURIComponent(slugOrId)}`)
    // The API currently 404s on its own slugs but resolves the jobNumber the slug ends with
    const jobNumber = /-(\d{3,})$/.exec(slugOrId)?.[1]
    if (!r && jobNumber) r = await api<Record<string, unknown>>(`/jobs/${jobNumber}`)
    if (!r) return null
    const job = toDetail(r.data && typeof r.data === 'object' ? r.data : r)
    const listed = (await getCatalog())?.find(j => j.id === job.id)
    return listed?.postedDateUnknown ? { ...job, postedDateUnknown: true } : job
  }
  return FIXTURE_JOBS.find(j => j.slug === slugOrId || j.id === slugOrId) ?? null
}

export async function getSimilar(job: JobSummary, limit = 4): Promise<JobSummary[]> {
  let pool: JobSummary[] = FIXTURE_JOBS
  if (jobsSource === 'api') {
    const catalog = await getCatalog()
    if (!catalog) {
      const r = await api<{ items?: unknown[]; data?: unknown[] }>(`/jobs/${encodeURIComponent(job.id)}/similar`, new URLSearchParams({ limit: String(limit) }))
      return (r?.items ?? r?.data ?? []).map(apiSummary)
    }
    pool = catalog
  }
  return pool
    .filter(j => j.id !== job.id)
    .map(j => ({ j, s: (j.category.slug && j.category.slug === job.category.slug ? 3 : 0) + (j.cluster.slug && j.cluster.slug === job.cluster.slug ? 2 : 0) + (j.locations[0]?.regionSlug && j.locations[0].regionSlug === job.locations[0]?.regionSlug ? 1 : 0) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => toSummary(x.j))
}

export async function getTaxonomy(): Promise<Taxonomy> {
  if (jobsSource === 'api') return toTaxonomy(await api<unknown>('/taxonomy'))
  return fixtureTaxonomy()
}

export async function listJobSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  if (jobsSource === 'api') {
    const r = await api<{ items?: { slug: string; updatedAt: string }[]; data?: { slug: string; updatedAt: string }[] }>('/sitemap/jobs')
    return (r?.items ?? r?.data ?? []).filter(x => x && typeof x.slug === 'string')
  }
  if (jobsSource === 'fixtures') return FIXTURE_JOBS.map(j => ({ slug: j.slug, updatedAt: j.updatedAt }))
  return []
}

/* ───────────────────────── In-process search engine ─────────────────────────
   Runs over the cached API catalog (or the fixtures). Same semantics as the
   API: OR inside a filter, AND between filters, disjunctive facet counts,
   synonyms from the taxonomy. Labels come from the taxonomy, falling back to
   the label the job itself carries, never from lists in the site. */

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

function haystack(j: JobSummary) {
  const company = j.company.confidential ? '' : j.company.name
  const requirements = 'requirements' in j ? (j as JobDetail).requirements : []
  return norm([j.title, j.teaser, company, j.cluster.label, j.category.label, j.industry?.label, j.role?.label, ...(j.skills ?? []).map(s => s.label), ...requirements].join(' '))
}

const any = (sel: string[] | undefined, test: (v: string) => boolean) => !sel?.length || sel.some(test)

// Ties (same publish time) fall back to the newer job number
const byNewest = (a: JobSummary, b: JobSummary) =>
  +new Date(b.publishedAt) - +new Date(a.publishedAt) || (Number(b.jobNumber) || 0) - (Number(a.jobNumber) || 0)

function search(jobs: JobSummary[], tax: Taxonomy, q: JobsQuery): JobsPage {
  const exp = q.q ? expandQuery(q.q, tax) : null
  const postedMs = q.postedWithin ? { '1d': 1, '3d': 3, '7d': 7, '30d': 30 }[q.postedWithin] * 864e5 : 0

  const preds: Record<FacetKey | 'rest', (j: JobSummary) => boolean> = {
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
      if (postedMs && (j.postedDateUnknown || Date.now() - new Date(j.publishedAt).getTime() > postedMs)) return false
      return true
    },
  }
  const keys = Object.keys(preds) as (keyof typeof preds)[]
  const matchExcept = (j: JobSummary, skip?: FacetKey) => keys.every(k => k === skip || preds[k](j))

  let rows = jobs.filter(j => matchExcept(j))
  const monthly = (j: JobSummary) => (j.salary ? (j.salary.max ?? j.salary.min ?? 0) * (j.salary.period === 'hour' ? 186 : 1) : -1)
  const sort = q.sort ?? (q.q ? 'relevance' : 'newest')
  rows = [...rows].sort((a, b) =>
    sort === 'salary' ? monthly(b) - monthly(a) || byNewest(a, b)
      : sort === 'relevance' && exp ? Number(exp.categorySlugs.has(b.category.slug)) - Number(exp.categorySlugs.has(a.category.slug)) || byNewest(a, b)
        : byNewest(a, b))

  const lx = labelsFrom(tax)
  // values(j) yields [value, label the job carries]; the taxonomy label wins when it knows the value
  const facet = (key: FacetKey, values: (j: JobSummary) => [string, string?][], label: (v: string) => string): FacetValue[] => {
    const counts = new Map<string, { count: number; own?: string }>()
    for (const j of jobs) {
      if (!matchExcept(j, key)) continue
      for (const [v, own] of new Map<string, string | undefined>(values(j).filter(([v]) => v).map(([v, l]) => [v, l]))) {
        const c = counts.get(v) ?? { count: 0, own }
        c.count++
        counts.set(v, c)
      }
    }
    return [...counts].map(([value, { count, own }]) => {
      const known = label(value)
      return { value, label: known !== value ? known : own || value, count }
    }).sort((a, b) => b.count - a.count)
  }
  const one = (v?: string): [string, string?][] => (v ? [[v]] : [])

  const limit = Math.min(q.limit ?? 20, 50)
  const page = Math.max(1, q.page ?? 1)
  return {
    data: rows.slice((page - 1) * limit, page * limit).map(toSummary),
    total: rows.length,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(rows.length / limit)),
    facets: {
      cluster: facet('cluster', j => [[j.cluster.slug, j.cluster.label]], lx.cluster),
      category: facet('category', j => [[j.category.slug, j.category.label]], lx.category),
      industry: facet('industry', j => (j.industry ? [[j.industry.slug, j.industry.label]] : []), lx.industry),
      region: facet('region', j => j.locations.map(l => [l.regionSlug, l.regionName]), lx.region),
      city: facet('city', j => j.locations.map(l => [l.citySlug, l.cityName]), lx.city),
      employmentType: facet('employmentType', j => j.employmentType.map(v => [v]), lx.employmentType),
      workModel: facet('workModel', j => one(j.workModel), lx.workModel),
      seniority: facet('seniority', j => one(j.seniority), lx.seniority),
      suitableFor: facet('suitableFor', j => (j.suitableFor ?? []).map(v => [v]), lx.suitableFor),
    },
  }
}

function toSummary(j: JobSummary | JobDetail): JobSummary {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { description, responsibilities, requirements, niceToHave, benefits, startDate, recruiter, apply, status, ...summary } = j as JobDetail
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return summary
}
