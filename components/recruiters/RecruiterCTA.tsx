'use client'

export function RecruiterCTA() {
  return (
    <section
      id="signup"
      aria-labelledby="rec-cta-heading"
      style={{
        background: 'linear-gradient(160deg, #07051a 0%, #0f0b2e 60%, #071a0f 100%)',
        padding: '7rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(83,74,183,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', fontSize: '0.82rem', fontWeight: 700, padding: '0.35rem 1rem', borderRadius: 100, marginBottom: '1.5rem' }}>
          ✦ דמו חינמי — ללא התחייבות
        </div>

        <h2
          id="rec-cta-heading"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.18, marginBottom: '1rem' }}
        >
          מוכנים לגייס
          <br />
          <span style={{ background: 'linear-gradient(135deg, #7F77DD, #22c55e, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            פי 3 מהר יותר?
          </span>
        </h2>

        <p style={{ fontSize: '1.1rem', color: 'rgba(240,238,255,0.6)', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          קבלו דמו מותאם אישית ל-15 דקות — נראה לכם את המערכת על הפוזיציות הפתוחות שלכם.
          <br />
          <span style={{ fontSize: '0.9rem', color: 'rgba(167,139,250,0.6)' }}>ללא חתימה על חוזה · ללא כרטיס אשראי</span>
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <a
            href="mailto:demo@hiro.co.il"
            style={{
              background: 'linear-gradient(135deg, #534AB7, #7F77DD)',
              color: '#fff',
              padding: '1rem 2.5rem',
              borderRadius: 12,
              fontSize: '1.1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(83,74,183,0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(83,74,183,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(83,74,183,0.4)' }}
          >
            קבעו דמו עכשיו <span aria-hidden>←</span>
          </a>
        </div>

        <div role="list" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['✓ דמו חינמי','✓ ללא חוזה','✓ פרטיות מלאה','✓ תמיכה בעברית'].map(t => (
            <span key={t} role="listitem" style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.4)', fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
