'use client'

import { useRef, useState } from 'react'
import { SALES_VIDEOS } from '@/content/sales-videos'
import { SalesVideo } from './SalesVideo'
import s from './sales.module.css'

const TABS = [
  {
    id: 'S2' as const, t: 'מנוע ההתאמה', s: 'שאתם שולטים בו', h: 'ההתאמה. בשליטה שלכם.',
    p: 'רוב המערכות מחפשות מילים. HirO מבינה משמעות, ונותנת לכם לקבוע מה חשוב בכל משרה.',
    b: ['חיפוש בשפה חופשית, בעברית', 'משקלות לדמיון, תגיות, מיקום וזיקה לתחום', 'קנסות אוטומטיים על פער שכר וניידות', 'תבניות מוכנות ותבניות משלכם', 'אותו מנוע מוצא מועמדים למשרה ומשרות למועמד'],
  },
  {
    id: 'S3' as const, t: 'אף ליד לא נופל', s: 'מהקו״ח ועד העסקה', h: 'מהקו״ח הראשון ועד העסקה הסגורה.',
    p: 'גיוס ומכירה באותה מערכת: כל קו״ח נוחת במקום הנכון, וכל שיחה מפעילה את הצעד הבא.',
    b: ['כתובת מייל ייחודית לכל משרה, עם מקור ההגעה', 'בונה תהליכים: תוצאה לכל אינטראקציה, אוטומציה לכל תוצאה', 'מאגר חברות לפי ענף, גודל ואזור', 'דופק, תזכורות ואירועים במסך אחד'],
  },
  {
    id: 'S4' as const, t: 'מאגר שמתעדכן לבד', s: 'המועמד מנהל את הפרופיל', h: 'המאגר שלכם נשאר חי.',
    p: 'במקום שהרכז ירדוף אחרי עדכונים, המועמד מקבל אזור אישי ויש לו סיבה לחזור.',
    b: ['פרופיל מקצועי שנבנה אוטומטית מקורות החיים', 'יועץ קריירה AI עם תצוגה מקדימה ואישור', 'עותק צל לכל מגייס, עם ההערות והתגיות שלו', 'עדכון של המועמד מגיע לכל העותקים', 'סרטון היכרות של 60 שניות'],
  },
]

export function DeepDive() {
  const [i, setI] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const d = TABS[i]

  // Arrow keys move between tabs (RTL: left = next)
  const onKey = (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0
    const to = e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : dir ? (i + dir + TABS.length) % TABS.length : -1
    if (to < 0) return
    e.preventDefault()
    setI(to)
    tabRefs.current[to]?.focus()
  }

  return (
    <>
      <div className={s.tabs} role="tablist" aria-label="שלושה דברים שאין כמעט באף מערכת גיוס" onKeyDown={onKey}>
        {TABS.map((t, j) => (
          <button
            key={t.id}
            ref={el => { tabRefs.current[j] = el }}
            id={`deep-tab-${t.id}`}
            type="button"
            role="tab"
            aria-selected={i === j}
            aria-controls="deep-panel"
            tabIndex={i === j ? 0 : -1}
            className={s.tab}
            onClick={() => setI(j)}
          >
            {t.t}
            <small>{t.s}</small>
          </button>
        ))}
      </div>
      <div id="deep-panel" role="tabpanel" aria-labelledby={`deep-tab-${d.id}`} className={s.deep}>
        <SalesVideo key={d.id} video={SALES_VIDEOS[d.id]} />
        <div className={s.deepText}>
          <h3>{d.h}</h3>
          <p>{d.p}</p>
          <ul>{d.b.map(x => <li key={x}>{x}</li>)}</ul>
        </div>
      </div>
    </>
  )
}
