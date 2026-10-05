import type { Vec3 } from '../../data/facility3d'

export const HERO_SEPARATION_MAX = 0.06
const APPROACH = 0.2

const FRAMES = {
  wide: { position: [3.0, 0.55, 6.9] as Vec3, target: [0.5, 1.75, 0] as Vec3, pass: [-0.55, 0.12, 0] as Vec3, fov: 34, filmOffset: -8 },
  compact: { position: [2.4, 0.4, 7.6] as Vec3, target: [0.55, 1.35, 0] as Vec3, pass: [-0.35, 0.1, 0] as Vec3, fov: 40, filmOffset: 0 },
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const ease = (t: number) => t * t * (3 - 2 * t)

export function heroCamera(progress: number, compact: boolean) {
  const f = compact ? FRAMES.compact : FRAMES.wide
  const p = ease(clamp01(progress))
  const position = f.position.map((v, i) => v + (f.target[i] - v) * APPROACH * p + f.pass[i] * p) as Vec3
  return { position, target: f.target, fov: f.fov, filmOffset: f.filmOffset }
}

export function heroSeparation(progress: number) {
  return ease(clamp01(progress)) * HERO_SEPARATION_MAX
}
