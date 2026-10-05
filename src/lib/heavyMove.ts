export const NUDGE = 0.012

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

export function ramp(p: number, from: number, to: number) {
  return clamp01((p - from) / (to - from))
}

export function machinePose(p: number) {
  const lift = smooth(ramp(p, 2, 3)) - smooth(ramp(p, 4, 4.6))
  const travel = (1 + NUDGE) * smooth(ramp(p, 3, 4)) - NUDGE * smooth(ramp(p, 4.6, 5))
  return { travel: Math.round(travel * 1e6) / 1e6, lift: Math.round(lift * 1e6) / 1e6 }
}
