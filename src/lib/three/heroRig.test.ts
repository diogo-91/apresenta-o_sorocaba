import { describe, expect, it } from 'vitest'
import { HERO_SEPARATION_MAX, heroCamera, heroSeparation } from './heroRig'
import { HERO_TILT, tiltFromPointer } from './tilt'

const deg = (rad: number) => (rad * 180) / Math.PI
const dist = (c: ReturnType<typeof heroCamera>) => Math.hypot(...c.position.map((v, i) => v - c.target[i]))

describe('câmera da abertura', () => {
  it('aproxima do objeto conforme o primeiro trecho de rolagem avança', () => {
    expect(dist(heroCamera(1, false))).toBeLessThan(dist(heroCamera(0.5, false)))
    expect(dist(heroCamera(0.5, false))).toBeLessThan(dist(heroCamera(0, false)))
  })

  it('a aproximação é curta: no máximo 25% da distância inicial', () => {
    expect(dist(heroCamera(1, false))).toBeGreaterThanOrEqual(dist(heroCamera(0, false)) * 0.75)
  })

  it('progresso fora da faixa não leva a câmera além dos extremos', () => {
    expect(heroCamera(-3, false)).toEqual(heroCamera(0, false))
    expect(heroCamera(7, false)).toEqual(heroCamera(1, false))
  })

  it('no celular o objeto não é deslocado lateralmente pelo filme', () => {
    expect(heroCamera(0, true).filmOffset).toBe(0)
    expect(heroCamera(0, false).filmOffset).not.toBe(0)
  })
})

describe('separação das peças', () => {
  it('peças começam encaixadas e se afastam só alguns centímetros', () => {
    expect(heroSeparation(0)).toBe(0)
    expect(heroSeparation(1)).toBe(HERO_SEPARATION_MAX)
    expect(HERO_SEPARATION_MAX).toBeLessThanOrEqual(0.08)
    expect(heroSeparation(9)).toBe(HERO_SEPARATION_MAX)
  })
})

describe('inclinação da abertura', () => {
  it('o ponteiro nunca inclina a abertura mais de 4°', () => {
    const t = tiltFromPointer(5, -5, HERO_TILT)
    expect(Math.abs(deg(t.x))).toBeLessThanOrEqual(4)
    expect(Math.abs(deg(t.y))).toBeLessThanOrEqual(4)
    expect(Math.abs(deg(t.y))).toBeGreaterThanOrEqual(2)
  })
})
