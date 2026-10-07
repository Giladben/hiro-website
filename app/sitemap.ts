import type { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-posts'
import { jobsSource, listJobSlugs } from '@/lib/jobs/source'

const SITE_URL = 'https://hiro.co.il'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
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
        ...(await listJobSlugs()).map(j => ({ url: `${SITE_URL}/jobs/${j.slug}`, lastModified: j.updatedAt, changeFrequency: 'daily' as const, priority: 0.8 })),
      ]
    : []

  return [...staticRoutes, ...blogRoutes, ...jobRoutes]
}
