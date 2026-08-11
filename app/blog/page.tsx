import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'בלוג — גיוס עובדים ובינה מלאכותית',
  description: 'מדריכים מעשיים למגייסים ולמועמדים: איך AI משנה את תהליך הגיוס, איך לכתוב קורות חיים שעוברים סינון, ואיך למצוא את המועמדים או המשרות הנכונים.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'בלוג Hiro — גיוס עובדים ובינה מלאכותית',
    description: 'מדריכים מעשיים למגייסים ולמועמדים על גיוס, AI וחיפוש עבודה.',
    url: '/blog',
    locale: 'he_IL',
    type: 'website',
  },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section style={{ background: 'var(--bg-alt)', padding: '9rem 2rem 3rem' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                background: 'var(--p50)',
                color: 'var(--p600)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.3rem 0.9rem',
                borderRadius: '100px',
                marginBottom: '1.25rem',
              }}
            >
              בלוג
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              גיוס עובדים ובינה מלאכותית
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text2)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              מדריכים מעשיים למגייסים ולמועמדים — בלי מילים גבוהות, עם דברים שאפשר ליישם מחר בבוקר.
            </p>
          </div>
        </section>

        {/* Post grid */}
        <section style={{ background: 'var(--bg)', padding: '3.5rem 2rem 6rem' }}>
          <div
            style={{
              maxWidth: 1000,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {sorted.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bento-card"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    alignSelf: 'flex-start',
                    background: post.audience === 'recruiters' ? 'rgba(83,74,183,0.1)' : 'rgba(167,139,250,0.12)',
                    color: post.audience === 'recruiters' ? 'var(--p600)' : '#8b5cf6',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.7rem',
                    borderRadius: '100px',
                  }}
                >
                  {post.category}
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text)', lineHeight: 1.35 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.7, flex: 1 }}>
                  {post.description}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text2)' }}>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
