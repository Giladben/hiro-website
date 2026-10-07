import type { EmploymentType, JobsQuery, PostedWithin, Seniority, SortKey, SuitableFor, WorkModel } from './types'

type Raw = Record<string, string | string[] | undefined>

const arr = (v: string | string[] | undefined) => (v == null ? undefined : (Array.isArray(v) ? v : [v]).filter(Boolean))
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined

const EMPLOYMENT = new Set<EmploymentType>(['full_time', 'part_time', 'shifts', 'temporary', 'freelance', 'internship', 'student'])
const WORK = new Set<WorkModel>(['onsite', 'hybrid', 'remote'])
const SENIORITY = new Set<Seniority>(['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'executive'])
const SUITABLE = new Set<SuitableFor>(['students', 'soldiers', 'pensioners', 'disability', 'olim'])
const POSTED = new Set<PostedWithin>(['1d', '3d', '7d', '30d'])
const SORT = new Set<SortKey>(['relevance', 'newest', 'salary', 'distance'])

const pick = <T extends string>(set: Set<T>, v?: string[]) => v?.filter((x): x is T => set.has(x as T))
const slugs = (v?: string[]) => v?.filter(s => /^[a-z0-9-]{1,60}$/.test(s))

/** Untrusted URL params → a validated query. */
export function parseQuery(raw: Raw): JobsQuery {
  const page = Number(one(raw.page))
  const salaryMin = Number(one(raw.salaryMin))
  const posted = one(raw.postedWithin) as PostedWithin | undefined
  const sort = one(raw.sort) as SortKey | undefined
  return {
    q: one(raw.q)?.slice(0, 120).trim() || undefined,
    category: slugs(arr(raw.category)),
    subcategory: slugs(arr(raw.subcategory)),
    region: slugs(arr(raw.region)),
    city: slugs(arr(raw.city)),
    employmentType: pick(EMPLOYMENT, arr(raw.employmentType)),
    workModel: pick(WORK, arr(raw.workModel)),
    seniority: pick(SENIORITY, arr(raw.seniority)),
    suitableFor: pick(SUITABLE, arr(raw.suitableFor)),
    noExperience: one(raw.noExperience) === 'true' || undefined,
    salaryMin: Number.isFinite(salaryMin) && salaryMin > 0 ? salaryMin : undefined,
    postedWithin: posted && POSTED.has(posted) ? posted : undefined,
    sort: sort && SORT.has(sort) ? sort : undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
  }
}

/** Query → `/jobs?...` (stable param order, empty values dropped). */
export function toHref(q: JobsQuery, base = '/jobs') {
  const p = new URLSearchParams()
  const order: (keyof JobsQuery)[] = ['q', 'category', 'subcategory', 'region', 'city', 'employmentType', 'workModel', 'seniority', 'suitableFor', 'noExperience', 'salaryMin', 'postedWithin', 'sort', 'page']
  for (const k of order) {
    const v = q[k]
    if (v == null || v === '' || v === false || (Array.isArray(v) && v.length === 0)) continue
    if (Array.isArray(v)) v.forEach(x => p.append(k, String(x)))
    else p.set(k, String(v))
  }
  const s = p.toString()
  return s ? `${base}?${s}` : base
}

export function activeFilterCount(q: JobsQuery) {
  return (q.category?.length ?? 0) + (q.subcategory?.length ?? 0) + (q.region?.length ?? 0) + (q.city?.length ?? 0)
    + (q.employmentType?.length ?? 0) + (q.workModel?.length ?? 0) + (q.seniority?.length ?? 0) + (q.suitableFor?.length ?? 0)
    + (q.noExperience ? 1 : 0) + (q.salaryMin ? 1 : 0) + (q.postedWithin ? 1 : 0)
}
