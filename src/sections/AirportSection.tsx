import { airport } from '../data/content'
import { airportConditions, airportSystems, airportTour, TERMINAL_SIZE } from '../data/airport'
import { Screen, titleId } from '../components/layout/Screen'
import { AirportStage } from '../components/technical/AirportStage'
import { TerminalDrawing } from '../components/technical/TerminalDrawing'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

function Intro() {
  return (
    <div className="flex flex-1 flex-col">
      <Eyebrow tone="blueprint" className="mb-5">
        {airport.eyebrow}
      </Eyebrow>
      <Headline id={titleId('grandes-operacoes')} size="md" text={airport.headline} className="max-w-[15ch]" />
      <p className="lede mt-5">{airport.subheadline}</p>
      <p className="label-mono mt-7 text-faint">{airport.conditionsTitle}</p>
      <ol className="mt-3 flex flex-col border-t border-line">
        {airportConditions.map((c, i) => (
          <li key={c.id} className="flex items-baseline gap-4 border-b border-line py-2">
            <span className="label-mono text-faint">{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block font-display text-lg font-semibold tracking-tight">{c.title}</span>
              <span className="mt-0.5 block text-sm text-muted lg:hidden">{c.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="label-mono mt-auto border-l-2 border-blueprint pl-3 leading-relaxed text-muted">{airport.disclaimer}</p>
    </div>
  )
}

export function AirportSection() {
  const deck = usePresentationMode() === 'deck'

  if (deck) {
    return (
      <Screen id="grandes-operacoes" theme="dark" className="grain">
        <AirportStage intro={<Intro />} />
      </Screen>
    )
  }

  return (
    <Screen id="grandes-operacoes" theme="dark" className="grain">
      <Intro />
      <Reveal className="relative -mx-5 mt-10">
        <svg viewBox={`0 0 ${TERMINAL_SIZE.width} ${TERMINAL_SIZE.height}`} className="h-auto w-full" role="img" aria-label={airport.drawingLabel}>
          <TerminalDrawing />
          {airportSystems.map((s, i) => (
            <g key={s.id} transform={`translate(${s.x} ${s.y})`} aria-hidden="true">
              <circle r="26" className="fill-paper stroke-fg/80" />
              <text y="9" textAnchor="middle" className="fill-fg font-mono text-[26px]">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </Reveal>
      <ol className="mt-8 border-t border-line">
        {airportTour.map((id, i) => {
          const s = airportSystems.find((x) => x.id === id)!
          return (
            <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-4">
              <span className="label-mono pt-1 text-faint">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight">{s.label}</h3>
                <p className="label-mono mt-2 text-faint">{airport.preparationLabel}</p>
                <p className="mt-1 text-sm text-muted">{s.preparation}.</p>
              </div>
            </li>
          )
        })}
      </ol>
    </Screen>
  )
}
