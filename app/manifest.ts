import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hiro — פלטפורמת הגיוס החכמה',
    short_name: 'Hiro',
    description: 'Hiro מחברת בין מגייסים למועמדים באמצעות AI סמנטי, Job Sonar וסוכן קריירה אישי.',
    start_url: '/',
    display: 'standalone',
    lang: 'he',
    dir: 'rtl',
    background_color: '#ffffff',
    theme_color: '#534AB7',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
