'use client' // Error boundaries must be Client Components

import Link from 'next/link'
import s from '@/components/jobs/jobs.module.css'

/** Shown when the Hiro jobs API is unreachable; the response stays 5xx, which search engines treat as temporary. */
export default function JobsError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <main id="main-content" tabIndex={-1} className={s.page}>
      <div className="wrap">
        <div className={s.empty} role="alert">
          <b>לוח המשרות לא זמין כרגע.</b>
          <p>אנחנו על זה. אפשר לנסות שוב בעוד דקה, או לפתוח פרופיל ב-Hiro ולקבל התראה כשתעלה משרה מתאימה.</p>
          <div className={s.emptyCtas}>
            <button type="button" className="btn btn-ghost" onClick={() => unstable_retry()}>לנסות שוב</button>
            <Link href="/" className="btn btn-ghost">לדף הבית</Link>
            <a href="https://app.hiro.co.il" className="btn btn-primary">פתיחת פרופיל בחינם</a>
          </div>
        </div>
      </div>
    </main>
  )
}
