import { describe, expect, it } from 'vitest'
import { screens } from './data/screens'
import { slides } from './slides'

describe('ordem dos slides', () => {
  it('segue exatamente o registro de telas usado pela navegação', () => {
    expect(slides.map((s) => s.id)).toEqual(screens.map((s) => s.id))
  })
})
