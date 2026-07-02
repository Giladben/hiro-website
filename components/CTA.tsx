'use client'

export function CTA() {
  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      style={{
        background: 'var(--dark-bg)',
        textAlign: 'center',
        padding: '7rem 2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(83,74,183,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
        <h2
          id="cta-heading"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}
        >
          מוכנים לגייס — ולהתגייס — בצורה חכמה יותר?
        </h2>
        <p style={{ color: 'rgba(240,238,255,0.65)', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
          הצטרפו לפלטפורמה שמשנה את שוק העבודה הישראלי. ללא התחייבות, עם תמיכה מלאה.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#"
            style={{
              background: 'var(--purple-600)', color: '#fff',
              padding: '1rem 2.25rem', borderRadius: 10,
              fontSize: '1.05rem', fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'var(--purple-400)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'var(--purple-600)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            התחילו בחינם עכשיו <span aria-hidden="true">←</span>
          </a>
          <a
            href="#"
            style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '1rem 2.25rem', borderRadius: 10,
              fontSize: '1.05rem', fontWeight: 600, textDecoration: 'none',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--purple-400)'
              e.currentTarget.style.color = 'var(--purple-200)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
              e.currentTarget.style.color = '#fff'
            }}
          >
            קבעו דמו עם הצוות
          </a>
        </div>
      </div>
    </section>
  )
}
