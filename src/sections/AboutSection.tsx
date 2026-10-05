import { about } from '../data/content'
import { company } from '../data/company'
import { pad2 } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'
import { WordReveal } from '../components/motion/WordReveal'
import { isPending } from '../lib/placeholder'

function Figure({ value, label, index }: { value: string; label: string; index: number }) {
  const pending = isPending(value)
  return (
    <Reveal delay={0.4 + index * 0.12} className="flex flex-col border-l border-line pl-5 first:border-l-0 first:pl-0 lg:pl-8">
      <span className="label-mono text-faint">IND-{pad2(index + 1)}</span>
      {pending ? (
        <span aria-hidden="true" className="mt-3 font-display text-[5.5rem] font-bold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1.5px_var(--color-line-strong)] [font-stretch:75%] lg:text-[10rem]">
          —
        </span>
      ) : (
        <span className="mt-3 font-display text-[5.5rem] font-bold leading-[0.8] tracking-tighter [font-stretch:75%] lg:text-[10rem]">{value}</span>
      )}
      <span className="mt-4 font-display text-lg font-bold uppercase leading-[1.05] tracking-tight [font-stretch:85%] lg:text-xl">
        {label.split(' ').map((word) => (
          <span key={word} className="block">
            {word}
          </span>
        ))}
      </span>
      {pending && <Pending value={value} className="mt-3 self-start text-[0.625rem]" />}
    </Reveal>
  )
}

export function AboutSection() {
  return (
    <Screen id="quem-somos" grid>
      <div className="grid gap-10 lg:grid-cols-12">
        <h2 id={titleId('quem-somos')} className="display-xl lg:col-span-8 lg:text-[7.5rem]">
          <WordReveal text={about.headline} />
        </h2>
        <Reveal delay={0.3} className="flex flex-col justify-end lg:col-span-4">
          <p className="lede">{about.subheadline}</p>
          <ol className="mt-6 border-t border-line" aria-label="Níveis de atuação">
            {about.levels.map((level) => (
              <li key={level.elevation} className="flex items-baseline gap-3 border-b border-line py-1.5">
                <span className="label-mono w-24 shrink-0 text-blueprint">{level.elevation}</span>
                <span className="text-sm text-fg/85">{level.label}</span>
              </li>
            ))}
          </ol>
          <p className="label-mono mt-2 text-faint">{about.levelsNote}</p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-y-10 lg:mt-auto lg:grid-cols-4">
        {company.metrics.map((metric, i) => (
          <Figure key={metric.id} value={metric.value} label={metric.label} index={i} />
        ))}
      </div>
    </Screen>
  )
}
