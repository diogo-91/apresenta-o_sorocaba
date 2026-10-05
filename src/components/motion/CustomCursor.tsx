import { useEffect, useRef, useState } from 'react'

const INTERACTIVE = 'a[href], button:not(:disabled), [role="button"], [role="slider"], [role="tab"], input, select, textarea'
const LABELS: Record<string, string> = { view: 'Ver', explore: 'Explore' }
const MAGNET_STRENGTH = 0.25
const MAGNET_MAX = 8

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnabled(fine.matches)
    update()
    fine.addEventListener('change', update)
    return () => fine.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-custom-cursor')
    const target = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let frame = 0
    let magnet: HTMLElement | null = null

    const tick = () => {
      ringPos.x += (target.x - ringPos.x) * 0.2
      ringPos.y += (target.y - ringPos.y) * 0.2
      if (dot.current) dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const releaseMagnet = () => {
      if (magnet) magnet.style.transform = ''
      magnet = null
    }

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      const el = e.target instanceof Element ? e.target : null
      const labelled = el?.closest<HTMLElement>('[data-cursor]')
      const interactive = el?.closest(INTERACTIVE)
      const mode = labelled ? 'label' : interactive ? 'link' : 'default'
      if (ring.current && ring.current.dataset.mode !== mode) ring.current.dataset.mode = mode
      if (label.current) label.current.textContent = labelled ? LABELS[labelled.dataset.cursor ?? ''] ?? '' : ''

      const nextMagnet = el?.closest<HTMLElement>('[data-magnetic]') ?? null
      if (nextMagnet !== magnet) releaseMagnet()
      magnet = nextMagnet
      if (magnet) {
        const r = magnet.getBoundingClientRect()
        const dx = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientX - (r.left + r.width / 2)) * MAGNET_STRENGTH))
        const dy = Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, (e.clientY - (r.top + r.height / 2)) * MAGNET_STRENGTH))
        magnet.style.transform = `translate(${dx}px, ${dy}px)`
      }
    }
    const onLeave = () => {
      target.x = target.y = -100
      releaseMagnet()
    }

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      releaseMagnet()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div ref={ring} data-mode="default" className="cursor-ring absolute left-0 top-0">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-white mix-blend-difference" />
    </div>
  )
}
