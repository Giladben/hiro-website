'use client'

import { useActionState } from 'react'
import { onboardingAction } from '@/app/employer/actions'
import type { ActionResult } from '@/lib/employer/types'
import { useSubmit } from './useSubmit'
import s from './employer.module.css'

export function OnboardingForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(onboardingAction, null)
  const submit = useSubmit(action)
  const bad = (f: string) => (state && !state.ok && state.field === f ? s.invalid : '')

  return (
    <form action={action} onSubmit={submit} className={s.authCard} noValidate>
      <h1>כמה פרטים על העסק</h1>
      <p>כך יופיע העסק במשרות שתפרסמו. מחוברים כ-<b dir="ltr">{email}</b>.</p>

      <div className={s.field}>
        <label className={s.label} htmlFor="name">שם העסק</label>
        <input id="name" name="name" className={`${s.input} ${bad('name')}`} autoComplete="organization" required />
      </div>
      <div className={s.grid2}>
        <div className={s.field}>
          <label className={s.label} htmlFor="contactName">איש/אשת קשר</label>
          <input id="contactName" name="contactName" className={`${s.input} ${bad('contactName')}`} autoComplete="name" required />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="phone">טלפון</label>
          <input id="phone" name="phone" type="tel" dir="ltr" className={`${s.input} ${bad('phone')}`} autoComplete="tel" required />
        </div>
      </div>
      <div className={s.field}>
        <label className={s.label} htmlFor="businessId">ח.פ / ע.מ <em>(לא חובה, מזרז את אישור המשרות)</em></label>
        <input id="businessId" name="businessId" inputMode="numeric" dir="ltr" className={`${s.input} ${bad('businessId')}`} />
      </div>

      <label className={s.toggle}>
        <input type="checkbox" name="terms" className={bad('terms')} />
        <span>
          קראתי ואני מסכים/ה ל<a href="/terms" target="_blank" className="link-u">תנאי השימוש</a>, ובפרט לסעיף &quot;משתמשים עסקיים&quot;:
          מידע על מועמדים ישמש רק לגיוס למשרה שאליה הגישו, ולא יועבר לאחרים.
        </span>
      </label>

      {state && !state.ok && <p className={s.err} role="alert">{state.error}</p>}
      <p className={s.hint}>המשרות הראשונות שלכם יעברו בדיקה קצרה שלנו לפני שהן עולות, בדרך כלל באותו יום.</p>
      <button className={`btn btn-primary ${s.wide}`} disabled={pending}>{pending ? 'שומרים...' : 'המשך לפרסום משרה'}</button>
    </form>
  )
}
