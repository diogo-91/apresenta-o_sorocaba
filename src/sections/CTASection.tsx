import { CalendarClock, Download, Mail, MapPin, MessageCircle, Phone, Building2 } from 'lucide-react'
import { company, whatsappHref } from '../data/company'
import { cta } from '../data/content'
import { TOTAL_SCREENS } from '../data/screens'
import { Screen, titleId } from '../components/layout/Screen'
import { ButtonLink } from '../components/ui/Button'
import { Headline } from '../components/ui/Headline'
import { Pending } from '../components/ui/Pending'
import { Reveal } from '../components/motion/Reveal'
import { EngineeringButton } from '../components/navigation/EngineeringButton'

export function CTASection() {
  const { contact } = company
  const whatsapp = whatsappHref()
  const scheduleHref = contact.scheduleUrl ?? whatsapp ?? (contact.email ? `mailto:${contact.email}` : null)

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', values: [contact.whatsapp], href: whatsapp },
    { icon: Phone, label: 'Telefone', values: [contact.phone], href: contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : null },
    { icon: Mail, label: 'E-mail', values: [contact.email], href: contact.email ? `mailto:${contact.email}` : null },
    { icon: MapPin, label: 'Endereço', values: [contact.address], href: null },
    { icon: Building2, label: 'Razão social · CNPJ', values: [company.legalName, company.cnpj], href: null },
  ]
  const [sloganLead, sloganTail] = company.slogan.split('. ')

  return (
    <Screen id="parceria" tone="deep" grid>
      <div className="grid flex-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Headline id={titleId('parceria')} size="xl" text={cta.headline} className="max-w-[12ch]" />
          <Reveal delay={0.2}>
            <p className="lede mt-8 max-w-[36ch]">{cta.subheadline}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink
              variant="primary"
              href={scheduleHref ?? undefined}
              disabled={!scheduleHref}
              icon={<CalendarClock size={18} strokeWidth={1.75} aria-hidden="true" />}
              target={scheduleHref?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {cta.primary}
            </ButtonLink>
            <ButtonLink
              href={contact.dossierUrl ?? undefined}
              disabled={!contact.dossierUrl}
              download
              icon={<Download size={18} strokeWidth={1.75} aria-hidden="true" />}
            >
              {cta.secondary}
            </ButtonLink>
          </Reveal>
          {(!scheduleHref || !contact.dossierUrl) && (
            <p className="mt-4 text-xs text-faint">
              <Pending value="[LINKS DE AGENDAMENTO E DOSSIÊ A CONFIRMAR]" />
            </p>
          )}
        </div>

        <Reveal delay={0.15} className="lg:col-span-5">
          <div className="border border-line bg-ink/60">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="label-mono text-muted">Contato técnico</p>
              <div className="hidden sm:block">
                <EngineeringButton />
              </div>
            </div>
            <ul>
              {channels.map(({ icon: Icon, label, values, href }) => (
                <li key={label} className="flex items-start gap-4 border-b border-line px-5 py-4 last:border-b-0">
                  <Icon size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-faint" aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="label-mono text-faint">{label}</p>
                    <p className="mt-1 flex flex-wrap gap-2 break-words text-sm">
                      {href && values[0] ? (
                        <a href={href} className="underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                          {values[0]}
                        </a>
                      ) : (
                        values.map((v, i) => <Pending key={i} value={v} />)
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <footer className="mt-20 border-t border-line-strong pt-8 lg:mt-24">
        <p className="display-xl max-w-[18ch] text-fg">
          {sloganLead}. <span className="text-muted">{sloganTail}</span>
        </p>
        <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-5 sm:grid-cols-4">
          {[
            ['Empresa', company.name],
            ['Documento', 'Apresentação técnica'],
            ['Revisão', company.documentRevision],
            ['Folha', `${TOTAL_SCREENS}/${TOTAL_SCREENS}`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label-mono text-faint">{k}</dt>
              <dd className="label-mono mt-1 text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      </footer>
    </Screen>
  )
}
