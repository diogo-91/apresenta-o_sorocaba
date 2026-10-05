import { m } from 'framer-motion'
import { company } from '../data/company'
import { hero } from '../data/content'
import { TOTAL_SCREENS } from '../data/screens'
import { HeroMedia } from '../components/technical/HeroMedia'
import { Headline } from '../components/ui/Headline'
import { Pending } from '../components/ui/Pending'
import { titleId } from '../components/layout/Screen'
import { DURATION, EASE_OUT } from '../lib/motion'

export function HeroSection() {
  return (
    <section id="inicio" data-screen aria-labelledby={titleId('inicio')} className="relative min-h-svh overflow-hidden lg:snap-start">
      <HeroMedia />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />

      <div className="relative mx-auto flex min-h-svh max-w-[1520px] flex-col justify-end px-5 pb-10 pt-28 md:px-10 lg:pb-12 lg:pl-16 lg:pr-32">
        <m.p
          className="label-mono mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.base, delay: 0.2 }}
        >
          <span className="text-fg">{hero.eyebrow}</span>
          <span className="h-px w-6 bg-line-strong" aria-hidden="true" />
          <span>
            Preparado para <Pending value={company.preparedFor} />
          </span>
        </m.p>

        <Headline id={titleId('inicio')} as="h1" size="xl" text={hero.headline} className="max-w-[14ch]" delay={0.3} />

        <m.p
          className="display-md mt-5 max-w-[22ch] text-muted lg:mt-7"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.9 }}
        >
          {hero.subheadline}
        </m.p>

        <div className="mt-12 flex items-end justify-between gap-6 border-t border-line pt-5 lg:mt-16">
          <a href="#quem-somos" className="group flex items-center gap-4 text-fg">
            <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[drop_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            <span className="label-mono">{hero.scrollHint}</span>
          </a>
          <dl className="hidden grid-cols-3 gap-8 text-right md:grid">
            <div>
              <dt className="label-mono text-faint">Documento</dt>
              <dd className="label-mono mt-1 text-muted">Apresentação técnica</dd>
            </div>
            <div>
              <dt className="label-mono text-faint">Revisão</dt>
              <dd className="label-mono mt-1 text-muted">{company.documentRevision}</dd>
            </div>
            <div>
              <dt className="label-mono text-faint">Folhas</dt>
              <dd className="label-mono mt-1 text-muted">01–{TOTAL_SCREENS}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
