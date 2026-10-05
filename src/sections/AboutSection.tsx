import { about } from '../data/content'
import { company } from '../data/company'
import { pad2 } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { Headline } from '../components/ui/Headline'
import { Indicator } from '../components/ui/Indicator'
import { Reveal } from '../components/motion/Reveal'

export function AboutSection() {
  return (
    <Screen id="quem-somos" grid>
      <div className="grid flex-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Headline id={titleId('quem-somos')} text={about.headline} className="max-w-[12ch]" />
          <Reveal delay={0.2}>
            <p className="lede mt-8 max-w-[44ch]">{about.subheadline}</p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-5 lg:pt-3" delay={0.15}>
          <figure aria-label="Níveis de atuação, da cobertura ao subsolo">
            <ol className="relative">
              {about.levels.map((level, i) => (
                <li key={level.elevation} className="group relative grid grid-cols-[6.5rem_1fr] items-center gap-4 border-t border-line py-4 last:border-b">
                  <span className="label-mono flex items-center gap-2 text-blueprint">
                    <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true" className="fill-current">
                      <path d="M0 0h10L5 8z" />
                    </svg>
                    {level.elevation}
                  </span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-xl font-semibold tracking-tight text-fg lg:text-2xl">{level.label}</span>
                    <span className="label-mono text-faint">N{pad2(about.levels.length - i)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <figcaption className="label-mono mt-3 text-faint">{about.levelsNote}</figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 lg:mt-20 lg:grid-cols-4 lg:gap-6">
        {company.metrics.map((metric, i) => (
          <Reveal key={metric.id} delay={0.08 * i}>
            <Indicator code={`IND-${pad2(i + 1)}`} label={metric.label} value={metric.value} />
          </Reveal>
        ))}
      </div>
    </Screen>
  )
}
