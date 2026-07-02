const steps = [
  {
    num: '01',
    title: 'יצרו פרופיל בדקות',
    desc: 'העלו קו"ח קיים — Hiro מנתחת ומייצרת פרופיל מלא אוטומטית. ללא טפסים ארוכים.',
    tag: 'דקה אחת',
  },
  {
    num: '02',
    title: 'בחרו כיווני קריירה',
    desc: 'הגדירו אילו תפקידים מעניינים אתכם. אפשר כמה כיוונים שונים — כל אחד עם פרופיל נפרד.',
    tag: 'Multi-Persona',
  },
  {
    num: '03',
    title: 'AI Agent מתחיל לעבוד',
    desc: 'הסוכן מחפש, מגיש ומעדכן בשמכם. אתם מקבלים התראות רק כשמשהו קורה.',
    tag: 'אוטומטי לגמרי',
  },
  {
    num: '04',
    title: 'עקבו ונהלו בקלות',
    desc: 'Application Tracker מציג את כל ההגשות, הסטטוסים וראיונות קרובים — בלחיצה אחת.',
    tag: 'Full Visibility',
  },
]

export function CandidateHowItWorks() {
  return (
    <section
      aria-labelledby="cand-how-heading"
      style={{ background:'var(--bg-alt)', padding:'6rem 2rem' }}
    >
      <div style={{ maxWidth:1000, margin:'0 auto', textAlign:'center' }}>
        <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:100, marginBottom:'1rem' }}>
          איך מתחילים
        </span>
        <h2 id="cand-how-heading" style={{ fontSize:'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight:800, color:'var(--text)', marginBottom:'0.75rem' }}>
          מ-0 לראיון בארבעה צעדים
        </h2>
        <p style={{ fontSize:'1.05rem', color:'var(--text2)', maxWidth:500, margin:'0 auto 3.5rem', lineHeight:1.7 }}>
          בחינם לגמרי. ללא כרטיס אשראי. מוכנים תוך דקה.
        </p>

        <ol style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(210px, 1fr))', gap:'1.5rem', listStyle:'none', padding:0, margin:0 }}>
          {steps.map(s => (
            <li
              key={s.num}
              className="bento-card"
              style={{ textAlign:'right', padding:'1.75rem' }}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
                <span style={{ background:'var(--p50)', color:'var(--p600)', fontSize:'0.68rem', fontWeight:700, padding:'2px 8px', borderRadius:100 }}>{s.tag}</span>
                <span style={{ fontSize:'2rem', fontWeight:800, color:'var(--cb)', lineHeight:1 }}>{s.num}</span>
              </div>
              <h3 style={{ fontSize:'1rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize:'0.85rem', color:'var(--text2)', lineHeight:1.6 }}>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
