import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion, type Variants } from 'framer-motion'
import { advance, clampIndex, createWheelGate, keyAction, slideIndexFromHash, type DeckPosition } from '../../lib/deck'
import { DURATION, EASE_MECH } from '../../lib/motion'
import { ActiveScreenContext } from '../../hooks/useActiveScreen'
import { DeckPositionContext, SlideStepContext } from '../../hooks/useDeckPosition'
import { DeckControls } from './DeckControls'
import { DeckIndex } from './DeckIndex'
import { GraphLayer } from './GraphLayer'
import { hasWebGL } from '../../hooks/useDeviceCapabilities'
import { useIdleMount } from '../../hooks/useIdleMount'

const Stage3DLayer = lazy(() => import('../three/Stage3DLayer'))

export const STAGE = { width: 1600, height: 900 }

export type Slide = { id: string; node: ReactNode; steps?: number; preload?: () => Promise<unknown> }

const WIPE = { duration: 1, ease: EASE_MECH }

const wipe: Variants = {
  enter: (dir: number) => ({ clipPath: dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' }),
  center: { clipPath: 'inset(0 0 0 0%)', transition: WIPE },
  exit: (dir: number) => ({ x: dir * -80, transition: WIPE }),
}

const fade: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: DURATION.base } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
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
  const ids = useMemo(() => slides.map((s) => s.id), [slides])
  const total = slides.length
  const stepsPerSlide = useMemo(() => slides.map((s) => s.steps ?? 1), [slides])
  const reduced = useReducedMotion()
  const [position, setPosition] = useState<DeckPosition>(() => ({ index: slideIndexFromHash(window.location.hash, ids), step: 0 }))
  const [direction, setDirection] = useState(1)
  const [indexOpen, setIndexOpen] = useState(false)
  const current = useRef(position)
  const steps = useRef(stepsPerSlide)
  steps.current = stepsPerSlide
  const scale = useStageScale()
  const idle = useIdleMount()
  const webgl = useMemo(() => hasWebGL(), [])
  const index = position.index

  const moveTo = useCallback((next: DeckPosition) => {
    const prev = current.current
    if (next.index === prev.index && next.step === prev.step) return
    if (next.index !== prev.index) setDirection(next.index > prev.index ? 1 : -1)
    current.current = next
    setPosition(next)
  }, [])

  const go = useCallback((target: number) => moveTo({ index: clampIndex(target, total), step: 0 }), [moveTo, total])
  const step = useCallback((delta: 1 | -1) => moveTo(advance(current.current, steps.current, delta)), [moveTo])

  useEffect(() => {
    history.replaceState(null, '', `#${ids[index]}`)
    for (const near of [index + 1, index - 1, index + 2]) void slides[near]?.preload?.()
  }, [index, ids, slides])

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
      if (action === 'next') step(1)
      else if (action === 'prev') step(-1)
      else if (action === 'first') go(0)
      else go(total - 1)
    }

    function onWheel(e: WheelEvent) {
      if (blocked() || e.ctrlKey) return
      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const dir = gate(delta, performance.now())
      if (dir) step(dir)
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
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1)
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
  }, [go, step, total])

  const closeIndex = useCallback(() => setIndexOpen(false), [])
  const slide = slides[index]

  return (
    <ActiveScreenContext.Provider value={slide.id}>
      <DeckPositionContext.Provider value={{ id: slide.id, step: position.step, steps: stepsPerSlide[index] }}>
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
              variants={reduced ? fade : wipe}
              initial="enter"
              animate="center"
              exit="exit"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${total}`}
            >
              <SlideStepContext.Provider value={position.step}>
                <Suspense fallback={<div className="h-full bg-paper" />}>{slide.node}</Suspense>
              </SlideStepContext.Provider>
              {!reduced && (
                <m.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 z-30 w-px bg-accent"
                  initial={{ left: direction > 0 ? '100%' : '0%', opacity: 1 }}
                  animate={{ left: direction > 0 ? '0%' : '100%', opacity: [1, 1, 0] }}
                  transition={WIPE}
                />
              )}
            </m.div>
          </AnimatePresence>
          <GraphLayer />
          {webgl && idle && (
            <Suspense fallback={null}>
              <Stage3DLayer />
            </Suspense>
          )}
        </div>

        <div aria-hidden="true" className="fixed inset-x-0 top-0 z-40 h-[3px] bg-line">
          <div
            className="h-full origin-left bg-accent transition-transform duration-700 ease-mech"
            style={{ transform: `scaleX(${(index + (position.step + 1) / stepsPerSlide[index]) / total})` }}
          />
        </div>

        <DeckControls
          index={index}
          total={total}
          step={position.step}
          steps={stepsPerSlide[index]}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onOpenIndex={() => setIndexOpen(true)}
        />
        <DeckIndex open={indexOpen} onClose={closeIndex} activeId={slide.id} onSelect={(i) => go(i)} />
      </div>
      </DeckPositionContext.Provider>
    </ActiveScreenContext.Provider>
  )
}
