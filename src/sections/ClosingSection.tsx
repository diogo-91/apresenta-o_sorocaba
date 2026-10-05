import { company } from '../data/company'
import { TOTAL_SCREENS } from '../data/screens'
import { titleId } from '../components/layout/Screen'
import { Logo } from '../components/ui/Logo'
import { WordReveal } from '../components/motion/WordReveal'
import { usePresentationMode } from '../hooks/usePresentationMode'

export function ClosingSection() {
  const deck = usePresentationMode() === 'deck'
  const [lead, tail] = company.slogan.split('. ')
  const sheet = [
    ['Empresa', company.name],
    ['Documento', 'Apresentação técnica'],
    ['Revisão', company.documentRevision],
    ['Folha', `${TOTAL_SCREENS}/${TOTAL_SCREENS}`],
  ]

  return (
    <section
      id="encerramento"
      data-screen
      aria-labelledby={titleId('encerramento')}
      className={`relative overflow-hidden bg-night text-night-fg ${deck ? 'h-full' : 'min-h-svh'}`}
    >
      <div aria-hidden="true" className="blueprint-grid absolute inset-0 opacity-70" />
      <div className={`relative flex h-full flex-col justify-between ${deck ? 'px-24 py-16' : 'min-h-svh gap-16 px-5 pb-16 pt-24'}`}>
        <Logo tone="light" className={deck ? 'h-16' : 'h-12'} />
        <h2 id={titleId('encerramento')} className="display-xl max-w-[16ch]">
          <WordReveal text={`${lead}.`} />
          <span className="text-night-fg/55">
            <WordReveal text={tail} delay={0.3} />
          </span>
        </h2>
        <dl className="grid grid-cols-2 gap-6 border-t border-night-fg/20 pt-5 sm:grid-cols-4">
          {sheet.map(([k, v]) => (
            <div key={k}>
              <dt className="label-mono text-night-fg/50">{k}</dt>
              <dd className="label-mono mt-1 text-night-fg/80">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
