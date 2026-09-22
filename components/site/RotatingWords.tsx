'use client'

import { useEffect, useState } from 'react'

/**
 * Cycles through phrases with a vertical mask-slide. Screen readers get the
 * first phrase as static text; the animated copy is aria-hidden so it never
 * spams a live region.
 */
export function RotatingWords({ words, interval = 2600, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setI(cur => { setPrev(cur); return (cur + 1) % words.length })
    }, interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  return (
    <span className={`rot ${className ?? ''}`}>
      <span className="sr-only">{words[0]}</span>
      <span className="rot-track" aria-hidden="true">
        {/* invisible sizer keeps line height stable */}
        <span className="rot-sizer">{words[i]}</span>
        {prev !== null && <span key={`o${prev}-${i}`} className="rot-word rot-out">{words[prev]}</span>}
        <span key={`i${i}`} className={`rot-word ${prev !== null ? 'rot-in' : ''}`}>{words[i]}</span>
      </span>
    </span>
  )
}
