export function Dimension({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center gap-3 text-faint ${className}`}>
      <span className="h-3 w-px bg-current" />
      <span className="h-px flex-1 bg-current" />
      <span className="label-mono shrink-0 text-[0.625rem]">{label}</span>
      <span className="h-px flex-1 bg-current" />
      <span className="h-3 w-px bg-current" />
    </div>
  )
}
