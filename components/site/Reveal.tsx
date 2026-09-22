'use client'

import { useEffect } from 'react'

/**
 * Adds `.in` to every `.reveal` element once it nears the viewport.
 * Uses a plain scroll check instead of IntersectionObserver so content can
 * never get stuck invisible (IO doesn't fire in some embedded/hidden views).
 */
export function RevealOnScroll() {
  useEffect(() => {
    document.documentElement.classList.add('js-reveal')
    let pending = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'))
    let raf = 0
    const check = () => {
      raf = 0
      const limit = window.innerHeight * 0.94
      pending = pending.filter(el => {
        if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false }
        return true
      })
      if (pending.length === 0) window.removeEventListener('scroll', onScroll)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return null
}
