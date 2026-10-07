// FICTIONAL sample data for local development and Vercel previews only.
// Never served in production (see lib/jobs/source.ts). Shapes match the
// Public Jobs API contract so the UI is built against the real thing.

import type { JobDetail, JobLocation, Taxonomy } from './types'

const CITIES: Record<string, Omit<JobLocation, 'address'>> = {
  'tel-aviv': { citySlug: 'tel-aviv', cityName: 'תל אביב-יפו', regionSlug: 'center', regionName: 'מרכז', lat: 32.0853, lng: 34.7818 },
  'petah-tikva': { citySlug: 'petah-tikva', cityName: 'פתח תקווה', regionSlug: 'center', regionName: 'מרכז', lat: 32.0871, lng: 34.8875 },
  'ramat-gan': { citySlug: 'ramat-gan', cityName: 'רמת גן', regionSlug: 'center', regionName: 'מרכז', lat: 32.0684, lng: 34.8248 },
  'rishon-lezion': { citySlug: 'rishon-lezion', cityName: 'ראשון לציון', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.973, lng: 34.7925 },
  'rehovot': { citySlug: 'rehovot', cityName: 'רחובות', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.8928, lng: 34.8113 },
  'herzliya': { citySlug: 'herzliya', cityName: 'הרצליה', regionSlug: 'sharon', regionName: 'שרון', lat: 32.1624, lng: 34.8447 },
  'netanya': { citySlug: 'netanya', cityName: 'נתניה', regionSlug: 'sharon', regionName: 'שרון', lat: 32.3215, lng: 34.8532 },
  'haifa': { citySlug: 'haifa', cityName: 'חיפה', regionSlug: 'haifa', regionName: 'חיפה והקריות', lat: 32.794, lng: 34.9896 },
  'yokneam': { citySlug: 'yokneam', cityName: 'יקנעם', regionSlug: 'north', regionName: 'צפון', lat: 32.6597, lng: 35.1047 },
  'jerusalem': { citySlug: 'jerusalem', cityName: 'ירושלים', regionSlug: 'jerusalem', regionName: 'ירושלים', lat: 31.7683, lng: 35.2137 },
  'beer-sheva': { citySlug: 'beer-sheva', cityName: 'באר שבע', regionSlug: 'south', regionName: 'דרום', lat: 31.252, lng: 34.7915 },
  'ashdod': { citySlug: 'ashdod', cityName: 'אשדוד', regionSlug: 'south', regionName: 'דרום', lat: 31.8044, lng: 34.6553 },
  'modiin': { citySlug: 'modiin', cityName: 'מודיעין', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.8969, lng: 35.0104 },
}

const CATS = {
  finance: { slug: 'finance', label: 'כספים וחשבונאות' },
  tech: { slug: 'tech', label: 'הייטק ופיתוח תוכנה' },
  sales: { slug: 'sales', label: 'מכירות' },
  admin: { slug: 'admin', label: 'אדמיניסטרציה ומשרד' },
  logistics: { slug: 'logistics', label: 'לוגיסטיקה ושרשרת אספקה' },
  engineering: { slug: 'engineering', label: 'הנדסה' },
  hr: { slug: 'hr', label: 'משאבי אנוש וגיוס' },
  marketing: { slug: 'marketing', label: 'שיווק ודיגיטל' },
  service: { slug: 'service', label: 'שירות לקוחות' },
  industry: { slug: 'industry', label: 'ייצור ותעשייה' },
  health: { slug: 'health', label: 'רפואה ובריאות' },
} as const

const SUB = {
  bookkeeping: { slug: 'bookkeeping', label: 'הנהלת חשבונות' },
  payroll: { slug: 'payroll', label: 'חשבות שכר' },
  controller: { slug: 'controller', label: 'כלכלה ובקרה' },
  backend: { slug: 'backend', label: 'Backend' },
  fullstack: { slug: 'fullstack', label: 'Full Stack' },
  qa: { slug: 'qa', label: 'QA' },
  data: { slug: 'data', label: 'דאטה ו-BI' },
  b2b: { slug: 'b2b', label: 'מכירות B2B' },
  field: { slug: 'field-sales', label: 'מכירות שטח' },
  office: { slug: 'office', label: 'ניהול משרד' },
  warehouse: { slug: 'warehouse', label: 'מחסן והפצה' },
  procurement: { slug: 'procurement', label: 'רכש' },
  mechanical: { slug: 'mechanical', label: 'הנדסת מכונות' },
  electrical: { slug: 'electrical', label: 'הנדסת חשמל' },
  recruiting: { slug: 'recruiting', label: 'גיוס' },
  digital: { slug: 'digital', label: 'שיווק דיגיטלי' },
  support: { slug: 'support', label: 'תמיכה טכנית' },
  production: { slug: 'production', label: 'ניהול ייצור' },
  nursing: { slug: 'nursing', label: 'סיעוד' },
} as const

type Co = JobDetail['company']
const co = (id: string, name: string, industry: string, sizeRange: string, hq: string, about: string, website?: string): Co =>
  ({ confidential: false, id, name, industry, sizeRange, hq, about, website })
const anon = (displayName: string, industry?: string, sizeRange?: string): Co => ({ confidential: true, displayName, industry, sizeRange })

const COMPANIES = {
  barak: co('c-barak', 'ברק ושות׳ רואי חשבון', 'שירותים פיננסיים', '51-200', 'פתח תקווה', 'משרד רואי חשבון ותיק שמלווה כ-400 עסקים בינוניים במרכז הארץ.'),
  logitek: co('c-logitek', 'לוגיטק פתרונות', 'לוגיסטיקה', '201-500', 'ראשון לציון', 'חברת הפצה ולוגיסטיקה עם מרכזי הפצה בראשון לציון ובאשדוד.'),
  galor: co('c-galor', 'גל-אור נכסים', 'נדל״ן', '11-50', 'תל אביב-יפו', 'חברת ייזום וניהול נכסים מסחריים.'),
  nova: co('c-nova', 'Novatech', 'הייטק · SaaS', '201-500', 'הרצליה', 'פלטפורמת SaaS לניהול תפעול לעסקים, עם לקוחות ב-30 מדינות.'),
  meshek: co('c-meshek', 'משק מזון השרון', 'מזון ומשקאות', '501-1000', 'נתניה', 'יצרנית מוצרי חלב ומאפה, מפעל ומרכז לוגיסטי בנתניה.'),
  orbit: co('c-orbit', 'Orbit Systems', 'אלקטרוניקה', '1000+', 'יקנעם', 'פיתוח וייצור מערכות אלקטרו-אופטיות.'),
  shaham: co('c-shaham', 'שחם ביטוח', 'ביטוח ופיננסים', '201-500', 'רמת גן', 'סוכנות ביטוח ופיננסים עם מוקד שירות ארצי.'),
  hadar: co('c-hadar', 'מרכז רפואי הדר', 'בריאות', '1000+', 'ירושלים', 'מרכז רפואי אזורי עם 600 מיטות.'),
  pixel: co('c-pixel', 'Pixel & Co', 'שיווק ופרסום', '11-50', 'תל אביב-יפו', 'סטודיו לשיווק דיגיטלי ותוכן.'),
}

const HOUR = 36e5
const now = Date.now()
const ago = (h: number) => new Date(now - h * HOUR).toISOString()
const inDays = (d: number) => new Date(now + d * 24 * HOUR).toISOString()

let n = 4810
type Seed = Omit<JobDetail, 'id' | 'slug' | 'jobNumber' | 'updatedAt' | 'status' | 'apply' | 'teaser' | 'description'> & {
  slugBase: string
  teaser?: string
  description?: string
  apply?: JobDetail['apply']
}

function job(seed: Seed): JobDetail {
  n += 1
  const { slugBase, ...rest } = seed
  const city = rest.locations[0]?.citySlug ?? 'remote'
  return {
    ...rest,
    id: `job-${n}`,
    jobNumber: String(n),
    slug: `${slugBase}-${city}-${n}`,
    updatedAt: rest.publishedAt,
    status: 'open',
    teaser: seed.teaser ?? rest.requirements.slice(0, 2).join(' · '),
    description: seed.description ?? `<p>${seed.teaser ?? ''}</p>`,
    apply: seed.apply ?? { method: 'hiro', requiresCv: true },
  }
}

const L = (slug: keyof typeof CITIES, address?: string): JobLocation => ({ ...CITIES[slug], address })

export const FIXTURE_JOBS: JobDetail[] = [
  job({
    slugBase: 'bookkeeper-level-3', title: 'מנהל/ת חשבונות סוג 3', company: COMPANIES.barak,
    category: CATS.finance, subcategory: SUB.bookkeeping, locations: [L('petah-tikva', 'רח׳ אבא הלל 12')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'mid', experienceYearsMin: 3,
    salary: { min: 12000, max: 15000, currency: 'ILS', period: 'month' },
    teaser: 'הנהלת חשבונות מלאה לתיק של כ-40 לקוחות עסקיים, עד מאזן. יום עבודה אחד מהבית.',
    description: '<p>משרד ברק ושות׳ מגייס מנהל/ת חשבונות סוג 3 לניהול תיק לקוחות עסקיים, מהקליטה ועד הכנה למאזן.</p><p>עבודה בצוות של 6 מנהלות חשבונות, בליווי צמוד של שותף אחראי. משרה מלאה, עם יום עבודה אחד מהבית אחרי תקופת חפיפה.</p>',
    responsibilities: ['הנהלת חשבונות מלאה לכ-40 לקוחות עסקיים', 'התאמות בנקים, כרטיסי ספקים ולקוחות', 'הכנת דוחות מע״מ ומקדמות מס', 'הכנת החומר למאזן מול רואה החשבון'],
    requirements: ['תעודת מנהל/ת חשבונות סוג 3', 'ניסיון של 3 שנים לפחות במשרד רו״ח', 'שליטה ב-Excel ברמה גבוהה'],
    niceToHave: ['היכרות עם תוכנת חשבשבת או Priority', 'ניסיון בעבודה עם חברות בע״מ'],
    benefits: ['קרן השתלמות מהיום הראשון', 'יום עבודה מהבית', 'חניה צמודה', 'ארוחות צהריים מסובסדות'],
    skills: [{ tagId: 't1', label: 'הנהלת חשבונות סוג 3' }, { tagId: 't2', label: 'חשבשבת' }, { tagId: 't3', label: 'התאמות בנקים' }, { tagId: 't4', label: 'Excel' }],
    education: { level: 'certificate', field: 'הנהלת חשבונות' }, hoursDescription: 'א׳–ה׳ 08:00–17:00', startDate: 'immediate',
    recruiter: { displayName: 'נועה', title: 'רכזת גיוס' }, tags: ['hot'], publishedAt: ago(5), validThrough: inDays(30),
    apply: { method: 'hiro', requiresCv: true, questions: [
      { id: 'q1', type: 'yes_no', label: 'האם יש לך תעודת מנהל/ת חשבונות סוג 3?', required: true },
      { id: 'q2', type: 'text', label: 'ציפיות שכר (ברוטו לחודש)', required: false },
    ] },
  }),
  job({
    slugBase: 'payroll-accountant', title: 'חשב/ת שכר', company: COMPANIES.logitek,
    category: CATS.finance, subcategory: SUB.payroll, locations: [L('rishon-lezion')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    salary: { min: 11000, max: 13500, currency: 'ILS', period: 'month' },
    teaser: 'הפקת שכר לכ-350 עובדים, כולל עובדים במשמרות. עבודה מול מחלקת משאבי אנוש וקופות גמל.',
    responsibilities: ['הפקת שכר חודשית לכ-350 עובדים', 'קליטת עובדים ודיווח לקופות', 'מענה לשאלות עובדים בנושאי שכר'],
    requirements: ['ניסיון של שנתיים לפחות בחשבות שכר', 'היכרות עם חוקי העבודה', 'שליטה ב-Excel'],
    niceToHave: ['ניסיון עם תוכנת שכר חילן או מיכפל'], benefits: ['קרן השתלמות', 'חניה', 'הסעות מתחנת הרכבת'],
    skills: [{ tagId: 't5', label: 'חשבות שכר' }, { tagId: 't6', label: 'חילן' }], publishedAt: ago(30), validThrough: inDays(25),
  }),
  job({
    slugBase: 'controller', title: 'כלכלן/ית ובקר/ית תקציב', company: anon('חברת תעשייה מובילה במרכז', 'תעשייה', '1000+'),
    category: CATS.finance, subcategory: SUB.controller, locations: [L('petah-tikva')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'senior', experienceYearsMin: 4,
    teaser: 'בקרת תקציב ותמחיר לחטיבת הייצור, עבודה מול מנהלי מפעלים והנהלת הכספים.',
    requirements: ['תואר ראשון בכלכלה או חשבונאות', 'ניסיון של 4 שנים בבקרה ותקציב', 'שליטה מלאה ב-Excel'],
    niceToHave: ['ניסיון ב-SAP', 'ניסיון בחברה תעשייתית'], benefits: ['רכב צמוד', 'קרן השתלמות', 'בונוס שנתי'],
    skills: [{ tagId: 't7', label: 'בקרת תקציב' }, { tagId: 't8', label: 'SAP' }, { tagId: 't4', label: 'Excel' }], publishedAt: ago(70), validThrough: inDays(20),
  }),
  job({
    slugBase: 'backend-developer', title: 'Backend Developer (Node.js)', company: COMPANIES.nova,
    category: CATS.tech, subcategory: SUB.backend, locations: [L('herzliya')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'senior', experienceYearsMin: 4,
    salary: { min: 32000, max: 40000, currency: 'ILS', period: 'month' },
    teaser: 'פיתוח שירותים בקנה מידה גדול בצוות התשתיות. Node.js, PostgreSQL ו-AWS.',
    responsibilities: ['תכנון ופיתוח מיקרו-שירותים', 'שיפור ביצועים ואמינות', 'עבודה צמודה עם צוותי מוצר'],
    requirements: ['4+ שנות ניסיון בפיתוח Backend', 'ניסיון ב-Node.js ו-TypeScript', 'ניסיון עם בסיסי נתונים רלציוניים'],
    niceToHave: ['ניסיון עם Kubernetes', 'ניסיון ב-Event-driven architecture'], benefits: ['אופציות', 'קרן השתלמות', 'ימי עבודה מהבית', 'תקציב למידה'],
    skills: [{ tagId: 't9', label: 'Node.js' }, { tagId: 't10', label: 'TypeScript' }, { tagId: 't11', label: 'PostgreSQL' }, { tagId: 't12', label: 'AWS' }],
    languages: [{ language: 'en', level: 'high' }], tags: ['urgent'], publishedAt: ago(14), validThrough: inDays(40),
    recruiter: { displayName: 'יואב', title: 'Talent Partner' },
  }),
  job({
    slugBase: 'fullstack-developer', title: 'Full Stack Developer (React + Python)', company: COMPANIES.nova,
    category: CATS.tech, subcategory: SUB.fullstack, locations: [L('herzliya')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'פיתוח פיצ׳רים מקצה לקצה בצוות מוצר קטן, מהעיצוב ועד הפרודקשן.',
    requirements: ['3+ שנות ניסיון בפיתוח Full Stack', 'React ו-Python', 'אנגלית ברמה גבוהה'],
    benefits: ['אופציות', 'קרן השתלמות', 'ארוחות'], skills: [{ tagId: 't13', label: 'React' }, { tagId: 't14', label: 'Python' }],
    publishedAt: ago(52), validThrough: inDays(35),
  }),
  job({
    slugBase: 'qa-engineer', title: 'QA Engineer', company: anon('סטארט-אפ בתחום הפינטק', 'הייטק · פינטק', '51-200'),
    category: CATS.tech, subcategory: SUB.qa, locations: [L('tel-aviv')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'בדיקות ידניות ואוטומציה למערכת תשלומים. מתאים גם לבוגרי קורס QA עם ניסיון ראשון.',
    requirements: ['שנת ניסיון לפחות ב-QA', 'היכרות עם SQL', 'יכולת כתיבת תסריטי בדיקה'],
    niceToHave: ['ניסיון באוטומציה עם Playwright או Selenium'], skills: [{ tagId: 't15', label: 'QA' }, { tagId: 't16', label: 'SQL' }, { tagId: 't17', label: 'Playwright' }],
    publishedAt: ago(96), validThrough: inDays(25),
  }),
  job({
    slugBase: 'data-analyst', title: 'אנליסט/ית נתונים', company: COMPANIES.shaham,
    category: CATS.tech, subcategory: SUB.data, locations: [L('ramat-gan')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'junior', experienceYearsMin: 1,
    salary: { min: 14000, max: 18000, currency: 'ILS', period: 'month' },
    teaser: 'בניית דשבורדים וניתוחים לחטיבת השירות, עבודה מול הנהלה בכירה.',
    requirements: ['תואר ראשון רלוונטי', 'שליטה ב-SQL', 'ניסיון עם Power BI או Tableau'],
    skills: [{ tagId: 't16', label: 'SQL' }, { tagId: 't18', label: 'Power BI' }], publishedAt: ago(120), validThrough: inDays(15),
  }),
  job({
    slugBase: 'b2b-account-manager', title: 'מנהל/ת לקוחות עסקיים', company: COMPANIES.logitek,
    category: CATS.sales, subcategory: SUB.b2b, locations: [L('rishon-lezion'), L('ashdod')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    salary: { min: 10000, max: 16000, currency: 'ILS', period: 'month', isEstimate: true },
    teaser: 'ניהול תיק של כ-60 לקוחות עסקיים והרחבת פעילות. שכר בסיס + עמלות.',
    requirements: ['ניסיון של שנתיים במכירות B2B', 'יכולת ניהול משא ומתן', 'רישיון נהיגה'],
    drivingLicense: { required: true, type: 'B' }, benefits: ['רכב חברה', 'עמלות ללא תקרה', 'טלפון נייד'],
    skills: [{ tagId: 't19', label: 'מכירות B2B' }, { tagId: 't20', label: 'CRM' }], publishedAt: ago(40), validThrough: inDays(30),
  }),
  job({
    slugBase: 'field-sales-rep', title: 'נציג/ת מכירות שטח', company: COMPANIES.meshek,
    category: CATS.sales, subcategory: SUB.field, locations: [L('netanya'), L('herzliya')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0,
    teaser: 'מכירות לרשתות ולמכולות באזור השרון. לא נדרש ניסיון, יש הכשרה מלאה.',
    requirements: ['רישיון נהיגה ב׳', 'יחסי אנוש מצוינים', 'זמינות למשרה מלאה'],
    drivingLicense: { required: true, type: 'B' }, benefits: ['רכב חברה', 'בונוסים חודשיים', 'מוצרי החברה'],
    tags: ['no_experience', 'hot'], publishedAt: ago(8), validThrough: inDays(30),
  }),
  job({
    slugBase: 'office-manager', title: 'מנהל/ת משרד', company: COMPANIES.galor,
    category: CATS.admin, subcategory: SUB.office, locations: [L('tel-aviv', 'מגדלי עזריאלי')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    salary: { min: 10000, max: 12000, currency: 'ILS', period: 'month' },
    teaser: 'ניהול שוטף של משרד קטן ודינמי: ספקים, יומנים, גבייה ותמיכה בהנהלה.',
    requirements: ['ניסיון של 3 שנים בניהול משרד', 'שליטה ב-Office', 'סדר וארגון'],
    benefits: ['קרן השתלמות', 'אווירה משפחתית'], publishedAt: ago(26), validThrough: inDays(20),
  }),
  job({
    slugBase: 'admin-student', title: 'עוזר/ת אדמיניסטרטיבי/ת (משרת סטודנט)', company: COMPANIES.shaham,
    category: CATS.admin, subcategory: SUB.office, locations: [L('ramat-gan')],
    employmentType: ['part_time', 'student'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0,
    salary: { min: 45, max: 50, currency: 'ILS', period: 'hour' },
    teaser: '3 ימים בשבוע, גמישות בתקופת מבחנים. מתאים לסטודנטים לשנה ראשונה ושנייה.',
    requirements: ['סטודנט/ית בתואר ראשון', 'זמינות ל-3 ימים בשבוע', 'שליטה ב-Office'],
    tags: ['students', 'no_experience'], publishedAt: ago(60), validThrough: inDays(45),
  }),
  job({
    slugBase: 'warehouse-worker', title: 'עובד/ת מחסן ומלגזן/ית', company: COMPANIES.logitek,
    category: CATS.logistics, subcategory: SUB.warehouse, locations: [L('ashdod')],
    employmentType: ['full_time', 'shifts'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0,
    salary: { min: 42, max: 48, currency: 'ILS', period: 'hour' },
    teaser: 'עבודה במרכז ההפצה באשדוד, משמרות בוקר וערב. הסעות מאשקלון וקריית גת.',
    requirements: ['רישיון מלגזה (יתרון, אפשר לקבל הכשרה)', 'כושר גופני טוב', 'זמינות למשמרות'],
    benefits: ['הסעות', 'ארוחה חמה', 'בונוס התמדה'], tags: ['urgent', 'no_experience'], positionsCount: 8, startDate: 'immediate',
    publishedAt: ago(3), validThrough: inDays(30),
  }),
  job({
    slugBase: 'procurement-buyer', title: 'קניין/ית רכש', company: COMPANIES.orbit,
    category: CATS.logistics, subcategory: SUB.procurement, locations: [L('yokneam')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'רכש רכיבים אלקטרוניים מספקים בארץ ובחו״ל, עבודה מול תכנון ייצור.',
    requirements: ['ניסיון של 3 שנים ברכש בחברה יצרנית', 'אנגלית ברמה גבוהה', 'ניסיון ב-ERP'],
    languages: [{ language: 'en', level: 'high' }], skills: [{ tagId: 't21', label: 'רכש' }, { tagId: 't22', label: 'Priority' }],
    publishedAt: ago(140), validThrough: inDays(15),
  }),
  job({
    slugBase: 'mechanical-engineer', title: 'מהנדס/ת מכונות', company: COMPANIES.orbit,
    category: CATS.engineering, subcategory: SUB.mechanical, locations: [L('yokneam')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'senior', experienceYearsMin: 5,
    teaser: 'תכן מכני של מערכות אופטיות מוטסות, מהקונספט ועד העברה לייצור.',
    requirements: ['תואר ראשון בהנדסת מכונות', '5 שנות ניסיון בתכן מכני', 'SolidWorks ברמה גבוהה'],
    skills: [{ tagId: 't23', label: 'SolidWorks' }, { tagId: 't24', label: 'תכן מכני' }], benefits: ['רכב צמוד', 'קרן השתלמות', 'הסעות מחיפה'],
    publishedAt: ago(200), validThrough: inDays(30),
  }),
  job({
    slugBase: 'electrical-engineer', title: 'מהנדס/ת חשמל, מערכות הספק', company: anon('חברת אנרגיה ציבורית', 'אנרגיה', '1000+'),
    category: CATS.engineering, subcategory: SUB.electrical, locations: [L('haifa')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'תכנון ופיקוח על מערכות הספק בתחנות משנה באזור הצפון.',
    requirements: ['תואר ראשון בהנדסת חשמל', 'רישיון חשמלאי מהנדס', 'ניסיון של 3 שנים'],
    drivingLicense: { required: true, type: 'B' }, publishedAt: ago(90), validThrough: inDays(30),
  }),
  job({
    slugBase: 'recruiter', title: 'רכז/ת גיוס', company: anon('חברת השמה בתחום הפיננסים', 'השמה וגיוס', '11-50'),
    category: CATS.hr, subcategory: SUB.recruiting, locations: [L('tel-aviv')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'junior', experienceYearsMin: 1,
    salary: { min: 9000, max: 11000, currency: 'ILS', period: 'month' },
    teaser: 'גיוס לתפקידי כספים לחברות לקוח. עבודה עם מערכת גיוס חכמה, בסיס + בונוסים על השמות.',
    requirements: ['שנת ניסיון בגיוס או במכירות', 'יכולת עבודה בסביבה דינמית'],
    tags: ['new'], publishedAt: ago(18), validThrough: inDays(30),
  }),
  job({
    slugBase: 'digital-marketing-manager', title: 'מנהל/ת שיווק דיגיטלי', company: COMPANIES.pixel,
    category: CATS.marketing, subcategory: SUB.digital, locations: [L('tel-aviv')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'senior', experienceYearsMin: 4,
    salary: { min: 16000, max: 20000, currency: 'ILS', period: 'month' },
    teaser: 'ניהול קמפיינים ממומנים ל-10 לקוחות, תקציבים של מאות אלפי שקלים בחודש.',
    requirements: ['4 שנות ניסיון בקמפיינים ממומנים', 'Google Ads ו-Meta Ads', 'יכולת אנליטית'],
    skills: [{ tagId: 't25', label: 'Google Ads' }, { tagId: 't26', label: 'Meta Ads' }, { tagId: 't27', label: 'GA4' }],
    publishedAt: ago(48), validThrough: inDays(30),
  }),
  job({
    slugBase: 'customer-service-rep', title: 'נציג/ת שירות לקוחות', company: COMPANIES.shaham,
    category: CATS.service, subcategory: SUB.support, locations: [L('ramat-gan')],
    employmentType: ['full_time', 'part_time', 'shifts'], workModel: 'hybrid', seniority: 'entry', experienceYearsMin: 0,
    salary: { min: 40, max: 44, currency: 'ILS', period: 'hour' },
    teaser: 'מענה טלפוני ובצ׳אט ללקוחות. אחרי חודשיים אפשר לעבוד חלק מהשבוע מהבית.',
    requirements: ['יחסי אנוש מצוינים', 'שליטה בעברית ובאנגלית', 'זמינות ל-3 משמרות לפחות'],
    tags: ['no_experience', 'students'], positionsCount: 12, publishedAt: ago(2), validThrough: inDays(30),
  }),
  job({
    slugBase: 'production-shift-manager', title: 'מנהל/ת משמרת ייצור', company: COMPANIES.meshek,
    category: CATS.industry, subcategory: SUB.production, locations: [L('netanya')],
    employmentType: ['full_time', 'shifts'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'ניהול משמרת של 25 עובדים בקו הייצור, אחריות על תפוקה, איכות ובטיחות.',
    requirements: ['ניסיון של 3 שנים בניהול עובדים בייצור', 'זמינות למשמרות'], benefits: ['ארוחות', 'בונוס משמרות'],
    publishedAt: ago(75), validThrough: inDays(30),
  }),
  job({
    slugBase: 'registered-nurse', title: 'אח/ות מוסמך/ת', company: COMPANIES.hadar,
    category: CATS.health, subcategory: SUB.nursing, locations: [L('jerusalem')],
    employmentType: ['full_time', 'part_time', 'shifts'], workModel: 'onsite', seniority: 'junior',
    teaser: 'מחלקה פנימית, אפשרות למשרה חלקית. מענק התמדה למצטרפים.',
    requirements: ['רישיון אח/ות מוסמך/ת בתוקף'], benefits: ['מענק התמדה', 'מסלול התמחות', 'חניה'],
    tags: ['hot'], publishedAt: ago(22), validThrough: inDays(60),
  }),
  job({
    slugBase: 'bookkeeper-level-2', title: 'מנהל/ת חשבונות סוג 2 (חלקית)', company: COMPANIES.galor,
    category: CATS.finance, subcategory: SUB.bookkeeping, locations: [L('tel-aviv')],
    employmentType: ['part_time'], workModel: 'hybrid', seniority: 'junior', experienceYearsMin: 1,
    teaser: '4 ימים בשבוע, קליטת חשבוניות, התאמות והכנה לרו״ח חיצוני.',
    requirements: ['תעודת מנהל/ת חשבונות סוג 2 לפחות', 'שנת ניסיון'], publishedAt: ago(160), validThrough: inDays(10),
  }),
  job({
    slugBase: 'remote-support-engineer', title: 'מהנדס/ת תמיכה (מהבית)', company: COMPANIES.nova,
    category: CATS.service, subcategory: SUB.support, locations: [],
    employmentType: ['full_time'], workModel: 'remote', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'תמיכה טכנית ללקוחות SaaS באנגלית, עבודה מלאה מהבית.',
    requirements: ['אנגלית ברמת שפת אם', 'הבנה טכנית', 'שנת ניסיון בתמיכה'], languages: [{ language: 'en', level: 'native' }],
    publishedAt: ago(36), validThrough: inDays(30),
  }),
  job({
    slugBase: 'logistics-coordinator', title: 'מתאם/ת לוגיסטיקה ויבוא', company: anon('יבואנית מוצרי צריכה', 'מסחר ויבוא', '51-200'),
    category: CATS.logistics, subcategory: SUB.procurement, locations: [L('modiin')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'תיאום משלוחי יבוא מול עמילי מכס ומשלחים, מעקב מלאי.',
    requirements: ['שנת ניסיון בלוגיסטיקה או יבוא', 'אנגלית טובה'], publishedAt: ago(110), validThrough: inDays(20),
  }),
  job({
    slugBase: 'hr-generalist', title: 'HR Generalist', company: COMPANIES.orbit,
    category: CATS.hr, subcategory: SUB.recruiting, locations: [L('yokneam')],
    employmentType: ['full_time'], workModel: 'hybrid', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'ליווי מחזור חיי העובד לכ-400 עובדים באתר יקנעם.',
    requirements: ['3 שנות ניסיון במשאבי אנוש', 'תואר ראשון במדעי ההתנהגות או ניהול'], publishedAt: ago(180), validThrough: inDays(25),
  }),
  job({
    slugBase: 'sales-rep-beer-sheva', title: 'נציג/ת מכירות טלפוניות', company: COMPANIES.shaham,
    category: CATS.sales, subcategory: SUB.b2b, locations: [L('beer-sheva')],
    employmentType: ['full_time', 'part_time'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0,
    salary: { min: 38, max: 60, currency: 'ILS', period: 'hour', isEstimate: true },
    teaser: 'מכירת מוצרי ביטוח ללקוחות קיימים, שכר בסיס גבוה + עמלות.',
    requirements: ['כושר שכנוע', 'זמינות למשרה מלאה או חלקית'], tags: ['no_experience'], publishedAt: ago(12), validThrough: inDays(30),
  }),
  job({
    slugBase: 'medical-secretary', title: 'מזכיר/ה רפואי/ת', company: COMPANIES.hadar,
    category: CATS.health, subcategory: SUB.nursing, locations: [L('jerusalem')],
    employmentType: ['part_time', 'shifts'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0,
    teaser: 'קבלת מטופלים ותיאום תורים במרפאות החוץ.', requirements: ['שליטה במחשב', 'סבלנות ושירותיות'],
    tags: ['no_experience'], publishedAt: ago(260), validThrough: inDays(15),
  }),
  job({
    slugBase: 'rehovot-lab-tech', title: 'טכנאי/ת מעבדה', company: anon('חברת ביוטק ברחובות', 'ביוטק', '51-200'),
    category: CATS.health, subcategory: SUB.nursing, locations: [L('rehovot')],
    employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'עבודת מעבדה בצוות מחקר ופיתוח, הכנת דוגמאות ותיעוד.', requirements: ['תואר ראשון במדעי החיים', 'ניסיון במעבדה'],
    publishedAt: ago(320), validThrough: inDays(10),
  }),
]

export const FIXTURE_TAXONOMY_LABELS = { categories: CATS, cities: CITIES }

export function fixtureTaxonomy(): Taxonomy {
  const catCount = new Map<string, number>()
  const subCount = new Map<string, number>()
  const cityCount = new Map<string, number>()
  for (const j of FIXTURE_JOBS) {
    catCount.set(j.category.slug, (catCount.get(j.category.slug) ?? 0) + 1)
    if (j.subcategory) subCount.set(j.subcategory.slug, (subCount.get(j.subcategory.slug) ?? 0) + 1)
    for (const l of j.locations) cityCount.set(l.citySlug, (cityCount.get(l.citySlug) ?? 0) + 1)
  }
  const regions = new Map<string, Taxonomy['regions'][number]>()
  for (const c of Object.values(CITIES)) {
    const r = regions.get(c.regionSlug) ?? { slug: c.regionSlug, label: c.regionName, count: 0, cities: [] }
    const count = cityCount.get(c.citySlug) ?? 0
    r.count += count
    r.cities.push({ slug: c.citySlug, label: c.cityName, count, lat: c.lat, lng: c.lng })
    regions.set(c.regionSlug, r)
  }
  return {
    categories: Object.values(CATS).map(c => ({
      ...c,
      count: catCount.get(c.slug) ?? 0,
      subcategories: Object.values(SUB)
        .filter(s => FIXTURE_JOBS.some(j => j.category.slug === c.slug && j.subcategory?.slug === s.slug))
        .map(s => ({ ...s, count: subCount.get(s.slug) ?? 0 })),
    })),
    regions: [...regions.values()],
  }
}
