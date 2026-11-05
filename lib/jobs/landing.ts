// Text block for /jobs landing pages (category / city / category × city).
// Everything is computed from the open jobs on the page itself, so it is always
// true and never needs editing. A question is left out when the data can't answer it.

import { type Labels, formatSalary, isNoExperience } from './labels'
import { toHref } from './query'
import type { JobSummary, JobsQuery, Salary } from './types'

export type Faq = { q: string; a: string; link?: { href: string; label: string } }
export type LandingFacts = {
  heading: string
  intro: string
  top?: { title: string; links: { href: string; label: string }[] }
  faqs: Faq[]
}

/** Matches the listing page's indexable rule: single cluster/category/industry × city/region, no other filters. */
export function isIndexable(q: JobsQuery) {
  const single = (l?: string[]) => (l?.length ?? 0) <= 1
  return !q.q && !q.page && single(q.cluster) && single(q.category) && single(q.industry) && single(q.city) && single(q.region)
    && !q.employmentType && !q.workModel && !q.seniority && !q.suitableFor && !q.noExperience && !q.salaryMin && !q.postedWithin && !q.sort
}

const top = <T,>(items: T[], key: (t: T) => string | undefined, n: number) => {
  const m = new Map<string, { item: T; n: number }>()
  for (const i of items) {
    const k = key(i)
    if (!k) continue
    const c = m.get(k) ?? { item: i, n: 0 }
    c.n++
    m.set(k, c)
  }
  return [...m.values()].sort((a, b) => b.n - a.n).slice(0, n)
}

/** `subject` is the headline without its leading "משרות ", e.g. "מחסן והפצה בנתיבות". */
export function landingFacts(q: JobsQuery, jobs: JobSummary[], subject: string, lx: Labels): LandingFacts | null {
  const hasWhat = !!(q.cluster?.length || q.category?.length || q.industry?.length)
  const hasWhere = !!(q.city?.length || q.region?.length)
  if (!isIndexable(q) || (!hasWhat && !hasWhere) || jobs.length < 3) return null
  const n = jobs.length

  // Intro: count + the most common employment type
  const mainType = top(jobs.flatMap(j => j.employmentType), t => t, 1)[0]
  const intro = `כרגע יש ב-HirO ${n} משרות פתוחות ${hasWhat ? `בתחום ${subject}` : subject}.`
    + (mainType && mainType.n / n >= 0.5 ? ` רובן ${lx.employmentType(mainType.item)}.` : '')
    + ' ההגשה נשלחת ישירות לצוות הגיוס של כל משרה.'

  // Internal links: on a "what" page the top cities, on a "where" page the top categories
  let topLinks: LandingFacts['top']
  if (hasWhat && !hasWhere) {
    const base = { cluster: q.cluster, category: q.category, industry: q.industry }
    const cities = top(jobs.flatMap(j => j.locations), l => l.citySlug, 6).filter(c => c.n >= 2)
    if (cities.length >= 2) topLinks = { title: 'לפי עיר', links: cities.map(c => ({ href: toHref({ ...base, city: [c.item.citySlug] }), label: `${c.item.cityName} (${c.n})` })) }
  } else if (hasWhere && !hasWhat) {
    const base = { city: q.city, region: q.region }
    const cats = top(jobs, j => j.category.slug || undefined, 6).filter(c => c.n >= 2)
    if (cats.length >= 2) topLinks = { title: 'לפי תחום', links: cats.map(c => ({ href: toHref({ ...base, category: [c.item.category.slug] }), label: `${lx.category(c.item.category.slug) || c.item.category.label} (${c.n})` })) }
  }

  const faqs: Faq[] = []
  const where = `במשרות ${subject}`

  // Salary: only jobs that publish one, in the most common period
  const paid = jobs.filter(j => j.salary && (j.salary.min != null || j.salary.max != null))
  const period = top(paid, j => j.salary!.period, 1)[0]?.item.salary!.period
  const same = paid.filter(j => j.salary!.period === period)
  if (period && same.length >= 2) {
    const lows = same.map(j => j.salary!.min ?? j.salary!.max!)
    const highs = same.map(j => j.salary!.max ?? j.salary!.min!)
    const range = formatSalary({ min: Math.min(...lows), max: Math.max(...highs), period, currency: 'ILS' } as Salary)
    faqs.push({ q: `מה השכר ${where}?`, a: `ב-${same.length} מהמשרות כאן פורסם שכר, בטווח של ${range}. בשאר המשרות השכר נקבע מול צוות הגיוס.` })
  }

  // Experience
  const noExp = jobs.filter(isNoExperience).length
  faqs.push(noExp
    ? { q: `יש משרות ${subject} בלי ניסיון?`, a: `כן. ${noExp === 1 ? `משרה אחת מתוך ${n} מתאימה` : `${noExp} משרות מתוך ${n} מתאימות`} גם בלי ניסיון קודם.`, link: { href: toHref({ ...q, noExperience: true }), label: 'למשרות ללא ניסיון' } }
    : { q: `יש משרות ${subject} בלי ניסיון?`, a: `כרגע כל המשרות כאן מבקשות ניסיון קודם.`, link: { href: toHref({ noExperience: true }), label: 'לכל המשרות ללא ניסיון' } })

  // Shifts and part time
  const shifts = jobs.filter(j => j.employmentType.includes('shifts')).length
  const part = jobs.filter(j => j.employmentType.includes('part_time')).length
  const parts = [shifts && `${shifts === 1 ? 'משרה אחת' : `${shifts} משרות`} במשמרות`, part && `${part === 1 ? 'משרה אחת' : `${part} משרות`} במשרה חלקית`].filter(Boolean)
  faqs.push({
    q: `יש משרות ${subject} במשמרות או במשרה חלקית?`,
    a: parts.length ? `כן: ${parts.map((p, i) => (i ? (/^\d/.test(String(p)) ? 'ו-' : 'ו') + p : p)).join(' ')}. שעות העבודה מפורטות בעמוד של כל משרה.` : 'כרגע אין כאן משרות במשמרות או במשרה חלקית. שעות העבודה מפורטות בעמוד של כל משרה.',
  })

  return { heading: `על משרות ${subject}`, intro, top: topLinks, faqs }
}

export function faqLd(faqs: Faq[]) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/[\u2066-\u2069]/g, '') } })),
  }).replace(/</g, '\\u003c')
}
