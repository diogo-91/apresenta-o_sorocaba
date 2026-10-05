import { useCallback, useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { heavyAsset, heavyCopy, HEAVY_FINAL } from '../../data/heavyMove'
import { useTweenedProgress } from '../../hooks/useScene'
import { gsap } from '../../lib/gsap'
import { machinePose, ramp } from '../../lib/heavyMove'

type Layout = {
  w: number
  h: number
  floor: number
  a: number
  b: number
  s: number
  lift: number
  runway: number
  routeY: number
  labelY: number
  font: number
  notes: boolean
}

const WIDE: Layout = { w: 1400, h: 430, floor: 372, a: 330, b: 1070, s: 1.1, lift: 40, runway: 22, routeY: 392, labelY: 416, font: 10, notes: true }
const COMPACT: Layout = { w: 360, h: 280, floor: 214, a: 92, b: 268, s: 0.42, lift: 20, runway: 12, routeY: 228, labelY: 250, font: 8, notes: false }

const MW = 260
const MH = 180
const EYE = 90
const PARKED = 92

const set = (el: Element | null | undefined, attr: string, value: string) => el?.setAttribute(attr, value)
const fade = (el: Element | null | undefined, v: number) => (el as SVGElement | null)?.style.setProperty('opacity', v.toFixed(3))

function Machine() {
  if (heavyAsset.image) return <image href={heavyAsset.image} x={0} y={0} width={MW} height={MH} preserveAspectRatio="xMidYMax meet" />
  return (
    <g className="text-fg" fill="none">
      <rect x={70} y={8} width={70} height={36} rx={3} className="fill-paper stroke-current" strokeWidth="1.5" />
      <path d="M86 8 V0 H124 V8" className="stroke-current" strokeWidth="1.25" />
      <rect x={8} y={40} width={244} height={126} rx={6} className="fill-paper stroke-current" strokeWidth="1.75" />
      <rect x={32} y={58} width={118} height={78} rx={3} className="fill-paper-2 stroke-current" strokeWidth="1.25" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${44 + i * 18} 62 l-14 70`} className="stroke-current" strokeWidth="0.6" strokeOpacity="0.35" />
      ))}
      <path d="M92 136 V150 M78 150 H106" className="stroke-current" strokeWidth="1" />
      <rect x={176} y={56} width={58} height={70} rx={3} className="fill-paper stroke-current" strokeWidth="1.25" />
      <rect x={184} y={64} width={42} height={24} rx={2} className="fill-paper-2 stroke-current" strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={192 + i * 13} cy={102} r={3.5} className="stroke-current" strokeWidth="1" />
      ))}
      <circle cx={222} cy={116} r={4} className="fill-accent stroke-none" />
      <path d="M8 150 H252" className="stroke-current" strokeWidth="0.75" strokeOpacity="0.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${14 + i * 20} 166 l10 -8`} className="stroke-accent" strokeWidth="2" strokeOpacity="0.55" />
      ))}
      <path d="M0 166 H260 V174 H0 Z" className="fill-paper stroke-current" strokeWidth="1.5" />
      {[14, 120, 232].map((x) => (
        <path key={x} d={`M${x} 174 v6 h14 v-6`} className="stroke-current" strokeWidth="1.25" />
      ))}
      {[EYE * -1 + 130, EYE + 130].map((x) => (
        <circle key={x} cx={x} cy={34} r={5} className="fill-paper stroke-current" strokeWidth="1.5" />
      ))}
    </g>
  )
}

type Props = { stage: number; compact?: boolean; className?: string }

export function HeavyMoveRig({ stage, compact = false, className = '' }: Props) {
  const L = compact ? COMPACT : WIDE
  const reduced = useReducedMotion() ?? false
  const shown = reduced ? (stage >= 1 ? HEAVY_FINAL : 0) : stage
  const els = useRef(new Map<string, SVGElement>())
  const r = (key: string) => (el: SVGElement | null) => {
    if (el) els.current.set(key, el)
    else els.current.delete(key)
  }
  const g = (key: string) => els.current.get(key)
  const live = useRef({ p: 0, t: 0 })
  const routeLen = L.b - L.a

  const draw = useCallback(
    (p: number, sway: number) => {
      const s = L.s
      const { travel, lift } = machinePose(p)
      const cx = L.a + routeLen * travel
      const top = L.floor - MH * s - L.lift * lift
      const rigged = ramp(p, 1, 1.5) - ramp(p, 5, 5.5)
      const hookRest = top - 72 * s
      const parked = L.runway + PARKED * s * 0.5
      const hookY = parked + (hookRest - parked) * rigged
      const spreaderY = hookY + 14 * s
      const tension = ramp(p, 1.5, 2) * (1 - ramp(p, 5, 5.3))
      const slack = (1 - tension) * 14 * s
      const angle = sway

      set(g('machine'), 'transform', `rotate(${angle.toFixed(3)} ${cx} ${hookY}) translate(${(cx - (MW * s) / 2).toFixed(2)} ${top.toFixed(2)}) scale(${s})`)
      set(g('trolley'), 'transform', `translate(${cx.toFixed(2)} 0)`)
      set(g('cable'), 'd', `M${cx} ${L.runway + 22 * s} V${hookY - 12 * s}`)
      set(g('hook'), 'transform', `translate(${cx.toFixed(2)} ${hookY.toFixed(2)}) scale(${s})`)
      const spread = g('spreader')
      set(spread, 'transform', `rotate(${(rigged > 0.99 ? angle : 0).toFixed(3)} ${cx} ${hookY}) translate(${cx.toFixed(2)} ${spreaderY.toFixed(2)}) scale(${s})`)
      fade(spread, rigged)
      const eyeY = top + 34 * s
      const legs = [-1, 1].map((d) => {
        const ex = cx + d * EYE * s
        return `M${ex} ${spreaderY + 6 * s} Q${ex + d * slack} ${(spreaderY + eyeY) / 2} ${ex} ${eyeY}`
      })
      set(g('slings'), 'd', legs.join(' '))
      set(g('slings'), 'transform', `rotate(${angle.toFixed(3)} ${cx} ${hookY})`)
      fade(g('slings'), ramp(p, 1.2, 1.6) * (1 - ramp(p, 5.2, 5.6)))

      fade(g('planning'), ramp(p, 0.3, 0.9) * (1 - ramp(p, 4.6, 5)))
      set(g('planning'), 'transform', `rotate(${angle.toFixed(3)} ${cx} ${hookY}) translate(${(cx - (MW * s) / 2).toFixed(2)} ${top.toFixed(2)}) scale(${s})`)
      fade(g('destination'), ramp(p, 0.3, 0.9) * (1 - ramp(p, 4, 4.4)))
      fade(g('routeNote'), ramp(p, 0.3, 0.9) * (1 - ramp(p, 6, 6.4)))

      const done = Math.min(1, travel)
      set(g('routeActive'), 'stroke-dashoffset', String((routeLen * (1 - done)).toFixed(1)))
      fade(g('arrow'), ramp(p, 6, 6.6))

      fade(g('reference'), ramp(p, 2, 2.3) * (1 - ramp(p, 4.4, 4.8)))
      set(g('reference'), 'transform', `translate(${(cx - (MW * s) / 2 - 22 * s).toFixed(2)} 0)`)
      set(g('refBar'), 'd', `M0 ${L.floor} V${(top + MH * s).toFixed(2)}`)

      fade(g('alignment'), ramp(p, 4, 4.4) * (1 - ramp(p, 6.2, 6.8)))
      fade(g('base'), ramp(p, 5.1, 5.5))
      fade(g('bolts'), ramp(p, 5.3, 5.7))
      fade(g('level'), ramp(p, 5.5, 5.9))
      const conn = ramp(p, 5.5, 6)
      const c = g('connection') as SVGPathElement | undefined
      if (c) c.style.strokeDashoffset = String(200 * (1 - conn))
      fade(g('status'), ramp(p, 5.8, 6.1))
    },
    [L, routeLen],
  )

  const render = useCallback(
    (p: number) => {
      live.current.p = p
      draw(p, 0)
    },
    [draw],
  )
  useTweenedProgress(shown, render, shown)

  useEffect(() => {
    if (reduced) return
    const tick = (_t: number, deltaMs: number) => {
      const m = live.current
      m.t += Math.min(deltaMs, 50) / 1000
      const { lift } = machinePose(m.p)
      if (lift < 0.01) return
      const moving = ramp(m.p, 3, 3.2) * (1 - ramp(m.p, 3.8, 4))
      draw(m.p, Math.sin(m.t * 1.7) * (0.12 + 0.28 * moving) * lift)
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced, draw])

  const s = L.s
  const { a, b, floor, w, h, font } = L

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} role="img" aria-label="Uma máquina sendo içada por ponte rolante, deslocada do ponto A ao ponto B, posicionada e instalada">
      <g className="text-line-strong" fill="none">
        <rect x={40 * s + 20} y={L.runway} width={w - 80 * s - 40} height={10 * s + 2} className="fill-paper stroke-current" strokeWidth="1" />
        {[40 * s + 20, w - 40 * s - 20].map((x) => (
          <path key={x} d={`M${x} ${L.runway + 10 * s + 2} V${floor} M${x + 8 * s} ${L.runway + 10 * s + 2} V${floor}`} className="stroke-current" strokeWidth="1" />
        ))}
        <path d={`M10 ${floor} H${w - 10}`} className="stroke-current" strokeWidth="1" />
        {Array.from({ length: Math.floor((w - 20) / 18) }, (_, i) => (
          <path key={i} d={`M${16 + i * 18} ${floor + 1} l-6 7`} className="stroke-current" strokeWidth="0.75" />
        ))}
      </g>

      <g ref={r('destination')} style={{ opacity: 0 }} fill="none">
        <rect x={b - (MW / 2 + 10) * s} y={floor - (MH + 6) * s} width={(MW + 20) * s} height={(MH + 6) * s} className="stroke-blueprint" strokeWidth="1" strokeDasharray="5 4" />
        {L.notes && (
          <text x={b} y={floor - (MH + 14) * s} textAnchor="middle" className="fill-blueprint font-mono" fontSize={font - 1} letterSpacing="1.2">
            {heavyCopy.destination.toUpperCase()}
          </text>
        )}
      </g>

      <g ref={r('alignment')} style={{ opacity: 0 }} fill="none" className="text-accent">
        <path d={`M${b} ${floor - (MH + 30) * s} V${floor + 12}`} className="stroke-current" strokeWidth="1" strokeDasharray="6 4" />
        <path d={`M${b - (MW / 2 + 30) * s} ${floor - 3} H${b + (MW / 2 + 30) * s}`} className="stroke-current" strokeWidth="1" />
        {[-1, 1].map((d) => (
          <path key={d} d={`M${b + d * (MW / 2) * s} ${floor - 16 * s} V${floor} H${b + d * (MW / 2 - 18) * s}`} className="stroke-current" strokeWidth="2" />
        ))}
      </g>

      <rect ref={r('base')} x={b - (MW / 2 + 6) * s} y={floor - 1} width={(MW + 12) * s} height={7 * s + 2} className="fill-paper-2 stroke-fg" strokeWidth="1" style={{ opacity: 0 }} />

      <g fill="none">
        <path d={`M${a} ${L.routeY} H${b}`} className="stroke-line-strong" strokeWidth="1.5" strokeDasharray="2 5" strokeLinecap="round" />
        <path ref={r('routeActive')} d={`M${a} ${L.routeY} H${b}`} className="stroke-accent" strokeWidth="2" strokeDasharray={routeLen} strokeDashoffset={routeLen} />
        <path ref={r('arrow')} d={`M${b - 10} ${L.routeY - 6} L${b} ${L.routeY} L${b - 10} ${L.routeY + 6}`} className="stroke-accent" strokeWidth="2" style={{ opacity: 0 }} />
        {[a, b].map((x) => (
          <path key={x} d={`M${x - 5} ${L.routeY - 10} L${x} ${L.routeY - 3} L${x + 5} ${L.routeY - 10}`} className="stroke-fg" strokeWidth="1" />
        ))}
      </g>
      <text x={a} y={L.labelY} textAnchor="middle" className="fill-fg font-mono" fontSize={font} letterSpacing="1.6">
        {heavyCopy.pointA.toUpperCase()}
      </text>
      <text x={b} y={L.labelY} textAnchor="middle" className="fill-fg font-mono" fontSize={font} letterSpacing="1.6">
        {heavyCopy.pointB.toUpperCase()}
      </text>
      <g ref={r('routeNote')} style={{ opacity: 0 }}>
        <rect x={(a + b) / 2 - 64 * (font / 10)} y={L.routeY - 7 * (font / 10)} width={128 * (font / 10)} height={14 * (font / 10)} className="fill-paper" />
        <text x={(a + b) / 2} y={L.routeY + 3 * (font / 10)} textAnchor="middle" className="fill-muted font-mono" fontSize={font - 1} letterSpacing="1">
          {heavyCopy.route}
        </text>
      </g>

      <g ref={r('trolley')}>
        <rect x={-22 * s - 4} y={L.runway + 10 * s + 2} width={44 * s + 8} height={12 * s + 2} rx={2} className="fill-paper stroke-fg" strokeWidth="1.25" />
        {[-14, 14].map((x) => (
          <circle key={x} cx={x * s} cy={L.runway + 6 * s} r={4 * s + 1} className="fill-paper stroke-fg" strokeWidth="1" />
        ))}
      </g>
      <path ref={r('cable')} className="stroke-fg" strokeWidth="1.25" fill="none" />
      <g ref={r('hook')} className="text-fg" fill="none">
        <rect x={-12} y={-14} width={24} height={16} rx={3} className="fill-paper stroke-current" strokeWidth="1.5" />
        <path d="M0 2 V10 Q0 18 -7 16" className="stroke-current" strokeWidth="2" />
      </g>
      <g ref={r('spreader')} className="text-fg" style={{ opacity: 0 }} fill="none">
        <path d="M-12 -12 L-92 0 M12 -12 L92 0" className="stroke-current" strokeWidth="1.25" />
        <rect x={-100} y={0} width={200} height={8} className="fill-paper stroke-current" strokeWidth="1.5" />
      </g>
      <path ref={r('slings')} className="stroke-accent" strokeWidth={compact ? 1.5 : 2.5} fill="none" style={{ opacity: 0 }} strokeLinecap="round" />

      <g ref={r('reference')} style={{ opacity: 0 }} className="text-blueprint" fill="none">
        <path ref={r('refBar')} className="stroke-current" strokeWidth="1.5" />
        {L.notes && (
          <text x={-8} y={floor - (MH + 8) * s - L.lift} textAnchor="end" className="fill-blueprint font-mono" fontSize={font - 1} letterSpacing="1.2">
            {heavyCopy.hoist.toUpperCase()}
          </text>
        )}
      </g>

      <g ref={r('machine')}>
        <Machine />
        <g ref={r('level')} style={{ opacity: 0 }}>
          <rect x={102} y={-20} width={56} height={10} rx={5} className="fill-paper stroke-blueprint" strokeWidth="1.25" />
          <circle cx={130} cy={-15} r={3} className="fill-blueprint" />
        </g>
      </g>

      <g ref={r('planning')} style={{ opacity: 0 }} fill="none">
        <circle cx={130} cy={104} r={10} className="fill-paper stroke-blueprint" strokeWidth="1.5" />
        <path d="M130 94 A10 10 0 0 1 140 104 L130 104 Z M130 114 A10 10 0 0 1 120 104 L130 104 Z" className="fill-blueprint" />
        {[130 - EYE, 130 + EYE].map((x) => (
          <circle key={x} cx={x} cy={34} r={11} className="stroke-accent" strokeWidth="1.5" strokeDasharray="3 3" />
        ))}
        {L.notes && (
          <>
            <path d="M140 104 H300" className="stroke-blueprint" strokeWidth="1" strokeDasharray="3 3" />
            <text x={306} y={100} className="fill-blueprint font-mono" fontSize={10} letterSpacing="1.2">
              {heavyCopy.cg.toUpperCase()}
            </text>
            <text x={306} y={116} className="fill-muted font-mono" fontSize={10} letterSpacing="1">
              {heavyCopy.weight}
            </text>
            <text x={130 - EYE - 18} y={30} textAnchor="end" className="fill-accent-ink font-mono" fontSize={10} letterSpacing="1.2">
              {heavyCopy.lifting.toUpperCase()}
            </text>
          </>
        )}
      </g>

      <g ref={r('bolts')} style={{ opacity: 0 }} className="text-fg" fill="none">
        {[-1, 0, 1].map((d) => (
          <path key={d} d={`M${b + d * 106 * s} ${floor + 1} v${6 * s + 1} M${b + d * 106 * s - 5 * s} ${floor} h${10 * s}`} className="stroke-current" strokeWidth="2" />
        ))}
      </g>
      <path
        ref={r('connection')}
        d={`M${b + (MW / 2 + 70) * s} ${floor} V${floor - 36 * s} Q${b + (MW / 2 + 70) * s} ${floor - 56 * s} ${b + (MW / 2 + 40) * s} ${floor - 56 * s} H${b + (MW / 2 - 2) * s}`}
        className="stroke-fg"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="200"
        strokeDashoffset="200"
      />
      <rect x={b + (MW / 2 + 62) * s} y={floor - 6 * s} width={16 * s} height={6 * s} className="fill-paper stroke-fg" strokeWidth="1" />

      <g ref={r('status')} style={{ opacity: 0 }}>
        <circle cx={b - (MW / 2) * s} cy={floor - (MH + 18) * s - 4} r={compact ? 2.5 : 4} className="fill-accent" />
        <text x={b - (MW / 2) * s + (compact ? 6 : 10)} y={floor - (MH + 18) * s} className="fill-fg font-mono" fontSize={font} letterSpacing="1.6">
          {heavyCopy.installed.toUpperCase()}
        </text>
      </g>

      {L.notes && !heavyAsset.image && (
        <text x={20} y={h - 4} className="fill-faint font-mono" fontSize="7.5">
          {heavyCopy.placeholderNote}
        </text>
      )}
    </svg>
  )
}
