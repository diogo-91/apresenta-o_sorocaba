import { useState, type ReactNode } from 'react'
import { m } from 'framer-motion'
import { DURATION, EASE_OUT } from '../../lib/motion'

export type Hotspot = { id: string; code: string; label: string; x: number; y: number }

type Props = {
  width: number
  height: number
  drawing: ReactNode
  hotspots: Hotspot[]
  label: string
  hint: string
  renderDetail: (id: string) => ReactNode
}

export function HotspotMap({ width, height, drawing, hotspots, label, hint, renderDetail }: Props) {
  const [selected, setSelected] = useState(hotspots[0].id)
  const [hovered, setHovered] = useState<string | null>(null)
  const shown = hovered ?? selected

  const markers = (interactive: boolean) =>
    hotspots.map((spot, i) => {
      const style = { left: `${(spot.x / width) * 100}%`, top: `${(spot.y / height) * 100}%` }
      const active = interactive && spot.id === shown
      const marker = (
        <span
          className={`flex items-center justify-center border font-mono transition-colors duration-300 ease-mech ${interactive ? 'size-7 text-[0.6875rem]' : 'size-5 text-[0.5625rem]'} ${
            active ? 'border-accent bg-accent text-ink' : 'border-fg/70 bg-ink/85 text-fg'
          }`}
        >
          {i + 1}
        </span>
      )
      if (!interactive) {
        return (
          <span key={spot.id} aria-hidden="true" className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
            {marker}
          </span>
        )
      }
      return (
        <button
          key={spot.id}
          type="button"
          aria-pressed={spot.id === selected}
          aria-label={`${spot.code} · ${spot.label}`}
          onClick={() => setSelected(spot.id)}
          onMouseEnter={() => setHovered(spot.id)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setHovered(spot.id)}
          onBlur={() => setHovered(null)}
          className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
          style={style}
        >
          {active && <span aria-hidden="true" className="absolute inset-0.5 border border-accent/60" />}
          {marker}
          <span className="label-mono pointer-events-none absolute left-1/2 top-full -translate-x-1/2 whitespace-nowrap bg-ink/90 px-1.5 py-0.5 text-fg opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            {spot.label}
          </span>
        </button>
      )
    })

  return (
    <div>
      <div className="hidden gap-8 lg:grid lg:grid-cols-12">
        <div className="relative col-span-8 self-start" role="group" aria-label={label}>
          {drawing}
          <div className="absolute inset-0">{markers(true)}</div>
        </div>
        <div className="col-span-4 border-l border-line pl-8" aria-live="polite">
          <p className="label-mono mb-6 text-faint">{hint}</p>
          <m.div key={shown} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }}>
            {renderDetail(shown)}
          </m.div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="relative -mx-5 md:mx-0">
          {drawing}
          <div className="absolute inset-0">{markers(false)}</div>
        </div>
        <ol className="mt-8 grid gap-px bg-line sm:grid-cols-2">
          {hotspots.map((spot, i) => (
            <li key={spot.id} className="flex gap-4 bg-ink py-5 pr-2">
              <span className="flex size-7 shrink-0 items-center justify-center border border-fg/70 font-mono text-[0.6875rem]">{i + 1}</span>
              <div className="min-w-0 flex-1">{renderDetail(spot.id)}</div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
