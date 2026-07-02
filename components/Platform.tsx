'use client'

const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const recruiterFeatures = ['התאמה סמנטית מבוססת AI', 'Job Sonar — איתור מועמדים אוטומטי', 'CRM מקיף עם Workflows', 'שליחת SMS ומיילים בתפוצה']
const candidateFeatures = ['סוכן קריירה AI אישי 24/7', 'Multi-Persona — ריבוי פרופילים', 'Application Tracker מלא', 'עדכון פרופיל בשידור חי']

export function Platform() {
  return (
    <section
      id="platform"
      aria-labelledby="platform-heading"
      style={{ background: '#f8f7ff', padding: '6rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' }}>
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
            Two-Sided Platform
          </span>
          <h2 id="platform-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#0e0b2b', marginBottom: '0.75rem' }}>
            פלטפורמה אחת, שני עולמות
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#5a5478', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            Hiro בנויה לשני הצדדים — מגייסים שרוצים לייעל, ומועמדים שרוצים להצליח.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '3.5rem' }}>

          {/* Recruiter card */}
          <article
            aria-labelledby="recruiter-card-heading"
            style={{
              background: 'var(--dark-bg)',
              borderRadius: 20,
              padding: '2.5rem',
              position: 'relative',
            }}
          >
            <span style={{
              position: 'absolute', top: '1.5rem', left: '1.5rem',
              background: 'rgba(127,119,221,0.2)',
              border: '1px solid rgba(127,119,221,0.3)',
              color: 'var(--purple-200)',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: 6,
            }}>
              AI Powered
            </span>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple-400)', marginBottom: '1rem' }}>
              למגייסים ורכזי גיוס
            </p>
            <h3 id="recruiter-card-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Recruitment &amp; CRM OS
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'rgba(240,238,255,0.65)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              שליטה מלאה על כל תהליך הגיוס — ממצאי מועמדים אוטומטיים ועד ניהול לקוחות מתקדם.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {recruiterFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'rgba(240,238,255,0.65)' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(127,119,221,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-400)', flexShrink: 0 }}>
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#recruiters"
              style={{
                background: 'var(--purple-600)', color: '#fff', border: 'none',
                padding: '0.75rem 1.5rem', borderRadius: 10,
                fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--purple-400)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--purple-600)')}
            >
              ← לפיצ'רים המגייסים
            </a>
          </article>

          {/* Candidate card */}
          <article
            aria-labelledby="candidate-card-heading"
            style={{
              background: 'var(--purple-50)',
              border: '1px solid rgba(83,74,183,0.18)',
              borderRadius: 20,
              padding: '2.5rem',
            }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--purple-600)', marginBottom: '1rem' }}>
              למועמדים
            </p>
            <h3 id="candidate-card-heading" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-900)', marginBottom: '0.75rem' }}>
              Personal Career Suite
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#4a4270', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              ניהול קריירה חכם ואישי — עוזר AI שעובד בשבילך, ריבוי פרופילים ושקיפות מלאה מול מגייסים.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {candidateFeatures.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#4a4270' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(83,74,183,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--purple-600)', flexShrink: 0 }}>
                    <CheckIcon />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#candidates"
              style={{
                background: 'var(--purple-900)', color: '#fff', border: 'none',
                padding: '0.75rem 1.5rem', borderRadius: 10,
                fontSize: '0.9rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--purple-700)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--purple-900)')}
            >
              ← לפיצ'רים המועמדים
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
