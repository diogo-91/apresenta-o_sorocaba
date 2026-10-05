import { lazy, type ComponentType } from 'react'
import type { Slide } from './components/deck/Deck'
import { fronts, type TechnicalFront } from './data/services'
import { SYSTEMS_STEPS } from './data/systemsFlow'
import { CoverSection } from './sections/CoverSection'
import { HeroSection } from './sections/HeroSection'

type Loader = () => Promise<ComponentType>

function deferred(load: Loader) {
  const Component = lazy(() => load().then((C) => ({ default: C })))
  return { Component, load }
}

const sections = {
  about: deferred(() => import('./sections/AboutSection').then((m) => m.AboutSection)),
  fragmentation: deferred(() => import('./sections/FragmentationSection').then((m) => m.FragmentationSection)),
  unified: deferred(() => import('./sections/UnifiedModelSection').then((m) => m.UnifiedModelSection)),
  safety: deferred(() => import('./sections/SafetySection').then((m) => m.SafetySection)),
  method: deferred(() => import('./sections/MethodSection').then((m) => m.MethodSection)),
  arts: deferred(() => import('./sections/ARTSection').then((m) => m.ARTSection)),
  cases: deferred(() => import('./sections/CasesSection').then((m) => m.CasesSection)),
  differentials: deferred(() => import('./sections/DifferentialsSection').then((m) => m.DifferentialsSection)),
  airport: deferred(() => import('./sections/AirportSection').then((m) => m.AirportSection)),
  cta: deferred(() => import('./sections/CTASection').then((m) => m.CTASection)),
}

const loadFront = () => import('./sections/TechnicalAreasSection').then((m) => m.FrontScreen)
const FrontScreen = lazy(() => loadFront().then((C) => ({ default: C as ComponentType<{ front: TechnicalFront }> })))

function slide(id: string, entry: ReturnType<typeof deferred>, steps?: number): Slide {
  const { Component, load } = entry
  return { id, node: <Component />, steps, preload: load }
}

export const slides: Slide[] = [
  { id: 'capa', node: <CoverSection /> },
  { id: 'inicio', node: <HeroSection /> },
  slide('quem-somos', sections.about, 7),
  slide('desafio', sections.fragmentation, 2),
  slide('modelo', sections.unified, 2),
  ...fronts.map((front) => ({ id: front.id, node: <FrontScreen front={front} />, steps: front.id === 'sistemas' ? SYSTEMS_STEPS : undefined, preload: loadFront })),
  slide('seguranca', sections.safety),
  slide('metodo', sections.method, 6),
  slide('arts', sections.arts, 2),
  slide('cases', sections.cases, 4),
  slide('grandes-operacoes', sections.airport, 6),
  slide('diferenciais', sections.differentials),
  slide('parceria', sections.cta),
]
