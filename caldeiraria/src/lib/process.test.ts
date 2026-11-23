import { describe, expect, it } from 'vitest'
import { stationState, processProgress } from './process'

describe('stationState', () => {
  it('na entrada nenhuma estação está ativa', () => {
    expect([0, 1, 6].map((i) => stationState(0, i, 7))).toEqual(['next', 'next', 'next'])
  })

  it('marca anteriores como concluídas, a atual como ativa e as seguintes como pendentes', () => {
    expect([0, 1, 2, 3].map((i) => stationState(3, i, 7))).toEqual(['done', 'done', 'active', 'next'])
  })

  it('na saída todas as estações estão concluídas', () => {
    expect([0, 3, 6].map((i) => stationState(8, i, 7))).toEqual(['done', 'done', 'done'])
  })
})

describe('processProgress', () => {
  it('vai de 0 na primeira estação a 1 na última e na saída', () => {
    expect([0, 1, 4, 7, 8].map((s) => processProgress(s, 7))).toEqual([0, 0, 0.5, 1, 1])
  })
})
