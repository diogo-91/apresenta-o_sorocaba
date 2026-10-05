import { useCallback, useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { method } from '../data/content'
import { methodSteps } from '../data/method'
import { Screen, titleId } from '../components/layout/Screen'
import { PlantCropScene } from '../components/technical/Scenes'
import { Headline } from '../components/ui/Headline'
import { MediaFrame } from '../components/ui/MediaFrame'
import { Reveal } from '../components/motion/Reveal'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { useScrollProgress } from '../hooks/useScene'
import { DURATION, EASE_OUT } from '../lib/motion'

const pad2 = (v: number) => String(v).padStart(2, '0')

function Rail({ active }: { active: number }) {
  const progress = methodSteps.length > 1 ? active / (methodSteps.length - 1) : 1
  return (
    <ol className="relative flex h-full flex-col justify-between py-2" aria-label="Etapas">
      <span aria-hidden="true" className="absolute bottom-2 left-1/2 top-2 w-px -translate-x-1/2 bg-line-strong" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 w-px origin-top -translate-x-1/2 bg-accent transition-[height] duration-[1200ms] ease-mech"
        style={{ height: `calc((100% - 1rem) * ${progress})` }}
      />
      {methodSteps.map((step, i) => (
        <li key={step.id} className="relative flex justify-center">
          <span
            className={`flex size-7 items-center justify-center border font-mono text-[0.625rem] transition-colors duration-500 ${
              i < active ? 'border-accent bg-accent text-fg' : i === active ? 'border-accent bg-paper text-accent-ink' : 'border-line-strong bg-paper text-faint'
            }`}
            aria-current={i === active ? 'step' : undefined}
          >
            {pad2(i + 1)}
          </span>
        </li>
      ))}
    </ol>
  )
}

function DeckMethod() {
  const active = useSlideStep()
  const step = methodSteps[active]

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-8">
      <div className="col-span-5 flex flex-col">
        <Headline id={titleId('metodo')} size="md" text={method.headline} className="max-w-[16ch]" />
        <p className="lede mt-3">{method.subheadline}</p>
        <div className="mt-auto" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.div key={step.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: DURATION.base, ease: EASE_OUT }}>
              <span className="block font-display text-[11rem] font-bold leading-[0.78] tracking-tighter text-accent [font-stretch:75%]">{pad2(active + 1)}</span>
              <h3 className="mt-4 font-display text-[2.75rem] font-bold leading-[0.95] tracking-tight [font-stretch:82%]">{step.title}</h3>
              <p className="mt-3 max-w-[40ch] text-lg leading-snug text-muted">{step.text}</p>
              <p className="label-mono mt-5 inline-flex items-center gap-2 border border-line-strong px-2.5 py-1.5 text-fg">
                <span className="text-faint">Saída</span> {step.output}
              </p>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="col-span-1">
        <Rail active={active} />
      </div>
      <MediaFrame
        src={method.photo.src}
        alt={method.photo.alt}
        caption={method.photo.caption}
        scene={<PlantCropScene step={active} steps={methodSteps.length} />}
        className="col-span-6 -mb-5 -mr-24 -mt-9"
      />
    </div>
  )
}

function FlowMethod() {
  const track = useRef<HTMLOListElement>(null)
  const line = useRef<HTMLSpanElement>(null)
  const render = useCallback((p: number) => {
    if (line.current) line.current.style.transform = `scaleY(${p})`
  }, [])
  useScrollProgress(track, render, true)

  return (
    <>
      <Headline id={titleId('metodo')} text={method.headline} className="max-w-[12ch]" />
      <p className="lede mt-5">{method.subheadline}</p>
      <MediaFrame
        src={method.photo.src}
        alt={method.photo.alt}
        caption={method.photo.caption}
        scene={<PlantCropScene step={0} steps={methodSteps.length} />}
        className="-mx-5 mt-8 aspect-[16/9] md:mx-0"
      />
      <ol ref={track} className="relative mt-10">
        <span aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-line-strong" />
        <span ref={line} aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px origin-top scale-y-0 bg-accent" />
        {methodSteps.map((step, i) => (
          <Reveal as="li" key={step.id} className="relative grid grid-cols-[1.5rem_1fr] gap-5 pb-8 last:pb-0">
            <span aria-hidden="true" className="relative z-10 mt-1 flex size-6 items-center justify-center border border-fg/60 bg-paper-2">
              <span className="size-1.5 bg-fg" />
            </span>
            <div>
              <span className="font-display text-5xl font-bold leading-none text-accent-ink [font-stretch:78%]">{pad2(i + 1)}</span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.text}</p>
              <p className="label-mono mt-3 inline-flex gap-2 border border-line px-2 py-1">
                <span className="text-faint">Saída</span> {step.output}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </>
  )
}

export function MethodSection() {
  const deck = usePresentationMode() === 'deck'
  return (
    <Screen id="metodo" tone="deep">
      {deck ? <DeckMethod /> : <FlowMethod />}
    </Screen>
  )
}
