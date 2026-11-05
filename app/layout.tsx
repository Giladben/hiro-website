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
const SITE_TITLE = 'HirO | מערכת גיוס ו-CRM למשרדי השמה ומגייסים'
const SITE_DESCRIPTION = 'Hiro היא מערכת גיוס ו-CRM למגייסים ולמשרדי השמה, ומרכז קריירה אישי למועמדים. תבנית התאמה שאתם מגדירים, Job Sonar שסורק את המאגר שלכם, ותקשורת בתפוצה מתוך המערכת.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | HirO',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'גיוס עובדים', 'מערכת גיוס', 'תוכנת גיוס', 'ATS', 'AI בגיוס',
    'בינה מלאכותית בגיוס', 'Job Sonar', 'גיוס מועמדים פסיביים',
    'סוכן קריירה AI', 'קורות חיים AI', 'CRM לגיוס', 'פלטפורמת גיוס',
  ],
  authors: [{ name: 'HirO' }],
  robots: { index: true, follow: true },
  // No site-wide canonical: a page without its own would inherit the home page's
  openGraph: {
    title: SITE_TITLE,
    description: 'מגייסים ומועמדים — יחד, חכם יותר.',
    siteName: 'HirO',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'HirO, מערכת גיוס ו-CRM' }],
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
  '@id': `${SITE_URL}/#organization`,
  name: 'HirO',
  url: SITE_URL,
  logo: `${SITE_URL}/images/hiro-logo.png`,
  description: SITE_DESCRIPTION,
  parentOrganization: { '@type': 'Organization', name: 'מימד אנושי' },
  address: { '@type': 'PostalAddress', streetAddress: 'ההגנה 37', addressLocality: 'נתיבות', addressCountry: 'IL' },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'HirO',
  url: SITE_URL,
  inLanguage: 'he-IL',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${frank.variable} ${heebo.variable}`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd, websiteJsonLd]) }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
