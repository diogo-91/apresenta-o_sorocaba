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

  return (
    <article aria-labelledby={`${study.id}-title`} className="grid flex-1 gap-8 lg:grid-cols-12 lg:gap-12">
      <div data-cursor="explore" className="lg:col-span-6 lg:-mb-5 lg:-ml-24">
        <BeforeAfter before={study.before} after={study.after} code={study.label.replace(/[[\]\s]/g, '')} className="aspect-[4/3] lg:aspect-auto lg:h-full" />
      </div>

      <div className="flex flex-col lg:col-span-6">
        <h3 id={`${study.id}-title`} className="font-display text-3xl font-bold leading-tight tracking-tight">
          <Pending value={study.title} />
        </h3>
        <p className="label-mono mt-2 text-sm text-muted">
          Segmento · <Pending value={study.segment} />
        </p>

        <ol className="mt-6 flex flex-col border-t border-line" aria-label="Narrativa do case">
          {beats.map((beat, i) => {
            const state = i < current ? 'past' : i === current ? 'now' : 'next'
            return (
              <li
                key={beat.label}
                aria-current={state === 'now' ? 'step' : undefined}
                className={`grid grid-cols-[2.75rem_1fr] gap-3 border-b border-line py-3.5 transition-opacity duration-500 ${state === 'next' ? 'opacity-30' : 'opacity-100'}`}
              >
                <span className={`pt-1 font-mono text-base ${state === 'now' ? 'text-accent-ink' : 'text-faint'}`}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className={`font-display text-2xl font-bold tracking-tight ${state === 'now' ? 'text-fg' : 'text-muted'}`}>{beat.label}</p>
                  {(!deck || state === 'now') && (
                    <p className="mt-2 text-lg leading-relaxed text-fg/90 motion-safe:animate-[fadein_0.5s_ease-out_both]">
                      <Pending value={beat.value} />
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </article>
  )
}
