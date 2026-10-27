import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { employerEnabled } from '@/lib/employer/source'
import s from '@/components/employer/employer.module.css'

export const metadata: Metadata = {
  title: 'פרסום משרה בחינם',
  description: 'מפרסמים משרה בחינם בלוח המשרות של HirO ובגוגל, ומקבלים את המועמדים למקום אחד: קורות חיים, תשובות לשאלות סינון, מענה במייל והעברה לצוות.',
  alternates: { canonical: '/employers' },
}

const FAQ: [string, string][] = [
  ['זה באמת חינם?', 'כן. פרסום משרה, קבלת מועמדים, מענה במייל והעברת קורות חיים לא עולים כסף. בהמשך נציע גם חיפוש במאגר המועמדים של HirO, שם משלמים רק על פרופיל שפותחים.'],
  ['איפה המשרה מופיעה?', 'בלוח המשרות של HirO, ב-Google for Jobs (חיפוש עבודה בגוגל), ואפשר לשתף אותה בוואטסאפ ובפייסבוק בלחיצה.'],
  ['למה המשרה הראשונה מחכה לאישור?', 'כדי לשמור על הלוח נקי ממשרות פיקטיביות. אנחנו בודקים את המשרות הראשונות של כל עסק חדש, בדרך כלל באותו יום. אחר כך משרות עולות מיד.'],
  ['מה עם הפרטיות של המועמדים?', 'המועמדים מסכימים שהפרטים שלהם יגיעו לעסק שפרסם את המשרה, ורק לצורך הגיוס אליה. כל העברה של קורות חיים נרשמת ביומן, והגשות נמחקות שנה אחרי שהמשרה נסגרת.'],
  ['ואם אני משרד השמה, או רוצה מערכת מלאה?', 'מערכת הגיוס המלאה של HirO (CRM, התאמה חכמה, סורק מאגר) מחכה לכם. המשרות והמועמדים שכבר צברתם עוברים איתכם.'],
]

export default function EmployersPage() {
  if (!employerEnabled) notFound()
  return (
    <>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className={s.hero}>
          <div className={`wrap ${s.heroGrid}`}>
            <div>
              <p className="kicker">למעסיקים</p>
              <h1 className={s.heroH}>מפרסמים משרה <em>בחינם</em>. המועמדים מגיעים אליכם.</h1>
              <p className={s.heroP}>חמש דקות ומשרה באוויר, בלוח המשרות של HirO ובגוגל. כל המועמדים במקום אחד: קורות חיים, תשובות לשאלות שהגדרתם, מייל חזרה בלחיצה, והעברה לצוות.</p>
              <div className={s.heroCtas}>
                <Link href="/employer/login" className="btn btn-primary">פרסום משרה בחינם <span className="arr">←</span></Link>
                <span className={s.free}>בלי כרטיס אשראי. בלי התחייבות.</span>
              </div>
            </div>
            <ol className={s.steps}>
              <li><div><b>נרשמים עם המייל</b><span>בלי סיסמה. קוד למייל, ופרטי העסק בדקה.</span></div></li>
              <li><div><b>כותבים את המשרה</b><span>תחום, עיר, שעות ושכר מרשימות מוכנות, ותצוגה מקדימה של איך שהיא תיראה.</span></div></li>
              <li><div><b>מקבלים מועמדים</b><span>מייל על כל מועמד חדש, וכל ההגשות מחכות לכם באזור המעסיקים.</span></div></li>
            </ol>
          </div>
        </section>

        <section className="wrap" aria-label="מה מקבלים">
          <div className={s.feats}>
            <div className={s.feat}><b>שאלות סינון</b><p>עד חמש שאלות (כן/לא, בחירה, טקסט) שהמועמדים עונים בזמן ההגשה. רואים את התשובות ליד כל מועמד.</p></div>
            <div className={s.feat}><b>קורות חיים בתוך המסך</b><p>פותחים, מסמנים &quot;מתאים&quot; או &quot;לא מתאים&quot; ומשאירים הערה. בלי להוריד קבצים ובלי לחפש במייל.</p></div>
            <div className={s.feat}><b>מייל חזרה בלחיצה</b><p>תבניות מוכנות לזימון לראיון, בקשת פרטים ודחייה מנומסת. התשובה של המועמד מגיעה ישירות אליכם.</p></div>
            <div className={s.feat}><b>העברה לצוות</b><p>שולחים קורות חיים של מועמד אחד, של כמה מסומנים או של כולם, לכל מייל, למשל למנהל/ת המשמרת.</p></div>
          </div>
        </section>

        <section className={`wrap ${s.faq}`} aria-labelledby="faq-h">
          <h2 id="faq-h">שאלות</h2>
          {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
        </section>
      </main>
      <Footer />
    </>
  )
}
