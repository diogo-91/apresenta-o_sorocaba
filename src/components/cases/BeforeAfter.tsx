import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { PhotoSlot } from '../ui/PhotoSlot'

type Image = { src: string | null; alt: string }

export function BeforeAfter({ before, after, code, className = 'aspect-[4/3] lg:aspect-[16/10]' }: { before: Image; after: Image; code: string; className?: string }) {
  const [split, setSplit] = useState(50)
  const frame = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const fromPointer = (e: PointerEvent) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return
    setSplit(Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)))
  }

  const onKey = (e: KeyboardEvent) => {
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }
    if (e.key === 'Home') setSplit(0)
    else if (e.key === 'End') setSplit(100)
    else if (steps[e.key]) setSplit((v) => Math.min(100, Math.max(0, v + steps[e.key])))
    else return
    e.preventDefault()
  }

  return (
    <div
      ref={frame}
      className={`relative touch-pan-y select-none overflow-hidden ${className}`}
      onPointerDown={(e) => {
        dragging.current = true
        e.currentTarget.setPointerCapture(e.pointerId)
        fromPointer(e)
      }}
      onPointerMove={(e) => dragging.current && fromPointer(e)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      <div className="absolute inset-0">
        <PhotoSlot src={after.src} alt={after.alt} caption="Depois" code={`${code}-B`} className="size-full" />
      </div>
      <div className="absolute inset-0 bg-surface" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        <PhotoSlot src={before.src} alt={before.alt} caption="Antes" code={`${code}-A`} className="size-full bg-surface!" />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${split}%` }}>
        <span className="absolute inset-y-0 -left-px w-0.5 bg-accent" />
      </div>
      <button
        type="button"
        role="slider"
        aria-label="Comparar antes e depois"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(split)}
        aria-valuetext={`${Math.round(split)}% antes`}
        onKeyDown={onKey}
        className="absolute top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center bg-accent text-fg"
        style={{ left: `${split}%` }}
      >
        <MoveHorizontal size={18} aria-hidden="true" />
      </button>
      <span className="label-mono pointer-events-none absolute left-3 top-3 bg-paper/85 px-2 py-1">Antes</span>
      <span className="label-mono pointer-events-none absolute right-3 top-3 bg-paper/85 px-2 py-1">Depois</span>
    </div>
  )
}
