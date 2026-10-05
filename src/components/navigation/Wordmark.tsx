import { company } from '../../data/company'

export function Wordmark({ className = '' }: { className?: string }) {
  if (company.logoSrc) return <img src={company.logoSrc} alt={company.name} className={`h-6 w-auto ${className}`} />
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden="true" className="relative block size-5 border-[1.5px] border-fg">
        <span className="absolute -bottom-px -right-px size-2 bg-accent" />
      </span>
      <span className="font-display text-[0.95rem] font-bold uppercase tracking-[0.06em]">{company.name}</span>
    </span>
  )
}
