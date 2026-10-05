import { describe, expect, it } from 'vitest'
import { airportSystems, airportTour, TERMINAL_SIZE } from './airport'

describe('sistemas do terminal', () => {
  it('o percurso guiado só cita sistemas existentes', () => {
    for (const id of airportTour) expect(airportSystems.some((s) => s.id === id)).toBe(true)
  })

  it('cada hotspot fica dentro da sua área de foco e do desenho', () => {
    for (const s of airportSystems) {
      expect(s.x).toBeGreaterThanOrEqual(s.focus.x)
      expect(s.x).toBeLessThanOrEqual(s.focus.x + s.focus.w)
      expect(s.y).toBeGreaterThanOrEqual(s.focus.y)
      expect(s.y).toBeLessThanOrEqual(s.focus.y + s.focus.h)
      expect(s.focus.x + s.focus.w).toBeLessThanOrEqual(TERMINAL_SIZE.width)
      expect(s.focus.y + s.focus.h).toBeLessThanOrEqual(TERMINAL_SIZE.height)
    }
  })
})
