import type { ReactNode } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { EASE_MECH, VIEWPORT_ONCE } from '../../lib/motion'

type Props = {
  src: string | null
  alt: string
  caption: string
  scene: ReactNode
  className?: string
  labelPosition?: 'top' | 'bottom'
  fill?: boolean
}

export function MediaFrame({ src, alt, caption, scene, className = '', labelPosition = 'bottom', fill = false }: Props) {
  const reduced = useReducedMotion()
  return (
    <m.figure
      data-cursor="explore"
      className={`group overflow-hidden ${fill ? 'absolute inset-0' : 'relative'} ${className}`}
      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      whileInView={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration: 1.2, ease: EASE_MECH }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out-mech group-hover:scale-[1.03]"
        />
      ) : (
        <div role="img" aria-label={`${alt} (foto a inserir)`} className="absolute inset-0 transition-transform duration-[1200ms] ease-out-mech group-hover:scale-[1.03]">
          {scene}
        </div>
      )}
      <figcaption
        className={`label-mono absolute left-5 flex max-w-[calc(100%-2.5rem)] items-center gap-2 bg-paper/80 px-2 py-1 text-fg/80 backdrop-blur-[2px] ${labelPosition === 'top' ? 'top-5' : 'bottom-5'}`}
      >
        {!src && <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />}
        {!src && <span className="shrink-0 text-accent-ink">Foto a inserir ·</span>}
        <span className="truncate">{caption}</span>
      </figcaption>
    </m.figure>
  )
}
