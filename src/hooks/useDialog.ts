import { useEffect, type RefObject } from 'react'

const SCROLL_KEYS = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']

export function useDialog(open: boolean, onClose: () => void, panel: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const overflow = root.style.overflow
    root.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('button, a[href]')?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (!panel.current) return
      if (SCROLL_KEYS.includes(e.key) && panel.current.scrollHeight <= panel.current.clientHeight) e.preventDefault()
      if (e.key !== 'Tab') return
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      root.style.overflow = overflow
      previous?.focus()
    }
  }, [open, onClose, panel])
}
