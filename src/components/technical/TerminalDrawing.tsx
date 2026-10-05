import { useId, type ReactNode } from 'react'

const RIBS =
  'M361 225 l5.7 14.9 M421 203 l4.9 15.2 M482 186 l4.0 15.5 M543 172 l3.0 15.7 M604 163 l2.0 15.9 M664 157 l1.0 16.0 M725 155 l0 16 M786 157 l-1.0 16.0 M846 163 l-2.0 15.9 M907 172 l-3.0 15.7 M968 186 l-4.0 15.5 M1029 203 l-4.9 15.2 M1089 225 l-5.7 14.9'
const COLUMNS: [number, number][] = [
  [380, 218],
  [520, 177],
  [660, 157],
  [800, 158],
  [940, 179],
  [1080, 221],
]

function System({ id, focus, children }: { id: string; focus: string | null; children: ReactNode }) {
  const dimmed = focus !== null && focus !== id
  const active = focus === id
  return (
    <g
      data-system={id}
      className="transition-[opacity,color] duration-700 ease-mech"
      style={{ opacity: dimmed ? 0.22 : 1, color: active ? 'var(--color-accent)' : undefined }}
    >
      {children}
    </g>
  )
}

export function TerminalDrawing({ focus = null }: { focus?: string | null }) {
  const soil = `terrain-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <g fill="none" className="text-blueprint" stroke="currentColor" strokeWidth="1.25">
      <defs>
        <pattern id={soil} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="stroke-fg" strokeOpacity="0.1" />
        </pattern>
      </defs>

      <rect x="-200" y="540" width="2000" height="300" fill={`url(#${soil})`} stroke="none" />
      <path d="M1065 540 V215 M1085 540 V215 M1058 215 H1092 L1100 160 H1050 Z M1052 175 H1098" strokeOpacity="0.25" />

      <System id="reservatorios" focus={focus}>
        <path d="M50 540 L72 262 M130 540 L108 262 M58 460 L122 380 M122 460 L58 380 M62 330 L118 290" />
        <path d="M30 262 H150 V172 H30 Z M30 172 Q90 140 150 172 M30 200 H150" strokeWidth="1.5" />
        <path d="M90 540 V570 H400" strokeDasharray="5 5" strokeOpacity="0.6" />
      </System>

      <System id="eletrica" focus={focus}>
        <path d="M150 540 V400 H280 V540 M150 400 L215 370 L280 400" strokeOpacity="0.5" />
        <path d="M170 540 V460 H210 V540 M222 540 V470 H262 V540 M175 470 h30 M175 480 h30 M175 490 h30 M227 480 h30 M227 490 h30" />
        <path d="M190 460 V430 M242 470 V430 M182 430 h16 M234 430 h16" strokeWidth="1.5" />
        <path d="M280 525 H300 M300 470 H1150" strokeDasharray="6 4" strokeOpacity="0.55" />
      </System>

      <System id="cobertura" focus={focus}>
        <path d="M285 258 Q725 50 1165 258" strokeWidth="2.25" />
        <path d="M300 250 Q725 60 1150 250" />
        <path d={RIBS} strokeOpacity="0.7" />
      </System>

      <System id="estruturas" focus={focus}>
        {COLUMNS.map(([x, top]) => (
          <path key={x} d={`M${x} 540 V${top + 70} L${x - 34} ${top + 18} M${x} ${top + 70} L${x + 34} ${top + 18} M${x} ${top + 70} V${top + 12}`} strokeOpacity="0.8" />
        ))}
        <path d="M300 250 V540 M1150 250 V540 M300 400 H1150" strokeWidth="1.5" />
        {[1150].map((x) => (
          <path key={x} d="M1150 280 h14 M1150 320 h14 M1150 360 h14 M1150 440 h14 M1150 480 h14" strokeOpacity="0.6" />
        ))}
      </System>

      <g className="text-fg" strokeOpacity="0.35">
        <path d="M1300 372 Q1330 352 1400 350 H1620 M1290 405 Q1292 380 1300 372 M1290 405 Q1300 450 1360 452 H1620 M1318 378 h22 M1346 372 h14 M1372 370 h14" />
        <path d="M1460 452 L1520 520 H1580 L1540 452 M1500 486 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" />
      </g>

      <System id="equipamentos" focus={focus}>
        <path d="M1150 395 H1290 V428 H1150 M1180 395 V428 M1215 395 V428 M1250 395 V428" strokeWidth="1.5" />
        <path d="M1262 428 V528 M1248 528 H1276 M1252 540 a4 4 0 1 0 0.1 0 M1272 540 a4 4 0 1 0 0.1 0" />
        <path d="M900 528 H1100 M900 518 H1100 M910 518 v10 M940 518 v10 M970 518 v10 M1000 518 v10 M1030 518 v10 M1060 518 v10 M1090 518 v10" strokeOpacity="0.8" />
      </System>

      <System id="manutencao" focus={focus}>
        <path d="M1160 540 V482 H1240 V540 M1160 482 L1200 466 L1240 482 M1180 540 V505 H1205 V540" />
      </System>

      <System id="iluminacao" focus={focus}>
        <path d="M1440 540 V160 M1416 160 H1464 M1420 160 V146 H1460 V160 M1428 146 v-6 M1440 146 v-6 M1452 146 v-6 M1430 540 L1440 500 L1450 540" strokeWidth="1.5" />
        <path d="M1580 540 V200 M1560 200 H1600" strokeOpacity="0.5" />
      </System>

      <System id="confinados" focus={focus}>
        <path d="M400 580 H1000 V650 H400 Z M440 540 V580 M470 540 V580 M930 540 V580 M960 540 V580" strokeDasharray="7 5" />
        <path d="M1020 575 H1140 V680 H1020 Z M1060 540 V575 M1090 540 V575 M1020 640 H1140" strokeDasharray="7 5" />
      </System>

      <path d="M-200 540 H1800" className="text-fg" strokeOpacity="0.55" />
      <path d="M1300 548 H1340 M1370 548 H1410 M1440 548 H1480 M1510 548 H1550" className="text-fg" strokeOpacity="0.3" />

      <g className="fill-faint" stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        <text x="20" y="530">EL. ±0,00</text>
        <text x="420" y="672">GALERIA TÉCNICA</text>
        <text x="1300" y="340">AERONAVE · REF.</text>
        <text x="1032" y="150">TWR</text>
      </g>
    </g>
  )
}
