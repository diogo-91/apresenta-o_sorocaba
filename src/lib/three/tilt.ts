export type TiltLimit = { xDeg: number; yDeg: number }

export const MAX_TILT: TiltLimit = { xDeg: 4, yDeg: 7 }
export const HERO_TILT: TiltLimit = { xDeg: 2, yDeg: 3 }

const clamp = (v: number) => Math.max(-1, Math.min(1, v))
const rad = (deg: number) => (deg * Math.PI) / 180

export function tiltFromPointer(nx: number, ny: number, limit: TiltLimit = MAX_TILT) {
  return {
    x: clamp(ny) * rad(limit.xDeg) || 0,
    y: clamp(nx) * rad(limit.yDeg) || 0,
  }
}
