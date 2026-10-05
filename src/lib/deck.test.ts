import { describe, expect, it } from 'vitest'
import { clampIndex, createWheelGate, keyAction, slideIndexFromHash } from './deck'

describe('clampIndex', () => {
  it('mantém o índice dentro do intervalo de slides', () => {
    expect(clampIndex(-1, 5)).toBe(0)
    expect(clampIndex(7, 5)).toBe(4)
    expect(clampIndex(2, 5)).toBe(2)
  })
})

describe('slideIndexFromHash', () => {
  const ids = ['capa', 'inicio', 'metodo']

  it('encontra o slide pelo id do hash', () => {
    expect(slideIndexFromHash('#metodo', ids)).toBe(2)
  })

  it('volta para a capa quando o hash é vazio ou desconhecido', () => {
    expect(slideIndexFromHash('', ids)).toBe(0)
    expect(slideIndexFromHash('#inexistente', ids)).toBe(0)
  })
})

describe('keyAction', () => {
  it('avança com teclas de próximo, incluindo controles remotos (PageDown)', () => {
    for (const key of ['ArrowRight', 'ArrowDown', 'PageDown', ' ']) expect(keyAction(key)).toBe('next')
  })

  it('volta com teclas de anterior', () => {
    for (const key of ['ArrowLeft', 'ArrowUp', 'PageUp']) expect(keyAction(key)).toBe('prev')
  })

  it('vai ao primeiro e ao último slide com Home e End', () => {
    expect(keyAction('Home')).toBe('first')
    expect(keyAction('End')).toBe('last')
  })

  it('ignora outras teclas', () => {
    expect(keyAction('a')).toBeNull()
  })
})

describe('createWheelGate', () => {
  it('acumula pequenos giros da roda até passar o limiar', () => {
    const gate = createWheelGate({ threshold: 50, cooldown: 800 })
    expect(gate(20, 0)).toBe(0)
    expect(gate(20, 16)).toBe(0)
    expect(gate(20, 32)).toBe(1)
  })

  it('ignora a inércia do trackpad durante o resfriamento', () => {
    const gate = createWheelGate({ threshold: 50, cooldown: 800 })
    expect(gate(120, 0)).toBe(1)
    expect(gate(120, 300)).toBe(0)
    expect(gate(120, 700)).toBe(0)
  })

  it('aceita novo comando depois do resfriamento, na direção do giro', () => {
    const gate = createWheelGate({ threshold: 50, cooldown: 800 })
    gate(120, 0)
    expect(gate(-120, 1000)).toBe(-1)
  })

  it('descarta acúmulo antigo quando a roda fica parada', () => {
    const gate = createWheelGate({ threshold: 50, cooldown: 800 })
    expect(gate(40, 0)).toBe(0)
    expect(gate(40, 2000)).toBe(0)
  })
})
