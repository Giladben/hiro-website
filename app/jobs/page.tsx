import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { JobCard } from '@/components/jobs/JobCard'
import { Filters, QuickChips, ResultsBody, SearchBar, SearchProvider, SortSelect } from '@/components/jobs/SearchControls'
import { EMPLOYMENT_LABELS, POSTED_LABELS, SENIORITY_LABELS, SUITABLE_LABELS, WORK_MODEL_LABELS } from '@/lib/jobs/labels'
import { parseQuery, toHref } from '@/lib/jobs/query'
import { getTaxonomy, jobsEnabled, jobsSource, listJobs } from '@/lib/jobs/source'
import type { JobsQuery, Taxonomy } from '@/lib/jobs/types'
import s from '@/components/jobs/jobs.module.css'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function headline(q: JobsQuery, tax: Taxonomy) {
  const cat = q.category?.length === 1 ? tax.categories.find(c => c.slug === q.category![0])?.label : undefined
  const city = q.city?.length === 1 ? tax.regions.flatMap(r => r.cities).find(c => c.slug === q.city![0])?.label : undefined
  const region = !city && q.region?.length === 1 ? tax.regions.find(r => r.slug === q.region![0])?.label : undefined
  const where = city ? `ב${city}` : region ? `באזור ${region}` : ''
  if (q.q) return `משרות ${q.q}${where ? ` ${where}` : ''}`
  if (cat) return `משרות ${cat}${where ? ` ${where}` : ''}`
  if (where) return `משרות ${where}`
  return 'משרות פתוחות'
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  const q = parseQuery(await searchParams)
  const tax = await getTaxonomy()
  const title = headline(q, tax)
  // Only the clean category/city combinations are indexable; free text and multi-filters are not.
  const indexable = !q.q && !q.page && (q.category?.length ?? 0) <= 1 && (q.city?.length ?? 0) <= 1 && (q.region?.length ?? 0) <= 1
    && !q.employmentType && !q.workModel && !q.seniority && !q.suitableFor && !q.noExperience && !q.salaryMin && !q.postedWithin && !q.sort
  return {
    title,
    description: `${title} ב-Hiro: חיפוש לפי תחום, עיר והיקף משרה, והגשת מועמדות ישירה למגייסים.`,
    alternates: { canonical: toHref({ category: q.category, city: q.city, region: q.region }) },
    robots: { index: indexable && jobsSource === 'api', follow: true },
  }
}

export default async function JobsPage({ searchParams }: Props) {
  if (!jobsEnabled) notFound()
  const q = parseQuery(await searchParams)
  const [res, tax] = await Promise.all([listJobs(q), getTaxonomy()])
  const from = res.total ? (res.page - 1) * res.limit + 1 : 0
  const to = Math.min(res.page * res.limit, res.total)

  return (
    <>
      <a href="#results" className="skip-link">דלג לתוצאות</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={s.page}>
        {jobsSource === 'fixtures' && (
          <p className={s.previewBanner} role="note">תצוגה מקדימה: המשרות בעמוד הזה הן נתוני דוגמה, עד לחיבור ה-API של Hiro.</p>
        )}
        <SearchProvider>
          <header className={s.head}>
            <div className="wrap">
              <p className="kicker">משרות</p>
              <h1 className={s.h1}>{headline(q, tax)}</h1>
              <SearchBar query={q} taxonomy={tax} />
              <QuickChips query={q} />
            </div>
          </header>

          <div className={`wrap ${s.layout}`}>
            <Filters query={q} facets={res.facets ?? {}} total={res.total} />

            <section id="results" className={s.resultsCol} aria-labelledby="results-h" tabIndex={-1}>
              <div className={s.resultsBar}>
                <h2 id="results-h" className={s.count} aria-live="polite">
                  {res.total ? <><b>{res.total.toLocaleString('he-IL')}</b> משרות{res.totalPages > 1 && <span> · מציג {`⁦${from}–${to}⁩`}</span>}</> : 'לא נמצאו משרות'}
                </h2>
                <SortSelect query={q} />
              </div>

              <ActiveChips q={q} tax={tax} />

              <ResultsBody>
                {res.data.length ? (
                  <ol className={s.list}>
                    {res.data.map(j => <li key={j.id}><JobCard job={j} /></li>)}
                  </ol>
                ) : (
                  <div className={s.empty}>
                    <b>אין כרגע משרות שמתאימות לכל הסינונים.</b>
                    <p>אפשר להסיר חלק מהסינונים, או לפתוח פרופיל ב-Hiro ולקבל התראה כשתעלה משרה מתאימה.</p>
                    <div className={s.emptyCtas}>
                      <Link href="/jobs" className="btn btn-ghost">ניקוי החיפוש</Link>
                      <a href="https://app.hiro.co.il" className="btn btn-primary">פתיחת פרופיל בחינם</a>
                    </div>
                  </div>
                )}
              </ResultsBody>

              {res.totalPages > 1 && <Pagination q={q} page={res.page} totalPages={res.totalPages} />}

              <aside className={s.profileCta}>
                <div>
                  <b>לא מוצאים? שהמשרות ימצאו אתכם.</b>
                  <p>פרופיל ב-Hiro נראה למגייסים שמחפשים בדיוק אתכם, ומרכז את כל ההגשות שלכם במקום אחד.</p>
                </div>
                <a href="https://app.hiro.co.il" className="btn btn-primary">פתיחת פרופיל בחינם <span className="arr" aria-hidden="true">←</span></a>
              </aside>
            </section>
          </div>
        </SearchProvider>
      </main>
      <Footer />
    </>
  )
}

function ActiveChips({ q, tax }: { q: JobsQuery; tax: Taxonomy }) {
  const cities = tax.regions.flatMap(r => r.cities)
  const chips: { label: string; next: JobsQuery }[] = []
  const drop = <K extends keyof JobsQuery>(k: K, v: unknown) => {
    const cur = q[k] as unknown[] | undefined
    const rest = cur?.filter(x => x !== v)
    return { ...q, [k]: rest?.length ? rest : undefined, page: undefined } as JobsQuery
  }
  if (q.q) chips.push({ label: `"${q.q}"`, next: { ...q, q: undefined, page: undefined } })
  q.category?.forEach(v => chips.push({ label: tax.categories.find(c => c.slug === v)?.label ?? v, next: drop('category', v) }))
  q.region?.forEach(v => chips.push({ label: tax.regions.find(r => r.slug === v)?.label ?? v, next: drop('region', v) }))
  q.city?.forEach(v => chips.push({ label: cities.find(c => c.slug === v)?.label ?? v, next: drop('city', v) }))
  q.employmentType?.forEach(v => chips.push({ label: EMPLOYMENT_LABELS[v], next: drop('employmentType', v) }))
  q.workModel?.forEach(v => chips.push({ label: WORK_MODEL_LABELS[v], next: drop('workModel', v) }))
  q.seniority?.forEach(v => chips.push({ label: SENIORITY_LABELS[v], next: drop('seniority', v) }))
  q.suitableFor?.forEach(v => chips.push({ label: SUITABLE_LABELS[v], next: drop('suitableFor', v) }))
  if (q.noExperience) chips.push({ label: 'ללא ניסיון', next: { ...q, noExperience: undefined, page: undefined } })
  if (q.postedWithin) chips.push({ label: POSTED_LABELS[q.postedWithin], next: { ...q, postedWithin: undefined, page: undefined } })
  if (!chips.length) return null
  return (
    <ul className={s.chips} aria-label="סינונים פעילים">
      {chips.map(c => (
        <li key={c.label}>
          <Link href={toHref(c.next)} scroll={false} className={s.chip} aria-label={`הסרת הסינון ${c.label}`}>
            {c.label}<span aria-hidden="true">×</span>
          </Link>
        </li>
      ))}
      {chips.length > 1 && <li><Link href="/jobs" scroll={false} className={s.clearAll}>ניקוי הכל</Link></li>}
    </ul>
  )
}

function Pagination({ q, page, totalPages }: { q: JobsQuery; page: number; totalPages: number }) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages))
  const list = [...pages].sort((a, b) => a - b)
  return (
    <nav className={s.pager} aria-label="עמודי תוצאות">
      {page > 1 && <Link href={toHref({ ...q, page: page - 1 })} rel="prev">→ הקודם</Link>}
      {list.map((p, i) => (
        <span key={p} className={s.pagerItem}>
          {i > 0 && p - list[i - 1] > 1 && <span aria-hidden="true">…</span>}
          {p === page ? <span aria-current="page" className={s.pagerOn}>{p}</span> : <Link href={toHref({ ...q, page: p })}>{p}</Link>}
        </span>
      ))}
      {page < totalPages && <Link href={toHref({ ...q, page: page + 1 })} rel="next">הבא ←</Link>}
    </nav>
  )
}
