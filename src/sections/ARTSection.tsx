import { useCallback, useMemo, useState } from 'react'
import { arts } from '../data/content'
import { artCategories, artIndicators, artRecords, type ArtCategory, type ArtRecord } from '../data/arts'
import { Screen, titleId } from '../components/layout/Screen'
import { ArtCard } from '../components/technical/ArtCard'
import { ArtDrawer } from '../components/technical/ArtDrawer'
import { Headline } from '../components/ui/Headline'
import { Indicator } from '../components/ui/Indicator'
import { Reveal } from '../components/motion/Reveal'

type Filter = ArtCategory | 'Todas'

function periodKey(period: string) {
  const match = period.match(/^(\d{2})\/(\d{4})$/)
  return match ? `${match[2]}-${match[1]}` : '9999'
}

export function ARTSection() {
  const [filter, setFilter] = useState<Filter>('Todas')
  const [open, setOpen] = useState<ArtRecord | null>(null)
  const close = useCallback(() => setOpen(null), [])

  const visible = useMemo(
    () => artRecords.filter((r) => filter === 'Todas' || r.category === filter).sort((a, b) => periodKey(a.period).localeCompare(periodKey(b.period))),
    [filter],
  )

  return (
    <Screen id="arts" grid>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('arts')} text={arts.headline} className="max-w-[16ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{arts.subheadline}</p>
        </Reveal>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-6">
        {artIndicators.map((indicator, i) => (
          <Reveal key={indicator.id} delay={0.06 * i}>
            <Indicator code={`ART-${String(i + 1).padStart(2, '0')}`} label={indicator.label} value={indicator.value} />
          </Reveal>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="label-mono text-faint" id="art-filter-label">
          Filtrar por categoria
        </p>
        <div role="group" aria-labelledby="art-filter-label" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:justify-end lg:px-0">
          {(['Todas', ...artCategories] as Filter[]).map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={filter === cat}
              onClick={() => setFilter(cat)}
              className={`label-mono shrink-0 border px-3 py-2 transition-colors duration-300 ease-mech ${
                filter === cat ? 'border-fg bg-fg text-ink' : 'border-line-strong text-muted hover:border-fg hover:text-fg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6" aria-label="Linha do tempo das ARTs">
        <div className="relative flex items-center justify-between gap-2 border-b border-line-strong pb-3">
          {visible.map((r) => (
            <button key={r.id} type="button" onClick={() => setOpen(r)} className="label-mono group flex flex-col items-center gap-2 text-faint hover:text-fg" aria-label={`${r.category}, ${r.period}`}>
              <span className="hidden sm:inline">{r.period}</span>
              <span aria-hidden="true" className="size-2 border border-fg/60 bg-ink transition-colors group-hover:bg-accent" />
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((record) => (
          <li key={record.id}>
            <ArtCard record={record} onOpen={() => setOpen(record)} />
          </li>
        ))}
      </ul>

      <ArtDrawer record={open} onClose={close} />
    </Screen>
  )
}
