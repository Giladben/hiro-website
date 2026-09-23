'use client'

import { useEffect, useRef, useState } from 'react'
import { TargetsProvider, useTargetRegistry } from './Cursor'
import { CandidateScene, MatchScene, OutreachScene, SonarScene } from './scenes'
import { AgentScene, OnboardScene } from './scenesCandidate'
import s from './film.module.css'

const SCENES = {
  sonar: {
    title: 'Sonar סורק את המאגר',
    sr: 'מגייסת מעלה את סף ההתאמה ל-70% ומפעילה את Job Sonar. המערכת סורקת את המאגר הקיים ומציגה חמישה מועמדים עם ציון התאמה ופירוט לפי מרחק, ציפיות שכר והיקף משרה.',
    C: SonarScene,
  },
  match: {
    title: 'התבנית שלכם, הציון שלכם',
    sr: 'תבנית התאמה: לכל קריטריון יש משקל שהמגייס קובע. הגדלת המשקל של ציפיות שכר מעדכנת את ציון ההתאמה של המועמדת מ-84 ל-89 באופן מיידי.',
    C: MatchScene,
  },
  outreach: {
    title: 'פנייה בתפוצה',
    sr: 'בוחרים חמישה מועמדים, כותבים הודעת SMS אחת עם משתנים אישיים כמו שם ומשרה, ושולחים לכולם בלחיצה אחת.',
    C: OutreachScene,
  },
  onboard: {
    title: 'פרופיל מקורות החיים',
    sr: 'המועמדת גוררת קובץ קורות חיים. Hiro קוראת אותו וממלאת את הפרופיל: שם, תפקיד, אזור, כישורים וניסיון. אחרי בדיקה קצרה לוחצים שמירה והפרופיל פעיל.',
    C: OnboardScene,
  },
  agent: {
    title: 'מה שואלים את הסוכן',
    sr: 'שיחה עם סוכן הקריירה. המועמדת בוחרת שאלה מוכנה, אילו משרות מתאימות לה השבוע, ומקבלת שלוש משרות עם ציון התאמה. אחר כך היא שואלת איך לחדד את קורות החיים למשרה מסוימת ומקבלת הצעה קונקרטית.',
    C: AgentScene,
  },
  candidate: {
    title: 'כל ההגשות בלוח אחד',
    sr: 'המועמדת רואה את כל ההגשות שלה בלוח אחד, גם כאלה שהגישה מחוץ ל-Hiro. הגשה עוברת לשלב ראיון, קורות החיים המעודכנים זמינים למגייסים, ובלחיצה עוברים לפרופיל מקצועי נוסף.',
    C: CandidateScene,
  },
} as const

export type SceneId = keyof typeof SCENES
const DURATION = 8200

export function ProductFilm({ scenes = ['sonar', 'match', 'outreach', 'candidate'], label = 'הדגמת מוצר' }: { scenes?: SceneId[]; label?: string }) {
  const [idx, setIdx] = useState(0)
  const [p, setP] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reduced, setReduced] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const visible = useRef(true)
  const state = useRef({ idx: 0, p: 0 })
  const registry = useTargetRegistry(stage)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReduced(mq.matches)
      if (mq.matches) { setPlaying(false); state.current.p = 0.9; setP(0.9) }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!root.current) return
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting }, { threshold: 0.15 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (visible.current && !document.hidden) {
        const st = state.current
        st.p += dt / DURATION
        if (st.p >= 1) { st.p = 0; st.idx = (st.idx + 1) % scenes.length; setIdx(st.idx) }
        setP(st.p)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, scenes.length])

  const go = (i: number) => {
    state.current = { idx: i, p: reduced ? 0.9 : 0 }
    setIdx(i)
    setP(state.current.p)
  }

  const id = scenes[idx]
  const Scene = SCENES[id].C

  return (
    <div ref={root} className={s.film} role="group" aria-roledescription="הדגמה" aria-label={label}>
      <div ref={stage} className={s.stage} aria-hidden="true">
        <TargetsProvider value={registry}>
          <div className={s.sceneWrap} key={id}>
            <Scene p={p} />
          </div>
        </TargetsProvider>
      </div>
      <p className="sr-only" aria-live="polite">{`פרק ${idx + 1} מתוך ${scenes.length}: ${SCENES[id].title}. ${SCENES[id].sr}`}</p>

      <div className={s.controls}>
        <button
          type="button"
          className={s.play}
          onClick={() => setPlaying(v => !v)}
          aria-label={playing ? 'השהיית ההדגמה' : 'הפעלת ההדגמה'}
        >
          {playing
            ? <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="2" width="3" height="10" rx="1" fill="currentColor" /><rect x="8" y="2" width="3" height="10" rx="1" fill="currentColor" /></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14"><path d="M11 2.5v9L3.5 7z" fill="currentColor" /></svg>}
        </button>
        <ol className={s.chapters}>
          {scenes.map((sid, i) => (
            <li key={sid}>
              <button type="button" onClick={() => go(i)} aria-current={i === idx ? 'step' : undefined} className={i === idx ? s.chapOn : ''}>
                <span className={s.chapBar}><span style={{ width: `${i < idx ? 100 : i === idx ? p * 100 : 0}%` }} /></span>
                <span className={s.chapLabel}><em>{String(i + 1).padStart(2, '0')}</em>{SCENES[sid].title}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
