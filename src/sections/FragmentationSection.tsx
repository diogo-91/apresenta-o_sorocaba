import { fragmentation } from '../data/content'
import { graphNodes, interfaceCount } from '../data/graph'
import { Screen, titleId } from '../components/layout/Screen'
import { SystemGraph } from '../components/technical/SystemGraph'
import { Headline } from '../components/ui/Headline'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/motion/Reveal'
import { StepReveal } from '../components/motion/StepReveal'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { GRAPH_KEYFRAMES } from '../lib/systemGraph'

export function FragmentationSection() {
  const deck = usePresentationMode() === 'deck'
  const n = graphNodes.length

  return (
    <Screen id="desafio" grid>
      <div className="flex flex-1 flex-col lg:w-[44%]">
        <Eyebrow tone="accent" className="mb-6">
          O problema
        </Eyebrow>
        <Headline id={titleId('desafio')} text={fragmentation.headline} className="max-w-[14ch]" />
        <Reveal delay={0.3}>
          <p className="lede mt-7 max-w-[40ch]">{fragmentation.subheadline}</p>
        </Reveal>

        {!deck && (
          <div className="mt-12">
            <SystemGraph scrollRange={[0, GRAPH_KEYFRAMES.desafio[1]]} />
          </div>
        )}

        <StepReveal at={1} className="mt-10 flex items-end gap-6 border-t border-line pt-6 lg:mt-auto">
          <span className="font-display text-[6rem] font-bold leading-[0.8] tracking-tighter text-alert [font-stretch:78%] lg:text-[9rem]">
            {interfaceCount(n)}
          </span>
          <span className="label-mono max-w-[22ch] pb-2 text-muted">
            Interfaces potenciais em um cenário com {n} fornecedores
          </span>
        </StepReveal>
      </div>
    </Screen>
  )
}
