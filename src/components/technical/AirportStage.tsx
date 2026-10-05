import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { airportSystems, airportTour, TERMINAL_SIZE } from '../../data/airport'
import { frontById } from '../../data/services'
import { useSlideStep } from '../../hooks/useDeckPosition'
import { cameraFor } from '../../lib/camera'
import { gsap } from '../../lib/gsap'
import { DURATION, EASE_OUT } from '../../lib/motion'
import { TerminalDrawing } from './TerminalDrawing'

const pad2 = (v: number) => String(v).padStart(2, '0')
const SKY = 390
const VIEW = { width: TERMINAL_SIZE.width, height: TERMINAL_SIZE.height + SKY }
const RULER = Array.from({ length: 17 }, (_, i) => i * 100)

export function AirportStage({ intro }: { intro: ReactNode }) {
  const step = useSlideStep()
  const reduced = useReducedMotion()
  const [override, setOverride] = useState<string | null>(null)
  const cameraGroup = useRef<SVGGElement>(null)
  const markers = useRef<(SVGGElement | null)[]>([])
  const cam = useRef({ scale: 1, x: 0, y: 0 })

  useEffect(() => setOverride(null), [step])

  const focusId = override ?? (step > 0 ? airportTour[step - 1] : null)
  const system = airportSystems.find((s) => s.id === focusId) ?? null
  const tourIndex = focusId ? airportTour.indexOf(focusId) : -1

  useEffect(() => {
    const focus = system ? { ...system.focus, y: system.focus.y + SKY } : null
    const target = cameraFor(focus, VIEW)
    const apply = () => {
      const { scale, x, y } = cam.current
      cameraGroup.current?.setAttribute('transform', `translate(${x} ${y}) scale(${scale})`)
      markers.current.forEach((el) => el?.setAttribute('transform', `scale(${1 / scale})`))
    }
    if (reduced) {
      cam.current = target
      apply()
      return
    }
    const tween = gsap.to(cam.current, { ...target, duration: 1.6, ease: 'power3.inOut', onUpdate: apply })
    return () => {
      tween.kill()
    }
  }, [system, reduced])

  return (
    <div className="grid min-h-0 flex-1 grid-cols-12 gap-10">
      <div className="relative col-span-8 -ml-24 self-stretch overflow-hidden border-r border-line" role="group" aria-label="Terminal aeroportuário esquemático">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(95_176_230/0.10),transparent_65%)]" aria-hidden="true" />
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} className="absolute inset-0 size-full" preserveAspectRatio="xMidYMax meet">
          <g ref={cameraGroup}>
            <g aria-hidden="true" className="text-blueprint" stroke="currentColor" fill="none">
              <path d="M1700 40 Q1100 120 760 330" strokeDasharray="3 9" strokeOpacity="0.45" />
              <path d="M1700 110 Q1250 170 980 330" strokeDasharray="3 9" strokeOpacity="0.25" />
              <path d="M1180 128 l26 -6 l-8 10 l14 6 l-30 2 z" className="fill-blueprint/40" strokeOpacity="0.6" />
              {RULER.map((x) => (
                <path key={x} d={`M${x} 0 V${x % 500 === 0 ? 22 : 12}`} strokeOpacity="0.4" />
              ))}
              <path d="M120 120 V60 M120 60 l-8 16 M120 60 l8 16" strokeOpacity="0.5" />
            </g>
            <g className="fill-faint" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2" aria-hidden="true">
              {RULER.filter((x) => x % 500 === 0).map((x) => (
                <text key={x} x={x + 6} y="36">{String(x).padStart(4, '0')}</text>
              ))}
              <text x="112" y="146">N</text>
              <text x="1260" y="200">APROXIMAÇÃO · ESQUEMA</text>
            </g>
            <g transform={`translate(0 ${SKY})`}>
            <TerminalDrawing focus={focusId} />
            {airportSystems.map((s, i) => {
              const active = s.id === focusId
              return (
                <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
                  <g ref={(el) => void (markers.current[i] = el)}>
                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={`${s.label}: ${s.competence}`}
                      aria-pressed={active}
                      className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-accent"
                      onClick={() => setOverride(s.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setOverride(s.id)
                        }
                      }}
                    >
                      <circle r="22" className={`fill-transparent ${active ? 'stroke-accent' : 'stroke-fg/40'}`} strokeWidth="1" />
                      {!active && <circle r="22" className="fill-none stroke-blueprint/50 motion-safe:animate-[ping-soft_2.8s_ease-out_infinite]" />}
                      <circle r="12" className={active ? 'fill-accent' : 'fill-paper stroke-fg/80'} strokeWidth="1" />
                      <text y="4" textAnchor="middle" className={`font-mono text-[11px] ${active ? 'fill-paper' : 'fill-fg'}`}>
                        {i + 1}
                      </text>
                    </g>
                  </g>
                </g>
              )
            })}
            </g>
          </g>
        </svg>
        <p className="label-mono absolute left-24 top-12 text-faint">Terminal · instalação crítica · esquema sem escala</p>
      </div>

      <div className="col-span-4 flex flex-col" aria-live="polite">
        <AnimatePresence mode="wait">
          {system ? (
            <m.div
              key={system.id}
              className="flex flex-1 flex-col"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: DURATION.base, ease: EASE_OUT }}
            >
              <p className="label-mono text-accent-ink">
                {tourIndex >= 0 ? `${pad2(tourIndex + 1)} / ${pad2(airportTour.length)}` : 'Sistema crítico'}
              </p>
              <h3 className="mt-4 font-display text-[4.25rem] font-bold leading-[0.9] tracking-tight [font-stretch:80%]">{system.label}</h3>
              <p className="label-mono mt-10 text-faint">Competência aplicável</p>
              <p className="mt-2 text-xl leading-snug text-fg">{system.competence}</p>
              <p className="label-mono mt-6 text-blueprint">
                {frontById(system.front).code} · {frontById(system.front).name}
              </p>
              <ol className="mt-auto flex gap-1.5" aria-label="Percurso">
                {airportTour.map((id, i) => (
                  <li key={id} className={`h-0.5 flex-1 ${i <= tourIndex ? 'bg-accent' : 'bg-line-strong'}`} />
                ))}
              </ol>
            </m.div>
          ) : (
            <m.div key="intro" className="flex flex-1 flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.base }}>
              {intro}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
