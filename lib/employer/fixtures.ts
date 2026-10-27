// FICTIONAL stand-in for the Hiro Employer API, for local development and
// Vercel previews only (see lib/employer/source.ts). Every business, person,
// phone number and email here is made up.
//
// State lives in process memory, so on Vercel it can reset between requests
// served by different instances. The portal shows a banner saying so.

import type { Application, EmployerJob, EmployerOrg, EmployerUser, ForwardLog, MessageTemplate } from './types'

export const DEMO_CODE = '123456'
export const DEMO_EMAIL = 'demo@example.co.il'

type Store = {
  users: Map<string, EmployerUser & { orgId?: string }>
  orgs: Map<string, EmployerOrg>
  jobs: Map<string, EmployerJob & { orgId: string }>
  applications: Map<string, Application>
  forwards: (ForwardLog & { orgId: string })[]
  seq: number
}

const days = (n: number) => new Date(Date.now() - n * 864e5).toISOString()
const hours = (n: number) => new Date(Date.now() - n * 36e5).toISOString()

function seed(): Store {
  const org: EmployerOrg = {
    id: 'org-demo', name: 'מאפיית השדה (הדגמה)', contactName: 'רותם לוי', phone: '0500000000',
    notifyEmail: DEMO_EMAIL, notify: 'instant', status: 'approved', reviewQuota: 0,
  }
  const base = {
    workModel: 'onsite', publishSalary: true, noExperience: false, suitableFor: [] as string[], requiresCv: false,
    confidential: false, benefits: [] as string[],
  }
  const jobs: (EmployerJob & { orgId: string })[] = [
    {
      ...base, orgId: org.id, id: 'ej-1', slug: 'demo-baker-modiin', jobNumber: 'E-1001', status: 'live',
      title: 'אופה/ת למשמרת בוקר', categorySlug: 'production-worker', citySlug: 'modiin', employmentType: ['full_time', 'shifts'],
      hoursDescription: 'א׳–ה׳ 05:00–13:00, שישי לסירוגין', salary: { min: 48, max: 55, currency: 'ILS', period: 'hour' },
      description: '<p>מאפייה שכונתית מחפשת אופה/ת לצוות הבוקר. עבודה עם בצקים, תנורים ומאפים מתוקים, בצוות קטן ומשפחתי.</p>',
      requirements: ['ניסיון של שנה לפחות באפייה', 'זמינות למשמרות בוקר מוקדמות'], benefits: ['ארוחת בוקר', 'החזר נסיעות'],
      questions: [{ id: 'q1', type: 'yes_no', label: 'יש לך ניסיון בעבודה עם תנור קומות?', required: true }],
      createdAt: days(9), publishedAt: days(9), validThrough: new Date(Date.now() + 21 * 864e5).toISOString(),
      counts: { applications: 4, new: 2, views: 312 },
    },
    {
      ...base, orgId: org.id, id: 'ej-2', slug: 'demo-cashier-modiin', jobNumber: 'E-1002', status: 'live',
      title: 'קופאי/ת ונציג/ת שירות', categorySlug: 'cashier', citySlug: 'modiin', employmentType: ['part_time'],
      hoursDescription: 'משמרות אחה״צ, 3–4 בשבוע', noExperience: true, suitableFor: ['students'], publishSalary: false,
      description: '<p>עבודה בקופה ובדלפק, שירות ללקוחות קבועים וסידור מדפים. מתאים גם לסטודנטים.</p>',
      requirements: ['יחסי אנוש טובים'], questions: [],
      createdAt: days(3), publishedAt: days(3), validThrough: new Date(Date.now() + 27 * 864e5).toISOString(),
      counts: { applications: 1, new: 1, views: 88 },
    },
    {
      ...base, orgId: org.id, id: 'ej-3', jobNumber: 'E-1003', status: 'draft',
      title: 'נהג/ת חלוקה (רישיון ב׳)', categorySlug: 'delivery-drivers', citySlug: 'modiin', employmentType: ['full_time'],
      description: '<p>חלוקת לחמים ומאפים לבתי קפה באזור.</p>', requirements: ['רישיון נהיגה ב׳'], questions: [],
      createdAt: days(1), counts: { applications: 0, new: 0, views: 0 },
    },
  ]
  const app = (id: string, jobId: string, fullName: string, phone: string, email: string | undefined, city: string, headline: string, at: string, status: Application['status'], answers: Application['answers'] = []): Application => ({
    id, jobId, fullName, phone, email, city, headline, submittedAt: at, status, answers, messages: [],
    cv: { fileName: `${fullName.split(' ')[0]}-CV.pdf`, url: `/api/employer/demo-cv/${id}`, mimeType: 'text/html' },
  })
  const q = (a: string) => [{ questionId: 'q1', label: 'יש לך ניסיון בעבודה עם תנור קומות?', answer: a }]
  const applications = [
    app('ea-1', 'ej-1', 'נועה ברק (דמו)', '0500000001', 'noa.demo@example.co.il', 'מודיעין', 'אופה במאפייה שכונתית, 3 שנים', hours(5), 'new', q('כן')),
    app('ea-2', 'ej-1', 'אלון מזרחי (דמו)', '0500000002', undefined, 'לוד', 'עובד ייצור במפעל מזון, שנתיים', hours(20), 'new', q('לא')),
    app('ea-3', 'ej-1', 'דנה כהן (דמו)', '0500000003', 'dana.demo@example.co.il', 'רמלה', 'קונדיטורית, בוגרת קורס אפייה', days(3), 'shortlisted', q('כן')),
    app('ea-4', 'ej-1', 'יוסי אברהם (דמו)', '0500000004', 'yossi.demo@example.co.il', 'מודיעין', 'טבח במסעדה, 5 שנים', days(6), 'rejected', q('לא')),
    app('ea-5', 'ej-2', 'מאיה שלום (דמו)', '0500000005', 'maya.demo@example.co.il', 'מודיעין', 'סטודנטית, ניסיון בקופה ברשת', hours(2), 'new'),
  ]
  applications[2].messages.push({ id: 'm1', direction: 'out', subject: 'זימון לראיון', body: 'היי דנה, נשמח להיפגש...', sentAt: days(2), templateId: 'invite' })
  applications[3].note = 'לא מתאים לשעות הבוקר'
  return {
    users: new Map([[DEMO_EMAIL, { id: 'u-demo', email: DEMO_EMAIL, name: 'רותם', orgId: org.id }]]),
    orgs: new Map([[org.id, org]]),
    jobs: new Map(jobs.map(j => [j.id, j])),
    applications: new Map(applications.map(a => [a.id, a])),
    forwards: [],
    seq: 2000,
  }
}

const g = globalThis as unknown as { __hiroEmployerStore?: Store }
export const store = (): Store => (g.__hiroEmployerStore ??= seed())

export const TEMPLATES: MessageTemplate[] = [
  { id: 'invite', name: 'זימון לראיון', subject: 'זימון לראיון — {job}', body: 'היי {first},\n\nתודה על המועמדות למשרת {job}. נשמח להזמין אותך לראיון.\nמתי נוח לך השבוע?\n\n{org}' },
  { id: 'info', name: 'בקשת פרטים', subject: 'לגבי המועמדות שלך — {job}', body: 'היי {first},\n\nתודה על המועמדות למשרת {job}. לפני שנתקדם, נשמח לשמוע:\n\n{org}' },
  { id: 'decline', name: 'תודה, לא הפעם', subject: 'עדכון לגבי המועמדות — {job}', body: 'היי {first},\n\nתודה שהגשת מועמדות למשרת {job}. בשלב זה החלטנו להתקדם עם מועמדים אחרים.\nנשמח לשמור על קשר למשרות הבאות.\n\nבהצלחה,\n{org}' },
]
