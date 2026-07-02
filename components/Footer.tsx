'use client'

const navLinks = [
  { title: 'פלטפורמה', items: [{ href: '#platform', label: 'סקירת הפלטפורמה' }, { href: '#recruiters', label: 'למגייסים' }, { href: '#candidates', label: 'למועמדים' }, { href: '#how', label: 'איך זה עובד' }] },
  { title: 'פיצ\'רים', items: [{ href: '#', label: 'Job Sonar' }, { href: '#', label: 'AI Matching' }, { href: '#', label: 'Multi-Persona' }, { href: '#', label: 'Application Tracker' }] },
  { title: 'צרו קשר', items: [{ href: '#', label: 'צור קשר' }, { href: '#', label: 'מדיניות פרטיות' }, { href: '#', label: 'תנאי שימוש' }, { href: '#', label: 'נגישות' }] },
]

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: '#0a0821',
        color: 'rgba(240,238,255,0.55)',
        padding: '4rem 2rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
              Hir<span style={{ color: 'var(--purple-400)' }}>o</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              פלטפורמת הגיוס החכמה שמחברת בין מגייסים למועמדים — באמצעות AI סמנטי, אוטומציה מלאה וחוויית משתמש מהמם.
            </p>
          </div>

          {/* Nav columns */}
          {navLinks.map(col => (
            <nav key={col.title} aria-label={col.title}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', letterSpacing: '0.05em' }}>
                {col.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.items.map(item => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      style={{ color: 'rgba(240,238,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,238,255,0.55)')}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
        }}>
          <span>© 2025 Hiro. כל הזכויות שמורות.</span>
          <span>Mobile-First · AI-Powered · Made in Israel 🇮🇱</span>
        </div>
      </div>
    </footer>
  )
}
