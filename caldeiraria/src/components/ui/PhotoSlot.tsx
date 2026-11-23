import { CornerMarks } from './CornerMarks'

type Props = {
  src: string | null
  alt: string
  code: string
  caption: string
  className?: string
}

export function PhotoSlot({ src, alt, code, caption, className = 'aspect-[4/3]' }: Props) {
  return (
    <figure className={`relative overflow-hidden bg-paper-2 ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div role="img" aria-label={`${alt} (foto a inserir)`} className="hatch absolute inset-0">
          <svg aria-hidden="true" className="absolute inset-0 size-full text-line-strong" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-2 bg-paper-2 px-4 py-3 text-center">
              <span className="relative block size-6">
                <span className="absolute left-1/2 top-0 h-full w-px bg-accent" />
                <span className="absolute left-0 top-1/2 h-px w-full bg-accent" />
              </span>
              <span className="label-mono text-muted">Foto de campo · a inserir</span>
            </div>
          </div>
        </div>
      )}
      <CornerMarks className="border-fg/50" />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-paper/90 to-transparent px-3 pb-2.5 pt-8">
        <span className="label-mono text-fg/80">{caption}</span>
        <span className="label-mono text-faint">{code}</span>
      </figcaption>
    </figure>
  )
}
