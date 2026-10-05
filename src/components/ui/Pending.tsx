import { isPending } from '../../lib/placeholder'

export function Pending({ value, className = '' }: { value: string | null | undefined; className?: string }) {
  if (!isPending(value)) return <span className={className}>{value}</span>
  return (
    <span className={`tbc ${className}`} title="Dado pendente de confirmação">
      {value?.trim() ? value : '[A CONFIRMAR]'}
    </span>
  )
}
