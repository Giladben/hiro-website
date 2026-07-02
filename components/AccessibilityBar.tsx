'use client'

import { useState } from 'react'

export function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(0)
  const [highContrast, setHighContrast] = useState(false)

  function cycleFont() {
    const next = (fontSize + 1) % 3
    setFontSize(next)
    document.body.classList.remove('a11y-text-lg', 'a11y-text-xl')
    if (next === 1) document.body.classList.add('a11y-text-lg')
    if (next === 2) document.body.classList.add('a11y-text-xl')
  }

  function toggleContrast() {
    setHighContrast(prev => {
      document.body.classList.toggle('a11y-high-contrast', !prev)
      return !prev
    })
  }

  const fontLabel = fontSize === 0 ? 'א' : fontSize === 1 ? 'א+' : 'א++'

  return (
    <aside className="a11y-bar" aria-label="סרגל נגישות">
      <button
        className="a11y-btn"
        onClick={cycleFont}
        aria-label={`שנה גודל גופן (נוכחי: ${fontLabel})`}
        title="גודל גופן"
      >
        {fontLabel}
      </button>
      <button
        className="a11y-btn"
        onClick={toggleContrast}
        aria-pressed={highContrast}
        aria-label="ניגודיות גבוהה"
        title="ניגודיות גבוהה"
        style={{ background: highContrast ? 'rgba(255,255,255,0.3)' : undefined }}
      >
        ◑
      </button>
      <a
        href="#main-content"
        className="a11y-btn"
        aria-label="דלג לתוכן הראשי"
        title="דלג לתוכן"
        style={{ fontSize: '0.7rem', textAlign: 'center', lineHeight: 1.1, textDecoration: 'none' }}
      >
        ↓<br/>תוכן
      </a>
    </aside>
  )
}
