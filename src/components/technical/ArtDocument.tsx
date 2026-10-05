import type { ArtRecord } from '../../data/arts'

export function ArtDocument({ record }: { record: ArtRecord }) {
  return (
    <div className="relative flex size-full flex-col border border-line-strong bg-paper p-4 shadow-[0_18px_40px_-24px_rgb(14_17_20/0.45)]">
      <span aria-hidden="true" className="absolute right-0 top-0 size-6 bg-[linear-gradient(225deg,var(--color-paper-2)_50%,var(--color-line-strong)_50%)]" />
      <div className="flex items-center justify-between gap-3 border-b border-line pb-2 pr-6">
        <span className="label-mono text-blueprint">ART · {record.category}</span>
        <span className="label-mono text-faint">{record.period}</span>
      </div>
      <span className="mt-3 font-mono text-base text-fg">{record.number}</span>
      <div aria-hidden="true" className="mt-3 flex flex-col gap-1.5">
        <span className="h-1 w-11/12 bg-surface" />
        <span className="h-1 w-8/12 bg-surface" />
        <span className="h-1 w-10/12 bg-surface" />
      </div>
      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <span className="flex flex-col text-[0.6875rem] leading-tight text-muted">
          <span>{record.engineer}</span>
          <span className="font-mono">{record.crea}</span>
        </span>
        {record.placeholder && <span className="label-mono -rotate-6 border border-accent/60 px-1.5 py-0.5 text-[0.5625rem] text-accent-ink">Slot vazio</span>}
      </div>
    </div>
  )
}
