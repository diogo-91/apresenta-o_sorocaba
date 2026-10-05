import { airport } from '../data/content'
import { airportSystems, preparationSteps } from '../data/airport'
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
      <p className="label-mono text-faint">Sistema crítico</p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight lg:text-4xl">{system.label}</h3>
      <p className="label-mono mt-4 text-faint lg:mt-6">Competência aplicável</p>
      <p className="mt-1 text-sm text-fg/90 lg:text-base">{system.competence}</p>
      <p className="label-mono mt-4 text-blueprint">
        {front.code} · {front.name}
      </p>
    </div>
  )
}

export function AirportSection() {
  return (
    <Screen id="grandes-operacoes" grid>
      <Eyebrow tone="blueprint" className="mb-6">
        Ambientes de alta criticidade
      </Eyebrow>
      <div className="mb-10 grid gap-6 lg:mb-12 lg:grid-cols-12 lg:items-end">
        <Headline id={titleId('grandes-operacoes')} text={airport.headline} className="max-w-[17ch] lg:col-span-8" />
        <Reveal className="lg:col-span-4" delay={0.15}>
          <p className="lede">{airport.subheadline}</p>
        </Reveal>
      </div>

      <Reveal>
        <HotspotMap
          width={TERMINAL_VIEWBOX.width}
          height={TERMINAL_VIEWBOX.height}
          drawing={<TerminalDrawing />}
          hotspots={airportSystems.map((s, i) => ({ ...s, code: `S-${String(i + 1).padStart(2, '0')}` }))}
          label={airport.drawingLabel}
          hint="Sistemas críticos · competências aplicáveis"
          renderDetail={(id) => <SystemDetail id={id} />}
        />
      </Reveal>
      <p className="label-mono mt-6 max-w-[80ch] border-l-2 border-blueprint pl-3 text-muted">{airport.disclaimer}</p>

      <div className="mt-16 border-t border-line pt-10 lg:mt-20">
        <h3 className="display-md max-w-[20ch]">{airport.preparationTitle}</h3>
        <ol className="mt-10 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {preparationSteps.map((step, i) => (
            <Reveal as="li" key={step.id} delay={0.04 * i} className="flex flex-col border-b border-r border-line bg-ink p-5 lg:p-6">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-6 font-display text-xl font-bold leading-tight tracking-tight">{step.title}</span>
              <span className="mt-2 text-sm leading-relaxed text-muted">{step.text}</span>
            </Reveal>
          ))}
          <li className="hidden flex-col justify-end border-b border-r border-line bg-ink-2 p-6 lg:flex" aria-hidden="true">
            <span className="label-mono text-faint">Escopo validado em campo</span>
          </li>
        </ol>
      </div>
    </Screen>
  )
}
