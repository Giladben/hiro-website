import type { Metadata, Viewport } from 'next'
import { Frank_Ruhl_Libre, Heebo } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const frank = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  variable: '--font-frank',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  variable: '--font-heebo',
  display: 'swap',
})

const SITE_URL = 'https://hiro.co.il'
const SITE_TITLE = 'Hiro — פלטפורמת הגיוס החכמה'
const SITE_DESCRIPTION = 'Hiro היא מערכת גיוס ו-CRM למגייסים ולמשרדי השמה, ומרכז קריירה אישי למועמדים. תבנית התאמה שאתם מגדירים, Job Sonar שסורק את המאגר שלכם, ותקשורת בתפוצה מתוך המערכת.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Hiro',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'גיוס עובדים', 'מערכת גיוס', 'תוכנת גיוס', 'ATS', 'AI בגיוס',
    'בינה מלאכותית בגיוס', 'Job Sonar', 'גיוס מועמדים פסיביים',
    'סוכן קריירה AI', 'קורות חיים AI', 'CRM לגיוס', 'פלטפורמת גיוס',
  ],
  authors: [{ name: 'Hiro' }],
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
  openGraph: {
    title: SITE_TITLE,
    description: 'מגייסים ומועמדים — יחד, חכם יותר.',
    url: SITE_URL,
    siteName: 'Hiro',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Hiro — פלטפורמת הגיוס החכמה' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: 'מגייסים ומועמדים — יחד, חכם יותר.',
    images: ['/images/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#F6F5F1',
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hiro',
  url: SITE_URL,
  logo: `${SITE_URL}/images/hiro-logo.png`,
  description: SITE_DESCRIPTION,
  sameAs: [],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${heebo.variable}`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
