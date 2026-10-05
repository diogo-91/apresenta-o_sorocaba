import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { usePresentationMode } from './usePresentationMode'
import { useSlideStep } from './useDeckPosition'

type Render = (progress: number) => void

const TWEEN = { duration: 1.4, ease: 'power3.inOut' }

export function useTweenedProgress(target: number | null, render: Render, initial = 0) {
  const reduced = useReducedMotion()
  const state = useRef({ p: initial })
  const renderRef = useRef(render)
  renderRef.current = render

  useLayoutEffect(() => {
    renderRef.current(state.current.p)
  }, [])

  useEffect(() => {
    if (target === null) return
    if (reduced) {
      state.current.p = target
      renderRef.current(target)
      return
    }
    const tween = gsap.to(state.current, { p: target, ...TWEEN, onUpdate: () => renderRef.current(state.current.p) })
    return () => {
      tween.kill()
    }
  }, [target, reduced])
}

export function useScrollProgress(ref: RefObject<Element | null>, render: Render, enabled: boolean, range: readonly [number, number] = [0, 1]) {
  const reduced = useReducedMotion()
  const renderRef = useRef(render)
  renderRef.current = render
  const [from, to] = range

  useEffect(() => {
    if (!enabled || !ref.current) return
    if (reduced) {
      renderRef.current(to)
      return
    }
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 85%',
      end: 'bottom 55%',
      scrub: 0.8,
      onUpdate: (self) => renderRef.current(from + (to - from) * self.progress),
    })
    renderRef.current(from + (to - from) * trigger.progress)
    return () => trigger.kill()
  }, [enabled, ref, reduced, from, to])
}

export function useSceneProgress(ref: RefObject<Element | null>, keyframes: readonly number[], render: Render) {
  const deck = usePresentationMode() === 'deck'
  const step = useSlideStep()
  const target = deck ? keyframes[Math.min(step, keyframes.length - 1)] : null
  useTweenedProgress(target, render)
  useScrollProgress(ref, render, !deck, [0, keyframes[keyframes.length - 1]])
}
