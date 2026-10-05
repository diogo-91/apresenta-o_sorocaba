import { useEffect, useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { hero } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { useIdleMount } from '../hooks/useIdleMount'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { gsap, ScrollTrigger } from '../lib/gsap'

function useAutoplay(video: React.RefObject<HTMLVideoElement | null>, src: string | undefined) {
  useEffect(() => {
    const el = video.current
    if (!el || !src) return
    el.muted = true
    el.defaultMuted = true
    const play = () => void el.play().catch(() => {})
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : el.pause()))
    observer.observe(el)
    return () => observer.disconnect()
  }, [video, src])
}

export function HeroSection() {
  const deck = usePresentationMode() === 'deck'
  const reduced = useReducedMotion() ?? false
  const step = useSlideStep()
  const ready = useIdleMount(800)
  const src = ready ? hero.media.videoSrc : undefined

  const root = useRef<HTMLDivElement>(null)
  const area = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const dim = useRef<HTMLDivElement>(null)
  const eyebrow = useRef<HTMLDivElement>(null)
  const headline = useRef<HTMLDivElement>(null)
  const sub = useRef<HTMLDivElement>(null)
  const hint = useRef<HTMLDivElement>(null)
  const exit = useRef<gsap.core.Timeline | null>(null)

  useAutoplay(video, src)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.from('[data-enter]', { autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power1.out' })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(overlay.current, { autoAlpha: 0, duration: 1.4, ease: 'power1.inOut' }, 0.1)
        .from('[data-enter="eyebrow"]', { autoAlpha: 0, y: 14, duration: 0.9 }, 0.55)
        .from('[data-line="lead"]', { yPercent: 110, duration: 1.15 }, 0.75)
        .from('[data-line="accent"]', { yPercent: 110, duration: 1.15 }, 0.97)
        .from('[data-enter="sub"]', { autoAlpha: 0, y: 12, duration: 0.9 }, 1.5)
        .from('[data-enter="hint"]', { autoAlpha: 0, duration: 0.8, ease: 'power1.out' }, 2.05)
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: 'none' } })
        .to(video.current, { scale: 1.04, yPercent: -1.5, duration: 1 }, 0)
        .to(dim.current, { opacity: 0.45, duration: 1 }, 0)
        .to(hint.current, { autoAlpha: 0, duration: 0.25 }, 0)
        .to(headline.current, { y: -48, autoAlpha: 0.15, duration: 0.9 }, 0.05)
        .to(sub.current, { y: -28, autoAlpha: 0, duration: 0.6 }, 0.3)
        .to(eyebrow.current, { y: -20, autoAlpha: 0, duration: 0.5 }, 0.5)
      exit.current = tl
      if (!deck && !reduced) ScrollTrigger.create({ trigger: area.current, start: 'top top', end: '30% top', scrub: 0.6, animation: tl })
    }, root)
    return () => {
      exit.current = null
      ctx.revert()
    }
  }, [deck, reduced])

  useEffect(() => {
    const tl = exit.current
    if (!deck || !tl) return
    const target = step >= 1 ? 1 : 0
    if (reduced) {
      tl.progress(target)
      return
    }
    const tween = gsap.to(tl, { progress: target, duration: 1.4, ease: 'power2.inOut' })
    return () => {
      tween.kill()
    }
  }, [deck, step, reduced])

  return (
    <Screen
      id="inicio"
      theme="dark"
      tone="none"
      className="bg-[#0b0d0f]"
      background={
        <div ref={area} className="absolute inset-0 overflow-hidden bg-[#0b0d0f]" aria-hidden="true">
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover object-[38%_center] will-change-transform lg:object-center"
            src={src}
            poster={hero.media.posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
          />
          <div ref={overlay} className="absolute inset-0">
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(6_8_10/0.82)_0%,rgb(6_8_10/0.5)_34%,transparent_62%)] lg:bg-[linear-gradient(90deg,rgb(6_8_10/0.8)_0%,rgb(6_8_10/0.55)_28%,rgb(6_8_10/0.15)_52%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_8_10/0.55)_0%,transparent_26%)] lg:bg-[linear-gradient(to_bottom,rgb(6_8_10/0.7)_0%,transparent_20%),linear-gradient(to_top,rgb(6_8_10/0.5)_0%,transparent_24%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(0_0_0/0.3)_100%)]" />
          </div>
          <div ref={dim} className="absolute inset-0 bg-[#07090b] opacity-0" />
        </div>
      }
    >
      <div ref={root} className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col pt-6 lg:pt-14">
          <div ref={eyebrow}>
            <p data-enter="eyebrow" className="label-mono mb-6 flex items-center gap-3 text-fg/85 lg:mb-7">
              <span aria-hidden="true" className="h-px w-8 bg-accent" />
              <span>
                {hero.eyebrow[0]} <span className="text-fg/40">/</span> <span className="text-fg/65">{hero.eyebrow[1]}</span>
              </span>
            </p>
          </div>

          <div ref={headline}>
            <h2
              id={titleId('inicio')}
              aria-label={hero.headline}
              className="font-display font-bold uppercase leading-[0.92] tracking-[-0.02em] [font-stretch:66%] text-[clamp(2.6rem,12.5vw,4.5rem)] [text-shadow:0_2px_24px_rgb(0_0_0/0.25)] lg:text-[5.5rem]"
            >
              <span aria-hidden="true" className="-mt-[0.16em] block overflow-hidden pb-[0.04em] pt-[0.16em]">
                <span data-line="lead" className="block">
                  {hero.headlineLead}
                </span>
              </span>
              <span aria-hidden="true" className="-mt-[0.16em] block overflow-hidden pb-[0.06em] pt-[0.16em]">
                <span data-line="accent" className="block text-accent">
                  {hero.headlineAccent}
                </span>
              </span>
            </h2>
          </div>

          <div ref={sub}>
            <p data-enter="sub" className="mt-5 max-w-[26ch] text-lg leading-snug text-fg/80 lg:mt-6 lg:max-w-[30ch] lg:text-[1.375rem]">
              {hero.subheadline}
            </p>
          </div>
        </div>

        <div ref={hint} className="mt-8 flex lg:mt-0 lg:justify-end">
          <p data-enter="hint" className="flex items-center gap-3 text-fg/70">
            <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-fg/25">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[drop_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            <span className="label-mono">{deck ? hero.deckHint : hero.scrollHint}</span>
          </p>
        </div>
      </div>
    </Screen>
  )
}
