import type { Slide } from './components/deck/Deck'
import { fronts } from './data/services'
import { CoverSection } from './sections/CoverSection'
import { HeroSection } from './sections/HeroSection'
import { AboutSection } from './sections/AboutSection'
import { VideoSection } from './sections/VideoSection'
import { FragmentationSection } from './sections/FragmentationSection'
import { UnifiedModelSection } from './sections/UnifiedModelSection'
import { OperationsMapSection } from './sections/OperationsMapSection'
import { FrontScreen } from './sections/TechnicalAreasSection'
import { SafetySection } from './sections/SafetySection'
import { MethodSection } from './sections/MethodSection'
import { ARTSection } from './sections/ARTSection'
import { CasesSection } from './sections/CasesSection'
import { DifferentialsSection } from './sections/DifferentialsSection'
import { AirportSection } from './sections/AirportSection'
import { PreparationSection } from './sections/PreparationSection'
import { CTASection } from './sections/CTASection'
import { ClosingSection } from './sections/ClosingSection'

export const slides: Slide[] = [
  { id: 'capa', node: <CoverSection /> },
  { id: 'inicio', node: <HeroSection /> },
  { id: 'quem-somos', node: <AboutSection /> },
  { id: 'video', node: <VideoSection /> },
  { id: 'desafio', node: <FragmentationSection /> },
  { id: 'modelo', node: <UnifiedModelSection /> },
  { id: 'mapa', node: <OperationsMapSection /> },
  ...fronts.map((front, i) => ({ id: front.id, node: <FrontScreen front={front} index={i} /> })),
  { id: 'seguranca', node: <SafetySection /> },
  { id: 'metodo', node: <MethodSection /> },
  { id: 'arts', node: <ARTSection /> },
  { id: 'cases', node: <CasesSection /> },
  { id: 'diferenciais', node: <DifferentialsSection /> },
  { id: 'grandes-operacoes', node: <AirportSection /> },
  { id: 'preparacao', node: <PreparationSection /> },
  { id: 'parceria', node: <CTASection /> },
  { id: 'encerramento', node: <ClosingSection /> },
]
