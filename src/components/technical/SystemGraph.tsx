import { useCallback, useRef } from 'react'
import logoSrc from '../../assets/logo-srcb.png'
import { clientNode, coreNode, GRAPH_SIZE, graphNodes, supplierPairs } from '../../data/graph'
import { graphFrame } from '../../lib/systemGraph'
import { useScrollProgress, useTweenedProgress } from '../../hooks/useScene'

const pairs = supplierPairs(graphNodes.map((_, i) => i))
const contractCodes = graphNodes.map((_, i) => `CT-${String(i + 1).padStart(2, '0')}`)
const MUTED = [78, 88, 96]
const BLUE = [38, 114, 176]

function mix(t: number) {
  const c = MUTED.map((v, i) => Math.round(v + (BLUE[i] - v) * t))
  return `rgb(${c[0]} ${c[1]} ${c[2]})`
}

const pad2 = (v: number) => String(v).padStart(2, '0')
const set = (el: Element | null | undefined, attrs: Record<string, string | number>) => {
  if (!el) return
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v))
}

type Props = {
  target?: number | null
  scrollRange?: readonly [number, number]
  stretch?: number
  large?: boolean
  className?: string
}

const MID = GRAPH_SIZE / 2

export function SystemGraph({ target = null, scrollRange, stretch = 1, large = false, className = '' }: Props) {
  const root = useRef<HTMLElement>(null)
  const camera = useRef<SVGGElement>(null)
  const interfaces = useRef<(SVGLineElement | null)[]>([])
  const contracts = useRef<(SVGLineElement | null)[]>([])
  const nodes = useRef<(SVGGElement | null)[]>([])
  const nodeBoxes = useRef<(SVGRectElement | null)[]>([])
  const tags = useRef<(SVGTextElement | null)[]>([])
  const labels = useRef<(SVGTextElement | null)[]>([])
  const client = useRef<SVGGElement>(null)
  const core = useRef<SVGGElement>(null)
  const link = useRef<SVGLineElement>(null)
  const counters = useRef<(HTMLElement | null)[]>([])
  const counterLabels = useRef<(HTMLElement | null)[]>([])
  const phase = useRef<HTMLParagraphElement>(null)
  const svg = useRef<SVGSVGElement>(null)

  const render = useCallback((progress: number) => {
    const f = graphFrame(progress)
    const sx = (x: number) => MID + (x - MID) * stretch
    const { x: cx, y: cy } = coreNode.position
    set(camera.current, {
      transform: `translate(${sx(f.camera.originX)} ${f.camera.originY}) scale(${f.camera.scale}) translate(${-sx(f.camera.originX)} ${-f.camera.originY})`,
    })

    f.interfaces.forEach((line, k) => {
      set(interfaces.current[k], {
        x1: sx(line.x1),
        y1: line.y1,
        x2: sx(line.x1 + (line.x2 - line.x1) * line.reveal),
        y2: line.y1 + (line.y2 - line.y1) * line.reveal,
        opacity: line.reveal > 0 ? 0.75 * line.opacity : 0,
      })
    })

    const stroke = mix(f.unifiedMix)
    f.contracts.forEach((line, i) => {
      set(contracts.current[i], {
        x1: sx(line.x1),
        y1: line.y1,
        x2: sx(line.x1 + (line.x2 - line.x1) * line.reveal),
        y2: line.y1 + (line.y2 - line.y1) * line.reveal,
        opacity: line.reveal > 0 ? 0.75 : 0,
        stroke,
      })
    })

    f.nodes.forEach((node, i) => {
      set(nodes.current[i], { transform: `translate(${sx(node.x)} ${node.y}) scale(${node.scale})`, opacity: node.opacity })
      set(nodeBoxes.current[i], { fill: f.unifiedMix > 0.5 ? 'var(--color-blueprint)' : 'var(--color-paper)' })
      set(tags.current[i], { opacity: node.tagOpacity })
      const offset = node.x - cx
      const side = f.unifiedMix > 0.5
      const centered = Math.abs(offset) < 30
      set(labels.current[i], {
        x: side && !centered ? (offset > 0 ? 1 : -1) * (large ? 20 : 16) : 0,
        y: side ? (centered ? (large ? -20 : -16) : large ? 7 : 6) : large ? 38 : 30,
        'text-anchor': side && !centered ? (offset > 0 ? 'start' : 'end') : 'middle',
      })
    })

    set(client.current, { transform: `translate(${sx(f.client.x)} ${f.client.y})`, opacity: f.client.opacity })
    set(core.current, {
      opacity: f.core.opacity,
      transform: `translate(${cx} ${cy}) scale(${f.core.scale}) translate(${-cx} ${-cy})`,
    })
    set(link.current, {
      x1: cx,
      y1: cy + 48,
      x2: cx,
      y2: cy + 48 + (f.client.y - 20 - cy - 48) * f.link.reveal,
      opacity: f.link.reveal > 0 ? 1 : 0,
    })

    const unified = f.phase === 'unified'
    const values = [f.counters.suppliers, f.counters.contracts, f.counters.responsibles, f.counters.interfaces]
    const names = unified ? ['Parceiro', 'Contrato', 'Responsável', 'Interface'] : ['Fornecedores', 'Contratos', 'Responsáveis', 'Interfaces']
    values.forEach((v, i) => {
      const el = counters.current[i]
      if (el && el.textContent !== pad2(v)) el.textContent = pad2(v)
      if (el) el.dataset.alert = String(!unified && i === 3 && v > f.total)
      const label = counterLabels.current[i]
      if (label && label.textContent !== names[i]) label.textContent = names[i]
    })
    if (phase.current) phase.current.textContent = unified ? 'Modelo integrado · núcleo único' : 'Cenário fragmentado · ilustrativo'
    if (svg.current) {
      const text = unified
        ? `Modelo centralizado: ${f.total} especialidades sob um único núcleo, com uma única interface com a sua operação.`
        : `Modelo fragmentado: ${f.counters.suppliers} fornecedores e ${f.counters.interfaces} interfaces com a sua operação.`
      if (svg.current.getAttribute('aria-label') !== text) svg.current.setAttribute('aria-label', text)
    }
  }, [stretch, large])

  useTweenedProgress(target, render)
  useScrollProgress(root, render, Boolean(scrollRange), scrollRange)

  return (
    <figure ref={root} className={`relative flex w-full flex-col ${className}`}>
      <p ref={phase} className={`label-mono mb-3 text-faint ${large ? 'text-sm' : ''}`} aria-hidden="true">
        Cenário fragmentado · ilustrativo
      </p>
      <svg ref={svg} viewBox={`${MID - MID * stretch} 0 ${GRAPH_SIZE * stretch} ${GRAPH_SIZE}`} role="img" className="h-auto w-full overflow-visible">
        <g aria-hidden="true" className="text-line-strong" stroke="currentColor" fill="none">
          {[120, 240, 360].map((r) => (
            <ellipse key={r} cx={MID} cy={MID} rx={r * stretch} ry={r} strokeDasharray="1 7" />
          ))}
          <path d={`M${MID} 20 V${GRAPH_SIZE - 20} M${MID - (MID - 20) * stretch} ${MID} H${MID + (MID - 20) * stretch}`} strokeDasharray="2 10" />
        </g>
        <g ref={camera}>
          <g strokeWidth="1">
            {pairs.map(([a, b], k) => (
              <line key={`${a}-${b}`} ref={(el) => void (interfaces.current[k] = el)} className="text-alert" stroke="currentColor" strokeDasharray="3 5" opacity="0" />
            ))}
            {graphNodes.map((node, i) => (
              <line key={node.id} ref={(el) => void (contracts.current[i] = el)} strokeWidth="1.25" opacity="0" />
            ))}
          </g>

          <line ref={link} className="text-accent" stroke="currentColor" strokeWidth="2.5" opacity="0" />

          <g ref={core} opacity="0">
            <circle cx={coreNode.position.x} cy={coreNode.position.y} r="86" className="fill-blueprint/5 stroke-blueprint/30 motion-safe:animate-pulse" />
            <circle cx={coreNode.position.x} cy={coreNode.position.y} r="64" className="fill-none stroke-blueprint/40" strokeDasharray="2 6" />
            <circle cx={coreNode.position.x} cy={coreNode.position.y} r="48" className="fill-paper stroke-fg" strokeWidth="1.5" />
            <image href={logoSrc} x={coreNode.position.x - 36} y={coreNode.position.y - 11} width="72" height="22" className="logo-auto" />
            <rect x={coreNode.position.x + 26} y={coreNode.position.y + 26} width="10" height="10" className="fill-accent" />
            <rect x={coreNode.position.x - (large ? 130 : 98)} y={coreNode.position.y - (large ? 110 : 104)} width={large ? 260 : 196} height={large ? 32 : 26} className="fill-paper" />
            <text x={coreNode.position.x} y={coreNode.position.y - (large ? 88 : 86)} textAnchor="middle" className={`fill-fg font-mono tracking-[0.18em] max-sm:text-[18px] max-sm:tracking-[0.06em] ${large ? 'text-[17px]' : 'text-[13px]'}`}>
              {coreNode.label.toUpperCase()}
            </text>
          </g>

          {graphNodes.map((node, i) => (
            <g key={node.id} ref={(el) => void (nodes.current[i] = el)} opacity="0">
              <rect ref={(el) => void (nodeBoxes.current[i] = el)} x="-7" y="-7" width="14" height="14" className="stroke-fg" strokeWidth="1.25" fill="var(--color-paper)" />
              <text ref={(el) => void (tags.current[i] = el)} y={large ? -22 : -18} textAnchor="middle" className={`fill-faint font-mono tracking-[0.14em] max-sm:hidden ${large ? 'text-[15px]' : 'text-[11px]'}`}>
                {node.supplier.toUpperCase()} · {contractCodes[i]}
              </text>
              <text ref={(el) => void (labels.current[i] = el)} y={large ? 38 : 30} textAnchor="middle" className={`fill-fg font-sans font-medium max-sm:text-[24px] ${large ? 'text-[22px]' : 'text-[15px]'}`}>
                {node.specialty}
              </text>
            </g>
          ))}

          <g ref={client} opacity="0">
            <rect x={large ? -118 : -86} y={large ? -27 : -21} width={large ? 236 : 172} height={large ? 54 : 42} className="fill-surface stroke-fg" strokeWidth="1.25" />
            <text y={large ? 6 : 5} textAnchor="middle" className={`fill-fg font-mono tracking-[0.2em] max-sm:text-[17px] max-sm:tracking-[0.08em] ${large ? 'text-[17px]' : 'text-[12px]'}`}>
              {clientNode.label.toUpperCase()}
            </text>
          </g>
        </g>
      </svg>

      <dl className="mt-4 grid grid-cols-4 border-t border-line" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border-r border-line px-3 pt-3 last:border-r-0">
            <dt ref={(el) => void (counterLabels.current[i] = el)} className={`label-mono text-faint ${large ? 'text-xs' : 'text-[0.625rem]'}`} />
            <dd ref={(el) => void (counters.current[i] = el)} className="mt-1 font-mono text-2xl tabular-nums text-fg data-[alert=true]:text-alert lg:text-4xl">
              00
            </dd>
          </div>
        ))}
      </dl>
      <figcaption className={`label-mono mt-3 text-faint ${large ? 'text-sm' : ''}`}>Interfaces = n + n(n−1)/2 · n = {graphNodes.length}</figcaption>
    </figure>
  )
}
