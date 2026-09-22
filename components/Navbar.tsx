'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // next-themes only knows the real theme after mount
  useEffect(() => setMounted(true), [])

  useEffect(() => { setMobileOpen(false) }, [pathname])
  useEffect(() => {
    if (!mobileOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const isDark = mounted && resolvedTheme === 'dark'

  const navItems = [
    { href: '/recruiters', label: 'למגייסים' },
    { href: '/candidates', label: 'למועמדים' },
    { href: onHome ? '#features' : '/#features', label: 'מה יש בפנים' },
    { href: '/blog', label: 'בלוג' },
  ]

  return (
    <header role="banner" className={`nav ${scrolled || mobileOpen ? 'nav-solid' : ''}`}>
      <div className="nav-in">
        <Link href="/" aria-label="Hiro, עמוד הבית" className="nav-logo">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG logo */}
          <img src={isDark ? '/images/hiro-lockup-reversed.svg' : '/images/hiro-lockup.svg'} alt="Hiro" width={81} height={34} />
        </Link>

        <nav aria-label="ניווט ראשי" className="nav-desktop">
          <ul>
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <a href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="nav-icon"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'החלף למצב בהיר' : 'החלף למצב כהה'}
          >
            {mounted && (isDark
              ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></svg>)}
          </button>
          <a href="https://app.hiro.co.il" className="nav-desktop nav-login">כניסה</a>
          <a href="/contact" className="nav-desktop btn btn-primary nav-cta">קבעו הדגמה</a>

          <button
            type="button"
            className="nav-icon nav-burger"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
          >
            <span aria-hidden="true" className={`burger ${mobileOpen ? 'burger-x' : ''}`}><i /><i /></span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div id="nav-mobile" className="nav-mobile">
          <nav aria-label="ניווט ראשי, מובייל">
            <ul>
              {navItems.map(({ href, label }) => (
                <li key={href}><a href={href} onClick={() => setMobileOpen(false)}>{label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="nav-mobile-ctas">
            <a href="/contact" className="btn btn-primary" onClick={() => setMobileOpen(false)}>קבעו הדגמה</a>
            <a href="https://app.hiro.co.il" className="btn btn-ghost">כניסה למערכת</a>
          </div>
        </div>
      )}

      <style>{`
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; transition: background .3s, border-color .3s; border-bottom: 1px solid transparent; }
        .nav-solid { background: var(--navbar-bg-scrolled); backdrop-filter: saturate(1.4) blur(14px); -webkit-backdrop-filter: saturate(1.4) blur(14px); border-bottom-color: var(--cb); }
        .nav-in { max-width: 1240px; margin: 0 auto; padding: 0 2rem; height: 72px; display: flex; align-items: center; gap: 2.5rem; }
        .nav-logo { display: flex; flex-shrink: 0; }
        .nav-logo img { height: 30px; width: auto; }
        .nav-desktop ul { display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0; }
        .nav-desktop ul a { color: var(--text2); text-decoration: none; font-size: .95rem; font-weight: 500; transition: color .2s; }
        .nav-desktop ul a:hover, .nav-desktop ul a[aria-current="page"] { color: var(--text); }
        .nav-actions { margin-right: auto; display: flex; align-items: center; gap: .6rem; }
        .nav-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid var(--line); border-radius: 50%; color: var(--text); cursor: pointer; }
        .nav-icon:hover { border-color: var(--text); }
        .nav-login { color: var(--text); text-decoration: none; font-weight: 500; font-size: .95rem; padding: 0 .75rem; }
        .nav-cta { padding: .6rem 1.2rem !important; font-size: .92rem !important; }
        .nav-burger { display: none; }
        .burger { position: relative; width: 16px; height: 8px; display: block; }
        .burger i { position: absolute; right: 0; left: 0; height: 1.5px; background: currentColor; transition: transform .25s, top .25s; }
        .burger i:first-child { top: 0; } .burger i:last-child { top: 6.5px; }
        .burger-x i:first-child { top: 3.25px; transform: rotate(45deg); }
        .burger-x i:last-child { top: 3.25px; transform: rotate(-45deg); }
        .nav-mobile { position: fixed; top: 72px; left: 0; right: 0; bottom: 0; background: var(--bg); padding: 1rem 1.25rem 2rem; overflow-y: auto; border-top: 1px solid var(--cb); }
        .nav-mobile ul { list-style: none; margin: 0; padding: 0; }
        .nav-mobile li a { display: block; color: var(--text); text-decoration: none; font-family: var(--font-display); font-size: 2rem; padding: .9rem 0; border-bottom: 1px solid var(--cb); }
        .nav-mobile-ctas { display: flex; flex-direction: column; gap: .75rem; margin-top: 2rem; }
        .nav-mobile-ctas .btn { justify-content: center; }
        @media (max-width: 960px) {
          .nav-in { padding: 0 1.25rem; height: 64px; }
          .nav-mobile { top: 64px; }
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex; }
        }
      `}</style>
    </header>
  )
}
