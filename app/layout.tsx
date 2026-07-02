import type { Metadata } from 'next'
import { Assistant } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const assistant = Assistant({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hiro — פלטפורמת הגיוס החכמה',
  description: 'Hiro מחברת בין מגייסים למועמדים באמצעות AI סמנטי, אוטומציה מלאה וחוויית משתמש חסרת תקדים.',
  keywords: ['גיוס', 'דרושים', 'AI', 'פלטפורמת גיוס', 'ניהול מועמדים'],
  openGraph: {
    title: 'Hiro — פלטפורמת הגיוס החכמה',
    description: 'מגייסים ומועמדים — יחד, חכם יותר.',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={assistant.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
