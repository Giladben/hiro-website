'use client'

import { useState } from 'react'
import s from './jobs.module.css'

export function ShareButtons({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false)
  const url = () => `${location.origin}${path}`

  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title, url: url() }); return } catch { /* cancelled */ }
    }
    try {
      await navigator.clipboard.writeText(url())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  return (
    <>
      <a
        className={s.iconBtn}
        href={`https://wa.me/?text=${encodeURIComponent(`${title}\nhttps://hiro.co.il${path}`)}`}
        target="_blank" rel="noopener"
        aria-label="שיתוף בוואטסאפ"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" /></svg>
      </a>
      <button type="button" className={s.iconBtn} onClick={share} aria-label={copied ? 'הקישור הועתק' : 'שיתוף או העתקת קישור'}>
        {copied
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12 5 5L20 7" /></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" strokeLinecap="round" /></svg>}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'הקישור הועתק' : ''}</span>
    </>
  )
}
