import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m, type Variants } from 'framer-motion'
import { clampIndex, createWheelGate, keyAction, slideIndexFromHash } from '../../lib/deck'
import { DURATION, EASE_MECH } from '../../lib/motion'
import { ActiveScreenContext } from '../../hooks/useActiveScreen'
import { DeckControls } from './DeckControls'
import { DeckIndex } from './DeckIndex'
import { GraphLayer } from './GraphLayer'

export const STAGE = { width: 1600, height: 900 }

export type Slide = { id: string; node: ReactNode }

const variants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  center: { opacity: 1, x: 0, transition: { duration: DURATION.base, ease: EASE_MECH } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -48, transition: { duration: DURATION.fast, ease: EASE_MECH } }),
}

function useStageScale() {
  const read = () => Math.min(window.innerWidth / STAGE.width, window.innerHeight / STAGE.height)
  const [scale, setScale] = useState(read)
  useEffect(() => {
    const onResize = () => setScale(read())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'].includes(target.tagName) || target.getAttribute('role') === 'slider'
}

export function Deck({ slides }: { slides: Slide[] }) {
  const ids = slides.map((s) => s.id)
  const total = slides.length
  const [index, setIndex] = useState(() => slideIndexFromHash(window.location.hash, ids))
  const [direction, setDirection] = useState(1)
  const [indexOpen, setIndexOpen] = useState(false)
  const current = useRef(index)
  const scale = useStageScale()

  const go = useCallback(
    (target: number) => {
      const next = clampIndex(target, total)
      if (next === current.current) return
      setDirection(next > current.current ? 1 : -1)
      current.current = next
      setIndex(next)
    },
    [total],
  )

  useEffect(() => {
    history.replaceState(null, '', `#${ids[index]}`)
  }, [index, ids])

  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = 'hidden'
    const onHash = () => go(slideIndexFromHash(window.location.hash, ids))
    window.addEventListener('hashchange', onHash)
    return () => {
      root.style.overflow = ''
      window.removeEventListener('hashchange', onHash)
    }
  }, [go, ids])

  useEffect(() => {
    const gate = createWheelGate({ threshold: 40, cooldown: 900 })

    function blocked() {
      return document.querySelector('[aria-modal="true"]') !== null
    }

    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || blocked()) return
      const action = keyAction(e.key)
      if (!action) return
      const target = e.target as HTMLElement | null
      if (target?.getAttribute('role') === 'slider' || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return
      if (e.key === ' ' && isInteractiveTarget(target)) return
      e.preventDefault()
      if (action === 'next') go(current.current + 1)
      else if (action === 'prev') go(current.current - 1)
      else if (action === 'first') go(0)
      else go(total - 1)
    }

    function onWheel(e: WheelEvent) {
      if (blocked() || e.ctrlKey) return
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const step = gate(delta, performance.now())
      if (step) go(current.current + step)
    }

    let touchStart: { x: number; y: number } | null = null
    function onTouchStart(e: TouchEvent) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
    function onTouchEnd(e: TouchEvent) {
      if (!touchStart || blocked()) return
      const dx = e.changedTouches[0].clientX - touchStart.x
      const dy = e.changedTouches[0].clientY - touchStart.y
      touchStart = null
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current.current + (dx < 0 ? 1 : -1))
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [go, total])

  const closeIndex = useCallback(() => setIndexOpen(false), [])
  const slide = slides[index]

  return (
    <ActiveScreenContext.Provider value={slide.id}>
      <div className="fixed inset-0 overflow-hidden bg-surface">
        <div
          className="absolute left-1/2 top-1/2 overflow-hidden bg-paper shadow-[0_20px_60px_-20px_rgb(14_17_20/0.25)]"
          style={{ width: STAGE.width, height: STAGE.height, transform: `translate(-50%, -50%) scale(${scale})` }}
          aria-roledescription="apresentação"
        >
          <AnimatePresence initial={false} custom={direction}>
            <m.div
              key={slide.id}
              className="absolute inset-0"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${total}`}
            >
              {slide.node}
            </m.div>
          </AnimatePresence>
          <GraphLayer activeId={slide.id} />
        </div>

        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-[3px] bg-line">
          <div className="h-full origin-left bg-accent transition-transform duration-500 ease-mech" style={{ transform: `scaleX(${(index + 1) / total})` }} />
        </div>

        <DeckControls
          index={index}
          total={total}
          onPrev={() => go(current.current - 1)}
          onNext={() => go(current.current + 1)}
          onOpenIndex={() => setIndexOpen(true)}
        />
        <DeckIndex open={indexOpen} onClose={closeIndex} activeId={slide.id} onSelect={(i) => go(i)} />
      </div>
    </ActiveScreenContext.Provider>
  )
}
