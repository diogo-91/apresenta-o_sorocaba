import { describe, expect, it } from 'vitest'
import { coreNode, interfaceCount, ringPosition, supplierPairs } from './graph'

describe('grafo de fragmentação', () => {
  it('conta as interfaces do cliente com cada fornecedor e entre fornecedores', () => {
    expect(interfaceCount(1)).toBe(1)
    expect(interfaceCount(3)).toBe(6)
    expect(interfaceCount(7)).toBe(28)
  })

  it('gera cada par de fornecedores uma única vez', () => {
    expect(supplierPairs(['a', 'b', 'c'])).toEqual([
      ['a', 'b'],
      ['a', 'c'],
      ['b', 'c'],
    ])
  })

  it('posiciona a primeira especialidade no topo do anel em volta do núcleo', () => {
    expect(ringPosition(0, 7)).toEqual({
      x: coreNode.position.x,
      y: coreNode.position.y - coreNode.ringRadius,
    })
  })
})
