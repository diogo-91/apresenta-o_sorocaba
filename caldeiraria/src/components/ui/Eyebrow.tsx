import type { ReactNode } from 'react'

export function Eyebrow({ children, tone = 'muted', className = '' }: { children: ReactNode; tone?: 'muted' | 'accent' | 'blueprint'; className?: string }) {
  const color = { muted: 'text-muted', accent: 'text-accent-ink', blueprint: 'text-blueprint' }[tone]
  return <p className={`label-mono ${color} ${className}`}>{children}</p>
}
