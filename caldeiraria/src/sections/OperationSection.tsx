import { operations, OPERATION_COUNT, type Operation } from '../data/operations'
import { pad2 } from '../data/screens'
import { TBC } from '../lib/placeholder'
import { Screen, titleId } from '../components/layout/Screen'
import { Pending } from '../components/ui/Pending'
import { StationPictogram } from '../components/technical/Pictograms'
import { Reveal } from '../components/motion/Reveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

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

function Field({ op, className = '' }: { op: Operation; className?: string }) {
  return (
    <figure className={`relative overflow-hidden bg-night text-night-fg ${className}`}>
      {op.photo.src ? (
        <img src={op.photo.src} alt={op.photo.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      ) : (
        <div role="img" aria-label={`${op.photo.alt} (foto a inserir)`} className="absolute inset-0">
          <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-70" />
          <StationPictogram id={op.id} className="absolute left-1/2 top-1/2 w-[62%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 text-[#5fb0e6]" />
        </div>
      )}
      <figcaption className="label-mono absolute bottom-5 left-6 flex items-center gap-2 text-night-fg/75">
        {!op.photo.src && <span aria-hidden="true" className="size-1.5 bg-accent" />}
        {!op.photo.src && <span className="text-accent-ink">Foto a inserir ·</span>}
        Registro de campo · {op.name}
      </figcaption>
    </figure>
  )
}

function Specs({ op }: { op: Operation }) {
  return (
    <dl className="grid grid-cols-3 gap-6">
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

function Heading({ op, index }: { op: Operation; index: number }) {
  return (
    <>
      <p className="label-mono text-sm text-accent-ink">
        Operação {pad2(index + 1)} / {pad2(OPERATION_COUNT)}
      </p>
      <h2 id={titleId(op.id)} className="mt-3 font-display text-[clamp(3.5rem,18vw,5rem)] font-bold uppercase leading-[0.82] tracking-[-0.03em] [font-stretch:76%] lg:text-[8.5rem]">
        {op.name}
      </h2>
      <p className="mt-6 font-display text-[1.75rem] font-bold leading-tight tracking-tight [font-stretch:85%] lg:text-[2.25rem]">{op.headline}</p>
    </>
  )
}

function DeckOperation({ op, index }: { op: Operation; index: number }) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-14">
      <div className="col-span-7 flex min-h-0 flex-col">
        <Steps index={index} />
        <div className="mt-8">
          <Heading op={op} index={index} />
        </div>
        <Reveal delay={0.2}>
          <p className="lede mt-4 max-w-[44ch] lg:text-[1.3rem] lg:leading-relaxed">{op.description}</p>
        </Reveal>
        <div className="mt-6">
          <Flowline op={op} />
        </div>
        <div className="mt-auto">
          <Processes op={op} />
        </div>
      </div>
      <div className="col-span-5 -mb-5 -mr-24 -mt-9 flex min-h-0 flex-col">
        <Field op={op} className="min-h-0 flex-1" />
        <div className="py-6 pr-24">
          <Specs op={op} />
        </div>
      </div>
    </div>
  )
}

function FlowOperation({ op, index }: { op: Operation; index: number }) {
  return (
    <div>
      <Heading op={op} index={index} />
      <p className="lede mt-4">{op.description}</p>
      <Field op={op} className="-mx-5 mt-8 aspect-[4/3]" />
      <div className="mt-6">
        <Flowline op={op} />
      </div>
      <div className="mt-8">
        <Processes op={op} />
      </div>
      <div className="mt-8 [&_dl]:grid-cols-1 [&_dl]:gap-3">
        <Specs op={op} />
      </div>
    </div>
  )
}

export function OperationSection({ op }: { op: Operation }) {
  const deck = usePresentationMode() === 'deck'
  const index = operations.indexOf(op)
  return (
    <Screen id={op.id} tone={index % 2 ? 'deep' : 'paper'}>
      {deck ? <DeckOperation op={op} index={index} /> : <FlowOperation op={op} index={index} />}
    </Screen>
  )
}
