import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { operationsMap } from '../data/content'
import { facilityLayers, facilityZones } from '../data/facility'
import { facility3DSteps } from '../data/facility3d'
import { hasWebGL } from '../hooks/useDeviceCapabilities'
import { setFacilitySelection, useFacilitySelection } from '../lib/three/selection'

const InlineScene = lazy(() => import('../components/three/InlineScene'))
import { frontById } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { FACILITY_VIEWBOX, FacilityDrawing } from '../components/technical/FacilityDrawing'
import { Headline } from '../components/ui/Headline'
import { useSlideStep } from '../hooks/useDeckPosition'
import { usePresentationMode } from '../hooks/usePresentationMode'
import { useScrollProgress } from '../hooks/useScene'
import { DURATION, EASE_OUT } from '../lib/motion'

const pad2 = (v: number) => String(v).padStart(2, '0')
const layerOf = (zoneId: string) => facilityLayers.findIndex((l) => l.zones.includes(zoneId))

function ZoneDetail({ id }: { id: string }) {
  const zone = facilityZones.find((z) => z.id === id)!
  const front = frontById(zone.front)
  return (
    <div>
      <p className="label-mono text-faint">
        {zone.code} · {zone.level}
      </p>
      <h4 className="mt-1 font-display text-2xl font-bold tracking-tight">{zone.label}</h4>
      <ul className="mt-2 flex flex-col gap-1">
        {zone.services.map((s) => (
          <li key={s} className="flex items-baseline gap-3 text-sm text-fg/90">
            <span aria-hidden="true" className="h-px w-3 shrink-0 -translate-y-[3px] bg-blueprint" />
            {s}
          </li>
        ))}
      </ul>
      <a href={`#${front.id}`} className="link-underline label-mono mt-3 inline-flex items-center gap-2 text-blueprint">
        {front.code} · {front.name}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </div>
  )
}

function Hotspots({ revealed, selected, onSelect }: { revealed: number; selected: string | null; onSelect?: (id: string) => void }) {
  return (
    <div className="absolute inset-0">
      {facilityZones.map((zone, i) => {
        const visible = layerOf(zone.id) < revealed
        const active = zone.id === selected
        const style = { left: `${(zone.x / FACILITY_VIEWBOX.width) * 100}%`, top: `${(zone.y / FACILITY_VIEWBOX.height) * 100}%` }
        const marker = (
          <span className={`relative flex size-7 items-center justify-center border font-mono text-[0.6875rem] transition-colors duration-300 max-lg:size-5 max-lg:text-[0.5625rem] ${active ? 'border-accent bg-accent text-fg' : 'border-fg/70 bg-paper text-fg'}`}>
            {!active && <span aria-hidden="true" className="absolute inset-0 border border-blueprint motion-safe:animate-[ping-soft_2.8s_ease-out_infinite]" />}
            {i + 1}
          </span>
        )
        return (
          <m.div
            key={zone.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={style}
            initial={false}
            animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
            transition={{ duration: DURATION.base, delay: visible ? 0.9 : 0 }}
          >
            {onSelect ? (
              <button type="button" tabIndex={visible ? 0 : -1} aria-label={`${zone.code} · ${zone.label}`} aria-pressed={active} onClick={() => onSelect(zone.id)} className="p-2">
                {marker}
              </button>
            ) : (
              <span aria-hidden="true">{marker}</span>
            )}
          </m.div>
        )
      })}
    </div>
  )
}

const LAYER_OF_STEP = [0, 1, 1, 2, 3, 4, 5]

function Deck3DStage() {
  const step = useSlideStep()
  const selected = useFacilitySelection()
  const current = facility3DSteps[Math.min(step, facility3DSteps.length - 1)]
  const shown = facility3DSteps.find((s) => s.id === selected) ?? current
  const index = facility3DSteps.indexOf(shown)
  const front = frontById(shown.front)

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-10">
      <div className="col-span-8" aria-hidden="true" />
      <div className="col-span-4 flex flex-col">
        <Headline id={titleId('mapa')} size="md" text={operationsMap.headline} className="max-w-[14ch]" />
        <p className="lede mt-4">{operationsMap.subheadline}</p>
        <div className="mt-8 border-t border-line pt-5" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.div key={shown.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }}>
              <p className="label-mono text-accent-ink">
                Etapa {pad2(index + 1)} / {pad2(facility3DSteps.length)}
              </p>
              <h3 className="mt-2 font-display text-[3.25rem] font-bold leading-[0.95] tracking-tight [font-stretch:80%]">{shown.label}</h3>
              <p className="label-mono mt-2 text-muted">{shown.kicker}</p>
              <ul className="mt-4 flex flex-col gap-1.5">
                {shown.services.map((service) => (
                  <li key={service} className="flex items-baseline gap-3 text-sm">
                    <span aria-hidden="true" className="h-px w-3 shrink-0 -translate-y-[3px] bg-blueprint" />
                    {service}
                  </li>
                ))}
              </ul>
              <a href={`#${front.id}`} className="link-underline label-mono mt-4 inline-flex items-center gap-2 text-blueprint">
                {front.code} · {front.name}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
            </m.div>
          </AnimatePresence>
        </div>
        <ol className="mt-auto grid grid-cols-7 gap-1.5" aria-label="Etapas">
          {facility3DSteps.map((s, i) => (
            <li key={s.id}>
              <button type="button" onClick={() => setFacilitySelection(s.id)} aria-pressed={s.id === shown.id} className="block w-full text-left" title={s.label}>
                <span className={`block h-0.5 ${i <= step ? 'bg-accent' : 'bg-line-strong'}`} />
                <span className={`label-mono mt-2 block truncate text-[0.5rem] ${s.id === shown.id ? 'text-fg' : 'text-faint'}`}>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function DeckStage() {
  const step = LAYER_OF_STEP[Math.min(useSlideStep(), LAYER_OF_STEP.length - 1)]
  const [zone, setZone] = useState<string | null>(null)
  useEffect(() => setZone(null), [step])
  const layer = facilityLayers[step]

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-10">
      <div className="relative col-span-8 self-center" role="group" aria-label={operationsMap.drawingLabel}>
        <FacilityDrawing revealed={step + 1} current={step} />
        <Hotspots revealed={step + 1} selected={zone} onSelect={setZone} />
      </div>
      <div className="col-span-4 flex flex-col">
        <Headline id={titleId('mapa')} size="md" text={operationsMap.headline} className="max-w-[14ch]" />
        <p className="lede mt-4">{operationsMap.subheadline}</p>
        <div className="mt-8 border-t border-line pt-5" aria-live="polite">
          <AnimatePresence mode="wait">
            <m.div key={zone ?? layer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: DURATION.fast, ease: EASE_OUT }}>
              {zone ? (
                <ZoneDetail id={zone} />
              ) : (
                <>
                  <p className="label-mono text-accent-ink">
                    Camada {pad2(step + 1)} / {pad2(facilityLayers.length)}
                  </p>
                  <h3 className="mt-2 font-display text-[3.25rem] font-bold leading-[0.95] tracking-tight [font-stretch:80%]">{layer.label}</h3>
                  <ul className="mt-4 flex flex-col gap-1.5">
                    {layer.zones.map((id) => {
                      const z = facilityZones.find((x) => x.id === id)!
                      return (
                        <li key={id} className="flex items-baseline gap-3 text-sm">
                          <span className="label-mono text-faint">{z.code}</span>
                          <span className="font-medium">{z.label}</span>
                          <span className="text-muted">· {z.services.slice(0, 2).join(', ')}</span>
                        </li>
                      )
                    })}
                  </ul>
                </>
              )}
            </m.div>
          </AnimatePresence>
        </div>
        <ol className="mt-auto flex gap-1.5" aria-label="Camadas">
          {facilityLayers.map((l, i) => (
            <li key={l.id} className="flex-1">
              <span className={`block h-0.5 ${i <= step ? 'bg-accent' : 'bg-line-strong'}`} />
              <span className={`label-mono mt-2 block truncate text-[0.5625rem] ${i === step ? 'text-fg' : 'text-faint'}`}>{l.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function FlowStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(1)
  const render = useCallback((p: number) => setRevealed(Math.max(1, Math.min(6, Math.ceil(p * 6.2)))), [])
  useScrollProgress(ref, render, true)

  return (
    <div>
      <Headline id={titleId('mapa')} text={operationsMap.headline} className="max-w-[14ch]" />
      <p className="lede mt-5">{operationsMap.subheadline}</p>
      {hasWebGL() ? (
        <Suspense fallback={<div className="-mx-5 mt-10 h-[68svh]" />}>
          <InlineScene className="relative -mx-5 mt-10" />
        </Suspense>
      ) : (
        <div ref={ref} className="relative -mx-5 mt-10">
          <FacilityDrawing revealed={revealed} current={revealed - 1} />
          <Hotspots revealed={revealed} selected={null} />
        </div>
      )}
      <ol className="mt-8 grid border-t border-line sm:grid-cols-2">
        {facilityZones.map((zone, i) => (
          <li key={zone.id} className="flex gap-4 border-b border-line py-5 pr-2">
            <span className="flex size-7 shrink-0 items-center justify-center border border-fg/70 font-mono text-[0.6875rem]">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <ZoneDetail id={zone.id} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export function OperationsMapSection() {
  const deck = usePresentationMode() === 'deck'
  return (
    <Screen id="mapa" tone="deep" grid>
      {deck ? hasWebGL() ? <Deck3DStage /> : <DeckStage /> : <FlowStage />}
    </Screen>
  )
}
