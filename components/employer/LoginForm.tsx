'use client'

import { useActionState, useEffect, useRef } from 'react'
import { loginAction, type LoginState } from '@/app/employer/actions'
import s from './employer.module.css'

export function LoginForm({ demo }: { demo?: { email: string; code: string } }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { ok: true, step: 'email' })
  const codeStep = state.step === 'code'
  const codeRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (codeStep) codeRef.current?.focus() }, [codeStep])
  const err = !state.ok ? state : null

  return (
    <form action={action} className={s.authCard} noValidate>
      <h1>{codeStep ? 'בדקו את המייל' : 'כניסה למעסיקים'}</h1>
      <p>
        {codeStep
          ? <>שלחנו קוד בן 6 ספרות ל-<b dir="ltr">{state.email}</b>. הוא בתוקף 10 דקות.</>
          : 'פרסום משרות בחינם וניהול המועמדים שהגישו. בלי סיסמה: נשלח לכם קוד למייל.'}
      </p>

      {codeStep ? (
        <>
          <input type="hidden" name="email" value={state.email} />
          <div className={s.field}>
            <label className={s.label} htmlFor="code">קוד</label>
            <input ref={codeRef} id="code" name="code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} dir="ltr"
              className={`${s.input} ${s.code} ${err?.field === 'code' ? s.invalid : ''}`} aria-invalid={err?.field === 'code'} aria-describedby={err ? 'login-err' : undefined} />
          </div>
        </>
      ) : (
        <div className={s.field}>
          <label className={s.label} htmlFor="email">מייל עבודה</label>
          <input id="email" name="email" type="email" autoComplete="email" dir="ltr" required defaultValue={state.email}
            className={`${s.input} ${err?.field === 'email' ? s.invalid : ''}`} aria-invalid={err?.field === 'email'} aria-describedby={err ? 'login-err' : undefined} />
        </div>
      )}

      {err && <p id="login-err" className={s.err} role="alert">{err.error}</p>}

      {demo && (
        <p className={s.demoHint}>
          הדגמה: {codeStep ? <>הקוד הוא <b dir="ltr">{demo.code}</b>.</> : <>אפשר להיכנס עם <b dir="ltr">{demo.email}</b> לחשבון עם משרות ומועמדים, או עם כל מייל אחר כדי לראות הרשמה חדשה.</>}
        </p>
      )}

      <button className={`btn btn-primary ${s.wide}`} disabled={pending}>
        {pending ? 'רגע...' : codeStep ? 'כניסה' : 'שליחת קוד'}
      </button>
      {codeStep && <a href="/employer/login" className={s.linkish}>להחליף כתובת מייל</a>}
    </form>
  )
}
