'use client'

import { useRef, useState } from 'react'
import type { SalesVideo as Video } from '@/content/sales-videos'
import s from './sales.module.css'

const fmt = (sec: number) => {
  const t = Math.floor(sec)
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

/**
 * A sales video with chapter chips. Plays the local mp4 until `youtubeId` is
 * set in content/sales-videos.ts, then switches to a youtube-nocookie embed.
 */
export function SalesVideo({ video, priority = false }: { video: Video; priority?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const [ytStart, setYtStart] = useState<number | null>(null)

  const chapterAt = (time: number) => {
    let k = 0
    video.chapters.forEach((c, i) => { if (time >= c.t) k = i })
    return k
  }

  const jump = (i: number) => {
    const t = video.chapters[i].t
    setActive(i)
    if (video.youtubeId) { setYtStart(Math.floor(t)); return }
    const v = ref.current
    if (!v) return
    v.currentTime = t
    v.play().catch(() => { /* autoplay blocked: the user can press play */ })
  }

  const ytSrc = video.youtubeId
    ? `https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0${ytStart != null ? `&start=${ytStart}&autoplay=1` : ''}`
    : null

  return (
    <figure className={s.video}>
      <div className={s.player}>
        {ytSrc ? (
          <iframe
            key={ytSrc}
            src={ytSrc}
            title={`סרטון: ${video.title}`}
            loading={priority ? 'eager' : 'lazy'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={ref}
            src={video.src}
            poster={video.poster}
            controls
            playsInline
            preload="metadata"
            aria-label={`סרטון: ${video.title}`}
            onTimeUpdate={e => {
              const k = chapterAt(e.currentTarget.currentTime)
              if (k !== active) setActive(k)
            }}
          />
        )}
      </div>
      <figcaption className="sr-only">{video.title}</figcaption>
      <div className={s.chips} role="group" aria-label={`פרקים בסרטון ${video.title}`}>
        {video.chapters.map((c, i) => (
          <button
            key={c.t}
            type="button"
            className={s.chip}
            aria-current={i === active ? 'true' : undefined}
            aria-label={`${c.label}, דקה ${fmt(c.t)}`}
            onClick={() => jump(i)}
          >
            <span dir="ltr" aria-hidden="true">{fmt(c.t)}</span>
            {c.label}
          </button>
        ))}
      </div>
    </figure>
  )
}
