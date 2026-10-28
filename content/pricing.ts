// The price list. Every number on /pricing comes from here.
// Prices are per recruiter per month, in ILS, excluding VAT.
// DRAFT (28.10.2026): first proposal, not yet offered to any customer.

export type PlanId = 'basic' | 'pro' | 'enterprise'

export type Plan = {
  id: PlanId
  name: string
  forWho: string
  /** null = quoted ("let's talk") */
  monthly: number | null
  annual: number | null
  /** Shown under the price, e.g. a seat limit */
  note: string
  highlights: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

/** Founding-customer offer: off the first year, for the first N agencies */
export const FOUNDERS = { percent: 30, seats: 20 }

export const PLANS: Plan[] = [
  {
    id: 'basic', name: 'בסיס', forWho: 'משרד קטן או מגייס/ת עצמאי/ת',
    monthly: 279, annual: 229, note: 'עד 3 רכזים',
    highlights: [
      'מאגר מועמדים עם קריאת קורות חיים ותגיות אוטומטיות',
      'משרות, לקוחות ואנשי קשר במקום אחד',
      'פרסום משרות בלוח של HirO ובגוגל',
      'אזור אישי למועמדים',
      '200 דירוגי התאמה בחודש לכל רכז',
    ],
    cta: { label: 'קבעו הדגמה', href: '/contact?plan=basic' },
  },
  {
    id: 'pro', name: 'מקצועי', forWho: 'משרד השמה שעובד בקצב',
    monthly: 469, annual: 389, note: 'בלי הגבלת רכזים',
    highlights: [
      'כל מה שיש בבסיס',
      'Job Sonar: המאגר שלכם מדורג לכל משרה',
      'מנוע התאמה לפי התבנית שלכם, עם פירוק ההתאמה',
      'הודעות בתפוצה, שאלות סינון ווידאו',
      'סוכן קריירה AI למועמדים',
      'הצעות מחיר, כספים ודוחות',
      'העברת הנתונים מהמערכת הקודמת, בלי עלות בתוכנית שנתית',
    ],
    cta: { label: 'קבעו הדגמה', href: '/contact?plan=pro' },
    featured: true,
  },
  {
    id: 'enterprise', name: 'ארגוני', forWho: 'רשתות השמה וארגונים עם צוות גיוס',
    monthly: null, annual: null, note: 'מ-10 רכזים',
    highlights: [
      'כל מה שיש במקצועי',
      'אתר קריירה על הדומיין שלכם, מחובר למשרות',
      'API ושיגור מועמדים למערכות אחרות',
      'מנהל/ת לקוח ייעודי/ת והדרכה בשטח',
      'הסכם עיבוד מידע ו-SLA מותאמים',
    ],
    cta: { label: 'בואו נדבר', href: '/contact?plan=enterprise' },
  },
]

/** Comparison table. true = included, false = not, string = included with that detail */
export const COMPARE: { group: string; rows: { label: string; values: Record<PlanId, boolean | string> }[] }[] = [
  {
    group: 'מאגר ומשרות',
    rows: [
      { label: 'מועמדים ומשרות', values: { basic: 'ללא הגבלה', pro: 'ללא הגבלה', enterprise: 'ללא הגבלה' } },
      { label: 'קריאת קורות חיים ותגיות AI', values: { basic: true, pro: true, enterprise: true } },
      { label: 'חיפוש חופשי, סינון וחיפושים שמורים', values: { basic: true, pro: true, enterprise: true } },
      { label: 'CRM: לקוחות, אנשי קשר, אירועים ומשימות', values: { basic: true, pro: true, enterprise: true } },
      { label: 'פרסום בלוח המשרות של HirO ובגוגל', values: { basic: true, pro: true, enterprise: true } },
      { label: 'אתר קריירה על הדומיין שלכם', values: { basic: false, pro: false, enterprise: true } },
    ],
  },
  {
    group: 'התאמה ו-AI',
    rows: [
      { label: 'דירוג התאמה למשרה', values: { basic: '200 לרכז בחודש', pro: 'ללא הגבלה', enterprise: 'ללא הגבלה' } },
      { label: 'Job Sonar: סריקת המאגר לכל משרה', values: { basic: false, pro: true, enterprise: true } },
      { label: 'תבנית התאמה משלכם ופירוק ההתאמה', values: { basic: false, pro: true, enterprise: true } },
      { label: 'סוכן קריירה AI למועמדים', values: { basic: false, pro: true, enterprise: true } },
    ],
  },
  {
    group: 'תקשורת ותהליך',
    rows: [
      { label: 'אזור אישי למועמדים', values: { basic: true, pro: true, enterprise: true } },
      { label: 'מייל למועמד מתוך המערכת', values: { basic: true, pro: true, enterprise: true } },
      { label: 'הודעות בתפוצה', values: { basic: false, pro: true, enterprise: true } },
      { label: 'שאלות סינון ושאלות וידאו', values: { basic: 'שאלות סינון', pro: true, enterprise: true } },
      { label: 'הצעות מחיר, כספים ודוחות BI', values: { basic: false, pro: true, enterprise: true } },
    ],
  },
  {
    group: 'שירות',
    rows: [
      { label: 'העברת נתונים מהמערכת הקודמת', values: { basic: 'בהצעת מחיר', pro: 'חינם בשנתי', enterprise: true } },
      { label: 'הדרכה', values: { basic: 'מוקלטת', pro: 'פגישת זום', enterprise: 'בשטח' } },
      { label: 'תמיכה', values: { basic: 'מייל', pro: 'מייל וטלפון', enterprise: 'מנהל/ת לקוח' } },
      { label: 'API ושיגור למערכות אחרות', values: { basic: false, pro: false, enterprise: true } },
    ],
  },
]

export const EXTRAS: { name: string; price: string; note: string }[] = [
  { name: 'SMS', price: 'לפי שימוש', note: 'לפי עלות הספק, בלי תוספת. אפשר להגדיר תקרה חודשית.' },
  { name: 'פרסום משרה למעסיקים', price: 'חינם', note: 'עסקים בלי מערכת מפרסמים משרה ב-HirO ומקבלים את המועמדים לאזור שלהם.' },
  { name: 'פתיחת פרופיל ממאגר המועמדים', price: 'בקרוב', note: 'חיפוש במאגר של HirO, ותשלום רק על פרופיל שפותחים. רק מועמדים שהסכימו להופיע במאגר.' },
]

export const FAQ: [string, string][] = [
  ['המחירים כוללים מע״מ?', 'לא. כל המחירים בעמוד הם לרכז לחודש, לפני מע״מ.'],
  ['מה ההבדל בין חודשי לשנתי?', 'בתשלום שנתי משלמים פחות בכל חודש, וההתחייבות היא לשנה. בתשלום חודשי אפשר לעצור בסוף כל חודש.'],
  ['מה זה "רכז"?', 'משתמש/ת שמגייס/ת במערכת. מנהלים שרק צופים בדוחות לא נספרים.'],
  ['יש תקופת ניסיון?', 'כן. 14 יום על החשבון שלכם, עם הנתונים שלכם, בלי כרטיס אשראי. לפני כן נעשה הדגמה קצרה כדי לחבר אתכם נכון.'],
  ['אפשר לעבור בין תוכניות?', 'כן, בכל רגע. משדרגים מיד, ומשלמים רק על ההפרש היחסי.'],
  ['מה קורה לנתונים אם אנחנו עוזבים?', 'הם שלכם. מקבלים ייצוא מלא של המועמדים, המשרות והלקוחות, ואחר כך הם נמחקים אצלנו.'],
  ['מה זה מחיר מייסדים?', `ל-${FOUNDERS.seats} המשרדים הראשונים שמצטרפים: ${FOUNDERS.percent}% הנחה בשנה הראשונה, בכל תוכנית.`],
]
