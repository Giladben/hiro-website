'use client'

import { useActionState } from 'react'
import { settingsAction } from '@/app/employer/actions'
import type { ActionResult, EmployerOrg } from '@/lib/employer/types'
import { useSubmit } from './useSubmit'
import s from './employer.module.css'

export function SettingsForm({ org }: { org: EmployerOrg }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(settingsAction, null)
  const submit = useSubmit(action)
  const bad = (f: string) => (state && !state.ok && state.field === f ? s.invalid : '')
  return (
    <form action={action} onSubmit={submit} className={s.box} noValidate aria-labelledby="set-h">
      <h2 id="set-h">העסק והתראות</h2>
      <div className={s.field}>
        <label className={s.label} htmlFor="name">שם העסק</label>
        <input id="name" name="name" className={s.input} defaultValue={org.name} />
      </div>
      <div className={s.grid2}>
        <div className={s.field}>
          <label className={s.label} htmlFor="contactName">איש/אשת קשר</label>
          <input id="contactName" name="contactName" className={s.input} defaultValue={org.contactName} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="phone">טלפון</label>
          <input id="phone" name="phone" type="tel" dir="ltr" className={s.input} defaultValue={org.phone} />
        </div>
      </div>
      <div className={s.field}>
        <label className={s.label} htmlFor="notifyEmail">מייל לקבלת מועמדים ותשובות</label>
        <input id="notifyEmail" name="notifyEmail" type="email" dir="ltr" className={`${s.input} ${bad('notifyEmail')}`} defaultValue={org.notifyEmail} />
        <p className={s.hint}>לכאן יגיעו התראות על מועמדים חדשים, ותשובות של מועמדים למיילים שתשלחו.</p>
      </div>
      <fieldset className={s.field} style={{ border: 0, padding: 0, margin: '1rem 0 0' }}>
        <legend className={s.label} style={{ marginBottom: '.4rem' }}>התראה על מועמד חדש</legend>
        <div className={s.checks}>
          {([['instant', 'מיד'], ['daily', 'ריכוז יומי'], ['off', 'בלי']] as const).map(([v, l]) => (
            <label key={v} className={s.check}><input type="radio" name="notify" value={v} defaultChecked={org.notify === v} />{l}</label>
          ))}
        </div>
      </fieldset>
      <div className={s.row} style={{ marginTop: '1.25rem' }}>
        <button className="btn btn-primary" disabled={pending}>{pending ? 'שומרים...' : 'שמירה'}</button>
        <span aria-live="polite">
          {state && !state.ok && <span className={s.err}>{state.error}</span>}
          {state?.ok && <span className={s.okMsg}>{state.message}</span>}
        </span>
      </div>
    </form>
  )
}
