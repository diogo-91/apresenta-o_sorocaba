import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { screens } from '../data/screens'

export const ActiveScreenContext = createContext<string>(screens[0].id)

export function ScrollActiveScreenProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(screens[0].id)

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-slot]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive((entry.target as HTMLElement).dataset.slot!)
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return <ActiveScreenContext.Provider value={active}>{children}</ActiveScreenContext.Provider>
}

export function useActiveScreen() {
  return useContext(ActiveScreenContext)
}
