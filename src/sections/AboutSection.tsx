import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { about, operationLayers, type OperationLayerId } from '../data/content'
import { frontById } from '../data/services'
import { company } from '../data/company'
import { pad2 } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { Pending } from '../components/ui/Pending'
import { OperationBlueprint } from '../components/technical/OperationBlueprint'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { useTweenedProgress } from '../hooks/useScene'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { isPending } from '../lib/placeholder'
import { layerFocus } from '../lib/layerFocus'

const COUNT = operationLayers.length
const FINAL = COUNT + 1
const fade = 'transition-[opacity,transform] duration-700 ease-mech motion-reduce:transition-opacity'

function useBlueprint(stage: number, initial: number) {
  const groups = useRef(new Map<OperationLayerId, SVGGElement>())
  const layerRef = useCallback(
    (id: OperationLayerId) => (el: SVGGElement | null) => {
      if (el) groups.current.set(id, el)
      else groups.current.delete(id)
    },
    [],
  )
  const render = useCallback((p: number) => {
    layerFocus(p, COUNT).forEach(({ opacity, highlight }, i) => {
      const el = groups.current.get(operationLayers[i].id)
      el?.style.setProperty('--o', opacity.toFixed(3))
      el?.style.setProperty('--h', highlight.toFixed(3))
    })
  }, [])
  useTweenedProgress(stage, render, initial)
  return layerRef
}

function useWipe(trigger: React.RefObject<Element | null>, deck: boolean) {
  const wipe = useRef<SVGRectElement>(null)
  const reduced = useReducedMotion()
  useLayoutEffect(() => {
    if (reduced || !wipe.current) return
    const tween = gsap.fromTo(
      wipe.current,
      { attr: { height: 0 } },
      { attr: { height: 540 }, duration: 1.8, ease: 'power2.inOut', delay: deck ? 0.5 : 0, paused: !deck },
    )
    const st = deck ? null : ScrollTrigger.create({ trigger: trigger.current, start: 'top 80%', once: true, onEnter: () => tween.play() })
    return () => {
      st?.kill()
      tween.revert()
    }
  }, [deck, reduced, trigger])
  return wipe
}

function LayerIndex({ stage }: { stage: number }) {
  return (
    <ol className="flex flex-col" aria-label="Camadas da operação">
      {operationLayers.map((layer, i) => {
        const active = stage === i + 1
        const lit = active || stage === FINAL
        return (
          <li
            key={layer.id}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-3 border-t border-line py-1.5 transition-colors duration-500 last:border-b ${lit ? 'text-fg' : stage === 0 ? 'text-muted' : 'text-faint'}`}
          >
            <span aria-hidden="true" className={`h-px transition-all duration-500 ${active ? 'w-6 bg-accent' : 'w-2 bg-line-strong'}`} />
            <span className={`label-mono w-6 ${active ? 'text-accent-ink' : ''}`}>{pad2(i + 1)}</span>
            <span className="font-display text-lg font-bold uppercase tracking-tight [font-stretch:85%]">{layer.short}</span>
          </li>
        )
      })}
    </ol>
  )
}

function FrontLink({ layerIndex, focusable = true }: { layerIndex: number; focusable?: boolean }) {
  const front = frontById(operationLayers[layerIndex].front)
  return (
    <a href={`#${front.id}`} tabIndex={focusable ? undefined : -1} className="link-underline label-mono inline-flex items-center gap-2 text-blueprint">
      {front.code} · {front.name}
      <ArrowRight size={14} aria-hidden="true" />
    </a>
  )
}

function LayerPanel({ index, visible }: { index: number; visible: boolean }) {
  const layer = operationLayers[index]
  return (
    <div aria-hidden={!visible} className={`${fade} absolute inset-0 ${visible ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
      <p className="label-mono flex items-center gap-3 text-accent-ink">
        Camada {pad2(index + 1)} / {pad2(COUNT)}
        <span className="text-blueprint">{layer.elevation}</span>
      </p>
      <h3 className="mt-4 font-display text-[2.5rem] font-bold leading-[0.95] tracking-tight [font-stretch:82%]">{layer.title}</h3>
      <ul className="mt-6 border-t border-line">
        {layer.services.map((service) => (
          <li key={service} className="flex items-baseline gap-3 border-b border-line py-2 text-[1.0625rem] text-fg/85">
            <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-0.3em] bg-accent" />
            {service}
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <FrontLink layerIndex={index} focusable={visible} />
      </div>
    </div>
  )
}

function Indicators({ visible = true, compact = false }: { visible?: boolean; compact?: boolean }) {
  return (
    <ul aria-label="Indicadores" className={`grid grid-cols-2 ${compact ? 'gap-x-6 gap-y-7' : 'gap-x-6 gap-y-6'}`}>
      {company.metrics.map((metric, i) => (
        <li
          key={metric.id}
          className={`flex flex-col border-t border-line pt-3 transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: visible ? `${900 + i * 120}ms` : '0ms' }}
        >
          <span className="label-mono text-faint">IND-{pad2(i + 1)}</span>
          <p className="order-3 mt-3 max-w-[9ch] font-display text-lg font-bold uppercase leading-[1.02] tracking-tight [font-stretch:85%] [text-wrap:balance]">{metric.label}</p>
          <p className="order-2 mt-2">
            {isPending(metric.value) ? (
              <Pending value={metric.value} className="text-[0.625rem]" />
            ) : (
              <span className="font-display text-5xl font-bold tracking-tighter [font-stretch:75%]">{metric.value}</span>
            )}
          </p>
        </li>
      ))}
    </ul>
  )
}

function Closing({ on }: { on: boolean }) {
  return (
    <div data-on={on} className="group">
      <span aria-hidden="true" className="-mt-px block h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-1000 ease-mech group-data-[on=true]:scale-x-100 motion-reduce:transition-none" />
      <p className="mt-4 font-display text-[2rem] font-bold uppercase leading-[0.95] tracking-tight [font-stretch:80%] lg:text-[2.25rem]">
        {about.closing.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <span
              className="block translate-y-[120%] opacity-0 transition-[transform,opacity] duration-700 ease-mech group-data-[on=true]:translate-y-0 group-data-[on=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-opacity"
              style={{ transitionDelay: on ? `${400 + i * 120}ms` : '0ms' }}
            >
              {line}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}

function DeckLayout() {
  const stage = Math.min(useSlideStep(), FINAL)
  const initial = useRef(stage).current
  const layerRef = useBlueprint(stage, initial)
  const wipe = useWipe(useRef(null), true)

  return (
    <div className="grid min-h-0 flex-1 grid-cols-[360px_minmax(0,1fr)_300px] gap-8">
      <div className="flex min-h-0 flex-col justify-between">
        <h2 id={titleId('quem-somos')} className="display-xl text-[4.25rem]">
          {about.headline}
        </h2>
        <div>
          <p className="label-mono mb-3 text-faint">Da cota mais alta à mais baixa</p>
          <LayerIndex stage={stage} />
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="flex min-h-0 flex-1 items-center">
          <OperationBlueprint layerRef={layerRef} wipeRef={wipe} className="max-h-full w-full" />
        </div>
        <div className="relative mt-3 h-[96px] border-t border-line pt-3">
          <p className={`label-mono absolute left-0 top-3 text-faint transition-opacity duration-500 ${stage === FINAL ? 'opacity-0' : 'opacity-100'}`}>{about.drawingNote}</p>
          <div className="absolute inset-x-0 top-0">
            <Closing on={stage === FINAL} />
          </div>
        </div>
      </div>

      <div className="relative min-h-0 overflow-hidden">
        <div aria-hidden={stage !== 0} className={`${fade} absolute inset-0 ${stage === 0 ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}>
          <p className="font-display text-[2.25rem] font-bold leading-[1.02] tracking-tight [font-stretch:82%]">{about.statement}</p>
          <p className="label-mono mt-6 border-t border-line pt-4 leading-relaxed text-muted">{about.support}</p>
        </div>
        {operationLayers.map((layer, i) => (
          <LayerPanel key={layer.id} index={i} visible={stage === i + 1} />
        ))}
        <div aria-hidden={stage !== FINAL} className={`absolute inset-0 ${stage === FINAL ? '' : 'pointer-events-none'}`}>
          <p className={`${fade} label-mono mb-6 text-muted ${stage === FINAL ? 'opacity-100' : 'opacity-0'}`}>{about.support}</p>
          <Indicators visible={stage === FINAL} />
        </div>
      </div>
    </div>
  )
}

function FlowLayout() {
  const [stage, setStage] = useState(0)
  const story = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLLIElement | null)[]>([])
  const closing = useRef<HTMLDivElement>(null)
  const layerRef = useBlueprint(stage, 0)
  const wipe = useWipe(story, false)

  useEffect(() => {
    const triggers = [
      ...cards.current.map((el, i) =>
        ScrollTrigger.create({ trigger: el, start: 'top 62%', end: 'bottom 62%', onToggle: (self) => self.isActive && setStage(i + 1), onLeaveBack: () => i === 0 && setStage(0) }),
      ),
      ScrollTrigger.create({ trigger: closing.current, start: 'top 75%', onEnter: () => setStage(FINAL), onLeaveBack: () => setStage(COUNT) }),
    ]
    return () => triggers.forEach((t) => t.kill())
  }, [])

  return (
    <div>
      <h2 id={titleId('quem-somos')} className="display-xl">
        {about.headline}
      </h2>
      <p className="mt-6 font-display text-[1.75rem] font-bold leading-[1.05] tracking-tight [font-stretch:82%]">{about.statement}</p>
      <p className="label-mono mt-4 leading-relaxed text-muted">{about.support}</p>

      <div ref={story} className="relative mt-8">
        <div className="sticky top-16 z-10 -mx-5 border-b border-line bg-paper px-5 pb-2 pt-3">
          <OperationBlueprint layerRef={layerRef} wipeRef={wipe} className="w-full" />
        </div>
        <ol aria-label="Camadas da operação">
          {operationLayers.map((layer, i) => {
            const active = stage === i + 1
            return (
              <li
                key={layer.id}
                ref={(el) => {
                  cards.current[i] = el
                }}
                aria-current={active ? 'step' : undefined}
                className={`flex min-h-[40svh] flex-col justify-center border-l-2 py-8 pl-5 transition-[opacity,border-color] duration-500 ${active ? 'border-accent opacity-100' : 'border-line opacity-50'}`}
              >
                <p className="label-mono flex items-center gap-3 text-accent-ink">
                  {pad2(i + 1)} / {pad2(COUNT)}
                  <span className="text-blueprint">{layer.elevation}</span>
                </p>
                <h3 className="mt-3 font-display text-[2rem] font-bold leading-[0.95] tracking-tight [font-stretch:82%]">{layer.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-fg/85">
                  {layer.services.map((service) => (
                    <li key={service} className="flex items-center gap-2">
                      <span aria-hidden="true" className="h-px w-2.5 bg-accent" />
                      {service}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <FrontLink layerIndex={i} />
                </div>
              </li>
            )
          })}
        </ol>
        <div ref={closing} className="py-12">
          <Closing on={stage === FINAL} />
        </div>
      </div>

      <Indicators compact />
    </div>
  )
}

export function AboutSection() {
  const deck = usePresentationMode() === 'deck'
  return (
    <Screen id="quem-somos" grid>
      {deck ? <DeckLayout /> : <FlowLayout />}
    </Screen>
  )
}
