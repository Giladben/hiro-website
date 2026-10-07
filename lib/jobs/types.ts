// Contract for the Hiro Public Jobs API. Mirrors docs/HIRO_PUBLIC_JOBS_API.txt;
// change both together.

export type EmploymentType = 'full_time' | 'part_time' | 'shifts' | 'temporary' | 'freelance' | 'internship' | 'student'
export type WorkModel = 'onsite' | 'hybrid' | 'remote'
export type Seniority = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'executive'
export type SuitableFor = 'students' | 'soldiers' | 'pensioners' | 'disability' | 'olim'
export type JobTag = 'urgent' | 'hot' | 'new' | 'no_experience' | 'students' | 'relocation'
export type PostedWithin = '1d' | '3d' | '7d' | '30d'
export type SortKey = 'relevance' | 'newest' | 'salary' | 'distance'

export type Labeled = { slug: string; label: string }

export type PublicCompany =
  | { confidential: true; displayName: string; industry?: string; sizeRange?: string }
  | {
      confidential: false
      id: string
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
  jobNumber: string
  title: string
  normalizedRoleTagId?: string
  company: PublicCompany
  category: Labeled
  subcategory?: Labeled
  locations: JobLocation[]
  employmentType: EmploymentType[]
  workModel: WorkModel
  seniority?: Seniority
  experienceYearsMin?: number
  salary?: Salary
  teaser: string
  skills?: { tagId: string; label: string }[]
  tags?: JobTag[]
  publishedAt: string
  updatedAt: string
  validThrough?: string
}

export type ApplyQuestion = {
  id: string
  type: 'yes_no' | 'text' | 'number' | 'select'
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
  education?: { level: 'none' | 'high_school' | 'certificate' | 'bachelor' | 'master' | 'phd'; field?: string }
  languages?: { language: string; level: 'basic' | 'good' | 'high' | 'native' }[]
  drivingLicense?: { required: boolean; type?: 'B' | 'C1' | 'C' | 'E' }
  requiresCar?: boolean
  hoursDescription?: string
  startDate?: 'immediate' | string
  positionsCount?: number
  recruiter?: { displayName: string; title?: string; photoUrl?: string }
  apply: ApplyConfig
  seo?: { title?: string; description?: string }
  status: 'open' | 'closed'
}

export type FacetValue = { value: string; label: string; count: number }
export type FacetKey = 'category' | 'city' | 'region' | 'employmentType' | 'workModel' | 'seniority'

export type JobsQuery = {
  q?: string
  category?: string[]
  subcategory?: string[]
  city?: string[]
  region?: string[]
  employmentType?: EmploymentType[]
  workModel?: WorkModel[]
  seniority?: Seniority[]
  noExperience?: boolean
  suitableFor?: SuitableFor[]
  salaryMin?: number
  postedWithin?: PostedWithin
  sort?: SortKey
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
  categories: (Labeled & { count: number; subcategories?: (Labeled & { count: number })[] })[]
  regions: (Labeled & { count: number; cities: (Labeled & { count: number; lat?: number; lng?: number })[] })[]
}
