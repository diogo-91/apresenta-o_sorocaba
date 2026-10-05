import type { CaseStudy } from '../../data/cases'
import { Pending } from '../ui/Pending'
import { BeforeAfter } from './BeforeAfter'

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const flow = [
    { label: 'Contexto', value: study.context },
    { label: 'Restrição', value: study.constraint },
    { label: 'Solução', value: study.solution },
    { label: 'Resultado', value: study.result },
  ]

  return (
    <article aria-labelledby={`${study.id}-title`} className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <BeforeAfter before={study.before} after={study.after} code={study.label.replace(/[[\]\s]/g, '')} />
      </div>

      <div className="flex flex-col lg:col-span-5">
        <p className="label-mono text-blueprint">
          {study.label} <span className="text-faint">/</span> <Pending value={study.segment} />
        </p>
        <h3 id={`${study.id}-title`} className="mt-3 font-display text-2xl font-bold tracking-tight">
          <Pending value={study.title} />
        </h3>

        <ol className="mt-6 flex flex-col">
          {flow.map((step, i) => (
            <li key={step.label} className="relative grid grid-cols-[1.5rem_1fr] gap-4 pb-3 last:pb-0">
              {i < flow.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[0.6875rem] top-6 w-px bg-line-strong" />}
              <span aria-hidden="true" className={`mt-1 flex size-6 items-center justify-center border font-mono text-[0.625rem] ${i === flow.length - 1 ? 'border-accent text-accent-ink' : 'border-fg/50 text-muted'}`}>
                {i + 1}
              </span>
              <div>
                <p className="label-mono text-muted">{step.label}</p>
                <p className="mt-1 text-sm">
                  <Pending value={step.value} />
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6 border border-line">
          <p className="label-mono border-b border-line bg-surface/40 px-4 py-2 text-muted">Ficha técnica</p>
          <dl>
            {study.sheet.map((row) => (
              <div key={row.label} className="grid grid-cols-[8.5rem_1fr] gap-3 border-b border-line px-4 py-2 last:border-b-0">
                <dt className="label-mono text-faint">{row.label}</dt>
                <dd className="text-sm">
                  <Pending value={row.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  )
}
