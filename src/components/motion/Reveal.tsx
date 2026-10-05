import type { ReactNode } from 'react'
import { m } from 'framer-motion'
import { DURATION, EASE_OUT, VIEWPORT_ONCE } from '../../lib/motion'

type Props = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'p'
}

export function Reveal({ children, delay = 0, y = 18, className, as = 'div' }: Props) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  )
}
