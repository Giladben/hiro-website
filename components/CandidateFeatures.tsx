'use client'

const features = [
  { num: '01', pill: 'AI Agent', title: 'סוכן קריירה אישי', desc: 'עוזר AI שמשפר את קורות החיים שלך, מוצא משרות מתאימות ומגיש אותן בשמך — אקטיבי, מדויק ואישי.' },
  { num: '02', pill: 'Multi-Persona', title: 'ריבוי פרופילים מקצועיים', desc: 'נהל זהויות מקצועיות שונות תחת חשבון אחד — פרופיל נפרד לכל כיוון קריירה, עם קו"ח וסנכרון עצמאי.' },
  { num: '03', pill: 'Application Tracker', title: 'פנקס הגשות מלא', desc: 'דשבורד לניהול ומעקב אחר כל ההגשות שלך — כולל כאלו מחוץ לפלטפורמה — עם סטטוסים ותזכורות.' },
  { num: '04', pill: 'Live Sync', title: 'עדכון פרופיל בשידור חי', desc: 'כשתעדכן פרט בקורות החיים, המגייסים הרלוונטיים מקבלים הודעה אוטומטית — אתה תמיד מעודכן בפניהם.' },
]

export function CandidateFeatures() {
  return (
    <section
      id="candidates"
      aria-labelledby="candidates-heading"
      style={{ background: 'var(--dark-bg)', padding: '6rem 2rem', overflow: 'hidden' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(127,119,221,0.15)',
          color: 'var(--purple-200)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.3rem 0.9rem',
          borderRadius: '100px',
          marginBottom: '1rem',
        }}>
          למועמדים
        </span>
        <h2 id="candidates-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
          הסוויטה האישית לניהול הקריירה שלך
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'rgba(240,238,255,0.65)', maxWidth: 560, lineHeight: 1.7, marginBottom: '3.5rem' }}>
          יותר מלוח דרושים — Hiro היא עוזרת הקריירה שלך שעובדת 24/7 בשבילך.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}>
          {features.map(f => (
            <article
              key={f.num}
              aria-label={f.title}
              style={{
                background: 'var(--dark-card)',
                border: '1px solid var(--border-dark)',
                borderRadius: 16,
                padding: '2rem',
                transition: 'border-color 0.25s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(127,119,221,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-dark)')}
            >
              <span style={{
                display: 'inline-block',
                background: 'rgba(127,119,221,0.15)',
                color: 'var(--purple-200)',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.65rem',
                borderRadius: '100px',
                marginBottom: '0.9rem',
                letterSpacing: '0.05em',
              }}>
                {f.pill}
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'rgba(127,119,221,0.15)', lineHeight: 1, marginBottom: '0.75rem' }}>
                {f.num}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(240,238,255,0.65)', lineHeight: 1.65 }}>{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
