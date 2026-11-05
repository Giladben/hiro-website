import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { toHref } from '@/lib/jobs/query'
import { jobsSource, listJobSlugs, listLandingQueries } from '@/lib/jobs/source'

const SITE_URL = 'https://hiro.co.il'

// Rebuilt hourly so new jobs appear, and a sitemap built during an API outage heals itself
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/why-hiro`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/recruiters`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/candidates`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/accessibility`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map(post => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: 'monthly',
    priority: 0.7,
    lastModified: post.updatedAt ?? post.publishedAt,
  }))

  // Real jobs only: preview fixtures must never reach a sitemap
  const jobRoutes: MetadataRoute.Sitemap = jobsSource === 'api'
    ? [
        { url: `${SITE_URL}/jobs`, changeFrequency: 'hourly', priority: 0.9 },
        // Landing pages (category / city / category × city) with 3+ open jobs.
        // Next writes <loc> as-is, so the & between params must be escaped here.
        ...(await listLandingQueries()).map(q => ({ url: `${SITE_URL}${toHref(q).replace(/&/g, '&amp;')}`, changeFrequency: 'daily' as const, priority: 0.8 })),
        ...(await listJobSlugs()).map(j => ({ url: `${SITE_URL}/jobs/${j.slug}`, lastModified: j.updatedAt, changeFrequency: 'daily' as const, priority: 0.8 })),
      ]
    : []

  return [...staticRoutes, ...blogRoutes, ...jobRoutes]
}
