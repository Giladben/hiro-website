const testimonials = [
  {
    initials: 'מל',
    name: 'מירי לוי',
    role: 'מנהלת גיוס לשעבר → VP HR, תל אביב',
    text: '"תוך שבועיים עם Hiro קיבלתי 4 ראיונות — פי 3 יותר מכל הבקשות שהגשתי לבד בחודש לפני. ה-Multi-Persona שינה לי את המשחק — כל מגייס ראה בדיוק את מה שרלוונטי לו."',
    badge: '4 ראיונות בשבועיים',
    badgeColor: '#22c55e',
  },
  {
    initials: 'דב',
    name: 'דן ברק',
    role: 'מהנדס תוכנה → Team Lead, הרצליה',
    text: '"הייתי מרוצה מהעבודה אבל רציתי לדעת מה קיים. Hiro פעלה ברקע — בלי שבזבזתי זמן. כשהגיעה הצעה מעניינת, האתר כבר אסף את כל הסטטוסים. קיבלתי עלייה של 35% בשכר."',
    badge: '+35% שכר',
    badgeColor: '#7F77DD',
  },
  {
    initials: 'שכ',
    name: 'שרה כהן',
    role: 'סוכנת נדל"ן → HR Generalist, ת"א',
    text: '"עברתי תחום לגמרי. הסוכן של Hiro הבין שאני צריכה להדגיש כישורי מכירה ותקשורת — לא ניסיון HR. שלשה ראיונות, הצעה אחת. בלי Hiro לא הייתי יודעת מאיפה להתחיל."',
    badge: 'מעבר תחום מוצלח',
    badgeColor: '#e879a0',
  },
]

export function CandidateTestimonials() {
  return (
    <section
      aria-labelledby="cand-testimonials-heading"
      style={{ background:'var(--bg)', padding:'6rem 2rem' }}
    >
      <div style={{ maxWidth:1100, margin:'0 auto', textAlign:'center' }}>
        <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:100, marginBottom:'1rem' }}>
          סיפורי הצלחה
        </span>
        <h2 id="cand-testimonials-heading" style={{ fontSize:'clamp(1.9rem, 3.5vw, 2.5rem)', fontWeight:800, color:'var(--text)', marginBottom:'0.75rem' }}>
          הם מצאו את הדרך שלהם עם Hiro
        </h2>
        <p style={{ fontSize:'1.05rem', color:'var(--text2)', maxWidth:500, margin:'0 auto 3.5rem', lineHeight:1.7 }}>
          מועמדים אמיתיים, תוצאות אמיתיות.
        </p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(290px, 1fr))', gap:'1.25rem', textAlign:'right' }}>
          {testimonials.map(t => (
            <article
              key={t.name}
              className="bento-card"
              aria-label={`ביקורת של ${t.name}`}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                <div style={{ color:'#f59e0b', letterSpacing:2, fontSize:'0.9rem' }} role="img" aria-label="5 כוכבים">★★★★★</div>
                <span style={{ background:`${t.badgeColor}18`, color:t.badgeColor, fontSize:'0.68rem', fontWeight:700, padding:'3px 8px', borderRadius:100, border:`1px solid ${t.badgeColor}30` }}>
                  {t.badge}
                </span>
              </div>
              <blockquote style={{ fontSize:'0.875rem', color:'var(--text2)', lineHeight:1.7, marginBottom:'1.25rem', fontStyle:'italic' }}>
                {t.text}
              </blockquote>
              <footer style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--p50)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', fontWeight:800, color:'var(--p700)', flexShrink:0 }}>
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text2)' }}>{t.role}</div>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
