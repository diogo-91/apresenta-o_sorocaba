import { lazy, type ComponentType } from 'react'
import type { Slide } from './components/deck/Deck'
import { operations, PROCESS_STEPS, type Operation } from './data/operations'
import { CoverSection } from './sections/CoverSection'

type Loader = () => Promise<ComponentType>

function deferred(load: Loader) {
  const Component = lazy(() => load().then((C) => ({ default: C })))
  return { Component, load }
}

const sections = {
  process: deferred(() => import('./sections/ProcessSection').then((m) => m.ProcessSection)),
  quality: deferred(() => import('./sections/QualitySection').then((m) => m.QualitySection)),
  contact: deferred(() => import('./sections/ContactSection').then((m) => m.ContactSection)),
}

const loadOperation = () => import('./sections/OperationSection').then((m) => m.OperationSection)
const OperationSection = lazy(() => loadOperation().then((C) => ({ default: C as ComponentType<{ op: Operation }> })))

function slide(id: string, entry: ReturnType<typeof deferred>, steps?: number): Slide {
  const { Component, load } = entry
  return { id, node: <Component />, steps, preload: load }
}

export const slides: Slide[] = [
  { id: 'capa', node: <CoverSection /> },
  slide('processo', sections.process, PROCESS_STEPS),
  ...operations.map((op) => ({ id: op.id, node: <OperationSection op={op} />, preload: loadOperation })),
  slide('qualidade', sections.quality),
  slide('contato', sections.contact),
]
