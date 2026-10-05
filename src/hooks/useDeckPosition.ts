import { createContext, useContext } from 'react'

export type DeckPositionValue = { id: string; step: number; steps: number }

export const DeckPositionContext = createContext<DeckPositionValue>({ id: '', step: 0, steps: 1 })

export const SlideStepContext = createContext(0)

export function useDeckPosition() {
  return useContext(DeckPositionContext)
}

export function useSlideStep() {
  return useContext(SlideStepContext)
}
