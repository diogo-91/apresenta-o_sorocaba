export const TBC = '[A CONFIRMAR]'

export type Pending = typeof TBC

export function isPending(value: string | null | undefined): boolean {
  return value == null || value.trim() === '' || /^\[.*\]$/.test(value.trim())
}
