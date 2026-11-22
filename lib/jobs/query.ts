import type { JobsQuery } from './types'

type Raw = Record<string, string | string[] | undefined>

// Values come from the taxonomy, so they're validated by shape only; unknown
// values simply match nothing in the API.
const TOKEN = /^[a-z0-9_-]{1,60}$/

const arr = (v: string | string[] | undefined) => {
  const list = (v == null ? [] : Array.isArray(v) ? v : [v]).filter(x => TOKEN.test(x)).slice(0, 20)
  return list.length ? list : undefined
}
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

const POSTED = ['1d', '3d', '7d', '30d'] as const
const SORT = ['relevance', 'newest', 'salary', 'distance'] as const

/** Untrusted URL params → a shape-validated query. */
export function parseQuery(raw: Raw): JobsQuery {
  const page = Number(one(raw.page))
  const salaryMin = Number(one(raw.salaryMin))
  const posted = one(raw.postedWithin)
  const sort = one(raw.sort)
  const company = one(raw.companySlug)
  return {
    q: one(raw.q)?.slice(0, 120).trim() || undefined,
    cluster: arr(raw.cluster),
    category: arr(raw.category),
    industry: arr(raw.industry),
    region: arr(raw.region),
    city: arr(raw.city),
    employmentType: arr(raw.employmentType),
    workModel: arr(raw.workModel),
    seniority: arr(raw.seniority),
    suitableFor: arr(raw.suitableFor),
    noExperience: one(raw.noExperience) === 'true' || undefined,
    salaryMin: Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : undefined,
    postedWithin: (POSTED as readonly string[]).includes(posted ?? '') ? (posted as JobsQuery['postedWithin']) : undefined,
    companySlug: company && TOKEN.test(company) ? company : undefined,
    sort: (SORT as readonly string[]).includes(sort ?? '') ? (sort as JobsQuery['sort']) : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  }
}

const ORDER: (keyof JobsQuery)[] = ['q', 'cluster', 'category', 'industry', 'region', 'city', 'employmentType', 'workModel', 'seniority', 'suitableFor', 'noExperience', 'salaryMin', 'postedWithin', 'companySlug', 'sort', 'page']

// Landing pages (one field and/or one place) live on clean paths:
//   /jobs/category/warehouse, /jobs/city/netivot, /jobs/category/warehouse/city/netivot
// Everything else (free text, several values, other filters) stays a query string.
const WHAT = ['cluster', 'category', 'industry'] as const
const WHERE = ['city', 'region'] as const
type PathKey = (typeof WHAT)[number] | (typeof WHERE)[number]

/** The clean path for a query's field/place part, or null when it doesn't fit one. */
function cleanPath(q: JobsQuery): { path: string; used: PathKey[] } | null {
  const what = WHAT.filter(k => q[k]?.length)
  const where = WHERE.filter(k => q[k]?.length)
  const used: PathKey[] = [...what, ...where]
  if (what.length > 1 || where.length > 1 || !used.length || used.some(k => q[k]!.length !== 1)) return null
  return { path: `/jobs/${used.flatMap(k => [k, q[k]![0]]).join('/')}`, used }
}

/** `/jobs/<kind>/<slug>[/<city|region>/<slug>]` segments → that part of a query; null if malformed. */
export function parsePath(segs: string[]): Partial<JobsQuery> | null {
  const [k1, v1, k2, v2] = segs
  if ((segs.length !== 2 && segs.length !== 4) || !TOKEN.test(v1)) return null
  const isWhat = (WHAT as readonly string[]).includes(k1), isWhere = (WHERE as readonly string[]).includes(k1)
  if (!isWhat && !isWhere) return null
  if (segs.length === 2) return { [k1]: [v1] }
  if (!isWhat || !(WHERE as readonly string[]).includes(k2) || !TOKEN.test(v2)) return null
  return { [k1]: [v1], [k2]: [v2] }
}

/** Query → URL (clean path for landing pages, stable param order, empty values dropped). */
export function toHref(q: JobsQuery) {
  const clean = cleanPath(q)
  const p = new URLSearchParams()
  for (const k of ORDER) {
    const v = q[k]
    if (clean?.used.includes(k as PathKey)) continue
    if (v == null || v === '' || v === false || (Array.isArray(v) && v.length === 0)) continue
    if (Array.isArray(v)) v.forEach(x => p.append(k, String(x)))
    else p.set(k, String(v))
  }
  const base = clean?.path ?? '/jobs'
  const s = p.toString()
  return s ? `${base}?${s}` : base
}

/** Keep params the jobs query doesn't own (utm_*, gclid, fbclid...) across a redirect. */
export function withExtras(href: string, raw: Iterable<[string, string]>) {
  const [path, qs = ''] = href.split('?')
  const p = new URLSearchParams(qs)
  for (const [k, v] of raw) if (!(ORDER as string[]).includes(k)) p.append(k, v)
  const s = p.toString()
  return s ? `${path}?${s}` : path
}

export function activeFilterCount(q: JobsQuery) {
  const lists = [q.cluster, q.category, q.industry, q.region, q.city, q.employmentType, q.workModel, q.seniority, q.suitableFor]
  return lists.reduce((n, l) => n + (l?.length ?? 0), 0) + (q.noExperience ? 1 : 0) + (q.salaryMin ? 1 : 0) + (q.postedWithin ? 1 : 0)
}
