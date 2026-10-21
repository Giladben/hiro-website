// Sales videos for /why-hiro and the home page.
//
// Moving a video to YouTube (unlisted): paste its id into `youtubeId`
// (the part after "watch?v=" or "youtu.be/"). That's the whole change; the
// component switches from <video> to a youtube-nocookie embed automatically.

export type Chapter = { t: number; label: string }

export type SalesVideo = {
  id: 'S1' | 'S2' | 'S3' | 'S4'
  title: string
  description: string
  src: string
  poster: string
  youtubeId: string | null
  /** ISO 8601 duration, for VideoObject structured data */
  duration: string
  chapters: Chapter[]
}

const ch = (list: [number, string][]): Chapter[] => list.map(([t, label]) => ({ t, label }))

export const SALES_VIDEOS: Record<SalesVideo['id'], SalesVideo> = {
  S1: {
    id: 'S1',
    title: 'HirO ב-75 שניות',
    description: 'HirO קולטת כל קורות חיים, מסבירה כל התאמה, מסננת לבד ומראה לכם כל בוקר מה דורש טיפול. מערכת אחת למועמדים, למשרות וללקוחות.',
    src: '/videos/sales/S1-hiro-60sec.mp4',
    poster: '/videos/sales/p1.jpg',
    youtubeId: null,
    duration: 'PT1M15S',
    chapters: ch([[0, 'פתיחה'], [4.3, 'הבעיה'], [12.3, 'קליטה חכמה'], [24.5, 'התאמה שקופה'], [34.2, 'סונאר'], [42.5, 'סינון אוטומטי'], [51.9, 'שיתוף לקוח'], [60.5, 'דופק']]),
  },
  S2: {
    id: 'S2',
    title: 'מנוע ההתאמה',
    description: 'רוב המערכות מחפשות מילים. HirO מבינה משמעות, ונותנת לכם לקבוע מה חשוב בכל משרה.',
    src: '/videos/sales/S2-matching-engine.mp4',
    poster: '/videos/sales/p2.jpg',
    youtubeId: null,
    duration: 'PT1M',
    chapters: ch([[0, 'פתיחה'], [5, 'מילות מפתח'], [12.9, 'שפה חופשית'], [21.6, 'משקלות'], [30.6, 'קנסות'], [38.9, 'תבניות'], [46.6, 'שני כיוונים']]),
  },
  S3: {
    id: 'S3',
    title: 'אף ליד לא נופל',
    description: 'גיוס ומכירה באותה מערכת: כל קו״ח נוחת במקום הנכון, וכל שיחה מפעילה את הצעד הבא.',
    src: '/videos/sales/S3-no-lead-lost.mp4',
    poster: '/videos/sales/p3.jpg',
    youtubeId: null,
    duration: 'PT1M4S',
    chapters: ch([[0, 'פתיחה'], [7.6, 'איפה זה דולף'], [16.2, 'מייל לכל משרה'], [27.3, 'בונה תהליכים'], [38, 'מאגר חברות'], [47.7, 'מה דורש טיפול']]),
  },
  S4: {
    id: 'S4',
    title: 'מאגר שמתעדכן לבד',
    description: 'במקום שהרכז ירדוף אחרי עדכונים, המועמד מקבל אזור אישי ויש לו סיבה לחזור.',
    src: '/videos/sales/S4-live-pool.mp4',
    poster: '/videos/sales/p4.jpg',
    youtubeId: null,
    duration: 'PT57S',
    chapters: ch([[0, 'פתיחה'], [4.3, 'מאגר שמזדקן'], [12.8, 'אזור אישי'], [22.4, 'יועץ קריירה'], [32.7, 'עותקי צל'], [42.7, 'סרטון היכרות']]),
  },
}
