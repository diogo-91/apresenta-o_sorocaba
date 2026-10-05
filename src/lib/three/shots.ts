import { facility3DSteps, type Vec3 } from '../../data/facility3d'

export type Shot = {
  position: Vec3
  target: Vec3
  fov: number
  filmOffset: number
  focus: string
}

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k]
const normalize = (a: Vec3): Vec3 => scale(a, 1 / Math.hypot(...a))

const ISO_DIRECTION = normalize([1, 0.95, 1])

function facilityShot(index: number, compact: boolean): Shot {
  const step = facility3DSteps[Math.min(index, facility3DSteps.length - 1)]
  const distance = compact ? 42 : index === 0 ? 40 : 35
  return {
    target: step.focus,
    position: add(step.focus, scale(ISO_DIRECTION, distance)),
    fov: 26,
    filmOffset: compact ? 0 : 5,
    focus: step.id,
  }
}

export function shotFor(slideId: string, step: number, compact = false): Shot | null {
  if (slideId === 'mapa') return facilityShot(Math.max(0, step), compact)
  return null
}
