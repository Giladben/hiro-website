'use client'

import { useEffect, useRef } from 'react'

const candidates = [
  { id: '0908', name: 'שק\' צוקרמנד', title: 'מנהלת לוגיסטיקה', score: 65, status: 'חדש', statusColor: '#22c55e' },
  { id: '1',    name: 'שרית חליבה',   title: 'מנהלת קטגוריות',  score: 57, status: 'חסר נתונים', statusColor: '#f59e0b' },
  { id: '2',    name: 'אמיר קי',      title: 'מנהל לוגיסטיקה', score: 53, status: 'חסר נתונים', statusColor: '#f59e0b' },
  { id: '3',    name: 'אירית אוזרט',  title: 'מנהלת שרשרת',    score: 51, status: 'חדש',        statusColor: '#22c55e' },
]

function ScoreRing({ score, size = 36 }: { score: number; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const fill = circ - (score / 100) * circ
  const color = score >= 60 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3"
        strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: `${size/2}px ${size/2}px` }}/>
      <text x={size/2} y={size/2+4} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">{score}%</text>
    </svg>
  )
}

export function Hero() {
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rows = rowsRef.current?.querySelectorAll('.cand-row')
    rows?.forEach((row, i) => {
      setTimeout(() => row.classList.add('slide-in'), 200 + i * 150)
    })
  }, [])

  return (
    <section
      aria-labelledby="hero-heading"
      className="dot-grid"
      style={{
        minHeight: '100vh',
        background: 'var(--dark)',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow orbs */}
      <div aria-hidden="true" style={{ position:'absolute', top:'10%', right:'20%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle, rgba(83,74,183,0.22) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div aria-hidden="true" style={{ position:'absolute', bottom:'-10%', left:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(212,83,126,0.15) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* ── Right: Content ── */}
        <div>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(127,119,221,0.12)', border:'1px solid rgba(127,119,221,0.3)', color:'var(--p200)', fontSize:'0.82rem', fontWeight:700, padding:'0.35rem 1rem', borderRadius:100, marginBottom:'1.75rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--p400)', display:'inline-block', animation:'sonar-pulse 2s infinite' }}/>
            #1 פלטפורמת גיוס AI בישראל
          </div>
          <style>{`@keyframes sonar-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}`}</style>

          {/* H1 */}
          <h1
            id="hero-heading"
            style={{ fontSize:'clamp(2.6rem, 4.5vw, 4.2rem)', fontWeight:800, color:'#fff', lineHeight:1.12, marginBottom:'1.5rem', letterSpacing:'-1px' }}
          >
            גיוס שעובד{' '}
            <span className="grad-text">לבד</span>
            <br/>— למגייסים{' '}
            <span style={{ color:'rgba(240,238,255,0.5)', fontWeight:400 }}>ולמועמדים</span>
          </h1>

          <p style={{ fontSize:'1.1rem', color:'rgba(240,238,255,0.6)', lineHeight:1.75, maxWidth:480, marginBottom:'2.5rem' }}>
            מ-Job Sonar שמציף מועמדים אוטומטית, ועד סוכן קריירה AI שעובד בשבילך — Hiro מבטלת את העבודה הידנית.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
            <a href="#contact" style={{ background:'var(--p600)', color:'#fff', padding:'0.85rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--p400)';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--p600)';e.currentTarget.style.transform='translateY(0)'}}>
              התחילו בחינם <span aria-hidden>←</span>
            </a>
            <a href="#product" style={{ background:'rgba(255,255,255,0.06)', color:'#fff', padding:'0.85rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:600, textDecoration:'none', border:'1px solid rgba(255,255,255,0.1)', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--p400)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}}>
              ראו את המוצר
            </a>
          </div>

          {/* Stats */}
          <div role="list" aria-label="נתוני הפלטפורמה" style={{ display:'flex', gap:'2rem', paddingTop:'2rem', borderTop:'1px solid rgba(255,255,255,0.06)', flexWrap:'wrap' }}>
            {[{n:'847+',l:'מועמדים פעילים'},{n:'3.2×',l:'מהירות גיוס'},{n:'94%',l:'דיוק התאמה'}].map(s=>(
              <div key={s.l} role="listitem">
                <div style={{ fontSize:'1.8rem', fontWeight:800, color:'#fff' }}>{s.n}</div>
                <div style={{ fontSize:'0.8rem', color:'rgba(240,238,255,0.45)', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Left: Dashboard Mockup ── */}
        <div style={{ position:'relative' }}>
          {/* Glow behind card */}
          <div aria-hidden="true" style={{ position:'absolute', inset:-40, borderRadius:32, background:'radial-gradient(ellipse, rgba(83,74,183,0.25) 0%, transparent 70%)', filter:'blur(20px)' }}/>

          <div className="glass" style={{ borderRadius:20, overflow:'hidden', position:'relative', boxShadow:'0 32px 80px rgba(0,0,0,0.5)' }}>
            {/* App top bar */}
            <div style={{ background:'rgba(7,5,26,0.95)', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#fc625d' }}/>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#fdbc40' }}/>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#35cd4b' }}/>
              </div>
              <span style={{ color:'rgba(240,238,255,0.4)', fontSize:'0.75rem' }}>app.hiro.co.il</span>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#fff' }}>HIRO</span>
            </div>

            {/* Sidebar + content */}
            <div style={{ display:'flex', background:'rgba(10,8,30,0.9)' }}>
              {/* Mini sidebar */}
              <div style={{ width:44, borderLeft:'1px solid rgba(255,255,255,0.05)', padding:'12px 0', display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                {['👥','📋','🏢','💰','📊'].map((icon,i)=>(
                  <div key={i} style={{ width:28, height:28, borderRadius:8, background: i===0?'var(--p600)':'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', cursor:'pointer' }} aria-hidden="true">{icon}</div>
                ))}
              </div>

              {/* Main content */}
              <div style={{ flex:1, padding:'14px' }}>
                {/* Header row */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <span style={{ color:'#fff', fontWeight:700, fontSize:'0.9rem' }}>רשימת מועמדים</span>
                  <div style={{ background:'var(--p600)', borderRadius:8, padding:'4px 10px', fontSize:'0.72rem', fontWeight:700, color:'#fff', cursor:'pointer' }}>+ מועמד חדש</div>
                </div>

                {/* Search bar */}
                <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'6px 10px', fontSize:'0.75rem', color:'rgba(240,238,255,0.3)', marginBottom:10 }}>🔍 חיפוש מועמד...</div>

                {/* Column headers */}
                <div style={{ display:'grid', gridTemplateColumns:'36px 1fr 80px 70px', gap:6, padding:'0 6px 6px', borderBottom:'1px solid rgba(255,255,255,0.05)', fontSize:'0.65rem', color:'rgba(240,238,255,0.3)', marginBottom:4 }}>
                  <span>התאמה</span><span>שם</span><span>תפקיד</span><span>סטטוס</span>
                </div>

                {/* Candidate rows */}
                <div ref={rowsRef} style={{ display:'flex', flexDirection:'column', gap:3 }}>
                  {candidates.map((c, i) => (
                    <div
                      key={c.id}
                      className="cand-row"
                      style={{ display:'grid', gridTemplateColumns:'36px 1fr 80px 70px', gap:6, padding:'6px', borderRadius:8, background:'rgba(255,255,255,0.03)', alignItems:'center', opacity:0, cursor:'pointer', transition:'background 0.15s' }}
                      onMouseEnter={e=>(e.currentTarget.style.background='rgba(127,119,221,0.1)')}
                      onMouseLeave={e=>(e.currentTarget.style.background='rgba(255,255,255,0.03)')}
                    >
                      <ScoreRing score={c.score} size={32}/>
                      <span style={{ fontSize:'0.75rem', color:'rgba(240,238,255,0.85)', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize:'0.65rem', color:'rgba(240,238,255,0.45)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.title}</span>
                      <span style={{ fontSize:'0.62rem', fontWeight:700, color:c.statusColor, background:`${c.statusColor}18`, padding:'2px 6px', borderRadius:6, textAlign:'center' }}>{c.status}</span>
                    </div>
                  ))}
                </div>

                {/* Sonar bar */}
                <div style={{ marginTop:10, background:'rgba(83,74,183,0.15)', border:'1px solid rgba(83,74,183,0.3)', borderRadius:10, padding:'8px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ position:'relative', width:18, height:18, flexShrink:0 }}>
                      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid var(--p400)', animation:'sonar 1.5s ease-out infinite' }}/>
                      <div style={{ position:'absolute', inset:3, borderRadius:'50%', border:'1.5px solid var(--p400)', animation:'sonar 1.5s ease-out 0.5s infinite' }}/>
                      <div style={{ position:'absolute', inset:6, borderRadius:'50%', background:'var(--p400)' }}/>
                    </div>
                    <span style={{ fontSize:'0.7rem', color:'var(--p200)', fontWeight:600 }}>Job Sonar פעיל — נמצאו 20 מועמדים</span>
                  </div>
                  <div style={{ fontSize:'0.65rem', fontWeight:700, color:'var(--p400)', cursor:'pointer' }}>צפה</div>
                </div>
                <style>{`@keyframes sonar{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}`}</style>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div style={{ position:'absolute', top:-16, left:-16, background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:12, padding:'8px 14px', backdropFilter:'blur(8px)' }}>
            <div style={{ fontSize:'0.7rem', color:'rgba(34,197,94,0.9)', fontWeight:700 }}>✓ גיוס אוטומטי פעיל</div>
          </div>

          {/* Floating AI badge */}
          <div style={{ position:'absolute', bottom:-14, right:-20, background:'rgba(127,119,221,0.15)', border:'1px solid rgba(127,119,221,0.3)', borderRadius:12, padding:'8px 14px', backdropFilter:'blur(8px)' }}>
            <div style={{ fontSize:'0.7rem', color:'var(--p200)', fontWeight:700 }}>✦ AI Matching פעיל</div>
          </div>
        </div>
      </div>

      {/* Responsive override */}
      <style>{`
        @media(max-width:900px){
          #hero-grid{grid-template-columns:1fr !important}
          #hero-visual{display:none}
        }
      `}</style>
    </section>
  )
}
