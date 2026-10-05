import { createContext, useContext } from 'react'

export type PresentationMode = 'deck' | 'flow'

export const PresentationModeContext = createContext<PresentationMode>('flow')

export function usePresentationMode() {
  return useContext(PresentationModeContext)
}
