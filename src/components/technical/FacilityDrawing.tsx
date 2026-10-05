import { useId, type ReactNode } from 'react'
import { facilityZones } from '../../data/facility'

const TEETH = [120, 305, 490, 675]
const COLUMNS = [160, 360, 560, 760]
const NETWORK = ['casa-de-maquinas', 'utilidades', 'area-produtiva', 'espacos-confinados', 'reservatorios']
  .map((id) => facilityZones.find((z) => z.id === id)!)
  .map((z, i) => `${i === 0 ? 'M' : 'L'}${z.x} ${z.y}`)
  .join(' ')

export const FACILITY_VIEWBOX = { width: 1200, height: 720 }

function Layer({ id, revealed, current, children }: { id: string; revealed: boolean; current: boolean; children: ReactNode }) {
  return (
    <g data-layer={id} data-on={revealed} className={`draw-layer transition-colors duration-700 ${current ? 'text-accent' : ''}`}>
      {children}
    </g>
  )
}

export function FacilityDrawing({ revealed = 6, current = -1 }: { revealed?: number; current?: number }) {
  const soil = `soil-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const layer = (i: number) => ({ revealed: revealed > i, current: current === i })

  return (
    <svg viewBox={`0 0 ${FACILITY_VIEWBOX.width} ${FACILITY_VIEWBOX.height}`} fill="none" aria-hidden="true" className="h-auto w-full">
      <defs>
        <pattern id={soil} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" className="stroke-fg" strokeOpacity="0.12" />
        </pattern>
      </defs>

      <rect x="0" y="540" width="1200" height="180" fill={`url(#${soil})`} />
      <line x1="0" y1="540" x2="1200" y2="540" className="stroke-fg" strokeOpacity="0.6" />

      <g className="text-blueprint" stroke="currentColor" strokeWidth="1.25">
        <Layer id="estrutura" {...layer(0)}>
          <path data-draw pathLength={1} d="M120 260 V540 M860 260 V540" strokeWidth="2" />
          {COLUMNS.map((x) => (
            <path key={x} data-draw pathLength={1} d={`M${x} 262 V540`} strokeOpacity="0.75" />
          ))}
          <path data-draw pathLength={1} d="M120 276 H860" strokeOpacity="0.6" />
          {TEETH.map((x) => (
            <path key={`t-${x}`} data-draw pathLength={1} d={`M${x} 276 L${x + 92} 262 L${x + 185} 276`} strokeOpacity="0.45" />
          ))}
          <path data-draw pathLength={1} d="M120 320 H136 M120 380 H136 M120 440 H136 M120 500 H136" strokeOpacity="0.6" />
        </Layer>

        <Layer id="cobertura" {...layer(1)}>
          {TEETH.map((x) => (
            <g key={x}>
              <path data-draw pathLength={1} d={`M${x} 260 V190 L${x + 185} 260`} strokeWidth="1.75" />
              <path data-draw pathLength={1} d={`M${x + 5} 198 V256 M${x + 11} 204 V256`} strokeOpacity="0.6" />
            </g>
          ))}
        </Layer>

        <Layer id="sistemas" {...layer(2)}>
          <path data-draw pathLength={1} d="M140 298 H840 M140 312 H840" />
          {[220, 420, 620, 820].map((x) => (
            <path key={x} data-draw pathLength={1} d={`M${x} 276 V298`} strokeOpacity="0.5" />
          ))}
          <path data-draw pathLength={1} d="M860 420 H980 V540 H860 Z" strokeWidth="1.5" />
          <circle data-draw pathLength={1} cx="905" cy="490" r="22" />
          <path data-draw pathLength={1} d="M927 490 H960 M950 470 V510" />
          <path data-fade d="M840 305 H900 V420" strokeDasharray="4 4" />
        </Layer>

        <Layer id="equipamentos" {...layer(3)}>
          <g className="text-fg" stroke="currentColor" strokeOpacity="0.8">
            <path data-draw pathLength={1} d="M190 470 H320 V540 H190 Z" />
            <path data-draw pathLength={1} d="M205 485 H305 M205 500 H260" strokeOpacity="0.5" />
            <path data-draw pathLength={1} d="M400 450 H550 V540 H400 Z" />
            <circle data-draw pathLength={1} cx="520" cy="480" r="18" />
            <path data-draw pathLength={1} d="M610 485 H730 V540 H610 Z M630 485 V465 H700 V485" />
            <path data-draw pathLength={1} d="M160 345 H760 M440 345 V360 H470 V345" strokeOpacity="0.5" />
          </g>
        </Layer>

        <Layer id="reservatorios" {...layer(4)}>
          <path data-draw pathLength={1} d="M1050 540 L1068 250 M1130 540 L1112 250 M1058 450 L1122 350 M1122 450 L1058 350 M1054 520 L1126 450 M1126 520 L1054 450" strokeOpacity="0.8" />
          <path data-draw pathLength={1} d="M1035 150 H1145 V250 H1035 Z" strokeWidth="1.75" />
          <path data-draw pathLength={1} d="M1035 150 L1090 128 L1145 150 M1035 176 H1145" strokeOpacity="0.7" />
          <path data-fade d="M1090 250 V300 Q1090 330 1000 330 H980" strokeOpacity="0.6" strokeDasharray="4 4" />
        </Layer>

        <Layer id="confinados" {...layer(5)}>
          <g className="text-fg" stroke="currentColor">
            <path data-fade d="M300 585 H540 V660 H300 Z M335 540 V585 M365 540 V585" strokeDasharray="6 5" strokeOpacity="0.75" />
            <path data-fade d="M600 590 H760 V650 H600 Z M640 540 V590" strokeDasharray="6 5" strokeOpacity="0.5" />
          </g>
        </Layer>
      </g>

      <g data-on={revealed >= 6} className="draw-layer text-accent" stroke="currentColor">
        <path data-fade d={NETWORK} strokeWidth="1.25" strokeDasharray="2 8" className="motion-safe:animate-[flow_5s_linear_infinite]" />
      </g>

      <g className="fill-faint" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        <text x="1190" y="535" textAnchor="end">EL. ±0,00</text>
        <text x="20" y="185">COBERTURA</text>
        <text x="20" y="700">SUBSOLO</text>
        <text x="1030" y="118">RESERVATÓRIO</text>
      </g>
      <g className="stroke-faint" strokeOpacity="0.6">
        <path d="M120 120 H860 M120 112 V128 M860 112 V128" />
      </g>
      <text x="490" y="108" textAnchor="middle" className="fill-faint" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="3">
        ESCOPO ÚNICO
      </text>
    </svg>
  )
}
