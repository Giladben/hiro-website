import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { JobCard } from '@/components/jobs/JobCard'
import { Filters, QuickChips, ResultsBody, SearchBar, SearchProvider, SortSelect } from '@/components/jobs/SearchControls'
import { type Labels, POSTED_LABELS, labelsFrom } from '@/lib/jobs/labels'
import { parseQuery, toHref } from '@/lib/jobs/query'
import { getTaxonomy, jobsEnabled, jobsSource, listJobs } from '@/lib/jobs/source'
import type { FacetKey, JobsQuery } from '@/lib/jobs/types'
import s from '@/components/jobs/jobs.module.css'

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

function headline(q: JobsQuery, lx: Labels) {
  const what = q.category?.length === 1 ? lx.category(q.category[0])
    : q.cluster?.length === 1 ? lx.cluster(q.cluster[0])
      : q.industry?.length === 1 ? lx.industry(q.industry[0]) : undefined
  const where = q.city?.length === 1 ? `ב${lx.city(q.city[0])}` : q.region?.length === 1 ? `באזור ${lx.region(q.region[0])}` : ''
  const head = q.q ? `משרות ${q.q}` : what ? `משרות ${what}` : where ? 'משרות' : 'משרות פתוחות'
  return where ? `${head} ${where}` : head
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  const q = parseQuery(await searchParams)
  const lx = labelsFrom(await getTaxonomy())
  const title = headline(q, lx)
  const single = (l?: string[]) => (l?.length ?? 0) <= 1
  // Only clean single cluster/category/industry × city/region pages are indexable
  const indexable = !q.q && !q.page && single(q.cluster) && single(q.category) && single(q.industry) && single(q.city) && single(q.region)
    && !q.employmentType && !q.workModel && !q.seniority && !q.suitableFor && !q.noExperience && !q.salaryMin && !q.postedWithin && !q.sort
  return {
    title,
    description: `${title} ב-Hiro: חיפוש לפי תחום, עיר והיקף משרה, והגשת מועמדות ישירה למגייסים.`,
    alternates: { canonical: toHref({ cluster: q.cluster, category: q.category, industry: q.industry, city: q.city, region: q.region }) },
    robots: { index: indexable && jobsSource === 'api', follow: true },
  }
}

export default async function JobsPage({ searchParams }: Props) {
  if (!jobsEnabled) notFound()
  const q = parseQuery(await searchParams)
  const [res, tax] = await Promise.all([listJobs(q), getTaxonomy()])
  const lx = labelsFrom(tax)
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
              <h1 className={s.h1}>{headline(q, lx)}</h1>
              <SearchBar query={q} taxonomy={tax} />
              <QuickChips query={q} taxonomy={tax} />
            </div>
          </header>

          <div className={`wrap ${s.layout}`}>
            <Filters query={q} facets={res.facets ?? {}} total={res.total} taxonomy={tax} />

            <section id="results" className={s.resultsCol} aria-labelledby="results-h" tabIndex={-1}>
              <div className={s.resultsBar}>
                <h2 id="results-h" className={s.count} aria-live="polite">
                  {res.total ? <><b>{res.total.toLocaleString('he-IL')}</b> משרות{res.totalPages > 1 && <span> · מציג {`⁦${from}–${to}⁩`}</span>}</> : 'לא נמצאו משרות'}
                </h2>
                <SortSelect query={q} />
              </div>

              <ActiveChips q={q} lx={lx} />

              <ResultsBody>
                {res.data.length ? (
                  <ol className={s.list}>
                    {res.data.map(j => <li key={j.id}><JobCard job={j} lx={lx} /></li>)}
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

function ActiveChips({ q, lx }: { q: JobsQuery; lx: Labels }) {
  const chips: { label: string; next: JobsQuery }[] = []
  const lists: FacetKey[] = ['cluster', 'category', 'industry', 'region', 'city', 'employmentType', 'workModel', 'seniority', 'suitableFor']
  if (q.q) chips.push({ label: `"${q.q}"`, next: { ...q, q: undefined, page: undefined } })
  for (const k of lists) {
    for (const v of q[k] ?? []) {
      const rest = q[k]!.filter(x => x !== v)
      chips.push({ label: lx[k](v), next: { ...q, [k]: rest.length ? rest : undefined, page: undefined } })
    }
  }
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
  const pages = [...new Set([1, totalPages, page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages))].sort((a, b) => a - b)
  return (
    <nav className={s.pager} aria-label="עמודי תוצאות">
      {page > 1 && <Link href={toHref({ ...q, page: page - 1 })} rel="prev">→ הקודם</Link>}
      {pages.map((p, i) => (
        <span key={p} className={s.pagerItem}>
          {i > 0 && p - pages[i - 1] > 1 && <span aria-hidden="true">…</span>}
          {p === page ? <span aria-current="page" className={s.pagerOn}>{p}</span> : <Link href={toHref({ ...q, page: p })}>{p}</Link>}
        </span>
      ))}
      {page < totalPages && <Link href={toHref({ ...q, page: page + 1 })} rel="next">הבא ←</Link>}
    </nav>
  )
}
