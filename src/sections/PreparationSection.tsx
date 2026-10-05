import { airport } from '../data/content'
import { preparationSteps } from '../data/airport'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

export function PreparationSection() {
  const deck = usePresentationMode() === 'deck'

  return (
    <Screen id="preparacao" tone="deep" grid>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('preparacao')} text={airport.preparationTitle} className="max-w-[18ch] lg:col-span-8 lg:text-[4.25rem]" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{airport.preparationLede}</p>
        </Reveal>
      </div>

      {deck ? (
        <ol className="relative mt-auto grid grid-cols-7 gap-4 pb-6">
          <span aria-hidden="true" className="absolute inset-x-0 top-[3.25rem] h-px bg-line-strong" />
          <span aria-hidden="true" className="absolute inset-x-0 top-[3.25rem] h-px origin-left bg-accent motion-safe:animate-[grow_2.4s_cubic-bezier(0.65,0,0.35,1)_0.4s_both]" />
          {preparationSteps.map((step, i) => (
            <Reveal as="li" key={step.id} delay={0.4 + i * 0.25} className="relative flex flex-col">
              <span className="font-display text-5xl font-bold leading-none tracking-tighter text-accent-ink [font-stretch:76%]">{String(i + 1).padStart(2, '0')}</span>
              <span aria-hidden="true" className="relative z-10 mt-3 size-3 border-2 border-paper-2 bg-accent outline outline-1 outline-accent" />
              <span className="mt-6 font-display text-xl font-bold leading-tight tracking-tight">{step.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-muted">{step.text}</span>
            </Reveal>
          ))}
        </ol>
      ) : (
        <ol className="mt-10 border-l border-line-strong pl-6">
          {preparationSteps.map((step, i) => (
            <Reveal as="li" key={step.id} className="relative pb-7 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 size-3 bg-accent" />
              <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-display text-xl font-bold tracking-tight">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      )}
    </Screen>
  )
}
