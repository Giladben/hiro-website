// FICTIONAL stand-in for the Hiro Public Jobs API, for local development and
// Vercel previews only. Never served in production (see lib/jobs/source.ts).
// This file plays the role of the API: it is the only place in the site where
// catalogs exist, and the UI reads them through GET /taxonomy like the real thing.

import type { JobDetail, JobLocation, Labeled, Publisher, Taxonomy } from './types'

/* ───────── Catalogs (in production: Hiro admin → GET /taxonomy) ───────── */

const CLUSTERS: (Labeled & { categories: (Labeled & { synonyms?: string[] })[] })[] = [
  { slug: 'industry', label: 'תעשייה', categories: [
    { slug: 'production-worker', label: 'עובדי ייצור', synonyms: ['עובד/ת ייצור', 'פועל/ת ייצור', 'עובד/ת קו'] },
    { slug: 'machine-operator', label: 'מפעילי מכונות ו-CNC', synonyms: ['מפעיל/ת מכונה', 'חרט/ת', 'CNC'] },
    { slug: 'quality-control', label: 'בקרת איכות', synonyms: ['בודק/ת איכות', 'QC'] },
    { slug: 'shift-management', label: 'ניהול משמרת וייצור', synonyms: ['מנהל/ת משמרת', 'ראש/ת צוות ייצור'] },
    { slug: 'maintenance', label: 'אחזקה וחשמל', synonyms: ['טכנאי/ת אחזקה', 'חשמלאי/ת'] },
  ] },
  { slug: 'logistics', label: 'לוגיסטיקה', categories: [
    { slug: 'warehouse', label: 'מחסנאות וליקוט', synonyms: ['מחסנאי/ת', 'מלקט/ת', 'ליקוט'] },
    { slug: 'forklift', label: 'מלגזנות', synonyms: ['מלגזן/ית', 'נהג/ת מלגזה'] },
    { slug: 'delivery-drivers', label: 'נהגי הפצה', synonyms: ['נהג/ת', 'נהג/ת חלוקה', 'נהג משאית'] },
    { slug: 'supply-chain', label: 'תפעול ושרשרת אספקה', synonyms: ['מתאם/ת לוגיסטיקה', 'רכש', 'יבוא'] },
  ] },
  { slug: 'retail', label: 'קמעונאות', categories: [
    { slug: 'store-sales', label: 'מכירות בחנות', synonyms: ['מוכר/ת', 'נציג/ת מכירות'] },
    { slug: 'cashier', label: 'קופה ושירות', synonyms: ['קופאי/ת', 'נציג/ת שירות'] },
    { slug: 'branch-management', label: 'ניהול סניף', synonyms: ['מנהל/ת סניף', 'סגן/ית מנהל/ת'] },
    { slug: 'field-sales', label: 'מכירות שטח', synonyms: ['איש/אשת מכירות', 'סוכן/ת שטח'] },
  ] },
  { slug: 'automotive', label: 'רכב', categories: [
    { slug: 'mechanic', label: 'מכונאות רכב', synonyms: ['מכונאי/ת', 'טכנאי/ת רכב'] },
    { slug: 'service-advisor', label: 'ייעוץ שירות', synonyms: ['יועץ/ת שירות', 'קבלת רכבים'] },
    { slug: 'car-sales', label: 'מכירת רכב', synonyms: ['איש/אשת מכירות רכב'] },
    { slug: 'parts', label: 'חלפים', synonyms: ['מחסנאי/ת חלפים'] },
  ] },
  { slug: 'pharma', label: 'פארמה', categories: [
    { slug: 'pharma-production', label: 'ייצור פארמה', synonyms: ['מפעיל/ת ייצור פארמה', 'עובד/ת חדר נקי'] },
    { slug: 'pharma-qa', label: 'אבטחת איכות', synonyms: ['QA', 'אבטחת איכות'] },
    { slug: 'lab', label: 'מעבדה', synonyms: ['לבורנט/ית', 'טכנאי/ת מעבדה'] },
  ] },
  { slug: 'construction', label: 'בנייה', categories: [
    { slug: 'site-management', label: 'ניהול עבודה', synonyms: ['מנהל/ת עבודה', 'מנהל/ת פרויקט'] },
    { slug: 'civil-engineering', label: 'הנדסה אזרחית', synonyms: ['מהנדס/ת בניין', 'מהנדס/ת אזרחי/ת'] },
    { slug: 'skilled-trades', label: 'בעלי מקצוע', synonyms: ['טייח/ת', 'רצף/ת', 'אינסטלטור/ית'] },
    { slug: 'safety', label: 'בטיחות', synonyms: ['ממונה בטיחות', 'עוזר/ת בטיחות'] },
  ] },
]

const INDUSTRIES: Labeled[] = [
  { slug: 'manufacturing', label: 'ייצור ומפעלים' },
  { slug: 'food', label: 'מזון ומשקאות' },
  { slug: 'pharma', label: 'פארמה וקוסמטיקה' },
  { slug: 'automotive', label: 'רכב' },
  { slug: 'retail', label: 'קמעונאות ורשתות' },
  { slug: 'logistics', label: 'לוגיסטיקה והפצה' },
  { slug: 'construction', label: 'בנייה ונדל״ן' },
  { slug: 'defense', label: 'ביטחוני' },
]

const CITIES: Record<string, Omit<JobLocation, 'address'>> = {
  'petah-tikva': { citySlug: 'petah-tikva', cityName: 'פתח תקווה', regionSlug: 'center', regionName: 'מרכז', lat: 32.0871, lng: 34.8875 },
  'rosh-haayin': { citySlug: 'rosh-haayin', cityName: 'ראש העין', regionSlug: 'center', regionName: 'מרכז', lat: 32.0956, lng: 34.9567 },
  'holon': { citySlug: 'holon', cityName: 'חולון', regionSlug: 'center', regionName: 'מרכז', lat: 32.0158, lng: 34.7874 },
  'airport-city': { citySlug: 'airport-city', cityName: 'איירפורט סיטי', regionSlug: 'center', regionName: 'מרכז', lat: 32.0, lng: 34.9 },
  'rishon-lezion': { citySlug: 'rishon-lezion', cityName: 'ראשון לציון', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.973, lng: 34.7925 },
  'rehovot': { citySlug: 'rehovot', cityName: 'רחובות', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.8928, lng: 34.8113 },
  'modiin': { citySlug: 'modiin', cityName: 'מודיעין', regionSlug: 'shfela', regionName: 'שפלה', lat: 31.8969, lng: 35.0104 },
  'netanya': { citySlug: 'netanya', cityName: 'נתניה', regionSlug: 'sharon', regionName: 'שרון', lat: 32.3215, lng: 34.8532 },
  'kfar-saba': { citySlug: 'kfar-saba', cityName: 'כפר סבא', regionSlug: 'sharon', regionName: 'שרון', lat: 32.1782, lng: 34.9076 },
  'haifa': { citySlug: 'haifa', cityName: 'חיפה', regionSlug: 'haifa', regionName: 'חיפה והקריות', lat: 32.794, lng: 34.9896 },
  'kiryat-ata': { citySlug: 'kiryat-ata', cityName: 'קריית אתא', regionSlug: 'haifa', regionName: 'חיפה והקריות', lat: 32.8058, lng: 35.1059 },
  'karmiel': { citySlug: 'karmiel', cityName: 'כרמיאל', regionSlug: 'north', regionName: 'צפון', lat: 32.9186, lng: 35.2951 },
  'jerusalem': { citySlug: 'jerusalem', cityName: 'ירושלים', regionSlug: 'jerusalem', regionName: 'ירושלים', lat: 31.7683, lng: 35.2137 },
  'beit-shemesh': { citySlug: 'beit-shemesh', cityName: 'בית שמש', regionSlug: 'jerusalem', regionName: 'ירושלים', lat: 31.7497, lng: 34.9886 },
  'ashdod': { citySlug: 'ashdod', cityName: 'אשדוד', regionSlug: 'south', regionName: 'דרום', lat: 31.8044, lng: 34.6553 },
  'beer-sheva': { citySlug: 'beer-sheva', cityName: 'באר שבע', regionSlug: 'south', regionName: 'דרום', lat: 31.252, lng: 34.7915 },
  'kiryat-gat': { citySlug: 'kiryat-gat', cityName: 'קריית גת', regionSlug: 'south', regionName: 'דרום', lat: 31.6100, lng: 34.7642 },
}

const ENUMS = {
  employmentTypes: [
    { value: 'full_time', label: 'משרה מלאה' },
    { value: 'part_time', label: 'משרה חלקית' },
    { value: 'shifts', label: 'משמרות' },
    { value: 'temporary', label: 'זמנית' },
    { value: 'student', label: 'משרת סטודנט' },
  ],
  workModels: [
    { value: 'onsite', label: 'מהשטח / מהמשרד' },
    { value: 'hybrid', label: 'היברידי' },
    { value: 'remote', label: 'מהבית' },
  ],
  seniorities: [
    { value: 'entry', label: 'ללא ניסיון' },
    { value: 'junior', label: 'ניסיון של עד שנתיים' },
    { value: 'mid', label: 'ניסיון של 3–5 שנים' },
    { value: 'senior', label: 'ניסיון של 5+ שנים' },
    { value: 'manager', label: 'ניהול' },
  ],
  suitableFor: [
    { value: 'students', label: 'סטודנטים' },
    { value: 'soldiers', label: 'חיילים משוחררים' },
    { value: 'pensioners', label: 'גמלאים' },
    { value: 'olim', label: 'עולים חדשים' },
  ],
  marketingTags: [
    { value: 'urgent', label: 'דחוף' },
    { value: 'hot', label: 'משרה חמה' },
  ],
}

/* ───────── Jobs ───────── */

const MIMAD: Publisher = { name: 'מימד אנושי', slug: 'mimad' }
const cat = (slug: string) => {
  for (const c of CLUSTERS) {
    const k = c.categories.find(x => x.slug === slug)
    if (k) return { cluster: { slug: c.slug, label: c.label }, category: { slug: k.slug, label: k.label } }
  }
  throw new Error(`unknown category ${slug}`)
}
const ind = (slug: string) => INDUSTRIES.find(i => i.slug === slug)!
const L = (slug: keyof typeof CITIES, address?: string): JobLocation => ({ ...CITIES[slug], address })
const secret = (displayName: string, industry?: string, sizeRange?: string): JobDetail['company'] =>
  ({ confidential: true, displayName, industry, sizeRange, publisher: MIMAD })
const named = (slug: string, name: string, industry: string, sizeRange: string, hq: string, about: string): JobDetail['company'] =>
  ({ confidential: false, id: `org-${slug}`, slug, name, industry, sizeRange, hq, about })

const now = Date.now()
const ago = (h: number) => new Date(now - h * 36e5).toISOString()
const inDays = (d: number) => new Date(now + d * 864e5).toISOString()

let code = 2400
type Seed = Omit<JobDetail, 'id' | 'slug' | 'jobNumber' | 'updatedAt' | 'status' | 'apply' | 'description' | 'cluster' | 'category'> & {
  slugBase: string
  category: string
  description?: string
  apply?: JobDetail['apply']
}

function job({ slugBase, category, ...rest }: Seed): JobDetail {
  code += 7
  const city = rest.locations[0]?.citySlug ?? 'remote'
  return {
    ...rest,
    ...cat(category),
    id: `job-${code}`,
    jobNumber: `MA-${code}`,
    slug: `${slugBase}-${city}-${code}`,
    updatedAt: rest.publishedAt,
    status: 'open',
    description: rest.description ?? `<p>${rest.teaser}</p>`,
    apply: rest.apply ?? { method: 'hiro', requiresCv: true },
  }
}

export const FIXTURE_JOBS: JobDetail[] = [
  job({
    slugBase: 'production-worker', category: 'production-worker', title: 'עובד/ת ייצור למפעל מזון',
    company: secret('מפעל מזון מוביל באזור השרון', 'מזון ומשקאות', '201-500'), industry: ind('food'),
    locations: [L('netanya', 'אזור התעשייה ספיר')], employmentType: ['full_time', 'shifts'], workModel: 'onsite',
    seniority: 'entry', experienceYearsMin: 0, noExperience: true, urgent: true, tags: ['hot'], suitableFor: ['soldiers', 'olim'],
    salary: { min: 42, max: 47, currency: 'ILS', period: 'hour' },
    teaser: 'עבודה על קו אריזה במפעל מזון, משמרות בוקר וערב. לא נדרש ניסיון, יש הכשרה מלאה והסעות.',
    description: '<p>מפעל מזון ותיק באזור התעשייה ספיר בנתניה מגייס עובדים ועובדות לקווי הייצור והאריזה.</p><p>העבודה כוללת הזנת קו, אריזה, בדיקה ויזואלית של מוצרים ושמירה על נהלי היגיינה. אחרי ההכשרה אפשר להתקדם למפעיל/ת קו.</p>',
    responsibilities: ['עבודה על קו ייצור ואריזה', 'בדיקה ויזואלית של המוצרים', 'שמירה על נהלי היגיינה ובטיחות'],
    requirements: ['זמינות למשמרות בוקר וערב', 'יכולת עבודה בעמידה'],
    benefits: ['הסעות מנתניה, חדרה וטייבה', 'ארוחה חמה', 'בונוס התמדה אחרי 3 חודשים', 'מוצרי המפעל בהנחה'],
    startDate: 'immediate', recruiter: { displayName: 'שירן' }, imageUrl: '/images/og-image.png', publishedAt: ago(3), validThrough: inDays(30),
    apply: { method: 'hiro', requiresCv: false, questions: [
      { id: 'q1', type: 'yes_no', label: 'יש לך זמינות למשמרות ערב?', required: true },
      { id: 'q2', type: 'select', label: 'מאיזה אזור מגיעים?', required: true, options: ['נתניה', 'חדרה', 'טייבה', 'אחר'] },
      { id: 'q3', type: 'video', label: 'ספר/י על עצמך בדקה', required: false },
    ] },
  }),
  job({
    slugBase: 'cnc-operator', category: 'machine-operator', title: 'מפעיל/ת CNC',
    company: secret('חברת תעשייה ביטחונית בצפון', 'ביטחוני', '1000+'), industry: ind('defense'),
    locations: [L('karmiel')], employmentType: ['full_time', 'shifts'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    salary: { min: 55, max: 65, currency: 'ILS', period: 'hour' },
    teaser: 'הפעלת מכונות CNC בשבבות, קריאת שרטוטים ומדידות. משמרות, הסעות מעכו ומכרמיאל.',
    requirements: ['ניסיון של שנתיים לפחות בהפעלת מכונות CNC', 'קריאת שרטוטים', 'עבודה עם כלי מדידה'],
    niceToHave: ['היכרות עם בקרי Fanuc או Heidenhain', 'סיווג ביטחוני'], benefits: ['הסעות', 'תוספת משמרות', 'קרן השתלמות'],
    skills: [{ tagId: 's1', label: 'CNC' }, { tagId: 's2', label: 'קריאת שרטוטים' }, { tagId: 's3', label: 'Fanuc' }],
    publishedAt: ago(20), validThrough: inDays(30),
  }),
  job({
    slugBase: 'quality-inspector', category: 'quality-control', title: 'בודק/ת איכות בקו ייצור',
    company: named('orbit-plast', 'אורביט פלסט', 'ייצור ומפעלים', '201-500', 'קריית גת', 'יצרנית אריזות פלסטיק לתעשיית המזון והקוסמטיקה.'),
    industry: ind('manufacturing'), locations: [L('kiryat-gat')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'בדיקות איכות במהלך הייצור, תיעוד ממצאים ועבודה מול מנהלי המשמרת.',
    requirements: ['שנת ניסיון בבקרת איכות במפעל', 'שליטה בסיסית ב-Excel'], benefits: ['ארוחות', 'הסעות מאשקלון'],
    publishedAt: ago(30), validThrough: inDays(25),
  }),
  job({
    slugBase: 'shift-manager', category: 'shift-management', title: 'מנהל/ת משמרת ייצור',
    company: secret('מפעל משקאות במרכז', 'מזון ומשקאות', '501-1000'), industry: ind('food'),
    locations: [L('rosh-haayin')], employmentType: ['full_time', 'shifts'], workModel: 'onsite', seniority: 'manager', experienceYearsMin: 3,
    salary: { min: 15000, max: 18000, currency: 'ILS', period: 'month' },
    teaser: 'ניהול משמרת של כ-30 עובדים: תפוקה, איכות, בטיחות ושיבוץ.',
    requirements: ['3 שנות ניסיון בניהול עובדים בייצור', 'זמינות למשמרות כולל לילה'], benefits: ['רכב צמוד', 'בונוס יעדים'],
    tags: ['hot'], publishedAt: ago(9), validThrough: inDays(30),
  }),
  job({
    slugBase: 'maintenance-electrician', category: 'maintenance', title: 'חשמלאי/ת אחזקה',
    company: secret('מפעל כימיה בחיפה', 'ייצור ומפעלים', '201-500'), industry: ind('manufacturing'),
    locations: [L('haifa')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'אחזקה שוטפת ומונעת למערכות החשמל במפעל, כולל תורנויות כוננות.',
    requirements: ['רישיון חשמלאי מוסמך לפחות', '3 שנות ניסיון באחזקה תעשייתית'], niceToHave: ['ניסיון עם בקרים (PLC)'],
    skills: [{ tagId: 's4', label: 'חשמל תעשייתי' }, { tagId: 's5', label: 'PLC' }], urgent: true, publishedAt: ago(14), validThrough: inDays(30),
  }),
  job({
    slugBase: 'warehouse-picker', category: 'warehouse', title: 'מלקט/ת במרכז הפצה',
    company: named('logitrans', 'לוגיטרנס', 'לוגיסטיקה והפצה', '501-1000', 'איירפורט סיטי', 'מרכז הפצה ארצי לרשתות מזון ופארם.'),
    industry: ind('logistics'), locations: [L('airport-city')], employmentType: ['full_time', 'part_time', 'shifts'], workModel: 'onsite',
    seniority: 'entry', experienceYearsMin: 0, noExperience: true, suitableFor: ['students', 'soldiers'],
    salary: { min: 40, max: 46, currency: 'ILS', period: 'hour' },
    teaser: 'ליקוט הזמנות עם מסופון במרכז הפצה. בונוס תפוקה ומשמרות גמישות.',
    requirements: ['זמינות ל-4 משמרות בשבוע לפחות'], benefits: ['בונוס תפוקה', 'הסעות מתחנות רכבת', 'חדר אוכל'],
    tags: ['hot'], publishedAt: ago(2), validThrough: inDays(30),
  }),
  job({
    slugBase: 'forklift-operator', category: 'forklift', title: 'מלגזן/ית היגש',
    company: secret('חברת הפצה בשפלה', 'לוגיסטיקה והפצה', '201-500'), industry: ind('logistics'),
    locations: [L('rishon-lezion')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    salary: { min: 48, max: 55, currency: 'ILS', period: 'hour' },
    teaser: 'עבודה על מלגזת היגש במחסן גבוה, קליטה וניפוק סחורה.',
    requirements: ['רישיון מלגזה בתוקף', 'ניסיון על היגש'], benefits: ['תוספת היגש', 'קרן השתלמות'],
    urgent: true, publishedAt: ago(6), validThrough: inDays(30),
  }),
  job({
    slugBase: 'delivery-driver-c1', category: 'delivery-drivers', title: 'נהג/ת חלוקה (רישיון C1)',
    company: secret('רשת מזון ארצית', 'קמעונאות ורשתות', '1000+'), industry: ind('retail'),
    locations: [L('holon'), L('rishon-lezion')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    salary: { min: 10500, max: 12500, currency: 'ILS', period: 'month' },
    teaser: 'חלוקה לסניפים באזור המרכז, יום עבודה שמתחיל מוקדם ומסתיים בצהריים.',
    requirements: ['רישיון C1 בתוקף', 'שנת ניסיון בחלוקה'], benefits: ['רכב עבודה', 'ארוחת בוקר'],
    publishedAt: ago(40), validThrough: inDays(20),
  }),
  job({
    slugBase: 'import-coordinator', category: 'supply-chain', title: 'מתאם/ת יבוא ולוגיסטיקה',
    company: secret('יבואנית מוצרי צריכה', 'לוגיסטיקה והפצה', '51-200'), industry: ind('logistics'),
    locations: [L('modiin')], employmentType: ['full_time'], workModel: 'hybrid', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'תיאום משלוחי יבוא מול עמילי מכס ומשלחים, ומעקב מלאי מול המחסן.',
    requirements: ['שנת ניסיון ביבוא או בלוגיסטיקה', 'אנגלית טובה', 'שליטה ב-Excel'], publishedAt: ago(70), validThrough: inDays(25),
  }),
  job({
    slugBase: 'store-sales', category: 'store-sales', title: 'מוכר/ת ברשת אופנה',
    company: named('urbana', 'אורבנה', 'קמעונאות ורשתות', '501-1000', 'תל אביב-יפו', 'רשת אופנה עם 40 סניפים ברחבי הארץ.'),
    industry: ind('retail'), locations: [L('kfar-saba'), L('netanya'), L('petah-tikva')],
    employmentType: ['part_time', 'student'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0, noExperience: true,
    suitableFor: ['students', 'soldiers'], salary: { min: 38, max: 42, currency: 'ILS', period: 'hour' },
    teaser: 'מכירה ושירות בסניפים, משמרות גמישות ובונוס על עמידה ביעדים.', requirements: ['אהבה לאופנה ולשירות', 'זמינות לסופי שבוע'],
    benefits: ['הנחת עובדים', 'בונוס מכירות'], publishedAt: ago(18), validThrough: inDays(45),
  }),
  job({
    slugBase: 'cashier', category: 'cashier', title: 'קופאי/ת בסופרמרקט',
    company: secret('רשת מזון ארצית', 'קמעונאות ורשתות', '1000+'), industry: ind('retail'),
    locations: [L('beer-sheva')], employmentType: ['part_time', 'shifts'], workModel: 'onsite', seniority: 'entry', experienceYearsMin: 0, noExperience: true,
    suitableFor: ['students', 'pensioners'], teaser: 'עבודה בקופות ובשירות לקוחות בסניף באר שבע.',
    requirements: ['שירותיות', 'זמינות למשמרות'], publishedAt: ago(26), validThrough: inDays(30),
  }),
  job({
    slugBase: 'branch-manager', category: 'branch-management', title: 'מנהל/ת סניף',
    company: secret('רשת חנויות לבית', 'קמעונאות ורשתות', '201-500'), industry: ind('retail'),
    locations: [L('jerusalem')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'manager', experienceYearsMin: 3,
    salary: { min: 13000, max: 16000, currency: 'ILS', period: 'month' },
    teaser: 'ניהול סניף של 15 עובדים: יעדי מכירה, משמרות, מלאי ותצוגה.',
    requirements: ['3 שנות ניסיון בניהול סניף ברשת', 'זמינות לסופי שבוע'], benefits: ['בונוס רבעוני', 'רכב'],
    publishedAt: ago(52), validThrough: inDays(30),
  }),
  job({
    slugBase: 'field-sales-rep', category: 'field-sales', title: 'סוכן/ת מכירות שטח',
    company: secret('יצרנית מוצרי חלב', 'מזון ומשקאות', '501-1000'), industry: ind('food'),
    locations: [L('haifa'), L('kiryat-ata')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    salary: { min: 11000, max: 15000, currency: 'ILS', period: 'month', isEstimate: true },
    teaser: 'מכירה לנקודות קמעונאיות באזור חיפה והקריות. רכב חברה ועמלות.',
    requirements: ['רישיון נהיגה B', 'ניסיון במכירות'], benefits: ['רכב חברה', 'עמלות', 'טלפון נייד'], publishedAt: ago(12), validThrough: inDays(30),
  }),
  job({
    slugBase: 'car-mechanic', category: 'mechanic', title: 'מכונאי/ת רכב',
    company: named('autocenter', 'אוטו סנטר', 'רכב', '201-500', 'חולון', 'מרכזי שירות מורשים לשלושה מותגי רכב.'),
    industry: ind('automotive'), locations: [L('holon')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    salary: { min: 11000, max: 15000, currency: 'ILS', period: 'month' },
    teaser: 'טיפולים ותיקונים במרכז שירות מורשה, כולל הכשרות יצרן.',
    requirements: ['תעודת מכונאי/ת רכב', 'שנתיים ניסיון לפחות'], niceToHave: ['ניסיון ברכב חשמלי או היברידי'],
    benefits: ['הכשרות יצרן', 'בונוס תפוקה'], skills: [{ tagId: 's6', label: 'מכונאות רכב' }, { tagId: 's7', label: 'רכב היברידי' }],
    tags: ['hot'], publishedAt: ago(8), validThrough: inDays(30),
  }),
  job({
    slugBase: 'service-advisor', category: 'service-advisor', title: 'יועץ/ת שירות במרכז שירות',
    company: secret('יבואנית רכב', 'רכב', '1000+'), industry: ind('automotive'),
    locations: [L('rishon-lezion')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'קבלת לקוחות ורכבים, פתיחת כרטיסי עבודה ומעקב עד המסירה.',
    requirements: ['ניסיון בשירות לקוחות', 'הבנה טכנית בסיסית'], publishedAt: ago(34), validThrough: inDays(30),
  }),
  job({
    slugBase: 'car-sales', category: 'car-sales', title: 'איש/אשת מכירות רכב',
    company: secret('יבואנית רכב', 'רכב', '1000+'), industry: ind('automotive'),
    locations: [L('petah-tikva')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior',
    salary: { min: 9000, max: 20000, currency: 'ILS', period: 'month', isEstimate: true },
    teaser: 'מכירת רכבים חדשים באולם תצוגה. בסיס + עמלות ללא תקרה.', requirements: ['ניסיון במכירות', 'רישיון נהיגה'],
    publishedAt: ago(90), validThrough: inDays(20),
  }),
  job({
    slugBase: 'parts-clerk', category: 'parts', title: 'מחסנאי/ת חלפים',
    company: named('autocenter', 'אוטו סנטר', 'רכב', '201-500', 'חולון', 'מרכזי שירות מורשים לשלושה מותגי רכב.'),
    industry: ind('automotive'), locations: [L('holon')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'entry', noExperience: true,
    teaser: 'ניהול מחסן חלפים, קליטה, ניפוק ומלאי במערכת.', requirements: ['סדר וארגון', 'שליטה במחשב'], publishedAt: ago(60), validThrough: inDays(30),
  }),
  job({
    slugBase: 'pharma-operator', category: 'pharma-production', title: 'מפעיל/ת ייצור בחדר נקי',
    company: secret('חברת פארמה גלובלית', 'פארמה וקוסמטיקה', '1000+'), industry: ind('pharma'),
    locations: [L('kfar-saba')], employmentType: ['full_time', 'shifts'], workModel: 'onsite', seniority: 'entry', noExperience: true,
    salary: { min: 48, max: 54, currency: 'ILS', period: 'hour' },
    teaser: 'הפעלת מכונות ייצור תרופות בחדר נקי, לפי נהלי GMP. הכשרה מלאה בחברה.',
    requirements: ['בגרות מלאה', 'זמינות למשמרות'], niceToHave: ['ניסיון בסביבת GMP'], benefits: ['הסעות', 'ארוחות', 'קרן השתלמות'],
    urgent: true, publishedAt: ago(5), validThrough: inDays(30),
  }),
  job({
    slugBase: 'pharma-qa', category: 'pharma-qa', title: 'מבטח/ת איכות (QA)',
    company: secret('חברת פארמה גלובלית', 'פארמה וקוסמטיקה', '1000+'), industry: ind('pharma'),
    locations: [L('rehovot')], employmentType: ['full_time'], workModel: 'hybrid', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'שחרור אצוות, טיפול בסטיות ותיעוד לפי GMP.', requirements: ['תואר ראשון במדעי החיים או כימיה', '3 שנות ניסיון ב-QA בפארמה'],
    skills: [{ tagId: 's8', label: 'GMP' }, { tagId: 's9', label: 'אבטחת איכות' }], publishedAt: ago(110), validThrough: inDays(30),
  }),
  job({
    slugBase: 'lab-technician', category: 'lab', title: 'לבורנט/ית',
    company: secret('מפעל קוסמטיקה במרכז', 'פארמה וקוסמטיקה', '51-200'), industry: ind('pharma'),
    locations: [L('petah-tikva')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'junior', experienceYearsMin: 1,
    teaser: 'בדיקות חומרי גלם ומוצר מוגמר במעבדת בקרת איכות.', requirements: ['הנדסאי/ת כימיה או תואר רלוונטי'],
    publishedAt: ago(140), validThrough: inDays(20),
  }),
  job({
    slugBase: 'site-manager', category: 'site-management', title: 'מנהל/ת עבודה',
    company: named('binyan-hadar', 'בניין הדר', 'בנייה ונדל״ן', '51-200', 'מודיעין', 'חברת קבלנות ביצוע לבנייה למגורים.'),
    industry: ind('construction'), locations: [L('modiin'), L('beit-shemesh')], employmentType: ['full_time'], workModel: 'onsite',
    seniority: 'senior', experienceYearsMin: 5, salary: { min: 18000, max: 22000, currency: 'ILS', period: 'month' },
    teaser: 'ניהול ביצוע בפרויקט מגורים של 120 יח״ד, מעבודות שלד ועד גמר.',
    requirements: ['תעודת מנהל עבודה רשום', '5 שנות ניסיון בביצוע'], benefits: ['רכב צמוד', 'טלפון'], tags: ['hot'], publishedAt: ago(22), validThrough: inDays(30),
  }),
  job({
    slugBase: 'civil-engineer', category: 'civil-engineering', title: 'מהנדס/ת ביצוע',
    company: secret('חברת תשתיות ציבורית', 'בנייה ונדל״ן', '1000+'), industry: ind('construction'),
    locations: [L('ashdod')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 3,
    teaser: 'הנדסת ביצוע בפרויקט תשתיות, פיקוח על קבלני משנה ובקרת לו״ז.', requirements: ['תואר בהנדסה אזרחית', '3 שנות ניסיון בביצוע'],
    publishedAt: ago(80), validThrough: inDays(30),
  }),
  job({
    slugBase: 'safety-officer', category: 'safety', title: 'ממונה בטיחות באתר בנייה',
    company: secret('חברת תשתיות ציבורית', 'בנייה ונדל״ן', '1000+'), industry: ind('construction'),
    locations: [L('beer-sheva')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    teaser: 'ניהול הבטיחות באתר: הדרכות, סיורים, תיעוד ועבודה מול הקבלנים.', requirements: ['תעודת ממונה בטיחות', 'ניסיון באתרי בנייה'],
    publishedAt: ago(45), validThrough: inDays(30),
  }),
  job({
    slugBase: 'skilled-trades', category: 'skilled-trades', title: 'רצף/ת וטייח/ת',
    company: named('binyan-hadar', 'בניין הדר', 'בנייה ונדל״ן', '51-200', 'מודיעין', 'חברת קבלנות ביצוע לבנייה למגורים.'),
    industry: ind('construction'), locations: [L('modiin')], employmentType: ['full_time'], workModel: 'onsite', seniority: 'mid', experienceYearsMin: 2,
    salary: { min: 60, max: 75, currency: 'ILS', period: 'hour' },
    teaser: 'עבודות ריצוף וטיח בפרויקט מגורים. עבודה קבועה עם הסעה מהאזור.', requirements: ['ניסיון מוכח בריצוף או בטיח'], publishedAt: ago(15), validThrough: inDays(30),
  }),
]

/* ───────── GET /taxonomy (counts computed like the API) ───────── */

export function fixtureTaxonomy(): Taxonomy {
  const count = (pred: (j: JobDetail) => boolean) => FIXTURE_JOBS.filter(pred).length
  const regions = new Map<string, Taxonomy['regions'][number]>()
  for (const c of Object.values(CITIES)) {
    const r = regions.get(c.regionSlug) ?? { slug: c.regionSlug, label: c.regionName, count: 0, cities: [] }
    r.cities.push({ slug: c.citySlug, label: c.cityName, count: count(j => j.locations.some(l => l.citySlug === c.citySlug)), lat: c.lat, lng: c.lng })
    regions.set(c.regionSlug, r)
  }
  for (const r of regions.values()) r.count = count(j => j.locations.some(l => l.regionSlug === r.slug))
  const withCount = <T extends { value: string }>(list: T[], has: (j: JobDetail, v: string) => boolean) => list.map(e => ({ ...e, count: count(j => has(j, e.value)) }))
  return {
    clusters: CLUSTERS.map(c => ({
      slug: c.slug, label: c.label, count: count(j => j.cluster.slug === c.slug),
      categories: c.categories.map(k => ({ ...k, count: count(j => j.category.slug === k.slug) })),
    })),
    industries: INDUSTRIES.map(i => ({ ...i, count: count(j => j.industry?.slug === i.slug) })),
    regions: [...regions.values()],
    employmentTypes: withCount(ENUMS.employmentTypes, (j, v) => j.employmentType.includes(v)),
    workModels: withCount(ENUMS.workModels, (j, v) => j.workModel === v),
    seniorities: withCount(ENUMS.seniorities, (j, v) => j.seniority === v),
    suitableFor: withCount(ENUMS.suitableFor, (j, v) => !!j.suitableFor?.includes(v)),
    marketingTags: ENUMS.marketingTags,
  }
}
