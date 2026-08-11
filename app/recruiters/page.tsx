import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { RecruiterHero } from '@/components/recruiters/RecruiterHero'
import { RecruiterPains } from '@/components/recruiters/RecruiterPains'
import { RecruiterFeaturesBig } from '@/components/recruiters/RecruiterFeaturesBig'
import { RecruiterHowItWorks } from '@/components/recruiters/RecruiterHowItWorks'
import { RecruiterCTA } from '@/components/recruiters/RecruiterCTA'

export const metadata: Metadata = {
  title: 'Hiro למגייסים — AI Recruitment OS',
  description: 'מנוע התאמה סמנטי, Job Sonar לאיתור מועמדים פסיביים, CRM מקיף ותקשורת בתפוצה — הכל במקום אחד.',
  keywords: ['מערכת גיוס למגייסים', 'AI בגיוס', 'Job Sonar', 'גיוס מועמדים פסיביים', 'CRM לגיוס', 'ATS'],
  alternates: { canonical: '/recruiters' },
  openGraph: {
    title: 'Hiro למגייסים — AI Recruitment OS',
    description: 'גייסו מהר יותר עם AI שמבין אנשים. Job Sonar, AI Match ו-CRM מלא.',
    url: '/recruiters',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/images/og-image.png', width: 1200, height: 630, alt: 'Hiro למגייסים' }],
  },
}

export default function RecruitersPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <RecruiterHero />
        <RecruiterPains />
        <RecruiterFeaturesBig />
        <RecruiterHowItWorks />
        <RecruiterCTA />
      </main>
      <Footer />
    </>
  )
}
