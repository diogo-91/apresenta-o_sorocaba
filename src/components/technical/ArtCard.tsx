import type { ArtRecord } from '../../data/arts'
import { Pending } from '../ui/Pending'

export function ArtCard({ record, onOpen }: { record: ArtRecord; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="group relative flex h-full w-full flex-col bg-paper p-4 text-left transition-colors duration-300 ease-mech hover:bg-surface"
    >
      <span aria-hidden="true" className="absolute right-0 top-0 size-6 bg-[linear-gradient(225deg,var(--color-paper-2)_50%,var(--color-line-strong)_50%)]" />
      <span className="flex items-center justify-between gap-3 pr-6">
        <span className="label-mono text-blueprint">{record.category}</span>
        <span className="label-mono text-faint">{record.period}</span>
      </span>
      <span className="mt-4 font-mono text-base tracking-tight text-fg">{record.number}</span>
      <span className="mt-2 text-sm text-muted">
        <span className="text-faint">Serviço · </span>
        <Pending value={record.serviceType} />
      </span>
      <span className="mt-4 flex flex-col gap-0.5 border-t border-line pt-3 text-xs text-muted">
        <span>{record.engineer}</span>
        <span className="font-mono">{record.crea}</span>
      </span>
      {record.placeholder && (
        <span className="label-mono mt-3 self-start border border-dashed border-line-strong px-2 py-0.5 text-[0.625rem] text-faint">
          Slot · aguardando documento
        </span>
      )}
      <span className="label-mono mt-3 text-fg/70 transition-colors group-hover:text-accent-ink">Ver detalhe →</span>
    </button>
  )
}
