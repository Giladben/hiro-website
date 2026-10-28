'use client'

import { useState } from 'react'
import { FOUNDERS, PLANS } from '@/content/pricing'
import s from './pricing.module.css'

const nf = new Intl.NumberFormat('he-IL')

export function Plans() {
  const [annual, setAnnual] = useState(true)
  const maxSave = Math.max(...PLANS.filter(p => p.monthly && p.annual).map(p => Math.round((1 - p.annual! / p.monthly!) * 100)))

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div className={s.toggle} role="group" aria-label="תדירות תשלום">
          <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>חודשי</button>
          <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>שנתי <span className={s.save}>חיסכון של עד {maxSave}%</span></button>
        </div>
      </div>

      <div className={s.plans} style={{ marginTop: '2.5rem' }}>
        {PLANS.map(p => {
          const price = annual ? p.annual : p.monthly
          const founders = price != null ? Math.round(price * (1 - FOUNDERS.percent / 100)) : null
          return (
            <section key={p.id} className={`${s.plan} ${p.featured ? s.featured : ''}`} aria-labelledby={`plan-${p.id}`}>
              {p.featured && <span className={s.badge}>הכי מתאים למשרדי השמה</span>}
              <div>
                <h2 id={`plan-${p.id}`} className={s.planName}>{p.name}</h2>
                <p className={s.forWho}>{p.forWho}</p>
              </div>
              <div className={s.price}>
                {price != null ? (
                  <>
                    <span className={s.amount}>₪{nf.format(price)}</span>
                    <span className={s.unit}>לרכז<br />לחודש</span>
                  </>
                ) : <span className={s.quote}>בהצעה</span>}
              </div>
              <p className={s.priceNote}>
                {p.note}
                {price != null && annual && <> · בחיוב שנתי</>}
                {founders != null && <><br /><b>מחיר מייסדים: ₪{nf.format(founders)}</b> בשנה הראשונה</>}
              </p>
              <ul className={s.list}>{p.highlights.map(h => <li key={h}>{h}</li>)}</ul>
              <a href={p.cta.href} className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'}`}>{p.cta.label}</a>
            </section>
          )
        })}
      </div>
    </>
  )
}
