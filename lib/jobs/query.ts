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

/** Query → `/jobs?...` (stable param order, empty values dropped). */
export function toHref(q: JobsQuery, base = '/jobs') {
  const p = new URLSearchParams()
  for (const k of ORDER) {
    const v = q[k]
    if (v == null || v === '' || v === false || (Array.isArray(v) && v.length === 0)) continue
    if (Array.isArray(v)) v.forEach(x => p.append(k, String(x)))
    else p.set(k, String(v))
  }
  const s = p.toString()
  return s ? `${base}?${s}` : base
}

export function activeFilterCount(q: JobsQuery) {
  const lists = [q.cluster, q.category, q.industry, q.region, q.city, q.employmentType, q.workModel, q.seniority, q.suitableFor]
  return lists.reduce((n, l) => n + (l?.length ?? 0), 0) + (q.noExperience ? 1 : 0) + (q.salaryMin ? 1 : 0) + (q.postedWithin ? 1 : 0)
}
