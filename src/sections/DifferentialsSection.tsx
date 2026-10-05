import { Check, Minus } from 'lucide-react'
import { differentials } from '../data/content'
import { comparisonRows } from '../data/differentials'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

export function DifferentialsSection() {
  const { fragmented, unified } = differentials.columns
  return (
    <Screen id="diferenciais">
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('diferenciais')} text={differentials.headline} className="max-w-[14ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{differentials.subheadline}</p>
        </Reveal>
      </div>

      <Reveal className="mt-12 hidden lg:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Comparação entre o modelo fragmentado e a Sorocaba Motores</caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className="label-mono w-[24%] py-4 font-normal text-faint">
                Critério
              </th>
              <th scope="col" className="label-mono w-[38%] py-4 pr-8 font-normal text-muted">
                {fragmented}
              </th>
              <th scope="col" className="label-mono w-[38%] border-l border-accent/40 bg-surface/50 px-6 py-4 font-normal text-fg">
                {unified}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.id} className="border-b border-line">
                <th scope="row" className="py-5 pr-6 align-top font-display text-xl font-semibold tracking-tight">
                  {row.criterion}
                </th>
                <td className="py-5 pr-8 align-top text-muted">
                  <span className="flex gap-3">
                    <Minus size={16} className="mt-1 shrink-0 text-alert" aria-hidden="true" />
                    {row.fragmented}
                  </span>
                </td>
                <td className="border-l border-accent/40 bg-surface/50 px-6 py-5 align-top text-fg">
                  <span className="flex gap-3">
                    <Check size={16} className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                    {row.unified}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <ul className="mt-10 flex flex-col gap-3 lg:hidden">
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
                <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="label-mono text-fg">{unified}</dt>
                  <dd className="mt-1 text-sm">{row.unified}</dd>
                </div>
              </div>
            </dl>
          </Reveal>
        ))}
      </ul>
    </Screen>
  )
}
