import type { TechnicalFront } from '../data/services'
import { Screen, titleId } from '../components/layout/Screen'
import { FrontGlyph } from '../components/technical/FrontGlyph'
import { Headline } from '../components/ui/Headline'
import { Pending } from '../components/ui/Pending'
import { PhotoSlot } from '../components/ui/PhotoSlot'
import { Reveal } from '../components/motion/Reveal'

export function FrontScreen({ front, index }: { front: TechnicalFront; index: number }) {
  const mirrored = index % 2 === 1
  return (
    <Screen id={front.id} tone={mirrored ? 'deep' : 'paper'}>
      <div className="mb-6 flex items-center gap-4">
        <FrontGlyph id={front.id} className="h-9 w-auto text-blueprint" />
        <p className="label-mono text-blueprint">
          Frente {front.code} <span className="text-faint">/</span> <span className="text-fg">{front.name}</span>
        </p>
      </div>

      <div className="grid flex-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className={`flex flex-col lg:col-span-7 ${mirrored ? 'lg:order-2' : ''}`}>
          <Headline id={titleId(front.id)} text={front.headline} className="max-w-[16ch]" />
          <Reveal delay={0.15}>
            <p className="lede mt-5 max-w-[46ch]">{front.description}</p>
          </Reveal>

          <ol className="mt-8 border-t border-line">
            {front.services.map((service, i) => (
              <Reveal as="li" key={service.name} delay={0.06 * i} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-3 sm:grid-cols-[2.5rem_14rem_1fr]">
                <span className="label-mono pt-1 text-faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-xl font-semibold tracking-tight">{service.name}</span>
                <span className="col-start-2 mt-1 text-sm leading-relaxed text-muted sm:col-start-3 sm:mt-0 sm:pt-1">{service.detail}</span>
              </Reveal>
            ))}
          </ol>
        </div>

        <div className={`flex flex-col gap-5 lg:col-span-5 ${mirrored ? 'lg:order-1' : ''}`}>
          <Reveal>
            <PhotoSlot src={front.photo.src} alt={front.photo.alt} caption={front.photo.caption} code={`IMG-${front.code}`} className="aspect-[4/3] lg:aspect-[16/10]" />
          </Reveal>

          <Reveal delay={0.1} className="grid border-l border-t border-line sm:grid-cols-2">
            <div className="border-b border-r border-line bg-paper-2 p-5">
              <h3 className="label-mono text-alert">Riscos evitados</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {front.risks.map((risk) => (
                  <li key={risk} className="flex gap-2.5 text-sm leading-snug text-fg/85">
                    <span aria-hidden="true" className="mt-[0.45rem] size-1.5 shrink-0 bg-alert" />
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4 border-b border-r border-line bg-paper-2 p-5">
              <div>
                <h3 className="label-mono text-muted">Normas aplicáveis</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  {front.norms.length ? front.norms.map((n) => <span key={n} className="label-mono border border-line-strong px-2 py-1">{n}</span>) : <Pending value={null} />}
                </div>
              </div>
              <div className="border-t border-line pt-4">
                <h3 className="label-mono text-muted">Mini case</h3>
                <p className="mt-2 text-sm">
                  <Pending value={front.miniCase.title} />
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Screen>
  )
}
