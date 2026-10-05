import { unified } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { SystemGraph } from '../components/technical/SystemGraph'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/motion/Reveal'
import { StepReveal } from '../components/motion/StepReveal'
import { WordReveal } from '../components/motion/WordReveal'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { GRAPH_KEYFRAMES } from '../lib/systemGraph'

export function UnifiedModelSection() {
  const deck = usePresentationMode() === 'deck'
  const lines = unified.headline.split('. ').map((line, i, all) => (i < all.length - 1 ? `${line}.` : line))

  return (
    <Screen id="modelo" grid>
      <div className="flex flex-1 flex-col lg:w-[46%]">
        <Eyebrow tone="accent" className="mb-6">
          Sem fragmentação
        </Eyebrow>
        <h2 id={titleId('modelo')} className="display-lg lg:text-[3.4rem]">
          {lines.map((line, i) => (
            <span key={line} className={`block ${i === 0 ? 'text-fg' : i === 1 ? 'text-muted' : 'text-fg'}`}>
              <WordReveal text={line} delay={0.5 + i * 0.25} />
            </span>
          ))}
        </h2>
        <Reveal delay={1.1}>
          <p className="lede mt-6 max-w-[40ch]">{unified.subheadline}</p>
        </Reveal>

        {!deck && (
          <div className="mt-12">
            <SystemGraph scrollRange={[GRAPH_KEYFRAMES.desafio[1], 1]} />
          </div>
        )}

        <ol className="mt-10 grid gap-6 border-t border-line pt-6 sm:grid-cols-3 lg:mt-auto">
          {unified.pillars.map((pillar, i) => (
            <StepReveal as="li" at={1} key={pillar.id} className="flex flex-col">
              <span className="font-display text-5xl font-bold leading-none tracking-tight text-accent-ink [font-stretch:80%]">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight">{pillar.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{pillar.text}</p>
            </StepReveal>
          ))}
        </ol>
      </div>
    </Screen>
  )
}
