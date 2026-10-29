'use client'

import { useSyncExternalStore } from 'react'

const KEY = 'hiro:saved-jobs'
const listeners = new Set<() => void>()

function read(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}
let cache: string[] | null = null
const snapshot = () => (cache ??= read())
const serverSnapshot: string[] = []

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { cache = null; cb() } }
  window.addEventListener('storage', onStorage)
  return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage) }
}

function toggle(id: string) {
  const cur = snapshot()
  const next = cur.includes(id) ? cur.filter(x => x !== id) : [id, ...cur].slice(0, 200)
  cache = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: keep in memory */ }
  listeners.forEach(l => l())
}

export function useSavedJobs() {
  return useSyncExternalStore(subscribe, snapshot, () => serverSnapshot)
}

export function SaveButton({ id, title, className }: { id: string; title: string; className?: string }) {
  const saved = useSavedJobs().includes(id)
  return (
    <button
      type="button"
      className={className}
      aria-pressed={saved}
      aria-label={saved ? `הסר את "${title}" מהמשרות השמורות` : `שמור את "${title}"`}
      onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(id) }}
      data-saved={saved || undefined}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
