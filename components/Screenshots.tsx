'use client'

import { useState } from 'react'
import Image from 'next/image'

const screens = [
  {
    id: 'candidates',
    label: 'רשימת מועמדים',
    desc: 'רשימה חכמה עם ציוני התאמה לכל מועמד, סטטוסים, מקורות גיוס וסינון מתקדם — הכל בטבלה אחת.',
    src: '/images/screen-candidates.png',
    alt: 'ממשק רשימת מועמדים ב-Hiro עם ציוני התאמה וסטטוסים',
  },
  {
    id: 'sonar',
    label: 'Job Sonar',
    desc: 'Job Sonar סורק את המאגר אוטומטית לפי ציון התאמה מינימלי ומציף מועמדים פוטנציאליים בלחיצה אחת.',
    src: '/images/screen-sonar.png',
    alt: 'ממשק Job Sonar — סריקה אוטומטית של מועמדים מתאימים',
  },
  {
    id: 'matching',
    label: 'התאמת משרות',
    desc: 'מבט מלא על התאמת מועמד למשרות — ציון, בר התקדמות ורמזים לחוסרים — כדי שתדע בדיוק איפה הפערים.',
    src: '/images/screen-matching.png',
    alt: 'ממשק התאמת משרות עם ציוני AI ובר התקדמות',
  },
  {
    id: 'profile',
    label: 'פרופיל מועמד',
    desc: 'פרופיל מועמד מלא עם טאבים, ניהול הגשות, אירועים ומסמכים — כולל כפתור התאמות AI ישירות מהפרופיל.',
    src: '/images/screen-profile.png',
    alt: 'פרופיל מועמד מלא עם טאבים ופרטים',
  },
]

export function Screenshots() {
  const [active, setActive] = useState(0)

  return (
    <section
      id="product"
      aria-labelledby="screenshots-heading"
      style={{ background: '#fff', padding: '6rem 2rem' }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <span
            style={{
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
            }}
          >
            הפלטפורמה בפעולה
          </span>
        </div>
        <h2
          id="screenshots-heading"
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800,
            color: '#0e0b2b',
            textAlign: 'center',
            marginBottom: '0.75rem',
          }}
        >
          ממשק שתרצו לעבוד איתו כל יום
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#5a5478', textAlign: 'center', marginBottom: '2.5rem' }}>
          מרשימת המועמדים ועד פרופיל מלא — הכל מעוצב לבהירות מקסימלית.
        </p>

        {/* Tabs */}
        <div role="tablist" aria-label="מסכי הפלטפורמה" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {screens.map((s, i) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={active === i}
              aria-controls={`tabpanel-${s.id}`}
              id={`tab-${s.id}`}
              onClick={() => setActive(i)}
              style={{
                background: active === i ? 'var(--purple-600)' : '#f3f2fc',
                border: `1px solid ${active === i ? 'var(--purple-600)' : '#e0ddf5'}`,
                color: active === i ? '#fff' : '#6b6490',
                padding: '0.55rem 1.25rem',
                borderRadius: '100px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <p
          role="status"
          aria-live="polite"
          style={{ fontSize: '0.92rem', color: '#6b6490', textAlign: 'center', marginBottom: '1.75rem', minHeight: '2.5rem' }}
        >
          {screens[active].desc}
        </p>

        {/* Screen frame */}
        {screens.map((s, i) => (
          <div
            key={s.id}
            id={`tabpanel-${s.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${s.id}`}
            hidden={active !== i}
            style={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e0ddf5',
              boxShadow: '0 24px 60px rgba(83,74,183,0.12)',
            }}
          >
            {/* Browser bar */}
            <div style={{
              background: '#f3f2fc',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderBottom: '1px solid #e0ddf5',
            }}>
              <div style={{ display: 'flex', gap: 6 }} aria-hidden="true">
                {['#fc625d','#fdbc40','#35cd4b'].map(c => (
                  <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c, display: 'block' }} />
                ))}
              </div>
              <div style={{
                flex: 1,
                background: '#fff',
                border: '1px solid #e0ddf5',
                borderRadius: 6,
                padding: '0.25rem 0.75rem',
                fontSize: '0.8rem',
                color: '#8880b0',
                textAlign: 'center',
                maxWidth: 300,
                margin: '0 auto',
              }}>
                app.hiro.co.il
              </div>
            </div>

            {/* Image */}
            <div style={{ background: '#f8f7ff', position: 'relative', minHeight: 400 }}>
              <Image
                src={s.src}
                alt={s.alt}
                width={1400}
                height={800}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
