import { airport } from '../data/content'
import { preparationSteps } from '../data/airport'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

export function PreparationSection() {
  return (
    <Screen id="preparacao" tone="deep">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('preparacao')} text={airport.preparationTitle} className="max-w-[18ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{airport.preparationLede}</p>
        </Reveal>
      </div>
      <ol className="mt-10 grid flex-1 border-l border-t border-line sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {preparationSteps.map((step, i) => (
          <Reveal as="li" key={step.id} delay={0.05 * i} className="flex flex-col border-b border-r border-line bg-paper p-5 lg:p-7">
            <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-auto pt-8 font-display text-2xl font-bold leading-tight tracking-tight">{step.title}</span>
            <span className="mt-2 text-sm leading-relaxed text-muted">{step.text}</span>
          </Reveal>
        ))}
        <li className="hidden flex-col justify-end border-b border-r border-line bg-paper-2 p-7 lg:flex" aria-hidden="true">
          <span className="label-mono text-faint">Escopo validado em campo</span>
        </li>
      </ol>
    </Screen>
  )
}
