import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import s from './story.module.css'

const SITE = 'https://hiro.co.il'
const LEAD = 'HirO לא נולדה במשרד הייטק. היא נולדה אחרי שיחת טלפון אחת במשרד השמה בנתיבות, עם מועמדת טובה שלא היה לנו מספיק מה להציע לה.'

export const metadata: Metadata = {
  title: { absolute: 'הסיפור שלנו | איך נולדה HirO' },
  description: LEAD,
  alternates: { canonical: '/our-story' },
  openGraph: {
    title: 'הסיפור שלנו | איך נולדה HirO',
    description: LEAD,
    url: '/our-story',
    type: 'website',
    locale: 'he_IL',
  },
}

const aboutLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': `${SITE}/our-story#page`,
  url: `${SITE}/our-story`,
  name: 'הסיפור שלנו: איך נולדה HirO',
  description: LEAD,
  inLanguage: 'he',
  isPartOf: { '@type': 'WebSite', url: SITE },
  about: { '@id': `${SITE}/#organization` },
  mainEntity: { '@id': `${SITE}/#organization` },
  author: { '@type': 'Person', name: 'גלעד', jobTitle: 'מייסד HirO', worksFor: { '@id': `${SITE}/#organization` } },
}

export default function OurStoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd).replace(/</g, '\\u003c') }} />
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className={s.hero} aria-labelledby="story-h1">
          <div className={`wrap ${s.inner}`}>
            <p className="kicker">הסיפור שלנו</p>
            <h1 id="story-h1" className={`display-l ${s.h1}`}>איך נולדה HirO</h1>
            <p className="lede">{LEAD}</p>
          </div>
        </section>

        <section className={s.body}>
          <div className={`wrap ${s.inner}`}>
            <article className={s.chapter} aria-labelledby="ch1">
              <h2 id="ch1">שיחה אחת</h2>
              <p>
                לפני כמה שנים, שרית, אשתי ומנהלת הגיוס במימד אנושי, סיימה שיחה עם מועמדת מקסימה. מועמדת טובה באמת.
                הייתה לה משרה אחת להציע לה, ויותר מזה לא היה.
              </p>
              <p>שרית כל כך רצתה לעזור, ושאלה את השאלה שממנה הכל התחיל:</p>
              <p className={s.quote}>למה אני לא יכולה להעביר אותה הלאה, עם המלצה, כדי שלפחות חברות אחרות ייהנו ממנה?</p>
            </article>

            <article className={s.chapter} aria-labelledby="ch2">
              <h2 id="ch2">למה זה לא עובד היום</h2>
              <p>
                חשבתי על זה. אם אני מחזיק את קורות החיים שלה ומחליט למי לתת ולמי לא, אני בעצם סוחר במועמדים.
                זה מסורבל, וזה לא נכון כלפי המועמדת.
              </p>
              <p>
                ועוד משהו תמיד שיגע אותי. אותו מועמד שולח קורות חיים להרבה משרות, וכל מערכת גיוס שומרת עותק משלה.
                <b> אותם קורות חיים נכנסים לארון אצלי, ושוב אצל חברה אחרת, ושוב אצל עוד אחת, ושם הם מתיישנים.</b> אף אחד לא נהנה מזה,
                לא המועמד ולא המגייס.
              </p>
              <p>
                וכשרציתי לפתוח משרה, הייתי צריך להקים לבד תחומים ותגיות, בלי עץ משרות ובלי קטגוריות. באתי לגייס,
                ומצאתי את עצמי בונה תגיות.
              </p>
            </article>

            <article className={s.chapter} aria-labelledby="ch3">
              <h2 id="ch3">מה בנינו</h2>
              <p>הבנתי שהפתרון מתחיל בדרך שבה מועמדים ומשרות נכנסים למערכת. מזה נבנתה HirO:</p>
              <ul className={s.answers}>
                <li>
                  <h3>למועמדים: הכוח חוזר אליהם</h3>
                  <p>עוזר אישי, עזרה בעריכת קורות חיים והתאמה למשרות שבאמת מתאימות להם.</p>
                </li>
                <li>
                  <h3>למגייסים: תשתית אחת, שנבנית פעם אחת</h3>
                  <p>עץ משרות, קטגוריות ותגיות מסודרות. כל לקוח חדש נהנה מהן מהיום הראשון, במקום להתחיל מאפס.</p>
                </li>
                <li>
                  <h3>לשניהם: התאמה מהירה ועקבית</h3>
                  <p>כל מועמד וכל משרה מעובדים פעם אחת, ומשם ההתאמה ביניהם מהירה, זולה ונותנת את אותה תוצאה בכל פעם.</p>
                </li>
              </ul>
            </article>

            <article className={s.chapter} aria-labelledby="ch4">
              <h2 id="ch4">נוח לי, אז נוח לכולם</h2>
              <p>
                אני אדם שמחפש שיהיה לו הכי נוח שאפשר. כשנוח לי, אני הכי פרודקטיבי, וכל הסביבה שלי מרוויחה מזה.
                אז גם ב-HirO היה לי חשוב שיהיה ממש נוח: קל לעבור ממסך למסך, אפשר לעשות כל דבר בכמה דרכים, וכל משתמש מתאים אותה לעצמו.
              </p>
              <p>
                תחשבו שקניתם מרצדס, ומישהו אומר לכם: מהמסך הרגיל, בלי מוסך, תכוונו בעצמכם את המנוע. <b>זה מה שהבאתי למגייס.</b> הוא
                קובע את המשקלות במנוע ההתאמה לפי אג׳נדת הגיוס שלו, ורואה איך הציון מחושב בשבילו ובשביל המשרות שלו. אפשר תמיד
                להשתמש בתבניות של המערכת, ואפשר להעביר כל משרה לתבנית אחרת. ולדעתי, שווה לקנות תוכנה ממי שבאמת נוח לו.
              </p>
              <p className={s.sign}><b>גלעד</b>, מייסד HirO. HirO נבנתה על ידי מימד אנושי, משרד השמה מנתיבות.</p>
              <div className={s.ctas}>
                <a href="/contact" className="btn btn-primary">תאמו הדגמה <span className="arr" aria-hidden="true">←</span></a>
                <a href="/candidates" className="btn btn-ghost">למועמדים</a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
