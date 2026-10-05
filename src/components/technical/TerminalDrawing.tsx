import { useId } from 'react'

export const TERMINAL_VIEWBOX = { width: 1240, height: 600 }

const COLUMNS = [200, 330, 460, 590, 720, 850]

export function TerminalDrawing() {
  const soil = `terrain-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg viewBox={`0 0 ${TERMINAL_VIEWBOX.width} ${TERMINAL_VIEWBOX.height}`} fill="none" aria-hidden="true" className="h-auto w-full">
      <defs>
        <pattern id={soil} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#6b757c" strokeOpacity="0.16" />
        </pattern>
      </defs>
      <rect x="0" y="440" width="1240" height="160" fill={`url(#${soil})`} />
      <line x1="0" y1="440" x2="1240" y2="440" stroke="#0e1114" strokeOpacity="0.7" />

      <g stroke="#2b7fc0" strokeWidth="1.25">
        <path d="M80 220 Q490 40 900 220" strokeWidth="2" />
        <path d="M80 236 Q490 60 900 236" strokeOpacity="0.5" />
        {COLUMNS.map((x) => (
          <path key={x} d={`M${x} 440 V300 L${x - 28} 250 M${x} 300 L${x + 28} 250`} strokeOpacity="0.75" />
        ))}
        <path d="M80 220 V440 M900 220 V440" />
        {[250, 290, 330, 370, 410].map((y) => (
          <path key={y} d={`M900 ${y} H912`} strokeOpacity="0.6" />
        ))}
        <path d="M80 340 H900" strokeOpacity="0.4" strokeDasharray="5 5" />
      </g>

      <g stroke="#0e1114" strokeOpacity="0.7">
        <rect x="95" y="350" width="70" height="90" />
        <path d="M105 365 H155 M105 380 H155 M120 395 l8 14 h-10 l8 14" strokeOpacity="0.6" />
        <rect x="700" y="380" width="120" height="60" />
        <path d="M712 380 V366 H808 V380 M720 410 H800" strokeOpacity="0.6" />
        <path d="M912 320 H1012 V350 H912 M985 350 V440 M975 440 H995" />
        <rect x="1012" y="388" width="80" height="52" />
        <path d="M1012 388 L1052 370 L1092 388" strokeOpacity="0.6" />
      </g>

      <g stroke="#2b7fc0" strokeWidth="1.25">
        <path d="M1080 440 V150 M1062 150 H1098 M1066 150 V136 H1094 V150 M1070 440 L1080 400 L1090 440" />
        <path d="M1120 300 V440 M1190 300 V440 M1120 300 Q1155 280 1190 300 M1120 340 H1190" />
      </g>

      <g stroke="#0e1114" strokeOpacity="0.65" strokeDasharray="6 5">
        <rect x="420" y="472" width="280" height="66" />
        <path d="M450 440 V472 M480 440 V472" />
      </g>

      <g fill="#6b757c" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        <text x="20" y="430">EL. ±0,00</text>
        <text x="420" y="565">GALERIA TÉCNICA</text>
        <text x="925" y="310">PONTE</text>
        <text x="1060" y="125">MASTRO</text>
      </g>
    </svg>
  )
}
