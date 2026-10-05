import { useId } from 'react'
import { BlueprintPlant } from './BlueprintPlant'

const uid = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, '')

const VP = { x: 700, y: 250 }
const STRIP_EDGES = Array.from({ length: 22 }, (_, i) => -1200 + i * 170)
const ROOF_STRIPS = STRIP_EDGES.slice(0, -1).map((a, i) => ({
  glass: i % 3 === 0,
  d: `M${a} 760 L${VP.x} ${VP.y} L${STRIP_EDGES[i + 1]} 760 Z`,
}))
const ROOF_RIBS = Array.from({ length: 106 }, (_, i) => `M${-1200 + i * 34} 760 L${VP.x} ${VP.y}`).join(' ')

export function RoofScene() {
  const id = uid(useId())
  return (
    <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="size-full motion-safe:animate-[kenburns_40s_ease-in-out_infinite_alternate]">
      <defs>
        <linearGradient id={`sky${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1f2e" />
          <stop offset="0.36" stopColor="#24465f" />
          <stop offset="0.37" stopColor="#1a2b38" />
          <stop offset="1" stopColor="#0a1117" />
        </linearGradient>
        <radialGradient id={`sun${id}`} cx="0.8" cy="0.12" r="0.6">
          <stop offset="0" stopColor="#ffd9b8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd9b8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`roof${id}`}>
          <rect x="0" y={VP.y} width="1000" height="460" />
        </clipPath>
      </defs>
      <rect width="1000" height="700" fill={`url(#sky${id})`} />
      <path d="M0 252 H120 V236 H210 V244 H330 V230 H360 V250 H470 V240 H560 V252 H1000 V258 H0 Z" fill="#0e1a23" opacity="0.8" />
      <g clipPath={`url(#roof${id})`}>
        {ROOF_STRIPS.map((s) => (
          <path key={s.d} d={s.d} fill={s.glass ? '#5fb0e6' : '#3b4a55'} fillOpacity={s.glass ? 0.32 : 0.55} />
        ))}
        <path d={ROOF_RIBS} stroke="#cfe6f7" strokeOpacity="0.14" strokeWidth="1" fill="none" />
      </g>
      <rect width="1000" height="700" fill={`url(#sun${id})`} />
      <path d="M0 700 L0 560 L1000 640 L1000 700 Z" fill="#0a1117" opacity="0.55" />
    </svg>
  )
}

export function MachineScene() {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="size-full" fill="none">
      <rect width="1200" height="800" className="fill-paper-2" />
      <g className="stroke-fg" strokeWidth="2">
        <path d="M120 720 H1180" strokeWidth="2.5" />
        <path d="M260 720 V610 H1060 V720" className="fill-surface" />
        <path d="M340 610 V120 H560 V610 M800 610 V120 H1020 V610" className="fill-surface-2" />
        <path d="M300 120 H1060 V40 H300 Z" className="fill-surface" />
        <path d="M560 260 H800 V380 H560 Z M600 380 V470 H760 V380 M620 470 H740 V500 H620 Z" className="fill-paper" />
        <path d="M380 160 h140 M380 200 h140 M840 160 h140 M840 200 h140" strokeWidth="1.25" strokeOpacity="0.5" />
        <path d="M600 540 H760 V610 H600 Z" className="fill-surface-2" />
        <circle cx="450" cy="80" r="22" className="fill-paper" />
        <circle cx="910" cy="80" r="22" className="fill-paper" />
      </g>
      <g className="stroke-fg" strokeOpacity="0.18">
        {Array.from({ length: 30 }, (_, i) => (
          <path key={i} d={`M${340 + i * 8} 610 L${340 + i * 8 + 40} 570`} />
        ))}
      </g>
      <g className="stroke-blueprint" strokeWidth="1.25">
        <path d="M1110 120 V720 M1100 120 H1120 M1100 720 H1120" />
        <path d="M300 760 H1060 M300 750 V770 M1060 750 V770" />
      </g>
      <g className="fill-blueprint" fontFamily="IBM Plex Mono, monospace" fontSize="15" letterSpacing="3">
        <text x="1128" y="425">H</text>
        <text x="660" y="790" textAnchor="middle">L</text>
      </g>
      <g className="fill-fg">
        <circle cx="190" cy="565" r="13" />
        <path d="M178 582 h24 l6 70 h-8 l-4 68 h-8 l-2 -60 l-2 60 h-8 l-4 -68 h-8 z" />
      </g>
      <g className="stroke-accent" strokeWidth="1.5">
        <path d="M150 552 V720 M142 552 H158 M142 720 H158" />
      </g>
      <text x="138" y="640" textAnchor="end" className="fill-accent-ink" fontFamily="IBM Plex Mono, monospace" fontSize="14" letterSpacing="2">
        1,80 m
      </text>
    </svg>
  )
}

export function ReservoirScene() {
  const id = uid(useId())
  return (
    <svg viewBox="0 0 900 800" preserveAspectRatio="xMidYMid slice" className="size-full" fill="none">
      <defs>
        <radialGradient id={`glow${id}`} cx="0.55" cy="0.78" r="0.5">
          <stop offset="0" stopColor="#5fb0e6" stopOpacity="0.28" />
          <stop offset="1" stopColor="#5fb0e6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="800" fill="#090c0f" />
      <rect width="900" height="800" fill={`url(#glow${id})`} />
      <g stroke="#5fb0e6" strokeWidth="1.5">
        <path d="M180 470 L220 160 M420 470 L380 160 M200 380 L400 250 M400 380 L200 250" strokeOpacity="0.6" />
        <path d="M150 160 H450 V40 H150 Z M150 40 Q300 0 450 40" strokeWidth="2" />
        <path d="M150 110 H450" strokeDasharray="6 6" strokeOpacity="0.7" />
        <path d="M150 112 H450 V160 H150 Z" fill="#5fb0e6" fillOpacity="0.12" stroke="none" />
      </g>
      <path d="M0 470 H900" stroke="#f1f3f4" strokeOpacity="0.5" />
      <g stroke="#f1f3f4" strokeOpacity="0.08">
        {Array.from({ length: 40 }, (_, i) => (
          <path key={i} d={`M${i * 26 - 200} 800 L${i * 26 + 130} 470`} />
        ))}
      </g>
      <g stroke="#5fb0e6" strokeWidth="1.75">
        <path d="M430 560 H820 V740 H430 Z" fill="#0d151c" />
        <path d="M520 470 V560 M560 470 V560 M520 500 H560 M520 530 H560" />
        <path d="M430 690 H820" strokeDasharray="5 5" strokeOpacity="0.7" />
      </g>
      <g fill="#ff5a1f">
        <circle cx="700" cy="620" r="5" className="motion-safe:animate-pulse" />
      </g>
      <path d="M700 620 L760 520 H860" stroke="#ff5a1f" strokeWidth="1" />
      <text x="770" y="510" fill="#f1f3f4" fillOpacity="0.7" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2">
        ATMOSFERA MONITORADA
      </text>
      <text x="460" y="590" fill="#f1f3f4" fillOpacity="0.5" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        ESPAÇO CONFINADO
      </text>
    </svg>
  )
}

export function PlantCropScene({ step, steps }: { step: number; steps: number }) {
  const t = steps > 1 ? step / (steps - 1) : 0
  const scale = 1.9 - 0.6 * Math.sin(t * Math.PI)
  const x = -30 + 60 * t
  const y = 12 - 24 * t
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper-2">
      <div className="blueprint-grid absolute inset-0" />
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-mech" style={{ transform: `translate(${x}%, ${y}%) scale(${scale})` }}>
        <BlueprintPlant className="size-full text-blueprint" />
      </div>
    </div>
  )
}

const GEAR: Record<string, string> = {
  mosquetao: 'M70 30 a40 40 0 0 1 80 0 V150 a40 40 0 0 1 -80 0 Z M70 60 L100 40 M150 40 V120 M95 150 h30',
  'trava-quedas': 'M110 0 V200 M80 60 H140 V140 H80 Z M95 80 h30 M95 100 h30 M140 100 h24 a12 12 0 0 1 0 24 h-24',
  detector: 'M70 20 H150 V180 H70 Z M84 36 H136 V92 H84 Z M92 110 h36 M92 126 h36 M100 160 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M100 20 V6 h20 V20',
  capacete: 'M40 140 Q40 50 110 50 Q180 50 180 140 Z M20 140 H200 V152 H20 Z M110 50 V140 M80 62 Q70 100 72 140 M140 62 Q150 100 148 140',
  ferramentas: 'M60 180 L120 40 L132 46 L74 186 Z M118 44 L126 20 L140 26 L132 50 M150 180 L170 70 M190 180 L170 70 M162 110 h16',
  cabo: 'M110 20 a80 80 0 1 1 -1 0 M110 50 a50 50 0 1 1 -1 0 M110 80 a20 20 0 1 1 -1 0 M190 100 Q210 160 170 200',
}

export function GearIllustration({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 220 210" className="size-full" fill="none" aria-hidden="true">
      <path d={GEAR[id]} stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
