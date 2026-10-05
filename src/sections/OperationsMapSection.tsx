import { ArrowRight } from 'lucide-react'
import { operationsMap } from '../data/content'
import { facilityZones } from '../data/facility'
import { frontById } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { FACILITY_VIEWBOX, FacilityDrawing } from '../components/technical/FacilityDrawing'
import { HotspotMap } from '../components/technical/HotspotMap'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { scrollToScreen } from '../lib/scroll'

function ZoneDetail({ id }: { id: string }) {
  const zone = facilityZones.find((z) => z.id === id)!
  const front = frontById(zone.front)
  return (
    <div>
      <p className="label-mono text-faint">
        {zone.code} · {zone.level}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight lg:text-4xl">{zone.label}</h3>
      <ul className="mt-4 flex flex-col gap-1.5 lg:mt-6">
        {zone.services.map((s) => (
          <li key={s} className="flex items-baseline gap-3 text-sm text-fg/90">
            <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-3px] bg-blueprint" />
            {s}
          </li>
        ))}
      </ul>
      <a
        href={`#${front.id}`}
        onClick={(e) => {
          e.preventDefault()
          scrollToScreen(front.id)
        }}
        className="label-mono mt-5 inline-flex items-center gap-2 text-blueprint hover:text-fg lg:mt-8"
      >
        {front.code} · {front.name}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  )
}

export function OperationsMapSection() {
  return (
    <Screen id="mapa" tone="deep">
      <div className="mb-10 grid gap-6 lg:mb-12 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('mapa')} text={operationsMap.headline} className="max-w-[16ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{operationsMap.subheadline}</p>
        </Reveal>
      </div>
      <Reveal>
        <HotspotMap
          width={FACILITY_VIEWBOX.width}
          height={FACILITY_VIEWBOX.height}
          drawing={<FacilityDrawing />}
          hotspots={facilityZones}
          label={operationsMap.drawingLabel}
          hint={operationsMap.hint}
          renderDetail={(id) => <ZoneDetail id={id} />}
        />
      </Reveal>
      <p className="label-mono mt-6 text-faint">{operationsMap.drawingLabel} · sem escala</p>
    </Screen>
  )
}
