import Link from 'next/link'
import { type Labels, formatSalary, isNew, isNoExperience, locationLabel, timeAgo } from '@/lib/jobs/labels'
import type { JobSummary } from '@/lib/jobs/types'
import { SaveButton } from './SaveButton'
import s from './jobs.module.css'

/** Employer logo: the client's, or for confidential jobs the publishing agency's. */
export function CompanyMark({ job, size = 48 }: { job: Pick<JobSummary, 'company'>; size?: number }) {
  const c = job.company
  const logo = c.confidential ? c.publisher.logoUrl : c.logoUrl
  const name = c.confidential ? c.publisher.name : c.name
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element -- remote logos from the Hiro catalog
    return <img className={s.mark} src={logo} alt="" width={size} height={size} style={{ width: size, height: size }} />
  }
  return (
    <span className={s.mark} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {name.trim()[0] ?? ''}
    </span>
  )
}

/** Employer line: "Client" or "Agency · confidential description". */
export function EmployerLine({ job }: { job: Pick<JobSummary, 'company'> }) {
  const c = job.company
  if (!c.confidential) return <span>{c.name}</span>
  return <span>{c.publisher.name}<span className={s.forClient}> · עבור {c.displayName}</span></span>
}

export function JobBadges({ job, lx }: { job: JobSummary; lx: Labels }) {
  const out: [string, string][] = []
  if (job.urgent) out.push([lx.tag('urgent'), s.bUrgent])
  for (const t of job.tags ?? []) if (!(t === 'urgent' && job.urgent)) out.push([lx.tag(t), t === 'hot' ? s.bHot : s.bSoft])
  if (isNew(job)) out.push(['חדשה', s.bNew])
  if (isNoExperience(job)) out.push(['ללא ניסיון', s.bSoft])
  if (!out.length) return null
  return <span className={s.badges}>{out.map(([t, c]) => <span key={t} className={`${s.badge} ${c}`}>{t}</span>)}</span>
}

export function JobCard({ job, lx }: { job: JobSummary; lx: Labels }) {
  const salary = formatSalary(job.salary)
  const where = locationLabel(job)
  return (
    <article className={s.card}>
      <CompanyMark job={job} />
      <div className={s.cardMain}>
        <div className={s.cardTop}>
          <h3 className={s.cardTitle}>
            <Link href={`/jobs/${job.slug}`} className={s.cardLink}>{job.title}</Link>
          </h3>
          <JobBadges job={job} lx={lx} />
        </div>
        <p className={s.cardCompany}>
          <EmployerLine job={job} />
          {where && <><span aria-hidden="true">·</span><span>{where}</span></>}
        </p>
        <p className={s.cardTeaser}>{job.teaser}</p>
        <ul className={s.meta} aria-label="פרטי המשרה">
          <li>{lx.category(job.category.slug)}</li>
          {job.employmentType.slice(0, 2).map(t => <li key={t}>{lx.employmentType(t)}</li>)}
          <li>{lx.workModel(job.workModel)}</li>
          {salary && <li className={s.metaSalary}>{salary}</li>}
        </ul>
      </div>
      <div className={s.cardSide}>
        <SaveButton id={job.id} title={job.title} className={s.save} />
        <time dateTime={job.publishedAt} className={s.posted}>{timeAgo(job.publishedAt)}</time>
      </div>
    </article>
  )
}
