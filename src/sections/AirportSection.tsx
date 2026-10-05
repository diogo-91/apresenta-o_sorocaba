import { airport } from '../data/content'
import { airportSystems, airportTour, TERMINAL_SIZE } from '../data/airport'
import { frontById } from '../data/services'
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
      <ol className="mt-8 flex flex-col border-t border-line">
        {airportTour.map((id, i) => {
          const s = airportSystems.find((x) => x.id === id)!
          return (
            <li key={id} className="flex items-baseline gap-4 border-b border-line py-2.5">
              <span className="label-mono text-faint">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-lg font-semibold tracking-tight">{s.label}</span>
              <span aria-hidden="true" className="ml-auto label-mono text-faint">→</span>
            </li>
          )
        })}
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
        {airportSystems.map((s, i) => (
          <li key={s.id} className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-4">
            <span className="label-mono pt-1 text-faint">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-display text-xl font-bold tracking-tight">{s.label}</h3>
              <p className="mt-1 text-sm text-muted">{s.competence}</p>
              <p className="label-mono mt-2 text-blueprint">
                {frontById(s.front).code} · {frontById(s.front).name}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Screen>
  )
}
