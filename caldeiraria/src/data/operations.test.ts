import { describe, expect, it } from 'vitest'
import { operations, PROCESS_STEPS } from './operations'
import { screens } from './screens'

describe('operações de caldeiraria', () => {
  it('segue a ordem de fabricação, do corte à pintura', () => {
    expect(operations.map((op) => op.id)).toEqual(['corte', 'dobra', 'usinagem', 'montagem', 'solda', 'acabamento', 'pintura'])
  })

  it('cada operação tem a sua tela, na mesma ordem do processo', () => {
    const operationScreens = screens.filter((s) => s.group === 'operacoes').map((s) => s.id)
    expect(operationScreens).toEqual(operations.map((op) => op.id))
  })

  it('o esquema tem um passo de entrada, um por operação e um de saída', () => {
    expect(PROCESS_STEPS).toBe(operations.length + 2)
  })
})
