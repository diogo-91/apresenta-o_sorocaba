import { useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { firstScreenOfGroup, menuGroups, pad2, screenMeta } from '../../data/screens'
import { useActiveScreen } from '../../hooks/useActiveScreen'
import { useDialog } from '../../hooks/useDialog'
import { DURATION, EASE_MECH } from '../../lib/motion'
import { scrollToScreen } from '../../lib/scroll'
import { EngineeringButton } from './EngineeringButton'

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const active = useActiveScreen()
  const activeGroup = screenMeta(active).group
  const panel = useRef<HTMLDivElement>(null)

  useDialog(open, onClose, panel)

  return (
    <AnimatePresence>
      {open && (
        <m.div
          id="menu-mobile"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu da apresentação"
          className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-ink lg:hidden"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: DURATION.base, ease: EASE_MECH }}
        >
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex h-16 items-center justify-between border-b border-line px-5">
            <span className="label-mono text-muted">Índice</span>
            <button type="button" onClick={onClose} aria-label="Fechar menu" className="flex size-11 items-center justify-center border border-line-strong">
              <X size={20} strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Seções" className="relative flex-1 overflow-y-auto px-5 py-6">
            <ol>
              {menuGroups.map((group, i) => {
                const target = firstScreenOfGroup(group.id)
                const isActive = group.id === activeGroup
                return (
                  <li key={group.id} className="border-b border-line">
                    <a
                      href={`#${target}`}
                      onClick={(e) => {
                        e.preventDefault()
                        onClose()
                        requestAnimationFrame(() => scrollToScreen(target))
                      }}
                      aria-current={isActive ? 'step' : undefined}
                      className="flex items-baseline gap-4 py-3.5"
                    >
                      <span className={`label-mono w-6 ${isActive ? 'text-accent' : 'text-faint'}`}>{pad2(i + 1)}</span>
                      <span className={`font-display text-[1.75rem] font-bold leading-none tracking-tight ${isActive ? 'text-fg' : 'text-fg/75'}`}>
                        {group.label}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </nav>
          <div className="relative border-t border-line p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <EngineeringButton className="w-full justify-center" />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
