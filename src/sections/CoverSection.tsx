import { m } from 'framer-motion'
import { company } from '../data/company'
import { cover } from '../data/content'
import { titleId } from '../components/layout/Screen'
import { BlueprintPlant } from '../components/technical/BlueprintPlant'
import { Logo } from '../components/ui/Logo'
import { Pending } from '../components/ui/Pending'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { DURATION, EASE_OUT } from '../lib/motion'

export function CoverSection() {
  const deck = usePresentationMode() === 'deck'
  const [lead, tail] = company.slogan.split('. ')
  const sheet = [
    { label: 'Preparado para', value: company.preparedFor },
    { label: 'Data', value: company.presentationDate },
    { label: 'Documento', value: cover.documentLabel },
    { label: 'Revisão', value: company.documentRevision },
  ]

  return (
    <section id={deck ? 'capa' : undefined} data-screen aria-labelledby={titleId('capa')} className={`relative grid bg-paper ${deck ? 'h-full grid-cols-12' : 'min-h-svh grid-rows-[auto_1fr] pt-16'}`}>
      <div className={`relative overflow-hidden bg-night text-night-fg ${deck ? 'order-2 col-span-5' : ''}`}>
        <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-80" />
        <BlueprintPlant className="absolute inset-0 size-full text-[#4fa3d9] opacity-35" />
        <div className={`relative flex h-full flex-col ${deck ? 'justify-between p-16' : 'gap-10 px-5 py-12'}`}>
          <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.2 }}>
            <Logo tone="light" className={deck ? 'w-full max-w-[400px]' : 'w-60'} />
          </m.div>
          <ul className="label-mono flex flex-col gap-2 text-night-fg/70">
            {cover.disciplines.map((d) => (
              <li key={d} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-6 bg-[#4fa3d9]" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`flex flex-col ${deck ? 'order-1 col-span-7 justify-between px-24 py-16' : 'gap-10 px-5 py-12'}`}>
        <p className="label-mono flex items-center gap-3 text-muted">
          <span aria-hidden="true" className="size-2 bg-accent" />
          {cover.eyebrow}
        </p>
        <div>
          <m.h1
            id={titleId('capa')}
            className="display-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_OUT, delay: 0.1 }}
          >
            {lead}.
            <br />
            <span className="text-muted">{tail}</span>
          </m.h1>
          <p className="lede mt-8 max-w-[38ch]">{cover.subtitle}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line-strong pt-6 lg:grid-cols-4">
          {sheet.map((row) => (
            <div key={row.label}>
              <dt className="label-mono text-faint">{row.label}</dt>
              <dd className="mt-1.5 text-sm text-fg">
                <Pending value={row.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
