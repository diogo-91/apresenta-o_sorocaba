export type ScreenBox = { top: number; height: number }
export type Direction = 'up' | 'down'

const TOLERANCE = 2
const STEP_RATIO = 0.85
const SLACK = 72

function currentIndex(screens: ScreenBox[], scrollY: number) {
  let index = 0
  screens.forEach((screen, i) => {
    if (screen.top <= scrollY + TOLERANCE) index = i
  })
  return index
}

export function nextScrollTarget(
  direction: Direction,
  screens: ScreenBox[],
  scrollY: number,
  viewportHeight: number,
): number | null {
  if (screens.length === 0) return null
  const index = currentIndex(screens, scrollY)
  const current = screens[index]
  const step = viewportHeight * STEP_RATIO
  const atTop = Math.abs(scrollY - current.top) <= TOLERANCE
  const position = atTop ? current.top : scrollY

  if (direction === 'down') {
    const bottom = current.top + current.height
    if (bottom > position + viewportHeight + SLACK) {
      return Math.min(position + step, bottom - viewportHeight)
    }
    const next = screens[index + 1]
    return next ? next.top : null
  }

  if (!atTop) {
    return Math.max(current.top, position - step)
  }
  const previous = screens[index - 1]
  if (!previous) return null
  if (previous.height - viewportHeight <= SLACK) return previous.top
  return previous.top + previous.height - viewportHeight
}
