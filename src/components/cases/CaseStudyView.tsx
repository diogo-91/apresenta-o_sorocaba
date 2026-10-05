import type { CaseStudy } from '../../data/cases'
import { usePresentationMode } from '../../hooks/usePresentationMode'
import { useSlideStep } from '../../hooks/useDeckPosition'
import { Pending } from '../ui/Pending'
import { BeforeAfter } from './BeforeAfter'

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const deck = usePresentationMode() === 'deck'
  const step = useSlideStep()
  const current = deck ? step : 3
  const beats = [
    { label: 'Contexto', value: study.context },
    { label: 'Restrição', value: study.constraint },
    { label: 'Solução', value: study.solution },
    { label: 'Resultado', value: study.result },
  ]
  const art = study.sheet.find((row) => row.label === 'ART relacionada')
  const sheet = study.sheet.filter((row) => row !== art)

  return (
    <article aria-labelledby={`${study.id}-title`} className="grid flex-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-cursor="explore" className="lg:col-span-7 lg:-mb-5 lg:-ml-24">
        <BeforeAfter before={study.before} after={study.after} code={study.label.replace(/[[\]\s]/g, '')} className="aspect-[4/3] lg:aspect-auto lg:h-full" />
      </div>

      <div className="flex flex-col lg:col-span-5">
        <h3 id={`${study.id}-title`} className="font-display text-2xl font-bold tracking-tight">
          <Pending value={study.title} />
        </h3>
        <p className="label-mono mt-2 text-faint">
          Segmento · <Pending value={study.segment} />
        </p>

        <ol className="mt-6 flex flex-col border-t border-line" aria-label="Narrativa do case">
          {beats.map((beat, i) => {
            const state = i < current ? 'past' : i === current ? 'now' : 'next'
            return (
              <li
                key={beat.label}
                aria-current={state === 'now' ? 'step' : undefined}
                className={`grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-3 transition-opacity duration-500 ${state === 'next' ? 'opacity-30' : 'opacity-100'}`}
              >
                <span className={`font-mono text-sm ${state === 'now' ? 'text-accent-ink' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className={`font-display text-xl font-bold tracking-tight ${state === 'now' ? 'text-fg' : 'text-muted'}`}>{beat.label}</p>
                  <p className="mt-1 text-sm">
                    <Pending value={beat.value} />
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className={`mt-auto pt-5 transition-opacity duration-500 ${current >= 3 ? 'opacity-100' : 'opacity-30'}`}>
          <p className="label-mono text-muted">Ficha técnica</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
            {sheet.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-3 border-b border-line pb-1.5">
                <dt className="label-mono text-faint">{row.label}</dt>
                <dd className="text-xs">
                  <Pending value={row.value} />
                </dd>
              </div>
            ))}
          </dl>
          {art && (
            <p className="mt-3 flex items-center gap-3 border border-line-strong px-3 py-2">
              <span className="label-mono text-accent-ink">ART associada</span>
              <Pending value={art.value} className="text-xs" />
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
