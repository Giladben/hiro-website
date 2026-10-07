import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ApplyForm } from '@/components/jobs/ApplyForm'
import { CompanyMark, JobBadges, JobCard } from '@/components/jobs/JobCard'
import { SaveButton } from '@/components/jobs/SaveButton'
import { ShareButtons } from '@/components/jobs/ShareButtons'
import { EMPLOYMENT_LABELS, SENIORITY_LABELS, WORK_MODEL_LABELS, companyName, formatSalary, isolateRanges, locationLabel, timeAgo } from '@/lib/jobs/labels'
import { toHref } from '@/lib/jobs/query'
import { plainText, sanitizeJobHtml } from '@/lib/jobs/sanitize'
import { getJob, getSimilar, jobsEnabled, jobsSource } from '@/lib/jobs/source'
import type { JobDetail } from '@/lib/jobs/types'
import s from '@/components/jobs/jobs.module.css'

type Props = { params: Promise<{ slug: string }> }

const EDU: Record<NonNullable<JobDetail['education']>['level'], string> = {
  none: 'לא נדרשת השכלה', high_school: 'בגרות מלאה', certificate: 'תעודה מקצועית', bachelor: 'תואר ראשון', master: 'תואר שני', phd: 'דוקטורט',
}
const LANG: Record<string, string> = { en: 'אנגלית', he: 'עברית', ar: 'ערבית', ru: 'רוסית', fr: 'צרפתית', es: 'ספרדית', am: 'אמהרית' }
const LEVEL = { basic: 'בסיסית', good: 'טובה', high: 'גבוהה', native: 'שפת אם' } as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  const job = await getJob((await params).slug)
  if (!job) return {}
  const where = locationLabel(job)
  const title = job.seo?.title ?? `${job.title} ב${where} | ${companyName(job)}`
  const description = job.seo?.description ?? plainText(`${job.teaser} ${job.description}`, 155)
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: { index: job.status === 'open' && jobsSource === 'api', follow: true },
    openGraph: { title, description, url: `/jobs/${job.slug}`, type: 'website', locale: 'he_IL' },
  }
}

function jobPostingLd(job: JobDetail) {
  const employment: Record<string, string> = { full_time: 'FULL_TIME', part_time: 'PART_TIME', shifts: 'PER_DIEM', temporary: 'TEMPORARY', freelance: 'CONTRACTOR', internship: 'INTERN', student: 'PART_TIME' }
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: sanitizeJobHtml(
      `${job.description}${list('תחומי אחריות', job.responsibilities)}${list('דרישות', job.requirements)}${list('יתרון', job.niceToHave)}${list('הטבות', job.benefits)}`,
    ),
    identifier: { '@type': 'PropertyValue', name: 'Hiro', value: job.jobNumber },
    datePosted: job.publishedAt,
    ...(job.validThrough && { validThrough: job.validThrough }),
    employmentType: [...new Set(job.employmentType.map(t => employment[t]))],
    hiringOrganization: job.company.confidential
      ? { '@type': 'Organization', name: job.company.displayName }
      : { '@type': 'Organization', name: job.company.name, ...(job.company.website && { sameAs: job.company.website }), ...(job.company.logoUrl && { logo: job.company.logoUrl }) },
    directApply: job.apply.method === 'hiro',
  }
  if (job.workModel === 'remote') {
    ld.jobLocationType = 'TELECOMMUTE'
    ld.applicantLocationRequirements = { '@type': 'Country', name: 'Israel' }
  }
  if (job.locations.length) {
    ld.jobLocation = job.locations.map(l => ({
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: l.cityName, addressRegion: l.regionName, addressCountry: 'IL', ...(l.address && { streetAddress: l.address }) },
    }))
  }
  if (job.salary && (job.salary.min != null || job.salary.max != null)) {
    ld.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'ILS',
      value: { '@type': 'QuantitativeValue', unitText: { hour: 'HOUR', month: 'MONTH', year: 'YEAR' }[job.salary.period], ...(job.salary.min != null && { minValue: job.salary.min }), ...(job.salary.max != null && { maxValue: job.salary.max }) },
    }
  }
  if (job.experienceYearsMin != null) {
    ld.experienceRequirements = job.experienceYearsMin === 0 ? 'no requirements' : { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.experienceYearsMin * 12 }
  }
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

const list = (title: string, items?: string[]) => (items?.length ? `<h3>${title}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '')
const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default async function JobPage({ params }: Props) {
  if (!jobsEnabled) notFound()
  const job = await getJob((await params).slug)
  if (!job) notFound()
  const similar = await getSimilar(job, 4)
  const salary = formatSalary(job.salary)
  const closed = job.status === 'closed'
  const city = job.locations[0]

  const facts: [string, string][] = [
    ['מיקום', job.workModel === 'remote' && !job.locations.length ? 'עבודה מהבית' : job.locations.map(l => l.cityName).join(', ')],
    ['היקף', job.employmentType.map(t => EMPLOYMENT_LABELS[t]).join(' · ')],
    ['מקום עבודה', WORK_MODEL_LABELS[job.workModel]],
    ...(job.seniority ? [['ניסיון', job.experienceYearsMin === 0 ? 'ללא ניסיון' : job.experienceYearsMin ? `${job.experienceYearsMin}+ שנים` : SENIORITY_LABELS[job.seniority]] as [string, string]] : []),
    ...(salary ? [['שכר', salary + (job.salary?.isEstimate ? ' (הערכה)' : '')] as [string, string]] : []),
    ...(job.hoursDescription ? [['שעות', isolateRanges(job.hoursDescription)] as [string, string]] : []),
  ]

  const details: [string, string][] = [
    ...(job.education ? [['השכלה', EDU[job.education.level] + (job.education.field ? `, ${job.education.field}` : '')] as [string, string]] : []),
    ...(job.languages?.length ? [['שפות', job.languages.map(l => `${LANG[l.language] ?? l.language} (${LEVEL[l.level]})`).join(', ')] as [string, string]] : []),
    ...(job.drivingLicense?.required ? [['רישיון נהיגה', `נדרש${job.drivingLicense.type ? `, דרגה ${job.drivingLicense.type}` : ''}`] as [string, string]] : []),
    ...(job.requiresCar ? [['רכב', 'נדרש רכב'] as [string, string]] : []),
    ...(job.startDate ? [['תחילת עבודה', job.startDate === 'immediate' ? 'מיידית' : new Date(job.startDate).toLocaleDateString('he-IL')] as [string, string]] : []),
    ...(job.positionsCount && job.positionsCount > 1 ? [['מספר תקנים', String(job.positionsCount)] as [string, string]] : []),
  ]

  return (
    <>
      {!closed && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingLd(job) }} />}
      <a href="#apply" className="skip-link">דלג להגשת מועמדות</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={s.page}>
        {jobsSource === 'fixtures' && <p className={s.previewBanner} role="note">תצוגה מקדימה: משרת דוגמה, עד לחיבור ה-API של Hiro.</p>}
        <div className="wrap">
          <nav aria-label="פירורי לחם" className={s.crumbs}>
            <ol>
              <li><Link href="/jobs">משרות</Link></li>
              <li><Link href={toHref({ category: [job.category.slug] })}>{job.category.label}</Link></li>
              {city && <li><Link href={toHref({ category: [job.category.slug], city: [city.citySlug] })}>{city.cityName}</Link></li>}
            </ol>
          </nav>

          {closed && (
            <div className={s.closed} role="status">
              <b>המשרה הזו כבר לא פתוחה להגשות.</b>
              <span>אפשר לראות משרות דומות למטה, או <Link className="link-u" href={toHref({ category: [job.category.slug] })}>את כל המשרות בתחום {job.category.label}</Link>.</span>
            </div>
          )}

          <header className={s.jobHead}>
            <CompanyMark job={job} size={64} />
            <div className={s.jobHeadMain}>
              <JobBadges job={job} />
              <h1 className={s.jobTitle}>{job.title}</h1>
              <p className={s.jobCompany}>
                {job.company.confidential ? job.company.displayName : job.company.name}
                <span aria-hidden="true"> · </span>
                <time dateTime={job.publishedAt}>{timeAgo(job.publishedAt)}</time>
                <span aria-hidden="true"> · </span>
                משרה {job.jobNumber}
              </p>
            </div>
            <div className={s.jobActions}>
              {!closed && <a href="#apply" className={`btn btn-primary ${s.applyJump}`}>הגשת מועמדות</a>}
              <SaveButton id={job.id} title={job.title} className={s.iconBtn} />
              <ShareButtons title={job.title} path={`/jobs/${job.slug}`} />
            </div>
          </header>

          <dl className={s.facts}>
            {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>

          <div className={s.jobLayout}>
            <article className={s.jobBody}>
              <section aria-labelledby="about-h">
                <h2 id="about-h">על התפקיד</h2>
                <div className={s.rich} dangerouslySetInnerHTML={{ __html: sanitizeJobHtml(job.description) }} />
              </section>
              {!!job.responsibilities?.length && <Section id="resp" title="תחומי אחריות" items={job.responsibilities} />}
              <Section id="req" title="דרישות" items={job.requirements} />
              {!!job.niceToHave?.length && <Section id="nice" title="יתרון" items={job.niceToHave} />}
              {!!job.benefits?.length && <Section id="ben" title="מה מקבלים" items={job.benefits} chips />}
              {!!job.skills?.length && (
                <section aria-labelledby="skills-h">
                  <h2 id="skills-h">כישורים</h2>
                  <ul className={s.skillList}>{job.skills.map(k => <li key={k.tagId}><Link href={toHref({ q: k.label })}>{k.label}</Link></li>)}</ul>
                </section>
              )}
              {!!details.length && (
                <section aria-labelledby="det-h">
                  <h2 id="det-h">פרטים נוספים</h2>
                  <dl className={s.details}>{details.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
                </section>
              )}
            </article>

            <aside className={s.jobAside}>
              {!closed && (
                <section id="apply" className={s.applyCard} aria-labelledby="apply-h" tabIndex={-1}>
                  <h2 id="apply-h">הגשת מועמדות</h2>
                  {job.recruiter && (
                    <p className={s.recruiter}>
                      <span className={s.recruiterAv} aria-hidden="true">{job.recruiter.displayName[0]}</span>
                      <span>קורות החיים יגיעו ישירות ל<b>{job.recruiter.displayName}</b>{job.recruiter.title ? `, ${job.recruiter.title}` : ''}</span>
                    </p>
                  )}
                  <ApplyForm jobId={job.id} jobTitle={job.title} apply={job.apply} />
                </section>
              )}

              <section className={s.companyCard} aria-labelledby="co-h">
                <h2 id="co-h">{job.company.confidential ? 'על המעסיק' : `על ${job.company.name}`}</h2>
                {job.company.confidential ? (
                  <p>{job.company.displayName}. שם החברה יימסר בשלב השיחה עם המגייסת.</p>
                ) : (
                  <>
                    {job.company.about && <p>{job.company.about}</p>}
                    <dl className={s.coFacts}>
                      {job.company.industry && <div><dt>תחום</dt><dd>{job.company.industry}</dd></div>}
                      {job.company.sizeRange && <div><dt>עובדים</dt><dd dir="ltr">{job.company.sizeRange}</dd></div>}
                      {job.company.hq && <div><dt>מטה</dt><dd>{job.company.hq}</dd></div>}
                    </dl>
                    {job.company.website && <a className="link-u" href={job.company.website} target="_blank" rel="noopener nofollow">לאתר החברה</a>}
                  </>
                )}
              </section>
            </aside>
          </div>

          {!!similar.length && (
            <section className={s.similar} aria-labelledby="sim-h">
              <h2 id="sim-h">משרות דומות</h2>
              <ol className={s.list}>{similar.map(j => <li key={j.id}><JobCard job={j} /></li>)}</ol>
              <Link className="link-u" href={toHref({ category: [job.category.slug] })}>כל המשרות בתחום {job.category.label} ←</Link>
            </section>
          )}
        </div>

        {!closed && (
          <div className={s.stickyApply}>
            <span><b>{job.title}</b><em>{companyName(job)}</em></span>
            <a href="#apply" className="btn btn-primary">הגשה</a>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

function Section({ id, title, items, chips }: { id: string; title: string; items: string[]; chips?: boolean }) {
  return (
    <section aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{title}</h2>
      <ul className={chips ? s.benefits : s.bullets}>{items.map(i => <li key={i}>{i}</li>)}</ul>
    </section>
  )
}
