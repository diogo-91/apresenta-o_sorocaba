import { useRef } from 'react'
import { m, useScroll } from 'framer-motion'
import { method } from '../data/content'
import { methodSteps } from '../data/method'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

export function MethodSection() {
  const track = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 75%', 'end 60%'] })

  return (
    <Screen id="metodo" tone="deep">
      <div className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Headline id={titleId('metodo')} text={method.headline} className="max-w-[12ch]" />
            <Reveal delay={0.15}>
              <p className="lede mt-6 max-w-[34ch]">{method.subheadline}</p>
            </Reveal>
          </div>
        </div>

        <ol ref={track} className="relative lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-line-strong" />
          <m.span aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute bottom-3 left-[0.6875rem] top-3 w-px origin-top bg-accent" />
          {methodSteps.map((step, i) => (
            <Reveal as="li" key={step.id} className="relative grid grid-cols-[1.5rem_1fr] gap-5 pb-10 last:pb-0 sm:gap-8">
              <span aria-hidden="true" className="relative z-10 mt-1 flex size-6 items-center justify-center border border-fg/60 bg-ink-2">
                <span className="size-1.5 bg-fg" />
              </span>
              <div className="border-b border-line pb-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">{step.title}</h3>
                </div>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted lg:text-base">{step.text}</p>
                <p className="label-mono mt-4 inline-flex items-center gap-2 border border-line px-2 py-1 text-fg/80">
                  <span className="text-faint">Saída</span> {step.output}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Screen>
  )
}
