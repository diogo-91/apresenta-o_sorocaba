import { describe, expect, it } from 'vitest'
import { machinePose, NUDGE, ramp } from './heavyMove'

describe('pose da máquina ao longo da movimentação', () => {
  it('começa parada no ponto A, no chão', () => {
    expect(machinePose(0)).toEqual({ travel: 0, lift: 0 })
    expect(machinePose(2)).toEqual({ travel: 0, lift: 0 })
  })

  it('no içamento sobe sem sair do lugar', () => {
    const p = machinePose(3)
    expect(p.travel).toBe(0)
    expect(p.lift).toBe(1)
  })

  it('na movimentação atravessa suspensa, passando um pouco do destino', () => {
    const p = machinePose(4)
    expect(p.lift).toBe(1)
    expect(p.travel).toBeCloseTo(1 + NUDGE)
  })

  it('no posicionamento desce e encaixa exatamente no ponto B', () => {
    expect(machinePose(5)).toEqual({ travel: 1, lift: 0 })
    expect(machinePose(7)).toEqual({ travel: 1, lift: 0 })
  })

  it('o deslocamento nunca recua antes do encaixe final', () => {
    let last = -1
    for (let p = 3; p <= 4.6; p += 0.1) {
      const t = machinePose(p).travel
      expect(t).toBeGreaterThanOrEqual(last)
      last = t
    }
  })
})

describe('rampa', () => {
  it('vai de 0 a 1 só dentro do intervalo', () => {
    expect(ramp(1, 2, 3)).toBe(0)
    expect(ramp(2.5, 2, 3)).toBe(0.5)
    expect(ramp(9, 2, 3)).toBe(1)
  })
})
