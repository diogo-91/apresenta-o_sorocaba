import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { heavyCopy, heavyStages, HEAVY_FINAL } from '../../data/heavyMove'
import { useAutoplayVideo } from '../../hooks/useAutoplayVideo'
import { useIdleMount } from '../../hooks/useIdleMount'
import { Pending } from '../ui/Pending'

const COUNT = heavyStages.length
const ease = 'duration-700 ease-mech motion-reduce:transition-none'

function FieldVideo({ stage, className = '', fade = true }: { stage: number; className?: string; fade?: boolean }) {
  const reduced = useReducedMotion() ?? false
  const ready = useIdleMount(900)
  const src = ready ? heavyCopy.videoSrc : undefined
  const video = useRef<HTMLVideoElement>(null)
  useAutoplayVideo(video, src)
  const depth = reduced ? 0 : Math.min(stage, HEAVY_FINAL) / HEAVY_FINAL
  const current = stage >= 1 && stage <= COUNT ? heavyStages[stage - 1] : null
  const final = stage >= HEAVY_FINAL

  return (
    <div className={`overflow-hidden bg-night ${className}`}>
      <div aria-hidden="true" className={`absolute inset-0 transition-transform ${ease}`} style={{ transform: `scale(${(1 + 0.015 * depth).toFixed(4)})` }}>
        <video ref={video} className="size-full object-cover" src={src} poster={heavyCopy.posterSrc} autoPlay muted loop playsInline preload="metadata" disablePictureInPicture disableRemotePlayback tabIndex={-1} />
      </div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(8_10_12/0.7)_0%,rgb(8_10_12/0.15)_38%,transparent_60%)] transition-opacity ${ease}`} style={{ opacity: final ? 1 : 0.65 }} />
      {fade && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[16%] bg-[linear-gradient(to_right,var(--color-paper),transparent)]" />}

      <p className="label-mono absolute left-[18%] top-5 flex items-start gap-2 text-[0.5625rem] leading-relaxed text-white/75 max-lg:left-5">
        <span aria-hidden="true" className="mt-1 size-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
        <span>
          {heavyCopy.videoLabel[0]}
          <br />
          <span className="text-white/50">{heavyCopy.videoLabel[1]}</span>
        </span>
      </p>
      {current && (
        <p key={current.number} className="label-mono absolute right-6 top-5 text-[0.625rem] text-white/80 motion-safe:animate-[fadein_0.6s_ease-out_both] max-lg:hidden" aria-hidden="true">
          {current.number} / {String(COUNT).padStart(2, '0')} — {current.title}
        </p>
      )}
      <div className={`absolute bottom-7 left-[18%] transition-[opacity,transform] ${ease} max-lg:left-5 ${final ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`} aria-hidden={!final}>
        <p className="font-display text-[2.75rem] font-bold uppercase leading-[0.92] tracking-tight text-white [font-stretch:80%]">
          {heavyCopy.closing.map((line, i) => (
            <span key={line} className={`block ${i === 1 ? 'text-accent' : ''}`}>
              {line}
            </span>
          ))}
        </p>
        <p className="label-mono mt-3 text-white/70">{heavyCopy.closingSub}</p>
      </div>
    </div>
  )
}

function Headline({ id, label, shift = 0 }: { id: string; label: string; shift?: number }) {
  return (
    <h2 id={id} aria-label={label} className={`font-display font-bold leading-[0.86] tracking-[-0.035em] [font-stretch:76%] text-[clamp(3.25rem,15vw,5rem)] transition-transform ${ease} lg:text-[6.75rem]`} style={{ transform: `translateY(${shift}px)` }}>
      {heavyCopy.headlineLines.map((line) => (
        <span key={line} aria-hidden="true" className="block">
          {line}
        </span>
      ))}
      <span aria-hidden="true" className="relative block text-accent">
        {heavyCopy.headlineAccent}
      </span>
    </h2>
  )
}

function Timeline({ stage, vertical = false, itemRef }: { stage: number; vertical?: boolean; itemRef?: (i: number) => (el: HTMLLIElement | null) => void }) {
  const progress = stage > COUNT ? 1 : Math.max(0, (stage - 1) / (COUNT - 1))
  return (
    <ol className={`relative ${vertical ? 'flex flex-col gap-9 pl-7' : 'grid grid-cols-5'}`} aria-label="Etapas da movimentação">
      <span aria-hidden="true" className={vertical ? 'absolute bottom-2 left-[3px] top-2 w-px bg-line-strong' : 'absolute left-0 right-[20%] top-[5px] h-px bg-line-strong'} />
      <span
        aria-hidden="true"
        className={`absolute bg-accent transition-transform ${ease} ${vertical ? 'bottom-2 left-[2px] top-2 w-[3px] origin-top' : 'left-0 right-[20%] top-[4px] h-[3px] origin-left'}`}
        style={{ transform: vertical ? `scaleY(${progress})` : `scaleX(${progress})` }}
      />
      {heavyStages.map((s, i) => {
        const active = stage === i + 1
        const reached = stage >= i + 1
        return (
          <li key={s.number} ref={itemRef?.(i)} aria-current={active ? 'step' : undefined} className={`relative ${vertical ? '' : 'pr-6 pt-7'}`}>
            <span aria-hidden="true" className={`absolute size-[9px] rounded-full transition-colors ${ease} ${vertical ? '-left-7 top-1.5' : 'left-0 top-px'} ${reached ? 'bg-accent' : 'bg-paper ring-1 ring-line-strong'} ${active ? 'ring-4 ring-accent/20' : ''}`} />
            <p className={`label-mono text-[0.625rem] transition-colors ${ease} ${active ? 'text-accent-ink' : 'text-faint'}`}>{s.number}</p>
            <p className={`mt-1 font-display text-2xl font-bold uppercase leading-none tracking-tight transition-colors ${ease} [font-stretch:82%] ${reached ? 'text-fg' : 'text-fg/30'}`}>{s.title}</p>
            <p className={`label-mono mt-2 text-[0.5625rem] normal-case tracking-[0.08em] transition-colors ${ease} ${reached ? 'text-muted' : 'text-faint/70'}`}>{s.keys}</p>
          </li>
        )
      })}
    </ol>
  )
}

function Notes() {
  const { risks, norms, caseStudy } = heavyCopy
  return (
    <p className="label-mono flex flex-wrap items-baseline gap-x-8 gap-y-2 text-[0.5625rem] text-faint">
      <span>
        <span className="text-alert">{risks.label}</span>
        <span className="ml-3 normal-case tracking-[0.06em] text-muted">{risks.items.join(' · ')}</span>
      </span>
      <span>
        {norms.label} <Pending value={norms.value} className="ml-2 text-[0.5625rem]" />
      </span>
      <span>
        {caseStudy.label} <Pending value={caseStudy.value} className="ml-2 text-[0.5625rem]" />
      </span>
    </p>
  )
}

export function HeavyDeck({ stage, id, label, tag }: { stage: number; id: string; label: string; tag: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false
  const shown = reduced ? HEAVY_FINAL : stage
  return (
    <div className="relative min-h-0 flex-1">
      <FieldVideo stage={shown} className="absolute -right-24 top-0 h-[520px] w-[1000px]" />
      <div className="relative z-10 w-[640px]">
        {tag}
        <div className="mt-6">
          <Headline id={id} label={label} shift={reduced ? 0 : -Math.min(shown, HEAVY_FINAL) * 1.5} />
        </div>
        <p className="mt-7 font-display text-[2.5rem] font-bold leading-none tracking-tight text-muted [font-stretch:80%]">{heavyCopy.headlineTail}</p>
        <p className="mt-6 max-w-[26ch] text-[0.9375rem] leading-relaxed text-muted">{heavyCopy.subheadline}</p>
      </div>
      <div className="absolute inset-x-0 bottom-12">
        <Timeline stage={shown} />
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <Notes />
      </div>
    </div>
  )
}

export function HeavyMobile({ id, label, tag }: { id: string; label: string; tag: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false
  const [stage, setStage] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const current = useRef(0)

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const measure = () => {
      frame = 0
      const mark = window.innerHeight * 0.55
      const next = items.current.filter((el) => el && el.getBoundingClientRect().top <= mark).length
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
    <div>
      {tag}
      <div className="mt-5">
        <Headline id={id} label={label} />
      </div>
      <p className="mt-4 font-display text-[1.75rem] font-bold leading-none tracking-tight text-muted [font-stretch:80%]">{heavyCopy.headlineTail}</p>
      <FieldVideo stage={shown >= COUNT ? HEAVY_FINAL : 0} fade={false} className="relative -mx-5 mt-8 aspect-[4/3]" />
      <p className="mt-6 max-w-[30ch] text-base leading-relaxed text-muted">{heavyCopy.subheadline}</p>
      <div className="mt-10">
        <Timeline
          vertical
          stage={shown}
          itemRef={(i) => (el) => {
            items.current[i] = el
          }}
        />
      </div>
      <div className="mt-12 border-t border-line pt-4">
        <Notes />
      </div>
    </div>
  )
}
