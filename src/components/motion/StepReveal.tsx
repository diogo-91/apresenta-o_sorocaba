import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { usePresentationMode } from '../../hooks/usePresentationMode'
import { useSlideStep } from '../../hooks/useDeckPosition'
import { DURATION, EASE_OUT, VIEWPORT_ONCE } from '../../lib/motion'

type Props = { at: number; children: ReactNode; className?: string; y?: number; as?: 'div' | 'li' }

export function StepReveal({ at, children, className, y = 20, as = 'div' }: Props) {
  const deck = usePresentationMode() === 'deck'
  const step = useSlideStep()
  const Component = m[as]
  const shown = { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } }
  const hidden = { opacity: 0, y }
  if (!deck) {
    return (
      <Component className={className} initial={hidden} whileInView={shown} viewport={VIEWPORT_ONCE}>
        {children}
      </Component>
    )
  }
  return (
    <Component className={className} initial={hidden} animate={step >= at ? shown : hidden} aria-hidden={step < at || undefined}>
      {children}
    </Component>
  )
}
