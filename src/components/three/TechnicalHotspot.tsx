import { Html } from '@react-three/drei'
import type { Vec3 } from '../../data/facility3d'

type Props = {
  position: Vec3
  index: number
  label: string
  kicker: string
  active: boolean
  side?: 'left' | 'right'
  onSelect: () => void
}

export function TechnicalHotspot({ position, index, label, kicker, active, side = 'right', onSelect }: Props) {
  return (
    <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div className="relative">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={active}
          aria-label={`${label}: ${kicker}`}
          className="pointer-events-auto absolute left-0 top-0 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <span className={`absolute inset-1 rounded-full border ${active ? 'border-accent' : 'border-fg/50'} motion-safe:animate-[ping-soft_2.8s_ease-out_infinite]`} />
          <span className={`relative flex size-4 items-center justify-center rounded-full font-mono text-[0.5rem] ${active ? 'bg-accent text-[#0e1114]' : 'bg-paper text-fg ring-1 ring-fg/60'}`}>{index}</span>
        </button>
        {active && (
          <div className={`pointer-events-none absolute top-0 flex -translate-y-1/2 items-center gap-2 ${side === 'left' ? 'right-4 flex-row-reverse text-right' : 'left-4'}`}>
            <span className="h-px w-14 shrink-0 bg-accent" />
            <span className="w-max max-w-[11rem] bg-paper/85 px-2 py-1 backdrop-blur-[2px] lg:max-w-none">
              <span className="label-mono block text-fg">{label}</span>
              <span className="label-mono block text-[0.5625rem] text-muted">{kicker}</span>
            </span>
          </div>
        )}
      </div>
    </Html>
  )
}
