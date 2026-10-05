import type { ReactNode } from 'react'
import { screenMeta, pad2, TOTAL_SCREENS } from '../../data/screens'

type Props = {
  id: string
  children: ReactNode
  tone?: 'ink' | 'deep' | 'surface' | 'none'
  grid?: boolean
  meta?: boolean
  className?: string
  innerClassName?: string
}

const tones = {
  ink: 'bg-ink',
  deep: 'bg-ink-2',
  surface: 'bg-surface',
  none: '',
}

export function titleId(id: string) {
  return `${id}-title`
}

export function Screen({ id, children, tone = 'ink', grid = false, meta = true, className = '', innerClassName = '' }: Props) {
  return (
    <section id={id} data-screen aria-labelledby={titleId(id)} className={`relative min-h-svh lg:snap-start ${tones[tone]} ${className}`}>
      {grid && (
        <div
          aria-hidden="true"
          className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        />
      )}
      <div className={`relative mx-auto flex min-h-svh w-full max-w-[1520px] flex-col px-5 pb-16 pt-20 md:px-10 lg:pb-16 lg:pl-16 lg:pr-32 lg:pt-24 ${innerClassName}`}>
        {meta && <ScreenMeta id={id} />}
        {children}
      </div>
    </section>
  )
}

export function ScreenMeta({ id }: { id: string }) {
  const meta = screenMeta(id)
  return (
    <div className="mb-10 flex items-center gap-4 border-b border-line pb-3 lg:mb-14" aria-hidden="true">
      <span className="label-mono text-fg">
        {pad2(meta.number)}
        <span className="text-faint">/{TOTAL_SCREENS}</span>
      </span>
      <span className="h-px w-6 bg-line-strong" />
      <span className="label-mono text-muted">{meta.label}</span>
      <span className="label-mono ml-auto hidden text-faint sm:inline">{meta.act}</span>
    </div>
  )
}
