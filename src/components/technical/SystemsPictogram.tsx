const ART: Record<string, string> = {
  power: 'M60 10 L46 82 M60 10 L74 82 M52 50 H68 M49 66 H71 M55 32 H65 M54 34 L66 48 M66 34 L54 48 M51 52 L69 64 M69 52 L51 64 M30 22 H90 M30 22 L46 30 M90 22 L74 30 M0 30 Q16 36 30 22 M90 22 Q104 36 120 30 M38 82 H82',
  panel: 'M38 10 H82 V82 H38 Z M42 14 H78 V78 H42 Z M48 22 H56 V34 H48 Z M60 22 H68 V34 H60 Z M48 40 H56 V52 H48 Z M60 40 H68 V52 H60 Z M48 60 H72 M48 66 H66 M74 44 V50',
  control: 'M20 46 H44 M44 46 L62 34 M66 46 H100 M66 40 V52 M30 22 H90 V70 H30 Z M52 60 V70 M52 22 V30 M84 30 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0',
  lighting: 'M60 4 V24 M44 24 H76 L84 40 H36 Z M40 40 L22 86 M60 40 V86 M80 40 L98 86 M30 64 H90',
  motor: 'M24 30 H76 V66 H24 Z M30 30 V66 M36 30 V66 M42 30 V66 M48 30 V66 M54 30 V66 M60 30 V66 M66 30 V66 M76 40 H84 V56 H76 M84 48 H104 M40 20 H58 V30 H40 Z M28 66 V76 H44 V66 M58 66 V76 H74 V66 M18 76 H82',
  drive: 'M10 48 H44 M76 48 H110 M44 32 H54 V64 H44 Z M66 32 H76 V64 H66 Z M54 40 H66 M54 56 H66 M48 30 V26 M72 30 V26',
  transmission: 'M40 46 m-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M90 46 m-12 0 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M40 26 L90 34 M40 66 L90 58 M40 46 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M90 46 m-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0',
  machine: 'M18 22 H78 V70 H18 Z M26 30 H54 V50 H26 Z M62 30 H72 V40 H62 Z M62 46 H72 M78 56 H112 V64 H78 M84 64 V76 M106 64 V76 M86 60 m-2 0 a2 2 0 1 0 4 0 M98 60 m-2 0 a2 2 0 1 0 4 0 M14 70 H82 V76 H14 Z',
}

export function SystemsPictogram({ id, className = '' }: { id: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
      <path d={ART[id]} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}
