import { useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { menuGroups, pad2, screens } from '../../data/screens'
import { useDialog } from '../../hooks/useDialog'
import { DURATION, EASE_MECH } from '../../lib/motion'

type Props = { open: boolean; onClose: () => void; activeId: string; onSelect: (index: number) => void }

export function DeckIndex({ open, onClose, activeId, onSelect }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(open, onClose, panel)

  return (
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.fast }}>
          <button type="button" tabIndex={-1} aria-label="Fechar índice" onClick={onClose} className="absolute inset-0 bg-fg/30" />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Índice de slides"
            className="relative flex h-full w-full max-w-md flex-col border-l border-line-strong bg-paper"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.base, ease: EASE_MECH }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="label-mono text-muted">Índice</p>
              <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-10 items-center justify-center border border-line-strong">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-6 py-4">
              {menuGroups.map((group) => {
                const items = screens.map((s, i) => ({ ...s, i })).filter((s) => s.group === group.id)
                return (
                  <div key={group.id} className="border-b border-line py-3">
                    <p className="label-mono mb-1 text-faint">{group.label}</p>
                    <ol>
                      {items.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelect(s.i)
                              onClose()
                            }}
                            aria-current={s.id === activeId ? 'page' : undefined}
                            className={`flex w-full items-baseline gap-4 py-1.5 text-left transition-colors hover:text-accent-ink ${s.id === activeId ? 'text-fg' : 'text-muted'}`}
                          >
                            <span className={`label-mono w-6 ${s.id === activeId ? 'text-accent-ink' : 'text-faint'}`}>{pad2(s.i + 1)}</span>
                            <span className="font-display text-lg font-semibold tracking-tight">{s.label}</span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                )
              })}
            </nav>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
