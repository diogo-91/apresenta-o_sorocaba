const FEEDERS = [
  { x: 420, load: 'panel', label: 'QD · painel' },
  { x: 600, load: 'light', label: 'Iluminação' },
  { x: 780, load: 'motor', label: 'Motor' },
  { x: 960, load: 'motor', label: 'Acionamento' },
]

function Load({ kind, x }: { kind: string; x: number }) {
  if (kind === 'panel') return <rect x={x - 26} y={200} width={52} height={64} />
  if (kind === 'light')
    return (
      <g>
        <circle cx={x} cy={228} r={24} />
        <path d={`M${x - 17} 211 L${x + 17} 245 M${x + 17} 211 L${x - 17} 245`} />
      </g>
    )
  return (
    <g>
      <circle cx={x} cy={228} r={26} />
      <text x={x} y={235} textAnchor="middle" className="fill-current" stroke="none" fontFamily="IBM Plex Mono, monospace" fontSize="20">
        M
      </text>
    </g>
  )
}

export function SystemsDiagram() {
  return (
    <svg viewBox="0 0 1408 330" className="h-auto w-full" fill="none" aria-hidden="true">
      <g className="text-fg" stroke="currentColor" strokeWidth="1.5">
        <circle cx="140" cy="70" r="30" />
        <circle cx="140" cy="112" r="30" />
        <path d="M140 10 V40 M140 142 V170 H240 V60 H1060" />
        <path d="M240 54 V66" strokeWidth="3" />
        <path d="M240 60 H1060" strokeWidth="4" />
        {FEEDERS.map((f) => (
          <g key={f.x}>
            <path d={`M${f.x} 60 V120 M${f.x} 150 V200`} />
            <rect x={f.x - 15} y={120} width={30} height={30} className="fill-paper" />
            <path d={`M${f.x - 10} 125 L${f.x + 10} 145 M${f.x + 10} 125 L${f.x - 10} 145`} strokeWidth="1.25" />
            <Load kind={f.load} x={f.x} />
          </g>
        ))}
      </g>
      <g className="text-accent" stroke="currentColor" strokeWidth="2" strokeDasharray="4 10">
        <path d="M140 0 V40 M140 142 V170 H240 V60 H1060" className="motion-safe:animate-[flow_3s_linear_infinite]" />
        {FEEDERS.map((f) => (
          <path key={f.x} d={`M${f.x} 60 V200`} className="motion-safe:animate-[flow_3s_linear_infinite]" />
        ))}
      </g>
      <g className="text-blueprint" stroke="currentColor" strokeWidth="1.5">
        <path d="M986 228 H1060 M1060 214 V242 M1072 214 V242 M1072 228 H1140" />
        <circle cx="1190" cy="228" r="44" />
        <circle cx="1190" cy="228" r="14" />
        <path d="M1190 172 V184 M1190 272 V284 M1134 228 H1146 M1234 228 H1246 M1150 188 l9 9 M1221 259 l9 9 M1150 268 l9 -9 M1221 197 l9 -9" strokeWidth="2" />
        <path d="M1190 214 V242 M1176 228 H1204" />
        <path d="M1240 228 H1330 V300 H1380" />
      </g>
      <g className="fill-faint" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">
        <text x="186" y="96">TR</text>
        {FEEDERS.map((f) => (
          <text key={f.x} x={f.x} y={292} textAnchor="middle">
            {f.label.toUpperCase()}
          </text>
        ))}
        <text x="1190" y="306" textAnchor="middle">TRANSMISSÃO</text>
      </g>
      <g className="text-accent" stroke="currentColor" strokeWidth="1.25">
        <path d="M110 322 V312 H1000 V322" />
        <path d="M1050 322 V312 H1300 V322" className="text-blueprint" />
      </g>
    </svg>
  )
}
