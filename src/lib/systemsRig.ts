export type Point = [number, number]

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

export function switchOn(progress: number, at: number) {
  return clamp((progress - at) * 4 + 1, 0, 1)
}

export function cumulative(points: Point[]) {
  const out = [0]
  for (let i = 1; i < points.length; i++) out.push(out[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]))
  return out
}

export function pointAt(points: Point[], cum: number[], distance: number): Point {
  const d = clamp(distance, 0, cum[cum.length - 1])
  let i = 1
  while (i < cum.length - 1 && cum[i] < d) i++
  const span = cum[i] - cum[i - 1] || 1
  const t = (d - cum[i - 1]) / span
  return [points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t, points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t]
}

export function headDistance(progress: number, stages: number[], dists: number[]) {
  if (progress <= stages[0]) return dists[0]
  for (let i = 1; i < stages.length; i++) {
    if (progress <= stages[i]) return dists[i - 1] + ((progress - stages[i - 1]) / (stages[i] - stages[i - 1])) * (dists[i] - dists[i - 1])
  }
  return dists[dists.length - 1]
}

type Circle = { x: number; y: number; r: number }

export function beltPath(a: Circle, b: Circle) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const d = Math.hypot(dx, dy)
  const u = [dx / d, dy / d]
  const n = [-u[1], u[0]]
  const sin = (b.r - a.r) / d
  const cos = Math.sqrt(1 - sin * sin)
  const m1 = [n[0] * cos - u[0] * sin, n[1] * cos - u[1] * sin]
  const m2 = [-n[0] * cos - u[0] * sin, -n[1] * cos - u[1] * sin]
  const f = (v: number) => v.toFixed(2)
  const p = (c: Circle, m: number[]) => `${f(c.x + c.r * m[0])} ${f(c.y + c.r * m[1])}`
  return `M${p(a, m1)} L${p(b, m1)} A${b.r} ${b.r} 0 ${sin > 0 ? 1 : 0} 0 ${p(b, m2)} L${p(a, m2)} A${a.r} ${a.r} 0 ${sin > 0 ? 0 : 1} 0 ${p(a, m1)} Z`
}
