import { fragmentation } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { SystemGraph } from '../components/technical/SystemGraph'
import { Headline } from '../components/ui/Headline'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/motion/Reveal'

export function FragmentationSection() {
  return (
    <Screen id="desafio" grid>
      <div className="grid flex-1 items-center lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <Eyebrow tone="accent" className="mb-6">
            O problema
          </Eyebrow>
          <Headline id={titleId('desafio')} text={fragmentation.headline} className="max-w-[15ch]" />
          <Reveal delay={0.2}>
            <p className="lede mt-8 max-w-[42ch]">{fragmentation.subheadline}</p>
          </Reveal>
        </div>
      </div>
      <Reveal className="mt-12 lg:hidden">
        <SystemGraph state="fragmented" />
      </Reveal>
    </Screen>
  )
}
