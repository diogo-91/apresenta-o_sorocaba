import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'primary' | 'outline' | 'ghost'

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-ink hover:bg-fg',
  outline: 'border border-line-strong text-fg hover:border-fg hover:bg-fg/5',
  ghost: 'text-fg hover:bg-fg/5',
}

type Props = ComponentPropsWithoutRef<'a'> & {
  variant?: Variant
  icon?: ReactNode
  disabled?: boolean
}

export function ButtonLink({ variant = 'outline', icon, children, className = '', disabled, href, ...rest }: Props) {
  const divider = variant === 'primary' ? 'border-ink/25' : 'border-line-strong'
  return (
    <a
      {...rest}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      className={`group inline-flex min-h-12 items-stretch text-sm font-medium transition-colors duration-300 ease-mech ${variants[variant]} ${disabled ? 'pointer-events-none opacity-55' : ''} ${className}`}
    >
      <span className="flex flex-1 items-center px-5 py-3">{children}</span>
      <span className={`flex w-12 items-center justify-center border-l ${divider}`}>
        <span className="transition-transform duration-300 ease-mech group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          {icon ?? <ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" />}
        </span>
      </span>
    </a>
  )
}
