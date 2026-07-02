import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Platform } from '@/components/Platform'
import { BentoFeatures } from '@/components/BentoFeatures'
import { Screenshots } from '@/components/Screenshots'
import { HowItWorks } from '@/components/HowItWorks'
import { Testimonials } from '@/components/Testimonials'
import { CTA } from '@/components/CTA'
import { Footer } from '@/components/Footer'
import { AccessibilityWidget } from '@/components/AccessibilityWidget'

export default function Home() {
  return (
    <>
      <a href="#main-content" className="skip-link">דלג לתוכן הראשי</a>
      <AccessibilityWidget />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Platform />
        <BentoFeatures />
        <Screenshots />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
