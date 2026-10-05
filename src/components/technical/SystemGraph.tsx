import { m } from 'framer-motion'
import { clientNode, coreNode, GRAPH_SIZE, graphNodes, interfaceCount, ringPosition, supplierPairs, type Point } from '../../data/graph'
import { DURATION, EASE_MECH } from '../../lib/motion'

export type GraphState = 'fragmented' | 'unified'

const transition = { duration: DURATION.structural, ease: EASE_MECH }

const positioned = graphNodes.map((node, i) => ({
  ...node,
  unified: ringPosition(i, graphNodes.length),
  contract: `CT-${String(i + 1).padStart(2, '0')}`,
}))

const pairs = supplierPairs(positioned)

function readouts(state: GraphState) {
  const n = graphNodes.length
  return state === 'fragmented'
    ? [
        { label: 'Fornecedores', value: n },
        { label: 'Contratos', value: n },
        { label: 'Responsáveis', value: n },
        { label: 'Interfaces', value: interfaceCount(n) },
      ]
    : [
        { label: 'Parceiro', value: 1 },
        { label: 'Contrato', value: 1 },
        { label: 'Responsável', value: 1 },
        { label: 'Interface', value: 1 },
      ]
}

function labelPlacement(ringX: number, unified: boolean) {
  if (!unified) return { x: 0, y: 30, textAnchor: 'middle' as const }
  const offset = ringX - coreNode.position.x
  if (Math.abs(offset) < 30) return { x: 0, y: -16, textAnchor: 'middle' as const }
  return { x: offset > 0 ? 16 : -16, y: 6, textAnchor: offset > 0 ? ('start' as const) : ('end' as const) }
}

function Line({ from, to, opacity, className, dash }: { from: Point; to: Point; opacity: number; className: string; dash?: string }) {
  return (
    <m.line
      initial={false}
      animate={{ x1: from.x, y1: from.y, x2: to.x, y2: to.y, opacity }}
      transition={transition}
      className={className}
      stroke="currentColor"
      strokeDasharray={dash}
    />
  )
}

export function SystemGraph({ state, className = '' }: { state: GraphState; className?: string }) {
  const unified = state === 'unified'
  const client = unified ? clientNode.unified : clientNode.fragmented
  const core = coreNode.position
  const n = graphNodes.length
  const description = unified
    ? `Modelo centralizado: ${n} especialidades sob um único núcleo, com uma única interface com a sua operação.`
    : `Modelo fragmentado: ${n} fornecedores, ${n} contratos e ${interfaceCount(n)} interfaces potenciais com a sua operação.`

  return (
    <figure className={`relative flex w-full flex-col ${className}`}>
      <svg viewBox={`0 0 ${GRAPH_SIZE} ${GRAPH_SIZE}`} role="img" aria-label={description} className="h-auto w-full overflow-visible">
        <g strokeWidth="1">
          {pairs.map(([a, b]) => (
            <Line
              key={`${a.id}-${b.id}`}
              from={unified ? core : a.fragmented}
              to={unified ? core : b.fragmented}
              opacity={unified ? 0 : 0.42}
              className="text-alert"
              dash="3 5"
            />
          ))}
          {positioned.map((node) => (
            <Line
              key={`contract-${node.id}`}
              from={unified ? core : client}
              to={unified ? node.unified : node.fragmented}
              opacity={unified ? 0.6 : 0.5}
              className={unified ? 'text-blueprint' : 'text-muted'}
            />
          ))}
        </g>

        <m.line
          initial={false}
          animate={{ x1: core.x, y1: core.y + 48, x2: client.x, y2: client.y - 20, opacity: unified ? 1 : 0 }}
          transition={{ ...transition, delay: unified ? 0.5 : 0 }}
          className="text-accent"
          stroke="currentColor"
          strokeWidth="2"
        />

        <m.g
          initial={false}
          animate={{ opacity: unified ? 1 : 0, scale: unified ? 1 : 0.4 }}
          transition={{ ...transition, delay: unified ? 0.35 : 0 }}
          style={{ originX: `${core.x}px`, originY: `${core.y}px` }}
        >
          <circle cx={core.x} cy={core.y} r="64" className="fill-none stroke-blueprint/40" strokeDasharray="2 6" />
          <circle cx={core.x} cy={core.y} r="46" className="fill-ink stroke-fg" strokeWidth="1.5" />
          <rect x={core.x + 18} y={core.y + 18} width="14" height="14" className="fill-accent" />
          <text x={core.x} y={core.y + 6} textAnchor="middle" className="fill-fg font-display text-[22px] font-bold">
            SM
          </text>
          <rect x={core.x - 96} y={core.y - 98} width="192" height="26" className="fill-ink" />
          <text x={core.x} y={core.y - 80} textAnchor="middle" className="fill-fg font-mono text-[13px] tracking-[0.18em] max-sm:text-[18px] max-sm:tracking-[0.06em]">
            {coreNode.label.toUpperCase()}
          </text>
        </m.g>

        {positioned.map((node) => {
          const p = unified ? node.unified : node.fragmented
          return (
            <m.g key={node.id} initial={false} animate={{ x: p.x, y: p.y }} transition={transition}>
              <rect x="-6" y="-6" width="12" height="12" className={unified ? 'fill-blueprint' : 'fill-ink stroke-fg'} strokeWidth="1.25" />
              <m.text initial={false} animate={{ opacity: unified ? 0 : 1 }} transition={{ duration: DURATION.fast }} y="-16" textAnchor="middle" className="fill-faint font-mono text-[11px] tracking-[0.14em] max-sm:hidden">
                {node.supplier.toUpperCase()} · {node.contract}
              </m.text>
              <text {...labelPlacement(node.unified.x, unified)} className="fill-fg font-sans text-[15px] font-medium max-sm:text-[24px]">
                {node.specialty}
              </text>
            </m.g>
          )
        })}

        <m.g initial={false} animate={{ x: client.x, y: client.y }} transition={transition}>
          <rect x="-82" y="-20" width="164" height="40" className="fill-surface stroke-fg" strokeWidth="1.25" />
          <text y="5" textAnchor="middle" className="fill-fg font-mono text-[12px] tracking-[0.2em] max-sm:text-[17px] max-sm:tracking-[0.08em]">
            {clientNode.label.toUpperCase()}
          </text>
        </m.g>
      </svg>

      <dl className="mt-4 grid grid-cols-4 border-t border-line" aria-hidden="true">
        {readouts(state).map((r) => (
          <div key={r.label} className="border-r border-line px-3 pt-3 last:border-r-0">
            <dt className="label-mono text-[0.625rem] text-faint">{r.label}</dt>
            <m.dd
              key={`${state}-${r.label}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.base, delay: 0.3 }}
              className={`mt-1 font-mono text-2xl tabular-nums lg:text-3xl ${unified ? 'text-fg' : r.label === 'Interfaces' ? 'text-alert' : 'text-fg'}`}
            >
              {String(r.value).padStart(2, '0')}
            </m.dd>
          </div>
        ))}
      </dl>
      <figcaption className="label-mono mt-3 text-faint">
        Cenário ilustrativo · interfaces = n + n(n−1)/2 · n = {n}
      </figcaption>
    </figure>
  )
}
