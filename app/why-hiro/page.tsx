import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { DeepDive } from '@/components/sales/DeepDive'
import { SalesVideo } from '@/components/sales/SalesVideo'
import { SALES_VIDEOS } from '@/content/sales-videos'
import s from '@/components/sales/sales.module.css'

const SITE = 'https://hiro.co.il'
const LEAD = 'HirO קולטת כל קורות חיים, מסבירה כל התאמה, מסננת לבד ומראה לכם כל בוקר מה דורש טיפול. מערכת אחת למועמדים, למשרות וללקוחות.'

export const metadata: Metadata = {
  title: { absolute: 'למה HirO | מערכת גיוס ו-CRM חכמה' },
  description: LEAD,
  alternates: { canonical: '/why-hiro' },
  openGraph: {
    title: 'למה HirO | מערכת גיוס ו-CRM חכמה',
    description: LEAD,
    url: '/why-hiro',
    type: 'website',
    locale: 'he_IL',
    images: [{ url: '/videos/sales/p1.jpg', width: 960, height: 540, alt: 'HirO ב-75 שניות' }],
  },
}

const COMPARE: { topic: string; old: string; hiro: React.ReactNode }[] = [
  { topic: 'קליטת קורות חיים', old: 'תיבת מייל כללית, הקלדה ידנית', hiro: <>מייל ייחודי לכל משרה. <b>פרופיל מלא ותגיות נבנים אוטומטית</b>, עם מקור ההגעה.</> },
  { topic: 'חיפוש במאגר', old: 'מילות מפתח, ומי שכתב אחרת נעלם', hiro: <>חיפוש בשפה חופשית והתאמה לפי משמעות. <b>סונאר מציע מועמדים מהמאגר לכל משרה.</b></> },
  { topic: 'דירוג מועמדים', old: 'תחושת בטן, או ציון בלי הסבר', hiro: <><b>ציון התאמה מוסבר</b>: ניסיון, תגיות, מיקום וזיקה לתחום, במשקלות שאתם קובעים, עם קנסות על פער שכר וניידות.</> },
  { topic: 'סינון ראשוני', old: 'עשרות שיחות טלפון', hiro: <><b>שאלון אוטומטי</b> מיד אחרי ההגשה, עם שאלות פסילה. הרכז מקבל רק את הרלוונטיים.</> },
  { topic: 'עבודה מול הלקוח', old: 'קבצים במייל, ״קיבלת את מה ששלחתי?״', hiro: <><b>פורטל למנהל המגייס</b>: רואה רק את הסטטוסים שבחרתם ונותן חוות דעת ישר במערכת.</> },
  { topic: 'עדכניות המאגר', old: 'קורות חיים מלפני חמש שנים', hiro: <>למועמד יש <b>אזור אישי ויועץ קריירה AI</b>. הוא מעדכן, והעדכון מגיע לכל עותקי הצל.</> },
  { topic: 'מכירות ולקוחות', old: 'מערכת CRM נפרדת, או אקסל', hiro: <><b>בונה תהליכים</b> שמחבר לכל תוצאה את הצעד הבא, ו<b>מאגר חברות</b> לפי ענף, גודל ואזור.</> },
  { topic: 'שליטה', old: 'דוחות שמישהו מכין בסוף החודש', hiro: <><b>דופק חי לכל משרה ולכל לקוח</b>: יודעים מה נתקע לפני שהוא נתקע.</> },
]

const NUMBERS = [
  { n: '4', t: 'רכיבים במנוע ההתאמה, כל אחד במשקל שאתם בוחרים' },
  { n: '60 שנ׳', t: 'סרטון היכרות שהמועמד מקליט בעצמו' },
  { n: '1', t: 'מייל ייחודי לכל משרה, מכל לוח דרושים' },
  { n: '0', t: 'מערכות נוספות: גיוס, מאגר ו-CRM במקום אחד' },
]

const videoLd = Object.values(SALES_VIDEOS).map(v => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: v.title,
  description: v.description,
  thumbnailUrl: `${SITE}${v.poster}`,
  contentUrl: `${SITE}${v.src}`,
  ...(v.youtubeId && { embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}` }),
  duration: v.duration,
  uploadDate: '2026-10-18', // Google requires uploadDate for video rich results
  inLanguage: 'he',
}))

export default function WhyHiroPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd).replace(/</g, '\\u003c') }} />
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={s.page}>
        {/* ── Hero ── */}
        <section className={`wrap ${s.hero}`} aria-labelledby="why-h1">
          <div className={s.heroText}>
            <p className="kicker">מערכת גיוס ו-CRM למשרדי השמה ולארגונים</p>
            <h1 id="why-h1" className={s.h1}>גיוס, בלי לאבד <em>אף מועמד.</em></h1>
            <p className="lede">{LEAD}</p>
            <div className={s.ctas}>
              <a href="/contact" className="btn btn-primary">תאמו הדגמה <span className="arr" aria-hidden="true">←</span></a>
              <a href="#compare" className="btn btn-ghost">מה ההבדל?</a>
            </div>
            <p className={s.who}>נבנתה לגיוס של <b>תעשייה, לוגיסטיקה, קמעונאות ובנייה</b> — שם המועמדים לא נמצאים בלינקדאין.</p>
          </div>
          <SalesVideo video={SALES_VIDEOS.S1} priority />
        </section>

        {/* ── Compare ── */}
        <section id="compare" className={s.section} aria-labelledby="compare-h">
          <div className="wrap">
            <div className={s.sechead}>
              <p className="kicker">מה משתנה ביום-יום</p>
              <h2 id="compare-h" className="display-l">אותה עבודה. בלי החורים.</h2>
              <p className="lede">ככה זה נראה ברוב המשרדים היום, וככה זה עובד ב-HirO.</p>
            </div>
            <table className={s.ledger}>
              <caption className="sr-only">השוואה בין הדרך המוכרת לבין העבודה ב-HirO</caption>
              <thead>
                <tr><th scope="col">תחום</th><th scope="col">הדרך המוכרת</th><th scope="col">ב-HirO</th></tr>
              </thead>
              <tbody>
                {COMPARE.map(r => (
                  <tr key={r.topic}>
                    <th scope="row">{r.topic}</th>
                    <td className={s.old} data-label="הדרך המוכרת">{r.old}</td>
                    <td className={s.new} data-label="ב-HirO">{r.hiro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Deep dive ── */}
        <section id="deep" className={`${s.section} ${s.alt}`} aria-labelledby="deep-h">
          <div className="wrap">
            <div className={s.sechead}>
              <p className="kicker">צוללים פנימה</p>
              <h2 id="deep-h" className="display-l">שלושה דברים שאין כמעט באף מערכת גיוס</h2>
            </div>
            <DeepDive />
          </div>
        </section>

        {/* ── Numbers ── */}
        <section className={s.section} aria-label="HirO במספרים">
          <ul className={`wrap ${s.numbers}`}>
            {NUMBERS.map(x => <li key={x.t}><b>{x.n}</b><span>{x.t}</span></li>)}
          </ul>
        </section>

        {/* ── Close ── */}
        <section id="demo" className={s.section} aria-labelledby="close-h">
          <div className="wrap">
            <div className={s.close}>
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
              <img src="/images/hiro-logo-white.svg" alt="HirO" width={128} height={64} />
              <h2 id="close-h">רוצים לראות את זה על המשרות שלכם?</h2>
              <p>הדגמה על משרות ומועמדים מהעולם שלכם.</p>
              <a href="/contact" className={`btn ${s.closeBtn}`}>תאמו הדגמה <span className="arr" aria-hidden="true">←</span></a>
            </div>
            <p className={s.note}>הנתונים בסרטונים להמחשה בלבד</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
