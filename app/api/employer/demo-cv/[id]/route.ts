import { getSession } from '@/lib/employer/session'
import { employerSource, listApplications } from '@/lib/employer/source'
import { store } from '@/lib/employer/fixtures'

// Preview only: a stand-in "CV" for the demo applicants, so the CV pane has
// something to show. In the Employer API, cv.url is a signed link from Hiro.

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (employerSource !== 'fixtures') return new Response('Not found', { status: 404 })
  const session = await getSession()
  const a = store().applications.get((await params).id)
  if (!session || !a) return new Response('Not found', { status: 404 })
  // Same ownership rule as the API: only the employer whose job it is
  const owned = await listApplications(session, a.jobId).then(list => list.some(x => x.id === a.id), () => false)
  if (!owned) return new Response('Not found', { status: 404 })
  const html = `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>קורות חיים — ${esc(a.fullName)}</title>
<style>body{font-family:Heebo,Arial,sans-serif;max-width:640px;margin:32px auto;padding:0 24px;color:#15131D;line-height:1.7}
h1{margin:0;font-size:28px}h2{font-size:16px;border-bottom:1px solid #ddd;padding-bottom:4px;margin-top:28px}
.c{color:#5F5B6C}.d{background:#FFF4E0;color:#7A4A0C;padding:8px 12px;border-radius:8px;font-size:13px;margin-bottom:24px}</style></head>
<body><p class="d">קורות חיים לדוגמה (מצב הדגמה). אדם בדוי.</p>
<h1>${esc(a.fullName)}</h1><p class="c">${esc(a.city ?? '')} · <span dir="ltr">${esc(a.phone)}</span>${a.email ? ` · <span dir="ltr">${esc(a.email)}</span>` : ''}</p>
<h2>תקציר</h2><p>${esc(a.headline ?? '')}. זמינות מיידית, ניידות עם רכב.</p>
<h2>ניסיון תעסוקתי</h2><p><b>2022–היום</b> · ${esc(a.headline?.split(',')[0] ?? 'עובד/ת')}<br>עבודה בצוות, עמידה ביעדים, אחריות על משמרת.</p>
<p><b>2019–2022</b> · נציג/ת שירות ברשת קמעונאית</p>
<h2>השכלה</h2><p>12 שנות לימוד, תעודת בגרות מלאה</p>
<h2>שפות</h2><p>עברית, אנגלית</p></body></html>`
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' } })
}
