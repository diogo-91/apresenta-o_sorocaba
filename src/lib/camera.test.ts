import { describe, expect, it } from 'vitest'
import { cameraFor } from './camera'

const view = { width: 1600, height: 720 }

describe('cameraFor', () => {
  it('sem foco mostra o desenho inteiro', () => {
    expect(cameraFor(null, view)).toEqual({ scale: 1, x: 0, y: 0 })
  })

  it('centraliza a área de foco no quadro', () => {
    const box = { x: 100, y: 100, w: 400, h: 200 }
    const cam = cameraFor(box, view, 3)
    const cx = (box.x + box.w / 2) * cam.scale + cam.x
    const cy = (box.y + box.h / 2) * cam.scale + cam.y
    expect(cx).toBeCloseTo(view.width / 2)
    expect(cy).toBeCloseTo(view.height / 2)
  })

  it('aproxima no máximo até o limite e nunca afasta além do desenho inteiro', () => {
    expect(cameraFor({ x: 0, y: 0, w: 10, h: 10 }, view, 2.2).scale).toBe(2.2)
    expect(cameraFor({ x: 0, y: 0, w: 1600, h: 720 }, view, 2.2).scale).toBe(1)
  })
})
