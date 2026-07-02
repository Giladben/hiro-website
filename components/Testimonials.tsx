const testimonials = [
  {
    initials: 'יל',
    name: 'יונתן לוי',
    role: 'מהנדס תוכנה, הרצליה',
    text: '"ניהול ריבוי פרופילים — פיצ\'ר שלא ידעתי שאני צריך. עדתי בו זמנית על שני כיוונים מקצועיים שונים. המגייסים קיבלו פרופיל מדויק לכל אחד. בלי Hiro לא יכולתי."',
  },
  {
    initials: 'שכ',
    name: 'שרה כהן',
    role: 'סוכנת נדל"ן, תל אביב',
    text: '"סוף סוף הרגשתי שמישהו מבין מה אני מחפשת. עם Hiro, הסוכן קישר אותי לשלושה ראיונות רלוונטיים תוך שבוע. המעקב אחרי ההגשות שינה לי את החיים."',
  },
  {
    initials: 'מג',
    name: 'מיכל גולן',
    role: 'מנהלת גיוס, חברת SaaS',
    text: '"Job Sonar חסך לנו 15 שעות עבודה שבועיות. המערכת מציפה מועמדים רלוונטיים מהמאגר שלנו שלא ידענו שיש — הגיוסים הוכפלו תוך חודש."',
  },
]

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{ background: '#fff', padding: '6rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--purple-50)',
          color: 'var(--purple-600)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.3rem 0.9rem',
          borderRadius: '100px',
          marginBottom: '1rem',
        }}>
          לקוחות מרוצים
        </span>
        <h2 id="testimonials-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#0e0b2b', marginBottom: '0.75rem' }}>
          חוויות אמיתיות מאנשים אמיתיים
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#5a5478', maxWidth: 560, margin: '0 auto 3.5rem', lineHeight: 1.7 }}>
          מגייסים ומועמדים שמצאו את הדרך שלהם עם Hiro — בביטחון ובדיוק.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {testimonials.map(t => (
            <article
              key={t.name}
              aria-label={`ביקורת של ${t.name}`}
              style={{
                background: '#faf9ff',
                border: '1px solid #ebe9f8',
                borderRadius: 16,
                padding: '1.75rem',
                textAlign: 'right',
              }}
            >
              <div
                aria-label="דירוג 5 כוכבים"
                style={{ color: '#f59e0b', fontSize: '0.9rem', marginBottom: '1rem', letterSpacing: 2 }}
                role="img"
              >
                ★★★★★
              </div>
              <blockquote style={{ fontSize: '0.9rem', color: '#3d3560', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic' }}>
                {t.text}
              </blockquote>
              <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--purple-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: 'var(--purple-700)', flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0e0b2b' }}>{t.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#8880b0' }}>{t.role}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
