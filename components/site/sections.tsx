'use client'

import { useEffect, useState } from 'react'
import s from './site.module.css'

/* ───────── Criteria ticker ───────── */
export function CriteriaTicker({ label, items }: { label: string; items: string[] }) {
  return (
    <div className={s.ticker}>
      <p className={s.tickerLabel}>{label}</p>
      <div className={s.tickerMask}>
        <div className={s.tickerTrack}>
          <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>
          <ul aria-hidden="true">{items.map(i => <li key={i}>{i}</li>)}</ul>
        </div>
      </div>
    </div>
  )
}

/* ───────── Feature index ───────── */
export type IndexItem = { id?: string; name: string; one: string; body: string; aud?: string; href?: string; linkLabel?: string }

export function FeatureIndex({ items, defaultOpen = 0 }: { items: IndexItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  // Deep links like /candidates#feature-tracker open the matching row
  useEffect(() => {
    const i = items.findIndex(it => it.id && '#' + it.id === window.location.hash)
    if (i < 0) return
    const raf = requestAnimationFrame(() => setOpen(i))
    return () => cancelAnimationFrame(raf)
  }, [items])
  return (
    <ul className={s.index}>
      {items.map((it, i) => {
        const isOpen = open === i
        const id = `fi-${i}`
        return (
          <li key={it.name} id={it.id} style={{ scrollMarginTop: 96 }} className={`${s.indexItem} ${isOpen ? s.open : ''}`}>
            <h3 style={{ margin: 0, font: 'inherit' }}>
              <button
                type="button"
                className={s.indexBtn}
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className={s.indexNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.indexName}>{it.name}</span>
                <span className={s.indexOne}>{it.one}</span>
                <span className={s.indexAud}>{it.aud ?? ''}</span>
                <span className={s.indexPlus} aria-hidden="true" />
              </button>
            </h3>
            <div className={s.indexBody} id={id} role="region" aria-label={it.name} aria-hidden={!isOpen}>
              <div>
                <div className={s.indexBodyIn}>
                  <p>{it.body}</p>
                  {it.href && <a className="link-u" href={it.href} tabIndex={isOpen ? 0 : -1}>{it.linkLabel ?? 'לפרטים'} ←</a>}
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
