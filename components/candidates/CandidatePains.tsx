const pains = [
  { before: 'שולחים קו"ח לעשרות מקומות ולא שומעים חזרה', after: 'AI Agent מגיש רק לאן שיש סיכוי אמיתי', icon: '📨' },
  { before: 'לא זוכרים לאן הגשתם ומה הסטטוס', after: 'Application Tracker עוקב אחרי הכל בשבילכם', icon: '📋' },
  { before: 'פרופיל אחד לא מספיק לכל הכיוונים', after: 'Multi-Persona — פרופיל נפרד לכל תפקיד', icon: '🎭' },
  { before: 'מגייסים לא יודעים שעדכנתם את הקו"ח', after: 'Live Sync — המגייסים הנכונים מקבלים עדכון אוטומטי', icon: '⚡' },
]

export function CandidatePains() {
  return (
    <section
      aria-labelledby="pains-heading"
      style={{ background:'var(--bg-alt)', padding:'5rem 2rem' }}
    >
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3rem' }}>
          <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:100, marginBottom:'1rem' }}>
            הבעיה האמיתית
          </span>
          <h2 id="pains-heading" style={{ fontSize:'clamp(1.7rem, 3vw, 2.4rem)', fontWeight:800, color:'var(--text)', lineHeight:1.2 }}>
            חיפוש עבודה שבור — Hiro מתקנת אותו
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'1rem' }}>
          {pains.map(p => (
            <div
              key={p.before}
              className="bento-card"
              style={{ padding:'1.5rem' }}
            >
              <div style={{ fontSize:'1.75rem', marginBottom:'1rem' }} aria-hidden="true">{p.icon}</div>
              {/* Before */}
              <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.75rem', alignItems:'flex-start' }}>
                <span style={{ color:'#ef4444', fontSize:'0.8rem', fontWeight:800, flexShrink:0, marginTop:2 }}>✗</span>
                <p style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.55, textDecoration:'line-through', opacity:0.7 }}>{p.before}</p>
              </div>
              {/* After */}
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', background:'rgba(83,74,183,0.07)', borderRadius:10, padding:'0.6rem 0.75rem' }}>
                <span style={{ color:'var(--p600)', fontSize:'0.8rem', fontWeight:800, flexShrink:0, marginTop:2 }}>✓</span>
                <p style={{ fontSize:'0.875rem', color:'var(--text)', lineHeight:1.55, fontWeight:600 }}>{p.after}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
