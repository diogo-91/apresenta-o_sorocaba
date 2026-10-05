import { describe, expect, it } from 'vitest'
import { menuGroups, screens, screenMeta, TOTAL_SCREENS } from './screens'

describe('registro de telas', () => {
  it('tem os 20 slides da apresentação com ids únicos', () => {
    expect(TOTAL_SCREENS).toBe(20)
    expect(new Set(screens.map((s) => s.id)).size).toBe(20)
  })

  it('todo item de menu aponta para ao menos uma tela', () => {
    for (const group of menuGroups) {
      expect(screens.some((s) => s.group === group.id)).toBe(true)
    }
  })

  it('numera as telas pela ordem de apresentação', () => {
    expect(screenMeta('capa').number).toBe(1)
    expect(screenMeta('encerramento').number).toBe(20)
  })

  it('falha alto quando a tela não está registrada', () => {
    expect(() => screenMeta('inexistente')).toThrow()
  })
})
