'use client'

import { createContext, useContext, useState, type RefObject } from 'react'
import { easeInOut, lerp, seg } from './anim'
import s from './film.module.css'

type Registry = {
  stage: RefObject<HTMLDivElement | null>
  els: Map<string, HTMLElement>
}

const TargetsCtx = createContext<Registry | null>(null)

export function useTargetRegistry(stage: RefObject<HTMLDivElement | null>) {
  const [els] = useState(() => new Map<string, HTMLElement>())
  return { stage, els }
}

export const TargetsProvider = TargetsCtx.Provider

/** Ref callback that registers an element as a cursor destination. */
export function useTarget() {
  const reg = useContext(TargetsCtx)
  return (key: string) => (el: HTMLElement | null) => {
    if (!reg) return
    if (el) reg.els.set(key, el)
    else reg.els.delete(key)
  }
}

export type CursorStop = { at: number; to: string; click?: boolean }

function centerOf(reg: Registry, key: string) {
  const el = reg.els.get(key)
  const stage = reg.stage.current
  if (!el || !stage) return null
  const a = el.getBoundingClientRect()
  const b = stage.getBoundingClientRect()
  const scale = b.width / stage.offsetWidth || 1
  return {
    x: (a.left + a.width / 2 - b.left) / scale,
    y: (a.top + a.height / 2 - b.top) / scale,
  }
}

/**
 * A scripted pointer. Moves between registered targets on a timeline of
 * scene progress `p` and shows a click ripple on stops marked `click`.
 */
export function Cursor({ p, path }: { p: number; path: CursorStop[] }) {
  const reg = useContext(TargetsCtx)
  if (!reg || path.length === 0) return null

  let x = 0, y = 0
  let i = path.length - 1
  for (let k = 0; k < path.length - 1; k++) {
    if (p < path[k + 1].at) { i = k; break }
  }
  const a = centerOf(reg, path[i].to)
  const nextStop = path[Math.min(i + 1, path.length - 1)]
  const b = centerOf(reg, nextStop.to) ?? a
  if (!a || !b) return null

  const t = i === path.length - 1 ? 0 : easeInOut(seg(p, path[i].at + (path[i + 1].at - path[i].at) * 0.35, path[i + 1].at))
  x = lerp(a.x, b.x, t)
  y = lerp(a.y, b.y, t)

  const fadeIn = seg(p, path[0].at - 0.04, path[0].at)
  const clickStop = path.find(st => st.click && p >= st.at && p < st.at + 0.06)
  const ripple = clickStop ? seg(p, clickStop.at, clickStop.at + 0.06) : 0
  const pressed = clickStop && ripple < 0.4

  return (
    <div className={s.cursor} style={{ transform: `translate(${x}px, ${y}px)`, opacity: fadeIn }} aria-hidden="true">
      {clickStop && (
        <span className={s.ripple} style={{ transform: `translate(-50%, -50%) scale(${0.4 + ripple * 1.4})`, opacity: 1 - ripple }} />
      )}
      <svg width="22" height="22" viewBox="0 0 24 24" style={{ transform: pressed ? 'scale(.86)' : 'none', transformOrigin: '4px 3px' }}>
        <path d="M4 3l6.5 17 2.4-7.1L20 10.5z" fill="#15131D" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
