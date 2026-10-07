import Link from 'next/link'
import { EMPLOYMENT_LABELS, WORK_MODEL_LABELS, companyName, formatSalary, isNew, locationLabel, timeAgo } from '@/lib/jobs/labels'
import type { JobSummary } from '@/lib/jobs/types'
import { SaveButton } from './SaveButton'
import s from './jobs.module.css'

export function CompanyMark({ job, size = 48 }: { job: Pick<JobSummary, 'company'>; size?: number }) {
  const c = job.company
  if (!c.confidential && c.logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- remote logos from the Hiro catalog
    return <img className={s.mark} src={c.logoUrl} alt="" width={size} height={size} style={{ width: size, height: size }} />
  }
  const name = c.confidential ? '' : c.name
  const letter = name.trim()[0] ?? ''
  return (
    <span className={`${s.mark} ${c.confidential ? s.markAnon : ''}`} style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {c.confidential
        ? <svg width={size * 0.42} height={size * 0.42} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 21V7l8-4 8 4v14M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01M8 13h.01M12 13h.01M16 13h.01" strokeLinecap="round" /></svg>
        : letter}
    </span>
  )
}

export function JobBadges({ job }: { job: JobSummary }) {
  const out: [string, string][] = []
  if (job.tags?.includes('urgent')) out.push(['דחוף', s.bUrgent])
  if (job.tags?.includes('hot')) out.push(['משרה חמה', s.bHot])
  if (isNew(job)) out.push(['חדשה', s.bNew])
  if (job.tags?.includes('no_experience') || job.experienceYearsMin === 0) out.push(['ללא ניסיון', s.bSoft])
  if (job.tags?.includes('students') || job.employmentType.includes('student')) out.push(['מתאים לסטודנטים', s.bSoft])
  if (!out.length) return null
  return <span className={s.badges}>{out.map(([t, c]) => <span key={t} className={`${s.badge} ${c}`}>{t}</span>)}</span>
}

export function JobCard({ job }: { job: JobSummary }) {
  const salary = formatSalary(job.salary)
  return (
    <article className={s.card}>
      <CompanyMark job={job} />
      <div className={s.cardMain}>
        <div className={s.cardTop}>
          <h3 className={s.cardTitle}>
            <Link href={`/jobs/${job.slug}`} className={s.cardLink}>{job.title}</Link>
          </h3>
          <JobBadges job={job} />
        </div>
        <p className={s.cardCompany}>
          <span>{companyName(job)}</span>
          <span aria-hidden="true">·</span>
          <span>{locationLabel(job)}</span>
        </p>
        <p className={s.cardTeaser}>{job.teaser}</p>
        <ul className={s.meta} aria-label="פרטי המשרה">
          {job.employmentType.slice(0, 2).map(t => <li key={t}>{EMPLOYMENT_LABELS[t]}</li>)}
          {job.workModel !== 'onsite' && <li>{WORK_MODEL_LABELS[job.workModel]}</li>}
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
