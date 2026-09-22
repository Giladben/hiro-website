'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'

const CONTACT_EMAIL = 'demo@hiro.co.il'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-alt)',
  border: '1px solid var(--cb)',
  borderRadius: 10,
  padding: '0.75rem 1rem',
  fontSize: '0.95rem',
  color: 'var(--text)',
  fontFamily: 'inherit',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 700,
  color: 'var(--text)',
  marginBottom: '0.4rem',
}

export function ContactPageClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`פנייה חדשה מהאתר — ${name || 'ללא שם'}`)
    const bodyLines = [
      `שם: ${name}`,
      `דוא"ל: ${email}`,
      phone ? `טלפון: ${phone}` : null,
      '',
      'הודעה:',
      message,
    ].filter(Boolean)
    const body = encodeURIComponent(bodyLines.join('\n'))
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {/* Header */}
        <section style={{ background: 'var(--bg)', padding: '10rem 2rem 3.5rem', borderBottom: '1px solid var(--line)' }}>
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            <span className="kicker">
              צרו קשר
            </span>
            <h1 className="display-l" style={{ margin: '0 0 1.25rem', maxWidth: '20ch' }}>
              נשמח לשמוע מכם
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text2)', lineHeight: 1.8, maxWidth: 560, margin: '0 auto' }}>
              שאלות על הפלטפורמה, בקשה לדמו, או כל דבר אחר — מלאו את הטופס ונחזור אליכם, או כתבו לנו ישירות ל-
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--p600)', fontWeight: 700, textDecoration: 'none' }}>
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>

        {/* Form */}
        <section style={{ background: 'var(--bg)', padding: '3.5rem 2rem 6rem' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <form
              onSubmit={handleSubmit}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--cb)',
                borderRadius: 20,
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div>
                <label htmlFor="contact-name" style={labelStyle}>שם מלא</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="השם שלך"
                />
              </div>

              <div>
                <label htmlFor="contact-email" style={labelStyle}>דוא&quot;ל</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-phone" style={labelStyle}>טלפון (אופציונלי)</label>
                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={inputStyle}
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label htmlFor="contact-message" style={labelStyle}>הודעה</label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={5}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="איך נוכל לעזור?"
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'var(--p600)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: 10,
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--p400)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--p600)')}
              >
                שליחה
              </button>

              <p role="status" aria-live="polite" style={{ fontSize: '0.85rem', color: 'var(--text2)', textAlign: 'center', minHeight: '1.2rem' }}>
                {sent && 'נפתח עבורך חלון דוא"ל עם הפנייה — אם הוא לא נפתח, אפשר לכתוב ישירות ל-' + CONTACT_EMAIL}
              </p>
            </form>

            <p style={{ fontSize: '0.8rem', color: 'var(--text2)', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.6 }}>
              הטופס פותח חלון דוא&quot;ל מוכן מראש עם הפרטים שמילאתם — האתר אינו שומר את הפנייה בשרת.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
