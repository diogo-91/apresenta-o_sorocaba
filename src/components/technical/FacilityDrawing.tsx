import { useId } from 'react'

const TEETH = [120, 305, 490, 675]
const COLUMNS = [160, 360, 560, 760]

export const FACILITY_VIEWBOX = { width: 1200, height: 720 }

export function FacilityDrawing() {
  const soil = `soil-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  return (
    <svg viewBox={`0 0 ${FACILITY_VIEWBOX.width} ${FACILITY_VIEWBOX.height}`} fill="none" aria-hidden="true" className="h-auto w-full">
      <defs>
        <pattern id={soil} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#6b757c" strokeOpacity="0.18" />
        </pattern>
      </defs>

      <rect x="0" y="540" width="1200" height="180" fill={`url(#${soil})`} />
      <line x1="0" y1="540" x2="1200" y2="540" stroke="#0e1114" strokeOpacity="0.7" />

      <g stroke="#2b7fc0" strokeWidth="1.25">
        {TEETH.map((x) => (
          <g key={x}>
            <path d={`M${x} 260 V190 L${x + 185} 260`} />
            <path d={`M${x + 5} 198 V256 M${x + 11} 204 V256`} strokeOpacity="0.6" />
          </g>
        ))}
        <path d="M120 260 V540 M860 260 V540" strokeWidth="2" />
        {COLUMNS.map((x) => (
          <path key={x} d={`M${x} 262 V540`} strokeOpacity="0.7" />
        ))}
        <path d="M120 276 H860" strokeOpacity="0.6" />
        {TEETH.map((x) => (
          <path key={`t-${x}`} d={`M${x} 276 L${x + 92} 262 L${x + 185} 276`} strokeOpacity="0.4" />
        ))}
        <path d="M120 320 H136 M120 380 H136 M120 440 H136 M120 500 H136" strokeOpacity="0.6" />
      </g>

      <g stroke="#0e1114" strokeOpacity="0.55">
        <path d="M140 298 H840 M140 312 H840" />
        {[220, 420, 620, 820].map((x) => (
          <path key={x} d={`M${x} 276 V298`} strokeOpacity="0.5" />
        ))}
        <path d="M840 305 H900 V420" strokeDasharray="4 4" />
      </g>

      <g stroke="#0e1114" strokeOpacity="0.75">
        <rect x="190" y="470" width="130" height="70" />
        <path d="M205 485 H305 M205 500 H260" strokeOpacity="0.5" />
        <rect x="400" y="450" width="150" height="90" />
        <circle cx="520" cy="480" r="18" />
        <rect x="610" y="485" width="120" height="55" />
        <path d="M630 485 V465 H700 V485" />
      </g>

      <g stroke="#2b7fc0" strokeWidth="1.25">
        <rect x="860" y="420" width="120" height="120" />
        <circle cx="905" cy="490" r="22" strokeOpacity="0.8" />
        <path d="M927 490 H960 M950 470 V510" strokeOpacity="0.8" />
      </g>

      <g stroke="#2b7fc0" strokeWidth="1.25">
        <path d="M1050 540 L1068 250 M1130 540 L1112 250 M1058 450 L1122 350 M1122 450 L1058 350 M1054 520 L1126 450 M1126 520 L1054 450" strokeOpacity="0.75" />
        <rect x="1035" y="150" width="110" height="100" />
        <path d="M1035 150 L1090 128 L1145 150 M1035 176 H1145" strokeOpacity="0.7" />
        <path d="M1090 250 V300 Q1090 330 1000 330 H980" strokeOpacity="0.5" strokeDasharray="4 4" />
      </g>

      <g stroke="#0e1114" strokeOpacity="0.7" strokeDasharray="6 5">
        <rect x="300" y="585" width="240" height="75" />
        <path d="M335 540 V585 M365 540 V585" />
      </g>

      <g fill="#6b757c" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        <text x="1190" y="535" textAnchor="end">EL. ±0,00</text>
        <text x="20" y="185">COBERTURA</text>
        <text x="20" y="700">SUBSOLO</text>
        <text x="1030" y="118">RESERVATÓRIO</text>
      </g>
      <g stroke="#6b757c" strokeOpacity="0.6">
        <path d="M120 120 H860 M120 112 V128 M860 112 V128" />
      </g>
      <text x="490" y="108" textAnchor="middle" fill="#6b757c" fontFamily="IBM Plex Mono, monospace" fontSize="11" letterSpacing="3">
        ESCOPO ÚNICO
      </text>
    </svg>
  )
}
