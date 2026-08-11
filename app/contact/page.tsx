import type { Metadata } from 'next'
import { ContactPageClient } from '@/components/ContactPageClient'

export const metadata: Metadata = {
  title: 'צרו קשר',
  description: 'שאלות על פלטפורמת הגיוס Hiro, בקשה לדמו, או כל דבר אחר — נשמח לשמוע מכם.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'צרו קשר | Hiro',
    description: 'שאלות על פלטפורמת הגיוס Hiro, בקשה לדמו, או כל דבר אחר — נשמח לשמוע מכם.',
    url: '/contact',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}
