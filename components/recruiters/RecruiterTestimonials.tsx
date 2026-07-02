const testimonials = [
  {
    initials: 'רא',
    name: 'רותם אשכנזי',
    role: 'Head of Talent Acquisition, חברת SaaS, תל אביב',
    text: '"Hiro חסכה לי 12 שעות עבודה בשבוע. הJob Sonar מביא מועמדים שלא ידעתי שהם בשוק — וה-AI Match מדויק בצורה שלא ראיתי בשום כלי אחר. זה שינה לי את הדרך שאני עובדת."',
    badge: '−12 שעות בשבוע',
    badgeColor: '#22c55e',
  },
  {
    initials: 'נב',
    name: 'ניר בן-דוד',
    role: 'מנהל משרד גיוס עצמאי, הרצליה',
    text: '"ניהלתי הכל ב-Excel. עברתי ל-Hiro ותוך שבועיים כל ה-pipeline שלי היה ויזואלי וקל לניהול. קיבלתי 3 לקוחות חדשים כי פשוט הספקתי לגייס יותר."',
    badge: 'x3 קיבולת גיוס',
    badgeColor: '#7F77DD',
  },
  {
    initials: 'מש',
    name: 'מיה שפירא',
    role: 'Talent Partner, סטארטאפ Series B, ת"א',
    text: '"הבעיה הכי גדולה שלי הייתה מועמדים שלא עונים. עם SMS בתפוצה של Hiro עם תבנית מותאמת אישית — שיעור התגובה עלה ל-68%. זה לא נורמלי."',
    badge: '68% תגובה',
    badgeColor: '#e879a0',
  },
]

export function RecruiterTestimonials() {
  return (
    <section
      aria-labelledby="rec-testimonials-heading"
      style={{ background: 'var(--bg)', padding: '6rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <span style={{ display: 'inline-block', background: 'var(--p50)', color: 'var(--p600)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: 100, marginBottom: '1rem' }}>
          סיפורי הצלחה
        </span>
        <h2 id="rec-testimonials-heading" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem' }}>
          מגייסים שכבר שינו את הדרך שלהם
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--text2)', maxWidth: 500, margin: '0 auto 3.5rem', lineHeight: 1.7 }}>
          תוצאות אמיתיות. מגייסים אמיתיים.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem', textAlign: 'right' }}>
          {testimonials.map(t => (
            <article key={t.name} className="bento-card" aria-label={`ביקורת של ${t.name}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ color: '#f59e0b', letterSpacing: 2, fontSize: '0.9rem' }} role="img" aria-label="5 כוכבים">★★★★★</div>
                <span style={{ background: `${t.badgeColor}18`, color: t.badgeColor, fontSize: '0.68rem', fontWeight: 700, padding: '3px 8px', borderRadius: 100, border: `1px solid ${t.badgeColor}30` }}>
                  {t.badge}
                </span>
              </div>
              <blockquote style={{ fontSize: '0.875rem', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                {t.text}
              </blockquote>
              <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--p50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: 'var(--p700)', flexShrink: 0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{t.role}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
