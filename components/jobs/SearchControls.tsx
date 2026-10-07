'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState, useTransition } from 'react'
import { POSTED_LABELS, SORT_LABELS, labelsFrom } from '@/lib/jobs/labels'
import { activeFilterCount, toHref } from '@/lib/jobs/query'
import type { FacetKey, FacetValue, JobsQuery, Taxonomy } from '@/lib/jobs/types'

type SortKey = NonNullable<JobsQuery['sort']>
type PostedWithin = NonNullable<JobsQuery['postedWithin']>
import s from './jobs.module.css'

/* Shared navigation: every control writes the URL; the server page re-renders. */
const NavCtx = createContext<{ pending: boolean; go: (q: JobsQuery) => void }>({ pending: false, go: () => {} })

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const go = (q: JobsQuery) => start(() => router.push(toHref({ ...q, page: undefined }), { scroll: false }))
  return (
    <NavCtx.Provider value={{ pending, go }}>
      <div className={s.searchRoot} data-pending={pending || undefined} aria-busy={pending}>{children}</div>
    </NavCtx.Provider>
  )
}

/* ───────── Search bar: what + where ───────── */
export function SearchBar({ query, taxonomy }: { query: JobsQuery; taxonomy: Taxonomy }) {
  const { go } = useContext(NavCtx)
  const [q, setQ] = useState(query.q ?? '')
  const where = query.city?.length === 1 && !query.region?.length ? `city:${query.city[0]}`
    : query.region?.length === 1 && !query.city?.length ? `region:${query.region[0]}` : ''
  const [loc, setLoc] = useState(where)

  // keep inputs in sync when the URL changes from elsewhere (chips, back button)
  const [prev, setPrev] = useState({ q: query.q, where })
  if (prev.q !== query.q || prev.where !== where) { setPrev({ q: query.q, where }); setQ(query.q ?? ''); setLoc(where) }

  return (
    <form
      role="search"
      className={s.search}
      onSubmit={e => {
        e.preventDefault()
        const [kind, slug] = loc.split(':')
        go({ ...query, q: q.trim() || undefined, city: kind === 'city' ? [slug] : kind === 'region' ? undefined : query.city, region: kind === 'region' ? [slug] : kind === 'city' ? undefined : query.region })
      }}
    >
      <label className={s.searchField}>
        <span className="sr-only">תפקיד, מילת מפתח או חברה</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" /></svg>
        <input type="search" name="q" value={q} onChange={e => setQ(e.target.value)} placeholder="תפקיד, מילת מפתח או חברה" autoComplete="off" enterKeyHint="search" />
      </label>
      <label className={s.searchField}>
        <span className="sr-only">איפה</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
        <select value={loc} onChange={e => setLoc(e.target.value)}>
          <option value="">כל הארץ</option>
          {taxonomy.regions.map(r => (
            <optgroup key={r.slug} label={r.label}>
              <option value={`region:${r.slug}`}>כל אזור {r.label}</option>
              {r.cities.filter(c => c.count > 0).map(c => <option key={c.slug} value={`city:${c.slug}`}>{c.label}</option>)}
            </optgroup>
          ))}
        </select>
      </label>
      <button type="submit" className={`btn btn-primary ${s.searchBtn}`}>חיפוש</button>
    </form>
  )
}

/* ───────── Quick chips ───────── */
export function QuickChips({ query, taxonomy }: { query: JobsQuery; taxonomy: Taxonomy }) {
  const { go } = useContext(NavCtx)
  // The busiest clusters from the taxonomy, plus two site-level shortcuts
  const top = [...taxonomy.clusters].filter(c => c.count > 0).sort((a, b) => b.count - a.count).slice(0, 6)
  const chips: { label: string; on: boolean; apply: (q: JobsQuery) => JobsQuery }[] = [
    ...top.map(c => ({ label: c.label, on: !!query.cluster?.includes(c.slug), apply: (q: JobsQuery) => ({ ...q, cluster: toggle(q.cluster, c.slug) }) })),
    { label: 'ללא ניסיון', on: !!query.noExperience, apply: q => ({ ...q, noExperience: q.noExperience ? undefined : true }) },
    { label: 'פורסמו היום', on: query.postedWithin === '1d', apply: q => ({ ...q, postedWithin: q.postedWithin === '1d' ? undefined : '1d' }) },
  ]
  return (
    <div className={s.quick} role="group" aria-label="סינון מהיר">
      {chips.map(c => (
        <button key={c.label} type="button" aria-pressed={c.on} className={s.quickChip} onClick={() => go(c.apply(query))}>{c.label}</button>
      ))}
    </div>
  )
}

function toggle<T>(list: T[] | undefined, v: T): T[] | undefined {
  const next = list?.includes(v) ? list.filter(x => x !== v) : [...(list ?? []), v]
  return next.length ? next : undefined
}

/* ───────── Sort ───────── */
export function SortSelect({ query }: { query: JobsQuery }) {
  const { go } = useContext(NavCtx)
  const value = query.sort ?? (query.q ? 'relevance' : 'newest')
  const options: SortKey[] = query.q ? ['relevance', 'newest', 'salary'] : ['newest', 'salary']
  return (
    <label className={s.sort}>
      <span>מיון:</span>
      <select value={value} onChange={e => go({ ...query, sort: e.target.value as SortKey })}>
        {options.map(o => <option key={o} value={o}>{SORT_LABELS[o]}</option>)}
      </select>
    </label>
  )
}

/* ───────── Filters (sidebar / drawer) ───────── */
// Group titles are site copy; the values inside each group come from the API facets.
const GROUPS: { key: FacetKey; title: string; initial: number }[] = [
  { key: 'cluster', title: 'תחום', initial: 8 },
  { key: 'category', title: 'תחום משרה', initial: 6 },
  { key: 'industry', title: 'תעשייה', initial: 6 },
  { key: 'region', title: 'אזור', initial: 8 },
  { key: 'city', title: 'עיר', initial: 6 },
  { key: 'employmentType', title: 'היקף משרה', initial: 6 },
  { key: 'workModel', title: 'מקום עבודה', initial: 4 },
  { key: 'seniority', title: 'ניסיון', initial: 6 },
  { key: 'suitableFor', title: 'מתאים ל...', initial: 6 },
]

export function Filters({ query, facets, total, taxonomy }: { query: JobsQuery; facets: Partial<Record<FacetKey, FacetValue[]>>; total: number; taxonomy: Taxonomy }) {
  const lx = labelsFrom(taxonomy)
  const { go, pending } = useContext(NavCtx)
  const [open, setOpen] = useState(false)
  const count = activeFilterCount(query)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const toggleValue = (key: FacetKey, value: string) => {
    const cur = (query[key] as string[] | undefined) ?? []
    const next = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value]
    go({ ...query, [key]: next.length ? next : undefined })
  }

  const body = (
    <>
      <div className={s.fGroup}>
        <label className={s.switch}>
          <input type="checkbox" checked={!!query.noExperience} onChange={() => go({ ...query, noExperience: query.noExperience ? undefined : true })} />
          <span>ללא ניסיון בלבד</span>
        </label>
      </div>
      {GROUPS.map(g => {
        const values = facets[g.key] ?? []
        const selected = (query[g.key] as string[] | undefined) ?? []
        if (!values.length && !selected.length) return null
        return <FacetGroup key={g.key} title={g.title} values={values} selected={selected} initial={g.initial} label={lx[g.key]} onToggle={v => toggleValue(g.key, v)} />
      })}
      <fieldset className={s.fGroup}>
        <legend>תאריך פרסום</legend>
        {(['1d', '3d', '7d', '30d'] as PostedWithin[]).map(p => (
          <label key={p} className={s.opt}>
            <input type="radio" name="postedWithin" checked={query.postedWithin === p} onChange={() => go({ ...query, postedWithin: p })} />
            <span>{POSTED_LABELS[p]}</span>
          </label>
        ))}
        {query.postedWithin && <button type="button" className={s.linkBtn} onClick={() => go({ ...query, postedWithin: undefined })}>כל התאריכים</button>}
      </fieldset>
    </>
  )

  return (
    <>
      <button type="button" className={s.filtersBtn} onClick={() => setOpen(true)} aria-expanded={open} aria-controls="jobs-filters">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" /></svg>
        סינון{count ? ` (${count})` : ''}
      </button>
      <aside id="jobs-filters" className={`${s.filters} ${open ? s.filtersOpen : ''}`} aria-label="סינון משרות">
        <div className={s.drawerHead}>
          <b>סינון</b>
          <button type="button" className={s.linkBtn} onClick={() => setOpen(false)}>סגירה</button>
        </div>
        <div className={s.filtersBody}>{body}</div>
        <div className={s.drawerFoot}>
          {count > 0 && <button type="button" className="btn btn-ghost" onClick={() => go({ q: query.q, sort: query.sort })}>נקה הכל</button>}
          <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>{pending ? 'מעדכן…' : `הצג ${total} משרות`}</button>
        </div>
      </aside>
      {open && <div className={s.scrim} onClick={() => setOpen(false)} aria-hidden="true" />}
    </>
  )
}

function FacetGroup({ title, values, selected, initial, label, onToggle }: { title: string; values: FacetValue[]; selected: string[]; initial: number; label: (v: string) => string; onToggle: (v: string) => void }) {
  const [more, setMore] = useState(false)
  // selected values always stay visible, even if they have 0 results now
  const list = [...values]
  for (const v of selected) if (!list.some(x => x.value === v)) list.push({ value: v, label: label(v), count: 0 })
  const shown = more ? list : list.slice(0, initial)
  return (
    <fieldset className={s.fGroup}>
      <legend>{title}</legend>
      {shown.map(v => (
        <label key={v.value} className={s.opt}>
          <input type="checkbox" checked={selected.includes(v.value)} onChange={() => onToggle(v.value)} />
          <span>{v.label}</span>
          <em>{v.count}</em>
        </label>
      ))}
      {list.length > initial && (
        <button type="button" className={s.linkBtn} onClick={() => setMore(m => !m)} aria-expanded={more}>
          {more ? 'פחות' : `עוד ${list.length - initial}`}
        </button>
      )}
    </fieldset>
  )
}

export function ResultsBody({ children }: { children: React.ReactNode }) {
  const { pending } = useContext(NavCtx)
  return <div className={s.results} style={{ opacity: pending ? 0.55 : 1 }}>{children}</div>
}
