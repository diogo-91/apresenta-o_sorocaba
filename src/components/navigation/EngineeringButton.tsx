import { whatsappHref } from '../../data/company'
import { cta } from '../../data/content'

export function EngineeringButton({ className = '' }: { className?: string }) {
  const href = whatsappHref()
  return (
    <a
      href={href ?? '#parceria'}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener noreferrer' : undefined}
      className={`group inline-flex min-h-11 items-center gap-3 border border-line-strong bg-paper/70 px-4 text-sm font-medium text-fg transition-colors duration-300 ease-mech hover:border-fg ${className}`}
    >
      <span className="relative flex size-2">
        <span className="absolute inset-0 animate-ping bg-accent/60 motion-reduce:hidden" />
        <span className="relative size-2 bg-accent" />
      </span>
      {cta.engineering}
    </a>
  )
}
