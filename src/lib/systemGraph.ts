import { clientNode, coreNode, GRAPH_SIZE, graphNodes, ringPosition, supplierPairs, type Point } from '../data/graph'

export const GRAPH_KEYFRAMES = {
  desafio: [0.26, 0.46],
  modelo: [0.88, 1],
} as const

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const seg = (p: number, from: number, to: number) => clamp01((p - from) / (to - from))
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const lerpPoint = (a: Point, b: Point, t: number): Point => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })

const CONVERGE_START = 0.48
const nodeIndexes = graphNodes.map((_, i) => i)
const pairs = supplierPairs(nodeIndexes)
const rings = graphNodes.map((_, i) => ringPosition(i, graphNodes.length))

export type GraphFrame = ReturnType<typeof graphFrame>

export function graphFrame(progress: number) {
  const p = clamp01(progress)
  const n = graphNodes.length

  const nodes = graphNodes.map((node, i) => {
    const appear = ease(seg(p, 0.03 + i * 0.018, 0.08 + i * 0.018))
    const move = ease(seg(p, CONVERGE_START + i * 0.012, CONVERGE_START + i * 0.012 + 0.26))
    const position = lerpPoint(node.fragmented, rings[i], move)
    return {
      ...position,
      opacity: appear,
      scale: 0.4 + 0.6 * appear,
      tagOpacity: appear * (1 - seg(p, CONVERGE_START, 0.56)),
    }
  })

  const client = {
    ...lerpPoint(clientNode.fragmented, clientNode.unified, ease(seg(p, 0.55, 0.82))),
    opacity: seg(p, 0, 0.04),
  }
  const contractOrigin = lerpPoint(client, coreNode.position, ease(seg(p, 0.5, 0.72)))
  const unifiedMix = seg(p, 0.6, 0.82)

  const contracts = nodes.map((node, i) => ({
    x1: contractOrigin.x,
    y1: contractOrigin.y,
    x2: node.x,
    y2: node.y,
    reveal: seg(p, 0.1 + i * 0.015, 0.16 + i * 0.015),
  }))

  const interfaceFade = 1 - seg(p, CONVERGE_START, 0.6)
  const interfaces = pairs.map(([a, b], k) => ({
    x1: nodes[a].x,
    y1: nodes[a].y,
    x2: nodes[b].x,
    y2: nodes[b].y,
    reveal: seg(p, 0.26 + k * (0.15 / pairs.length), 0.3 + k * (0.15 / pairs.length)),
    opacity: interfaceFade,
  }))

  const coreReveal = ease(seg(p, 0.74, 0.86))
  const converged = seg(p, CONVERGE_START, 0.82) >= 0.6
  const shownSuppliers = nodes.filter((node) => node.opacity >= 0.5).length
  const shownContracts = contracts.filter((line) => line.reveal >= 0.5).length
  const shownInterfaces = interfaces.filter((line) => line.reveal >= 0.5).length

  const cameraT = seg(p, CONVERGE_START, 0.86)
  const center = GRAPH_SIZE / 2
  const focus = lerpPoint({ x: center, y: center }, coreNode.position, ease(cameraT))

  return {
    nodes,
    client,
    contracts,
    interfaces,
    unifiedMix,
    core: { opacity: coreReveal, scale: 0.4 + 0.6 * coreReveal },
    link: { reveal: seg(p, 0.88, 0.98) },
    camera: { scale: 1 + 0.16 * Math.sin(Math.PI * cameraT), originX: focus.x, originY: focus.y },
    counters: converged
      ? { suppliers: 1, contracts: 1, responsibles: 1, interfaces: 1 }
      : { suppliers: shownSuppliers, contracts: shownContracts, responsibles: shownSuppliers, interfaces: shownContracts + shownInterfaces },
    phase: converged ? ('unified' as const) : ('fragmented' as const),
    total: n,
  }
}
