'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = theme === 'dark'

  return (
    <header
      role="banner"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '68px',
        background: scrolled
          ? isDark ? 'rgba(7,5,26,0.95)' : 'rgba(14,11,43,0.95)'
          : 'rgba(14,11,43,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.3s',
      }}
    >
      {/* Logo */}
      <a
        href="#"
        aria-label="Hiro — עמוד הבית"
        style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', textDecoration: 'none' }}
      >
        Hir<span style={{ color: 'var(--purple-400)' }}>o</span>
      </a>

      {/* Nav links */}
      <nav aria-label="ניווט ראשי">
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {[
            { href: '#platform', label: 'הפלטפורמה' },
            { href: '/recruiters', label: 'למגייסים' },
            { href: '/candidates', label: 'למועמדים' },
            { href: '#how', label: 'איך זה עובד' },
          ].map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                style={{
                  color: 'rgba(240,238,255,0.65)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(240,238,255,0.65)')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {/* Dark mode toggle */}
        {mounted && (
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'עבור למצב בהיר' : 'עבור למצב כהה'}
            title={isDark ? 'מצב בהיר' : 'מצב כהה'}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        )}
        <a
          href="#contact"
          style={{
            color: 'rgba(240,238,255,0.7)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '0.45rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--purple-400)'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            e.currentTarget.style.color = 'rgba(240,238,255,0.7)'
          }}
        >
          התחברות
        </a>
        <a
          href="#contact"
          style={{
            background: 'var(--purple-600)',
            color: '#fff',
            border: 'none',
            padding: '0.45rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--purple-400)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--purple-600)')}
        >
          התחל בחינם
        </a>
      </div>
    </header>
  )
}
