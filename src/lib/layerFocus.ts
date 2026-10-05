export const LAYER_BASE = 0.55
export const LAYER_DIM = 0.25

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function layerFocus(progress: number, count: number) {
  const p = Math.max(0, Math.min(count + 1, progress))
  const final = clamp01(p - count)
  const highlights = Array.from({ length: count }, (_, i) => clamp01(1 - Math.abs(p - (i + 1))))
  const focus = Math.max(...highlights)
  const rest = lerp(LAYER_BASE, LAYER_DIM, focus)
  return highlights.map((h) => ({ opacity: lerp(lerp(rest, 1, h), 1, final), highlight: h }))
}
