'use client'

import { useState } from 'react'

type A11yState = {
  fontSize: 0 | 1 | 2
  highContrast: boolean
  grayscale: boolean
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<A11yState>({ fontSize: 0, highContrast: false, grayscale: false })

  function applyFontSize(level: 0 | 1 | 2) {
    document.body.classList.remove('a11y-lg', 'a11y-xl')
    if (level === 1) document.body.classList.add('a11y-lg')
    if (level === 2) document.body.classList.add('a11y-xl')
    setState(s => ({ ...s, fontSize: level }))
  }

  function toggle(key: 'highContrast' | 'grayscale', cls: string) {
    const next = !state[key]
    document.body.classList.toggle(cls, next)
    setState(s => ({ ...s, [key]: next }))
  }

  function reset() {
    document.body.classList.remove('a11y-lg', 'a11y-xl', 'a11y-contrast', 'a11y-mono')
    setState({ fontSize: 0, highContrast: false, grayscale: false })
  }

  return (
    <div className="a11y-fab" role="complementary" aria-label="כלי נגישות">
      {/* Panel */}
      {open && (
        <div className="a11y-panel" role="dialog" aria-label="הגדרות נגישות" aria-modal="false">
          <h2>♿ נגישות</h2>

          {/* Font size */}
          <div className="a11y-option">
            <span>גודל טקסט</span>
            <div style={{ display:'flex', gap:4 }}>
              {([0,1,2] as const).map(l => (
                <button
                  key={l}
                  className={`a11y-btn-sm ${state.fontSize === l ? 'active' : ''}`}
                  onClick={() => applyFontSize(l)}
                  aria-pressed={state.fontSize === l}
                  aria-label={`גודל טקסט ${l === 0 ? 'רגיל' : l === 1 ? 'גדול' : 'גדול מאוד'}`}
                >
                  {l === 0 ? 'א' : l === 1 ? 'א+' : 'א++'}
                </button>
              ))}
            </div>
          </div>

          {/* High contrast */}
          <div className="a11y-option">
            <span>ניגודיות גבוהה</span>
            <button
              className={`a11y-btn-sm ${state.highContrast ? 'active' : ''}`}
              onClick={() => toggle('highContrast', 'a11y-contrast')}
              aria-pressed={state.highContrast}
            >
              {state.highContrast ? 'פעיל' : 'כבוי'}
            </button>
          </div>

          {/* Grayscale */}
          <div className="a11y-option">
            <span>גווני אפור</span>
            <button
              className={`a11y-btn-sm ${state.grayscale ? 'active' : ''}`}
              onClick={() => toggle('grayscale', 'a11y-mono')}
              aria-pressed={state.grayscale}
            >
              {state.grayscale ? 'פעיל' : 'כבוי'}
            </button>
          </div>

          {/* Skip link shortcut */}
          <div className="a11y-option">
            <span>דלג לתוכן</span>
            <a href="#main-content" className="a11y-btn-sm" onClick={() => setOpen(false)}>
              ↓ דלג
            </a>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            style={{ width:'100%', marginTop:'0.75rem', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(240,238,255,0.6)', padding:'0.4rem', borderRadius:8, fontSize:'0.78rem', cursor:'pointer', fontFamily:'inherit' }}
            aria-label="איפוס כל הגדרות הנגישות"
          >
            איפוס הגדרות
          </button>

          <p style={{ fontSize:'0.65rem', color:'rgba(240,238,255,0.3)', marginTop:'0.75rem', textAlign:'center', lineHeight:1.4 }}>
            אתר זה עומד בתקן נגישות<br/>SI 5568 / WCAG 2.1 AA
          </p>
        </div>
      )}

      {/* FAB Button */}
      <button
        className="a11y-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-label={open ? 'סגור כלי נגישות' : 'פתח כלי נגישות'}
        title="נגישות"
      >
        ♿
      </button>
    </div>
  )
}
