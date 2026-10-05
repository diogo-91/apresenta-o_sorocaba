import { describe, expect, it } from 'vitest'
import { flowLine, flowStage, STAGE_FUTURE, STAGE_PAST } from './flowState'

const COUNT = 8

describe('estado das etapas do fluxo', () => {
  it('ao entrar, todas as etapas aparecem em baixa presença', () => {
    for (let i = 0; i < COUNT; i++) expect(flowStage(0, i, COUNT)).toEqual({ opacity: STAGE_FUTURE, scale: 0.97, active: false, reached: false })
  })

  it('na etapa ativa a imagem fica inteira; anteriores ficam médias; futuras, baixas', () => {
    expect(flowStage(3, 2, COUNT)).toEqual({ opacity: 1, scale: 1, active: true, reached: true })
    expect(flowStage(3, 0, COUNT).opacity).toBe(STAGE_PAST)
    expect(flowStage(3, 0, COUNT).reached).toBe(true)
    expect(flowStage(3, 5, COUNT).opacity).toBe(STAGE_FUTURE)
    expect(STAGE_PAST).toBeGreaterThanOrEqual(0.6)
    expect(STAGE_PAST).toBeLessThanOrEqual(0.7)
    expect(STAGE_FUTURE).toBe(0.4)
  })

  it('no final o sistema inteiro fica ativo', () => {
    for (let i = 0; i < COUNT; i++) expect(flowStage(COUNT + 1, i, COUNT)).toEqual({ opacity: 1, scale: 1, active: false, reached: true })
  })
})

describe('linha de energia', () => {
  it('começa no primeiro ponto e termina no último', () => {
    expect(flowLine(0, COUNT)).toBe(0)
    expect(flowLine(1, COUNT)).toBe(0)
    expect(flowLine(COUNT, COUNT)).toBe(1)
    expect(flowLine(COUNT + 1, COUNT)).toBe(1)
  })

  it('avança proporcionalmente entre as etapas e nunca recua com o progresso', () => {
    expect(flowLine(4.5, COUNT)).toBeCloseTo(3.5 / 7)
    expect(flowLine(5, COUNT)).toBeGreaterThan(flowLine(4.9, COUNT))
  })
})
