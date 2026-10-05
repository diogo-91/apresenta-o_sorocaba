import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { ActiveScreenProvider } from './hooks/useActiveScreen'
import { useKeyboardNav } from './hooks/useKeyboardNav'
import { MobileCTA } from './components/navigation/MobileCTA'
import { ProgressBar } from './components/navigation/ProgressBar'
import { SideRail } from './components/navigation/SideRail'
import { TopBar } from './components/navigation/TopBar'
import { SystemShiftStage } from './components/technical/SystemShiftStage'
import { HeroSection } from './sections/HeroSection'
import { AboutSection } from './sections/AboutSection'
import { VideoSection } from './sections/VideoSection'
import { FragmentationSection } from './sections/FragmentationSection'
import { UnifiedModelSection } from './sections/UnifiedModelSection'
import { OperationsMapSection } from './sections/OperationsMapSection'
import { TechnicalAreasSection } from './sections/TechnicalAreasSection'
import { SafetySection } from './sections/SafetySection'
import { MethodSection } from './sections/MethodSection'
import { ARTSection } from './sections/ARTSection'
import { CasesSection } from './sections/CasesSection'
import { DifferentialsSection } from './sections/DifferentialsSection'
import { AirportSection } from './sections/AirportSection'
import { CTASection } from './sections/CTASection'

export default function App() {
  useKeyboardNav()

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <ActiveScreenProvider>
          <a href="#quem-somos" className="label-mono fixed left-4 top-4 z-[60] -translate-y-24 bg-fg px-3 py-2 text-ink focus:translate-y-0">
            Pular para o conteúdo
          </a>
          <ProgressBar />
          <TopBar />
          <SideRail />
          <main className="pb-mobile-cta">
            <HeroSection />
            <AboutSection />
            <VideoSection />
            <SystemShiftStage>
              <FragmentationSection />
              <UnifiedModelSection />
            </SystemShiftStage>
            <OperationsMapSection />
            <TechnicalAreasSection />
            <SafetySection />
            <MethodSection />
            <ARTSection />
            <CasesSection />
            <DifferentialsSection />
            <AirportSection />
            <CTASection />
          </main>
          <MobileCTA />
        </ActiveScreenProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
