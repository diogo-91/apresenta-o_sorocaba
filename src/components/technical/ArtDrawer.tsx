import { useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { artLifecycle, type ArtRecord } from '../../data/arts'
import { useDialog } from '../../hooks/useDialog'
import { DURATION, EASE_MECH, EASE_OUT } from '../../lib/motion'
import { Pending } from '../ui/Pending'

export function ArtDrawer({ record, onClose }: { record: ArtRecord | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(record !== null, onClose, panel)

  const fields = record
    ? [
        { label: 'Número da ART', value: record.number, key: true },
        { label: 'Categoria', value: record.category, key: false },
        { label: 'Atividade', value: record.serviceType, key: true },
        { label: 'Data', value: record.period, key: true },
        { label: 'Responsável técnico', value: record.engineer, key: true },
        { label: 'CREA', value: record.crea, key: true },
      ]
    : []
  const keyed = fields.filter((f) => f.key)

  return (
    <AnimatePresence>
      {record && (
        <m.div key="art-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.fast }}>
          <button type="button" aria-label="Fechar documento" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-fg/40" />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="art-drawer-title"
            className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-y-auto border border-line-strong bg-paper shadow-2xl"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: DURATION.base, ease: EASE_MECH }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="label-mono text-muted">Anotação de Responsabilidade Técnica</p>
              <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-10 items-center justify-center border border-line-strong">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col gap-7 p-6 sm:p-8">
              <div>
                <p className="label-mono text-blueprint">{record.category}</p>
                <h3 id="art-drawer-title" className="mt-2 font-mono text-2xl">
                  {record.number}
                </h3>
              </div>

              <dl className="flex flex-col">
                {fields.map((f) => {
                  const delay = 0.35 + 0.18 * keyed.indexOf(f)
                  return (
                    <div key={f.label} className="relative grid grid-cols-[10rem_1fr] gap-3 border-b border-line py-3">
                      <dt className="label-mono text-faint">{f.label}</dt>
                      <dd className="text-sm">
                        <Pending value={f.value} />
                      </dd>
                      {f.key && (
                        <m.span
                          aria-hidden="true"
                          className="absolute -bottom-px left-0 h-0.5 w-full origin-left bg-accent"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.6, ease: EASE_OUT, delay }}
                        />
                      )}
                    </div>
                  )
                })}
              </dl>

              <div>
                <p className="label-mono mb-4 text-faint">Ciclo do documento</p>
                <ol className="grid grid-cols-3">
                  {artLifecycle.map((stage, i) => (
                    <li key={stage} className="relative border-t border-line-strong pt-3">
                      <span aria-hidden="true" className="absolute -top-[4px] left-0 size-[7px] border border-fg/60 bg-paper" />
                      <span className="label-mono text-muted">
                        {String(i + 1).padStart(2, '0')} {stage}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-dashed border-line-strong p-4">
                <p className="label-mono text-faint">Verificação</p>
                <p className="mt-2 text-sm text-muted">
                  {record.verificationUrl ? (
                    <a href={record.verificationUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-fg">
                      Consultar registro
                    </a>
                  ) : (
                    <Pending value="[LINK DE CONSULTA A CONFIRMAR]" />
                  )}
                </p>
              </div>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
