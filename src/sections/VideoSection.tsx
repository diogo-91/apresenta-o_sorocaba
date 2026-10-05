import { video } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { VideoPlayer } from '../components/technical/VideoPlayer'
import { Headline } from '../components/ui/Headline'
import { Reveal } from '../components/motion/Reveal'

export function VideoSection() {
  const themes = video.subheadline
    .split('.')
    .map((t) => t.trim())
    .filter(Boolean)

  return (
    <Screen id="video" tone="deep">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <Headline id={titleId('video')} size="md" text={video.headline} className="max-w-[14ch]" />
          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-col gap-2" aria-label="Temas">
              {themes.map((t, i) => (
                <li key={t} className="flex items-baseline gap-4 border-t border-line pt-2">
                  <span className="label-mono text-faint">0{i + 1}</span>
                  <span className="font-display text-2xl font-semibold tracking-tight text-muted">{t}.</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal className="lg:col-span-8" delay={0.1}>
          <VideoPlayer
            src={video.src}
            poster={video.posterSrc}
            title={video.headline}
            durationLabel={video.durationLabel}
            fileHint={video.fileHint}
            chapters={video.chapters}
          />
        </Reveal>
      </div>
    </Screen>
  )
}
