import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ProductFilm } from '@/components/film/ProductFilm'
import { RotatingWords } from '@/components/site/RotatingWords'
import { RevealOnScroll } from '@/components/site/Reveal'
import { FeatureIndex, type IndexItem } from '@/components/site/sections'
import s from '@/components/site/site.module.css'

export const metadata: Metadata = {
  title: 'Hiro למועמדים',
  description: 'כל ההגשות שלך בלוח אחד, גם אלה שמחוץ ל-Hiro. כמה פרופילים מקצועיים בחשבון אחד, סוכן קריירה אישי, ופרופיל שמגייסים רואים תמיד בגרסה העדכנית.',
  keywords: ['חיפוש עבודה', 'מעקב הגשות', 'קורות חיים', 'סוכן קריירה AI', 'ניהול קריירה'],
  alternates: { canonical: '/candidates' },
  openGraph: {
    title: 'Hiro למועמדים',
    description: 'כל ההגשות שלך במקום אחד. גם אלה שמחוץ ל-Hiro.',
    url: '/candidates',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Hiro למועמדים' }],
  },
}

const FEATURES: IndexItem[] = [
  {
    id: 'feature-tracker', name: 'מעקב הגשות', aud: 'לוח אחד',
    one: 'כל ההגשות, מכל מקור.',
    body: 'הגשות דרך Hiro, לינקדאין, אתרי חברות או חברות השמה, כולן בלוח אחד. רואים באיזה שלב כל תהליך, מתי הראיון הבא, ומה מחכה לתשובה.',
  },
  {
    id: 'feature-multi-persona', name: 'ריבוי פרופילים', aud: 'חשבון אחד',
    one: 'כמה כיוונים מקצועיים, בלי לוותר על אף אחד.',
    body: 'מנהלת חשבונות שמחפשת גם בגבייה? מפתח שבודק גם תפקידי ניהול? לכל כיוון פרופיל משלו, עם קורות חיים וכישורים נפרדים, תחת אותו חשבון.',
  },
  {
    id: 'feature-agent', name: 'סוכן קריירה', aud: 'AI',
    one: 'עוזר שעוקב בשבילך אחרי החיפוש.',
    body: 'מציף הזדמנויות שמתאימות לפרופיל, מזכיר מה הצעד הבא בכל תהליך ועוזר לחדד את קורות החיים. ההחלטות נשארות אצלך.',
  },
  {
    id: 'feature-sync', name: 'פרופיל חי', aud: 'מול מגייסים',
    one: 'עדכנת קורות חיים? המגייסים רואים את הגרסה החדשה.',
    body: 'מגייסים שעובדים איתך דרך Hiro תמיד רואים את הפרופיל העדכני, בלי לשלוח קובץ מחדש לכל אחד מהם.',
  },
]

export default function CandidatesPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className={s.hero} aria-labelledby="cand-hero-heading">
          <div className="wrap">
            <p className="kicker">למועמדים · בחינם</p>
            <h1 id="cand-hero-heading" className={`display-xl ${s.h1} ${s.h1Wide}`}>
              החיפוש שלך,<br />
              <RotatingWords className={s.accent} words={['במקום אחד.', 'בכמה כיוונים.', 'בלי לאבד הגשה.']} />
            </h1>
            <div className={s.heroRow}>
              <p className="lede">
                עשרים הגשות, שלושה אתרים ושתי חברות השמה. Hiro מרכזת את כל חיפוש העבודה בלוח אחד,
                ונותנת לך לנהל יותר מכיוון מקצועי אחד בלי לבלבל בין הגרסאות.
              </p>
              <div className={s.ctas}>
                <a href="https://app.hiro.co.il" className="btn btn-primary">הרשמה בחינם <span className="arr" aria-hidden="true">←</span></a>
                <a href="#features" className="btn btn-ghost">מה מקבלים</a>
              </div>
            </div>
            <ProductFilm scenes={['candidate']} label="הדגמת מוצר למועמדים" />
          </div>
        </section>

        <section className={s.sectionTight} aria-label="למה Hiro">
          <div className="wrap reveal">
            <p className={s.manifesto}>
              <span>שלחת קורות חיים ולא שמעת כלום.</span><br />
              עכשיו לפחות רואים איפה זה עומד.
            </p>
          </div>
        </section>

        <section id="features" className={s.section} aria-labelledby="cand-features-h" style={{ scrollMarginTop: 72 }}>
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="cand-features-h" className="display-l" style={{ margin: 0 }}>מה מקבלים</h2>
              <p className="lede">ארבעה כלים, חשבון אחד, בלי תשלום.</p>
            </div>
            <div className="reveal"><FeatureIndex items={FEATURES} /></div>
          </div>
        </section>

        <section className={s.sectionTight} aria-labelledby="cand-how-h">
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="cand-how-h" className="display-l" style={{ margin: 0 }}>איך מתחילים</h2>
              <p className="lede">כמה דקות, ואפשר להתחיל לעקוב.</p>
            </div>
            <ol className={`${s.steps} reveal`}>
              <li>
                <span className={s.stepNum}>01</span>
                <h3>מעלים קורות חיים</h3>
                <p>הפרופיל נבנה מקורות החיים הקיימים. משלימים ומתקנים מה שצריך.</p>
              </li>
              <li>
                <span className={s.stepNum}>02</span>
                <h3>מגדירים כיוונים</h3>
                <p>פרופיל אחד או כמה, לפי התפקידים שמעניינים אותך.</p>
              </li>
              <li>
                <span className={s.stepNum}>03</span>
                <h3>מוסיפים הגשות</h3>
                <p>גם את אלה שכבר נשלחו, מכל מקום. מכאן הכל במקום אחד.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="signup" className={s.sectionTight} aria-labelledby="cand-cta-h">
          <div className="wrap">
            <div className={`${s.cta} reveal`}>
              <h2 id="cand-cta-h" className="display-l">המשרה הבאה שלך מתחילה בסדר.</h2>
              <div>
                <p>בחינם למועמדים. בלי כרטיס אשראי.</p>
                <div className={s.ctas}>
                  <a href="https://app.hiro.co.il" className={`btn ${s.ctaBtn}`}>הרשמה בחינם <span className="arr" aria-hidden="true">←</span></a>
                  <a href="/recruiters" className={`btn btn-ghost ${s.ctaGhost}`}>אני מגייס/ת</a>
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
