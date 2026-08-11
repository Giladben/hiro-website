'use client'

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true">
      <circle cx="27" cy="27" r={r} fill="none" style={{ stroke: 'var(--cb)' }} strokeWidth="4" />
      <circle
        cx="27" cy="27" r={r} fill="none"
        stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 27 27)"
      />
      <text x="27" y="32" textAnchor="middle" style={{ fill: 'var(--text)' }} fontSize="11" fontWeight="800">{score}</text>
    </svg>
  )
}

const candidates = [
  { name: 'מיכל כהן', role: 'Frontend Engineer', score: 97, color: '#22c55e', status: 'ראיון ראשון', statusColor: '#22c55e' },
  { name: 'עמית לוי', role: 'Full Stack', score: 91, color: '#7F77DD', status: 'ממתין לחזרה', statusColor: '#f59e0b' },
  { name: 'שירה ברק', role: 'Product Manager', score: 88, color: '#a78bfa', status: 'נשלחה הצעה', statusColor: '#7F77DD' },
  { name: 'דניאל אור', role: 'DevOps Lead', score: 84, color: '#e879a0', status: 'סקרינינג', statusColor: '#94a3b8' },
]

export function RecruiterHero() {
  return (
    <section
      aria-labelledby="rec-hero-heading"
      style={{
        background: 'var(--rec-hero-bg)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '7rem 2rem 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '10%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(83,74,183,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div id="rec-hero-grid" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>

        {/* Left: content */}
        <div className="rec-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(83,74,183,0.3)', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, padding: '0.35rem 1rem', borderRadius: 100, marginBottom: '1.5rem' }}>
            ✦ מגייסים — AI Recruitment OS
          </div>

          <h1
            id="rec-hero-heading"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: '1.25rem' }}
          >
            גייסו מהר יותר.
            <br />
            <span style={{ background: 'linear-gradient(135deg, #7F77DD, #22c55e, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              עם AI שמבין אנשים.
            </span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
            Hiro מוצאת את המועמד הנכון לפני שהוא בכלל פרסם שהוא זמין — עם מנוע התאמה סמנטי, Job Sonar ו-CRM מקיף.
          </p>

          <div className="rec-hero-ctas" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <a
              href="#signup"
              style={{ background: 'linear-gradient(135deg, #534AB7, #7F77DD)', color: '#fff', padding: '0.85rem 2rem', borderRadius: 12, fontSize: '1rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 28px rgba(83,74,183,0.4)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              בקשו דמו חינם <span aria-hidden>←</span>
            </a>
            <a
              href="#features"
              style={{ color: 'var(--text2)', padding: '0.85rem 1.5rem', borderRadius: 12, fontSize: '0.95rem', fontWeight: 600, textDecoration: 'none', border: '1px solid var(--cb)' }}
            >
              ראו את הפיצ'רים
            </a>
          </div>
        </div>

        {/* Right: candidate list mockup */}
        <div id="rec-hero-visual" style={{ background: 'var(--card)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--hero-shadow)' }}>
          {/* Header */}
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--cb)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text2)', fontWeight: 600 }}>Hiro Recruiter — מועמדים מתאימים</span>
            <div style={{ width: 24 }} />
          </div>

          {/* Search bar */}
          <div style={{ padding: '10px 18px', borderBottom: '1px solid var(--cb)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, background: 'var(--bg-alt)', borderRadius: 8, padding: '6px 12px', fontSize: '0.72rem', color: 'var(--text2)' }}>
              🔍 חיפוש סמנטי: "מפתח Full Stack עם ניסיון ב-React ו-Node, תל אביב"
            </div>
            <div style={{ background: 'var(--p600)', borderRadius: 8, padding: '6px 12px', fontSize: '0.68rem', color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>Job Sonar ✦</div>
          </div>

          {/* Candidate rows */}
          <div style={{ padding: '0.5rem 0' }}>
            {candidates.map((c, i) => (
              <div
                key={c.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 18px',
                  borderBottom: i < candidates.length - 1 ? '1px solid var(--cb)' : 'none',
                  background: i === 0 ? 'rgba(127,119,221,0.07)' : 'transparent',
                }}
              >
                <ScoreRing score={c.score} color={c.color} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text2)' }}>{c.role}</div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '3px 8px', borderRadius: 100, background: `${c.statusColor}18`, color: c.statusColor, border: `1px solid ${c.statusColor}30`, whiteSpace: 'nowrap' }}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>

          {/* Footer bar */}
          <div style={{ padding: '10px 18px', borderTop: '1px solid var(--cb)', display: 'flex', gap: '1rem' }}>
            {['SMS בתפוצה', 'תזמן ראיון', 'ייצא לדוח'].map(a => (
              <div key={a} style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(167,139,250,0.7)', cursor: 'pointer', padding: '4px 8px', background: 'rgba(127,119,221,0.08)', borderRadius: 6 }}>{a}</div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .rec-hero-content{text-align:center}
          .rec-hero-content p{margin-left:auto !important; margin-right:auto !important}
          .rec-hero-ctas{justify-content:center}
          #rec-hero-visual{max-width:460px; margin:0 auto}
        }
        @media(max-width:480px){
          #rec-hero-visual{max-width:100%}
        }
      `}</style>
    </section>
  )
}
