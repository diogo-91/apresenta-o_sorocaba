import { describe, expect, it } from 'vitest'
import { beltPath, cumulative, headDistance, pointAt, switchOn } from './systemsRig'

describe('ativação dos equipamentos', () => {
  it('equipamento fica desligado até a energia chegar e ligado depois', () => {
    expect(switchOn(1.5, 2)).toBe(0)
    expect(switchOn(2, 2)).toBe(1)
    expect(switchOn(5, 2)).toBe(1)
  })

  it('a ativação é curta e sem salto: começa pouco antes da chegada', () => {
    const v = switchOn(1.9, 2)
    expect(v).toBeGreaterThan(0)
    expect(v).toBeLessThan(1)
  })
})

describe('trajeto do cabo', () => {
  const points: [number, number][] = [[0, 0], [100, 0], [100, 50]]
  const cum = cumulative(points)

  it('mede o comprimento acumulado de cada vértice', () => {
    expect(cum).toEqual([0, 100, 150])
  })

  it('o pulso fica exatamente sobre o cabo', () => {
    expect(pointAt(points, cum, 0)).toEqual([0, 0])
    expect(pointAt(points, cum, 125)).toEqual([100, 25])
    expect(pointAt(points, cum, 999)).toEqual([100, 50])
  })
})

describe('ponta da energia', () => {
  const stages = [1, 2, 3]
  const dists = [0, 80, 200]

  it('chega a cada equipamento no passo em que ele liga', () => {
    stages.forEach((s, i) => expect(headDistance(s, stages, dists)).toBe(dists[i]))
  })

  it('avança entre equipamentos e não passa dos extremos', () => {
    expect(headDistance(1.5, stages, dists)).toBe(40)
    expect(headDistance(0, stages, dists)).toBe(0)
    expect(headDistance(9, stages, dists)).toBe(200)
  })
})

describe('correia entre polias', () => {
  const a = { x: 0, y: 0, r: 30 }
  const b = { x: 200, y: 0, r: 50 }
  const pts = (d: string) => [...d.matchAll(/(?:[ML]|A[\d.]+ [\d.]+ 0 [01] [01] )(-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]])

  it('os trechos retos tocam as duas polias', () => {
    const [t1, t2, t3, t4] = pts(beltPath(a, b))
    expect(Math.hypot(t1[0] - a.x, t1[1] - a.y)).toBeCloseTo(a.r, 1)
    expect(Math.hypot(t2[0] - b.x, t2[1] - b.y)).toBeCloseTo(b.r, 1)
    expect(Math.hypot(t3[0] - b.x, t3[1] - b.y)).toBeCloseTo(b.r, 1)
    expect(Math.hypot(t4[0] - a.x, t4[1] - a.y)).toBeCloseTo(a.r, 1)
  })

  it('cada trecho reto é tangente: perpendicular ao raio no ponto de contato', () => {
    const [t1, t2] = pts(beltPath(a, b))
    const dir = [t2[0] - t1[0], t2[1] - t1[1]]
    expect(dir[0] * (t1[0] - a.x) + dir[1] * (t1[1] - a.y)).toBeCloseTo(0, 1)
    expect(dir[0] * (t2[0] - b.x) + dir[1] * (t2[1] - b.y)).toBeCloseTo(0, 1)
  })

  it('funciona com as polias empilhadas na vertical (mobile)', () => {
    const [t1] = pts(beltPath({ x: 0, y: 0, r: 22 }, { x: 0, y: 290, r: 34 }))
    expect(Math.hypot(t1[0], t1[1])).toBeCloseTo(22, 1)
  })
})
