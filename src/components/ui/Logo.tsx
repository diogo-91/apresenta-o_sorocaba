import logoSrc from '../../assets/logo-srcb.png'
import { company } from '../../data/company'

export function Logo({ tone = 'dark', className = 'h-8' }: { tone?: 'dark' | 'light'; className?: string }) {
  return (
    <img
      src={logoSrc}
      alt={company.brandName}
      width={470}
      height={141}
      className={`w-auto self-start object-contain object-left ${tone === 'dark' ? 'brightness-0' : ''} ${className}`}
    />
  )
}
