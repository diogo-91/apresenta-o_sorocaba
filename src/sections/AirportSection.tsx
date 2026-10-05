import { airport } from '../data/content'
import { airportSystems } from '../data/airport'
import { frontById } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { HotspotMap } from '../components/technical/HotspotMap'
import { TERMINAL_VIEWBOX, TerminalDrawing } from '../components/technical/TerminalDrawing'
import { Headline } from '../components/ui/Headline'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/motion/Reveal'

function SystemDetail({ id }: { id: string }) {
  const system = airportSystems.find((s) => s.id === id)!
  const front = frontById(system.front)
  return (
    <div>
      <h3 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">{system.label}</h3>
      <p className="label-mono mt-3 text-faint">Competência aplicável</p>
      <p className="mt-1 text-sm text-fg/90">{system.competence}</p>
      <p className="label-mono mt-3 text-blueprint">
        {front.code} · {front.name}
      </p>
    </div>
  )
}

export function AirportSection() {
  return (
    <Screen id="grandes-operacoes" grid>
      <Reveal className="flex min-h-0 flex-1 flex-col">
        <HotspotMap
          width={TERMINAL_VIEWBOX.width}
          height={TERMINAL_VIEWBOX.height}
          drawing={
            <div>
              <TerminalDrawing />
              <p className="label-mono mt-4 max-w-[80ch] border-l-2 border-blueprint pl-3 text-muted">{airport.disclaimer}</p>
            </div>
          }
          hotspots={airportSystems.map((s, i) => ({ ...s, code: `S-${String(i + 1).padStart(2, '0')}` }))}
          label={airport.drawingLabel}
          hint="Sistema crítico selecionado"
          intro={
            <div>
              <Eyebrow tone="blueprint" className="mb-4">
                Ambientes de alta criticidade
              </Eyebrow>
              <Headline id={titleId('grandes-operacoes')} size="md" text={airport.headline} className="max-w-[16ch]" />
              <p className="lede mt-5">{airport.subheadline}</p>
            </div>
          }
          renderDetail={(id) => <SystemDetail id={id} />}
        />
      </Reveal>
    </Screen>
  )
}
