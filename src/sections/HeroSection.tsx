import { lazy, Suspense, useCallback, useEffect, useRef, type MutableRefObject } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { hasWebGL } from '../hooks/useDeviceCapabilities'
import { useIdleMount } from '../hooks/useIdleMount'
import { useSlideStep } from '../hooks/useDeckPosition'
import { useTweenedProgress } from '../hooks/useScene'
import { hero } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { HeroMarks, HeroScene } from '../components/technical/HeroScene'
import type { HeroProgress } from '../components/three/HeroScene3D'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { ScrollTrigger } from '../lib/gsap'
import { DURATION, EASE_OUT } from '../lib/motion'

const mask = (delay: number) => ({
  initial: { y: '108%' },
  animate: { y: '0%' },
  transition: { duration: 1.2, ease: EASE_OUT, delay },
})

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE_OUT, delay },
})

const HeroStage = lazy(() => import('../components/three/HeroStage'))

function HeroPoster() {
  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet="/media/hero-object.jpg" />
      <img src="/media/hero-object-mobile.jpg" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
    </picture>
  )
}

function Hero3D({ progress, compact }: { progress: MutableRefObject<HeroProgress>; compact: boolean }) {
  const idle = useIdleMount(600)
  if (!hasWebGL()) return <HeroPoster />
  if (!idle) return null
  return (
    <Suspense fallback={null}>
      <HeroStage progress={progress} compact={compact} className="pointer-events-none absolute inset-0" />
    </Suspense>
  )
}

function MediaBackground() {
  const { videoSrc, posterSrc } = hero.media
  if (!videoSrc) return <HeroScene />
  return (
    <div className="grain absolute inset-0 overflow-hidden bg-[#07090b]" aria-hidden="true">
      <video
        className="absolute inset-0 size-full object-cover opacity-40"
        src={videoSrc}
        poster={posterSrc ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    </div>
  )
}

function useHeroProgress(deck: boolean, area: MutableRefObject<HTMLDivElement | null>, copy: MutableRefObject<HTMLDivElement | null>) {
  const reduced = useReducedMotion()
  const step = useSlideStep()
  const progress = useRef<HeroProgress>({ value: 0, notify: () => {} })

  const render = useCallback((p: number) => {
    progress.current.value = p
    progress.current.notify()
    if (copy.current) copy.current.style.transform = `translate3d(0, ${(-p * 40).toFixed(2)}px, 0)`
  }, [copy])

  useTweenedProgress(deck ? (step >= 1 ? 1 : 0) : null, render)

  useEffect(() => {
    if (deck || reduced || !area.current) return
    const trigger = ScrollTrigger.create({ trigger: area.current, start: 'top top', end: 'top -22%', scrub: 0.6, onUpdate: (self) => render(self.progress) })
    return () => trigger.kill()
  }, [deck, reduced, area, render])

  return progress
}

export function HeroSection() {
  const deck = usePresentationMode() === 'deck'
  const area = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const progress = useHeroProgress(deck, area, copy)

  return (
    <Screen
      id="inicio"
      theme="dark"
      tone="none"
      background={
        <div ref={area} className="absolute inset-0 bg-[#07090b]">
          <MediaBackground />
          <Hero3D progress={progress} compact={!deck} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#07090b_0%,rgb(7_9_11/0.75)_22%,transparent_52%)] lg:bg-[linear-gradient(100deg,rgb(7_9_11/0.92)_0%,rgb(7_9_11/0.55)_30%,transparent_52%),linear-gradient(to_top,rgb(7_9_11/0.9)_0%,transparent_32%),linear-gradient(to_bottom,rgb(7_9_11/0.85)_0%,transparent_16%)]"
          />
          <HeroMarks />
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-end">
        <div ref={copy} className="will-change-transform">
          <m.p className="label-mono mb-7 flex items-center gap-3 text-fg/80 lg:mb-8" {...fadeIn(0.6)}>
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            <span>
              {hero.eyebrow[0]} <span className="text-faint">/</span> <span className="text-muted">{hero.eyebrow[1]}</span>
            </span>
          </m.p>

          <h2 id={titleId('inicio')} aria-label={hero.headline} className="font-display font-bold leading-[0.9] tracking-[-0.035em] [font-stretch:80%] text-[clamp(2.75rem,12vw,4.75rem)] lg:text-[6.5rem]">
            <span aria-hidden="true" className="block overflow-hidden pb-[0.06em]">
              <m.span className="block" {...mask(0.8)}>
                {hero.headlineLead}
              </m.span>
            </span>
            <span aria-hidden="true" className="block overflow-hidden pb-[0.08em]">
              <m.span className="block text-accent" {...mask(0.98)}>
                {hero.headlineAccent}
              </m.span>
            </span>
          </h2>

          <m.p className="mt-6 max-w-[34ch] text-lg leading-snug text-muted lg:mt-7 lg:text-[1.375rem]" {...fadeIn(1.5)}>
            {hero.subheadline}
          </m.p>
        </div>

        <m.p className="mt-10 flex items-center gap-4 text-fg/70 lg:mt-12" {...fadeIn(2.2)}>
          {deck ? (
            <span aria-hidden="true" className="relative flex h-8 w-5 justify-center rounded-full border border-line-strong">
              <span className="mt-1.5 h-2 w-px bg-accent motion-safe:animate-[wheel_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
          ) : (
            <span aria-hidden="true" className="relative block h-9 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[drop_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
          )}
          <span className="label-mono">{deck ? hero.deckHint : hero.scrollHint}</span>
        </m.p>
      </div>
    </Screen>
  )
}
