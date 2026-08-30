'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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

  // Close the mobile menu on route change / when switching back to desktop width.
  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isDark = mounted && resolvedTheme === 'dark'

  const navItems = [
    { href: onHome ? '#platform' : '/#platform', label: 'הפלטפורמה' },
    { href: '/recruiters', label: 'למגייסים' },
    { href: '/candidates', label: 'למועמדים' },
    { href: onHome ? '#how' : '/#how', label: 'איך זה עובד' },
    { href: '/blog', label: 'בלוג' },
  ]

  // Uses the shared theme tokens (--text/--text2/--cb) so it responds to the
  // light/dark toggle like the rest of the site — a fixed dark bar looked
  // disconnected from the light sections it sits above once scrolled.
  return (
    <header
      role="banner"
      className="navbar-root"
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        height: '68px',
        background: scrolled || mobileOpen ? 'var(--navbar-bg-scrolled)' : 'var(--navbar-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled || mobileOpen ? '1px solid var(--cb)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.1)' : 'none',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Logo */}
      <a
        href="/"
        aria-label="Hiro — עמוד הבית"
        style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo; next/image doesn't optimize SVGs */}
        <img
          src={isDark ? '/images/hiro-lockup-reversed.svg' : '/images/hiro-lockup.svg'}
          alt="Hiro"
          width={81}
          height={34}
          style={{ height: 34, width: 'auto' }}
        />
      </a>

      {/* Nav links — desktop only, hidden on mobile via .navbar-desktop media query below */}
      <nav aria-label="ניווט ראשי" className="navbar-desktop">
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map(({ href, label }) => (
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

      {/* Actions — desktop: full set; mobile: theme toggle + hamburger only */}
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
            flexShrink: 0,
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
          className="navbar-desktop"
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
          className="navbar-desktop"
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

        {/* Hamburger — mobile only */}
        <button
          type="button"
          className="navbar-burger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
          aria-expanded={mobileOpen}
          aria-controls="navbar-mobile-menu"
          style={{
            width: 38,
            height: 38,
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--cb)',
            borderRadius: '8px',
            cursor: 'pointer',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          <span aria-hidden="true" style={{ position: 'relative', width: 18, height: 12, display: 'block' }}>
            <span style={{
              position: 'absolute', right: 0, width: 18, height: 2, background: 'var(--text)', borderRadius: 2,
              top: mobileOpen ? 5 : 0,
              transform: mobileOpen ? 'rotate(45deg)' : 'none',
              transition: 'all 0.2s',
            }} />
            <span style={{
              position: 'absolute', right: 0, top: 5, width: 18, height: 2, background: 'var(--text)', borderRadius: 2,
              opacity: mobileOpen ? 0 : 1,
              transition: 'opacity 0.2s',
            }} />
            <span style={{
              position: 'absolute', right: 0, width: 18, height: 2, background: 'var(--text)', borderRadius: 2,
              top: mobileOpen ? 5 : 10,
              transform: mobileOpen ? 'rotate(-45deg)' : 'none',
              transition: 'all 0.2s',
            }} />
          </span>
        </button>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <div
          id="navbar-mobile-menu"
          className="navbar-mobile-menu"
          style={{
            position: 'fixed',
            top: '68px', left: 0, right: 0,
            bottom: 0,
            background: 'var(--navbar-bg-scrolled)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--cb)',
            padding: '1.5rem',
            overflowY: 'auto',
          }}
        >
          <nav aria-label="ניווט ראשי — מובייל">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none', margin: 0, padding: 0 }}>
              {navItems.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block',
                      color: 'var(--text)',
                      textDecoration: 'none',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      padding: '0.9rem 0.25rem',
                      borderBottom: '1px solid var(--cb)',
                    }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: 'center',
                color: 'var(--text)',
                background: 'transparent',
                border: '1px solid var(--cb)',
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              התחברות
            </a>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              style={{
                textAlign: 'center',
                background: 'var(--p600)',
                color: '#fff',
                padding: '0.85rem 1.25rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              התחל בחינם
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 980px) {
          .navbar-root { padding: 0 1.25rem !important; }
          .navbar-desktop { display: none !important; }
          .navbar-burger { display: flex !important; }
        }
        @media (min-width: 981px) {
          .navbar-mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  )
}
