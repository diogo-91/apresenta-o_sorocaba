import type { CSSProperties, ReactNode } from 'react'
import { operations, OPERATION_COUNT, type Operation, type OperationId } from '../data/operations'
import { pad2 } from '../data/screens'
import { TBC } from '../lib/placeholder'
import { Screen, titleId } from '../components/layout/Screen'
import { Pending } from '../components/ui/Pending'
import { StationPictogram } from '../components/technical/Pictograms'
import { Reveal } from '../components/motion/Reveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

type Layout = 'split' | 'band' | 'mirror' | 'columns' | 'fullbleed' | 'slant' | 'overlay'

const LAYOUTS: Record<OperationId, Layout> = {
  corte: 'split',
  dobra: 'band',
  usinagem: 'mirror',
  montagem: 'columns',
  solda: 'fullbleed',
  acabamento: 'slant',
  pintura: 'overlay',
}

const DARK: Layout[] = ['fullbleed', 'slant']

const enter = (name: string, duration: number, delay = 0) =>
  ({ animation: `${name} ${duration}s var(--ease-mech) ${delay}s both` }) satisfies CSSProperties

const rise = (delay: number) => ({ animation: `rise 0.9s var(--ease-out-mech) ${delay}s both` }) satisfies CSSProperties

function Motion({ style, className = '', children }: { style: CSSProperties; className?: string; children?: ReactNode }) {
  return (
    <div className={`motion-reduce:![animation:none] ${className}`} style={style}>
      {children}
    </div>
  )
}

function Steps({ index }: { index: number }) {
  return (
    <ol className="flex gap-1.5" aria-label="Operações">
      {operations.map((op, i) => (
        <li key={op.id} aria-current={i === index ? 'step' : undefined} className={`label-mono flex-1 border-t-2 pt-2 text-[0.625rem] ${i === index ? 'border-accent text-accent-ink' : i < index ? 'border-blueprint/60 text-faint' : 'border-line-strong text-faint/70'}`}>
          {pad2(i + 1)}
        </li>
      ))}
    </ol>
  )
}

function Placeholder({ op }: { op: Operation }) {
  return (
    <div role="img" aria-label={`${op.photo.alt} (foto a inserir)`} className="absolute inset-0 bg-night">
      <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-70" />
      <StationPictogram id={op.id} className="absolute left-1/2 top-1/2 w-[62%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 text-[#5fb0e6]" />
    </div>
  )
}

function Caption({ op, className = '' }: { op: Operation; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-2 text-night-fg/75 ${className}`}>
      {!op.photo.src && <span aria-hidden="true" className="size-1.5 bg-accent" />}
      {!op.photo.src && <span className="text-accent-ink">Foto a inserir ·</span>}
      Registro de campo · {op.name}
    </p>
  )
}

function Photo({ op, className = '', position, caption = 'left', children }: { op: Operation; className?: string; position?: string; caption?: 'left' | 'right'; children?: ReactNode }) {
  return (
    <figure className={`overflow-hidden bg-night text-night-fg ${className}`}>
      {op.photo.src ? (
        <>
          <img src={op.photo.src} alt={op.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: position }} />
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-[linear-gradient(to_top,rgb(8_10_12/0.7),transparent)]" />
        </>
      ) : (
        <Placeholder op={op} />
      )}
      {children}
      <figcaption className={`absolute bottom-5 ${caption === 'right' ? 'right-6' : 'left-6'}`}>
        <Caption op={op} />
      </figcaption>
    </figure>
  )
}

function Specs({ op, columns = 3 }: { op: Operation; columns?: 1 | 3 }) {
  return (
    <dl className={`grid ${columns === 3 ? 'grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
      {op.specs.map((spec) => (
        <div key={spec.label} className="border-t border-line pt-3">
          <dt className="label-mono text-xs text-muted">{spec.label}</dt>
          <dd className="mt-2 text-sm">
            <Pending value={spec.value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Processes({ op }: { op: Operation }) {
  return (
    <div>
      <p className="label-mono flex items-center gap-3 text-sm text-muted">
        Processos <Pending value={TBC} className="text-[0.625rem]" />
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {op.processes.map((p) => (
          <li key={p} className="border border-line-strong px-3 py-1.5 text-base">
            {p}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Flowline({ op }: { op: Operation }) {
  return (
    <p className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="text-faint">Entra</span>
      <span className="text-fg">{op.input}</span>
      <span aria-hidden="true" className="text-accent-ink">→</span>
      <span className="text-faint">Sai</span>
      <span className="text-fg">{op.output}</span>
    </p>
  )
}

const NAME_SIZE = { xl: 'lg:text-[8.5rem]', lg: 'lg:text-[7rem]', md: 'lg:text-[5.5rem]' }

function Heading({ op, index, size = 'xl' }: { op: Operation; index: number; size?: keyof typeof NAME_SIZE }) {
  return (
    <>
      <p className="label-mono text-sm text-accent-ink">
        Operação {pad2(index + 1)} / {pad2(OPERATION_COUNT)}
      </p>
      <h2 id={titleId(op.id)} className={`mt-3 font-display text-[clamp(2.75rem,14vw,5rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] [font-stretch:76%] ${NAME_SIZE[size]}`}>
        {op.name}
      </h2>
      <p className="mt-6 font-display text-[1.75rem] font-bold leading-tight tracking-tight [font-stretch:85%] lg:text-[2.25rem]">{op.headline}</p>
    </>
  )
}

function Description({ op, className = '' }: { op: Operation; className?: string }) {
  return <p className={`lede max-w-[44ch] lg:text-[1.3rem] lg:leading-relaxed ${className}`}>{op.description}</p>
}

type DeckProps = { op: Operation; index: number }

function Split({ op, index }: DeckProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-14">
      <div className="col-span-7 flex min-h-0 flex-col">
        <Steps index={index} />
        <Motion style={rise(0.15)} className="mt-8">
          <Heading op={op} index={index} />
        </Motion>
        <Motion style={rise(0.3)}>
          <Description op={op} className="mt-4" />
          <div className="mt-6">
            <Flowline op={op} />
          </div>
        </Motion>
        <div className="mt-auto">
          <Processes op={op} />
        </div>
      </div>
      <div className="col-span-5 -mb-5 -mr-24 -mt-9 flex min-h-0 flex-col">
        <Motion style={enter('reveal-right', 1.1)} className="relative min-h-0 flex-1">
          <Photo op={op} className="absolute inset-0">
            <Motion style={{ animation: 'scanline 1.8s ease-in-out 1s both' }} className="pointer-events-none absolute inset-0 motion-reduce:hidden">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-accent shadow-[0_0_24px_6px_rgb(255_90_31/0.55)]" />
            </Motion>
          </Photo>
        </Motion>
        <div className="py-6 pr-24">
          <Specs op={op} />
        </div>
      </div>
    </div>
  )
}

function Band({ op, index }: DeckProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Motion style={enter('band-open', 1.2)} className="relative -mx-24 -mt-9 h-[44%] min-h-[300px] shrink-0">
        <Photo op={op} className="absolute inset-0" position="50% 46%" caption="right" />
      </Motion>
      <div className="mt-8 grid grid-cols-12 gap-12">
        <Motion style={rise(0.5)} className="col-span-5">
          <Heading op={op} index={index} size="lg" />
        </Motion>
        <Motion style={rise(0.65)} className="col-span-4 pt-9">
          <Description op={op} />
          <div className="mt-5">
            <Flowline op={op} />
          </div>
          <div className="mt-6">
            <Processes op={op} />
          </div>
        </Motion>
        <Motion style={rise(0.8)} className="col-span-3 pt-9">
          <Specs op={op} columns={1} />
        </Motion>
      </div>
      <div className="mt-auto pt-6">
        <Steps index={index} />
      </div>
    </div>
  )
}

function Corners() {
  const corner = 'absolute size-10 border-accent'
  return (
    <Motion style={{ animation: 'rise 0.6s var(--ease-out-mech) 1s both' }} className="pointer-events-none absolute inset-8">
      <span aria-hidden="true" className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${corner} bottom-12 left-0 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${corner} bottom-12 right-0 border-b-2 border-r-2`} />
    </Motion>
  )
}

function Mirror({ op, index }: DeckProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-14">
      <Motion style={enter('reveal-left', 1.1)} className="relative col-span-6 -mb-5 -ml-24 -mt-9">
        <Photo op={op} className="absolute inset-0" caption="right">
          <Corners />
        </Photo>
      </Motion>
      <div className="relative col-span-6 flex min-h-0 flex-col">
        <span aria-hidden="true" className="pointer-events-none absolute right-0 top-[56%] font-display text-[10rem] font-bold leading-none text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)] [font-stretch:76%]">
          {pad2(index + 1)}
        </span>
        <Steps index={index} />
        <Motion style={rise(0.4)} className="relative mt-8">
          <Heading op={op} index={index} />
          <Description op={op} className="mt-4" />
          <div className="mt-6">
            <Flowline op={op} />
          </div>
        </Motion>
        <div className="mt-auto">
          <Processes op={op} />
          <div className="mt-6">
            <Specs op={op} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Columns({ op, index }: DeckProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 whitespace-nowrap font-display text-[17rem] font-bold uppercase leading-[0.8] text-transparent opacity-60 [-webkit-text-stroke:1.5px_var(--color-line-strong)] [font-stretch:76%] motion-safe:animate-[slide-word_16s_ease-in-out_infinite_alternate]"
      >
        {op.name}
      </span>
      <div className="relative grid min-h-0 flex-1 grid-cols-12 gap-10">
        <div className="col-span-4 flex min-h-0 flex-col">
          <Steps index={index} />
          <Motion style={rise(0.2)} className="mt-8">
            <Heading op={op} index={index} size="md" />
            <Description op={op} className="mt-4" />
            <div className="mt-6">
              <Flowline op={op} />
            </div>
          </Motion>
        </div>
        <Motion style={enter('reveal-up', 1.1, 0.1)} className="relative col-span-4 -mb-5 -mt-9">
          <Photo op={op} className="absolute inset-0" position="34% 50%" />
        </Motion>
        <Motion style={rise(0.55)} className="col-span-4 flex flex-col gap-8 pt-[4.5rem]">
          <Processes op={op} />
          <Specs op={op} columns={1} />
        </Motion>
      </div>
    </div>
  )
}

function FullbleedBackground({ op }: { op: Operation }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {op.photo.src ? (
        <Motion style={{ animation: 'zoom-settle 7s var(--ease-out-mech) both' }} className="absolute inset-0">
          <img src={op.photo.src} alt={op.photo.alt} decoding="async" className="size-full object-cover" style={{ objectPosition: '30% 40%' }} />
        </Motion>
      ) : (
        <Placeholder op={op} />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_left,rgb(8_10_12/0.94)_0%,rgb(8_10_12/0.82)_42%,rgb(8_10_12/0.15)_72%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgb(8_10_12/0.75),transparent)]" />
    </div>
  )
}

function Fullbleed({ op, index }: DeckProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-10">
      <Caption op={op} className="col-span-5 self-end" />
      <div className="col-span-6 col-start-7 flex min-h-0 flex-col">
        <Steps index={index} />
        <Motion style={rise(0.6)} className="mt-8">
          <Heading op={op} index={index} />
          <Description op={op} className="mt-4" />
          <div className="mt-6">
            <Flowline op={op} />
          </div>
        </Motion>
        <Motion style={rise(0.8)} className="mt-auto">
          <Processes op={op} />
          <div className="mt-6">
            <Specs op={op} />
          </div>
        </Motion>
      </div>
    </div>
  )
}

function Slant({ op, index }: DeckProps) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-12">
      <div className="relative col-span-7 -mb-5 -ml-24 -mt-9 [clip-path:polygon(0_0,100%_0,84%_100%,0_100%)]">
        <Motion style={enter('reveal-left', 1.2)} className="absolute inset-0">
          <Photo op={op} className="absolute inset-0" position="40% 50%" />
        </Motion>
      </div>
      <div className="col-span-5 flex min-h-0 flex-col">
        <Steps index={index} />
        <Motion style={rise(0.45)} className="mt-8">
          <Heading op={op} index={index} size="md" />
          <Description op={op} className="mt-4" />
          <div className="mt-6">
            <Flowline op={op} />
          </div>
        </Motion>
        <Motion style={rise(0.65)} className="mt-auto">
          <Processes op={op} />
          <div className="mt-6">
            <Specs op={op} />
          </div>
        </Motion>
      </div>
    </div>
  )
}

function Overlay({ op, index }: DeckProps) {
  return (
    <div className="relative min-h-0 flex-1">
      <div className="absolute -right-24 -top-9 h-[80%] w-[calc(64%+6rem)]">
        <Photo op={op} className="absolute inset-0" position="50% 28%" caption="right">
          <Motion style={{ animation: 'wipe-off 1.3s var(--ease-mech) 0.3s both' }} className="absolute inset-0 origin-right bg-blueprint motion-reduce:hidden" />
        </Photo>
      </div>
      <div className="absolute left-0 top-0 w-[32%]">
        <Steps index={index} />
      </div>
      <Motion style={rise(0.9)} className="absolute bottom-0 left-0 w-[46%] bg-paper pr-12 pt-10">
        <Heading op={op} index={index} />
        <Description op={op} className="mt-4" />
        <div className="mt-5">
          <Flowline op={op} />
        </div>
        <div className="mt-6">
          <Processes op={op} />
        </div>
      </Motion>
      <Motion style={rise(1.05)} className="absolute bottom-0 right-0 w-[40%]">
        <Specs op={op} />
      </Motion>
    </div>
  )
}

const DECK: Record<Layout, (props: DeckProps) => ReactNode> = {
  split: Split,
  band: Band,
  mirror: Mirror,
  columns: Columns,
  fullbleed: Fullbleed,
  slant: Slant,
  overlay: Overlay,
}

function FlowOperation({ op, index }: DeckProps) {
  return (
    <div>
      <Heading op={op} index={index} />
      <Description op={op} className="mt-4" />
      <Reveal className="relative -mx-5 mt-8 aspect-[4/3]">
        <Photo op={op} className="absolute inset-0" />
      </Reveal>
      <div className="mt-6">
        <Flowline op={op} />
      </div>
      <div className="mt-8">
        <Processes op={op} />
      </div>
      <div className="mt-8">
        <Specs op={op} columns={1} />
      </div>
    </div>
  )
}

export function OperationSection({ op }: { op: Operation }) {
  const deck = usePresentationMode() === 'deck'
  const index = operations.indexOf(op)
  const layout = LAYOUTS[op.id]
  const dark = DARK.includes(layout)
  const Deck = DECK[layout]
  return (
    <Screen
      id={op.id}
      theme={dark ? 'dark' : 'light'}
      tone={dark ? 'none' : index % 2 ? 'deep' : 'paper'}
      className={dark ? 'bg-night' : ''}
      background={deck && layout === 'fullbleed' ? <FullbleedBackground op={op} /> : undefined}
    >
      {deck ? <Deck op={op} index={index} /> : <FlowOperation op={op} index={index} />}
    </Screen>
  )
}
