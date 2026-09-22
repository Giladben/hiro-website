'use client'

import s from './film.module.css'

/** Score ring in the style of the product's own match indicator. */
export function Ring({ value, size = 44, stroke = 3.5, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2 - 1
  const c = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  return (
    <span className={s.ring} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ui-line)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="var(--ui-accent)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${(v / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <b style={{ fontSize: size * 0.3 }}>{Math.round(v)}{label}</b>
    </span>
  )
}

export function Dot({ tone }: { tone: 'ok' | 'bad' | 'mute' }) {
  return <i className={`${s.dot} ${s[`dot_${tone}`]}`} />
}

export function Avatar({ name, tone = 0 }: { name: string; tone?: number }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('')
  return <span className={s.avatar} data-tone={tone % 4}>{initials}</span>
}

/** Simple RTL slider; value 0–100 fills from the right. */
export function Slider({ value, thumbRef }: { value: number; thumbRef?: (el: HTMLElement | null) => void }) {
  return (
    <span className={s.slider}>
      <span className={s.sliderFill} style={{ width: `${value}%` }} />
      <span ref={thumbRef} className={s.sliderThumb} style={{ right: `${value}%` }} />
    </span>
  )
}

const ICONS = [
  'M4 12h16M4 6h16M4 18h10',
  'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0',
  'M4 5h16v11H8l-4 4z',
  'M5 4h14v16H5zM9 8h6M9 12h6',
  'M3 20h18M6 20V9l6-5 6 5v11',
  'M12 3a9 9 0 1 0 9 9h-9z',
  'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
]

/** Chrome of the Hiro app: right-hand rail + breadcrumb bar. */
export function AppChrome({ crumb, active = 1, children }: { crumb: string; active?: number; children: React.ReactNode }) {
  return (
    <div className={s.app}>
      <aside className={s.rail}>
        <span className={s.railLogo}>H</span>
        {ICONS.map((d, i) => (
          <span key={i} className={`${s.railIcon} ${i === active ? s.railIconOn : ''}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
          </span>
        ))}
      </aside>
      <div className={s.appMain}>
        <div className={s.topbar}>
          <span className={s.crumb}><span>Hiro</span><span className={s.crumbSep}>‹</span><b>{crumb}</b></span>
          <span className={s.topIcons}><i /><i /><i /><span className={s.me}>ג</span></span>
        </div>
        <div className={s.canvas}>{children}</div>
      </div>
    </div>
  )
}
