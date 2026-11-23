export type StationState = 'done' | 'active' | 'next'

export function stationState(stage: number, index: number, count: number): StationState {
  if (stage > count) return 'done'
  if (index + 1 < stage) return 'done'
  return index + 1 === stage ? 'active' : 'next'
}

export function processProgress(stage: number, count: number) {
  return Math.min(1, Math.max(0, (stage - 1) / (count - 1)))
}
