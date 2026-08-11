'use client'

import Image from 'next/image'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="dot-grid"
      style={{
        minHeight: '100vh',
        background: 'var(--hero-bg)',
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

      <div id="hero-grid" style={{ maxWidth:1200, margin:'0 auto', width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* ── Right: Content ── */}
        <div className="hero-content">
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(127,119,221,0.12)', border:'1px solid rgba(127,119,221,0.3)', color:'var(--accent-chip-text)', fontSize:'0.82rem', fontWeight:700, padding:'0.35rem 1rem', borderRadius:100, marginBottom:'1.75rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--p400)', display:'inline-block', animation:'sonar-pulse 2s infinite' }}/>
            #1 פלטפורמת גיוס AI בישראל
          </div>
          <style>{`@keyframes sonar-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.5)}}`}</style>

          {/* H1 */}
          <h1
            id="hero-heading"
            style={{ fontSize:'clamp(2.6rem, 4.5vw, 4.2rem)', fontWeight:800, color:'var(--text)', lineHeight:1.12, marginBottom:'1.5rem', letterSpacing:'-1px' }}
          >
            גיוס שעובד{' '}
            <span className="grad-text">לבד</span>
            <br/>— למגייסים{' '}
            <span style={{ color:'var(--text2)', fontWeight:400 }}>ולמועמדים</span>
          </h1>

          <p style={{ fontSize:'1.1rem', color:'var(--text2)', lineHeight:1.75, maxWidth:480, marginBottom:'2.5rem' }}>
            מ-Job Sonar שמציף מועמדים אוטומטית, ועד סוכן קריירה AI שעובד בשבילך — Hiro מבטלת את העבודה הידנית.
          </p>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', marginBottom:'3rem' }}>
            <a href="#contact" style={{ background:'var(--p600)', color:'#fff', padding:'0.85rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='var(--p400)';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--p600)';e.currentTarget.style.transform='translateY(0)'}}>
              התחילו בחינם <span aria-hidden>←</span>
            </a>
            <a href="#product" style={{ background:'var(--card)', color:'var(--text)', padding:'0.85rem 2rem', borderRadius:12, fontSize:'1rem', fontWeight:600, textDecoration:'none', border:'1px solid var(--cb)', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--p400)'}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--cb)'}}>
              ראו את המוצר
            </a>
          </div>
        </div>

        {/* ── Left: Real product screenshot ── */}
        <div id="hero-visual" style={{ position:'relative' }}>
          {/* Glow behind card */}
          <div aria-hidden="true" style={{ position:'absolute', inset:-40, borderRadius:32, background:'radial-gradient(ellipse, rgba(83,74,183,0.25) 0%, transparent 70%)', filter:'blur(20px)' }}/>

          <div className="glass" style={{ borderRadius:20, overflow:'hidden', position:'relative', boxShadow:'var(--hero-shadow)' }}>
            {/* App top bar */}
            <div style={{ background:'var(--topbar-bg)', padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--cb)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#fc625d' }}/>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#fdbc40' }}/>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#35cd4b' }}/>
              </div>
              <span style={{ color:'var(--text2)', fontSize:'0.75rem' }}>app.hiro.co.il</span>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text)' }}>HIRO</span>
            </div>

            {/* Real screenshot from app.hiro.co.il */}
            <Image
              src="/images/hero-dashboard.png"
              alt="לוח הבקרה האישי של מגייס ב-Hiro — מועמדים בתהליך, משרות פתוחות וראיונות היום"
              width={1568}
              height={734}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
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
          #hero-grid{grid-template-columns:1fr !important; gap:2.75rem !important}
          .hero-content{text-align:center}
          .hero-content p{margin-left:auto !important; margin-right:auto !important}
          .hero-ctas{justify-content:center}
          #hero-visual{max-width:460px; margin:0 auto}
        }
        @media(max-width:480px){
          #hero-visual{max-width:100%}
        }
      `}</style>
    </section>
  )
}
