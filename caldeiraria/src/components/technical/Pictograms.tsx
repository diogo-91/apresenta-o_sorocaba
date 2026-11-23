import type { ReactNode } from 'react'
import type { OperationId } from '../../data/operations'

const accent = 'text-accent'

const STATIONS: Record<OperationId, ReactNode> = {
  corte: (
    <>
      <rect x="10" y="14" width="140" height="10" />
      <rect x="64" y="24" width="32" height="16" />
      <path d="M72 40 h16 l-4 22 h-8 z" />
      <path d="M14 84 h132 v8 h-132 z M22 92 v20 M138 92 v20" />
      <g className={accent} stroke="currentColor">
        <path d="M80 62 V84" strokeDasharray="3 3" />
        <path d="M22 84 H74" strokeWidth="2" />
        <path d="M80 92 l-9 12 M80 92 v14 M80 92 l9 12" />
      </g>
    </>
  ),
  dobra: (
    <>
      <rect x="8" y="8" width="14" height="104" />
      <rect x="138" y="8" width="14" height="104" />
      <rect x="22" y="14" width="116" height="22" />
      <path d="M74 36 h12 l-6 22 z" />
      <path d="M56 78 h48 v16 h-48 z M68 78 L80 90 L92 78" />
      <rect x="22" y="94" width="116" height="12" />
      <path className={accent} stroke="currentColor" strokeWidth="3" d="M28 64 L80 76 L132 64" />
    </>
  ),
  usinagem: (
    <>
      <rect x="112" y="8" width="26" height="104" />
      <rect x="52" y="14" width="70" height="22" />
      <rect x="70" y="36" width="20" height="18" />
      <path d="M76 54 h8 v14 l-4 6 l-4 -6 z" />
      <path d="M56 80 h48 v16 h-48 z M48 78 h8 v20 h-8 z M104 78 h8 v20 h-8 z" />
      <rect x="30" y="98" width="100" height="10" />
      <g className={accent} stroke="currentColor">
        <path d="M76 80 v16 M84 80 v16" strokeDasharray="2 3" />
        <path d="M66 70 q-6 -4 -4 -10 M96 70 q6 -4 4 -10" />
      </g>
    </>
  ),
  montagem: (
    <>
      <path d="M10 82 h140 v8 h-140 z M20 90 v24 M140 90 v24" />
      <rect x="30" y="72" width="100" height="10" />
      <rect x="74" y="22" width="10" height="50" />
      <path d="M84 34 L84 72 L118 72 Z" strokeDasharray="4 3" />
      <path d="M40 30 v40 h24" strokeWidth="3" />
      <path d="M122 50 h18 v34 h-18 M140 64 h8" />
      <g className={accent} fill="currentColor" stroke="none">
        <circle cx="86" cy="70" r="2.5" />
        <circle cx="72" cy="70" r="2.5" />
        <circle cx="86" cy="40" r="2.5" />
      </g>
    </>
  ),
  solda: (
    <>
      <rect x="20" y="80" width="120" height="10" />
      <rect x="66" y="30" width="10" height="50" />
      <path d="M150 14 L116 52 L108 46 L142 8 Z M108 46 L98 60 L106 64 L116 52" />
      <g className={accent} stroke="currentColor">
        <path d="M76 78 q4 -6 8 0 q4 -6 8 0 q4 -6 8 0" strokeWidth="3" />
        <circle cx="100" cy="70" r="4" fill="currentColor" stroke="none" />
        <path d="M104 66 l10 -8 M106 72 l12 2 M100 64 l2 -12" />
      </g>
    </>
  ),
  acabamento: (
    <>
      <rect x="10" y="86" width="140" height="12" />
      <path d="M62 28 L138 14 a8 8 0 0 1 2 16 L66 44 Z" />
      <circle cx="50" cy="62" r="22" />
      <path d="M26 58 a24 24 0 0 1 48 0" strokeWidth="3" />
      <g className={accent} stroke="currentColor">
        <path d="M44 86 l-28 4 M44 84 l-30 -6 M46 82 l-22 -14 M48 84 l-12 -20" />
      </g>
    </>
  ),
  pintura: (
    <>
      <rect x="18" y="12" width="12" height="92" />
      <path d="M120 30 h30 v12 h-30 z M136 42 l6 32 h-10 l-6 -32 M120 33 h-10 v6 h10 M126 30 v-14 h16 v14" />
      <g className={accent} stroke="currentColor">
        <path d="M108 36 L38 16 M108 36 L38 58 M108 36 L38 37" strokeDasharray="2 5" />
        <rect x="30" y="20" width="5" height="76" fill="currentColor" stroke="none" opacity="0.85" />
      </g>
    </>
  ),
}

export function StationPictogram({ id, className = '' }: { id: OperationId; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" className={className}>
      {STATIONS[id]}
    </svg>
  )
}

export function PartState({ done, className = '' }: { done: number; className?: string }) {
  const painted = done >= 7
  const fill = painted ? 'currentColor' : 'none'
  return (
    <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" className={`${painted ? 'text-blueprint' : ''} ${className}`}>
      {done === 0 && <path d="M6 38 h88 v6 h-88 z M10 38 l6 6 M22 38 l6 6 M34 38 l6 6" />}
      {done === 1 && <path d="M14 38 h70 l4 6 h-78 z" />}
      {done >= 2 && <path d="M18 8 h7 v31 h62 v6 h-69 z" fill={fill} fillOpacity={0.35} />}
      {done >= 3 && <path d="M21 16 v4 M21 26 v4 M52 42 h4 M70 42 h4" strokeDasharray="1.5 1.5" />}
      {done >= 4 && <path d="M25 18 L25 39 L46 39 Z" strokeDasharray={done === 4 ? '3 2' : undefined} fill={fill} fillOpacity={0.2} />}
      {done === 4 && (
        <g className="text-accent" fill="currentColor" stroke="none">
          <circle cx="26" cy="20" r="2" />
          <circle cx="26" cy="38" r="2" />
          <circle cx="44" cy="38" r="2" />
        </g>
      )}
      {done >= 5 && <path d="M26 19 L45 38" className={done === 5 ? 'text-accent' : undefined} strokeWidth={done === 5 ? 3 : 2} strokeDasharray={done === 5 ? '2 1.5' : undefined} />}
      {done === 6 && <path d="M58 32 l5 -5 M66 32 l5 -5" className="text-faint" />}
    </svg>
  )
}
