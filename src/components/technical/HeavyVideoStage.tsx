import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { heavyCopy, heavyStages, HEAVY_FINAL } from '../../data/heavyMove'
import { useAutoplayVideo } from '../../hooks/useAutoplayVideo'
import { useIdleMount } from '../../hooks/useIdleMount'

const COUNT = heavyStages.length
const ease = 'duration-700 ease-mech motion-reduce:transition-none'

function FieldVideo({ stage, bleed = false }: { stage: number; bleed?: boolean }) {
  const reduced = useReducedMotion() ?? false
  const ready = useIdleMount(900)
  const src = ready ? heavyCopy.videoSrc : undefined
  const video = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(video, src)
  const depth = reduced ? 0 : Math.min(stage, HEAVY_FINAL) / HEAVY_FINAL

  return (
    <figure>
      <figcaption className={`label-mono mb-2 flex items-center gap-2 text-muted ${bleed ? 'px-5' : ''}`}>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
        {heavyCopy.videoLabel}
      </figcaption>
      <div className={`relative aspect-video overflow-hidden border-line-strong bg-paper-2 ${bleed ? 'border-y' : 'border shadow-[0_18px_40px_-28px_rgb(14_17_20/0.45)]'}`} aria-hidden="true">
        <div className={`absolute inset-0 transition-transform ${ease}`} style={{ transform: `translateY(${(-6 * depth).toFixed(1)}px) scale(${(1.005 + 0.015 * depth).toFixed(4)})` }}>
          <video ref={video} className="size-full object-cover" src={src} poster={heavyCopy.posterSrc} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture disableRemotePlayback tabIndex={-1} />
        </div>
        <div className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(10_12_14/0.35),transparent_45%)] transition-opacity ${ease}`} style={{ opacity: 0.9 - 0.4 * depth }} />
        <span className="pointer-events-none absolute inset-2 border border-white/15" />
        {['left-2 top-2 border-l border-t', 'right-2 top-2 border-r border-t', 'left-2 bottom-2 border-l border-b', 'right-2 bottom-2 border-r border-b'].map((c) => (
          <span key={c} className={`pointer-events-none absolute size-3 border-white/70 ${c}`} />
        ))}
      </div>
    </figure>
  )
}

function Timeline({ stage, itemRef, spacious = false }: { stage: number; itemRef?: (i: number) => (el: HTMLLIElement | null) => void; spacious?: boolean }) {
  const progress = Math.max(0, Math.min(1, (stage - 1) / (COUNT - 1)))
  return (
    <ol className="relative" aria-label="Etapas da movimentação">
      <span aria-hidden="true" className="absolute bottom-6 left-[5px] top-2 w-px bg-line-strong" />
      <span aria-hidden="true" className={`absolute bottom-6 left-[4px] top-2 w-[3px] origin-top bg-accent transition-transform ${ease}`} style={{ transform: `scaleY(${stage > COUNT ? 1 : progress})` }} />
      {heavyStages.map((s, i) => {
        const active = stage === i + 1
        const reached = stage >= i + 1
        return (
          <li key={s.number} ref={itemRef?.(i)} aria-current={active ? 'step' : undefined} className={`relative grid grid-cols-[1.5rem_1fr] gap-x-4 ${spacious ? 'pb-12' : 'pb-4'} transition-opacity ${ease} last:pb-0 ${reached ? 'opacity-100' : 'opacity-40'}`}>
            <span aria-hidden="true" className={`relative z-10 mt-1 size-[11px] border transition-colors ${ease} ${reached ? 'border-accent bg-accent' : 'border-line-strong bg-paper'} ${active ? 'ring-4 ring-accent/20' : ''}`} />
            <div>
              <p className="flex items-baseline gap-3">
                <span className={`label-mono ${active ? 'text-accent-ink' : 'text-faint'}`}>{s.number}</span>
                <span className={`font-display text-xl font-bold uppercase tracking-tight [font-stretch:85%] ${reached ? 'text-fg' : 'text-muted'}`}>{s.title}</span>
              </p>
              <p className={`mt-0.5 text-[0.9375rem] leading-snug ${active || stage > COUNT ? 'text-fg/80' : 'text-muted'}`}>{s.text}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Closing({ visible }: { visible: boolean }) {
  return (
    <div className={`transition-[opacity,transform] ${ease} ${visible ? 'opacity-100' : 'translate-y-2 opacity-0'}`} aria-hidden={!visible}>
      <p className="font-display text-[1.75rem] font-bold uppercase leading-[0.95] tracking-tight [font-stretch:82%] lg:text-[2rem]">
        {heavyCopy.closing.map((line, i) => (
          <span key={line} className={`block ${i === 1 ? 'text-accent-ink' : ''}`}>
            {line}
          </span>
        ))}
      </p>
      <p className="label-mono mt-2 text-muted">{heavyCopy.closingSub}</p>
    </div>
  )
}

export function HeavyHeadline({ id, label }: { id: string; label: string }) {
  return (
    <>
      <h2 id={id} aria-label={label} className="display-lg mt-4 lg:text-[3rem]">
        <span aria-hidden="true" className="block">
          {heavyCopy.headlineLead} <span className="text-accent-ink">{heavyCopy.headlineAccent}</span>
        </span>
        <span aria-hidden="true" className="block text-muted">
          {heavyCopy.headlineTail}
        </span>
      </h2>
      <p className="lede mt-4 max-w-[38ch]">{heavyCopy.subheadline}</p>
    </>
  )
}

export function HeavyDeck({ stage, intro }: { stage: number; intro: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false
  const shown = reduced ? HEAVY_FINAL : stage
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_52%] gap-14">
      <div className="flex min-h-0 flex-col">
        {intro}
        <div className="mt-7">
          <Timeline stage={shown} />
        </div>
      </div>
      <div className="flex min-h-0 flex-col">
        <FieldVideo stage={shown} />
        <div className="mt-6">
          <Closing visible={shown >= HEAVY_FINAL} />
        </div>
      </div>
    </div>
  )
}

export function HeavyMobile() {
  const reduced = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const current = useRef(0)

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const measure = () => {
      frame = 0
      const mark = window.innerHeight * 0.5
      const passed = items.current.filter((el) => el && el.getBoundingClientRect().top <= mark).length
      const last = items.current[COUNT - 1]
      const next = last && last.getBoundingClientRect().bottom < window.innerHeight * 0.4 ? HEAVY_FINAL : passed
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
  }, [reduced])

  const shown = reduced ? HEAVY_FINAL : stage
  return (
    <>
      <div className="-mx-5 mt-8">
        <FieldVideo stage={0} bleed />
      </div>
      <div className="mt-8">
        <Timeline
          spacious
          stage={shown}
          itemRef={(i) => (el) => {
            items.current[i] = el
          }}
        />
      </div>
      <div className="mt-8">
        <Closing visible={shown >= COUNT} />
      </div>
    </>
  )
}
