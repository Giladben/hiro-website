'use client'

const features = [
  {
    title: 'התאמה סמנטית AI',
    desc: 'השוואה בין מועמד למשרה על בסיס עשרות פרמטרים — ניסיון, כישורים, תרבות ארגונית — עם ציון התאמה ויזואלי.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6M8 11h6"/>
      </svg>
    ),
  },
  {
    title: 'Job Sonar',
    desc: 'כלי אקטיבי בתוך דף המשרה שסורק את המאגר הקיים ומציף מועמדים מתאימים אוטומטית — חוסך שעות חיפוש.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <circle cx="12" cy="12" r="3"/><path d="M6.343 6.343a8 8 0 1 0 11.314 11.314 8 8 0 0 0-11.314-11.314z"/>
        <path d="M3.515 3.515a13 13 0 1 0 16.97 16.97"/>
      </svg>
    ),
  },
  {
    title: 'מרכז תקשורת רב-ערוצי',
    desc: 'שליחת SMS ומיילים בתפוצה רחבה ישירות מהמערכת — עם תבניות, תזמון ואנליטיקת פתיחות.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: 'CRM לניהול לקוחות',
    desc: 'מעקב "בריאות לקוח", הגדרת Workflows מותאמים לכל לקוח, מדדי KPI ודיוור — הכל ממקום אחד.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    title: 'עריכת קורות חיים מובנית',
    desc: 'עריכה ועיצוב קו"ח ישירות במערכת — ללא כלים חיצוניים, עם שמירה אוטומטית ותיעוד גרסאות.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    title: 'חיפוש וסינון סמנטי',
    desc: 'חיתוך מהיר של מאגר המועמדים עם פילטרים מתקדמים — ניסיון, תחום, מיקום, זמינות ועוד.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="1.8" aria-hidden="true">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/>
      </svg>
    ),
  },
]

export function RecruiterFeatures() {
  return (
    <section
      id="recruiters"
      aria-labelledby="recruiters-heading"
      style={{ background: '#fff', padding: '6rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <span style={{
          display: 'inline-block',
          background: 'var(--purple-50)',
          color: 'var(--purple-600)',
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '0.3rem 0.9rem',
          borderRadius: '100px',
          marginBottom: '1rem',
        }}>
          למגייסים
        </span>
        <h2 id="recruiters-heading" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800, color: '#0e0b2b', marginBottom: '0.75rem' }}>
          הכלים שקיצרו את Time-to-Hire בשלישית
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#5a5478', maxWidth: 560, lineHeight: 1.7, marginBottom: '3.5rem' }}>
          מנגנון ה-AI של Hiro מייצר אוטומציה מלאה — ממצאי מועמדים ועד דיוור, בלי עבודה ידנית.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {features.map(f => (
            <article
              key={f.title}
              aria-label={f.title}
              style={{
                background: '#faf9ff',
                border: '1px solid #ebe9f8',
                borderRadius: 16,
                padding: '1.75rem',
                transition: 'all 0.25s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = 'var(--purple-200)'
                el.style.transform = 'translateY(-3px)'
                el.style.boxShadow = '0 12px 32px rgba(83,74,183,0.1)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = '#ebe9f8'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: 'var(--purple-50)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0e0b2b', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b6490', lineHeight: 1.65 }}>{f.desc}</p>
            </article>
          ))}
        </div>

        {/* Match Score Demo */}
        <div
          aria-label="דוגמת ציון התאמה"
          style={{
            background: 'var(--dark-card)',
            border: '1px solid var(--border-dark)',
            borderRadius: 16,
            padding: '1.5rem',
            marginTop: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            maxWidth: 620,
          }}
        >
          <div style={{ position: 'relative', width: 88, height: 88, flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
              <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(127,119,221,0.15)" strokeWidth="8"/>
              <circle cx="44" cy="44" r="36" fill="none" stroke="#7F77DD" strokeWidth="8"
                strokeDasharray="226" strokeDashoffset="36" strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px' }}/>
            </svg>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              94%
            </span>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>
              ציון התאמה לדוגמה: מנהלת גיוס — חברת SaaS
            </h4>
            <p style={{ color: 'rgba(240,238,255,0.65)', fontSize: '0.8rem', lineHeight: 1.5 }}>
              המועמדת מתאימה ב-94% על בסיס ניסיון, כישורים וצפי שכר
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
              {['5 שנות ניסיון ✓', 'גיוס טכנולוגי ✓', 'ניהול צוות ✓', 'אנגלית ✓'].map(t => (
                <span key={t} style={{
                  background: 'rgba(127,119,221,0.15)',
                  color: 'var(--purple-200)',
                  fontSize: '0.72rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 6,
                  fontWeight: 600,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
