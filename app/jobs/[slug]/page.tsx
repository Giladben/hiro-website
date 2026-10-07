import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { ApplyForm } from '@/components/jobs/ApplyForm'
import { CompanyMark, EmployerLine, JobBadges, JobCard } from '@/components/jobs/JobCard'
import { SaveButton } from '@/components/jobs/SaveButton'
import { ShareButtons } from '@/components/jobs/ShareButtons'
import { ViewBeacon } from '@/components/jobs/ViewBeacon'
import { companyName, formatSalary, isNoExperience, labelsFrom, locationLabel, timeAgo } from '@/lib/jobs/labels'
import { toHref } from '@/lib/jobs/query'
import { plainText, sanitizeJobHtml } from '@/lib/jobs/sanitize'
import { getJob, getSimilar, getTaxonomy, jobsEnabled, jobsSource } from '@/lib/jobs/source'
import type { JobDetail } from '@/lib/jobs/types'
import s from '@/components/jobs/jobs.module.css'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!jobsEnabled) return {}
  const job = await getJob((await params).slug)
  if (!job) return {}
  const where = locationLabel(job)
  const title = `${job.title}${where ? ` ב${where}` : ''} | ${companyName(job)}`
  const description = plainText(`${job.teaser} ${job.description}`, 155)
  // The job's generated image is the share card for WhatsApp / Facebook
  const images = job.imageUrl ? [{ url: job.imageUrl, alt: job.title }] : undefined
  return {
    title,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: { index: job.status === 'open' && jobsSource === 'api', follow: true },
    openGraph: { title, description, url: `/jobs/${job.slug}`, type: 'website', locale: 'he_IL', ...(images && { images }) },
    twitter: { card: 'summary_large_image', title, description, ...(job.imageUrl && { images: [job.imageUrl] }) },
  }
}

// Mapping to schema.org's fixed vocabulary (an external standard, not a site catalog).
// Unknown values from the API are left out rather than guessed.
const SCHEMA_EMPLOYMENT: Record<string, string> = {
  full_time: 'FULL_TIME', part_time: 'PART_TIME', shifts: 'PER_DIEM', temporary: 'TEMPORARY',
  freelance: 'CONTRACTOR', internship: 'INTERN', student: 'PART_TIME',
}

function jobPostingLd(job: JobDetail) {
  const c = job.company
  // Confidential: the publishing agency is the hiring organization (Google drops jobs without one)
  const org = c.confidential
    ? { '@type': 'Organization', name: c.publisher.name, ...(c.publisher.logoUrl && { logo: c.publisher.logoUrl }) }
    : { '@type': 'Organization', name: c.name, ...(c.website && { sameAs: c.website }), ...(c.logoUrl && { logo: c.logoUrl }) }
  const employment = [...new Set(job.employmentType.map(t => SCHEMA_EMPLOYMENT[t]).filter(Boolean))]
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: sanitizeJobHtml(`${job.description}${list('תחומי אחריות', job.responsibilities)}${list('דרישות', job.requirements)}${list('יתרון', job.niceToHave)}${list('הטבות', job.benefits)}`),
    identifier: { '@type': 'PropertyValue', name: org.name, value: job.jobNumber },
    datePosted: job.publishedAt,
    ...(job.validThrough && { validThrough: job.validThrough }),
    ...(employment.length && { employmentType: employment }),
    hiringOrganization: org,
    directApply: job.apply.method === 'hiro',
    ...(job.imageUrl && { image: job.imageUrl }),
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
      '@type': 'MonetaryAmount', currency: 'ILS',
      value: { '@type': 'QuantitativeValue', unitText: { hour: 'HOUR', month: 'MONTH', year: 'YEAR' }[job.salary.period], ...(job.salary.min != null && { minValue: job.salary.min }), ...(job.salary.max != null && { maxValue: job.salary.max }) },
    }
  }
  if (isNoExperience(job)) ld.experienceRequirements = 'no requirements'
  else if (job.experienceYearsMin) ld.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.experienceYearsMin * 12 }
  return JSON.stringify(ld).replace(/</g, '\\u003c')
}

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const list = (title: string, items?: string[]) => (items?.length ? `<h3>${title}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '')

export default async function JobPage({ params }: Props) {
  if (!jobsEnabled) notFound()
  const job = await getJob((await params).slug)
  if (!job) notFound()
  const [similar, tax] = await Promise.all([getSimilar(job, 4), getTaxonomy()])
  const lx = labelsFrom(tax)
  const salary = formatSalary(job.salary)
  const closed = job.status === 'closed'
  const city = job.locations[0]
  const c = job.company

  const facts: [string, string][] = [
    ['מיקום', job.locations.length ? job.locations.map(l => l.cityName).join(', ') : lx.workModel(job.workModel)],
    ['היקף', job.employmentType.map(lx.employmentType).join(' · ')],
    ['מקום עבודה', lx.workModel(job.workModel)],
    ...(isNoExperience(job) ? [['ניסיון', 'ללא ניסיון'] as [string, string]]
      : job.experienceYearsMin ? [['ניסיון', `${job.experienceYearsMin}+ שנים`] as [string, string]]
        : job.seniority ? [['ניסיון', lx.seniority(job.seniority)] as [string, string]] : []),
    ...(salary ? [['שכר', salary + (job.salary?.isEstimate ? ' (הערכה)' : '')] as [string, string]] : []),
    ...(job.startDate ? [['תחילת עבודה', job.startDate === 'immediate' ? 'מיידית' : new Date(job.startDate).toLocaleDateString('he-IL')] as [string, string]] : []),
  ]

  return (
    <>
      {!closed && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobPostingLd(job) }} />}
      <a href="#apply" className="skip-link">דלג להגשת מועמדות</a>
      <AccessibilityWidget />
      <Navbar />
      <ViewBeacon jobId={job.id} />
      <main id="main-content" tabIndex={-1} className={s.page}>
        {jobsSource === 'fixtures' && <p className={s.previewBanner} role="note">תצוגה מקדימה: משרת דוגמה, עד לחיבור ה-API של Hiro.</p>}
        <div className="wrap">
          <nav aria-label="פירורי לחם" className={s.crumbs}>
            <ol>
              <li><Link href="/jobs">משרות</Link></li>
              <li><Link href={toHref({ cluster: [job.cluster.slug] })}>{job.cluster.label}</Link></li>
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
              <JobBadges job={job} lx={lx} />
              <h1 className={s.jobTitle}>{job.title}</h1>
              <p className={s.jobCompany}>
                <EmployerLine job={job} />
                <span aria-hidden="true"> · </span>
                <time dateTime={job.publishedAt}>{timeAgo(job.publishedAt)}</time>
                <span aria-hidden="true"> · </span>
                משרה <span dir="ltr">{job.jobNumber}</span>
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
              {!!job.suitableFor?.length && (
                <section aria-labelledby="suit-h">
                  <h2 id="suit-h">מתאים גם ל...</h2>
                  <ul className={s.benefits}>{job.suitableFor.map(v => <li key={v}>{lx.suitableFor(v)}</li>)}</ul>
                </section>
              )}
            </article>

            <aside className={s.jobAside}>
              {!closed && (
                <section id="apply" className={s.applyCard} aria-labelledby="apply-h" tabIndex={-1}>
                  <h2 id="apply-h">הגשת מועמדות</h2>
                  {job.recruiter && (
                    <p className={s.recruiter}>
                      {job.recruiter.photoUrl
                        // eslint-disable-next-line @next/next/no-img-element -- recruiter photo from Hiro
                        ? <img className={s.recruiterAv} src={job.recruiter.photoUrl} alt="" width={36} height={36} />
                        : <span className={s.recruiterAv} aria-hidden="true">{job.recruiter.displayName[0]}</span>}
                      <span>קורות החיים יגיעו ישירות ל<b>{job.recruiter.displayName}</b> מצוות הגיוס של המשרה</span>
                    </p>
                  )}
                  <ApplyForm jobId={job.id} jobTitle={job.title} apply={job.apply} />
                </section>
              )}

              <section className={s.companyCard} aria-labelledby="co-h">
                {c.confidential ? (
                  <>
                    <h2 id="co-h">על המשרה</h2>
                    <div className={s.publisher}>
                      <CompanyMark job={job} size={44} />
                      <div><b>{c.publisher.name}</b><span>מגייסת למשרה</span></div>
                    </div>
                    <p>המעסיק: {c.displayName}. שם החברה יימסר בשיחה עם צוות הגיוס.</p>
                    <dl className={s.coFacts}>
                      {c.industry && <div><dt>תעשייה</dt><dd>{c.industry}</dd></div>}
                      {c.sizeRange && <div><dt>עובדים</dt><dd dir="ltr">{c.sizeRange}</dd></div>}
                    </dl>
                  </>
                ) : (
                  <>
                    <h2 id="co-h">על {c.name}</h2>
                    {c.about && <p>{c.about}</p>}
                    <dl className={s.coFacts}>
                      {c.industry && <div><dt>תעשייה</dt><dd>{c.industry}</dd></div>}
                      {c.sizeRange && <div><dt>עובדים</dt><dd dir="ltr">{c.sizeRange}</dd></div>}
                      {c.hq && <div><dt>מטה</dt><dd>{c.hq}</dd></div>}
                    </dl>
                    <Link className="link-u" href={toHref({ companySlug: c.slug })}>כל המשרות של {c.name}</Link>
                  </>
                )}
              </section>
            </aside>
          </div>

          {!!similar.length && (
            <section className={s.similar} aria-labelledby="sim-h">
              <h2 id="sim-h">משרות דומות</h2>
              <ol className={s.list}>{similar.map(j => <li key={j.id}><JobCard job={j} lx={lx} /></li>)}</ol>
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
