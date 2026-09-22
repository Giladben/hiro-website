import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'

export type LegalSection = {
  num: string
  title: string
  intro?: string
  bullets?: string[]
  paragraphs?: string[]
  subsections?: { title: string; body?: string }[]
  closing?: string
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {items.map(b => (
        <li key={b} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.75 }}>
          <span aria-hidden="true" style={{ color: 'var(--p600)', fontWeight: 800, flexShrink: 0, marginTop: 2 }}>·</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  )
}

export function LegalPage({
  badge,
  title,
  intro,
  sections,
  note,
}: {
  badge?: string
  title: string
  intro: string
  sections: LegalSection[]
  note?: string
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section style={{ background: 'var(--bg)', padding: '10rem 2rem 3.5rem', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {badge && (
              <span className="kicker">
                {badge}
              </span>
            )}
            <h1 className="display-l" style={{ margin: '0 0 1.25rem', maxWidth: '20ch' }}>
              {title}
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--text2)', lineHeight: 1.8 }}>{intro}</p>
          </div>
        </section>

        {/* Body */}
        <section style={{ background: 'var(--bg)', padding: '3.5rem 2rem 6rem' }}>
          <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.75rem' }}>
            {sections.map(s => (
              <article key={s.num} aria-labelledby={`legal-${s.num}`}>
                <h2
                  id={`legal-${s.num}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.85rem' }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 30, height: 30, borderRadius: '50%',
                      background: 'var(--p50)', color: 'var(--p600)',
                      fontSize: '0.85rem', fontWeight: 800, flexShrink: 0,
                    }}
                  >
                    {s.num}
                  </span>
                  {s.title}
                </h2>

                {s.intro && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8 }}>{s.intro}</p>
                )}

                {s.paragraphs?.map(p => (
                  <p key={p} style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '0.75rem' }}>
                    {p}
                  </p>
                ))}

                {s.subsections?.map(sub => (
                  <div key={sub.title} style={{ marginTop: '1.1rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem' }}>{sub.title}</h3>
                    {sub.body && (
                      <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8 }}>{sub.body}</p>
                    )}
                  </div>
                ))}

                {s.bullets && <Bullets items={s.bullets} />}

                {s.closing && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--text2)', lineHeight: 1.8, marginTop: '0.85rem' }}>
                    {s.closing}
                  </p>
                )}
              </article>
            ))}

            {note && (
              <div
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--cb)',
                  borderRadius: 14,
                  padding: '1.25rem 1.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--text2)',
                  lineHeight: 1.7,
                }}
              >
                {note}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
