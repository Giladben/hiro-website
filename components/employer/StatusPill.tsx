import type { JobStatus } from '@/lib/employer/types'
import s from './employer.module.css'

const PILL: Record<JobStatus, [string, string]> = {
  live: ['באוויר', s.pLive],
  pending_review: ['ממתינה לאישור', s.pReview],
  draft: ['טיוטה', s.pDraft],
  closed: ['סגורה', s.pClosed],
  rejected: ['לא אושרה', s.pBad],
}

export function StatusPill({ status }: { status: JobStatus }) {
  const [label, cls] = PILL[status]
  return <span className={`${s.pill} ${cls}`}>{label}</span>
}
