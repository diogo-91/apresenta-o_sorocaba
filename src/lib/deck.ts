export type DeckAction = 'next' | 'prev' | 'first' | 'last'

const KEY_ACTIONS: Record<string, DeckAction> = {
  ArrowRight: 'next',
  ArrowDown: 'next',
  PageDown: 'next',
  ' ': 'next',
  ArrowLeft: 'prev',
  ArrowUp: 'prev',
  PageUp: 'prev',
  Home: 'first',
  End: 'last',
}

const WHEEL_IDLE_RESET = 250
const INERTIA_EXTENSION = 200

export function clampIndex(index: number, total: number) {
  return Math.min(total - 1, Math.max(0, index))
}

export function slideIndexFromHash(hash: string, ids: string[]) {
  const index = ids.indexOf(hash.replace(/^#/, ''))
  return index === -1 ? 0 : index
}

export function keyAction(key: string): DeckAction | null {
  return KEY_ACTIONS[key] ?? null
}

export function createWheelGate({ threshold, cooldown }: { threshold: number; cooldown: number }) {
  let accumulated = 0
  let lastEvent = -Infinity
  let lockedUntil = -Infinity

  return (deltaY: number, now: number): -1 | 0 | 1 => {
    const idle = now - lastEvent > WHEEL_IDLE_RESET
    lastEvent = now
    if (now < lockedUntil) {
      lockedUntil = Math.max(lockedUntil, now + INERTIA_EXTENSION)
      return 0
    }
    if (idle) accumulated = 0
    accumulated += deltaY
    if (Math.abs(accumulated) < threshold) return 0
    const direction = accumulated > 0 ? 1 : -1
    accumulated = 0
    lockedUntil = now + cooldown
    return direction
  }
}

export type DeckPosition = { index: number; step: number }

export function advance(position: DeckPosition, stepsPerSlide: number[], delta: 1 | -1): DeckPosition {
  const { index, step } = position
  const steps = stepsPerSlide[index]
  if (delta === 1) {
    if (step < steps - 1) return { index, step: step + 1 }
    if (index < stepsPerSlide.length - 1) return { index: index + 1, step: 0 }
    return position
  }
  if (step > 0) return { index, step: step - 1 }
  if (index > 0) return { index: index - 1, step: stepsPerSlide[index - 1] - 1 }
  return position
}
