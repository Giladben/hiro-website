// Contract for the Hiro Employer API (/api/employer/v1). Source of truth: the
// Notion task "פורטל מעסיקים באתר HirO — Employer API". Change both together.
//
// Like the public board, the portal holds no catalogs of its own: categories,
// cities, employment types and work models come from GET /taxonomy and are
// stored here as slugs / enum values.

import type { Salary } from '@/lib/jobs/types'

export type OrgStatus = 'pending_review' | 'approved' | 'blocked'

export type EmployerOrg = {
  id: string
  name: string
  contactName: string
  phone: string
  businessId?: string
  /** Where new-applicant notices and candidate replies go */
  notifyEmail: string
  notify: 'instant' | 'daily' | 'off'
  status: OrgStatus
  /** Jobs still waiting for manual approval before this employer is trusted */
  reviewQuota: number
}

export type EmployerUser = { id: string; email: string; name?: string }

export type JobStatus = 'draft' | 'pending_review' | 'live' | 'closed' | 'rejected'

export type EmployerQuestion = {
  id: string
  type: 'yes_no' | 'text' | 'choice'
  label: string
  required: boolean
  options?: string[]
}

/** The fields an employer edits. Same shape the public API serializes, so a live job needs no mapping. */
export type JobInput = {
  title: string
  categorySlug: string
  citySlug: string
  employmentType: string[]
  workModel: string
  hoursDescription?: string
  salary?: Salary
  publishSalary: boolean
  description: string
  requirements: string[]
  benefits: string[]
  noExperience: boolean
  experienceYearsMin?: number
  suitableFor: string[]
  requiresCv: boolean
  questions: EmployerQuestion[]
  confidential: boolean
}

export type EmployerJob = JobInput & {
  id: string
  /** Public slug once published; the job page is /jobs/{slug} */
  slug?: string
  jobNumber: string
  status: JobStatus
  rejectReason?: string
  createdAt: string
  publishedAt?: string
  validThrough?: string
  counts: { applications: number; new: number; views: number }
}

export type ApplicationStatus = 'new' | 'reviewed' | 'shortlisted' | 'rejected'

export type Application = {
  id: string
  jobId: string
  fullName: string
  phone: string
  email?: string
  city?: string
  submittedAt: string
  status: ApplicationStatus
  note?: string
  answers: { questionId: string; label: string; answer: string }[]
  /** Short-lived signed link (10 minutes) in the API; a demo page in preview */
  cv?: { fileName: string; url: string; mimeType: string }
  /** From the parsed CV, for the list view */
  headline?: string
  messages: Message[]
}

export type Message = {
  id: string
  direction: 'out' | 'in'
  subject: string
  body: string
  sentAt: string
  templateId?: string
}

export type MessageTemplate = { id: string; name: string; subject: string; body: string }

export type ForwardLog = { id: string; to: string; applicationIds: string[]; sentAt: string; note?: string }

/** Result of a mutation, for useActionState */
export type ActionResult = { ok: true; message?: string } | { ok: false; error: string; field?: string }
