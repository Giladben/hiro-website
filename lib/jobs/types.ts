// Contract for the Hiro Public Jobs API (/api/public/v1). Source of truth:
// Nir's spec in Notion ("Public Jobs API"). Change both together.
//
// The site holds NO lists of its own: categories, clusters, industries, cities,
// regions, employment types, work models, seniorities, "suitable for" and
// marketing tags all come from GET /taxonomy. Enum-like fields are therefore
// plain strings whose labels are looked up in the taxonomy.

/** A catalog entry addressed by a stable slug (clusters, categories, industries, cities, regions). */
export type Labeled = { slug: string; label: string }

/** An enum entry from the taxonomy (employment types, work models, ...). */
export type EnumEntry = { value: string; label: string; count?: number }

export type Publisher = { name: string; logoUrl?: string; slug: string }

export type PublicCompany =
  | {
      confidential: true
      /** Derived in Hiro (industry + size + region), editable by the recruiter */
      displayName: string
      industry?: string
      sizeRange?: string
      /** The agency that published the job. Shown instead of the client, and used as hiringOrganization. */
      publisher: Publisher
    }
  | {
      confidential: false
      id: string
      slug: string
      name: string
      logoUrl?: string
      website?: string
      industry?: string
      sizeRange?: string
      about?: string
      hq?: string
    }

export type JobLocation = {
  citySlug: string
  cityName: string
  regionSlug: string
  regionName: string
  address?: string
  lat?: number
  lng?: number
}

export type Salary = {
  min?: number
  max?: number
  currency: 'ILS'
  period: 'hour' | 'month' | 'year'
  isEstimate?: boolean
}

export type JobSummary = {
  id: string
  slug: string
  /** "קוד לפרסום" in Hiro, not the internal job number */
  jobNumber: string
  title: string
  cluster: Labeled
  category: Labeled
  role?: Labeled
  industry?: Labeled
  company: PublicCompany
  locations: JobLocation[]
  employmentType: string[]
  workModel: string
  seniority?: string
  experienceYearsMin?: number
  noExperience?: boolean
  urgent?: boolean
  /** Marketing tags; labels in taxonomy.marketingTags */
  tags?: string[]
  suitableFor?: string[]
  salary?: Salary
  teaser: string
  skills?: { tagId: string; label: string }[]
  imageUrl?: string
  publishedAt: string
  updatedAt: string
  validThrough?: string
}

export type ApplyQuestion = {
  id: string
  type: 'yes_no' | 'text' | 'number' | 'select' | 'video'
  label: string
  required: boolean
  options?: string[]
}

export type ApplyConfig = {
  method: 'hiro' | 'external'
  requiresCv: boolean
  questions?: ApplyQuestion[]
  externalUrl?: string | null
}

export type JobDetail = JobSummary & {
  description: string // sanitized HTML subset
  responsibilities?: string[]
  requirements: string[]
  niceToHave?: string[]
  benefits?: string[]
  startDate?: 'immediate' | string
  recruiter?: { displayName: string; photoUrl?: string }
  apply: ApplyConfig
  status: 'open' | 'closed'
}

export type FacetValue = { value: string; label: string; count: number }
export type FacetKey = 'cluster' | 'category' | 'industry' | 'region' | 'city' | 'employmentType' | 'workModel' | 'seniority' | 'suitableFor'

export type JobsQuery = {
  q?: string
  cluster?: string[]
  category?: string[]
  industry?: string[]
  region?: string[]
  city?: string[]
  employmentType?: string[]
  workModel?: string[]
  seniority?: string[]
  suitableFor?: string[]
  noExperience?: boolean
  salaryMin?: number
  postedWithin?: '1d' | '3d' | '7d' | '30d'
  companySlug?: string
  sort?: 'relevance' | 'newest' | 'salary' | 'distance'
  page?: number
  limit?: number
}

export type JobsPage = {
  data: JobSummary[]
  total: number
  page: number
  limit: number
  totalPages: number
  facets?: Partial<Record<FacetKey, FacetValue[]>>
}

export type Taxonomy = {
  clusters: (Labeled & { count: number; categories: (Labeled & { count: number; synonyms?: string[] })[] })[]
  industries: (Labeled & { count: number })[]
  regions: (Labeled & { count: number; cities: (Labeled & { count: number; lat?: number; lng?: number })[] })[]
  employmentTypes: EnumEntry[]
  workModels: EnumEntry[]
  seniorities: EnumEntry[]
  suitableFor: EnumEntry[]
  marketingTags: EnumEntry[]
}

/** POST /applications error codes the site handles */
export type ApplyErrorCode = 'ALREADY_APPLIED' | 'JOB_CLOSED' | 'VALIDATION' | 'RATE_LIMITED'
