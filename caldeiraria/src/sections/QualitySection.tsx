import { Check } from 'lucide-react'
import { quality } from '../data/content'
import { operations } from '../data/operations'
import { pad2 } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'

function Checkpoints() {
  return (
    <ol className="relative grid gap-4 lg:grid-cols-7 lg:gap-3" aria-label="Pontos de conferência por operação">
      <span aria-hidden="true" className="absolute inset-x-0 top-[7px] hidden h-px bg-line-strong lg:block" />
      {operations.map((op, i) => (
        <Reveal as="li" key={op.id} delay={0.15 + i * 0.06} className="relative flex gap-4 lg:flex-col lg:gap-0">
          <span aria-hidden="true" className="relative z-10 mt-0.5 size-3.5 shrink-0 rounded-full border-2 border-accent bg-paper lg:mt-0" />
          <div className="lg:mt-5">
            <p className="label-mono text-xs text-faint">
              {pad2(i + 1)} · {op.name}
            </p>
            <p className="mt-2 flex items-start gap-2 font-display text-xl font-bold leading-tight tracking-tight [font-stretch:85%] lg:text-[1.375rem]">
              <Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-accent-ink" />
              {op.checkpoint}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  )
}

export function QualitySection() {
  return (
    <Screen id="qualidade" grid>
      <div className="flex min-h-0 flex-1 flex-col">
        <Eyebrow tone="accent" className="mb-5">
          {quality.eyebrow}
        </Eyebrow>
        <h2 id={titleId('qualidade')} className="max-w-[20ch] font-display text-[clamp(2.5rem,11vw,3.5rem)] font-bold leading-[0.95] tracking-[-0.03em] [font-stretch:80%] lg:text-[4.5rem]">
          {quality.headline}
        </h2>
        <p className="lede mt-5 max-w-[48ch] lg:text-[1.3rem]">{quality.subheadline}</p>
        <p className="label-mono mt-4 text-xs">
          <Pending value={`[${quality.planNote.toUpperCase()}]`} />
        </p>

        <div className="mt-12 lg:mt-auto">
          <Checkpoints />
        </div>

        <div className="mt-12 grid gap-8 border-t border-line pt-6 lg:mt-14 lg:grid-cols-[2fr_1fr]">
          <dl className="grid gap-4 sm:grid-cols-3">
            {quality.records.map((r) => (
              <div key={r.label}>
                <dt className="label-mono text-xs text-muted">{r.label}</dt>
                <dd className="mt-2 text-sm">
                  <Pending value={r.value} />
                </dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="label-mono text-xs text-muted">Referências normativas</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {quality.norms.map((n) => (
                <li key={n.code} className="border border-line-strong px-2.5 py-1 font-mono text-sm" title="Referência a validar. Não representa certificação.">
                  {n.code}
                  {!n.validated && <span className="text-faint">*</span>}
                </li>
              ))}
            </ul>
            <p className="label-mono mt-3 text-[0.625rem] text-faint">{quality.normsNote}</p>
          </div>
        </div>
      </div>
    </Screen>
  )
}
