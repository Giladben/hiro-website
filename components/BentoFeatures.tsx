'use client'

function MatchRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r
  const fill = circ - (score / 100) * circ
  return (
    <svg width="120" height="120" aria-hidden="true">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(127,119,221,0.12)" strokeWidth="8"/>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--p400)" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
        style={{ transform:'rotate(-90deg)', transformOrigin:'60px 60px' }}/>
      <text x="60" y="55" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{score}%</text>
      <text x="60" y="74" textAnchor="middle" fill="rgba(240,238,255,0.45)" fontSize="10">דיוק התאמה</text>
    </svg>
  )
}

export function BentoFeatures() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="section-alt"
      style={{ padding:'6rem 2rem' }}
    >
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <span style={{ display:'inline-block', background:'var(--p50)', color:'var(--p600)', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 1rem', borderRadius:100, marginBottom:'1rem' }}>
            מה Hiro עושה בשבילכם
          </span>
          <h2 id="features-heading" style={{ fontSize:'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight:800, color:'var(--text)', lineHeight:1.15, marginBottom:'0.75rem' }}>
            כל מה שגיוס מודרני צריך
          </h2>
          <p style={{ fontSize:'1.05rem', color:'var(--text2)', maxWidth:520, margin:'0 auto', lineHeight:1.7 }}>
            אחת הפלטפורמות הבודדות בעולם שמשרתת גם מגייסים וגם מועמדים — מאותה מערכת.
          </p>
        </div>

        {/* Bento Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridTemplateRows:'auto auto auto', gap:'1rem' }}>

          {/* 1. AI Match - BIG (col 1-2, row 1) */}
          <article
            className="bento-card"
            aria-label="התאמה סמנטית AI"
            style={{ gridColumn:'span 2', background:'var(--dark)', borderColor:'rgba(255,255,255,0.06)' }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'1rem', flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p400)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>AI Semantic Matching</div>
                <h3 style={{ fontSize:'1.4rem', fontWeight:800, color:'#fff', marginBottom:'0.75rem', lineHeight:1.2 }}>
                  94% דיוק — לא מקרי
                </h3>
                <p style={{ fontSize:'0.875rem', color:'rgba(240,238,255,0.55)', lineHeight:1.65, marginBottom:'1.25rem', maxWidth:340 }}>
                  ה-AI השוואה כל מועמד למשרה לפי 40+ פרמטרים — ניסיון, כישורים, שכר, ותרבות ארגונית. לא חיפוש מילות מפתח — הבנה אמיתית.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.4rem' }}>
                  {['ניסיון רלוונטי','ציפיות שכר','תרבות ארגונית','זמינות','מיקום'].map(t=>(
                    <span key={t} style={{ background:'rgba(127,119,221,0.12)', border:'1px solid rgba(127,119,221,0.2)', color:'var(--p200)', fontSize:'0.72rem', fontWeight:600, padding:'0.2rem 0.65rem', borderRadius:100 }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ flexShrink:0 }}>
                <MatchRing score={94} />
              </div>
            </div>
          </article>

          {/* 2. Job Sonar - (col 3, row 1) */}
          <article className="bento-card" aria-label="Job Sonar" style={{ background:'var(--dark)', borderColor:'rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p400)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Job Sonar</div>
            <h3 style={{ fontSize:'1.15rem', fontWeight:800, color:'#fff', marginBottom:'0.6rem' }}>
              מועמדים שלא ידעתם שיש לכם
            </h3>
            <p style={{ fontSize:'0.82rem', color:'rgba(240,238,255,0.5)', lineHeight:1.6, marginBottom:'1.5rem' }}>
              סורק את כל המאגר אוטומטית ומציף את מי שמתאים — עכשיו.
            </p>
            {/* Sonar visual */}
            <div style={{ display:'flex', justifyContent:'center', position:'relative', height:70, marginBottom:'0.75rem' }}>
              <div style={{ position:'relative', width:70, height:70, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{ position:'absolute', border:'1.5px solid rgba(127,119,221,0.4)', borderRadius:'50%', width:70, height:70, animation:`sonar-expand 2s ease-out ${i*0.6}s infinite` }}/>
                ))}
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--p600)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.85rem', position:'relative', zIndex:1 }}>📡</div>
              </div>
              <style>{`@keyframes sonar-expand{0%{transform:scale(0.3);opacity:0.8}100%{transform:scale(2);opacity:0}}`}</style>
            </div>
            <div style={{ textAlign:'center', fontSize:'0.78rem', fontWeight:700, color:'var(--p200)' }}>20 מועמדים פוטנציאליים</div>
          </article>

          {/* 3. Communication (col 1, row 2) */}
          <article className="bento-card" aria-label="מרכז תקשורת">
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p600)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Bulk Communication</div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem' }}>תקשורת מסיבית<br/>מתוך המערכת</h3>
            <p style={{ fontSize:'0.82rem', color:'var(--text2)', lineHeight:1.6, marginBottom:'1.25rem' }}>SMS ומיילים בתפוצה, תזמון ואנליטיקה — ללא שיחוק.</p>
            {/* Mock messages */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {[{c:'#22c55e',t:'SMS נשלח ל-47 מועמדים'},{c:'var(--p600)',t:'פתיחה 73% · לחיצה 28%'},{c:'#f59e0b',t:'3 ממתינים לתשובה'}].map((m,i)=>(
                <div key={i} style={{ background:'var(--bg-alt)', borderRadius:8, padding:'6px 10px', fontSize:'0.75rem', color:'var(--text)', display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:m.c, flexShrink:0 }}/>
                  {m.t}
                </div>
              ))}
            </div>
          </article>

          {/* 4. CRM (col 2, row 2) */}
          <article className="bento-card" aria-label="CRM לקוחות">
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p600)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Client CRM</div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem' }}>בריאות לקוח<br/>בזמן אמת</h3>
            <p style={{ fontSize:'0.82rem', color:'var(--text2)', lineHeight:1.6, marginBottom:'1.25rem' }}>Workflows, KPI ודיוור — כל לקוח בשליטה מלאה.</p>
            {/* Client health bars */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[{name:'חב\' א\'', val:92, c:'#22c55e'},{name:'חב\' ב\'', val:68, c:'#f59e0b'},{name:'חב\' ג\'', val:45, c:'#ef4444'}].map(c=>(
                <div key={c.name}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', marginBottom:3 }}>
                    <span style={{ color:'var(--text)', fontWeight:600 }}>{c.name}</span>
                    <span style={{ color:c.c, fontWeight:700 }}>{c.val}%</span>
                  </div>
                  <div style={{ height:4, borderRadius:2, background:'var(--cb)', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${c.val}%`, background:c.c, borderRadius:2 }}/>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* 5. Multi-Persona (col 3, row 2) */}
          <article className="bento-card" aria-label="ריבוי פרופילים">
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p600)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Multi-Persona</div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text)', marginBottom:'0.5rem' }}>פרופיל אחד<br/>לא מספיק</h3>
            <p style={{ fontSize:'0.82rem', color:'var(--text2)', lineHeight:1.6, marginBottom:'1.25rem' }}>זהויות מקצועיות שונות תחת חשבון אחד — כל אחת עם קו"ח נפרד.</p>
            {/* Profile stacks */}
            <div style={{ position:'relative', height:70 }}>
              {[{t:'מנהלת חשבונות',l:'4 שנות ניסיון',off:0},{t:'מנהלת גבייה',l:'3 שנות ניסיון',off:12}].map((p,i)=>(
                <div key={i} style={{ position:'absolute', top:i*12, right:i*8, left:0, background:i===0?'var(--p600)':'var(--bg)', border:`1px solid ${i===0?'transparent':'var(--cb)'}`, borderRadius:10, padding:'8px 12px', zIndex:2-i }}>
                  <div style={{ fontSize:'0.75rem', fontWeight:700, color:i===0?'#fff':'var(--text)' }}>{p.t}</div>
                  <div style={{ fontSize:'0.65rem', color:i===0?'rgba(255,255,255,0.6)':'var(--text2)' }}>{p.l}</div>
                </div>
              ))}
            </div>
          </article>

          {/* 6. AI Career Agent - full width (row 3) */}
          <article
            className="bento-card"
            aria-label="סוכן קריירה AI"
            style={{ gridColumn:'span 3', background:'linear-gradient(135deg, var(--p900) 0%, var(--dark) 100%)', borderColor:'rgba(127,119,221,0.2)' }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'2rem' }}>
              <div style={{ flex:1, minWidth:280 }}>
                <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--p400)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Personal Career Suite</div>
                <h3 style={{ fontSize:'1.4rem', fontWeight:800, color:'#fff', marginBottom:'0.75rem' }}>
                  סוכן קריירה AI שעובד<br/>בשבילך, 24/7
                </h3>
                <p style={{ fontSize:'0.875rem', color:'rgba(240,238,255,0.55)', lineHeight:1.65, maxWidth:400 }}>
                  מגיש קורות חיים, עוקב אחרי הגשות, מציף הזדמנויות ומסנכרן עם המגייסים הרלוונטיים — הכל ברקע, בלי שתצטרכו לזכור.
                </p>
              </div>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                {[
                  { icon:'🎯', title:'Application Tracker', desc:'כל הגשה, בכל מקום' },
                  { icon:'⚡', title:'Live Profile Sync', desc:'עדכון בזמן אמת למגייסים' },
                  { icon:'🪄', title:'AI CV Enhancement', desc:'קו"ח שמדברים לניקודים' },
                ].map(f=>(
                  <div key={f.title} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'1rem', minWidth:150 }}>
                    <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }} aria-hidden="true">{f.icon}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:700, color:'#fff', marginBottom:'0.25rem' }}>{f.title}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(240,238,255,0.45)' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .bento-card[style*="span 2"]{grid-column:span 1 !important}
          .bento-card[style*="span 3"]{grid-column:span 1 !important}
          #features > div > div:last-child{grid-template-columns:1fr !important}
        }
      `}</style>
    </section>
  )
}
