import type { JobSummary, Taxonomy } from '@/lib/jobs/types'
import type { JobInput } from './types'

/** HTML from the API → the plain text the form edits (paragraphs separated by a blank line) */
export function htmlToText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|h3|h4)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * The job as the public board will show it, built from what the employer typed.
 * Same JobSummary shape the board renders, so the preview is the real card.
 */
export function previewSummary(input: Partial<JobInput>, orgName: string, tax: Taxonomy, descriptionText: string): JobSummary {
  const cluster = tax.clusters.find(c => c.categories.some(k => k.slug === input.categorySlug))
  const category = cluster?.categories.find(k => k.slug === input.categorySlug)
  const region = tax.regions.find(r => r.cities.some(c => c.slug === input.citySlug))
  const city = region?.cities.find(c => c.slug === input.citySlug)
  return {
    id: 'preview', slug: '#', jobNumber: '', title: input.title || 'כותרת המשרה',
    cluster: { slug: cluster?.slug ?? '', label: cluster?.label ?? '' },
    category: { slug: category?.slug ?? '', label: category?.label ?? '' },
    company: input.confidential
      ? { confidential: true, displayName: 'עסק באזור', publisher: { name: orgName, slug: '' } }
      : { confidential: false, id: '', slug: '', name: orgName },
    locations: city && region ? [{ citySlug: city.slug, cityName: city.label, regionSlug: region.slug, regionName: region.label }] : [],
    employmentType: input.employmentType ?? [],
    workModel: input.workModel ?? 'onsite',
    noExperience: input.noExperience,
    hoursDescription: input.hoursDescription || undefined,
    salary: input.publishSalary ? input.salary : undefined,
    teaser: descriptionText.replace(/\s+/g, ' ').trim().slice(0, 180) || 'כאן יופיעו שתי השורות הראשונות של תיאור התפקיד.',
    // Not published yet; a clock-based date here would differ between server and client render
    publishedAt: '', updatedAt: '', postedDateUnknown: true,
  }
}
