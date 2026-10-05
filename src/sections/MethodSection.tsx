import { m } from 'framer-motion'
import { method } from '../data/content'
import { methodSteps } from '../data/method'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { VIEWPORT_ONCE } from '../lib/motion'

const STEP_DELAY = 0.35

export function MethodSection() {
  return (
    <Screen id="metodo" tone="deep">
      <div className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div>
            <Headline id={titleId('metodo')} text={method.headline} className="max-w-[12ch]" />
            <Reveal delay={0.15}>
              <p className="lede mt-6 max-w-[34ch]">{method.subheadline}</p>
            </Reveal>
          </div>
        </div>

        <ol className="relative self-start lg:col-span-7">
          <span aria-hidden="true" className="absolute bottom-3 left-[0.6875rem] top-3 w-px bg-line-strong" />
          <m.span
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={VIEWPORT_ONCE}
            transition={{ duration: STEP_DELAY * methodSteps.length, ease: 'linear', delay: 0.3 }}
            className="absolute bottom-3 left-[0.6875rem] top-3 w-px origin-top bg-accent"
          />
          {methodSteps.map((step, i) => (
            <Reveal as="li" key={step.id} delay={0.3 + STEP_DELAY * i} className="relative grid grid-cols-[1.5rem_1fr] gap-5 pb-3 last:pb-0 sm:gap-8">
              <span aria-hidden="true" className="relative z-10 mt-1 flex size-6 items-center justify-center border border-fg/60 bg-paper-2">
                <span className="size-1.5 bg-fg" />
              </span>
              <div className="border-b border-line pb-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight">{step.title}</h3>
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <p className="max-w-[46ch] text-sm leading-relaxed text-muted">{step.text}</p>
                <p className="label-mono inline-flex items-center gap-2 border border-line px-2 py-1 text-fg/80">
                  <span className="text-faint">Saída</span> {step.output}
                </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Screen>
  )
}
