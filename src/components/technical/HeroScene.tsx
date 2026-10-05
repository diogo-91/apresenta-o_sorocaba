import { m } from 'framer-motion'

const MARKERS = [
  { left: '58%', top: '30%' },
  { left: '88%', top: '62%' },
  { left: '71%', top: '84%' },
]

const TICKS = Array.from({ length: 13 }, (_, i) => i)

export function HeroScene() {
  return (
    <div className="grain absolute inset-0 overflow-hidden bg-[#07090b]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgb(150_170_190/0.07),transparent_60%)]" />
      <div className="blueprint-grid absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_70%_45%,black_10%,transparent_65%)]" />
    </div>
  )
}

export function HeroMarks() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <m.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.2 }}>
        <div className="absolute left-[54%] right-0 top-[132px] flex items-start max-lg:hidden">
          <div className="relative h-2 flex-1 border-t border-[#f1f3f4]/15">
            {TICKS.map((i) => (
              <span key={i} className="absolute top-0 h-1.5 w-px bg-[#f1f3f4]/20" style={{ left: `${(i / (TICKS.length - 1)) * 100}%` }} />
            ))}
            <span className="label-mono absolute left-0 top-3 text-[0.5625rem] text-[#f1f3f4]/35">X 0,00</span>
            <span className="label-mono absolute right-24 top-3 text-[0.5625rem] text-[#f1f3f4]/35">X 12,00 m</span>
          </div>
        </div>

        {MARKERS.map((mk) => (
          <span key={mk.left} className="absolute size-3 -translate-x-1/2 -translate-y-1/2 max-lg:hidden" style={mk}>
            <span className="absolute inset-x-0 top-1/2 h-px bg-[#f1f3f4]/25" />
            <span className="absolute inset-y-0 left-1/2 w-px bg-[#f1f3f4]/25" />
          </span>
        ))}

        <p className="label-mono absolute right-24 top-[178px] text-right text-[0.625rem] leading-relaxed text-[#f1f3f4]/40 max-lg:hidden">
          EL. +2,20
          <br />
          <span className="text-[#f1f3f4]/25">Nó estrutural · eixo C</span>
        </p>
        <p className="label-mono absolute bottom-[104px] right-24 flex items-center gap-2 text-[0.625rem] text-[#f1f3f4]/45 max-lg:bottom-6 max-lg:right-5">
          <span className="size-1.5 bg-accent motion-safe:animate-pulse" /> Operação contínua
        </p>
      </m.div>
    </div>
  )
}
