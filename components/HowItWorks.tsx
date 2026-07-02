const steps = [
  { num: 1, title: 'הגדרת פרופיל', desc: 'מגייס מגדיר משרה, מועמד מעלה קו"ח — בדקות, לא בשעות' },
  { num: 2, title: 'AI מתאים', desc: 'המנגנון הסמנטי מנתח עשרות פרמטרים ומייצר ציוני התאמה' },
  { num: 3, title: 'Job Sonar פועל', desc: 'המועמדים הרלוונטיים מוצפים למגייס אוטומטית מהמאגר' },
  { num: 4, title: 'גיוס מהיר', desc: 'תקשורת, ראיונות וסגירה — הכל מתוך Hiro, בממוצע 3× מהר יותר' },
]

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      style={{ background: '#f8f7ff', padding: '6rem 2rem' }}
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
          איך זה עובד
        </span>
        <h2 id="how-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#0e0b2b', marginBottom: '0.75rem' }}>
          מ-0 לגיוס בארבעה צעדים
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#5a5478', maxWidth: 560, margin: '0 auto 3.5rem', lineHeight: 1.7 }}>
          תהליך פשוט, תוצאות מהירות — בין אם אתה מגייס או מועמד.
        </p>

        <ol
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            listStyle: 'none',
            padding: 0,
            margin: 0,
          }}
          aria-label="שלבי השימוש ב-Hiro"
        >
          {steps.map((s, i) => (
            <li key={s.num} style={{ position: 'relative' }}>
              {/* connector line (decorative) */}
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: 28,
                    left: '-50%',
                    width: '50%',
                    height: 2,
                    background: 'linear-gradient(90deg, var(--purple-100), var(--purple-600))',
                    display: 'none',
                  }}
                />
              )}
              <div
                aria-hidden="true"
                style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  background: 'var(--purple-600)',
                  color: '#fff',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  boxShadow: '0 0 0 6px #f8f7ff, 0 0 0 7px var(--purple-100)',
                }}
              >
                {s.num}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0e0b2b', marginBottom: '0.4rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#7a72a0', lineHeight: 1.55 }}>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
