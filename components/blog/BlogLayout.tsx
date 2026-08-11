import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import type { BlogPost } from '@/lib/blog-posts'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function BlogLayout({ post }: { post: BlogPost }) {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section style={{ background: 'var(--bg-alt)', padding: '9rem 2rem 3.5rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <Link
              href="/blog"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text2)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.5rem' }}
            >
              → כל המאמרים
            </Link>
            <span
              style={{
                display: 'inline-block',
                background: 'var(--p50)',
                color: 'var(--p600)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                padding: '0.3rem 0.9rem',
                borderRadius: '100px',
                marginBottom: '1.25rem',
              }}
            >
              {post.category}
            </span>
            <h1 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem', lineHeight: 1.25 }}>
              {post.title}
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.25rem' }}>{post.description}</p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text2)', flexWrap: 'wrap' }}>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* Body */}
        <section style={{ background: 'var(--bg)', padding: '3.5rem 2rem 5rem' }}>
          <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: 1.85, marginBottom: '1.5rem', fontWeight: 500 }}>
              {post.intro}
            </p>

            {post.sections.map(s => (
              <article key={s.heading} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}>
                  {s.heading}
                </h2>
                {s.paragraphs?.map(p => (
                  <p key={p} style={{ fontSize: '0.98rem', color: 'var(--text2)', lineHeight: 1.85, marginBottom: '0.85rem' }}>
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {s.bullets.map(b => (
                      <li key={b} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.98rem', color: 'var(--text2)', lineHeight: 1.8 }}>
                        <span aria-hidden="true" style={{ color: 'var(--p600)', fontWeight: 800, flexShrink: 0, marginTop: 2 }}>·</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {/* CTA */}
            <div
              style={{
                background: 'var(--dark)',
                borderRadius: 20,
                padding: '2rem',
                marginTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <p style={{ fontSize: '0.95rem', color: 'rgba(240,238,255,0.75)', lineHeight: 1.7 }}>{post.ctaText}</p>
              <Link
                href={post.ctaHref}
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--p600)',
                  color: '#fff',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {post.ctaLabel} <span aria-hidden>←</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
