import { useSyncExternalStore } from 'react'

let selected: string | null = null
const listeners = new Set<() => void>()

export function setFacilitySelection(id: string | null) {
  if (id === selected) return
  selected = id
  listeners.forEach((l) => l())
}

export function useFacilitySelection() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => selected,
    () => null,
  )
}
