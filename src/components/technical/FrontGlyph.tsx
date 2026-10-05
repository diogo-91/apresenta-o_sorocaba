import type { FrontId } from '../../data/services'

const glyphs: Record<FrontId, string> = {
  envoltoria: 'M10 70 V40 L40 52 V40 L70 52 V40 L100 52 V70 Z M40 40 V52 M70 40 V52 M10 40 V52',
  sistemas: 'M10 40 H34 L42 24 L54 56 L62 40 H76 M86 40 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M86 26 V18 M86 62 V54 M72 40 H76',
  'ativos-pesados': 'M10 16 H100 M55 16 V34 M48 34 H62 M55 34 V40 c0 6 -8 6 -8 2 M30 52 H80 V72 H30 Z M38 52 V44 H72 V52',
  utilidades: 'M30 14 H80 V44 H30 Z M30 22 H80 M40 44 L34 76 M70 44 L76 76 M36 60 L74 52 M74 60 L36 52 M55 44 V76',
}

export function FrontGlyph({ id, className = '' }: { id: FrontId; className?: string }) {
  return (
    <svg viewBox="0 0 110 86" fill="none" aria-hidden="true" className={className}>
      <path d={glyphs[id]} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
