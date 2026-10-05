import { Check, Minus } from 'lucide-react'
import { differentials } from '../data/content'
import { comparisonRows } from '../data/differentials'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

const DRIFT = [-14, 8, -5, 16, -10, 5, -7]

export function DifferentialsSection() {
  const deck = usePresentationMode() === 'deck'
  const { fragmented, unified } = differentials.columns

  return (
    <Screen id="diferenciais">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('diferenciais')} text={differentials.headline} className="max-w-[16ch] lg:col-span-8 lg:text-[4rem]" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{differentials.subheadline}</p>
        </Reveal>
      </div>

      {deck ? (
        <div className="mt-8 flex-1" role="table" aria-label="Comparação entre o modelo fragmentado e a Sorocaba Motores">
          <div role="row" className="grid grid-cols-12 gap-6 border-b border-line-strong pb-2">
            <span role="columnheader" className="label-mono col-span-3 text-faint">
              Critério
            </span>
            <span role="columnheader" className="label-mono col-span-4 text-alert">
              {fragmented}
            </span>
            <span role="columnheader" className="label-mono col-span-5 pl-6 text-accent-ink">
              {unified}
            </span>
          </div>
          <div className="relative">
            <span aria-hidden="true" className="absolute bottom-0 top-0 w-[3px] bg-accent" style={{ left: 'calc((100% + 1.5rem) * 7 / 12)' }} />
            {comparisonRows.map((row, i) => (
              <div role="row" key={row.id} className="grid grid-cols-12 items-center gap-6 border-b border-line py-4">
                <span role="rowheader" className="col-span-3 font-display text-xl font-semibold leading-tight tracking-tight">
                  {row.criterion}
                </span>
                <Reveal delay={0.2 + i * 0.07} y={0} className="col-span-4">
                  <span role="cell" className="flex items-start gap-2.5 border border-dashed border-alert/40 px-3 py-2.5 text-[0.9375rem] text-muted" style={{ transform: `translateX(${DRIFT[i % DRIFT.length]}px) rotate(${DRIFT[i % DRIFT.length] / 20}deg)` }}>
                    <Minus size={14} className="mt-0.5 shrink-0 text-alert" aria-hidden="true" />
                    {row.fragmented}
                  </span>
                </Reveal>
                <Reveal delay={0.5 + i * 0.07} className="col-span-5">
                  <span role="cell" className="flex items-start gap-2.5 bg-surface/70 py-2.5 pl-6 pr-3 text-[0.9375rem] text-fg">
                    <Check size={14} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                    {row.unified}
                  </span>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className="mt-10 flex flex-col gap-3">
          {comparisonRows.map((row, i) => (
            <Reveal as="li" key={row.id} delay={0.03 * i} className="border border-line">
              <h3 className="flex items-baseline gap-3 border-b border-line px-4 py-3 font-display text-lg font-semibold tracking-tight">
                <span className="label-mono text-faint">{String(i + 1).padStart(2, '0')}</span>
                {row.criterion}
              </h3>
              <dl>
                <div className="flex gap-3 px-4 py-3">
                  <Minus size={16} className="mt-0.5 shrink-0 text-alert" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-faint">{fragmented}</dt>
                    <dd className="mt-1 text-sm text-muted">{row.fragmented}</dd>
                  </div>
                </div>
                <div className="flex gap-3 border-t border-accent/30 bg-surface/60 px-4 py-3">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent-ink" aria-hidden="true" />
                  <div>
                    <dt className="label-mono text-fg">{unified}</dt>
                    <dd className="mt-1 text-sm">{row.unified}</dd>
                  </div>
                </div>
              </dl>
            </Reveal>
          ))}
        </ul>
      )}
    </Screen>
  )
}
