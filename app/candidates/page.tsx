import type { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'
import { CandidateHero } from '@/components/candidates/CandidateHero'
import { CandidatePains } from '@/components/candidates/CandidatePains'
import { CandidateFeaturesBig } from '@/components/candidates/CandidateFeaturesBig'
import { CandidateHowItWorks } from '@/components/candidates/CandidateHowItWorks'
import { CandidateTestimonials } from '@/components/candidates/CandidateTestimonials'
import { CandidateCTA } from '@/components/candidates/CandidateCTA'

export const metadata: Metadata = {
  title: 'Hiro למועמדים — קריירה חכמה, מנוהלת אוטומטית',
  description: 'סוכן קריירה AI, ריבוי פרופילים, מעקב הגשות ועדכון בשידור חי למגייסים — הכל במקום אחד, בחינם.',
  openGraph: {
    title: 'Hiro למועמדים — קריירה חכמה, מנוהלת אוטומטית',
    description: 'הפלטפורמה שעובדת בשבילך 24/7 כדי שתמצא את העבודה הבאה שלך.',
    locale: 'he_IL',
    type: 'website',
  },
}

export default function CandidatesPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <CandidateHero />
        <CandidatePains />
        <CandidateFeaturesBig />
        <CandidateHowItWorks />
        <CandidateTestimonials />
        <CandidateCTA />
      </main>
      <Footer />
    </>
  )
}
