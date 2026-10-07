'use client'

import { useEffect } from 'react'

/** Records one view per page load (POST /jobs/{id}/view) for reports and channel measurement. */
export function ViewBeacon({ jobId }: { jobId: string }) {
  useEffect(() => {
    const utm = Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith('utm_')))
    const body = JSON.stringify({ referrer: document.referrer || undefined, utm: Object.keys(utm).length ? utm : undefined })
    const url = `/api/jobs/${encodeURIComponent(jobId)}/view`
    if (!navigator.sendBeacon?.(url, new Blob([body], { type: 'application/json' }))) {
      fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(() => {})
    }
  }, [jobId])
  return null
}
