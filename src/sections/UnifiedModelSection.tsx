import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { unified } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { SystemGraph } from '../components/technical/SystemGraph'
import { Headline } from '../components/ui/Headline'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/motion/Reveal'

export function UnifiedModelSection() {
  const mobileGraph = useRef<HTMLDivElement>(null)
  const converged = useInView(mobileGraph, { amount: 0.6, once: true })

  return (
    <Screen id="modelo" grid>
      <div className="grid flex-1 items-center lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow tone="accent" className="mb-6">
            Sem fragmentação
          </Eyebrow>
          <Headline id={titleId('modelo')} size="md" text={unified.headline} className="max-w-[18ch]" />
          <Reveal delay={0.2}>
            <p className="lede mt-6 max-w-[42ch]">{unified.subheadline}</p>
          </Reveal>

          <div ref={mobileGraph} className="mt-12 lg:hidden">
            <SystemGraph state={converged ? 'unified' : 'fragmented'} />
          </div>

          <ol className="mt-10 border-t border-line">
            {unified.pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.id} delay={0.1 * i} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line bg-paper/80 py-4 pr-4">
                <span className="font-mono text-sm text-accent-ink">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{pillar.title}</h3>
                  <p className="mt-1.5 max-w-[46ch] text-sm leading-relaxed text-muted">{pillar.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Screen>
  )
}
