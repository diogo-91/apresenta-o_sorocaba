export const MAX_TILT = { xDeg: 4, yDeg: 7 }

const clamp = (v: number) => Math.max(-1, Math.min(1, v))
const rad = (deg: number) => (deg * Math.PI) / 180

export function tiltFromPointer(nx: number, ny: number) {
  return {
    x: clamp(ny) * rad(MAX_TILT.xDeg) || 0,
    y: clamp(nx) * rad(MAX_TILT.yDeg) || 0,
  }
}
