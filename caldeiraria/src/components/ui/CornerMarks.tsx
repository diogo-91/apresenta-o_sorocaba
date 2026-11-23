export function CornerMarks({ className = 'border-line-strong', size = 'size-3' }: { className?: string; size?: string }) {
  const base = `pointer-events-none absolute ${size} ${className}`
  return (
    <span aria-hidden="true">
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </span>
  )
}
