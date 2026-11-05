import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/ContactPageClient'

export const metadata: Metadata = {
  title: 'צרו קשר',
  description: 'שאלות על פלטפורמת הגיוס HirO, בקשה לדמו, או כל דבר אחר — נשמח לשמוע מכם.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'צרו קשר | HirO',
    description: 'שאלות על פלטפורמת הגיוס HirO, בקשה לדמו, או כל דבר אחר — נשמח לשמוע מכם.',
    url: '/contact',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
