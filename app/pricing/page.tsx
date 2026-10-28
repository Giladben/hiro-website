import type { Metadata } from 'next'
import Link from 'next/link'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Plans } from '@/components/pricing/Plans'
import { COMPARE, EXTRAS, FAQ, FOUNDERS, PLANS } from '@/content/pricing'
import s from '@/components/pricing/pricing.module.css'

export const metadata: Metadata = {
  title: 'מחירים',
  description: 'כמה עולה HirO: מחיר לרכז לחודש, בלי פגישת מכירה כדי לגלות. בסיס, מקצועי וארגוני, עם 14 יום ניסיון וייצוא מלא של הנתונים שלכם.',
  alternates: { canonical: '/pricing' },
}

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
}

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <span className={s.yes} aria-label="כלול">✓</span>
  if (v === false) return <span className={s.no} aria-label="לא כלול">—</span>
  return <span className={s.detail}>{v}</span>
}

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1} className={s.page}>
        <div className="wrap">
          <header className={s.head}>
            <p className="kicker" style={{ justifyContent: 'center' }}>מחירים</p>
            <h1 className={s.h1}>המחיר כתוב כאן. בלי פגישה כדי לגלות.</h1>
            <p className={`lede ${s.lede}`}>משלמים לפי מספר הרכזים שעובדים במערכת. בלי דמי הקמה, ומקבלים ייצוא מלא של הנתונים אם עוזבים.</p>
            <p className={s.founders}><b>מחיר מייסדים:</b> {FOUNDERS.percent}% הנחה בשנה הראשונה ל-{FOUNDERS.seats} המשרדים הראשונים</p>
          </header>

          <Plans />
          <p className={s.vat}>כל המחירים לרכז לחודש, לפני מע״מ. 14 יום ניסיון בלי כרטיס אשראי.</p>

          <section className={s.section} aria-labelledby="cmp-h">
            <h2 id="cmp-h" className={s.h2}>מה יש בכל תוכנית</h2>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr><th scope="col"><span className="sr-only">יכולת</span></th>{PLANS.map(p => <th key={p.id} scope="col">{p.name}</th>)}</tr>
                </thead>
                <tbody>
                  {COMPARE.map(g => [
                    <tr key={g.group} className={s.group}><th colSpan={PLANS.length + 1} scope="colgroup">{g.group}</th></tr>,
                    ...g.rows.map(r => (
                      <tr key={r.label}>
                        <th scope="row" style={{ fontWeight: 500 }}>{r.label}</th>
                        {PLANS.map(p => <td key={p.id}><Cell v={r.values[p.id]} /></td>)}
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
          </section>

          <section className={s.section} aria-labelledby="ext-h">
            <h2 id="ext-h" className={s.h2}>מעבר לתוכנית</h2>
            <div className={s.extras}>
              {EXTRAS.map(e => <div key={e.name} className={s.extra}><b>{e.name}<span>{e.price}</span></b><p>{e.note}</p></div>)}
            </div>
          </section>

          <section className={`${s.section} ${s.faq}`} aria-labelledby="faq-h">
            <h2 id="faq-h" className={s.h2}>שאלות על המחיר</h2>
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </section>

          <aside className={s.cta}>
            <div>
              <b>רוצים לראות את זה על המשרות שלכם?</b>
              <p>20 דקות בזום. נריץ את Sonar על משרה אמיתית שלכם.</p>
            </div>
            <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">קבעו הדגמה</Link>
              <Link href="/why-hiro" className="btn btn-ghost" style={{ color: 'inherit', borderColor: 'currentColor' }}>למה HirO</Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
