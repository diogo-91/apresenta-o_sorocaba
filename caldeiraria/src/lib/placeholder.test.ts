import { describe, expect, it } from 'vitest'
import { TBC, isPending } from './placeholder'

describe('isPending', () => {
  it('trata o marcador padrão e marcadores entre colchetes como pendentes', () => {
    expect(isPending(TBC)).toBe(true)
    expect(isPending('[CASE 01]')).toBe(true)
  })

  it('trata ausência de valor como pendente', () => {
    expect(isPending(null)).toBe(true)
    expect(isPending(undefined)).toBe(true)
    expect(isPending('  ')).toBe(true)
  })

  it('aceita valor real como confirmado', () => {
    expect(isPending('contato@empresa.com.br')).toBe(false)
  })
})
