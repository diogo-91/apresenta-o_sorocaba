import { describe, expect, it } from 'vitest'
import { clientNode, coreNode, graphNodes, interfaceCount, ringPosition } from '../data/graph'
import { GRAPH_KEYFRAMES, graphFrame } from './systemGraph'

const n = graphNodes.length

describe('graphFrame', () => {
  it('começa vazio, sem fornecedores nem conexões', () => {
    const f = graphFrame(0)
    expect(f.nodes.every((node) => node.opacity === 0)).toBe(true)
    expect(f.contracts.every((line) => line.reveal === 0)).toBe(true)
    expect(f.counters.suppliers).toBe(0)
  })

  it('no pico da fragmentação mostra todas as interfaces e a contagem completa', () => {
    const f = graphFrame(GRAPH_KEYFRAMES.desafio[1])
    expect(f.interfaces.every((line) => line.reveal === 1 && line.opacity === 1)).toBe(true)
    expect(f.counters).toEqual({ suppliers: n, contracts: n, responsibles: n, interfaces: interfaceCount(n) })
    expect(f.core.opacity).toBe(0)
  })

  it('a contagem de interfaces nunca diminui enquanto a complexidade cresce', () => {
    let last = 0
    for (let p = 0; p <= GRAPH_KEYFRAMES.desafio[1]; p += 0.01) {
      const value = graphFrame(p).counters.interfaces
      expect(value).toBeGreaterThanOrEqual(last)
      last = value
    }
  })

  it('no fim converge para o anel em volta do núcleo, com uma única interface', () => {
    const f = graphFrame(1)
    f.nodes.forEach((node, i) => expect({ x: node.x, y: node.y }).toEqual(ringPosition(i, n)))
    expect(f.interfaces.every((line) => line.opacity === 0)).toBe(true)
    expect(f.core.opacity).toBe(1)
    expect(f.client).toMatchObject(clientNode.unified)
    expect(f.counters).toEqual({ suppliers: 1, contracts: 1, responsibles: 1, interfaces: 1 })
    f.contracts.forEach((line) => expect({ x: line.x1, y: line.y1 }).toEqual(coreNode.position))
  })

  it('aproxima a câmera durante a convergência e a devolve perto da escala original', () => {
    const mid = graphFrame((GRAPH_KEYFRAMES.desafio[1] + GRAPH_KEYFRAMES.modelo[0]) / 2)
    expect(mid.camera.scale).toBeGreaterThan(1.05)
    expect(graphFrame(1).camera.scale).toBeLessThan(1.05)
  })

  it('limita o progresso fora de 0–1', () => {
    expect(graphFrame(-1)).toEqual(graphFrame(0))
    expect(graphFrame(2)).toEqual(graphFrame(1))
  })
})
