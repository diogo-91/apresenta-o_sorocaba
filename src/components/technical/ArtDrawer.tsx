import { useRef } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { X } from 'lucide-react'
import { artLifecycle, type ArtRecord } from '../../data/arts'
import { useDialog } from '../../hooks/useDialog'
import { DURATION, EASE_MECH } from '../../lib/motion'
import { Pending } from '../ui/Pending'

export function ArtDrawer({ record, onClose }: { record: ArtRecord | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  useDialog(record !== null, onClose, panel)

  const fields = record
    ? [
        { label: 'Número da ART', value: record.number },
        { label: 'Categoria', value: record.category },
        { label: 'Mês/ano', value: record.period },
        { label: 'Tipo de serviço', value: record.serviceType },
        { label: 'Responsável técnico', value: record.engineer },
        { label: 'CREA', value: record.crea },
      ]
    : []

  return (
    <AnimatePresence>
      {record && (
        <m.div key="art-overlay" className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.fast }}>
          <button type="button" aria-label="Fechar detalhe" tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/75" />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="art-drawer-title"
            className="relative mt-auto flex max-h-[88svh] w-full flex-col overflow-y-auto border-t border-line-strong bg-ink-2 sm:mt-0 sm:h-full sm:max-h-none sm:max-w-md sm:border-l sm:border-t-0"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.base, ease: EASE_MECH }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <p className="label-mono text-muted">Anotação de Responsabilidade Técnica</p>
              <button type="button" onClick={onClose} aria-label="Fechar" className="flex size-10 items-center justify-center border border-line-strong">
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col gap-8 p-6">
              <div>
                <p className="label-mono text-blueprint">{record.category}</p>
                <h3 id="art-drawer-title" className="mt-2 font-mono text-2xl">
                  {record.number}
                </h3>
              </div>

              <dl className="grid gap-px bg-line">
                {fields.map((f) => (
                  <div key={f.label} className="grid grid-cols-[9.5rem_1fr] gap-3 bg-ink-2 py-3">
                    <dt className="label-mono text-faint">{f.label}</dt>
                    <dd className="text-sm">
                      <Pending value={f.value} />
                    </dd>
                  </div>
                ))}
              </dl>

              <div>
                <p className="label-mono mb-4 text-faint">Ciclo do documento</p>
                <ol className="grid grid-cols-3">
                  {artLifecycle.map((stage, i) => (
                    <li key={stage} className="relative border-t border-line-strong pt-3">
                      <span aria-hidden="true" className="absolute -top-[4px] left-0 size-[7px] border border-fg/60 bg-ink-2" />
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
                    <a href={record.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-fg underline underline-offset-4">
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
