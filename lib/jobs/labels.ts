import type { JobSummary, Salary, Taxonomy } from './types'

/**
 * Value → label lookups built from GET /taxonomy. The site has no label lists
 * of its own; an unknown value falls back to the raw value.
 */
export type Labels = {
  employmentType: (v: string) => string
  workModel: (v: string) => string
  seniority: (v: string) => string
  suitableFor: (v: string) => string
  tag: (v: string) => string
  cluster: (slug: string) => string
  category: (slug: string) => string
  industry: (slug: string) => string
  region: (slug: string) => string
  city: (slug: string) => string
}

const lookup = (entries: { value?: string; slug?: string; label: string }[]) => {
  const m = new Map(entries.map(e => [(e.value ?? e.slug)!, e.label]))
  return (v: string) => m.get(v) ?? v
}

export function labelsFrom(t: Taxonomy): Labels {
  return {
    employmentType: lookup(t.employmentTypes),
    workModel: lookup(t.workModels),
    seniority: lookup(t.seniorities),
    suitableFor: lookup(t.suitableFor),
    tag: lookup(t.marketingTags),
    cluster: lookup(t.clusters),
    category: lookup(t.clusters.flatMap(c => c.categories)),
    industry: lookup(t.industries),
    region: lookup(t.regions),
    city: lookup(t.regions.flatMap(r => r.cities)),
  }
}

/* ───────── Site UI options (not domain catalogs) ───────── */

export const POSTED_LABELS = {
  '1d': '24 השעות האחרונות',
  '3d': '3 ימים אחרונים',
  '7d': 'השבוע האחרון',
  '30d': 'החודש האחרון',
} as const

export const SORT_LABELS = {
  relevance: 'הכי רלוונטי',
  newest: 'הכי חדש',
  salary: 'שכר גבוה',
  distance: 'הכי קרוב',
} as const

/* ───────── Formatting ───────── */

const nf = new Intl.NumberFormat('he-IL')

export function formatSalary(s?: Salary) {
  if (!s || (s.min == null && s.max == null)) return null
  const unit = s.period === 'hour' ? 'לשעה' : s.period === 'year' ? 'לשנה' : 'לחודש'
  const a = s.min != null ? nf.format(s.min) : null
  const b = s.max != null ? nf.format(s.max) : null
  // LTR isolate: without it an en dash splits the numbers and RTL shows "15,000–12,000"
  const range = a && b ? `⁦${a}–${b}⁩` : a ? `מ-${a}` : `עד ${b}`
  return `${range} ₪ ${unit}`
}

export function timeAgo(iso: string, now = Date.now()) {
  const diff = Math.max(0, now - new Date(iso).getTime())
  const h = Math.floor(diff / 36e5)
  if (h < 1) return 'פורסמה עכשיו'
  if (h < 24) return h === 1 ? 'לפני שעה' : `לפני ${h} שעות`
  const d = Math.floor(h / 24)
  if (d === 1) return 'אתמול'
  if (d < 7) return `לפני ${d} ימים`
  const w = Math.floor(d / 7)
  if (d < 30) return w === 1 ? 'לפני שבוע' : `לפני ${w} שבועות`
  return new Date(iso).toLocaleDateString('he-IL', { day: 'numeric', month: 'long' })
}

/** Name shown for the employer: the client, or for confidential jobs the publishing agency. */
export function companyName(j: Pick<JobSummary, 'company'>) {
  return j.company.confidential ? j.company.publisher.name : j.company.name
}

export function locationLabel(j: Pick<JobSummary, 'locations'>) {
  const names = j.locations.map(l => l.cityName)
  if (names.length <= 2) return names.join(', ')
  return `${names[0]} ועוד ${names.length - 1}`
}

export function isNew(j: Pick<JobSummary, 'publishedAt'>, now = Date.now()) {
  return now - new Date(j.publishedAt).getTime() < 48 * 36e5
}

export function isNoExperience(j: Pick<JobSummary, 'noExperience' | 'experienceYearsMin'>) {
  return j.noExperience === true || j.experienceYearsMin === 0
}
