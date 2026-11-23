import { processCopy } from '../data/content'
import { operations, OPERATION_COUNT, PROCESS_FINAL } from '../data/operations'
import { pad2 } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { Eyebrow } from '../components/ui/Eyebrow'
import { PartState, StationPictogram } from '../components/technical/Pictograms'
import { Reveal } from '../components/motion/Reveal'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { processProgress, stationState, type StationState } from '../lib/process'

const ease = 'duration-700 ease-mech motion-reduce:transition-none'

const tone: Record<StationState, string> = {
  done: 'text-blueprint',
  active: 'text-fg',
  next: 'text-fg opacity-30',
}

function Title() {
  return (
    <div>
      <Eyebrow tone="accent" className="mb-5">
        {processCopy.eyebrow}
      </Eyebrow>
      <h2 id={titleId('processo')} aria-label={processCopy.headline.join(' ')} className="font-display font-bold leading-[0.9] tracking-[-0.03em] [font-stretch:80%] text-[clamp(2.75rem,12vw,4rem)] lg:text-[5rem]">
        {processCopy.headline.map((line, i) => (
          <span key={line} aria-hidden="true" className={`block ${i === 1 ? 'text-muted' : ''}`}>
            {line}
          </span>
        ))}
      </h2>
    </div>
  )
}

function CurrentCard({ stage }: { stage: number }) {
  const op = stage >= 1 && stage <= OPERATION_COUNT ? operations[stage - 1] : null
  const done = Math.min(stage, OPERATION_COUNT)
  const edge = stage === 0 ? processCopy.entry : processCopy.exit
  return (
    <div aria-live="polite" className="grid grid-cols-[220px_1fr] items-center gap-8 border-l-2 border-accent pl-8">
      <PartState done={done} className={`h-[132px] w-[220px] transition-colors ${ease} ${done === OPERATION_COUNT ? '' : 'text-fg'}`} />
      <div key={stage} className="motion-safe:animate-[fadein_0.5s_ease-out_both]">
        <p className="label-mono text-sm text-accent-ink">{op ? `Operação ${pad2(stage)} / ${pad2(OPERATION_COUNT)}` : edge.label}</p>
        {op ? (
          <>
            <p className="mt-2 font-display text-[2.75rem] font-bold uppercase leading-none tracking-tight [font-stretch:82%]">{op.name}</p>
            <p className="mt-2 text-lg leading-snug text-muted">{op.line}</p>
            <p className="label-mono mt-3 text-xs text-faint">
              {op.input} <span className="text-accent-ink">→</span> {op.output}
            </p>
          </>
        ) : (
          <p className="mt-2 max-w-[30ch] text-xl leading-snug text-fg">{edge.text}</p>
        )}
      </div>
    </div>
  )
}

function Line({ stage }: { stage: number }) {
  const progress = processProgress(stage, OPERATION_COUNT)
  return (
    <ol className="relative grid grid-cols-7" aria-label="Operações do processo">
      <span aria-hidden="true" className="absolute inset-x-[calc(100%/14)] top-[162px] h-px bg-line-strong" />
      <span
        aria-hidden="true"
        className={`absolute inset-x-[calc(100%/14)] top-[161px] h-[3px] origin-left bg-accent transition-transform ${ease}`}
        style={{ transform: `scaleX(${stage >= 1 ? progress : 0})` }}
      />
      {operations.map((op, i) => {
        const state = stationState(stage, i, OPERATION_COUNT)
        return (
          <li key={op.id} aria-current={state === 'active' ? 'step' : undefined} className="relative flex flex-col items-center text-center">
            <StationPictogram id={op.id} className={`h-[135px] w-[180px] transition-[color,opacity,transform] ${ease} ${tone[state]} ${state === 'active' ? '-translate-y-1' : ''}`} />
            <span
              aria-hidden="true"
              className={`relative z-10 mt-5 size-3.5 rounded-full border-2 transition-colors ${ease} ${state === 'next' ? 'border-line-strong bg-paper' : 'border-accent bg-accent'} ${state === 'active' ? 'ring-[6px] ring-accent/20' : ''}`}
            />
            <PartState done={i + 1} className={`mt-5 h-[78px] w-[130px] transition-opacity ${ease} ${state === 'next' ? 'opacity-25' : 'opacity-100'}`} />
            <p className={`label-mono mt-3 transition-colors ${ease} ${state === 'active' ? 'text-accent-ink' : 'text-faint'}`}>{pad2(i + 1)}</p>
            <p className={`mt-1 font-display text-2xl font-bold uppercase tracking-tight transition-colors [font-stretch:85%] ${ease} ${state === 'next' ? 'text-fg/35' : 'text-fg'}`}>{op.name}</p>
          </li>
        )
      })}
    </ol>
  )
}

function DeckProcess() {
  const stage = Math.min(useSlideStep(), PROCESS_FINAL)
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="grid grid-cols-12 items-end gap-10">
        <div className="col-span-6">
          <Title />
        </div>
        <div className="col-span-6">
          <CurrentCard stage={stage} />
        </div>
      </div>
      <div className="my-auto pt-10">
        <Line stage={stage} />
        <p className="label-mono mt-5 text-faint">{processCopy.partNote}</p>
      </div>
    </div>
  )
}

function FlowProcess() {
  return (
    <div>
      <Title />
      <ol className="mt-10 border-t border-line" aria-label="Operações do processo">
        {operations.map((op, i) => (
          <Reveal as="li" key={op.id} className="grid grid-cols-[88px_1fr] items-center gap-5 border-b border-line py-5">
            <StationPictogram id={op.id} className="h-auto w-[88px] text-fg" />
            <div>
              <p className="label-mono text-accent-ink">{pad2(i + 1)}</p>
              <p className="font-display text-2xl font-bold uppercase tracking-tight [font-stretch:85%]">{op.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{op.line}</p>
            </div>
          </Reveal>
        ))}
      </ol>
      <div className="mt-8 flex items-center gap-5">
        <PartState done={OPERATION_COUNT} className="h-[60px] w-[100px]" />
        <p className="text-base leading-snug text-fg">{processCopy.exit.text}</p>
      </div>
    </div>
  )
}

export function ProcessSection() {
  const deck = usePresentationMode() === 'deck'
  return (
    <Screen id="processo" grid>
      {deck ? <DeckProcess /> : <FlowProcess />}
    </Screen>
  )
}
