import { describe, expect, it } from 'vitest'
import { safetyDomains, safetyGear } from './safety'

describe('quadro de segurança', () => {
  it('todo equipamento aponta para um domínio de segurança existente', () => {
    for (const gear of safetyGear) expect(safetyDomains.some((d) => d.id === gear.domain)).toBe(true)
  })
})
