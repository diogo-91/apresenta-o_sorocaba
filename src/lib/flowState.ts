export const STAGE_FUTURE = 0.4
export const STAGE_PAST = 0.65

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

export function flowStage(stage: number, index: number, count: number) {
  if (stage > count) return { opacity: 1, scale: 1, active: false, reached: true }
  const active = stage === index + 1
  const reached = stage >= index + 1
  return { opacity: active ? 1 : reached ? STAGE_PAST : STAGE_FUTURE, scale: active ? 1 : 0.97, active, reached }
}

export function flowLine(progress: number, count: number) {
  return clamp01((progress - 1) / (count - 1))
}
