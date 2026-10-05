import { isPending } from '../../lib/placeholder'
import { Pending } from './Pending'

type Props = { code: string; label: string; value: string; className?: string }

export function Indicator({ code, label, value, className = '' }: Props) {
  const pending = isPending(value)
  return (
    <div className={`relative flex flex-col justify-between gap-6 border-l border-line py-1 pl-4 lg:pl-6 ${className}`}>
      <span className="label-mono text-faint">{code}</span>
      <div>
        {pending ? (
          <p aria-hidden="true" className="font-display text-[clamp(2.5rem,5vw,4.75rem)] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)]">
            [&nbsp;&nbsp;&nbsp;]
          </p>
        ) : (
          <p className="font-display text-[clamp(2.5rem,5vw,4.75rem)] font-bold leading-none tracking-tight tabular-nums">{value}</p>
        )}
        <p className="mt-3 text-sm text-fg">{label}</p>
        {pending && <Pending value={value} className="mt-2 inline-block text-[0.625rem]" />}
      </div>
    </div>
  )
}
