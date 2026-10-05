import { useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { safety } from '../data/content'
import { safetyDomains, safetyGear, type NormReference } from '../data/safety'
import { Screen, titleId } from '../components/layout/Screen'
import { GearIllustration } from '../components/technical/Scenes'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { DURATION, EASE_OUT } from '../lib/motion'

const BOARD_LAYOUT = [
  'lg:col-span-3 lg:row-span-2',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-2 lg:row-span-2',
  'lg:col-span-3 lg:row-span-1',
  'lg:col-span-2 lg:row-span-1',
  'lg:col-span-3 lg:row-span-1',
]

function NormTag({ norm }: { norm: NormReference | null }) {
  if (!norm) return <span className="label-mono text-faint">Procedimento</span>
  return (
    <span className="font-mono text-xs tracking-wider text-muted" title="Referência temática a validar. Não representa certificação.">
      {norm.code}
      {!norm.validated && <span className="text-faint">*</span>}
    </span>
  )
}

export function SafetySection() {
  const [selected, setSelected] = useState(safetyDomains[0].id)
  const domain = safetyDomains.find((d) => d.id === selected)!

  return (
    <Screen id="seguranca" theme="dark" className="grain">
      <div className="grid flex-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-5">
          <Headline id={titleId('seguranca')} size="md" text={safety.headline} className="max-w-[17ch]" />
          <Reveal delay={0.2}>
            <p className="lede mt-4">{safety.subheadline}</p>
          </Reveal>

          <ul className="mt-7 border-t border-line" aria-label="Domínios de risco">
            {safetyDomains.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  aria-pressed={d.id === selected}
                  onClick={() => setSelected(d.id)}
                  onMouseEnter={() => setSelected(d.id)}
                  className={`flex w-full items-baseline gap-4 border-b border-line py-2.5 text-left transition-colors duration-300 ${d.id === selected ? 'text-fg' : 'text-muted hover:text-fg'}`}
                >
                  <span className={`label-mono w-10 ${d.id === selected ? 'text-accent-ink' : 'text-faint'}`}>{d.code}</span>
                  <span className="font-display text-lg font-semibold tracking-tight">{d.title}</span>
                  <span className="ml-auto">
                    <NormTag norm={d.norm} />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 min-h-[6.5rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <m.ul key={domain.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }} className="flex flex-col gap-1.5">
                {domain.controls.map((c) => (
                  <li key={c} className="flex gap-3 text-sm text-fg/85">
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    {c}
                  </li>
                ))}
              </m.ul>
            </AnimatePresence>
          </div>
          <p className="label-mono mt-auto text-faint">* Referências normativas a validar · não representam certificação</p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:-mr-24 lg:grid-cols-5 lg:grid-rows-4" aria-label="Equipamentos de proteção">
          {safetyGear.map((gear, i) => {
            const related = gear.domain === selected
            const code = safetyDomains.find((d) => d.id === gear.domain)!.code
            return (
              <Reveal as="li" key={gear.id} delay={0.2 + i * 0.07} className={`${BOARD_LAYOUT[i]} min-h-40 lg:min-h-0`}>
                <button
                  type="button"
                  data-cursor="explore"
                  onMouseEnter={() => setSelected(gear.domain)}
                  onFocus={() => setSelected(gear.domain)}
                  onClick={() => setSelected(gear.domain)}
                  aria-label={`${gear.label} · ${code}${gear.photo ? '' : ' (foto a inserir)'}`}
                  className={`group relative block size-full overflow-hidden border bg-paper-2 text-left transition-[opacity,border-color] duration-500 ${related ? 'border-accent/60 opacity-100' : 'border-line opacity-45'}`}
                >
                  {gear.photo ? (
                    <>
                      <img src={gear.photo} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out-mech group-hover:scale-[1.03]" />
                      <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-paper)_0%,transparent_32%,transparent_70%,var(--color-paper)_100%)] opacity-80" />
                    </>
                  ) : (
                    <div className="absolute inset-[18%] text-fg/70 transition-transform duration-[1200ms] ease-out-mech group-hover:scale-[1.03]">
                      <GearIllustration id={gear.id} />
                    </div>
                  )}
                  <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M62 46 L40 22 H12" vectorEffect="non-scaling-stroke" className={related ? 'stroke-accent' : 'stroke-faint'} fill="none" strokeWidth="1" />
                    <circle cx="62" cy="46" r="1" className={related ? 'fill-accent' : 'fill-faint'} />
                  </svg>
                  <span className="label-mono absolute left-3 top-3 text-fg">
                    {String(i + 1).padStart(2, '0')} {gear.label}
                  </span>
                  <span className="label-mono absolute bottom-3 right-3 text-faint">
                    {code}
                    {!gear.photo && ' · foto a inserir'}
                  </span>
                </button>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Screen>
  )
}
