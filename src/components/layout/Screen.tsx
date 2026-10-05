import type { ReactNode } from 'react'
import { company } from '../../data/company'
import { screenMeta, pad2, TOTAL_SCREENS } from '../../data/screens'
import { usePresentationMode } from '../../hooks/usePresentationMode'
import { EngineeringButton } from '../navigation/EngineeringButton'
import { Logo } from '../ui/Logo'

type Props = {
  id: string
  children: ReactNode
  tone?: 'paper' | 'deep' | 'surface' | 'none'
  grid?: boolean
  meta?: boolean
  className?: string
  innerClassName?: string
  background?: ReactNode
  theme?: 'light' | 'dark'
}

const tones = {
  paper: 'bg-paper',
  deep: 'bg-paper-2',
  surface: 'bg-surface',
  none: '',
}

export function titleId(id: string) {
  return `${id}-title`
}

export function Screen({ id, children, tone = 'paper', grid = false, meta = true, className = '', innerClassName = '', background, theme = 'light' }: Props) {
  const deck = usePresentationMode() === 'deck'
  return (
    <section
      id={deck ? id : undefined}
      data-screen
      aria-labelledby={titleId(id)}
      className={`relative ${deck ? 'h-full w-full overflow-hidden' : 'min-h-svh overflow-x-clip'} ${theme === 'dark' ? 'theme-dark' : ''} ${tones[tone]} ${className}`}
    >
      {background}
      {grid && (
        <div
          aria-hidden="true"
          className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"
        />
      )}
      <div
        className={
          deck
            ? `relative flex h-full flex-col px-24 pb-5 pt-7 ${innerClassName}`
            : `relative mx-auto flex min-h-svh w-full max-w-[1520px] flex-col px-5 pb-16 pt-20 md:px-10 ${innerClassName}`
        }
      >
        {meta && (deck ? <SlideHeader id={id} /> : <ScreenMeta id={id} />)}
        <div data-slide-body className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>
        {meta && deck && <SlideFooter />}
      </div>
    </section>
  )
}

function SlideHeader({ id }: { id: string }) {
  const meta = screenMeta(id)
  return (
    <header className="mb-9 flex items-center gap-6 border-b border-line pb-4">
      <Logo className="h-7" />
      <span className="h-5 w-px bg-line-strong" aria-hidden="true" />
      <span className="label-mono text-fg">
        {pad2(meta.number)}
        <span className="text-faint">/{TOTAL_SCREENS}</span>
        <span className="ml-3 text-muted">{meta.label}</span>
      </span>
      <span className="label-mono ml-auto text-faint">{meta.act}</span>
      <EngineeringButton />
    </header>
  )
}

function SlideFooter() {
  return (
    <footer className="mt-5 flex items-center gap-4 border-t border-line pt-3" aria-hidden="true">
      <span className="label-mono text-faint">{company.name} · Apresentação técnica · {company.documentRevision}</span>
    </footer>
  )
}

export function ScreenMeta({ id }: { id: string }) {
  const meta = screenMeta(id)
  return (
    <div className="mb-10 flex items-center gap-4 border-b border-line pb-3" aria-hidden="true">
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
