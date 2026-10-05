import { useCallback, useMemo, useState } from 'react'
import { m } from 'framer-motion'
import { arts } from '../data/content'
import { artCategories, artIndicators, artRecords, type ArtCategory, type ArtRecord } from '../data/arts'
import { Screen, titleId } from '../components/layout/Screen'
import { ArtDocument } from '../components/technical/ArtDocument'
import { ArtDrawer } from '../components/technical/ArtDrawer'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { EASE_MECH } from '../lib/motion'

type Filter = ArtCategory | 'Todas'

const DOC = { width: 252, height: 212, gap: 18 }
const STACK_TILT = [-4, 2.5, -1.5, 3.5, -2.5, 1]

function periodKey(period: string) {
  const match = period.match(/^(\d{2})\/(\d{4})$/)
  return match ? `${match[2]}-${match[1]}` : '9999'
}

function placement(index: number, total: number, spread: boolean) {
  if (!spread) return { x: 290 + index * 14, y: 70 + index * 10, rotate: STACK_TILT[index % STACK_TILT.length] }
  const cols = Math.min(3, total)
  const col = index % cols
  const row = Math.floor(index / cols)
  return { x: col * (DOC.width + DOC.gap), y: row * (DOC.height + DOC.gap), rotate: 0 }
}

export function ARTSection() {
  const deck = usePresentationMode() === 'deck'
  const step = useSlideStep()
  const [filter, setFilter] = useState<Filter>('Todas')
  const [open, setOpen] = useState<ArtRecord | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const spread = !deck || step >= 1 || filter !== 'Todas'

  const visible = useMemo(
    () => artRecords.filter((r) => filter === 'Todas' || r.category === filter).sort((a, b) => periodKey(a.period).localeCompare(periodKey(b.period))),
    [filter],
  )

  const filters = (
    <div role="group" aria-label="Filtrar por categoria" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
      {(['Todas', ...artCategories] as Filter[]).map((cat) => (
        <button
          key={cat}
          type="button"
          aria-pressed={filter === cat}
          onClick={() => setFilter(cat)}
          className={`label-mono shrink-0 border px-3 py-2 transition-colors duration-300 ease-mech ${filter === cat ? 'border-fg bg-fg text-paper' : 'border-line-strong text-muted hover:border-fg hover:text-fg'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  )

  return (
    <Screen id="arts" grid>
      <div className="grid flex-1 gap-10 lg:grid-cols-12">
        <div className="flex flex-col lg:col-span-5">
          <h2 id={titleId('arts')} className="font-display font-bold leading-[0.8] tracking-tighter [font-stretch:76%]">
            <span className="block text-[6rem] text-accent lg:text-[12rem]">ART</span>
            <span className="mt-3 block text-[2.25rem] leading-[0.92] lg:text-[3.5rem]">Responsabilidade</span>
            <span className="block text-[2.25rem] leading-[0.92] text-muted lg:text-[3.5rem]">documentada.</span>
          </h2>
          <Reveal delay={0.2}>
            <p className="lede mt-5 max-w-[34ch]">{arts.subheadline}</p>
          </Reveal>
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-5 lg:mt-auto">
            {artIndicators.map((indicator) => (
              <div key={indicator.id}>
                <dt className="label-mono text-faint">{indicator.label}</dt>
                <dd className="mt-1 text-sm">
                  <Pending value={indicator.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex min-w-0 flex-col lg:col-span-7">
          {filters}
          <div className="mt-4 flex items-center justify-between gap-2 border-b border-line-strong pb-2" aria-label="Linha do tempo das ARTs">
            {visible.map((r) => (
              <button key={r.id} type="button" onClick={() => setOpen(r)} className="label-mono group flex flex-col items-center gap-1.5 text-faint hover:text-fg" aria-label={`${r.category}, ${r.period}`}>
                <span className="hidden sm:inline">{r.period}</span>
                <span aria-hidden="true" className="size-2 border border-fg/60 bg-paper transition-colors group-hover:bg-accent" />
              </button>
            ))}
          </div>

          {deck ? (
            <ul className="relative mt-6 flex-1">
              {visible.map((record, i) => {
                const p = placement(i, visible.length, spread)
                return (
                  <m.li
                    key={record.id}
                    className="absolute left-0 top-0"
                    style={{ width: DOC.width, height: DOC.height, zIndex: i }}
                    initial={false}
                    animate={{ x: p.x, y: p.y, rotate: p.rotate }}
                    transition={{ duration: 1.1, ease: EASE_MECH, delay: spread ? i * 0.06 : (visible.length - i) * 0.04 }}
                  >
                    <m.button
                      type="button"
                      data-cursor="view"
                      onClick={() => setOpen(record)}
                      aria-haspopup="dialog"
                      aria-label={`ART ${record.category}, ${record.period}. Abrir documento`}
                      className="block size-full text-left"
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ArtDocument record={record} />
                    </m.button>
                  </m.li>
                )
              })}
              {!spread && <p className="label-mono absolute bottom-0 left-0 text-faint">Avance para abrir o dossiê</p>}
            </ul>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {visible.map((record) => (
                <li key={record.id} className="h-52">
                  <button type="button" onClick={() => setOpen(record)} aria-haspopup="dialog" className="block size-full text-left">
                    <ArtDocument record={record} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ArtDrawer record={open} onClose={close} />
    </Screen>
  )
}
