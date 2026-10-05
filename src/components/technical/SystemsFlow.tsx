import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { systemsCopy, systemsDisciplines, systemsFlow, type FlowStep } from '../../data/systemsFlow'
import { useTweenedProgress, useScrollProgress } from '../../hooks/useScene'
import { gsap } from '../../lib/gsap'
import { flowLine, flowStage } from '../../lib/flowState'
import { EASE_MECH } from '../../lib/motion'
import { SystemsPictogram } from './SystemsPictogram'

const COUNT = systemsFlow.length
export const FLOW_FINAL = COUNT + 1
const MOTOR = systemsFlow.findIndex((s) => s.domain === 'conversao')
const FR = { tall: 1.25, mid: 1, short: 0.85 }
const HEIGHT = { tall: 'h-[176px]', mid: 'h-[140px]', short: 'h-[106px]' }
const ASPECT = { tall: 'aspect-[4/3]', mid: 'aspect-[16/10]', short: 'aspect-[16/9]' }
const GAP = 16
const LINE_Y = 12
const DOMAIN_TONE = { eletrica: 'text-accent-ink', conversao: 'text-fg', mecanica: 'text-blueprint' }
const transition = 'transition-[opacity,transform,color] duration-700 ease-mech motion-reduce:transition-opacity'

function FlowFrame({ step, active, className = '' }: { step: FlowStep; active: boolean; className?: string }) {
  return (
    <figure className={`relative overflow-hidden border border-line bg-paper ${className}`}>
      {step.image ? (
        <img src={step.image} alt={step.title} loading="lazy" decoding="async" className={`absolute inset-0 size-full object-cover transition-transform duration-[1400ms] ease-out-mech ${active ? 'scale-[1.02]' : 'scale-100'}`} />
      ) : (
        <div role="img" aria-label={`${step.title} (foto a inserir)`} className="absolute inset-0">
          <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-60" />
          <SystemsPictogram
            id={step.id}
            className={`absolute inset-x-[14%] inset-y-[16%] text-blueprint transition-transform duration-[1400ms] ease-out-mech ${active ? 'translate-x-[2%] scale-[1.02]' : ''}`}
          />
          <figcaption className="label-mono text-[0.5rem] text-faint">
            <span className="absolute left-2 top-1.5 flex items-center gap-1.5 whitespace-nowrap">
              <span aria-hidden="true" className="size-1 bg-accent" />
              Foto a inserir
            </span>
            <span className="absolute bottom-1.5 right-2 whitespace-nowrap">{step.file}</span>
          </figcaption>
        </div>
      )}
    </figure>
  )
}

function Status({ step, reached }: { step: FlowStep; reached: boolean }) {
  return (
    <span className={`label-mono flex items-center gap-1.5 text-[0.5625rem] ${reached ? DOMAIN_TONE[step.domain] : 'text-faint'}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full border ${reached ? 'border-current bg-current' : 'border-line-strong'}`} />
      {systemsCopy.domains[step.domain]}
    </span>
  )
}

function Conversion({ lit }: { lit: boolean }) {
  const { label, from, to } = systemsCopy.conversion
  return (
    <div className={`${transition} mt-2 border-l-2 border-accent bg-paper py-1.5 pl-3 pr-2 ${lit ? 'opacity-100' : 'opacity-40'}`}>
      <p className="label-mono text-[0.5625rem] text-fg">{label}</p>
      <p className="mt-1 text-xs font-medium text-accent-ink">{from}</p>
      <p aria-hidden="true" className="text-xs leading-none text-faint">↓</p>
      <p className="text-xs font-medium text-blueprint">{to}</p>
    </div>
  )
}

function useCenters(ref: React.RefObject<HTMLElement | null>) {
  const [geo, setGeo] = useState<{ w: number; c: number[] } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.offsetWidth
      const total = systemsFlow.reduce((sum, s) => sum + FR[s.frame], 0)
      const unit = (w - GAP * (COUNT - 1)) / total
      let left = 0
      const c = systemsFlow.map((s) => {
        const center = left + (FR[s.frame] * unit) / 2
        left += FR[s.frame] * unit + GAP
        return center
      })
      setGeo({ w, c })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])
  return geo
}

function headAt(progress: number, c: number[]) {
  const t = flowLine(progress, COUNT) * (COUNT - 1)
  const i = Math.min(COUNT - 2, Math.floor(t))
  return c[i] + (c[i + 1] - c[i]) * (t - i)
}

export function SystemsFlowDeck({ stage }: { stage: number }) {
  const reduced = useReducedMotion() ?? false
  const shown = reduced ? FLOW_FINAL : stage
  const row = useRef<HTMLDivElement>(null)
  const geo = useCenters(row)
  const geoRef = useRef(geo)
  geoRef.current = geo
  const electric = useRef<SVGLineElement>(null)
  const mechanic = useRef<SVGLineElement>(null)
  const pulse = useRef<SVGGElement>(null)
  const progress = useRef(0)

  const place = useCallback((x: number, visible: boolean) => {
    const g = geoRef.current
    if (!g || !pulse.current) return
    pulse.current.setAttribute('transform', `translate(${x.toFixed(1)} ${LINE_Y})`)
    pulse.current.style.opacity = visible ? '1' : '0'
    pulse.current.dataset.domain = x > g.c[MOTOR] + 0.5 ? 'mecanica' : 'eletrica'
  }, [])

  const render = useCallback(
    (p: number) => {
      progress.current = p
      const g = geoRef.current
      if (!g || !electric.current || !mechanic.current) return
      const x = headAt(p, g.c)
      const lenE = g.c[MOTOR] - g.c[0]
      const lenM = g.c[COUNT - 1] - g.c[MOTOR]
      electric.current.style.strokeDashoffset = String(lenE - Math.min(lenE, Math.max(0, x - g.c[0])))
      mechanic.current.style.strokeDashoffset = String(lenM - Math.min(lenM, Math.max(0, x - g.c[MOTOR])))
      place(x, p >= 1 && p <= COUNT)
    },
    [place],
  )

  useTweenedProgress(shown, render, shown)
  useEffect(() => render(progress.current), [geo, render])

  useEffect(() => {
    const g = geo
    if (shown !== FLOW_FINAL || reduced || !g) return
    const loop = { x: g.c[0] }
    const tween = gsap.to(loop, { x: g.c[COUNT - 1], duration: 3.6, ease: 'none', repeat: -1, delay: 1.2, onUpdate: () => place(loop.x, true) })
    return () => {
      tween.kill()
      place(0, false)
    }
  }, [shown, reduced, geo, place])

  const template = systemsFlow.map((s) => `${FR[s.frame]}fr`).join(' ')
  const lenE = geo ? geo.c[MOTOR] - geo.c[0] : 0
  const lenM = geo ? geo.c[COUNT - 1] - geo.c[MOTOR] : 0

  return (
    <div>
      <div ref={row} className="grid items-end" style={{ gridTemplateColumns: template, columnGap: GAP }}>
        {systemsFlow.map((step, i) => {
          const s = flowStage(shown, i, COUNT)
          return (
            <m.div
              key={step.id}
              initial={reduced ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' }}
              animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 0.9, ease: EASE_MECH, delay: 0.35 + i * 0.07 }}
            >
              <div className={`${transition} origin-bottom`} style={{ opacity: s.opacity, transform: `scale(${s.scale})` }}>
                <FlowFrame step={step} active={s.active} className={HEIGHT[step.frame]} />
              </div>
            </m.div>
          )
        })}
      </div>

      <svg className="block h-6 w-full overflow-visible" viewBox={`0 0 ${geo?.w ?? 1} 24`} aria-hidden="true">
        {geo && (
          <>
            <line x1={geo.c[0]} x2={geo.c[COUNT - 1]} y1={LINE_Y} y2={LINE_Y} className="stroke-line-strong" strokeWidth="1" />
            <line ref={electric} x1={geo.c[0]} x2={geo.c[MOTOR]} y1={LINE_Y} y2={LINE_Y} className="stroke-accent" strokeWidth="2" strokeDasharray={lenE} strokeDashoffset={lenE} />
            <line ref={mechanic} x1={geo.c[MOTOR]} x2={geo.c[COUNT - 1]} y1={LINE_Y} y2={LINE_Y} className="stroke-blueprint" strokeWidth="2" strokeDasharray={lenM} strokeDashoffset={lenM} />
            {geo.c.map((x, i) => {
              const reached = flowStage(shown, i, COUNT).reached
              const tone = i < MOTOR ? 'fill-accent stroke-accent' : i === MOTOR ? 'fill-fg stroke-fg' : 'fill-blueprint stroke-blueprint'
              return <rect key={i} x={x - (i === MOTOR ? 5 : 3.5)} y={LINE_Y - (i === MOTOR ? 5 : 3.5)} width={i === MOTOR ? 10 : 7} height={i === MOTOR ? 10 : 7} className={`transition-colors duration-500 ${reached ? tone : 'fill-paper-2 stroke-line-strong'}`} strokeWidth="1" />
            })}
            <g ref={pulse} className="group/pulse opacity-0 transition-opacity duration-300" data-domain="eletrica">
              <circle r="7" className="fill-accent/20 group-data-[domain=mecanica]/pulse:fill-blueprint/20" />
              <circle r="3" className="fill-accent group-data-[domain=mecanica]/pulse:fill-blueprint" />
            </g>
          </>
        )}
      </svg>

      <ol className="grid" style={{ gridTemplateColumns: template, columnGap: GAP }} aria-label="Da entrada de energia à máquina">
        {systemsFlow.map((step, i) => {
          const s = flowStage(shown, i, COUNT)
          return (
            <li key={step.id} aria-current={s.active ? 'step' : undefined} className={`${transition} flex flex-col pt-1`} style={{ opacity: Math.max(s.opacity, 0.55) }}>
              <span className={`label-mono text-[0.625rem] ${s.active || (s.reached && shown === FLOW_FINAL) ? 'text-accent-ink' : 'text-faint'}`}>{step.number}</span>
              <span className={`mt-1 font-display text-[1.0625rem] font-bold leading-[1.05] tracking-tight [font-stretch:88%] ${s.active ? 'text-fg' : 'text-fg/75'}`}>{step.title}</span>
              <span className="mt-1 text-[0.75rem] leading-snug text-muted">{step.description}</span>
              {i === MOTOR ? (
                <Conversion lit={shown >= MOTOR + 1} />
              ) : (
                <span className="mt-2">
                  <Status step={step} reached={s.reached} />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-4 grid" style={{ gridTemplateColumns: `${systemsFlow.slice(0, MOTOR).reduce((a, s) => a + FR[s.frame], 0)}fr ${FR[systemsFlow[MOTOR].frame]}fr ${systemsFlow.slice(MOTOR + 1).reduce((a, s) => a + FR[s.frame], 0)}fr`, columnGap: GAP }}>
        {(['eletrica', 'conversao', 'mecanica'] as const).map((domain) => {
          const lit = domain === 'eletrica' ? shown >= 1 : domain === 'conversao' ? shown >= MOTOR + 1 : shown >= MOTOR + 2
          const discipline = systemsDisciplines.find((d) => d.id === domain)
          return (
            <div key={domain} className={`border-t-2 pt-2 transition-colors duration-700 ${lit ? (domain === 'eletrica' ? 'border-accent' : domain === 'mecanica' ? 'border-blueprint' : 'border-fg') : 'border-line'}`}>
              {discipline ? (
                <>
                  <p className={`label-mono ${lit ? DOMAIN_TONE[domain] : 'text-faint'}`}>{discipline.title}</p>
                  <p className={`${transition} mt-2 text-sm text-fg/85 ${shown === FLOW_FINAL ? 'opacity-100' : 'translate-y-1 opacity-0'}`} aria-hidden={shown !== FLOW_FINAL}>
                    {discipline.items.join(' · ')}
                  </p>
                </>
              ) : (
                <p className={`${transition} font-display text-sm font-bold uppercase leading-tight tracking-tight [font-stretch:85%] ${shown === FLOW_FINAL ? 'opacity-100' : 'opacity-0'}`} aria-hidden={shown !== FLOW_FINAL}>
                  {systemsCopy.closing.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function SystemsFlowMobile() {
  const reduced = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const shown = reduced ? FLOW_FINAL : stage

  const current = useRef(0)
  const render = useCallback((p: number) => {
    if (line.current) line.current.style.clipPath = `inset(0 0 ${((1 - p) * 100).toFixed(2)}% 0)`
    const mark = window.innerHeight * 0.6
    const passed = items.current.filter((el) => el && el.getBoundingClientRect().top <= mark).length
    const last = items.current[COUNT - 1]
    const next = last && last.getBoundingClientRect().bottom < mark ? FLOW_FINAL : passed
    if (next !== current.current) {
      current.current = next
      setStage(next)
    }
  }, [])
  useScrollProgress(list, render, true)

  useLayoutEffect(() => {
    const motor = items.current[MOTOR]
    if (!motor || !line.current) return
    const paint = () => {
      const y = motor.offsetTop + 8
      line.current?.style.setProperty('background', `linear-gradient(to bottom, var(--color-accent) ${y}px, var(--color-blueprint) ${y}px)`)
    }
    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(list.current!)
    return () => observer.disconnect()
  }, [])


  return (
    <div>
      <ol ref={list} className="relative mt-8 pl-8" aria-label="Da entrada de energia à máquina">
        <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-line-strong" />
        <span ref={line} aria-hidden="true" className="absolute bottom-0 left-[4px] top-0 w-[3px] bg-accent" style={{ clipPath: reduced ? 'none' : 'inset(0 0 100% 0)' }} />
        {systemsFlow.map((step, i) => {
          const s = flowStage(shown, i, COUNT)
          return (
            <li
              key={step.id}
              ref={(el) => {
                items.current[i] = el
              }}
              aria-current={s.active ? 'step' : undefined}
              className={`${transition} relative pb-10 last:pb-2`}
              style={{ opacity: Math.max(s.opacity, 0.5) }}
            >
              <span aria-hidden="true" className={`absolute -left-[31px] top-1 size-[9px] border transition-colors duration-500 ${s.reached ? (i < MOTOR ? 'border-accent bg-accent' : i === MOTOR ? 'border-fg bg-fg' : 'border-blueprint bg-blueprint') : 'border-line-strong bg-paper-2'}`} />
              <div className="flex items-baseline gap-3">
                <span className={`label-mono ${s.active ? 'text-accent-ink' : 'text-faint'}`}>{step.number}</span>
                {i !== MOTOR && <Status step={step} reached={s.reached} />}
              </div>
              <div className={`${transition} mt-3 origin-left`} style={{ transform: `scale(${s.scale})` }}>
                <FlowFrame step={step} active={s.active} className={ASPECT[step.frame]} />
              </div>
              <h3 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight">{step.title}</h3>
              <p className="mt-1 text-sm text-muted">{step.description}</p>
              {i === MOTOR && <Conversion lit={shown >= MOTOR + 1} />}
            </li>
          )
        })}
      </ol>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {systemsDisciplines.map((d) => (
          <div key={d.id} className={`border-t-2 pt-3 ${d.id === 'eletrica' ? 'border-accent' : 'border-blueprint'}`}>
            <p className={`label-mono ${d.id === 'eletrica' ? 'text-accent-ink' : 'text-blueprint'}`}>{d.title}</p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-fg/85">
              {d.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 font-display text-2xl font-bold uppercase leading-tight tracking-tight [font-stretch:85%]">
        {systemsCopy.closing.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}
