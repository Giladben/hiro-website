'use client'

import { Cursor, useTarget } from './Cursor'
import { easeOut, lerp, seg } from './anim'
import { AppChrome, Avatar, Dot, Ring, Slider } from './ui'
import s from './film.module.css'

type SceneProps = { p: number }

/* ────────────────────── 1. Job Sonar ────────────────────── */

const SONAR = [
  { name: 'מאיה פרידמן', role: 'מנהלת חשבונות סוג 3', score: 91, km: 8, sal: true, scope: 'מלאה', src: 'מאגר אישי' },
  { name: 'יונתן כץ', role: 'מנהל חשבונות ראשי', score: 87, km: 14, sal: true, scope: 'מלאה', src: 'מאגר אישי' },
  { name: 'שירן לוי', role: 'מנהלת חשבונות וחשבת שכר', score: 83, km: 6, sal: false, scope: 'מלאה', src: 'מערכת' },
  { name: 'עומר חדד', role: 'מנהל חשבונות סוג 2', score: 78, km: 21, sal: true, scope: 'חלקית', src: 'מאגר אישי' },
  { name: 'נועה אברהם', role: 'מנהלת חשבונות, משרד רו״ח', score: 74, km: 11, sal: true, scope: 'מלאה', src: 'מערכת' },
]

export function SonarScene({ p }: SceneProps) {
  const t = useTarget()
  const thr = Math.round(lerp(55, 70, easeOut(seg(p, 0.06, 0.22))))
  const clicked = p >= 0.33
  const scanning = p >= 0.33 && p < 0.5
  const found = SONAR.filter((_, i) => p >= 0.4 + i * 0.075).length

  return (
    <AppChrome crumb="Job Sonar" active={1}>
      <div className={s.split}>
        <section className={s.panel} style={{ flex: 1 }}>
          <header className={s.sonarHead}>
            <span className={`${s.radar} ${scanning ? s.radarOn : ''}`}>
              <i /><i /><i />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2" /><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 16.2a6 6 0 0 0 0-8.4" /></svg>
            </span>
            <div style={{ flex: 1 }}>
              <div className={s.h}>סורק גילוי מועמדים (Sonar)</div>
              <div className={s.sub}>מנהל/ת חשבונות · משרד רו״ח, פתח תקווה · 20 מועמדים מעל {thr}% התאמה</div>
            </div>
            <span ref={t('run')} className={`${s.cta} ${clicked && p < 0.36 ? s.ctaPress : ''}`}>
              {scanning ? 'סורק…' : 'הפעל סונאר חכם'}
            </span>
          </header>

          <div className={s.listHead}>
            <b>נמצאו התאמות פוטנציאליות</b>
            <span className={s.count}>{found}</span>
            <span className={s.legend}><Dot tone="ok" /> תואם <Dot tone="bad" /> לא תואם</span>
          </div>

          <div className={s.rows}>
            {SONAR.map((c, i) => {
              const a = 0.4 + i * 0.075
              const r = easeOut(seg(p, a, a + 0.1))
              const ring = c.score * easeOut(seg(p, a, a + 0.2))
              return (
                <div key={c.name} ref={i === 0 ? t('row0') : undefined} className={s.row} style={{ opacity: r, transform: `translateY(${(1 - r) * 12}px)` }}>
                  <Avatar name={c.name} tone={i} />
                  <div className={s.who}>
                    <b>{c.name}</b>
                    <span>{c.role}</span>
                  </div>
                  <Ring value={ring} />
                  <div className={s.crit}>
                    <span><Dot tone="ok" />מרחק מהיעד <b>{c.km} ק״מ</b></span>
                    <span><Dot tone={c.sal ? 'ok' : 'bad'} />ציפיות שכר <b>{c.sal ? 'תואם' : 'מעל היעד'}</b></span>
                    <span className={s.hideSm}><Dot tone={c.scope === 'מלאה' ? 'ok' : 'bad'} />היקף משרה <b>{c.scope}</b></span>
                    <span className={s.hideSm}><Dot tone="mute" />מקור <b>{c.src}</b></span>
                  </div>
                  <span className={s.attach}>צרף</span>
                </div>
              )
            })}
          </div>
        </section>

        <aside className={`${s.panel} ${s.side}`}>
          <div className={s.h} style={{ marginBottom: 18 }}>הגדרות סריקה</div>
          <label className={s.field}>
            <span>כמות מופיעים בכל פעם <em>20</em></span>
            <Slider value={50} />
          </label>
          <label className={s.field}>
            <span>סף התאמה מינימלי <em>{thr}%</em></span>
            <Slider value={thr} thumbRef={t('thumb')} />
          </label>
          <div className={s.check}>
            <span className={s.box}>✓</span>
            <div><b>התאמה וקטורית</b><span>מודלים סמנטיים למציאת דמיון בין משרה לאדם</span></div>
          </div>
          <div className={s.sub} style={{ margin: '14px 0 8px' }}>סינון במקרה של חוסר התאמה</div>
          <div className={s.chips}>
            {['היקף משרה', 'שעות', 'מרחק', 'ציפיות שכר', 'ניידות', 'רישיון נהיגה'].map((c, i) => (
              <span key={c} className={i === 3 ? s.chipOn : ''}>{c}</span>
            ))}
          </div>
        </aside>
      </div>

      <Cursor p={p} path={[
        { at: 0.04, to: 'thumb' },
        { at: 0.22, to: 'thumb' },
        { at: 0.33, to: 'run', click: true },
        { at: 0.62, to: 'run' },
        { at: 0.9, to: 'row0' },
      ]} />
    </AppChrome>
  )
}

/* ────────────────────── 2. Match template ────────────────────── */

const CRITERIA = [
  { k: 'התאמה וקטורית', v: '91%', ok: true, w: 30 },
  { k: 'ניסיון בתחום', v: '6 שנים', ok: true, w: 20 },
  { k: 'ציפיות שכר', v: 'תואם ליעד', ok: true, w: 10, grow: 25 },
  { k: 'מרחק מהיעד', v: '8 ק״מ', ok: true, w: 15 },
  { k: 'היקף משרה', v: 'מלאה', ok: true, w: 10 },
  { k: 'שעות משרה', v: 'גמישות', ok: true, w: 10 },
  { k: 'רישיון נהיגה', v: 'אין', ok: false, w: 5 },
]

export function MatchScene({ p }: SceneProps) {
  const t = useTarget()
  const drag = easeOut(seg(p, 0.5, 0.68))
  const score = lerp(84, 89, drag)

  return (
    <AppChrome crumb="תבנית התאמה" active={3}>
      <div className={s.split}>
        <section className={s.panel} style={{ flex: 1 }}>
          <header className={s.tplHead}>
            <div>
              <div className={s.h}>תבנית התאמה · מנהל/ת חשבונות</div>
              <div className={s.sub}>אתם קובעים מה נבדק ובאיזה משקל. הציון מתעדכן מיד.</div>
            </div>
            <span className={s.tplRight}>
              <span className={s.saved} style={{ opacity: seg(p, 0.72, 0.78) }}>נשמר ✓</span>
              <span className={s.scoreInline}><Ring value={score} size={52} stroke={4} /></span>
            </span>
          </header>
          <div className={s.tplCols}><span>קריטריון</span><span>מאיה פרידמן</span><span>משקל</span></div>
          {CRITERIA.map((c, i) => {
            const r = easeOut(seg(p, 0.04 + i * 0.045, 0.14 + i * 0.045))
            const w = c.grow ? lerp(c.w, c.grow, drag) : c.w
            return (
              <div key={c.k} className={`${s.tplRow} ${c.grow && p > 0.46 && p < 0.74 ? s.tplRowHot : ''}`} style={{ opacity: 0.25 + r * 0.75 }}>
                <span className={s.tplK}>{c.k}</span>
                <span className={s.tplV} style={{ opacity: r }}><Dot tone={c.ok ? 'ok' : 'bad'} />{c.v}</span>
                <span className={s.tplW}>
                  <Slider value={w * 3} thumbRef={c.grow ? t('weight') : undefined} />
                  <em>{Math.round(w)}</em>
                </span>
              </div>
            )
          })}
        </section>

        <aside className={`${s.panel} ${s.side} ${s.center}`}>
          <Avatar name="מאיה פרידמן" />
          <b className={s.bigName}>מאיה פרידמן</b>
          <span className={s.sub}>מנהלת חשבונות סוג 3 · רמת גן</span>
          <div style={{ margin: '22px 0 10px' }}><Ring value={score} size={132} stroke={7} /></div>
          <span className={s.sub}>ציון התאמה למשרה</span>
          <span className={s.delta} style={{ opacity: seg(p, 0.55, 0.62) }}>+{Math.round(score - 84)} אחרי שינוי המשקל</span>
          <span className={s.ctaWide}>שייך למשרה</span>
        </aside>
      </div>

      <Cursor p={p} path={[
        { at: 0.42, to: 'weight' },
        { at: 0.5, to: 'weight', click: true },
        { at: 0.68, to: 'weight' },
      ]} />
    </AppChrome>
  )
}

/* ────────────────────── 3. Bulk outreach ────────────────────── */

const MSG: Array<{ t?: string; v?: string }> = [
  { t: 'היי ' }, { v: 'שם פרטי' },
  { t: ', ראיתי את הפרופיל שלך ויש לנו משרת ' }, { v: 'שם המשרה' },
  { t: ' שנראית לי מדויקת בשבילך. מתאים לדבר השבוע?' },
]
const MSG_LEN = MSG.reduce((n, m) => n + (m.t ? m.t.length : 1), 0)

/** The message as typed so far: a variable chip counts as one keystroke. */
function typeMessage(budget: number) {
  const out: typeof MSG = []
  for (const m of MSG) {
    if (budget <= 0) break
    if (m.v) { out.push(m); budget -= 1 }
    else { out.push({ t: m.t!.slice(0, budget) }); budget -= m.t!.length }
  }
  return out
}

export function OutreachScene({ p }: SceneProps) {
  const t = useTarget()
  const people = SONAR
  const selected = (i: number) => p >= 0.14 + i * 0.018
  const allOn = p >= 0.14
  const panel = easeOut(seg(p, 0.22, 0.32))
  const typed = typeMessage(Math.floor(MSG_LEN * seg(p, 0.32, 0.6)))
  const sent = (i: number) => p >= 0.7 + i * 0.045

  return (
    <AppChrome crumb="מרכז תקשורת" active={2}>
      <div className={s.split}>
        <section className={s.panel} style={{ flex: 1 }}>
          <div className={s.h} style={{ marginBottom: 14 }}>מועמדים למשרה · מנהל/ת חשבונות</div>
          <div className={s.tableHead}>
            <span ref={t('all')} className={`${s.box} ${allOn ? '' : s.boxOff}`}>{allOn ? '✓' : ''}</span>
            <span>שם</span><span className={s.hideSm}>סטטוס</span><span>הודעה</span>
          </div>
          {people.map((c, i) => (
            <div key={c.name} className={s.tRow}>
              <span className={`${s.box} ${selected(i) ? '' : s.boxOff}`}>{selected(i) ? '✓' : ''}</span>
              <span className={s.tName}><Avatar name={c.name} tone={i} /><b>{c.name}</b></span>
              <span className={`${s.hideSm} ${s.pill}`}>סינון ראשוני</span>
              <span className={s.status}>
                {sent(i) ? <span className={s.sent}>נשלח ✓</span> : <span className={s.muted}>—</span>}
              </span>
            </div>
          ))}
        </section>

        <aside className={`${s.panel} ${s.side}`} style={{ opacity: panel, transform: `translateX(${(1 - panel) * -24}px)` }}>
          <div className={s.tabs}><span className={s.tabOn}>SMS</span><span>מייל</span></div>
          <div className={s.sub} style={{ margin: '14px 0 6px' }}>נמענים: 5 מועמדים</div>
          <div className={s.composer}>
            {typed.map((m, i) => m.v
              ? <span key={i} className={s.var}>{m.v}</span>
              : <span key={i}>{m.t}</span>)}
            {p < 0.62 && <span className={s.caret} />}
          </div>
          <div className={s.sub} style={{ marginTop: 8 }}>משתנים מתמלאים אוטומטית לכל מועמד</div>
          <span ref={t('send')} className={`${s.ctaWide} ${p >= 0.66 && p < 0.69 ? s.ctaPress : ''}`}>
            {p >= 0.7 ? 'נשלח ל-5 מועמדים' : 'שליחה ל-5 מועמדים'}
          </span>
        </aside>
      </div>

      <Cursor p={p} path={[
        { at: 0.06, to: 'all' },
        { at: 0.13, to: 'all', click: true },
        { at: 0.6, to: 'send' },
        { at: 0.66, to: 'send', click: true },
        { at: 0.95, to: 'send' },
      ]} />
    </AppChrome>
  )
}

/* ────────────────────── 4. Candidate side ────────────────────── */

type App = { role: string; org: string; via: string }
const PERSONA_A: App[] = [
  { role: 'מנהלת חשבונות סוג 3', org: 'ברק ושות׳ רו״ח', via: 'דרך Hiro' },
  { role: 'חשבת שכר', org: 'לוגיטק פתרונות', via: 'לינקדאין' },
  { role: 'מנהלת חשבונות ראשית', org: 'גל-אור נכסים', via: 'אתר החברה' },
  { role: 'מנהלת חשבונות', org: 'מרכז רפואי השרון', via: 'חברת השמה' },
]
const PERSONA_B: App[] = [
  { role: 'מנהלת גבייה', org: 'אלון תקשורת', via: 'דרך Hiro' },
  { role: 'אחראית גבייה ולקוחות', org: 'פז-רון לוגיסטיקה', via: 'אתר החברה' },
]

export function CandidateScene({ p }: SceneProps) {
  const t = useTarget()
  const personaB = p >= 0.86
  const col = p < 0.24 ? 0 : p < 0.5 ? 1 : 2
  const toast = seg(p, 0.64, 0.7) * (1 - seg(p, 0.82, 0.86))

  const boardA: App[][] = [
    [PERSONA_A[1], PERSONA_A[3]],
    [PERSONA_A[2]],
    [],
  ]
  boardA[col] = [PERSONA_A[0], ...boardA[col]]
  const boardB: App[][] = [[PERSONA_B[1]], [PERSONA_B[0]], []]
  const board = personaB ? boardB : boardA
  const cols = ['הוגשו', 'בבדיקה', 'ראיון']

  return (
    <div className={s.cand}>
      <header className={s.candHead}>
        <div>
          <div className={s.hLg}>בוקר טוב, מאיה</div>
          <div className={s.sub}>{personaB ? '2 הגשות פעילות בפרופיל הזה' : '4 הגשות פעילות · ראיון אחד השבוע'}</div>
        </div>
        <div className={s.personas}>
          <span className={personaB ? '' : s.personaOn}>מנהלת חשבונות</span>
          <span ref={t('personaB')} className={personaB ? s.personaOn : ''}>מנהלת גבייה</span>
          <span className={s.personaAdd}>+ פרופיל</span>
        </div>
      </header>

      <div className={s.board} key={personaB ? 'b' : 'a'}>
        {cols.map((name, ci) => (
          <div key={name} className={s.col}>
            <div className={s.colHead}><b>{name}</b><span>{board[ci].length}</span></div>
            {board[ci].map(a => {
              const isMoving = !personaB && a === PERSONA_A[0]
              return (
                <div key={a.role + (isMoving ? col : '')} className={`${s.card} ${isMoving ? s.cardMoving : ''}`}>
                  <b>{a.role}</b>
                  <span>{a.org}</span>
                  <div className={s.cardFoot}>
                    <em>{a.via}</em>
                    {isMoving && col === 2 && <i className={s.date}>יום ב׳ · 10:00</i>}
                    {isMoving && col === 1 && <i className={s.seen}>המגייסת צפתה</i>}
                  </div>
                  
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className={s.toast} style={{ opacity: toast, transform: `translate(-50%, ${(1 - toast) * 12}px)` }}>
        <b>קורות החיים עודכנו</b>
        <span>הגרסה החדשה זמינה עכשיו לשני המגייסים שעובדים איתך</span>
      </div>

      <Cursor p={p} path={[
        { at: 0.74, to: 'personaB' },
        { at: 0.85, to: 'personaB', click: true },
        { at: 0.98, to: 'personaB' },
      ]} />
    </div>
  )
}
