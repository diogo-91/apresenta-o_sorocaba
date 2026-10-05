import { Menu } from 'lucide-react'
import { useCallback, useState } from 'react'
import { screenMeta } from '../../data/screens'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { scrollToScreen } from '../../lib/scroll'
import { EngineeringButton } from './EngineeringButton'
import { MobileDrawer } from './MobileDrawer'
import { Wordmark } from './Wordmark'

export function TopBar() {
  const active = useActiveScreen()
  const meta = screenMeta(active)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="pointer-events-none absolute inset-0 h-24 bg-gradient-to-b from-ink/95 via-ink/60 to-transparent" />
      <div className="relative mx-auto flex h-16 max-w-[1520px] items-center gap-6 px-5 md:px-10 lg:h-20 lg:pl-16 lg:pr-32">
        <a
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            scrollToScreen('inicio')
          }}
          className="pointer-events-auto"
          aria-label="Sorocaba Motores — voltar ao início"
        >
          <Wordmark />
        </a>
        <p className="label-mono hidden text-muted md:block" aria-live="polite">
          <span className="text-faint">/</span> {meta.act}
        </p>
        <div className="pointer-events-auto ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <EngineeringButton />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center border border-line-strong bg-ink/70 text-fg lg:hidden"
          >
            <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileDrawer open={open} onClose={close} />
    </header>
  )
}
