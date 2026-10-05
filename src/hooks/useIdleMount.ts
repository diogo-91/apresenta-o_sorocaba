import { useEffect, useState } from 'react'

export function useIdleMount(timeout = 1200) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(() => setReady(true), 300)
    return () => clearTimeout(id)
  }, [timeout])
  return ready
}
