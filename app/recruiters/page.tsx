import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ProductFilm } from '@/components/film/ProductFilm'
import { RotatingWords } from '@/components/site/RotatingWords'
import { RevealOnScroll } from '@/components/site/Reveal'
import { CriteriaTicker, FeatureIndex, type IndexItem } from '@/components/site/sections'
import s from '@/components/site/site.module.css'

export const metadata: Metadata = {
  title: 'Hiro למגייסים ולמשרדי השמה',
  description: 'Job Sonar שמדרג את המאגר שלכם למשרה בלחיצה, תבנית התאמה עם משקלות שאתם קובעים, SMS ומייל בתפוצה ו-CRM למשרדי השמה.',
  keywords: ['מערכת גיוס למגייסים', 'תוכנה למשרדי השמה', 'AI בגיוס', 'Job Sonar', 'CRM לגיוס', 'ATS'],
  alternates: { canonical: '/recruiters' },
  openGraph: {
    title: 'Hiro למגייסים ולמשרדי השמה',
    description: 'המאגר שכבר יש לכם, מדורג למשרה בלחיצה.',
    url: '/recruiters',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Hiro למגייסים' }],
  },
}

const MORE: IndexItem[] = [
  {
    id: 'feature-crm', name: 'CRM ולקוחות', aud: 'משרדי השמה',
    one: 'לקוחות, משרות וקורות חיים שנשלחו.',
    body: 'ניהול לקוחות ומשרות, משפך גיוס לכל משרה (מועמדים חדשים, בתהליך, נשלחו ללקוח, נפסלו), מקורות גיוס ותזכורות. כל מה שקשור ללקוח נמצא על הכרטיס שלו.',
  },
  {
    name: 'פירוק ההתאמה', aud: 'כל מגייס',
    one: 'לא רק ציון. רואים איפה יש פער.',
    body: 'לכל מועמד מול כל משרה מוצג פירוט לפי קריטריון: מה תואם, מה חסר ומה לא ידוע. כך יודעים מה לשאול בשיחה הראשונה, ולמה מועמד דורג כמו שדורג.',
  },
  {
    name: 'לוח בקרה ויעדים', aud: 'כל מגייס',
    one: 'מה קורה היום ואיפה אתם מול היעד.',
    body: 'מדדים אישיים ומדדי חברה: מועמדים בתהליך, משרות פתוחות, פניות החודש, ראיונות היום, זמן ממוצע בסטטוס ויעד גיוסים חודשי. אתם בוחרים אילו ווידג׳טים מופיעים.',
  },
  {
    name: 'חיפוש ורשימות', aud: 'כל מגייס',
    one: 'חיפוש חופשי, סינון מתקדם וחיפושים שמורים.',
    body: 'רשימת מועמדים עם ציון התאמה למשרה האחרונה שאליה הוגשו, מקור גיוס, מיקום, תחום ותעשייה. שומרים חיפושים שחוזרים עליהם ומגיעים אליהם בלחיצה.',
  },
]

export default function RecruitersPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className={s.hero} aria-labelledby="rec-hero-heading">
          <div className="wrap">
            <p className="kicker">למגייסים ולמשרדי השמה</p>
            <h1 id="rec-hero-heading" className={`display-xl ${s.h1} ${s.h1Wide}`}>
              הגיוס הבא שלכם<br />
              <RotatingWords className={s.accent} words={['כבר נמצא במאגר.', 'מתחיל בלחיצה.', 'נמדד בתבנית שלכם.']} />
            </h1>
            <div className={s.heroRow}>
              <p className="lede">
                Hiro מדרגת את המאגר הקיים שלכם מול כל משרה פתוחה, לפי הקריטריונים והמשקלות שאתם קובעים,
                ומשם עוברים לפנייה בלי לצאת מהמערכת.
              </p>
              <div className={s.ctas}>
                <a href="/contact" className="btn btn-primary">קבעו הדגמה <span className="arr" aria-hidden="true">←</span></a>
                <a href="#feature-job-sonar" className="btn btn-ghost">איך זה עובד</a>
              </div>
            </div>
            <ProductFilm scenes={['sonar', 'match', 'outreach']} label="הדגמת מוצר למגייסים" />
          </div>
        </section>

        <div className="wrap">
          <CriteriaTicker label="הקריטריונים שנכנסים לציון, ובאיזה משקל, נקבעים אצלכם" items={['התאמה וקטורית', 'ניסיון רלוונטי', 'ציפיות שכר', 'מרחק מהיעד', 'היקף משרה', 'שעות משרה', 'זמינות', 'ניידות', 'רישיון נהיגה', 'זיקה לתחום']} />
        </div>

        {/* ── Job Sonar ── */}
        <section id="feature-job-sonar" className={s.sectionTight} style={{ scrollMarginTop: 72, padding: "2.5rem 0" }} aria-labelledby="sonar-h">
          <div className="wrap">
            <div className={`${s.secHead} ${s.featRow} reveal`}>
              <div>
                <span className={s.featTag}>01 · Job Sonar</span>
                <h2 id="sonar-h" className="display-l" style={{ margin: 0 }}>המאגר שכבר יש לכם, מדורג למשרה.</h2>
              </div>
              <div>
                <p className="lede" style={{ marginBottom: '1.5rem' }}>
                  לוחצים על &quot;הפעל סונאר&quot;, ו-Sonar סורק את כל מאגר המועמדים מול המשרה ומציף את מי שעובר את סף ההתאמה.
                  כשפרטי המשרה או המועמד משתנים, הדירוג מתעדכן בלי להריץ חיפוש מחדש.
                </p>
                <ul className={s.featPoints}>
                  <li>קובעים כמה מועמדים להציג וסף ציון מינימלי</li>
                  <li>התאמה וקטורית: מודלים סמנטיים שמבינים משמעות, לא רק מילים</li>
                  <li>תנאי סף: מסננים החוצה מי שלא עומד בקריטריון שבחרתם</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Match template ── */}
        <section id="feature-ai-match" className={s.sectionTight} style={{ scrollMarginTop: 72, padding: "2.5rem 0" }} aria-labelledby="match-h">
          <div className="wrap">
            <div className={`${s.secHead} ${s.featRow} reveal`}>
              <div>
                <span className={s.featTag}>02 · תבנית התאמה</span>
                <h2 id="match-h" className="display-l" style={{ margin: 0 }}>התבנית שלכם.<br />לא תבנית אחידה.</h2>
              </div>
              <div>
                <p className="lede" style={{ marginBottom: '1.5rem' }}>
                  משרד שמגייס הנהלת חשבונות לא מגייס כמו חברת הייטק. ב-Hiro בונים תבנית התאמה: בוחרים אילו קריטריונים נבדקים
                  ונותנים לכל אחד משקל. הציון הסופי משקף את הדרך שבה אתם מגייסים.
                </p>
                <ul className={s.featPoints}>
                  <li>עשרות פרמטרים לבחירה, משקל לכל אחד</li>
                  <li>שינוי משקל מתעדכן מיד בציונים</li>
                  <li>פירוט לכל מועמד: מה תואם ומה חסר</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Outreach ── */}
        <section id="feature-outreach" className={s.sectionTight} style={{ scrollMarginTop: 72, padding: "2.5rem 0" }} aria-labelledby="out-h">
          <div className="wrap">
            <div className={`${s.secHead} ${s.featRow} reveal`}>
              <div>
                <span className={s.featTag}>03 · מרכז תקשורת</span>
                <h2 id="out-h" className="display-l" style={{ margin: 0 }}>הודעה אחת.<br />כל מועמד מקבל את שלו.</h2>
              </div>
              <div>
                <p className="lede" style={{ marginBottom: '1.5rem' }}>
                  בוחרים את המועמדים מהרשימה, כותבים הודעה אחת עם משתנים כמו שם ומשרה, ושולחים ב-SMS או במייל,
                  בלי להעתיק מספרים לטלפון ובלי לכתוב את אותה הודעה עשרים פעם.
                </p>
                <ul className={s.featPoints}>
                  <li>SMS ומייל בתפוצה מתוך המערכת</li>
                  <li>תבניות עם משתנים אישיים</li>
                  <li>שליחה לכל הרשימה בלחיצה אחת</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── More ── */}
        <section className={s.section} aria-labelledby="more-h" style={{ paddingTop: '4rem' }}>
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="more-h" className="display-l" style={{ margin: 0 }}>ועוד, באותה מערכת</h2>
              <p className="lede">בלי לייצא לאקסל ובלי לחבר כלים שלא מדברים זה עם זה.</p>
            </div>
            <div className="reveal"><FeatureIndex items={MORE} /></div>
          </div>
        </section>

        <section id="signup" className={s.sectionTight} aria-labelledby="rec-cta-h">
          <div className="wrap">
            <div className={`${s.cta} reveal`}>
              <h2 id="rec-cta-h" className="display-l">בואו נריץ את Sonar על משרה שלכם.</h2>
              <div>
                <p>ספרו לנו איך אתם מגייסים היום, ונראה לכם איך זה נראה ב-Hiro.</p>
                <div className={s.ctas}>
                  <a href="/contact" className={`btn ${s.ctaBtn}`}>קבעו הדגמה <span className="arr" aria-hidden="true">←</span></a>
                  <a href="https://app.hiro.co.il" className={`btn btn-ghost ${s.ctaGhost}`}>כניסה למערכת</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <RevealOnScroll />
    </>
  )
}
