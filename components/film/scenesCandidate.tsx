'use client'

import { Cursor, useTarget } from './Cursor'
import { easeOut, seg } from './anim'
import { Ring } from './ui'
import s from './film.module.css'

type SceneProps = { p: number }

/** Candidate-side app frame: logo + three tabs. */
function CandShell({ tab, children }: { tab: 0 | 1 | 2; children: React.ReactNode }) {
  const tabs = ['הפרופיל שלי', 'סוכן הקריירה', 'ההגשות שלי']
  return (
    <div className={s.cShell}>
      <div className={s.cTop}>
        <span className={s.cLogo}>H</span>
        <nav className={s.cTabs}>
          {tabs.map((t, i) => <span key={t} className={i === tab ? s.cTabOn : ''}>{t}</span>)}
        </nav>
        <span className={s.me}>מ</span>
      </div>
      <div className={s.cBody}>{children}</div>
    </div>
  )
}

/* ────────────────────── Onboarding: CV → profile ────────────────────── */

const SKILLS = ['הנהלת חשבונות סוג 3', 'Priority', 'התאמות בנקים', 'Excel מתקדם', 'דוחות מע״מ']
const EXP = [
  { role: 'מנהלת חשבונות', org: 'משרד רו״ח לוי-ברק', years: '2020 – היום' },
  { role: 'מנהלת חשבונות סוג 2', org: 'אלון שיווק בע״מ', years: '2017 – 2020' },
]

export function OnboardScene({ p }: SceneProps) {
  const t = useTarget()
  const dropped = p >= 0.16
  const parse = seg(p, 0.18, 0.4)
  const fill = (a: number) => easeOut(seg(p, a, a + 0.08))
  const live = p >= 0.8

  return (
    <CandShell tab={0}>
      <div className={s.split}>
        <section className={s.panel} style={{ flex: 1 }}>
          <div className={s.h}>בואי נבנה את הפרופיל שלך</div>
          <div className={s.sub}>מעלים קורות חיים קיימים, והפרופיל מתמלא לבד. אפשר לתקן כל שדה.</div>

          <div className={s.pGrid}>
            <label className={s.pField} style={{ opacity: 0.35 + fill(0.42) * 0.65 }}>
              <span>שם מלא</span><b>{fill(0.42) > 0 ? 'מאיה פרידמן' : ''}</b>
            </label>
            <label className={s.pField} style={{ opacity: 0.35 + fill(0.47) * 0.65 }}>
              <span>תפקיד נוכחי</span><b>{fill(0.47) > 0 ? 'מנהלת חשבונות סוג 3' : ''}</b>
            </label>
            <label className={s.pField} style={{ opacity: 0.35 + fill(0.52) * 0.65 }}>
              <span>אזור</span><b>{fill(0.52) > 0 ? 'רמת גן והסביבה' : ''}</b>
            </label>
            <label className={s.pField} style={{ opacity: 0.35 + fill(0.57) * 0.65 }}>
              <span>היקף משרה</span><b>{fill(0.57) > 0 ? 'מלאה' : ''}</b>
            </label>
          </div>

          <div className={s.sub} style={{ margin: '16px 0 8px' }}>כישורים</div>
          <div className={s.chips}>
            {SKILLS.map((k, i) => (
              <span key={k} className={s.chipOn} style={{ opacity: fill(0.6 + i * 0.03), transform: `scale(${0.85 + fill(0.6 + i * 0.03) * 0.15})` }}>{k}</span>
            ))}
          </div>

          <div className={s.sub} style={{ margin: '16px 0 8px' }}>ניסיון</div>
          {EXP.map((e, i) => (
            <div key={e.role} className={s.expRow} style={{ opacity: fill(0.7 + i * 0.04), transform: `translateY(${(1 - fill(0.7 + i * 0.04)) * 8}px)` }}>
              <b>{e.role}</b><span>{e.org}</span><em>{e.years}</em>
            </div>
          ))}
        </section>

        <aside className={`${s.panel} ${s.side} ${s.center}`}>
          <div ref={t('drop')} className={`${s.drop} ${dropped ? s.dropOn : ''}`}>
            {!dropped && <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
              <b>גררי לכאן קורות חיים</b>
              <span>PDF או Word</span>
            </>}
            {dropped && <>
              <span className={s.file}>PDF</span>
              <b>maya-friedman-cv.pdf</b>
              <span className={s.bar}><i style={{ width: `${parse * 100}%` }} /></span>
              <span>{parse < 1 ? 'קוראת את קורות החיים…' : 'הפרופיל מוכן לעריכה'}</span>
            </>}
          </div>
          <div style={{ marginTop: 22 }}><Ring value={Math.round(40 + 55 * seg(p, 0.42, 0.78))} size={96} stroke={6} label="%" /></div>
          <span className={s.sub}>שלמות הפרופיל</span>
          <span className={`${s.ctaWide} ${p >= 0.78 && p < 0.81 ? s.ctaPress : ''}`} ref={t('go')} style={{ background: live ? 'var(--ok)' : undefined }}>
            {live ? 'הפרופיל פעיל ✓' : 'שמירה והפעלה'}
          </span>
        </aside>
      </div>

      <Cursor p={p} path={[
        { at: 0.03, to: 'drop' },
        { at: 0.15, to: 'drop', click: true },
        { at: 0.62, to: 'drop' },
        { at: 0.78, to: 'go', click: true },
        { at: 0.97, to: 'go' },
      ]} />
    </CandShell>
  )
}

/* ────────────────────── Career agent chat ────────────────────── */

const PROMPTS = [
  'אילו משרות מתאימות לי השבוע?',
  'איפה עומדות ההגשות שלי?',
  'איך לחדד את קורות החיים לתפקיד הזה?',
]
const JOBS = [
  { role: 'מנהלת חשבונות סוג 3', org: 'ברק ושות׳ רו״ח · פתח תקווה', score: 91 },
  { role: 'מנהלת חשבונות ראשית', org: 'גל-אור נכסים · תל אביב', score: 86 },
  { role: 'חשבת שכר', org: 'לוגיטק פתרונות · רמת גן', score: 79 },
]

export function AgentScene({ p }: SceneProps) {
  const t = useTarget()
  const asked1 = p >= 0.14
  const typing1 = p >= 0.18 && p < 0.28
  const ans1 = easeOut(seg(p, 0.28, 0.36))
  const asked2 = p >= 0.62
  const typing2 = p >= 0.66 && p < 0.74
  const ans2 = easeOut(seg(p, 0.74, 0.82))
  const scrolled = p >= 0.62 ? easeOut(seg(p, 0.62, 0.7)) : 0

  return (
    <CandShell tab={1}>
      <div className={s.chat}>
        <div className={s.chatLog} style={{ transform: `translateY(${-scrolled * 150}px)` }}>
          <div className={s.msgAi}>
            היי מאיה, אני הסוכן שלך. אני מכיר את הפרופיל ואת ההגשות שלך. אפשר לשאול אותי כל דבר על החיפוש.
          </div>

          {asked1 && <div className={s.msgMe}>{PROMPTS[0]}</div>}
          {typing1 && <div className={s.msgAi}><span className={s.dots}><i /><i /><i /></span></div>}
          {ans1 > 0 && (
            <div className={s.msgAi} style={{ opacity: ans1 }}>
              מצאתי 3 משרות חדשות שמתאימות לפרופיל &quot;מנהלת חשבונות&quot;:
              <div className={s.jobs}>
                {JOBS.map((j, i) => (
                  <div key={j.role} className={s.job} ref={i === 0 ? t('job0') : undefined} style={{ opacity: easeOut(seg(p, 0.3 + i * 0.04, 0.38 + i * 0.04)) }}>
                    <Ring value={j.score * easeOut(seg(p, 0.3 + i * 0.04, 0.46 + i * 0.04))} size={38} stroke={3} />
                    <div><b>{j.role}</b><span>{j.org}</span></div>
                    <em>הגשה</em>
                  </div>
                ))}
              </div>
            </div>
          )}

          {asked2 && <div className={s.msgMe}>{PROMPTS[2]}</div>}
          {typing2 && <div className={s.msgAi}><span className={s.dots}><i /><i /><i /></span></div>}
          {ans2 > 0 && (
            <div className={s.msgAi} style={{ opacity: ans2 }}>
              במשרה של ברק ושות׳ מבקשים ניסיון בדוחות מע״מ. זה מופיע אצלך רק בסוף. כדאי להעלות אותו לשורה הראשונה בתיאור התפקיד הנוכחי.
            </div>
          )}
        </div>

        <div className={s.chatFoot}>
          <div className={s.prompts}>
            {PROMPTS.map((q, i) => (
              <span key={q} ref={t(`q${i}`)} className={(i === 0 && asked1 && !asked2) || (i === 2 && asked2) ? s.promptOn : ''}>{q}</span>
            ))}
          </div>
          <div className={s.chatInput}>
            <span>מה תרצי לשאול?</span>
            <i>שליחה</i>
          </div>
        </div>
      </div>

      <Cursor p={p} path={[
        { at: 0.06, to: 'q0' },
        { at: 0.13, to: 'q0', click: true },
        { at: 0.45, to: 'job0' },
        { at: 0.56, to: 'q2' },
        { at: 0.61, to: 'q2', click: true },
        { at: 0.95, to: 'q2' },
      ]} />
    </CandShell>
  )
}
