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
  { id: 'desafio', node: <FragmentationSection />, steps: 2 },
  { id: 'modelo', node: <UnifiedModelSection />, steps: 2 },
  { id: 'mapa', node: <OperationsMapSection />, steps: 6 },
  ...fronts.map((front) => ({ id: front.id, node: <FrontScreen front={front} /> })),
  { id: 'seguranca', node: <SafetySection /> },
  { id: 'metodo', node: <MethodSection />, steps: 6 },
  { id: 'arts', node: <ARTSection />, steps: 2 },
  { id: 'cases', node: <CasesSection />, steps: 4 },
  { id: 'diferenciais', node: <DifferentialsSection /> },
  { id: 'grandes-operacoes', node: <AirportSection />, steps: 6 },
  { id: 'preparacao', node: <PreparationSection /> },
  { id: 'parceria', node: <CTASection /> },
  { id: 'encerramento', node: <ClosingSection /> },
]
