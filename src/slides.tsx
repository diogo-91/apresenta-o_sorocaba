import { lazy, type ComponentType } from 'react'
import type { Slide } from './components/deck/Deck'
import { hasWebGL } from './hooks/useDeviceCapabilities'
import { fronts, type TechnicalFront } from './data/services'
import { CoverSection } from './sections/CoverSection'
import { HeroSection } from './sections/HeroSection'

type Loader = () => Promise<ComponentType>

function deferred(load: Loader) {
  const Component = lazy(() => load().then((C) => ({ default: C })))
  return { Component, load }
}

const sections = {
  about: deferred(() => import('./sections/AboutSection').then((m) => m.AboutSection)),
  video: deferred(() => import('./sections/VideoSection').then((m) => m.VideoSection)),
  fragmentation: deferred(() => import('./sections/FragmentationSection').then((m) => m.FragmentationSection)),
  unified: deferred(() => import('./sections/UnifiedModelSection').then((m) => m.UnifiedModelSection)),
  map: deferred(() => import('./sections/OperationsMapSection').then((m) => m.OperationsMapSection)),
  safety: deferred(() => import('./sections/SafetySection').then((m) => m.SafetySection)),
  method: deferred(() => import('./sections/MethodSection').then((m) => m.MethodSection)),
  arts: deferred(() => import('./sections/ARTSection').then((m) => m.ARTSection)),
  cases: deferred(() => import('./sections/CasesSection').then((m) => m.CasesSection)),
  differentials: deferred(() => import('./sections/DifferentialsSection').then((m) => m.DifferentialsSection)),
  airport: deferred(() => import('./sections/AirportSection').then((m) => m.AirportSection)),
  preparation: deferred(() => import('./sections/PreparationSection').then((m) => m.PreparationSection)),
  cta: deferred(() => import('./sections/CTASection').then((m) => m.CTASection)),
  closing: deferred(() => import('./sections/ClosingSection').then((m) => m.ClosingSection)),
}

const loadFront = () => import('./sections/TechnicalAreasSection').then((m) => m.FrontScreen)
const FrontScreen = lazy(() => loadFront().then((C) => ({ default: C as ComponentType<{ front: TechnicalFront }> })))

function slide(id: string, entry: ReturnType<typeof deferred>, steps?: number): Slide {
  const { Component, load } = entry
  return { id, node: <Component />, steps, preload: load }
}

export const slides: Slide[] = [
  { id: 'capa', node: <CoverSection /> },
  { id: 'inicio', node: <HeroSection />, steps: 2, preload: () => (hasWebGL() ? import('./components/three/HeroStage') : Promise.resolve()) },
  slide('quem-somos', sections.about),
  slide('video', sections.video),
  slide('desafio', sections.fragmentation, 2),
  slide('modelo', sections.unified, 2),
  slide('mapa', sections.map, 7),
  ...fronts.map((front) => ({ id: front.id, node: <FrontScreen front={front} />, preload: loadFront })),
  slide('seguranca', sections.safety),
  slide('metodo', sections.method, 6),
  slide('arts', sections.arts, 2),
  slide('cases', sections.cases, 4),
  slide('diferenciais', sections.differentials),
  slide('grandes-operacoes', sections.airport, 6),
  slide('preparacao', sections.preparation),
  slide('parceria', sections.cta),
  slide('encerramento', sections.closing),
]
