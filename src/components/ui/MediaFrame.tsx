import type { ReactNode } from 'react'

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
  return (
    <figure data-cursor="explore" className={`group overflow-hidden ${fill ? 'absolute inset-0' : 'relative'} ${className}`}>
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
        className={`label-mono absolute left-5 flex items-center gap-2 bg-paper/80 px-2 py-1 text-fg/80 backdrop-blur-[2px] ${labelPosition === 'top' ? 'top-5' : 'bottom-5'}`}
      >
        {!src && <span aria-hidden="true" className="size-1.5 bg-accent" />}
        {caption}
        {!src && <span className="text-faint">· foto a inserir</span>}
      </figcaption>
    </figure>
  )
}
