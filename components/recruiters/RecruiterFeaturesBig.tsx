'use client'

function FeatureBlock({
  tag, title, desc, visual, flip = false,
}: {
  tag: string; title: string; desc: string; visual: React.ReactNode; flip?: boolean
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '5rem' }}>
      <div style={{ order: flip ? 2 : 1 }}>
        <span style={{ display: 'inline-block', background: 'var(--p50)', color: 'var(--p600)', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.8rem', borderRadius: 100, marginBottom: '1rem' }}>{tag}</span>
        <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: '1rem' }}>{title}</h3>
        <p style={{ fontSize: '1rem', color: 'var(--text2)', lineHeight: 1.75 }}>{desc}</p>
      </div>
      <div style={{ order: flip ? 1 : 2 }}>{visual}</div>
    </div>
  )
}

function MatchVisual() {
  const candidates = [
    { name: 'מיכל כהן', score: 97, tags: ['React', 'Node.js', 'ת"א'], color: '#22c55e' },
    { name: 'עמית לוי', score: 91, tags: ['Vue', 'Python', 'הרצליה'], color: '#7F77DD' },
    { name: 'רון אבידן', score: 84, tags: ['Angular', 'AWS', 'ת"א'], color: '#a78bfa' },
  ]
  return (
    <div style={{ background: 'var(--dark)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
      <div style={{ padding: '12px 16px', background: 'rgba(7,5,26,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #7F77DD, #22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>✦</div>
        <span style={{ color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>AI Match — מפתח Full Stack</span>
        <span style={{ marginRight: 'auto', fontSize: '0.62rem', color: '#22c55e', fontWeight: 700 }}>● 47 התאמות</span>
      </div>
      <div style={{ padding: '0.75rem 0' }}>
        {candidates.map((c, i) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: i < candidates.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
            <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
              <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
                <circle cx="22" cy="22" r="17" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                <circle cx="22" cy="22" r="17" fill="none" stroke={c.color} strokeWidth="3.5"
                  strokeDasharray={`${(c.score / 100) * 2 * Math.PI * 17} ${2 * Math.PI * 17}`}
                  strokeLinecap="round" transform="rotate(-90 22 22)" />
                <text x="22" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">{c.score}</text>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{c.name}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {c.tags.map(t => <span key={t} style={{ fontSize: '0.6rem', fontWeight: 600, padding: '2px 6px', borderRadius: 100, background: `${c.color}15`, color: c.color }}>{t}</span>)}
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(167,139,250,0.7)', fontWeight: 600, cursor: 'pointer' }}>פנה ←</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 16px 12px', borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.65rem', color: 'rgba(240,238,255,0.25)', textAlign: 'center' }}>
        מראה 3 מתוך 47 — מסודר לפי ציון התאמה סמנטי
      </div>
    </div>
  )
}

function SonarVisual() {
  const signals = [
    { name: 'שרה גולד', signal: 'עדכנה LinkedIn לפני 3 ימים', strength: 92, color: '#22c55e' },
    { name: 'יואב מזרחי', signal: 'שינה תואר "Open to work"', strength: 87, color: '#7F77DD' },
    { name: 'נעמה הראל', signal: 'פרסמה פוסט על חיפוש עבודה', strength: 78, color: '#f59e0b' },
  ]
  return (
    <div style={{ background: 'var(--dark)', borderRadius: 20, padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.6)' }}>Job Sonar — אותות מועמדים פסיביים</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {signals.map(s => (
          <div key={s.name} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.75rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{s.name}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: s.color }}>{s.strength}% מוכנות</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(240,238,255,0.4)', marginBottom: 8 }}>{s.signal}</div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${s.strength}%`, background: s.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CRMVisual() {
  const stages = [
    { label: 'ליד', count: 34, color: '#94a3b8' },
    { label: 'סקרינינג', count: 18, color: '#7F77DD' },
    { label: 'ראיון', count: 7, color: '#a78bfa' },
    { label: 'הצעה', count: 3, color: '#22c55e' },
    { label: 'גויס', count: 1, color: '#f59e0b' },
  ]
  return (
    <div style={{ background: 'var(--dark)', borderRadius: 20, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.4)', marginBottom: '1rem' }}>CRM Pipeline — פיתוח מוצר Q3</div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {stages.map(s => (
          <div key={s.label} style={{ flex: s.count, background: s.color, borderRadius: 6, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#fff', minWidth: 20 }}>
            {s.count > 5 ? s.count : ''}
          </div>
        ))}
      </div>
      {stages.map(s => (
        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.6)' }}>{s.label}</span>
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: s.color }}>{s.count}</span>
        </div>
      ))}
    </div>
  )
}

export function RecruiterFeaturesBig() {
  return (
    <section
      id="features"
      aria-labelledby="rec-features-heading"
      style={{ background: 'var(--bg)', padding: '6rem 2rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--p50)', color: 'var(--p600)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.3rem 1rem', borderRadius: 100, marginBottom: '1rem' }}>
            הפיצ'רים
          </span>
          <h2 id="rec-features-heading" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15 }}>
            מערכת הגיוס שחיכיתם לה
          </h2>
        </div>

        <FeatureBlock
          tag="AI Match"
          title="התאמה סמנטית — לא רק מילות מפתח"
          desc="המנוע של Hiro מבין הקשר, ניסיון, כישורים רכים ומיקום. המועמד הנכון מגיע לראש הרשימה גם אם לא השתמש בדיוק באותן מילים שכתבתם במשרה — פי 3 פחות זמן סינון."
          visual={<MatchVisual />}
        />

        <FeatureBlock
          tag="Job Sonar"
          title="גלו מועמדים לפני שהם יצאו לשוק"
          desc="Job Sonar עוקב אחרי אותות ברשת — עדכוני LinkedIn, שינויי סטטוס, פוסטים ועוד. מגייסים מקבלים התראה בזמן אמת כשמועמד פסיבי שמתאים לפוזיציה פתוחה מראה סימני זמינות."
          visual={<SonarVisual />}
          flip
        />

        <FeatureBlock
          tag="CRM מלא"
          title="כל תהליך הגיוס תחת גג אחד"
          desc="Pipeline ויזואלי, תזכורות, שליחת SMS ומיילים בתפוצה עם תבניות AI, ניהול לקוחות (למשרדי גיוס), דוחות ביצועים ואינטגרציה לאאוטלוק ו-Google Calendar."
          visual={<CRMVisual />}
        />
      </div>
    </section>
  )
}
