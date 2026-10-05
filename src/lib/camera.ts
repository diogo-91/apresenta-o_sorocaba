import type { Box } from '../data/airport'

export type Camera = { scale: number; x: number; y: number }

const MARGIN = 0.82

export function cameraFor(box: Box | null, view: { width: number; height: number }, maxScale = 2.2): Camera {
  if (!box) return { scale: 1, x: 0, y: 0 }
  const fit = Math.min(view.width / box.w, view.height / box.h) * MARGIN
  const scale = Math.min(maxScale, Math.max(1, fit))
  return {
    scale,
    x: view.width / 2 - (box.x + box.w / 2) * scale,
    y: view.height / 2 - (box.y + box.h / 2) * scale,
  }
}
