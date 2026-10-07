import type { EmploymentType, JobSummary, PostedWithin, Salary, Seniority, SortKey, SuitableFor, WorkModel } from './types'

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  full_time: 'משרה מלאה',
  part_time: 'משרה חלקית',
  shifts: 'משמרות',
  temporary: 'זמנית',
  freelance: 'פרילנס',
  internship: 'התמחות',
  student: 'משרת סטודנט',
}

export const WORK_MODEL_LABELS: Record<WorkModel, string> = {
  onsite: 'מהמשרד',
  hybrid: 'היברידי',
  remote: 'מהבית',
}

export const SENIORITY_LABELS: Record<Seniority, string> = {
  entry: 'ללא ניסיון',
  junior: 'ג׳וניור (1–2 שנים)',
  mid: 'ניסיון בינוני (3–5)',
  senior: 'בכיר (5+)',
  lead: 'ראש צוות',
  manager: 'ניהול',
  executive: 'הנהלה בכירה',
}

export const SUITABLE_LABELS: Record<SuitableFor, string> = {
  students: 'סטודנטים',
  soldiers: 'חיילים משוחררים',
  pensioners: 'גמלאים',
  disability: 'אנשים עם מוגבלות',
  olim: 'עולים חדשים',
}

export const POSTED_LABELS: Record<PostedWithin, string> = {
  '1d': '24 השעות האחרונות',
  '3d': '3 ימים אחרונים',
  '7d': 'השבוע האחרון',
  '30d': 'החודש האחרון',
}

export const SORT_LABELS: Record<SortKey, string> = {
  relevance: 'הכי רלוונטי',
  newest: 'הכי חדש',
  salary: 'שכר גבוה',
  distance: 'הכי קרוב',
}

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

export function companyName(j: Pick<JobSummary, 'company'>) {
  return j.company.confidential ? j.company.displayName : j.company.name
}

export function locationLabel(j: Pick<JobSummary, 'locations' | 'workModel'>) {
  if (j.workModel === 'remote' && j.locations.length === 0) return 'מהבית'
  const names = j.locations.map(l => l.cityName)
  if (names.length <= 2) return names.join(', ')
  return `${names[0]} ועוד ${names.length - 1}`
}

export function isNew(j: Pick<JobSummary, 'publishedAt'>, now = Date.now()) {
  return now - new Date(j.publishedAt).getTime() < 48 * 36e5
}

/** Keep numeric ranges in free text ("08:00–17:00") in reading order inside RTL lines. */
export function isolateRanges(text: string) {
  return text.replace(/\d[\d:.,]*\s*[–\-]\s*\d[\d:.,]*/g, m => `⁦${m}⁩`)
}
