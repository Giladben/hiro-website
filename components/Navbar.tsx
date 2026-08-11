'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === '/'
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Avoid a hydration mismatch: next-themes only knows the real theme after
  // mount (it reads localStorage/system preference client-side).
  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === 'dark'

  // Uses the shared theme tokens (--text/--text2/--cb) so it responds to the
  // light/dark toggle like the rest of the site — a fixed dark bar looked
  // disconnected from the light sections it sits above once scrolled.
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
        background: scrolled ? 'var(--navbar-bg-scrolled)' : 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--cb)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.1)' : 'none',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        aria-label="Hiro — עמוד הבית"
        style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', textDecoration: 'none' }}
      >
        Hir<span style={{ color: 'var(--p600)' }}>o</span>
      </a>

      {/* Nav links */}
      <nav aria-label="ניווט ראשי">
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {[
            { href: onHome ? '#platform' : '/#platform', label: 'הפלטפורמה' },
            { href: '/recruiters', label: 'למגייסים' },
            { href: '/candidates', label: 'למועמדים' },
            { href: onHome ? '#how' : '/#how', label: 'איך זה עובד' },
          ].map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                style={{
                  color: 'var(--text2)',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text2)')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'החלף למצב בהיר' : 'החלף למצב כהה'}
          title={isDark ? 'מצב בהיר' : 'מצב כהה'}
          style={{
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--cb)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.05rem',
            lineHeight: 1,
            color: 'var(--text2)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--p400)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--cb)'
            e.currentTarget.style.color = 'var(--text2)'
          }}
        >
          {mounted ? (isDark ? '☀️' : '🌙') : <span style={{ width: 16, height: 16, display: 'inline-block' }} />}
        </button>
        <a
          href="#contact"
          style={{
            color: 'var(--text2)',
            background: 'transparent',
            border: '1px solid var(--cb)',
            padding: '0.45rem 1.1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            textDecoration: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--p400)'
            e.currentTarget.style.color = 'var(--text)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--cb)'
            e.currentTarget.style.color = 'var(--text2)'
          }}
        >
          התחברות
        </a>
        <a
          href="#contact"
          style={{
            background: 'var(--p600)',
            color: '#fff',
            border: 'none',
            padding: '0.45rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--p400)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--p600)')}
        >
          התחל בחינם
        </a>
      </div>
    </header>
  )
}
