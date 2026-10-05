import type { TechnicalFront } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { FrontGlyph } from '../components/technical/FrontGlyph'
import { MachineScene, ReservoirScene, RoofScene } from '../components/technical/Scenes'
import { FLOW_FINAL, SystemsFlowDeck, SystemsFlowMobile } from '../components/technical/SystemsFlow'
import { systemsCopy } from '../data/systemsFlow'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { Headline } from '../components/ui/Headline'
import { MediaFrame } from '../components/ui/MediaFrame'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'

function FrontTag({ front }: { front: TechnicalFront }) {
  return (
    <div className="flex items-center gap-4">
      <FrontGlyph id={front.id} className="h-8 w-auto text-blueprint" />
      <p className="label-mono text-blueprint">
        Frente {front.code} <span className="text-faint">/</span> <span className="text-fg">{front.name}</span>
      </p>
    </div>
  )
}

function Services({ front, compact = false }: { front: TechnicalFront; compact?: boolean }) {
  return (
    <ol className="border-t border-line">
      {front.services.map((service, i) => (
        <Reveal as="li" key={service.name} delay={0.3 + 0.08 * i} className={`grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-line ${compact ? 'py-2.5' : 'py-3'}`}>
          <span className="label-mono pt-1.5 text-faint">{String(i + 1).padStart(2, '0')}</span>
          <div>
            <span className="font-display text-xl font-semibold tracking-tight">{service.name}</span>
            {!compact && <span className="mt-0.5 block text-sm leading-relaxed text-muted">{service.detail}</span>}
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

function Facts({ front, layout = 'row', maxRisks = 3, quiet = false }: { front: TechnicalFront; layout?: 'row' | 'stack'; maxRisks?: number; quiet?: boolean }) {
  return (
    <Reveal delay={0.5} className={`grid gap-x-6 gap-y-4 border-t border-line ${quiet ? 'pt-3 opacity-80 [&_li]:text-xs [&_p]:text-xs' : 'pt-4'} ${layout === 'row' ? 'sm:grid-cols-[2fr_1fr_1fr]' : 'grid-cols-2 [&>div:first-child]:col-span-2'}`}>
      <div>
        <h3 className="label-mono text-alert">Riscos evitados</h3>
        <ul className="mt-2 flex flex-col gap-1.5">
          {front.risks.slice(0, maxRisks).map((risk) => (
            <li key={risk} className="flex gap-2.5 text-sm leading-snug text-fg/85">
              <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 bg-alert" />
              {risk}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="label-mono text-muted">Normas aplicáveis</h3>
        <p className="mt-2 text-sm">{front.norms.length ? front.norms.join(' · ') : <Pending value={null} />}</p>
      </div>
      <div>
        <h3 className="label-mono text-muted">Mini case</h3>
        <p className="mt-2 text-sm">
          <Pending value={front.miniCase.title} />
        </p>
      </div>
    </Reveal>
  )
}

function Envoltoria({ front }: { front: TechnicalFront }) {
  return (
    <Screen id={front.id}>
      <div className="grid flex-1 gap-8 lg:grid-cols-12 lg:gap-0">
        <MediaFrame
          src={front.photo.src}
          alt={front.photo.alt}
          caption={front.photo.caption}
          scene={<RoofScene />}
          labelPosition="top"
          className="-mx-5 aspect-[4/3] md:mx-0 lg:col-span-7 lg:-mb-5 lg:-ml-24 lg:-mt-9 lg:aspect-auto"
        />
        <div className="relative flex flex-col lg:col-span-5 lg:pl-12">
          <FrontTag front={front} />
          <div className="relative mt-5 bg-paper lg:-ml-48 lg:py-6 lg:pl-12 lg:pr-6">
            <span aria-hidden="true" className="absolute left-0 top-0 hidden h-full w-[3px] bg-accent lg:block" />
            <Headline id={titleId(front.id)} size="lg" text={front.headline} className="max-w-[14ch] lg:text-[3.4rem]" />
          </div>
          <Reveal delay={0.2}>
            <p className="lede mt-4 max-w-[40ch] lg:text-lg">{front.description}</p>
          </Reveal>
          <div className="mt-5">
            <Services front={front} compact />
          </div>
          <div className="mt-auto pt-5">
            <Facts front={front} maxRisks={2} />
          </div>
        </div>
      </div>
    </Screen>
  )
}

function Sistemas({ front }: { front: TechnicalFront }) {
  const deck = usePresentationMode() === 'deck'
  const step = useSlideStep()
  const final = step >= FLOW_FINAL
  return (
    <Screen id={front.id} tone="deep" grid>
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <FrontTag front={front} />
          <h2 id={titleId(front.id)} aria-label={front.headline} className="display-lg mt-5 lg:text-[3.25rem]">
            {systemsCopy.headline.map((line, i) => (
              <span key={line} aria-hidden="true" className={`block ${i === 1 ? 'text-muted' : ''}`}>
                {line}
              </span>
            ))}
          </h2>
        </div>
        <Reveal className="lg:col-span-4" delay={0.2}>
          <p className="lede">{front.description}</p>
        </Reveal>
      </div>
      {deck ? (
        <>
          <div className="mt-5">
            <SystemsFlowDeck stage={step} />
          </div>
          <div className={`mt-auto pt-3 transition-opacity duration-700 motion-reduce:opacity-100 ${final ? 'opacity-100' : 'opacity-0'}`} aria-hidden={!final}>
            <Facts front={front} maxRisks={2} quiet />
          </div>
        </>
      ) : (
        <>
          <SystemsFlowMobile />
          <div className="mt-10">
            <Facts front={front} maxRisks={2} quiet />
          </div>
        </>
      )}
    </Screen>
  )
}

function AtivosPesados({ front }: { front: TechnicalFront }) {
  return (
    <Screen
      id={front.id}
      background={
        <div className="absolute inset-0 max-lg:hidden">
          <MediaFrame fill src={front.photo.src} alt={front.photo.alt} caption={front.photo.caption} scene={<MachineScene />} labelPosition="top" className="[&>div]:opacity-55 [&>figcaption]:left-auto [&>figcaption]:right-24 [&>figcaption]:top-[118px]" />
          <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-paper via-paper/90 to-transparent" />
        </div>
      }
    >
      <FrontTag front={front} />
      <h2 id={titleId(front.id)} className="mt-6 font-display font-bold leading-[0.86] tracking-[-0.04em] [font-stretch:78%] text-[clamp(3rem,13vw,4.5rem)] lg:text-[8rem]">
        {front.headline.split('. ').map((part, i, all) => (
          <span key={part} className={`block ${i > 0 ? 'text-muted' : ''}`}>
            {i < all.length - 1 ? `${part}.` : part}
          </span>
        ))}
      </h2>
      <div className="mt-6 lg:hidden">
        <MediaFrame src={front.photo.src} alt={front.photo.alt} caption={front.photo.caption} scene={<MachineScene />} className="-mx-5 aspect-[4/3]" />
      </div>
      <div className="mt-auto grid gap-8 pt-8 lg:grid-cols-12">
        <ol className="grid gap-5 sm:grid-cols-4 lg:col-span-8">
          {front.services.map((service, i) => (
            <Reveal as="li" key={service.name} delay={0.3 + i * 0.1} className="relative border-t-2 border-fg pt-3">
              <span className="label-mono text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-display text-xl font-bold tracking-tight">{service.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{service.detail}</p>
            </Reveal>
          ))}
        </ol>
        <div className="lg:col-span-4">
          <Facts front={front} layout="stack" />
        </div>
      </div>
    </Screen>
  )
}

function Utilidades({ front }: { front: TechnicalFront }) {
  return (
    <Screen id={front.id} theme="dark" className="grain">
      <div className="grid flex-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col lg:col-span-6">
          <FrontTag front={front} />
          <Headline id={titleId(front.id)} size="lg" text={front.headline} className="mt-5 max-w-[14ch] lg:text-[4rem]" />
          <Reveal delay={0.2}>
            <p className="lede mt-5 max-w-[42ch]">{front.description}</p>
          </Reveal>
          <div className="mt-5">
            <Services front={front} compact />
          </div>
          <div className="mt-auto pt-5">
            <Facts front={front} maxRisks={2} />
          </div>
        </div>
        <MediaFrame
          src={front.photo.src}
          alt={front.photo.alt}
          caption={front.photo.caption}
          scene={<ReservoirScene />}
          className="-mx-5 aspect-[4/5] md:mx-0 lg:col-span-6 lg:-mb-5 lg:-mr-24 lg:-mt-9 lg:aspect-auto"
        />
      </div>
    </Screen>
  )
}

const VARIANTS = {
  envoltoria: Envoltoria,
  sistemas: Sistemas,
  'ativos-pesados': AtivosPesados,
  utilidades: Utilidades,
}

export function FrontScreen({ front }: { front: TechnicalFront }) {
  const Variant = VARIANTS[front.id]
  return <Variant front={front} />
}
