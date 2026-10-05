import { safety } from '../data/content'
import { safetyDomains, type NormReference } from '../data/safety'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

function NormBadge({ norm }: { norm: NormReference | null }) {
  if (!norm) return <span className="label-mono text-faint">Procedimento interno · a documentar</span>
  if (norm.validated) return <span className="label-mono border border-line-strong px-2 py-1 text-fg">{norm.code}</span>
  return (
    <span className="label-mono inline-flex items-center gap-2 border border-dashed border-line-strong px-2 py-1 text-muted" title="Referência temática. Não representa certificação.">
      {norm.code}
      <span className="text-faint">· referência a validar</span>
    </span>
  )
}

export function SafetySection() {
  return (
    <Screen id="seguranca" grid>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('seguranca')} text={safety.headline} className="max-w-[18ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{safety.subheadline}</p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-10 lg:mt-12">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2" aria-label="Sequência de controle">
          {safety.sequence.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className={`label-mono ${i === safety.sequence.length - 1 ? 'text-accent' : 'text-fg'}`}>
                {String(i + 1).padStart(2, '0')} {step}
              </span>
              {i < safety.sequence.length - 1 && <span aria-hidden="true" className="h-px w-8 bg-line-strong sm:w-14" />}
            </li>
          ))}
        </ol>
      </Reveal>

      <ul className="mt-10 grid flex-1 border-l border-t border-line sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
        {safetyDomains.map((domain, i) => (
          <Reveal as="li" key={domain.id} delay={0.05 * i} className="flex flex-col border-b border-r border-line bg-ink p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <span className="label-mono text-faint">{domain.code}</span>
              <span aria-hidden="true" className="h-px w-10 translate-y-2 bg-line-strong" />
            </div>
            <h3 className="mt-6 font-display text-2xl font-bold tracking-tight lg:text-[1.75rem]">{domain.title}</h3>
            <ul className="mt-4 flex flex-1 flex-col gap-2">
              {domain.controls.map((c) => (
                <li key={c} className="flex gap-2.5 text-sm leading-snug text-muted">
                  <span aria-hidden="true" className="mt-[0.5rem] h-px w-3 shrink-0 bg-fg/40" />
                  {c}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-4">
              <NormBadge norm={domain.norm} />
            </div>
          </Reveal>
        ))}
      </ul>
    </Screen>
  )
}
