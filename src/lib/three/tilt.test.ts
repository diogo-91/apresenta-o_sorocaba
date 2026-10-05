import { describe, expect, it } from 'vitest'
import { MAX_TILT, tiltFromPointer } from './tilt'

const deg = (rad: number) => (rad * 180) / Math.PI

describe('tiltFromPointer', () => {
  it('fica neutro com o ponteiro no centro', () => {
    expect(tiltFromPointer(0, 0)).toEqual({ x: 0, y: 0 })
  })

  it('ponteiro à direita gira o objeto para acompanhar, até no máximo 7°', () => {
    expect(deg(tiltFromPointer(1, 0).y)).toBeCloseTo(MAX_TILT.yDeg)
    expect(tiltFromPointer(0.5, 0).y).toBeGreaterThan(0)
  })

  it('ponteiro para cima muda a perspectiva em no máximo 4°', () => {
    expect(Math.abs(deg(tiltFromPointer(0, -1).x))).toBeCloseTo(MAX_TILT.xDeg)
  })

  it('nunca ultrapassa os limites, mesmo com valores fora da faixa', () => {
    const t = tiltFromPointer(5, -9)
    expect(Math.abs(deg(t.x))).toBeLessThanOrEqual(MAX_TILT.xDeg + 1e-9)
    expect(Math.abs(deg(t.y))).toBeLessThanOrEqual(MAX_TILT.yDeg + 1e-9)
  })
})
