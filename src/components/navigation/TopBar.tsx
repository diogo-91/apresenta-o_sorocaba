import { Menu } from 'lucide-react'
import { useCallback, useState } from 'react'
import { screenMeta } from '../../data/screens'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { scrollToScreen } from '../../lib/scroll'
import { MobileDrawer } from './MobileDrawer'
import { Logo } from '../ui/Logo'

export function TopBar() {
  const active = useActiveScreen()
  const meta = screenMeta(active)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 lg:hidden">
      <div className="pointer-events-none absolute inset-0 h-16 border-b border-line bg-paper/95" />
      <div className="relative mx-auto flex h-16 max-w-[1520px] items-center gap-6 px-5 md:px-10">
        <a
          href="#capa"
          onClick={(e) => {
            e.preventDefault()
            scrollToScreen('capa')
          }}
          className="pointer-events-auto"
          aria-label="Voltar à capa"
        >
          <Logo className="h-7" />
        </a>
        <p className="label-mono hidden text-muted md:block" aria-live="polite">
          <span className="text-faint">/</span> {meta.act}
        </p>
        <div className="pointer-events-auto ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="flex size-11 items-center justify-center border border-line-strong bg-paper/70 text-fg"
          >
            <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      </div>
      <MobileDrawer open={open} onClose={close} />
    </header>
  )
}
