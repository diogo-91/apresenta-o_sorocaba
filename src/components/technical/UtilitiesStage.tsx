import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { TechnicalFront } from '../../data/services'
import { utilitiesCopy, utilityShots, type UtilityShot } from '../../data/utilities'
import { Reveal } from '../motion/Reveal'
import { Pending } from '../ui/Pending'

const ease = 'duration-700 ease-mech motion-reduce:transition-none'

function FieldShot({ shot, focus, className = '', caption = 'top' }: { shot: UtilityShot; focus: boolean; className?: string; caption?: 'top' | 'bottom' }) {
  return (
    <figure className={`overflow-hidden bg-surface ${className}`}>
      <div className={`absolute inset-0 transition-[transform,filter] ${ease}`} style={{ transform: `scale(${focus ? 1.02 : 1})`, filter: focus ? 'none' : 'saturate(0.45) contrast(0.85)' }}>
        {shot.src ? (
          <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: shot.position }} />
        ) : (
          <div role="img" aria-label={`${shot.alt} (foto pendente)`} className="grain relative size-full bg-[radial-gradient(ellipse_at_70%_35%,var(--color-surface-2),var(--color-paper)_75%)]">
            <p className="label-mono absolute bottom-6 right-6 text-right text-[0.5625rem] text-faint">
              <Pending value="[FOTO DE CAMPO A ENVIAR]" className="text-[0.5625rem]" />
              <span className="mt-1.5 block normal-case tracking-[0.06em] text-faint/70">{shot.file}</span>
            </p>
          </div>
        )}
      </div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${caption === 'top' ? 'bg-[linear-gradient(to_bottom,rgb(8_10_12/0.55),transparent_35%)]' : 'bg-[linear-gradient(to_top,rgb(8_10_12/0.7),transparent_40%)]'}`} />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-0 bg-paper transition-opacity ${ease}`} style={{ opacity: focus ? 0 : 0.45 }} />
      <figcaption className={`label-mono absolute left-6 ${caption === 'top' ? 'top-6' : 'bottom-6'} flex items-start gap-3 text-[0.625rem] transition-opacity ${ease} ${focus ? 'opacity-100' : 'opacity-60'}`}>
        <span className="flex items-center gap-2 text-accent-ink">
          <span aria-hidden="true" className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inset-0 rounded-full ring-1 ring-accent/60" />
            <span className="size-1 rounded-full bg-accent" />
          </span>
          {shot.number}
        </span>
        <span aria-hidden="true" className="mt-[0.45rem] h-px w-10 bg-white/40" />
        <span className="text-white">
          {shot.title}
          <span className="mt-1 block text-white/60">{shot.keys}</span>
        </span>
      </figcaption>
    </figure>
  )
}

function Headline({ id, label }: { id: string; label: string }) {
  return (
    <h2 id={id} aria-label={label} className="font-display font-bold leading-[0.9] tracking-[-0.03em] [font-stretch:80%] text-[clamp(2.75rem,12vw,4rem)] lg:text-[4.25rem]">
      {utilitiesCopy.headline.map((line, i) => (
        <span key={line} aria-hidden="true" className={`block ${i === 2 ? 'text-muted' : ''}`}>
          {line}
        </span>
      ))}
    </h2>
  )
}

function ServiceList({ front }: { front: TechnicalFront }) {
  return (
    <ol className="flex flex-col gap-3">
      {front.services.map((service, i) => (
        <Reveal as="li" key={service.name} delay={0.25 + 0.07 * i} className="flex items-baseline gap-4">
          <span className="label-mono w-6 shrink-0 text-[0.625rem] text-faint">{String(i + 1).padStart(2, '0')}</span>
          <span className="font-display text-[1.5rem] font-semibold leading-tight tracking-tight [font-stretch:88%]">{service.name}</span>
        </Reveal>
      ))}
    </ol>
  )
}

function Notes({ front }: { front: TechnicalFront }) {
  return (
    <p className="label-mono flex flex-wrap items-baseline gap-x-8 gap-y-2 text-[0.5625rem] text-faint">
      <span>
        <span className="text-alert">Riscos evitados</span>
        <span className="ml-3 normal-case tracking-[0.06em] text-muted">{front.risks.join(' · ')}</span>
      </span>
      <span>
        Normas aplicáveis {front.norms.length ? <span className="ml-2 text-muted">{front.norms.join(' · ')}</span> : <Pending value={null} className="ml-2 text-[0.5625rem]" />}
      </span>
      <span>
        Mini case <Pending value={front.miniCase.title} className="ml-2 text-[0.5625rem]" />
      </span>
    </p>
  )
}

type Props = { front: TechnicalFront; id: string; tag: ReactNode }

export function UtilitiesDeck({ front, id, tag, stage }: Props & { stage: number }) {
  const reduced = useReducedMotion() ?? false
  const [reservoir, confined] = utilityShots
  return (
    <div className="relative min-h-0 flex-1">
      <FieldShot shot={reservoir} focus={reduced || stage === 0} className="absolute -right-24 top-0 h-[470px] w-[800px]" />
      <FieldShot shot={confined} focus={reduced || stage >= 1} caption="bottom" className="absolute right-[460px] top-[320px] z-10 h-[300px] w-[440px]" />
      <div className="relative z-20 w-[500px]">
        {tag}
        <div className="mt-6">
          <Headline id={id} label={front.headline} />
        </div>
        <p className="mt-6 max-w-[36ch] text-[0.9375rem] leading-relaxed text-muted">{front.description}</p>
        <div className="mt-8">
          <ServiceList front={front} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <Notes front={front} />
      </div>
    </div>
  )
}

export function UtilitiesMobile({ front, id, tag }: Props) {
  const [reservoir, confined] = utilityShots
  return (
    <div>
      {tag}
      <div className="mt-5">
        <Headline id={id} label={front.headline} />
      </div>
      <p className="mt-5 max-w-[34ch] text-base leading-relaxed text-muted">{front.description}</p>
      <Reveal className="-mx-5 mt-8 md:mx-0">
        <FieldShot shot={reservoir} focus className="relative aspect-[4/3]" />
      </Reveal>
      <div className="mt-8">
        <ServiceList front={front} />
      </div>
      <Reveal className="-mx-5 mt-10 md:mx-0">
        <FieldShot shot={confined} focus caption="bottom" className="relative aspect-[4/3]" />
      </Reveal>
      <div className="mt-10 border-t border-line pt-4">
        <Notes front={front} />
      </div>
    </div>
  )
}
