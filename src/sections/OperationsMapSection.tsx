import { ArrowRight } from 'lucide-react'
import { operationsMap } from '../data/content'
import { facilityZones } from '../data/facility'
import { frontById } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { FACILITY_VIEWBOX, FacilityDrawing } from '../components/technical/FacilityDrawing'
import { HotspotMap } from '../components/technical/HotspotMap'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

function ZoneDetail({ id }: { id: string }) {
  const zone = facilityZones.find((z) => z.id === id)!
  const front = frontById(zone.front)
  return (
    <div>
      <p className="label-mono text-faint">
        {zone.code} · {zone.level}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight lg:text-3xl">{zone.label}</h3>
      <ul className="mt-3 flex flex-col gap-1.5">
        {zone.services.map((s) => (
          <li key={s} className="flex items-baseline gap-3 text-sm text-fg/90">
            <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-3px] bg-blueprint" />
            {s}
          </li>
        ))}
      </ul>
      <a href={`#${front.id}`} className="label-mono mt-5 inline-flex items-center gap-2 text-blueprint hover:text-fg">
        {front.code} · {front.name}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  )
}

export function OperationsMapSection() {
  return (
    <Screen id="mapa" tone="deep">
      <Reveal className="flex min-h-0 flex-1 flex-col">
        <HotspotMap
          width={FACILITY_VIEWBOX.width}
          height={FACILITY_VIEWBOX.height}
          drawing={<FacilityDrawing />}
          hotspots={facilityZones}
          label={operationsMap.drawingLabel}
          hint={operationsMap.hint}
          intro={
            <div>
              <Headline id={titleId('mapa')} size="md" text={operationsMap.headline} className="max-w-[14ch]" />
              <p className="lede mt-5">{operationsMap.subheadline}</p>
              <p className="label-mono mt-4 text-faint">{operationsMap.drawingLabel} · sem escala</p>
            </div>
          }
          renderDetail={(id) => <ZoneDetail id={id} />}
        />
      </Reveal>
    </Screen>
  )
}
