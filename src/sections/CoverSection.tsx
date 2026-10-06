import { useLayoutEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { company } from '../data/company'
import { cover } from '../data/content'
import { titleId } from '../components/layout/Screen'
import { BlueprintPlant } from '../components/technical/BlueprintPlant'
import { Logo } from '../components/ui/Logo'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { gsap } from '../lib/gsap'

const PARALLAX = { grid: 2, blueprint: 4, logo: 6, labels: 8 }
let introPlayed = false

function drawPaths(root: HTMLElement, phase: string) {
  const targets = [...root.querySelectorAll<SVGGeometryElement>(`[data-bp="${phase}"]`)]
  targets.forEach((el) => {
    const length = el.getTotalLength()
    gsap.set(el, { strokeDasharray: length, strokeDashoffset: length })
  })
  return targets
}

function useCoverIntro(root: React.RefObject<HTMLElement | null>, parallax: boolean) {
  const reduced = useReducedMotion()

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced || introPlayed) return
    const q = gsap.utils.selector(el)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: () => void (introPlayed = true) })
      tl.from(q('[data-cover="panel"]'), { autoAlpha: 0, duration: 0.7, ease: 'power1.out' })
        .fromTo(q('[data-cover="grid"]'), { autoAlpha: 0, backgroundPosition: '-1px 23px' }, { autoAlpha: 0.8, backgroundPosition: '-1px -1px', duration: 2.6, ease: 'power1.inOut' }, 0.2)
        .to(drawPaths(el, 'main'), { strokeDashoffset: 0, duration: 1.3, stagger: 0.18, ease: 'power2.inOut' }, 0.45)
        .to(drawPaths(el, 'structure'), { strokeDashoffset: 0, duration: 1.4, stagger: 0.14, ease: 'power2.inOut' }, 1.0)
        .to(drawPaths(el, 'detail'), { strokeDashoffset: 0, duration: 1.1, stagger: 0.09, ease: 'power2.inOut' }, 1.6)
        .from(q('[data-bp="dashed"]'), { autoAlpha: 0, duration: 0.8 }, 2.1)
        .from(q('[data-bp="label"]'), { autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 2.3)
        .from(q('[data-cover="logo"]'), { autoAlpha: 0, y: 12, duration: 0.65 }, 1.3)
        .from(q('[data-cover="eyebrow"]'), { autoAlpha: 0, duration: 0.6 }, 1.6)
        .fromTo(q('[data-cover="lead"]'), { clipPath: 'inset(0% -5% 100% -5%)', y: '0.3em' }, { clipPath: 'inset(-15% -5% -25% -5%)', y: 0, duration: 0.9, ease: 'power3.out' }, 1.75)
        .fromTo(q('[data-cover="tail"]'), { clipPath: 'inset(0% -5% 100% -5%)', y: '0.3em' }, { clipPath: 'inset(-15% -5% -25% -5%)', y: 0, duration: 1.2, ease: 'power3.out' }, 2.15)
        .from(q('[data-cover="subtitle"]'), { autoAlpha: 0, y: 12, duration: 0.7 }, 2.85)
      q('[data-cover="discipline"]').forEach((item, i) => {
        const at = 3.05 + i * 0.22
        tl.from(item.querySelector('[data-cover="rule"]'), { scaleX: 0, transformOrigin: 'left center', duration: 0.35, ease: 'power2.inOut' }, at)
        tl.from(item.querySelector('[data-cover="label"]'), { autoAlpha: 0, x: -4, duration: 0.4 }, at + 0.2)
      })
    }, el)
    return () => ctx.revert()
  }, [root, reduced])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced || !parallax || !window.matchMedia('(pointer: fine)').matches) return
    const layers = (Object.keys(PARALLAX) as (keyof typeof PARALLAX)[]).flatMap((key) =>
      [...el.querySelectorAll<HTMLElement>(`[data-parallax="${key}"]`)].map((node) => ({
        amp: PARALLAX[key],
        x: gsap.quickTo(node, 'x', { duration: 0.9, ease: 'power3.out' }),
        y: gsap.quickTo(node, 'y', { duration: 0.9, ease: 'power3.out' }),
      })),
    )
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const nx = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1))
      const ny = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1))
      layers.forEach((layer) => {
        layer.x(nx * layer.amp)
        layer.y(ny * layer.amp)
      })
    }
    const onLeave = () => layers.forEach((layer) => (layer.x(0), layer.y(0)))
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [root, reduced, parallax])
}

export function CoverSection() {
  const deck = usePresentationMode() === 'deck'
  const root = useRef<HTMLElement>(null)
  useCoverIntro(root, deck)
  const [lead, tail] = company.slogan.split('. ')

  return (
    <section ref={root} id={deck ? 'capa' : undefined} data-screen aria-labelledby={titleId('capa')} className={`relative grid bg-paper ${deck ? 'h-full grid-cols-12' : 'min-h-svh grid-rows-[auto_1fr] pt-16'}`}>
      <div data-cover="panel" className={`relative overflow-hidden bg-night text-night-fg ${deck ? 'order-2 col-span-5' : ''}`}>
        <div aria-hidden="true" data-cover="grid" data-parallax="grid" className="blueprint-grid absolute inset-0 opacity-80" />
        <div aria-hidden="true" data-parallax="blueprint" className="absolute inset-0">
          <BlueprintPlant selfDraw={false} className="absolute inset-0 size-full text-[#4fa3d9] opacity-35" />
        </div>
        <div className={`relative flex h-full flex-col ${deck ? 'justify-between p-16' : 'gap-10 px-5 py-12'}`}>
          <div data-parallax="logo">
            <div data-cover="logo">
              <Logo tone="light" className={deck ? 'w-full max-w-[400px]' : 'w-60'} />
            </div>
          </div>
          <ul data-parallax="labels" className="label-mono flex flex-col gap-2 text-night-fg/70">
            {cover.disciplines.map((d) => (
              <li key={d} data-cover="discipline" className="flex items-center gap-3">
                <span aria-hidden="true" data-cover="rule" className="h-px w-6 bg-[#4fa3d9]" />
                <span data-cover="label">{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`flex flex-col ${deck ? 'order-1 col-span-7 justify-between px-24 py-16' : 'gap-10 px-5 py-12'}`}>
        <p data-cover="eyebrow" className="label-mono flex items-center gap-3 text-muted">
          <span aria-hidden="true" className="size-2 bg-accent" />
          {cover.eyebrow}
        </p>
        <div className="my-auto">
          <h1 id={titleId('capa')} className="display-xl">
            <span data-cover="lead" className="block">
              {lead}.
            </span>
            <span data-cover="tail" className="block text-muted">
              {tail}
            </span>
          </h1>
          <p data-cover="subtitle" className="lede mt-8 max-w-[38ch]">
            {cover.subtitle}
          </p>
        </div>
      </div>
    </section>
  )
}
