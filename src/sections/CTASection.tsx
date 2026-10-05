import { ArrowUpRight, Download } from 'lucide-react'
import { company, whatsappHref } from '../data/company'
import { cta } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { BlueprintPlant } from '../components/technical/BlueprintPlant'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'
import { WordReveal } from '../components/motion/WordReveal'

export function CTASection() {
  const { contact } = company
  const whatsapp = whatsappHref()
  const scheduleHref = contact.scheduleUrl ?? whatsapp ?? (contact.email ? `mailto:${contact.email}` : null)
  const channels = [
    { label: 'WhatsApp', value: contact.whatsapp, href: whatsapp },
    { label: 'Telefone', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : null },
    { label: 'E-mail', value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
    { label: 'Endereço', value: contact.address, href: null },
    { label: 'CNPJ', value: company.cnpj, href: null },
  ]

  return (
    <Screen
      id="parceria"
      theme="dark"
      tone="none"
      className="grain bg-[#07090b]"
      background={
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <BlueprintPlant className="absolute inset-0 size-full scale-125 text-[#5fb0e6] opacity-[0.08] blur-[2px] motion-safe:animate-[drift_60s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_20%,#07090b_80%)]" />
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <h2 id={titleId('parceria')} className="font-display font-bold leading-[0.88] tracking-[-0.04em] [font-stretch:78%] text-[clamp(3rem,13vw,5rem)] lg:text-[9rem]">
          <WordReveal text={cta.headline} />
        </h2>
        <Reveal delay={0.5}>
          <p className="lede mt-8 max-w-[36ch] lg:text-2xl">{cta.subheadline}</p>
        </Reveal>
        <Reveal delay={0.7} className="mt-12 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <a
            href={scheduleHref ?? '#parceria'}
            aria-disabled={!scheduleHref || undefined}
            target={scheduleHref?.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            data-magnetic
            className="group inline-flex min-h-14 items-center gap-5 bg-accent px-8 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-night-fg"
            style={{ color: '#0e1114' }}
          >
            {cta.primary}
            <ArrowUpRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={whatsapp ?? '#parceria'} target={whatsapp ? '_blank' : undefined} rel="noopener noreferrer" className="link-underline label-mono pb-1 text-fg">
            {cta.engineering}
          </a>
          {contact.dossierUrl && (
            <a href={contact.dossierUrl} download className="link-underline label-mono inline-flex items-center gap-2 pb-1 text-muted">
              <Download size={14} aria-hidden="true" /> {cta.secondary}
            </a>
          )}
        </Reveal>
        {!scheduleHref && (
          <p className="mt-4 text-xs text-faint">
            <Pending value="[LINK DE AGENDAMENTO A CONFIRMAR]" />
          </p>
        )}
      </div>

      <Reveal delay={0.9}>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 sm:grid-cols-5">
          {channels.map((c) => (
            <div key={c.label}>
              <dt className="label-mono text-faint">{c.label}</dt>
              <dd className="mt-1 text-sm">
                {c.href && c.value ? (
                  <a href={c.href} className="link-underline">
                    {c.value}
                  </a>
                ) : (
                  <Pending value={c.value} />
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Screen>
  )
}
