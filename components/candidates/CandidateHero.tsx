'use client'

import { useEffect, useRef } from 'react'

const apps = [
  { company: 'WalkMe', role: 'מנהלת גיוס', score: 94, status: 'ראיון נקבע', color: '#22c55e' },
  { company: 'Monday.com', role: 'HR Business Partner', score: 88, color: '#7F77DD', status: 'נשלח קו"ח' },
  { company: 'Fiverr', role: 'Talent Acquisition', score: 81, color: '#f59e0b', status: 'ממתין' },
  { company: 'Wix', role: 'Recruiter', score: 76, color: '#7F77DD', status: 'נשלח קו"ח' },
]

export function CandidateHero() {
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cards = cardsRef.current?.querySelectorAll('.app-card')
    cards?.forEach((c, i) => {
      setTimeout(() => (c as HTMLElement).style.opacity = '1', 300 + i * 180)
    })
  }, [])

  return (
    <section
      aria-labelledby="cand-hero-heading"
      style={{
        minHeight: '100vh',
        background: 'var(--cand-hero-bg)',
        display: 'flex',
        alignItems: 'center',
        padding: '5rem 2rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dot grid */}
      <div aria-hidden="true" style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(167,139,250,0.2) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }}/>
      {/* Glow */}
      <div aria-hidden="true" style={{ position:'absolute', top:'5%', left:'30%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div aria-hidden="true" style={{ position:'absolute', bottom:'-10%', right:'5%', width:350, height:350, borderRadius:'50%', background:'radial-gradient(circle, rgba(232,121,160,0.12) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div id="cand-hero-grid" style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* Content */}
        <div className="cand-hero-content">
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.3)', color:'#c4b5fd', fontSize:'0.82rem', fontWeight:700, padding:'0.35rem 1rem', borderRadius:100, marginBottom:'1.75rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#a78bfa', display:'inline-block', animation:'pulse-dot 2s infinite' }}/>
            הפלטפורמה שעובדת בשבילך — 24/7
          </div>
          <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}`}</style>

          <h1
            id="cand-hero-heading"
            style={{ fontSize:'clamp(2.4rem, 4.2vw, 3.8rem)', fontWeight:800, color:'var(--text)', lineHeight:1.12, marginBottom:'1.5rem', letterSpacing:'-1px' }}
          >
            תפסיק לחפש עבודה —{' '}
            <br/>
            <span style={{ background:'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #e879a0 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              תן ל-AI לעשות את זה
            </span>
          </h1>

          <p style={{ fontSize:'1.1rem', color:'var(--text2)', lineHeight:1.75, maxWidth:460, marginBottom:'1rem' }}>
            Hiro היא הסוויטה האישית לניהול הקריירה שלך — סוכן AI שמגיש קורות חיים, עוקב אחרי הגשות, ומסנכרן עם המגייסים הנכונים.
          </p>
          <p style={{ fontSize:'0.9rem', color:'rgba(167,139,250,0.7)', marginBottom:'2.5rem', fontWeight:600 }}>
            ✦ בחינם לגמרי למועמדים
          </p>

          <div className="cand-hero-ctas" style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
            <a
              href="#signup"
              style={{ background:'linear-gradient(135deg, #7F77DD, #a78bfa)', color:'#fff', padding:'0.9rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem', boxShadow:'0 8px 24px rgba(127,119,221,0.35)', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(127,119,221,0.45)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 24px rgba(127,119,221,0.35)'}}
            >
              הצטרפו בחינם <span aria-hidden>←</span>
            </a>
            <a
              href="#features"
              style={{ background:'var(--card)', color:'var(--text)', padding:'0.9rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:600, textDecoration:'none', border:'1px solid var(--cb)', transition:'border-color 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(167,139,250,0.5)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--cb)'}}
            >
              איך זה עובד?
            </a>
          </div>
        </div>

        {/* Visual — Application Tracker Mockup */}
        <div id="cand-hero-visual" style={{ position:'relative' }}>
          <div aria-hidden="true" style={{ position:'absolute', inset:-40, borderRadius:32, background:'radial-gradient(ellipse, rgba(127,119,221,0.2) 0%, transparent 70%)', filter:'blur(24px)' }}/>

          <div style={{ background:'var(--card)', backdropFilter:'blur(16px)', borderRadius:20, overflow:'hidden', border:'1px solid rgba(167,139,250,0.15)', boxShadow:'var(--hero-shadow)', position:'relative' }}>
            {/* Top bar */}
            <div style={{ background:'var(--topbar-bg)', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--cb)' }}>
              <div style={{ display:'flex', gap:6 }} aria-hidden="true">
                {['#fc625d','#fdbc40','#35cd4b'].map(c=><span key={c} style={{ width:10, height:10, borderRadius:'50%', background:c, display:'block' }}/>)}
              </div>
              <span style={{ color:'var(--text2)', fontSize:'0.72rem' }}>app.hiro.co.il · Application Tracker</span>
              <div style={{ background:'rgba(167,139,250,0.2)', borderRadius:6, padding:'2px 8px', fontSize:'0.65rem', fontWeight:700, color:'#c4b5fd' }}>מועמד</div>
            </div>

            {/* Profile header */}
            <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--cb)', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg, #7F77DD, #a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:700, color:'#fff', flexShrink:0 }}>מ</div>
              <div>
                <div style={{ color:'var(--text)', fontWeight:700, fontSize:'0.88rem' }}>מירי לוי — מנהלת גיוס</div>
                <div style={{ color:'rgba(167,139,250,0.7)', fontSize:'0.7rem' }}>פרופיל מעודכן לפני 2 דקות · AI Agent פעיל ✦</div>
              </div>
              <div style={{ marginRight:'auto', background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:8, padding:'3px 8px', fontSize:'0.65rem', fontWeight:700, color:'#22c55e' }}>פעיל</div>
            </div>

            {/* Tabs */}
            <div style={{ padding:'0 16px', display:'flex', gap:16, borderBottom:'1px solid var(--cb)' }}>
              {['הגשות (4)','פרופילים (2)','קו"ח'].map((t,i)=>(
                <div key={t} style={{ padding:'8px 0', fontSize:'0.72rem', fontWeight:700, color: i===0?'#a78bfa':'var(--text2)', borderBottom: i===0?'2px solid #a78bfa':'2px solid transparent', cursor:'pointer' }}>{t}</div>
              ))}
            </div>

            {/* Application cards */}
            <div ref={cardsRef} style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:8 }}>
              {apps.map((a, i) => (
                <div
                  key={a.company}
                  className="app-card"
                  style={{ background:'var(--bg-alt)', border:'1px solid var(--cb)', borderRadius:12, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, opacity:0, transition:'opacity 0.4s ease' }}
                >
                  {/* Company avatar */}
                  <div style={{ width:32, height:32, borderRadius:8, background:`${a.color}20`, border:`1px solid ${a.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:800, color:a.color, flexShrink:0 }}>
                    {a.company.slice(0,2)}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text)' }}>{a.company}</div>
                    <div style={{ fontSize:'0.65rem', color:'var(--text2)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.role}</div>
                  </div>
                  {/* Match */}
                  <div style={{ fontSize:'0.7rem', fontWeight:800, color:a.color }}>{a.score}%</div>
                  {/* Status */}
                  <div style={{ fontSize:'0.62rem', fontWeight:700, color:a.color, background:`${a.color}18`, padding:'2px 7px', borderRadius:100, whiteSpace:'nowrap' }}>{a.status}</div>
                </div>
              ))}
            </div>

            {/* Sonar footer */}
            <div style={{ margin:'0 16px 14px', background:'rgba(127,119,221,0.1)', border:'1px solid rgba(127,119,221,0.2)', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.7rem', color:'rgba(167,139,250,0.8)', fontWeight:600 }}>✦ AI Agent — זיהה 3 משרות חדשות בשעה האחרונה</span>
              <span style={{ fontSize:'0.65rem', color:'#a78bfa', fontWeight:700, cursor:'pointer' }}>צפה</span>
            </div>
          </div>

          {/* Floating badges */}
          <div style={{ position:'absolute', top:-14, right:-18, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:12, padding:'7px 12px', backdropFilter:'blur(8px)' }}>
            <div style={{ fontSize:'0.68rem', color:'#22c55e', fontWeight:700 }}>🎉 ראיון נקבע — WalkMe</div>
          </div>
          <div style={{ position:'absolute', bottom:-14, left:-18, background:'rgba(127,119,221,0.12)', border:'1px solid rgba(127,119,221,0.25)', borderRadius:12, padding:'7px 12px', backdropFilter:'blur(8px)' }}>
            <div style={{ fontSize:'0.68rem', color:'#a78bfa', fontWeight:700 }}>✦ קו"ח עודכנו אוטומטית</div>
          </div>
        </div>
      </div>

      {/* Responsive override — stack to a single column on mobile instead of
          squeezing the two-column grid, matching the pattern used on the
          home page Hero. */}
      <style>{`
        @media(max-width:900px){
          #cand-hero-grid{grid-template-columns:1fr !important; gap:2.75rem !important}
          .cand-hero-content{text-align:center}
          .cand-hero-content p{margin-left:auto !important; margin-right:auto !important}
          .cand-hero-ctas{justify-content:center}
          #cand-hero-visual{max-width:460px; margin:0 auto}
        }
        @media(max-width:480px){
          #cand-hero-visual{max-width:100%}
        }
      `}</style>
    </section>
  )
}
