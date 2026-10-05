import { useEffect, useRef } from 'react'

export type PointerState = { x: number; y: number; active: boolean }

export function usePointerParallax(enabled: boolean) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, active: false })

  useEffect(() => {
    if (!enabled) {
      pointer.current = { x: 0, y: 0, active: false }
      return
    }
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
      pointer.current.active = true
    }
    const reset = () => {
      pointer.current.x = 0
      pointer.current.y = 0
      pointer.current.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [enabled])

  return pointer
}
