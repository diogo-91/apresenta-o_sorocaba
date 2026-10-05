import { useEffect } from 'react'
import { nextScrollTarget, type Direction } from '../lib/navigation'
import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from './useMediaQuery'

const KEYS: Record<string, Direction> = {
  ArrowDown: 'down',
  PageDown: 'down',
  ArrowUp: 'up',
  PageUp: 'up',
}

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.getAttribute('role') === 'slider'
}

export function useKeyboardNav() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const direction = KEYS[event.key]
      if (!direction || event.defaultPrevented) return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (isEditable(event.target) || document.querySelector('[aria-modal="true"]')) return
      if (!window.matchMedia(DESKTOP_QUERY).matches) return

      const boxes = Array.from(document.querySelectorAll<HTMLElement>('[data-screen]')).map((el) => {
        const rect = el.getBoundingClientRect()
        return { top: rect.top + window.scrollY, height: rect.height }
      })
      const target = nextScrollTarget(direction, boxes, window.scrollY, window.innerHeight)
      if (target === null) return

      event.preventDefault()
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches
      window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
