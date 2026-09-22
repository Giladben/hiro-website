import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ProductFilm } from '@/components/film/ProductFilm'
import { RotatingWords } from '@/components/site/RotatingWords'
import { RevealOnScroll } from '@/components/site/Reveal'
import { CriteriaTicker, FeatureIndex, type IndexItem } from '@/components/site/sections'
import s from '@/components/site/site.module.css'

const FEATURES: IndexItem[] = [
  {
    name: 'Job Sonar', aud: 'מגייסים',
    one: 'המאגר שכבר יש לכם, מדורג למשרה בלחיצה.',
    body: 'Sonar סורק את מאגר המועמדים הקיים שלכם מול משרה פתוחה ומציף את ההתאמות הטובות ביותר, לפי סף ציון שאתם קובעים. כשפרטי המשרה או המועמד משתנים, הדירוג מתעדכן בלי להריץ חיפוש מחדש.',
    href: '/recruiters#feature-job-sonar', linkLabel: 'איך Sonar עובד',
  },
  {
    name: 'תבנית התאמה', aud: 'מגייסים',
    one: 'אתם קובעים מה נבדק ובאיזה משקל.',
    body: 'ניסיון, ציפיות שכר, מרחק, היקף משרה, זמינות ועוד. לכל קריטריון יש משקל שאתם מגדירים, והציון הסופי משקף את הדרך שבה הצוות שלכם מגייס, לא אלגוריתם אחיד לכולם.',
    href: '/recruiters#feature-ai-match', linkLabel: 'על מנוע ההתאמה',
  },
  {
    name: 'פירוק ההתאמה', aud: 'מגייסים',
    one: 'לא רק ציון. רואים בדיוק איפה יש פער.',
    body: 'לכל מועמד מול כל משרה מוצג פירוט לפי קריטריון: מה תואם, מה חסר, ומה לא ידוע. כך אפשר להחליט מהר, ולדעת מה לשאול בשיחה הראשונה.',
  },
  {
    name: 'מרכז תקשורת', aud: 'מגייסים',
    one: 'SMS ומייל בתפוצה, עם משתנים אישיים.',
    body: 'בוחרים קבוצת מועמדים, כותבים הודעה אחת עם שם, משרה ופרטים שמתמלאים אוטומטית, ושולחים.',
  },
  {
    name: 'CRM ולקוחות', aud: 'משרדי השמה',
    one: 'לקוחות, משרות וקורות חיים שנשלחו, במקום אחד.',
    body: 'למשרדי השמה: ניהול לקוחות ומשרות, משפך גיוס לכל משרה, מעקב אחרי קורות חיים שנשלחו ללקוח ומקורות גיוס. בלי אקסלים בצד.',
  },
  {
    name: 'לוח בקרה ויעדים', aud: 'מגייסים',
    one: 'מה קורה היום, ואיפה אתם מול היעד החודשי.',
    body: 'מדדים אישיים ומדדי חברה: מועמדים בתהליך, משרות פתוחות, פניות, ראיונות היום, זמן ממוצע בסטטוס ויעד גיוסים חודשי.',
  },
  {
    name: 'סוכן קריירה', aud: 'מועמדים',
    one: 'עוזר אישי שעוקב בשבילך אחרי החיפוש.',
    body: 'מציף הזדמנויות שמתאימות לפרופיל, עוקב אחרי ההגשות ומזכיר מה הצעד הבא. את ההחלטות מקבלים את/ה.',
    href: '/candidates', linkLabel: 'לצד המועמדים',
  },
  {
    name: 'ריבוי פרופילים', aud: 'מועמדים',
    one: 'כיוון מקצועי אחד? לא חייב.',
    body: 'כמה פרופילים מקצועיים תחת חשבון אחד, לכל אחד קורות חיים וכישורים משלו. מתאים למי שמחפש בשני תחומים במקביל.',
    href: '/candidates#feature-multi-persona', linkLabel: 'על ריבוי פרופילים',
  },
  {
    name: 'מעקב הגשות', aud: 'מועמדים',
    one: 'כל ההגשות, גם אלה שמחוץ ל-Hiro.',
    body: 'לוח אחד לכל ההגשות: דרך Hiro, לינקדאין, אתרי חברות או חברות השמה. סטטוסים, תזכורות וראיונות קרובים במקום אחד.',
    href: '/candidates#feature-tracker', linkLabel: 'על מעקב ההגשות',
  },
]

const CRITERIA = ['התאמה וקטורית', 'ניסיון רלוונטי', 'ציפיות שכר', 'מרחק מהיעד', 'היקף משרה', 'שעות משרה', 'זמינות', 'ניידות', 'רישיון נהיגה', 'זיקה לתחום', 'תרבות ארגונית']

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* ── Hero ── */}
        <section className={s.hero} aria-labelledby="hero-heading">
          <div className="wrap">
            <p className="kicker">מערכת גיוס · CRM · מרכז קריירה</p>
            <h1 id="hero-heading" className={`display-xl ${s.h1} ${s.h1Wide}`}>
              Hiro מוצאת<br />
              <RotatingWords
                className={s.accent}
                words={['את המועמדת הנכונה.', 'את מי שפספסתם.', 'את מי שכבר במאגר.', 'את המשרה הבאה שלך.']}
              />
            </h1>
            <div className={s.heroRow}>
              <p className="lede">
                מערכת גיוס ו-CRM למגייסים ולמשרדי השמה, ומרכז קריירה אישי למועמדים.
                אותו מנוע התאמה, משני צידי השולחן.
              </p>
              <div className={s.ctas}>
                <a href="/contact" className="btn btn-primary">קבעו הדגמה <span className="arr" aria-hidden="true">←</span></a>
                <a href="/candidates" className="btn btn-ghost">אני מחפש/ת עבודה</a>
              </div>
            </div>
            <div id="product" className={s.filmWrap}>
              <ProductFilm />
            </div>
          </div>
        </section>

        <div className="wrap">
          <CriteriaTicker label="מה נכנס לציון ההתאמה, ובאיזה משקל, זו החלטה שלכם" items={CRITERIA} />
        </div>

        {/* ── Two sides ── */}
        <section id="platform" className={s.section} aria-labelledby="sides-heading">
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="sides-heading" className="display-l" style={{ margin: 0 }}>פלטפורמה אחת.<br />שני צדדים של אותה שיחה.</h2>
              <p className="lede">רוב הכלים בנויים לצד אחד. Hiro בנויה כך שמגייס ומועמד יסתכלו על אותה התאמה, כל אחד מהזווית שלו.</p>
            </div>
            <div className={`${s.sides} reveal`}>
              <article className={s.side} aria-labelledby="side-rec">
                <span className={s.sideLabel}><span>01</span>למגייסים ולמשרדי השמה</span>
                <h3 id="side-rec" className={s.sideTitle}>פחות סינון.<br />יותר שיחות עם האנשים הנכונים.</h3>
                <ul className={s.sideList}>
                  <li>Job Sonar <span>דירוג המאגר למשרה בלחיצה</span></li>
                  <li>תבנית התאמה <span>הקריטריונים והמשקלות שלכם</span></li>
                  <li>מרכז תקשורת <span>SMS ומייל בתפוצה</span></li>
                  <li>CRM ולקוחות <span>משרות, לקוחות ומשפך גיוס</span></li>
                </ul>
                <div className={s.sideFoot}><a className="link-u" href="/recruiters">הכל למגייסים ←</a></div>
              </article>
              <article className={`${s.side} ${s.sideInk}`} aria-labelledby="side-cand">
                <span className={s.sideLabel}><span>02</span>למועמדים</span>
                <h3 id="side-cand" className={s.sideTitle}>כל ההגשות שלך במקום אחד.<br />גם אלה שמחוץ ל-Hiro.</h3>
                <ul className={s.sideList}>
                  <li>סוכן קריירה <span>הזדמנויות ותזכורות</span></li>
                  <li>ריבוי פרופילים <span>כמה כיוונים, חשבון אחד</span></li>
                  <li>מעקב הגשות <span>מכל מקור, בלוח אחד</span></li>
                  <li>פרופיל חי <span>מגייסים רואים את הגרסה העדכנית</span></li>
                </ul>
                <div className={s.sideFoot}><a className="link-u" href="/candidates">הכל למועמדים ←</a></div>
              </article>
            </div>
          </div>
        </section>

        {/* ── Manifesto ── */}
        <section className={s.sectionTight} aria-label="הגישה שלנו">
          <div className="wrap reveal">
            <p className={s.manifesto}>
              <span>מילות מפתח מוצאות קורות חיים.</span><br />
              Hiro מחפשת אנשים.
            </p>
            <p className={`lede ${s.manifestoNote}`}>
              חיפוש לפי מילים מפספס את מי שכתב &quot;הנהלת חשבונות&quot; במקום &quot;מנהלת חשבונות&quot;.
              התאמה וקטורית מבינה משמעות, והתבנית שלכם קובעת מה באמת חשוב.
            </p>
          </div>
        </section>

        {/* ── Feature index ── */}
        <section id="features" className={s.section} aria-labelledby="index-heading">
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="index-heading" className="display-l" style={{ margin: 0 }}>מה יש בפנים</h2>
              <p className="lede">תשעה כלים שעובדים על אותו מאגר ואותו מנוע התאמה. בלי אינטגרציות בין מערכות שלא מדברות זו עם זו.</p>
            </div>
            <div className="reveal"><FeatureIndex items={FEATURES} /></div>
          </div>
        </section>

        {/* ── How to start ── */}
        <section id="how" className={s.sectionTight} aria-labelledby="how-heading">
          <div className="wrap">
            <div className={`${s.secHead} reveal`}>
              <h2 id="how-heading" className="display-l" style={{ margin: 0 }}>איך מתחילים</h2>
              <p className="lede">למגייסים ולמשרדי השמה. מועמדים נרשמים לבד, <a className="link-u" href="/candidates">בחינם</a>.</p>
            </div>
            <ol className={`${s.steps} reveal`}>
              <li>
                <span className={s.stepNum}>01</span>
                <h3>שיחת היכרות</h3>
                <p>מבינים איך אתם מגייסים היום: אילו משרות, איזה מאגר, ומה הכי גוזל לכם זמן.</p>
              </li>
              <li>
                <span className={s.stepNum}>02</span>
                <h3>בונים את התבנית</h3>
                <p>מגדירים קריטריונים ומשקלות, מעלים משרות פתוחות ומחברים את המאגר הקיים.</p>
              </li>
              <li>
                <span className={s.stepNum}>03</span>
                <h3>Sonar מתחיל לעבוד</h3>
                <p>כל משרה מקבלת רשימה מדורגת מתוך המאגר שלכם, ומשם עוברים לפנייה.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="contact" className={s.sectionTight} aria-labelledby="cta-heading">
          <div className="wrap">
            <div className={`${s.cta} reveal`}>
              <h2 id="cta-heading" className="display-l">בואו נראה את זה על המשרות שלכם.</h2>
              <div>
                <p>ספרו לנו איך אתם מגייסים היום, ונראה לכם איך זה נראה ב-Hiro.</p>
                <div className={s.ctas}>
                  <a href="/contact" className={`btn ${s.ctaBtn}`}>קבעו הדגמה <span className="arr" aria-hidden="true">←</span></a>
                  <a href="/candidates" className={`btn btn-ghost ${s.ctaGhost}`}>מחפשים עבודה?</a>
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
