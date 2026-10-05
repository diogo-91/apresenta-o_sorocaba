import { useEffect, useRef } from 'react'
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { BlueprintPlant } from './BlueprintPlant'

const FLOW_LINES = [
  { d: 'M-50 210 H1700', delay: 0 },
  { d: 'M-50 640 L600 640 L700 540 H1700', delay: 1.2 },
  { d: 'M1180 -20 V940', delay: 2.4 },
  { d: 'M-50 820 H1700', delay: 0.6 },
]

function useParallax() {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 40, damping: 18 })
  const sy = useSpring(y, { stiffness: 40, damping: 18 })

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX / window.innerWidth - 0.5)
      y.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, x, y])

  return { sx, sy }
}

function Readout() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return
      const x = ((e.clientX / window.innerWidth) * 1600).toFixed(1).padStart(6, '0')
      const y = ((e.clientY / window.innerHeight) * 900).toFixed(1).padStart(6, '0')
      ref.current.textContent = `X ${x} · Y ${y}`
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return <span ref={ref}>X 0800.0 · Y 0450.0</span>
}

export function HeroScene() {
  const { sx, sy } = useParallax()
  const farX = useTransform(sx, (v) => v * -14)
  const farY = useTransform(sy, (v) => v * -10)
  const midX = useTransform(sx, (v) => v * -26)
  const midY = useTransform(sy, (v) => v * -16)
  const nearX = useTransform(sx, (v) => v * -60)
  const nearY = useTransform(sy, (v) => v * -36)

  return (
    <div className="grain absolute inset-0 overflow-hidden bg-[#080b0e]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgb(79_163_217/0.16),transparent_55%),radial-gradient(ellipse_at_8%_100%,rgb(255_90_31/0.08),transparent_45%)]" />

      <m.div className="absolute -inset-[8%]" style={{ x: farX, y: farY }}>
        <div className="size-full motion-safe:animate-[drift_48s_ease-in-out_infinite_alternate]">
          <BlueprintPlant className="size-full scale-[1.35] text-[#5fb0e6] opacity-[0.14] blur-[3px]" />
        </div>
      </m.div>

      <m.div
        className="blueprint-grid absolute -inset-[4%] opacity-60 [mask-image:radial-gradient(ellipse_at_60%_45%,black_20%,transparent_75%)]"
        style={{ x: farX, y: farY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.6 }}
      />

      <m.div className="absolute -inset-[4%]" style={{ x: midX, y: midY }}>
        <div className="size-full motion-safe:animate-[kenburns_36s_ease-in-out_infinite_alternate]">
          <BlueprintPlant className="size-full text-[#5fb0e6] opacity-55" />
        </div>
      </m.div>

      <svg className="absolute inset-0 size-full" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {FLOW_LINES.map((line) => (
          <path
            key={line.d}
            d={line.d}
            stroke="#5fb0e6"
            strokeOpacity="0.35"
            strokeDasharray="2 14"
            className="motion-safe:animate-[flow_6s_linear_infinite]"
            style={{ animationDelay: `${line.delay}s` }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 motion-safe:animate-[scanline_14s_linear_infinite]">
        <div className="h-px bg-gradient-to-r from-transparent via-[#5fb0e6]/60 to-transparent" />
      </div>

      <m.p
        className="pointer-events-none absolute -right-[4%] top-[6%] select-none font-display text-[40rem] font-bold leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(241_243_244/0.07)]"
        style={{ x: midX, y: midY }}
      >
        01
      </m.p>

      <m.div className="absolute -bottom-[12%] -right-[6%] h-[70%] w-[46%] blur-[2px]" style={{ x: nearX, y: nearY }}>
        <svg viewBox="0 0 600 600" className="size-full" fill="none">
          <g stroke="#f1f3f4" strokeOpacity="0.16" strokeWidth="3">
            <path d="M0 120 H600 M0 170 H600 M0 120 L60 170 L120 120 L180 170 L240 120 L300 170 L360 120 L420 170 L480 120 L540 170 L600 120" />
            <path d="M80 170 V600 M380 170 V600 M80 300 H380 M80 300 L380 600 M380 300 L80 600" strokeOpacity="0.1" />
          </g>
        </svg>
      </m.div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgb(0_0_0/0.6)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080b0e] via-[#080b0e]/40 to-transparent" />

      <m.div
        className="label-mono absolute right-24 top-[118px] flex flex-col items-end gap-1 text-[#f1f3f4]/45 max-lg:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <Readout />
        <span>Corte A-A · Esc. 1:200</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 bg-accent motion-safe:animate-pulse" /> Operação contínua
        </span>
      </m.div>
    </div>
  )
}
