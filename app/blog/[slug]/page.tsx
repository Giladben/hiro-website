import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { blogPosts, getBlogPost } from '@/lib/blog-posts'

const SITE_URL = 'https://hiro.co.il'

export function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      locale: 'he_IL',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/images/og-image.png'],
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: `${SITE_URL}/images/og-image.png`,
    inLanguage: 'he-IL',
    author: { '@type': 'Organization', name: 'HirO', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'HirO', logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/hiro-logo.png` } },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogLayout post={post} />
    </>
  )
}
