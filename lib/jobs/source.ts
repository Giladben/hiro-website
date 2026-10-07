import { FIXTURE_JOBS, fixtureTaxonomy } from './fixtures'
import { EMPLOYMENT_LABELS, SENIORITY_LABELS, WORK_MODEL_LABELS } from './labels'
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
    .map(j => ({ j, s: (j.subcategory?.slug === job.subcategory?.slug ? 3 : 0) + (j.category.slug === job.category.slug ? 2 : 0) + (j.locations[0]?.regionSlug === job.locations[0]?.regionSlug ? 1 : 0) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => x.j)
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
   filters, disjunctive facet counts. */

const norm = (s: string) => s
  .replace(/[֑-ׇ]/g, '')
  .replace(/\/(ת|ית|ה|ות|ים)\b/g, '')
  .replace(/["'״׳]/g, '')
  .toLowerCase()

const SYNONYMS: [RegExp, string][] = [
  [/הנהלת חשבונות|מנהלת חשבונות|מנהל חשבונות|הנה״ח|הנהח/g, 'חשבונות'],
  [/מתכנת|מפתח|developer|dev\b/g, 'פיתוח'],
  [/נציג|נציגה/g, 'נציג'],
]
const canon = (s: string) => SYNONYMS.reduce((acc, [re, to]) => acc.replace(re, to), norm(s))

function haystack(j: JobDetail) {
  const company = j.company.confidential ? j.company.displayName : j.company.name
  return canon([j.title, j.teaser, company, j.category.label, j.subcategory?.label, ...(j.skills ?? []).map(s => s.label), ...j.requirements].join(' '))
}

type Pred = (j: JobDetail) => boolean
const any = <T,>(sel: T[] | undefined, test: (v: T) => boolean) => !sel?.length || sel.some(test)

function predicates(q: JobsQuery): Partial<Record<FacetKey | 'rest', Pred>> {
  const terms = q.q ? canon(q.q).split(/\s+/).filter(Boolean) : []
  const posted = q.postedWithin ? { '1d': 1, '3d': 3, '7d': 7, '30d': 30 }[q.postedWithin] * 24 * 36e5 : 0
  return {
    category: j => any(q.category, c => j.category.slug === c),
    region: j => any(q.region, r => j.locations.some(l => l.regionSlug === r)),
    city: j => any(q.city, c => j.locations.some(l => l.citySlug === c)),
    employmentType: j => any(q.employmentType, t => j.employmentType.includes(t)),
    workModel: j => any(q.workModel, w => j.workModel === w),
    seniority: j => any(q.seniority, s => j.seniority === s),
    rest: j => {
      if (terms.length) { const h = haystack(j); if (!terms.every(t => h.includes(t))) return false }
      if (!any(q.subcategory, s => j.subcategory?.slug === s)) return false
      if (q.noExperience && !((j.experienceYearsMin ?? 99) === 0 || j.tags?.includes('no_experience'))) return false
      if (q.suitableFor?.includes('students') && !(j.tags?.includes('students') || j.employmentType.includes('student'))) return false
      if (q.salaryMin && j.salary) {
        const monthly = (j.salary.max ?? j.salary.min ?? 0) * (j.salary.period === 'hour' ? 186 : j.salary.period === 'year' ? 1 / 12 : 1)
        if (monthly < q.salaryMin) return false
      }
      if (posted && Date.now() - new Date(j.publishedAt).getTime() > posted) return false
      return true
    },
  }
}

function fixtureSearch(q: JobsQuery): JobsPage {
  const preds = predicates(q)
  const keys = Object.keys(preds) as (keyof typeof preds)[]
  const matchExcept = (j: JobDetail, skip?: FacetKey) => keys.every(k => k === skip || preds[k]!(j))

  let rows = FIXTURE_JOBS.filter(j => matchExcept(j))
  const sort = q.sort ?? (q.q ? 'relevance' : 'newest')
  if (sort === 'salary') {
    const m = (j: JobDetail) => j.salary ? (j.salary.max ?? j.salary.min ?? 0) * (j.salary.period === 'hour' ? 186 : 1) : -1
    rows = [...rows].sort((a, b) => m(b) - m(a))
  } else if (sort === 'relevance' && q.q) {
    const t = canon(q.q)
    rows = [...rows].sort((a, b) => Number(canon(b.title).includes(t)) - Number(canon(a.title).includes(t)) || +new Date(b.publishedAt) - +new Date(a.publishedAt))
  } else {
    rows = [...rows].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  }

  const facet = (key: FacetKey, values: (j: JobDetail) => [string, string][]) => {
    const counts = new Map<string, FacetValue>()
    for (const j of FIXTURE_JOBS) {
      if (!matchExcept(j, key)) continue
      const seen = new Set<string>()
      for (const [value, label] of values(j)) {
        if (seen.has(value)) continue
        seen.add(value)
        const f = counts.get(value) ?? { value, label, count: 0 }
        f.count += 1
        counts.set(value, f)
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count)
  }

  const limit = Math.min(q.limit ?? 20, 50)
  const page = Math.max(1, q.page ?? 1)
  const totalPages = Math.max(1, Math.ceil(rows.length / limit))
  return {
    data: rows.slice((page - 1) * limit, page * limit).map(toSummary),
    total: rows.length,
    page,
    limit,
    totalPages,
    facets: {
      category: facet('category', j => [[j.category.slug, j.category.label]]),
      region: facet('region', j => j.locations.map(l => [l.regionSlug, l.regionName])),
      city: facet('city', j => j.locations.map(l => [l.citySlug, l.cityName])),
      employmentType: facet('employmentType', j => j.employmentType.map(t => [t, EMPLOYMENT_LABELS[t]])),
      workModel: facet('workModel', j => [[j.workModel, WORK_MODEL_LABELS[j.workModel]]]),
      seniority: facet('seniority', j => j.seniority ? [[j.seniority, SENIORITY_LABELS[j.seniority]]] : []),
    },
  }
}

function toSummary(j: JobDetail): JobSummary {
  const { id, slug, jobNumber, title, normalizedRoleTagId, company, category, subcategory, locations, employmentType, workModel, seniority, experienceYearsMin, salary, teaser, skills, tags, publishedAt, updatedAt, validThrough } = j
  return { id, slug, jobNumber, title, normalizedRoleTagId, company, category, subcategory, locations, employmentType, workModel, seniority, experienceYearsMin, salary, teaser, skills, tags, publishedAt, updatedAt, validThrough }
}
