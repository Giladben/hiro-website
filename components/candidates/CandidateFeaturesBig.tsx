'use client'

function FeatureBlock({
  tag, title, desc, visual, flip = false,
}: {
  tag: string; title: string; desc: string; visual: React.ReactNode; flip?: boolean
}) {
  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
      gap:'4rem',
      alignItems:'center',
      marginBottom:'5rem',
    }}>
      <div style={{ order: flip ? 2 : 1 }}>
        <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.25rem 0.8rem', borderRadius:100, marginBottom:'1rem' }}>{tag}</span>
        <h3 style={{ fontSize:'clamp(1.5rem, 2.5vw, 2rem)', fontWeight:800, color:'var(--text)', lineHeight:1.2, marginBottom:'1rem' }}>{title}</h3>
        <p style={{ fontSize:'1rem', color:'var(--text2)', lineHeight:1.75 }}>{desc}</p>
      </div>
      <div style={{ order: flip ? 1 : 2 }}>{visual}</div>
    </div>
  )
}

function AgentVisual() {
  const msgs = [
    { from:'ai', text:'מצאתי 5 משרות מתאימות לפרופיל שלך' },
    { from:'ai', text:'הגשתי קו"ח ל-WalkMe ו-Monday.com בשמך' },
    { from:'user', text:'מה הסטטוס של WalkMe?' },
    { from:'ai', text:'ראיון נקבע ל-יום ראשון 10:00 ✓' },
  ]
  return (
    <div style={{ background:'var(--dark)', borderRadius:20, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
      <div style={{ padding:'10px 14px', background:'rgba(7,5,26,0.8)', borderBottom:'1px solid rgba(255,255,255,0.05)', display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg, #7F77DD, #a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem' }}>✦</div>
        <span style={{ color:'#fff', fontSize:'0.78rem', fontWeight:700 }}>סוכן קריירה AI</span>
        <span style={{ marginRight:'auto', fontSize:'0.62rem', color:'#22c55e', fontWeight:700 }}>● פעיל</span>
      </div>
      <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:8 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.from==='user'?'flex-start':'flex-end' }}>
            <div style={{
              maxWidth:'80%', padding:'8px 12px', borderRadius: m.from==='user'?'16px 16px 16px 4px':'16px 16px 4px 16px',
              background: m.from==='user'?'rgba(255,255,255,0.06)':'linear-gradient(135deg, #534AB7, #7F77DD)',
              fontSize:'0.78rem', color: m.from==='user'?'rgba(240,238,255,0.7)':'#fff', lineHeight:1.5,
            }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'8px 14px 12px', display:'flex', gap:6 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'8px 12px', fontSize:'0.72rem', color:'rgba(240,238,255,0.3)' }}>שאלו את הסוכן...</div>
        <div style={{ background:'var(--p600)', borderRadius:10, padding:'8px 12px', fontSize:'0.72rem', color:'#fff', fontWeight:700, cursor:'pointer' }}>שלח</div>
      </div>
    </div>
  )
}

function MultiPersonaVisual() {
  const profiles = [
    { name:'פרופיל 1', title:'מנהלת גיוס', skills:['HR','ATS','גיוס'], color:'#7F77DD', active:true },
    { name:'פרופיל 2', title:'HR Business Partner', skills:['HRBP','L&D','OD'], color:'#e879a0', active:false },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
      {profiles.map(p => (
        <div key={p.name} style={{ background: p.active?'var(--dark)':'var(--card)', border:`1px solid ${p.active?'rgba(127,119,221,0.3)':'var(--cb)'}`, borderRadius:16, padding:'1.25rem', position:'relative', transition:'all 0.2s' }}>
          {p.active && <div style={{ position:'absolute', top:12, left:12, background:'rgba(127,119,221,0.2)', border:'1px solid rgba(127,119,221,0.3)', borderRadius:6, padding:'2px 8px', fontSize:'0.62rem', fontWeight:700, color:'var(--p200)' }}>פעיל</div>}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:'0.75rem' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:`${p.color}20`, border:`2px solid ${p.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:800, color:p.color }}>מ</div>
            <div>
              <div style={{ fontWeight:700, fontSize:'0.88rem', color: p.active?'#fff':'var(--text)' }}>{p.title}</div>
              <div style={{ fontSize:'0.68rem', color: p.active?'rgba(240,238,255,0.4)':'var(--text2)' }}>{p.name}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {p.skills.map(s=>(
              <span key={s} style={{ fontSize:'0.68rem', fontWeight:600, padding:'2px 8px', borderRadius:100, background:`${p.color}15`, color:p.color }}>{s}</span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ textAlign:'center', fontSize:'0.78rem', color:'var(--p600)', fontWeight:700, cursor:'pointer' }}>+ הוסף פרופיל חדש</div>
    </div>
  )
}

function TrackerVisual() {
  const stages = [
    { label:'נשלח', count:12, color:'#7F77DD' },
    { label:'נצפה', count:8, color:'#a78bfa' },
    { label:'ראיון', count:3, color:'#22c55e' },
    { label:'הצעה', count:1, color:'#f59e0b' },
  ]
  return (
    <div style={{ background:'var(--dark)', borderRadius:20, padding:'1.5rem', border:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize:'0.78rem', fontWeight:700, color:'rgba(240,238,255,0.5)', marginBottom:'1.25rem' }}>מצב הגשות — יוני 2025</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {stages.map(s=>(
          <div key={s.label} style={{ textAlign:'center' }}>
            <div style={{ fontSize:'1.8rem', fontWeight:800, color:s.color }}>{s.count}</div>
            <div style={{ fontSize:'0.68rem', color:'rgba(240,238,255,0.4)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Funnel bars */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {stages.map(s=>(
          <div key={s.label}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', marginBottom:3 }}>
              <span style={{ color:'rgba(240,238,255,0.6)' }}>{s.label}</span>
              <span style={{ color:s.color, fontWeight:700 }}>{s.count}</span>
            </div>
            <div style={{ height:4, background:'rgba(255,255,255,0.05)', borderRadius:2 }}>
              <div style={{ height:'100%', width:`${(s.count/12)*100}%`, background:s.color, borderRadius:2, transition:'width 1s ease' }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CandidateFeaturesBig() {
  return (
    <section
      id="features"
      aria-labelledby="cand-features-heading"
      style={{ background:'var(--bg)', padding:'6rem 2rem 2rem' }}
    >
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'4rem' }}>
          <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:100, marginBottom:'1rem' }}>
            הפיצ'רים
          </span>
          <h2 id="cand-features-heading" style={{ fontSize:'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight:800, color:'var(--text)', lineHeight:1.15 }}>
            הסוויטה האישית לקריירה שלך
          </h2>
        </div>

        <FeatureBlock
          tag="AI Agent"
          title="סוכן קריירה שעובד בשבילך — בלי שתצטרך לזכור"
          desc="מגיש קורות חיים, מוצא משרות רלוונטיות, מתזמן ראיונות ומסנכרן עם המגייסים. אתם ישנים — הסוכן עובד. מבוסס על ה-AI הסמנטי של Hiro שמבין בדיוק מה מתאים לכם ולמה."
          visual={<AgentVisual />}
        />

        <FeatureBlock
          tag="Multi-Persona"
          title="כמה כיוונים בקריירה? אחזיקו פרופיל נפרד לכל אחד"
          desc="אם את גם מנהלת גיוס וגם HRBP — לא תוותרי על אף כיוון. כל פרופיל מקבל קו&quot;ח נפרד, כישורים נפרדים וסנכרון עצמאי עם המגייסים הרלוונטיים — הכל תחת חשבון אחד."
          visual={<MultiPersonaVisual />}
          flip
        />

        <FeatureBlock
          tag="Application Tracker"
          title="אל תאבדו הגשה אחת — גם מחוץ ל-Hiro"
          desc="כל ההגשות שלכם במקום אחד — כולל כאלו ישירות לאתרי חברות, לינקדאין, או דרך סוכנויות גיוס. עם תזכורות, סטטוסים, מועדים ויומן ראיונות — הכל מסונכרן."
          visual={<TrackerVisual />}
        />
      </div>
    </section>
  )
}
