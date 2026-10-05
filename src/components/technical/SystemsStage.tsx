import { systemsCopy, systemsDisciplines, SYSTEMS_FINAL } from '../../data/systemsFlow'
import { SystemsRig } from './SystemsRig'

const fade = 'transition-[opacity,transform] duration-700 ease-mech motion-reduce:transition-opacity'

function Summary({ visible }: { visible: boolean }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-10">
      {systemsDisciplines.map((d, i) => (
        <div
          key={d.id}
          className={`${fade} border-t-2 pt-2 ${d.id === 'eletrica' ? 'border-accent lg:order-1' : 'border-blueprint lg:order-3'} ${visible ? 'opacity-100' : 'translate-y-1 opacity-0'}`}
          style={{ transitionDelay: visible ? `${200 + i * 120}ms` : '0ms' }}
        >
          <p className={`label-mono ${d.id === 'eletrica' ? 'text-accent-ink' : 'text-blueprint'}`}>{d.title}</p>
          <p className="mt-1.5 text-sm text-fg/85">{d.items.join(' · ')}</p>
        </div>
      ))}
      <p className={`${fade} font-display text-base font-bold uppercase leading-tight tracking-tight [font-stretch:85%] lg:order-2 lg:pt-2 lg:text-center ${visible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: visible ? '500ms' : '0ms' }}>
        {systemsCopy.closing.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  )
}

export function SystemsDeck({ stage }: { stage: number }) {
  const final = stage >= SYSTEMS_FINAL
  return (
    <div className="flex flex-col">
      <SystemsRig layout="wide" stage={Math.min(stage, SYSTEMS_FINAL)} />
      <div className="mt-1" aria-hidden={!final}>
        <Summary visible={final} />
      </div>
    </div>
  )
}

export function SystemsMobile() {
  return (
    <div className="mt-8">
      <SystemsRig layout="tall" className="-mx-2" />
      <div className="mt-8">
        <Summary visible />
      </div>
    </div>
  )
}
