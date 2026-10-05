import { describe, expect, it } from 'vitest'
import { facilityLayers, facilityZones } from './facility'

describe('camadas do mapa da operação', () => {
  it('cada zona aparece em exatamente uma camada', () => {
    for (const zone of facilityZones) {
      expect(facilityLayers.filter((layer) => layer.zones.includes(zone.id))).toHaveLength(1)
    }
  })

  it('as camadas só citam zonas existentes', () => {
    const ids = new Set(facilityZones.map((z) => z.id))
    for (const layer of facilityLayers) for (const id of layer.zones) expect(ids.has(id)).toBe(true)
  })
})
