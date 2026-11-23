const CX = 350
const SHELL = { left: 240, right: 460, top: 260, bottom: 680 }
const HEAD = 62
const range = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step)

export function VesselBlueprint({ className = '' }: { className?: string }) {
  const { left, right, top, bottom } = SHELL
  return (
    <svg viewBox="0 0 700 900" fill="none" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" strokeWidth="1.2">
        <path data-bp="main" d={`M${left} ${top} V${bottom} M${right} ${top} V${bottom}`} strokeWidth="1.8" />
        <path data-bp="main" d={`M${left} ${top} A${(right - left) / 2} ${HEAD} 0 0 1 ${right} ${top}`} strokeWidth="1.8" />
        <path data-bp="main" d={`M${left} ${bottom} A${(right - left) / 2} ${HEAD} 0 0 0 ${right} ${bottom}`} strokeWidth="1.8" />
        <path data-bp="main" d="M60 840 H640" strokeOpacity="0.8" />

        <path data-bp="structure" d={`M${left + 18} ${bottom + 34} L${left - 6} 840 M${right - 18} ${bottom + 34} L${right + 6} 840 M${CX} ${bottom + HEAD} V840`} />
        <path data-bp="structure" d={`M${left - 26} 840 h40 M${right - 14} 840 h40 M${CX - 20} 840 h40`} strokeWidth="2.5" />
        <path data-bp="structure" d={`M${left} ${top + 140} H${right} M${left} ${top + 280} H${right}`} strokeDasharray="6 5" strokeOpacity="0.7" />
        <path data-bp="structure" d={`M${CX + 40} ${top} V${top + 140} M${CX - 40} ${top + 140} V${top + 280} M${CX + 40} ${top + 280} V${bottom}`} strokeDasharray="6 5" strokeOpacity="0.5" />

        <path data-bp="detail" d={`M${CX - 12} ${top - HEAD} V${top - HEAD - 70} M${CX + 12} ${top - HEAD} V${top - HEAD - 70} M${CX - 26} ${top - HEAD - 70} H${CX + 26} M${CX - 26} ${top - HEAD - 80} H${CX + 26}`} />
        <path data-bp="detail" d={`M${left} ${top + 60} H${left - 80} M${left} ${top + 84} H${left - 80} M${left - 80} ${top + 48} V${top + 96} M${left - 90} ${top + 48} V${top + 96}`} />
        <path data-bp="detail" d={`M${right} ${bottom - 70} H${right + 80} M${right} ${bottom - 46} H${right + 80} M${right + 80} ${bottom - 82} V${bottom - 34} M${right + 90} ${bottom - 82} V${bottom - 34}`} />
        <circle data-bp="detail" cx={CX} cy={top + 210} r="46" />
        <circle data-bp="detail" cx={CX} cy={top + 210} r="36" strokeDasharray="3 4" />
        <path data-bp="detail" d={`M${right + 34} ${top - 10} V${bottom + 40} M${right + 54} ${top - 10} V${bottom + 40}`} strokeOpacity="0.6" />
        {range(top, bottom + 30, 26).map((y) => (
          <path key={y} data-bp="detail" d={`M${right + 34} ${y} h20`} strokeOpacity="0.6" />
        ))}
        <path data-bp="dashed" d={`M${CX} 120 V870`} strokeDasharray="14 6 2 6" strokeOpacity="0.5" />
      </g>

      <g data-bp="label" stroke="currentColor" strokeOpacity="0.55">
        <path d={`M600 ${top - HEAD} V${bottom + HEAD} M592 ${top - HEAD} h16 M592 ${bottom + HEAD} h16`} />
        <path d={`M${left} 790 H${right} M${left} 782 v16 M${right} 782 v16`} />
      </g>
      <g data-bp="label" fill="currentColor" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2">
        <text x={CX + 34} y={top - HEAD - 64} fillOpacity="0.75">N1</text>
        <text x={left - 104} y={top + 40} fillOpacity="0.75">N2</text>
        <text x={right + 92} y={bottom - 92} fillOpacity="0.75">N3</text>
        <text x={CX + 54} y={top + 214} fillOpacity="0.75">BV</text>
        <text x={CX} y={812} textAnchor="middle" fillOpacity="0.6">Ø [A CONFIRMAR]</text>
        <text x={614} y={(top + bottom) / 2} fillOpacity="0.6" transform={`rotate(90 614 ${(top + bottom) / 2})`} textAnchor="middle">
          H [A CONFIRMAR]
        </text>
      </g>
    </svg>
  )
}
