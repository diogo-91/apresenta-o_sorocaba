import { m, useReducedMotion } from 'framer-motion'
import { EASE_MECH } from '../../lib/motion'

const TEETH = Array.from({ length: 5 }, (_, i) => 260 + i * 196)
const AXES = [...TEETH, 1240]
const AXIS_LABELS = ['A', 'B', 'C', 'D', 'E', 'F']

const roof = TEETH.map((x) => `M${x} 470 V390 L${x + 196} 470`).join(' ')
const truss = TEETH.map((x) => `M${x} 490 L${x + 98} 470 L${x + 196} 490 M${x + 98} 470 V490`).join(' ')
const columns = AXES.map((x) => `M${x} 470 V760`).join(' ')
const glazing = TEETH.map((x) => `M${x + 6} 398 V464 M${x + 12} 404 V464`).join(' ')

export function BlueprintPlant({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()

  const draw = (delay: number, duration = 2.2) =>
    reduced
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration, ease: EASE_MECH, delay }, opacity: { duration: 0.2, delay } },
        }

  return (
    <svg viewBox="0 0 1600 900" fill="none" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <g stroke="currentColor" strokeWidth="1">
        <m.path d="M80 760 H1560" {...draw(0, 1.4)} strokeOpacity="0.9" />
        <m.path d={columns} {...draw(0.2)} />
        <m.path d={roof} {...draw(0.45)} />
        <m.path d={truss} {...draw(0.7)} strokeOpacity="0.55" />
        <m.path d={glazing} {...draw(0.9)} strokeOpacity="0.5" />
        <m.path d="M260 470 V760 M1240 470 V760" {...draw(0.3)} strokeWidth="1.5" />

        <m.path d="M300 540 H1200 M300 552 H1200 M640 552 H700 V566 H640 Z M670 566 V618 M670 618 c0 10 -12 12 -14 4" {...draw(1.1)} strokeOpacity="0.75" />

        <m.path d="M560 700 H860 V760 H560 Z M600 620 H760 V700 H600 Z M760 655 H800" {...draw(1.3)} />
        <m.circle cx="805" cy="655" r="45" {...draw(1.45)} />
        <m.circle cx="805" cy="655" r="8" {...draw(1.6)} />
        <m.path d="M340 660 H480 V760 H340 Z M356 676 H464 M356 692 H420 M440 700 h20 v20 h-20 z" {...draw(1.4)} strokeOpacity="0.7" />
        <m.path d="M920 690 H1120 V760 H920 Z M940 690 V660 H1000 V690 M1040 690 V640 H1100 V690" {...draw(1.55)} strokeOpacity="0.6" />

        <m.path
          d="M1350 760 L1380 420 M1470 760 L1440 420 M1362 620 L1458 520 M1458 620 L1362 520 M1356 690 L1464 620 M1464 690 L1356 620 M1330 420 H1490 V300 H1330 Z M1330 300 L1410 270 L1490 300 M1330 330 H1490"
          {...draw(1.2)}
        />

        <m.path d="M400 790 H700 V860 H400 Z M440 760 V790 M470 760 V790" {...draw(1.7)} strokeDasharray="6 6" strokeOpacity="0.6" />
      </g>

      <g stroke="currentColor" strokeOpacity="0.35" strokeDasharray="2 8">
        {AXES.map((x) => (
          <line key={x} x1={x} y1="262" x2={x} y2="380" />
        ))}
      </g>
      <g fill="currentColor" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="2">
        {AXES.map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="240" r="16" fill="none" stroke="currentColor" strokeOpacity="0.6" />
            <text x={x} y="245" textAnchor="middle" fillOpacity="0.8">
              {AXIS_LABELS[i]}
            </text>
          </g>
        ))}
        <path d="M150 760 l10 -10 h-20 z M150 390 l10 -10 h-20 z" fillOpacity="0.7" />
        <text x="172" y="755" fillOpacity="0.6">EL. ±0,00</text>
        <text x="172" y="385" fillOpacity="0.6">EL. +12,00</text>
        <text x="1500" y="290" fillOpacity="0.5">RES.</text>
      </g>
      <g stroke="currentColor" strokeOpacity="0.5">
        <path d="M260 330 H1240 M260 322 V338 M1240 322 V338" />
      </g>
      <text x="750" y="320" textAnchor="middle" fill="currentColor" fillOpacity="0.7" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="3">
        ESCOPO INTEGRADO
      </text>
    </svg>
  )
}
