import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות — Hiro',
  description: 'מדיניות הפרטיות של פלטפורמת Hiro עבור מועמדים — אילו נתונים נאספים, כיצד הם משמשים ועם מי הם משותפים.',
}

type Section = {
  num: string
  title: string
  intro?: string
  bullets?: string[]
  paragraphs?: string[]
  subsections?: { title: string; body: string }[]
  closing?: string
}

const sections: Section[] = [
  {
    num: '1',
    title: 'איזה מידע אנחנו אוספים',
    intro: 'כאשר את/ה שולח/ת קורות חיים או נרשם/ת לפלטפורמה, אנו אוספים:',
    bullets: [
      'פרטים מזהים: שם מלא, מספר טלפון, כתובת דוא"ל',
      'תוכן קורות החיים: השכלה, ניסיון תעסוקתי, כישורים, שפות וכל מידע נוסף המפורט במסמך שהעלית',
      'קובץ/סרטון היכרות אישי (עד 60 שניות), במידה ובחרת להעלות',
      'תשובות לשאלוני מיון ומבחנים (טקסט ו/או וידאו), במידה ומולאו במסגרת הגשת מועמדות למשרה',
      'מידע הנגזר אוטומטית מקורות החיים על ידי מערכת בינה מלאכותית ("תגיות"), המשמש לצורך התאמת משרות',
      'נתוני שימוש בפלטפורמה (לרבות אזור אישי, אינטראקציה עם סוכן ה-AI)',
    ],
  },
  {
    num: '2',
    title: 'למה אנחנו משתמשים במידע',
    bullets: [
      'בניית פרופיל מועמד/ת ויצירת קורות חיים מעוצבים בפלטפורמה',
      'התאמת מועמד/ת למשרות רלוונטיות באמצעות מנוע ההתאמה של המערכת',
      'מתן גישה לסוכן AI אישי לצורך שיפור קורות חיים וייעוץ קריירה, ככל שבחרת להשתמש בשירות זה',
      'יצירת קשר בנוגע למשרות, עדכוני סטטוס מועמדות ותקשורת שירותית',
      'שיפור דיוק מערכת ההתאמה והתיוג האוטומטי',
    ],
    closing: 'המידע אינו משמש לצורך פרסום מסחרי של צדדים שלישיים שאינם קשורים להליכי גיוס, ואינו נמכר כמאגר אנשי קשר.',
  },
  {
    num: '3',
    title: 'עם מי משתפים את המידע',
    subsections: [
      {
        title: '3.1 גורמי גיוס (רכזות/י גיוס)',
        body: 'כאשר את/ה מגיש/ה מועמדות למשרה, מועברת עותק (\'עותק צל\') של הפרופיל הרלוונטי לגורם המטפל בגיוס עבור אותה משרה בלבד. שינויים שמבצע גורם הגיוס בעותק זה (לדוגמה תיוג פנימי) אינם משפיעים על הפרופיל המקורי שלך, ואינם גלויים לגורמי גיוס אחרים.',
      },
      {
        title: '3.2 חברות מעסיקות',
        body: 'פרטים רלוונטיים מתוך הפרופיל שהגשת עבור משרה ספציפית מועברים לחברה המעסיקה הרלוונטית, לצורך בחינת מועמדותך.',
      },
      {
        title: '3.3 ספקי שירות (עיבוד נתונים)',
        body: 'לצורך הפעלת יכולות הבינה המלאכותית של הפלטפורמה (זיהוי תגיות, סוכן AI, מנוע התאמה), מידע מעובד על ידי ספקי שירותי AI חיצוניים, בכפוף להסכמי עיבוד נתונים ואבטחת מידע. ספקים אלה אינם רשאים להשתמש במידע למטרות משלהם.',
      },
      {
        title: '3.4 מה אנחנו לא עושים',
        body: '', // rendered as bullets below via bullets2
      },
    ],
    bullets: [
      'איננו מוכרים את פרטי הקשר האישיים שלך (טלפון/דוא"ל) לצדדים שלישיים',
      'איננו חושפים את קורות החיים שלך למשרות/גורמים שלא אישרת (ראו סעיף 4)',
    ],
  },
  {
    num: '4',
    title: 'שליטה שלך במידע — הסכמות נפרדות',
    intro: 'מעבר לפרופיל הראשוני שנוצר עם קבלת קורות החיים, כל אחת מהפעולות הבאות דורשת אישור נפרד ומפורש ממך:',
    bullets: [
      'חשיפת הפרופיל שלך למשרות נוספות מעבר לזו שאליה הגשת מועמדות',
      'הצטרפות למאגר המועמדים הכללי של הפלטפורמה',
    ],
    closing: 'ניתן לשנות הסכמות אלו בכל עת דרך האזור האישי.',
  },
  {
    num: '5',
    title: 'תקופת שמירת המידע',
    paragraphs: [
      'המידע נשמר כל עוד קיים לך חשבון פעיל בפלטפורמה, ובהתאם לצורך הענייני (לדוגמה, תיעוד הליכי גיוס). לאחר בקשת מחיקה כאמור בסעיף 6, המידע יימחק או יופרד מזיהוי בהתאם לדין.',
    ],
  },
  {
    num: '6',
    title: 'הזכויות שלך',
    bullets: [
      'לעיין במידע השמור עליך במערכת',
      'לתקן או לעדכן מידע לא מדויק',
      'לבקש מחיקת הפרופיל והמידע הקשור אליו',
      'לבטל הסכמה לשימושים נוספים (חשיפה למשרות נוספות / מאגר מועמדים) בכל עת',
    ],
    closing: 'לצורך מימוש זכויות אלו ניתן לפנות אלינו בפרטים המופיעים בסעיף 9.',
  },
  {
    num: '7',
    title: 'אבטחת מידע',
    paragraphs: [
      'אנו נוקטים באמצעי אבטחה סבירים ומקובלים להגנה על המידע, לרבות הצפנה, בקרת גישה, וניטור. עם זאת, אין אפשרות להבטיח הגנה מוחלטת מפני כל אירוע אבטחה.',
    ],
  },
  {
    num: '8',
    title: 'קטינים',
    paragraphs: [
      'הפלטפורמה אינה מיועדת לשימוש על ידי קטינים מתחת לגיל 18, ואיננו אוספים ביודעין מידע על קטינים.',
    ],
  },
  {
    num: '9',
    title: 'יצירת קשר',
    paragraphs: [
      'בכל שאלה או בקשה בנוגע למדיניות זו או למידע השמור עליך, ניתן לפנות אלינו: [להשלמה — פרטי קשר ממונה פרטיות/החברה].',
    ],
  },
  {
    num: '10',
    title: 'שינויים במדיניות',
    paragraphs: [
      'מדיניות זו עשויה להתעדכן מעת לעת. נעדכן על שינויים מהותיים באמצעות הודעה בפלטפורמה או בדוא"ל.',
      'עודכן לאחרונה: [תאריך להשלמה]',
    ],
  },
]

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {items.map(b => (
        <li key={b} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.75 }}>
          <span aria-hidden="true" style={{ color: 'var(--p600)', fontWeight: 800, flexShrink: 0, marginTop: 2 }}>·</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section style={{ background: 'var(--bg-alt)', padding: '9rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#b45309',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.3rem 0.9rem',
                borderRadius: '100px',
                marginBottom: '1.25rem',
              }}
            >
              טיוטה — לעריכה משפטית
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              מדיניות פרטיות למועמדים — HirO
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--text2)', lineHeight: 1.8 }}>
              מדיניות זו מוגשת על ידי מימד אנושי בע&quot;מ (&quot;החברה&quot;, &quot;אנחנו&quot;), המפעילה את מערכת HirO (&quot;המערכת&quot;, &quot;הפלטפורמה&quot;), ומתארת כיצד אנו אוספים, משתמשים, משתפים ושומרים מידע על מועמדים המשתמשים בפלטפורמה. מסמך זה מיועד להיות מובן וברור, ומהווה טיוטת עבודה להשלמה ואישור משפטי.
            </p>
          </div>
        </section>

        {/* Body */}
        <section style={{ background: 'var(--bg)', padding: '3.5rem 2rem 6rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
            {sections.map(s => (
              <article key={s.num} aria-labelledby={`privacy-${s.num}`}>
                <h2
                  id={`privacy-${s.num}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--p50)', color: 'var(--p600)',
                      fontSize: '0.85rem', fontWeight: 800, flexShrink: 0,
                    }}
                  >
                    {s.num}
                  </span>
                  {s.title}
                </h2>

                {s.intro && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8 }}>{s.intro}</p>
                )}

                {s.paragraphs?.map(p => (
                  <p key={p} style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                    {p}
                  </p>
                ))}

                {s.subsections?.map(sub => (
                  <div key={sub.title} style={{ marginTop: '1.1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>{sub.title}</h3>
                    {sub.body && (
                      <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8 }}>{sub.body}</p>
                    )}
                  </div>
                ))}

                {s.bullets && <Bullets items={s.bullets} />}

                {s.closing && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8, marginTop: '0.85rem' }}>
                    {s.closing}
                  </p>
                )}
              </article>
            ))}

            {/* Footer note */}
            <div
              style={{
                background: 'var(--card)',
                border: '1px solid var(--cb)',
                borderRadius: 14,
                padding: '1.25rem 1.5rem',
                fontSize: '0.85rem',
                color: 'var(--text2)',
                lineHeight: 1.7,
              }}
            >
              מסמך זה הוא טיוטת עבודה ואינו מהווה ייעוץ משפטי. יש להשלים את הפרטים המסומנים ([להשלמה]) ולקבל אישור עורך/ת דין לפני פרסום סופי.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
