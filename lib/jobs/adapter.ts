// Maps the Hiro Public Jobs API wire format (PUBLIC_JOBS_API.md, 2026-10-21)
// onto the site's internal types in ./types. The UI only ever sees the
// internal types, so wire-format changes are absorbed here.
//
// Inputs are untrusted JSON: every field is read defensively.

import type { ApplyQuestion, FacetKey, FacetValue, JobDetail, JobLocation, JobSummary, JobsPage, Labeled, PublicCompany, Salary, Taxonomy } from './types'
import { labelsFrom } from './labels'

type Obj = Record<string, unknown>
const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {})
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.length ? v : undefined)
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) ? v : undefined)

/** `{ value, label }` or a bare string → the value */
const enumValue = (v: unknown): string | undefined => (typeof v === 'string' ? v : str(obj(v).value))

const labeled = (v: unknown): Labeled | undefined => {
  const o = obj(v)
  const slug = str(o.slug)
  return slug ? { slug, label: str(o.label) ?? slug } : undefined
}

function location(v: unknown): JobLocation | null {
  const o = obj(v)
  const citySlug = str(o.citySlug)
  if (!citySlug) return null
  return {
    citySlug,
    cityName: str(o.city) ?? str(o.cityName) ?? citySlug,
    regionSlug: str(o.regionSlug) ?? '',
    regionName: str(o.region) ?? str(o.regionName) ?? '',
    address: str(o.address),
    lat: num(o.lat),
    lng: num(o.lng),
  }
}

function salary(v: unknown): Salary | undefined {
  const o = obj(v)
  const min = num(o.min), max = num(o.max)
  if (min == null && max == null) return undefined
  const period = o.period === 'hour' || o.period === 'year' ? o.period : 'month'
  return { min, max, currency: 'ILS', period, isEstimate: o.isEstimate === true }
}

function company(v: unknown): PublicCompany {
  const o = obj(v)
  if (o.confidential !== false) {
    // Anything not explicitly non-confidential is treated as confidential.
    const p = obj(o.publisher)
    return {
      confidential: true,
      displayName: str(o.displayName) ?? '',
      industry: str(o.industry),
      sizeRange: str(o.sizeRange),
      publisher: { name: str(p.name) ?? 'Hiro', logoUrl: str(p.logoUrl), slug: str(p.slug) ?? '' },
    }
  }
  return {
    confidential: false,
    id: str(o.id) ?? '',
    slug: str(o.slug) ?? '',
    name: str(o.name) ?? '',
    logoUrl: str(o.logoUrl),
    website: str(o.website),
    industry: str(o.industry),
    sizeRange: str(o.sizeRange),
    about: str(o.about),
    hq: str(o.hq),
  }
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Headings recruiters type inline ("...לקוחות. דרישות: ...") in plain-text descriptions
const HEADING = /(^|[.!]\s+)((?:עיקרי התפקיד|תחומי אחריות|תיאור התפקיד|מבנה המחלקה|כפיפות|דרישות(?: המשרה| התפקיד| חובה)?|יתרון|יתרונות|(?:השכר המוצע|שכר(?: מוצע| התחלתי| שעתי)?)|שעות(?: עבודה)?|היקף(?: ה?משרה)?|מיקום|תנאי(?:ם| עבודה| המשרה)))\s*:\s*/g

/** Plain-text descriptions arrive as one run-on line: escape, then break into paragraphs at known headings. */
export function descriptionHtml(raw: string): string {
  if (/<\/?(p|ul|ol|li|br|strong|b)\b/i.test(raw)) return raw
  // The API drops the client's name from confidential jobs, leaving "לחברת , העוסקת..."
  const text = raw.replace(/(^|\s)([לבמ]?)חברת\s*,\s*/g, '$1$2חברה ')
  const blocks = text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean)
  return blocks.map(b => `<p>${escapeHtml(b).replace(/\n/g, '<br>').replace(HEADING, (_, pre: string, h: string) => `${pre.trim()}</p><p><strong>${h}:</strong> `)}</p>`)
    .join('').replace(/<p>\s*<\/p>/g, '')
}

export function toSummary(v: unknown): JobSummary {
  const o = obj(v)
  const tags = arr(o.tags).map(enumValue).filter((x): x is string => !!x)
  return {
    id: str(o.id) ?? '',
    slug: str(o.slug) ?? '',
    jobNumber: str(o.jobNumber) ?? '',
    title: str(o.title) ?? '',
    cluster: labeled(o.cluster) ?? { slug: '', label: '' },
    category: labeled(o.category) ?? { slug: '', label: '' },
    role: labeled(o.role),
    industry: labeled(o.industry),
    company: company(o.company),
    locations: arr(o.locations).map(location).filter((x): x is JobLocation => !!x),
    employmentType: arr(o.employmentType).map(enumValue).filter((x): x is string => !!x),
    workModel: enumValue(o.workModel) ?? '',
    seniority: enumValue(o.seniority),
    experienceYearsMin: num(o.experienceYearsMin),
    noExperience: o.noExperience === true,
    urgent: o.urgent === true,
    tags: tags.length ? tags : undefined,
    suitableFor: arr(o.suitableFor).map(enumValue).filter((x): x is string => !!x),
    salary: salary(o.salary),
    hoursDescription: str(o.hoursDescription),
    teaser: str(o.teaser) ?? '',
    skills: arr(o.skills).map(s => str(obj(s).label)).filter((x): x is string => !!x).map(label => ({ tagId: label, label })),
    imageUrl: str(o.imageUrl),
    publishedAt: str(o.publishedAt) ?? str(o.updatedAt) ?? new Date(0).toISOString(),
    updatedAt: str(o.updatedAt) ?? str(o.publishedAt) ?? new Date(0).toISOString(),
    validThrough: str(o.validThrough),
  }
}

const QUESTION_TYPES: Record<string, ApplyQuestion['type']> = {
  yes_no: 'yes_no', text: 'text', number: 'number', choice: 'select', select: 'select', video: 'video',
}

/** ISO date or 'immediate'; the API also sends free text like "🟢 מיידי (זמין לעבודה מיד)." */
function startDate(v: unknown): string | undefined {
  const t = str(v)?.trim()
  if (!t) return undefined
  if (t === 'immediate' || t.includes('מיידי')) return 'immediate'
  return /^\d{4}-\d{2}-\d{2}/.test(t) && !Number.isNaN(Date.parse(t)) ? t : undefined
}

export function toDetail(v: unknown): JobDetail {
  const o = obj(v)
  const r = obj(o.recruiter)
  const a = obj(o.apply)
  const lines = (x: unknown) => arr(x).map(i => (typeof i === 'string' ? i : str(obj(i).label))).filter((s): s is string => !!s)
  const questions: ApplyQuestion[] = arr(a.questions).flatMap(q => {
    const qo = obj(q)
    const type = QUESTION_TYPES[str(qo.type) ?? '']
    const id = str(qo.id) ?? (typeof qo.id === 'number' ? String(qo.id) : undefined)
    if (!type || !id) return []
    // Video questions are completed in the candidate portal, never in the site form
    const portal = type === 'video' || qo.completeInPortal === true
    return [{
      id,
      type: portal ? 'video' : type,
      label: str(qo.label) ?? '',
      required: !portal && qo.required === true,
      options: arr(qo.options).map(x => (typeof x === 'string' ? x : str(obj(x).label))).filter((s): s is string => !!s),
    }]
  })
  const firstName = str(r.firstName) ?? str(r.displayName)
  return {
    ...toSummary(v),
    description: descriptionHtml(str(o.description) ?? ''),
    responsibilities: lines(o.responsibilities),
    requirements: lines(o.requirements),
    niceToHave: lines(o.niceToHave),
    benefits: lines(o.benefits),
    startDate: startDate(o.startDate),
    recruiter: firstName ? { displayName: firstName, photoUrl: str(r.imageUrl) ?? str(r.photoUrl) } : undefined,
    apply: {
      method: a.method === 'external' && str(a.externalUrl) ? 'external' : 'hiro',
      requiresCv: a.requiresCv === true, // CV is optional per the API
      questions,
      externalUrl: str(a.externalUrl) ?? null,
    },
    status: o.status === 'closed' ? 'closed' : 'open',
  }
}

const FACET_KEYS: FacetKey[] = ['cluster', 'category', 'industry', 'region', 'city', 'employmentType', 'workModel', 'seniority', 'suitableFor']

/** Facets arrive as `{ group: { value: count } }`; labels come from the taxonomy. */
export function toFacets(v: unknown, tax: Taxonomy): JobsPage['facets'] {
  const raw = obj(v)
  const lx = labelsFrom(tax)
  const out: JobsPage['facets'] = {}
  for (const key of FACET_KEYS) {
    const group = raw[key]
    let list: FacetValue[] = []
    if (Array.isArray(group)) {
      // tolerate the spec's original [{ value, label, count }] shape too
      list = group.map(g => obj(g)).filter(g => str(g.value) && num(g.count) != null)
        .map(g => ({ value: str(g.value)!, label: str(g.label) ?? lx[key](str(g.value)!), count: num(g.count)! }))
    } else {
      list = Object.entries(obj(group)).filter(([, c]) => num(c) != null)
        .map(([value, count]) => ({ value, label: lx[key](value), count: count as number }))
    }
    out[key] = list.filter(f => f.count > 0).sort((a, b) => b.count - a.count)
  }
  return out
}

export function toPage(v: unknown, tax: Taxonomy): JobsPage {
  const o = obj(v)
  const p = obj(o.pagination)
  const items = arr(o.items ?? o.data)
  const page = num(p.page) ?? num(o.page) ?? 1
  const limit = num(p.limit) ?? num(o.limit) ?? 20
  const total = num(p.total) ?? num(o.total) ?? items.length
  return {
    data: items.map(toSummary),
    total,
    page,
    limit,
    totalPages: num(p.totalPages) ?? num(o.totalPages) ?? Math.max(1, Math.ceil(total / limit)),
    facets: o.facets ? toFacets(o.facets, tax) : undefined,
  }
}

/** Taxonomy is already close to the internal shape; normalise and keep slug aliases. */
export function toTaxonomy(v: unknown): Taxonomy & { aliases: Record<'cluster' | 'category' | 'city', Record<string, string>> } {
  const o = obj(v)
  const aliases = { cluster: {} as Record<string, string>, category: {} as Record<string, string>, city: {} as Record<string, string> }
  const enums = (x: unknown) => arr(x).map(e => obj(e)).filter(e => str(e.value))
    .map(e => ({ value: str(e.value)!, label: str(e.label) ?? str(e.value)!, count: num(e.count) }))
  const clusters = arr(o.clusters).map(c => {
    const co = obj(c)
    const slug = str(co.slug) ?? ''
    for (const a of arr(co.aliases)) if (typeof a === 'string') aliases.cluster[a] = slug
    return {
      slug, label: str(co.label) ?? slug, count: num(co.count) ?? 0,
      categories: arr(co.categories).map(k => {
        const ko = obj(k)
        const ks = str(ko.slug) ?? ''
        for (const a of arr(ko.aliases)) if (typeof a === 'string') aliases.category[a] = ks
        return { slug: ks, label: str(ko.label) ?? ks, count: num(ko.count) ?? 0, synonyms: arr(ko.synonyms).filter((x): x is string => typeof x === 'string') }
      }),
    }
  })
  const regions = arr(o.regions).map(r => {
    const ro = obj(r)
    return {
      slug: str(ro.slug) ?? '', label: str(ro.label) ?? '', count: num(ro.count) ?? 0,
      cities: arr(ro.cities).map(c => {
        const co = obj(c)
        const cs = str(co.slug) ?? ''
        for (const a of arr(co.aliases)) if (typeof a === 'string') aliases.city[a] = cs
        return { slug: cs, label: str(co.label) ?? cs, count: num(co.count) ?? 0, lat: num(co.lat), lng: num(co.lng) }
      }),
    }
  })
  return {
    clusters,
    industries: arr(o.industries).map(i => obj(i)).filter(i => str(i.slug)).map(i => ({ slug: str(i.slug)!, label: str(i.label) ?? str(i.slug)!, count: num(i.count) ?? 0 })),
    regions,
    employmentTypes: enums(o.employmentTypes),
    workModels: enums(o.workModels),
    seniorities: enums(o.seniorities),
    suitableFor: enums(o.suitableFor),
    marketingTags: enums(o.marketingTags),
    aliases,
  }
}
