import { describe, expect, it } from 'vitest'
import { layerFocus, LAYER_BASE, LAYER_DIM } from './layerFocus'

const COUNT = 5

describe('destaque das camadas do corte', () => {
  it('na visão geral todas aparecem iguais, em baixa opacidade e sem destaque', () => {
    const f = layerFocus(0, COUNT)
    expect(f).toHaveLength(COUNT)
    expect(f.every((l) => l.opacity === LAYER_BASE && l.highlight === 0)).toBe(true)
    expect(LAYER_BASE).toBeLessThan(1)
  })

  it('em cada etapa só a camada correspondente fica em destaque e as demais recuam', () => {
    for (let stage = 1; stage <= COUNT; stage++) {
      const f = layerFocus(stage, COUNT)
      f.forEach((l, i) => {
        if (i === stage - 1) expect(l).toEqual({ opacity: 1, highlight: 1 })
        else expect(l).toEqual({ opacity: LAYER_DIM, highlight: 0 })
      })
    }
    expect(LAYER_DIM).toBeGreaterThanOrEqual(0.2)
    expect(LAYER_DIM).toBeLessThanOrEqual(0.3)
  })

  it('no final todas voltam à opacidade total, integradas, sem destaque individual', () => {
    expect(layerFocus(COUNT + 1, COUNT).every((l) => l.opacity === 1 && l.highlight === 0)).toBe(true)
  })

  it('entre duas etapas a passagem é gradual, sem saltos', () => {
    const mid = layerFocus(1.5, COUNT)
    expect(mid[0].highlight).toBeCloseTo(0.5)
    expect(mid[1].highlight).toBeCloseTo(0.5)
    expect(mid[0].opacity).toBeGreaterThan(LAYER_DIM)
    expect(mid[0].opacity).toBeLessThan(1)
  })

  it('progresso fora da faixa fica nos extremos', () => {
    expect(layerFocus(-4, COUNT)).toEqual(layerFocus(0, COUNT))
    expect(layerFocus(40, COUNT)).toEqual(layerFocus(COUNT + 1, COUNT))
  })
})
