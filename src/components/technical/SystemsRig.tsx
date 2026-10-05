import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'
import { rigAssets, rigStages, systemsCopy, SYSTEMS_FINAL, type RigAssetId, type RigStageId } from '../../data/systemsFlow'
import { useScrollProgress, useTweenedProgress } from '../../hooks/useScene'
import { gsap } from '../../lib/gsap'
import { beltPath, cumulative, headDistance, pointAt, switchOn, type Point } from '../../lib/systemsRig'

type Place = { x: number; y: number; s: number; flip?: boolean }
type Circle = { x: number; y: number; r: number }
type Box = { x: number; y: number; w: number; h: number }
type Label = { x: number; y: number; anchor?: 'start' | 'end'; leader?: [number, number, number] }

type Layout = {
  w: number
  h: number
  place: Record<'power-source' | 'panel' | 'drive' | 'motor' | 'coupling' | 'machine', Place>
  electric: Point[]
  electricNodes: number[]
  mechanic: Point[]
  pulleyA: Circle
  pulleyB: Circle
  shaft2: Box
  shaft3: Box
  guard: Box
  ground: [number, number, number] | null
  labels: Partial<Record<RigStageId, Label>>
  labelSize: [number, number]
  conversion: Box
  legend: [Point, Point]
  note: { x: number; y: number; anchor: 'start' | 'end' }
}

const WIDE: Layout = {
  w: 1400,
  h: 420,
  place: {
    'power-source': { x: 40, y: 70, s: 1 },
    panel: { x: 250, y: 150, s: 1 },
    drive: { x: 420, y: 205, s: 1 },
    motor: { x: 590, y: 205, s: 1 },
    coupling: { x: 830, y: 258, s: 1 },
    machine: { x: 1195, y: 140, s: 1 },
  },
  electric: [[108, 165], [175, 165], [175, 112], [300, 112], [300, 150], [300, 250], [420, 250], [500, 235], [560, 235], [560, 196], [690, 196], [690, 210]],
  electricNodes: [0, 4, 6, 11],
  mechanic: [[690, 374], [855, 374], [1012, 374], [1290, 374]],
  pulleyA: { x: 925, y: 280, r: 30 },
  pulleyB: { x: 1100, y: 280, r: 50 },
  shaft2: { x: 880, y: 273, w: 45, h: 14 },
  shaft3: { x: 1100, y: 273, w: 95, h: 14 },
  guard: { x: 885, y: 218, w: 275, h: 124 },
  ground: [20, 1385, 360],
  labels: {
    'power-source': { x: 96, y: 20, leader: [90, 46, 66] },
    panel: { x: 306, y: 20, leader: [300, 46, 146] },
    drive: { x: 466, y: 20, leader: [460, 46, 201] },
    motor: { x: 696, y: 20, leader: [690, 46, 192] },
    coupling: { x: 861, y: 20, leader: [855, 46, 258] },
    transmission: { x: 1018, y: 20, leader: [1012, 46, 214] },
    machine: { x: 1334, y: 20, anchor: 'end', leader: [1340, 46, 140] },
  },
  labelSize: [10, 15],
  conversion: { x: 590, y: 384, w: 210, h: 34 },
  legend: [[24, 404], [200, 404]],
  note: { x: 1385, y: 407, anchor: 'end' },
}

const TALL: Layout = {
  w: 360,
  h: 1040,
  place: {
    'power-source': { x: 20, y: 10, s: 0.55 },
    panel: { x: 110, y: 190, s: 0.62 },
    drive: { x: 120, y: 360, s: 0.8 },
    motor: { x: 30, y: 500, s: 0.7 },
    coupling: { x: 198, y: 537.1, s: 0.7 },
    machine: { x: 220, y: 728, s: 0.8, flip: true },
  },
  electric: [[57.4, 62], [90, 62], [90, 180], [141, 180], [141, 190], [141, 300], [95, 300], [95, 396], [120, 396], [184, 384], [205, 384], [205, 462], [100, 462], [100, 503]],
  electricNodes: [0, 4, 8, 13],
  mechanic: [[336, 540], [336, 575], [336, 720], [336, 850]],
  pulleyA: { x: 262, y: 552.5, r: 22 },
  pulleyB: { x: 262, y: 840, r: 34 },
  shaft2: { x: 233, y: 548, w: 29, h: 9 },
  shaft3: { x: 220, y: 835, w: 42, h: 10 },
  guard: { x: 226, y: 516, w: 76, h: 368 },
  ground: [20, 340, 904],
  labels: {
    'power-source': { x: 100, y: 40 },
    panel: { x: 184, y: 216 },
    drive: { x: 214, y: 404 },
    motor: { x: 108, y: 480 },
    coupling: { x: 240, y: 496 },
    transmission: { x: 20, y: 680 },
    machine: { x: 76, y: 930 },
  },
  labelSize: [9, 13],
  conversion: { x: 20, y: 620, w: 200, h: 38 },
  legend: [[20, 980], [20, 998]],
  note: { x: 20, y: 1020, anchor: 'start' },
}

const ON_AT: Record<RigStageId, number> = { 'power-source': 1, panel: 2, drive: 3, motor: 4, coupling: 5, transmission: 6, machine: 7 }
const toPoints = (pts: Point[]) => pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')
const placeTransform = (p: Place) => `translate(${p.x} ${p.y}) scale(${p.flip ? -p.s : p.s} ${p.s})`

function Asset({ id, w, h, children }: { id: RigAssetId; w: number; h: number; children: ReactNode }) {
  const asset = rigAssets[id]
  if (asset.image) return <image href={asset.image} x={0} y={0} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
  return <>{children}</>
}

function Stripes({ id, box, groupRef }: { id: string; box: Box; groupRef: RefObject<SVGGElement | null> }) {
  const { x, y, w, h } = box
  return (
    <>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} className="fill-paper stroke-current" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <g clipPath={`url(#${id})`}>
        <g ref={groupRef}>
          {Array.from({ length: Math.ceil(w / 8) + 4 }, (_, i) => (
            <path key={i} d={`M${x - 16 + i * 8} ${y + h} l${h * 0.6} ${-h}`} className="stroke-current" strokeWidth="1" strokeOpacity="0.5" vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </g>
    </>
  )
}

function Pulley({ c, spokes, groupRef, asset }: { c: Circle; spokes: number; groupRef: RefObject<SVGGElement | null>; asset: RigAssetId }) {
  const image = rigAssets[asset].image
  return (
    <g transform={`translate(${c.x} ${c.y})`}>
      <g ref={groupRef}>
        {image ? (
          <image href={image} x={-c.r} y={-c.r} width={c.r * 2} height={c.r * 2} />
        ) : (
          <>
            <circle r={c.r} className="fill-paper stroke-current" strokeWidth="1.25" />
            <circle r={c.r * 0.84} className="fill-none stroke-current" strokeWidth="0.75" strokeOpacity="0.55" />
            <circle r={c.r * 0.22} className="fill-none stroke-current" strokeWidth="1" />
            {Array.from({ length: spokes }, (_, i) => {
              const a = (i / spokes) * Math.PI * 2
              const r0 = c.r * 0.22
              const r1 = c.r * 0.84
              return <path key={i} d={`M${Math.cos(a) * r0} ${Math.sin(a) * r0} L${Math.cos(a) * r1} ${Math.sin(a) * r1}`} className="stroke-current" strokeWidth="1" />
            })}
          </>
        )}
      </g>
    </g>
  )
}

const LED = ({ cx, cy, r, blink = false }: { cx: number; cy: number; r: number; blink?: boolean }) => (
  <g>
    <circle cx={cx} cy={cy} r={r + 1} className="fill-paper stroke-current" strokeWidth="0.75" />
    <g className="rig-lit">
      <circle cx={cx} cy={cy} r={r} className={`fill-accent ${blink ? 'motion-safe:animate-[rig-blink_2.6s_ease-in-out_infinite]' : ''}`} />
    </g>
  </g>
)

type Refs = Record<'shaft' | 'hub' | 'hubRight' | 'hubStripes' | 'shaft2' | 'pulleyA' | 'pulleyB' | 'shaft3' | 'drum' | 'machineBody' | 'products', RefObject<SVGGElement | null>> & {
  belt: RefObject<SVGPathElement | null>
  conveyor: RefObject<SVGPathElement | null>
}

function useRigRefs(): Refs {
  return {
    shaft: useRef(null),
    hub: useRef(null),
    hubRight: useRef(null),
    hubStripes: useRef(null),
    shaft2: useRef(null),
    pulleyA: useRef(null),
    pulleyB: useRef(null),
    shaft3: useRef(null),
    drum: useRef(null),
    machineBody: useRef(null),
    products: useRef(null),
    belt: useRef(null),
    conveyor: useRef(null),
  }
}

type Props = { layout: 'wide' | 'tall'; stage?: number; className?: string }

export function SystemsRig({ layout: kind, stage = 0, className = '' }: Props) {
  const L = kind === 'wide' ? WIDE : TALL
  const reduced = useReducedMotion() ?? false
  const scrollDriven = kind === 'tall'
  const [scrollStage, setScrollStage] = useState(0)
  const shown = reduced ? SYSTEMS_FINAL : scrollDriven ? scrollStage : stage
  const wrapper = useRef<HTMLDivElement>(null)
  const eq = useRef(new Map<RigStageId, SVGGElement>())
  const electric = useRef<SVGPolylineElement>(null)
  const mechanic = useRef<SVGPolylineElement>(null)
  const pulseE = useRef<SVGGElement>(null)
  const pulseM = useRef<SVGGElement>(null)
  const parts = useRigRefs()
  const geo = useRef({ eCum: cumulative(L.electric), mCum: cumulative(L.mechanic) })
  const motion = useRef({ p: 0, target: { motor: 0, drive: 0, trans: 0, machine: 0 }, speed: { motor: 0, drive: 0, trans: 0, machine: 0 }, angle: 0, angle2: 0, angleB: 0, drum: 0, travel: 0, loop: 0, time: 0 })
  const ids = kind

  const render = useCallback(
    (p: number) => {
      const m = motion.current
      const { eCum, mCum } = geo.current
      const eLen = eCum[eCum.length - 1]
      const mLen = mCum[mCum.length - 1]
      m.p = p
      const on = Object.fromEntries(rigStages.map((s) => [s.id, switchOn(p, ON_AT[s.id])])) as Record<RigStageId, number>
      rigStages.forEach((s) => eq.current.get(s.id)?.style.setProperty('--on', on[s.id].toFixed(3)))
      const headE = headDistance(p, [1, 2, 3, 4], L.electricNodes.map((i) => eCum[i]))
      const headM = headDistance(p, [4, 5, 6, 7], mCum)
      electric.current?.style.setProperty('stroke-dashoffset', String(eLen - (p < 1 ? 0 : headE)))
      mechanic.current?.style.setProperty('stroke-dashoffset', String(mLen - (p < 4 ? 0 : headM)))
      m.target = { motor: on.motor, drive: on.motor * on.coupling, trans: on.motor * on.coupling * on.transmission, machine: on.motor * on.coupling * on.transmission * on.machine }
      parts.hubRight.current?.setAttribute('transform', `translate(${(8 * (1 - on.coupling)).toFixed(2)} 0)`)
      if (p < SYSTEMS_FINAL - 0.02) {
        const [ex, ey] = pointAt(L.electric, eCum, headE)
        const [mx, my] = pointAt(L.mechanic, mCum, headM)
        pulseE.current?.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)})`)
        pulseM.current?.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`)
        pulseE.current?.style.setProperty('opacity', p >= 1 && p < 4 ? '1' : '0')
        pulseM.current?.style.setProperty('opacity', p >= 4 && p < 7 ? '1' : '0')
      }
      if (reduced) {
        m.speed = { ...m.target }
      }
    },
    [L, reduced, parts.hubRight],
  )

  useTweenedProgress(scrollDriven ? null : shown, render, shown)

  const renderScroll = useCallback(
    (progress: number) => {
      const p = progress * SYSTEMS_FINAL
      render(p)
      const next = Math.min(SYSTEMS_FINAL, Math.floor(p + 0.02))
      setScrollStage((prev) => (prev === next ? prev : next))
    },
    [render],
  )
  useScrollProgress(wrapper, renderScroll, scrollDriven && !reduced)
  useEffect(() => {
    if (reduced) render(SYSTEMS_FINAL)
  }, [reduced, render])

  useEffect(() => {
    if (reduced) return
    const { pulleyA: A, pulleyB: B } = L
    const beltLen = 2 * Math.PI * B.r
    const tick = (_t: number, deltaMs: number) => {
      const m = motion.current
      const dt = Math.min(deltaMs, 50) / 1000
      m.time += dt
      const final = m.p >= SYSTEMS_FINAL - 0.02
      const cruise = final ? 0.55 : 1
      for (const k of ['motor', 'drive', 'trans', 'machine'] as const) m.speed[k] += (m.target[k] * cruise - m.speed[k]) * Math.min(1, dt * 1.1)
      m.angle = (m.angle + m.speed.motor * 400 * dt) % 360
      m.angle2 = (m.angle2 + m.speed.drive * 400 * dt) % 360
      m.angleB = (m.angleB + m.speed.trans * 400 * (A.r / B.r) * dt) % 360
      m.drum = (m.drum + m.speed.machine * 260 * dt) % 360
      m.travel = (m.travel + m.speed.machine * 42 * dt) % 162
      const slide = (a: number) => ((a / 360) * 24) % 8
      parts.shaft.current?.setAttribute('transform', `translate(${slide(m.angle).toFixed(2)} 0)`)
      parts.hub.current?.setAttribute('transform', `translate(${slide(m.angle).toFixed(2)} 0)`)
      parts.hubStripes.current?.setAttribute('transform', `translate(${slide(m.angle2).toFixed(2)} 0)`)
      parts.shaft2.current?.setAttribute('transform', `translate(${slide(m.angle2).toFixed(2)} 0)`)
      parts.pulleyA.current?.setAttribute('transform', `rotate(${((m.angleB * B.r) / A.r).toFixed(1)})`)
      parts.pulleyB.current?.setAttribute('transform', `rotate(${m.angleB.toFixed(1)})`)
      parts.shaft3.current?.setAttribute('transform', `translate(${slide(m.angleB).toFixed(2)} 0)`)
      parts.drum.current?.setAttribute('transform', `rotate(${m.drum.toFixed(1)})`)
      parts.belt.current?.style.setProperty('stroke-dashoffset', String((-(m.angleB / 360) * beltLen).toFixed(1)))
      parts.conveyor.current?.style.setProperty('stroke-dashoffset', String(-m.travel.toFixed(1)))
      parts.products.current?.querySelectorAll('rect').forEach((r, i) => r.setAttribute('transform', `translate(${(((i * 54 + m.travel) % 162) - i * 54).toFixed(1)} 0)`))
      const shake = Math.sin(m.time * 47) * 0.25 * m.speed.machine
      parts.machineBody.current?.setAttribute('transform', `translate(${shake.toFixed(2)} 0)`)
      if (final) {
        const { eCum, mCum } = geo.current
        m.loop += dt
        const [ex, ey] = pointAt(L.electric, eCum, (m.loop * 140) % eCum[eCum.length - 1])
        const [mx, my] = pointAt(L.mechanic, mCum, (m.loop * 110) % mCum[mCum.length - 1])
        pulseE.current?.setAttribute('transform', `translate(${ex.toFixed(1)} ${ey.toFixed(1)})`)
        pulseM.current?.setAttribute('transform', `translate(${mx.toFixed(1)} ${my.toFixed(1)})`)
        pulseE.current?.style.setProperty('opacity', '1')
        pulseM.current?.style.setProperty('opacity', '1')
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced, L, parts])

  const eqRef = (id: RigStageId) => (el: SVGGElement | null) => {
    if (el) eq.current.set(id, el)
    else eq.current.delete(id)
  }
  const eLen = geo.current.eCum[geo.current.eCum.length - 1]
  const mLen = geo.current.mCum[geo.current.mCum.length - 1]
  const [kick, name] = L.labelSize
  const P = L.place

  return (
    <div ref={wrapper} className={className}>
      <svg viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full" role="img" aria-label="Sistema industrial ligado em sequência: rede elétrica, painel, comando, motor, acoplamento, polias e correia e máquina">
        <defs>
          <filter id={`rig-glow-${ids}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {L.ground && (
          <g className="text-line-strong" fill="none">
            <path d={`M${L.ground[0]} ${L.ground[2]} H${L.ground[1]}`} className="stroke-current" strokeWidth="1" />
            {Array.from({ length: Math.floor((L.ground[1] - L.ground[0]) / 20) }, (_, i) => (
              <path key={i} d={`M${L.ground![0] + 6 + i * 20} ${L.ground![2] + 1} l-6 7`} className="stroke-current" strokeWidth="0.75" />
            ))}
          </g>
        )}

        <g id={`power-lines-${ids}`}>
          <polyline points={toPoints(L.electric)} fill="none" className="stroke-line-strong" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g id={`active-energy-${ids}`}>
          <polyline ref={electric} points={toPoints(L.electric)} fill="none" className="stroke-accent" strokeWidth="2.5" strokeLinejoin="round" strokeDasharray={eLen} strokeDashoffset={eLen} />
          <g ref={pulseE} style={{ opacity: 0 }}>
            <circle r="6" className="fill-accent" opacity="0.3" filter={`url(#rig-glow-${ids})`} />
            <circle r="3" className="fill-accent" />
          </g>
        </g>

        <g ref={eqRef('power-source')} className="rig-eq text-fg" transform={placeTransform(P['power-source'])}>
          <Asset id="power-source" w={100} h={290}>
            <path d="M-40 28 Q-10 38 20 16 M-40 38 Q-5 48 50 16 M-40 48 Q0 58 80 16" className="fill-none stroke-current" strokeWidth="0.75" strokeOpacity="0.55" />
            <path d="M50 0 V290 M15 18 H85 M44 26 L24 18 M56 26 L76 18" className="fill-none stroke-current" strokeWidth="1.5" />
            {[20, 50, 80].map((x) => (
              <circle key={x} cx={x} cy={14} r={3} className="fill-paper stroke-current" strokeWidth="1" />
            ))}
            <rect x={32} y={70} width={36} height={50} rx={3} className="fill-paper stroke-current" strokeWidth="1.25" />
            {[78, 86, 94, 102, 110].map((y) => (
              <path key={y} d={`M36 ${y} h28`} className="stroke-current" strokeWidth="0.6" strokeOpacity="0.55" />
            ))}
            <rect x={32} y={70} width={36} height={50} rx={3} className="rig-lit fill-accent/15" />
            <LED cx={60} cy={63} r={2.6} />
          </Asset>
        </g>

        <g ref={eqRef('panel')} className="rig-eq text-fg" transform={placeTransform(P.panel)}>
          <Asset id="panel" w={100} h={210}>
            <rect x={0} y={0} width={100} height={206} rx={2} className="fill-paper stroke-current" strokeWidth="1.5" />
            <path d="M50 4 V202 M42 90 V112 M58 90 V112" className="stroke-current" strokeWidth="1" />
            <rect x={10} y={14} width={32} height={60} className="fill-paper-2 stroke-current" strokeWidth="1" />
            <rect x={10} y={14} width={32} height={60} className="rig-lit fill-accent/15" />
            {[26, 40, 54].map((y) => (
              <path key={y} d={`M14 ${y} h24`} className="stroke-current" strokeWidth="0.75" strokeOpacity="0.55" />
            ))}
            <LED cx={68} cy={22} r={3} />
            <LED cx={82} cy={22} r={3} blink />
            <rect x={62} y={40} width={28} height={14} className="fill-none stroke-current" strokeWidth="0.75" />
            {[170, 178, 186, 194].map((y) => (
              <path key={y} d={`M10 ${y} h80`} className="stroke-current" strokeWidth="0.6" strokeOpacity="0.5" />
            ))}
            <path d="M4 206 V210 M96 206 V210" className="stroke-current" strokeWidth="1.5" />
          </Asset>
        </g>

        <g ref={eqRef('drive')} className="rig-eq text-fg" transform={placeTransform(P.drive)}>
          <Asset id="drive" w={80} h={95}>
            <rect x={0} y={0} width={80} height={95} rx={4} className="fill-paper stroke-current" strokeWidth="1.5" />
            <rect x={12} y={13} width={56} height={24} rx={2} className="fill-paper-2 stroke-current" strokeWidth="1" />
            <rect x={12} y={13} width={56} height={24} rx={2} className="rig-lit fill-blueprint/20" />
            <text x={40} y={29} textAnchor="middle" className="rig-lit fill-blueprint font-mono" fontSize="10" letterSpacing="1.5">
              RUN
            </text>
            {[20, 40, 60].map((x) => (
              <circle key={x} cx={x} cy={51} r={4} className="fill-none stroke-current" strokeWidth="1" />
            ))}
            {[69, 75, 81, 87].map((y) => (
              <path key={y} d={`M8 ${y} h64`} className="stroke-current" strokeWidth="0.6" strokeOpacity="0.5" />
            ))}
            <LED cx={72} cy={7} r={2.2} blink />
          </Asset>
        </g>

        <g ref={eqRef('motor')} className="rig-eq text-fg" transform={placeTransform(P.motor)}>
          <Asset id="motor-body" w={200} h={155}>
            <rect x={16} y={20} width={184} height={110} rx={6} className="fill-paper stroke-current" strokeWidth="1.5" />
            {Array.from({ length: 14 }, (_, i) => (
              <path key={i} d={`M${28 + i * 12} 24 V126`} className="stroke-current" strokeWidth="0.7" strokeOpacity="0.5" />
            ))}
            <rect x={0} y={33} width={18} height={84} rx={4} className="fill-paper stroke-current" strokeWidth="1.25" />
            <rect x={80} y={5} width={40} height={16} className="fill-paper stroke-current" strokeWidth="1.25" />
            <LED cx={112} cy={13} r={2.4} />
            <path d="M32 130 V143 H62 V130 M154 130 V143 H184 V130 M10 143 H200 V155 H10 Z" className="fill-none stroke-current" strokeWidth="1.25" />
            <rect x={16} y={20} width={184} height={110} rx={6} className="rig-lit fill-accent/[0.06]" />
          </Asset>
          {rigAssets['motor-shaft'].image ? (
            <g ref={parts.shaft}>
              <image href={rigAssets['motor-shaft'].image} x={200} y={67} width={40} height={16} />
            </g>
          ) : (
            <Stripes id={`rig-shaft-${ids}`} box={{ x: 200, y: 67, w: 40, h: 16 }} groupRef={parts.shaft} />
          )}
        </g>

        <g ref={eqRef('coupling')} className="rig-eq text-fg" transform={placeTransform(P.coupling)}>
          <Asset id="coupling" w={50} h={44}>
            <Stripes id={`rig-hub-${ids}`} box={{ x: 0, y: 4, w: 22, h: 36 }} groupRef={parts.hub} />
            <g ref={parts.hubRight}>
              <Stripes id={`rig-hub-r-${ids}`} box={{ x: 28, y: 4, w: 22, h: 36 }} groupRef={parts.hubStripes} />
            </g>
          </Asset>
        </g>

        <g ref={eqRef('transmission')} className="rig-eq text-fg">
          {rigAssets.transmission.image ? (
            <image href={rigAssets.transmission.image} x={L.guard.x} y={L.guard.y} width={L.guard.w} height={L.guard.h} preserveAspectRatio="xMidYMid meet" />
          ) : (
            <rect x={L.guard.x} y={L.guard.y} width={L.guard.w} height={L.guard.h} rx={8} className="fill-none stroke-current" strokeWidth="0.75" strokeDasharray="4 4" strokeOpacity="0.45" />
          )}
          <Stripes id={`rig-shaft2-${ids}`} box={L.shaft2} groupRef={parts.shaft2} />
          <path ref={parts.belt} d={beltPath(L.pulleyA, L.pulleyB)} className="fill-none stroke-current" strokeWidth="2.5" strokeDasharray="10 6" />
          <Pulley c={L.pulleyA} spokes={3} groupRef={parts.pulleyA} asset="pulley-left" />
          <Pulley c={L.pulleyB} spokes={5} groupRef={parts.pulleyB} asset="pulley-right" />
        </g>

        <g ref={eqRef('machine')} className="rig-eq text-fg">
          <Stripes id={`rig-shaft3-${ids}`} box={L.shaft3} groupRef={parts.shaft3} />
          <g transform={placeTransform(P.machine)}>
            <g ref={parts.machineBody}>
              <Asset id="machine" w={180} h={220}>
                <rect x={0} y={35} width={180} height={165} rx={4} className="fill-paper stroke-current" strokeWidth="1.5" />
                <rect x={5} y={20} width={170} height={12} rx={6} className="fill-paper stroke-current" strokeWidth="1.25" />
                <path ref={parts.conveyor} d="M11 18 H169" className="stroke-current" strokeWidth="1.5" strokeDasharray="6 6" />
                <g ref={parts.products}>
                  {[11, 65, 119].map((x) => (
                    <rect key={x} x={x} y={4} width={16} height={12} className="fill-paper stroke-current" strokeWidth="1" />
                  ))}
                </g>
                <circle cx={95} cy={118} r={34} className="fill-paper-2 stroke-current" strokeWidth="1" />
                <g transform="translate(95 118)">
                  <g ref={parts.drum}>
                    <circle r={8} className="fill-paper stroke-current" strokeWidth="1" />
                    {[0, 90, 180, 270].map((a) => (
                      <path key={a} d="M0 -8 V-30" transform={`rotate(${a})`} className="stroke-current" strokeWidth="1.25" />
                    ))}
                  </g>
                </g>
                <rect x={15} y={152} width={44} height={34} className="fill-none stroke-current" strokeWidth="1" />
                <rect x={21} y={158} width={32} height={10} className="rig-lit fill-blueprint/25" />
                <LED cx={161} cy={52} r={4} />
                <path d="M8 200 V220 M172 200 V220" className="stroke-current" strokeWidth="1.5" />
              </Asset>
            </g>
          </g>
        </g>

        <g id={`mechanical-flow-${ids}`} fill="none">
          <polyline points={toPoints(L.mechanic)} className="stroke-line-strong" strokeWidth="1.5" strokeDasharray="1 4" strokeLinecap="round" />
          <polyline ref={mechanic} points={toPoints(L.mechanic)} className="stroke-blueprint" strokeWidth="2" strokeDasharray={mLen} strokeDashoffset={mLen} />
          {L.mechanic.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x - 3} y={y - 3} width={6} height={6} className="fill-paper-2 stroke-blueprint" strokeWidth="1" />
          ))}
          <g ref={pulseM} style={{ opacity: 0 }}>
            <circle r="5" className="fill-blueprint" opacity="0.3" filter={`url(#rig-glow-${ids})`} />
            <circle r="2.6" className="fill-blueprint" />
          </g>
        </g>

        <g id={`labels-${ids}`}>
          {rigStages.map((s) => {
            const l = L.labels[s.id]
            if (!l) return null
            const active = shown === ON_AT[s.id]
            const lit = shown >= ON_AT[s.id]
            return (
              <g key={s.id} className={`transition-opacity duration-500 ${lit ? 'opacity-100' : 'opacity-45'}`}>
                {l.leader && (
                  <>
                    <path d={`M${l.leader[0]} ${l.leader[1]} V${l.leader[2]}`} className={active ? 'stroke-accent' : 'stroke-line-strong'} strokeWidth="1" strokeDasharray="2 3" fill="none" />
                    <circle cx={l.leader[0]} cy={l.leader[1]} r={2} className={active ? 'fill-accent' : 'fill-line-strong'} />
                  </>
                )}
                <text x={l.x} y={l.y} textAnchor={l.anchor ?? 'start'} className={`font-mono ${active ? 'fill-accent-ink' : 'fill-faint'}`} fontSize={kick} letterSpacing="1.3">
                  {s.number} · {s.kicker.toUpperCase()}
                </text>
                <text x={l.x} y={l.y + name + 4} textAnchor={l.anchor ?? 'start'} className="fill-fg font-display font-bold" fontSize={name} style={{ fontStretch: '85%' }}>
                  {s.name}
                </text>
              </g>
            )
          })}

          <g className={`transition-opacity duration-700 ${shown >= ON_AT.motor ? 'opacity-100' : 'opacity-30'}`}>
            <rect x={L.conversion.x} y={L.conversion.y} width={L.conversion.w} height={L.conversion.h} className="fill-paper stroke-line" strokeWidth="1" />
            <path d={`M${L.conversion.x} ${L.conversion.y} V${L.conversion.y + L.conversion.h}`} className="stroke-accent" strokeWidth="2" />
            <text x={L.conversion.x + 10} y={L.conversion.y + 13} className="fill-fg font-mono" fontSize="8.5" letterSpacing="1.3">
              {systemsCopy.conversion.label.toUpperCase()}
            </text>
            <text x={L.conversion.x + 10} y={L.conversion.y + L.conversion.h - 8} fontSize="11">
              <tspan className="fill-accent-ink">{systemsCopy.conversion.from}</tspan>
              <tspan className="fill-faint"> → </tspan>
              <tspan className="fill-blueprint">{systemsCopy.conversion.to}</tspan>
            </text>
          </g>

          <g fontSize="8.5" className="font-mono" letterSpacing="1">
            <path d={`M${L.legend[0][0]} ${L.legend[0][1]} h16`} className="stroke-accent" strokeWidth="2.5" />
            <text x={L.legend[0][0] + 22} y={L.legend[0][1] + 3} className="fill-muted">
              {systemsCopy.legend.electric.toUpperCase()}
            </text>
            <path d={`M${L.legend[1][0]} ${L.legend[1][1]} h16`} className="stroke-blueprint" strokeWidth="2" />
            <text x={L.legend[1][0] + 22} y={L.legend[1][1] + 3} className="fill-muted">
              {systemsCopy.legend.mechanic.toUpperCase()}
            </text>
            {Object.values(rigAssets).some((a) => !a.image) && (
              <text x={L.note.x} y={L.note.y} textAnchor={L.note.anchor} className="fill-faint" fontSize="7.5">
                {kind === 'wide'
                  ? systemsCopy.placeholderNote
                  : systemsCopy.placeholderNote.split(' · ').map((part, i) => (
                      <tspan key={part} x={L.note.x} dy={i === 0 ? 0 : 11}>
                        {part}
                      </tspan>
                    ))}
              </text>
            )}
          </g>
        </g>
      </svg>
    </div>
  )
}
