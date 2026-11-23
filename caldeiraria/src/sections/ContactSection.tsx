import { company, whatsappHref } from '../data/company'
import { contact as copy } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { VesselBlueprint } from '../components/technical/VesselBlueprint'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'
import { WordReveal } from '../components/motion/WordReveal'

export function ContactSection() {
  const { contact } = company
  const whatsapp = whatsappHref()
  const channels = [
    { label: 'WhatsApp', value: contact.whatsapp, href: whatsapp },
    { label: 'Telefone', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : null },
    { label: 'E-mail', value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
    { label: 'Endereço', value: contact.address, href: null },
    { label: 'CNPJ', value: company.cnpj, href: null },
  ]

  return (
    <Screen
      id="contato"
      theme="dark"
      tone="none"
      className="grain bg-[#07090b]"
      background={
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <VesselBlueprint className="absolute inset-y-0 right-0 h-full w-1/2 text-[#5fb0e6] opacity-[0.12] blur-[1px] motion-safe:animate-[drift_60s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_60%,transparent_20%,#07090b_80%)]" />
        </div>
      }
    >
      <div className="flex flex-1 flex-col justify-center">
        <h2 id={titleId('contato')} className="font-display font-bold leading-[0.88] tracking-[-0.04em] [font-stretch:78%] text-[clamp(3rem,13vw,5rem)] lg:text-[9rem]">
          <WordReveal text={copy.headline} />
        </h2>
        <Reveal delay={0.5}>
          <p className="lede mt-8 max-w-[36ch] lg:text-2xl">{copy.subheadline}</p>
        </Reveal>
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
