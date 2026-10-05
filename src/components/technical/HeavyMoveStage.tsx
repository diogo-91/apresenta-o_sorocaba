import { useEffect, useRef, useState } from 'react'
import { heavyCopy, heavyStages, HEAVY_FINAL } from '../../data/heavyMove'
import { HeavyMoveRig } from './HeavyMoveRig'

const fade = 'transition-[opacity,transform] duration-700 ease-mech motion-reduce:transition-opacity'

function Closing({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <p className="font-display text-[1.75rem] font-bold uppercase leading-[0.95] tracking-tight [font-stretch:82%] lg:text-[2.25rem]">{heavyCopy.closing}</p>
      <p className="label-mono mt-3 text-accent-ink">{heavyCopy.closingSub}</p>
    </div>
  )
}

export function HeavyStagePanel({ stage }: { stage: number }) {
  const panels = [
    { key: 'start', kicker: heavyCopy.pointA, title: 'Máquina parada na posição inicial.', text: null as string | null },
    ...heavyStages.map((s) => ({ key: s.number, kicker: s.number, title: s.title, text: s.text })),
  ]
  return (
    <div className="relative min-h-[120px]" aria-live="polite">
      {panels.map((p, i) => {
        const on = stage === i
        return (
          <div key={p.key} aria-hidden={!on} className={`${fade} absolute inset-0 ${on ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
            <p className="label-mono text-accent-ink">{p.kicker}</p>
            <p className="mt-2 font-display text-[2rem] font-bold leading-none tracking-tight [font-stretch:82%]">{p.title}</p>
            {p.text && <p className="mt-2 max-w-[44ch] text-[1.0625rem] text-muted">{p.text}</p>}
          </div>
        )
      })}
      <div aria-hidden={stage !== HEAVY_FINAL} className={`${fade} absolute inset-0 ${stage === HEAVY_FINAL ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'}`}>
        <Closing />
      </div>
    </div>
  )
}

export function HeavyMobile() {
  const [stage, setStage] = useState(0)
  const list = useRef<HTMLOListElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const current = useRef(0)

  useEffect(() => {
    let frame = 0
    const measure = () => {
      frame = 0
      const mark = window.innerHeight * 0.62
      const passed = items.current.filter((el) => el && el.getBoundingClientRect().top <= mark).length
      const last = items.current[items.current.length - 1]
      const next = last && last.getBoundingClientRect().bottom < mark ? HEAVY_FINAL : passed
      if (next !== current.current) {
        current.current = next
        setStage(next)
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="relative mt-6">
      <div className="sticky top-16 z-10 -mx-5 border-b border-line bg-paper px-2 pb-1 pt-2">
        <HeavyMoveRig stage={stage} compact className="block h-auto w-full" />
      </div>
      <ol ref={list} className="relative mt-2 border-l border-line-strong" aria-label="Do ponto A ao ponto B">
        {heavyStages.map((s, i) => {
          const active = stage === i + 1
          const reached = stage >= i + 1
          return (
            <li
              key={s.number}
              ref={(el) => {
                items.current[i] = el
              }}
              aria-current={active ? 'step' : undefined}
              className={`relative flex min-h-[30svh] flex-col justify-center py-6 pl-6 transition-opacity duration-500 ${active ? 'opacity-100' : reached ? 'opacity-70' : 'opacity-40'}`}
            >
              <span aria-hidden="true" className={`absolute -left-[5px] top-1/2 size-[9px] -translate-y-1/2 border transition-colors duration-500 ${reached ? 'border-accent bg-accent' : 'border-line-strong bg-paper'}`} />
              <p className="label-mono text-accent-ink">{i === 0 ? `${heavyCopy.pointA} · ${s.number}` : i === heavyStages.length - 1 ? `${s.number} · ${heavyCopy.pointB}` : s.number}</p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-1 text-sm text-muted">{s.text}</p>
            </li>
          )
        })}
      </ol>
      <Closing className="mt-8" />
    </div>
  )
}
