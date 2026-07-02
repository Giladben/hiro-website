'use client'

export function CandidateCTA() {
  return (
    <section
      id="signup"
      aria-labelledby="cand-cta-heading"
      style={{
        background:'linear-gradient(160deg, #07051a 0%, #0f0b2e 60%, #1a0835 100%)',
        padding:'7rem 2rem',
        textAlign:'center',
        position:'relative',
        overflow:'hidden',
      }}
    >
      <div aria-hidden="true" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(ellipse, rgba(127,119,221,0.2) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ position:'relative', zIndex:1, maxWidth:700, margin:'0 auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)', color:'#c4b5fd', fontSize:'0.82rem', fontWeight:700, padding:'0.35rem 1rem', borderRadius:100, marginBottom:'1.5rem' }}>
          ✦ בחינם לגמרי למועמדים — תמיד
        </div>

        <h2
          id="cand-cta-heading"
          style={{ fontSize:'clamp(2rem, 4vw, 3rem)', fontWeight:800, color:'#fff', lineHeight:1.18, marginBottom:'1rem' }}
        >
          מוכנים שהקריירה שלכם<br/>
          <span style={{ background:'linear-gradient(135deg, #c4b5fd, #a78bfa, #e879a0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
            תנוהל חכם?
          </span>
        </h2>

        <p style={{ fontSize:'1.1rem', color:'rgba(240,238,255,0.6)', marginBottom:'2.5rem', lineHeight:1.7 }}>
          הצטרפו לאלפי מועמדים שמצאו עבודה טובה יותר — מהר יותר.
          <br/>
          <span style={{ fontSize:'0.9rem', color:'rgba(167,139,250,0.6)' }}>ללא כרטיס אשראי · ביטול בכל עת</span>
        </p>

        <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap', marginBottom:'3rem' }}>
          <a
            href="#"
            style={{
              background:'linear-gradient(135deg, #534AB7, #7F77DD)',
              color:'#fff',
              padding:'1rem 2.5rem',
              borderRadius:12,
              fontSize:'1.1rem',
              fontWeight:700,
              textDecoration:'none',
              boxShadow:'0 8px 28px rgba(83,74,183,0.4)',
              transition:'all 0.2s',
              display:'inline-flex',
              alignItems:'center',
              gap:'0.5rem',
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 12px 36px rgba(83,74,183,0.5)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 28px rgba(83,74,183,0.4)'}}
          >
            הצטרפו בחינם עכשיו <span aria-hidden>←</span>
          </a>
        </div>

        {/* Trust signals */}
        <div role="list" style={{ display:'flex', gap:'2rem', justifyContent:'center', flexWrap:'wrap' }}>
          {['✓ בחינם תמיד','✓ ללא כרטיס אשראי','✓ פרטיות מלאה','✓ ביטול בכל עת'].map(t=>(
            <span key={t} role="listitem" style={{ fontSize:'0.82rem', color:'rgba(240,238,255,0.4)', fontWeight:600 }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
