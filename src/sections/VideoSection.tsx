import { video } from '../data/content'
import { Screen, titleId } from '../components/layout/Screen'
import { VideoPlayer } from '../components/technical/VideoPlayer'
import { Reveal } from '../components/motion/Reveal'
import { WordReveal } from '../components/motion/WordReveal'

export function VideoSection() {
  const themes = video.subheadline
    .split('.')
    .map((t) => t.trim())
    .filter(Boolean)

  return (
    <Screen id="video" theme="dark" className="grain">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h2 id={titleId('video')} className="display-lg max-w-[18ch] lg:text-[3.5rem]">
          <WordReveal text={video.headline} />
        </h2>
        <Reveal delay={0.3} className="flex gap-6">
          {themes.map((t, i) => (
            <span key={t} className="flex items-baseline gap-2">
              <span className="label-mono text-faint">0{i + 1}</span>
              <span className="font-display text-2xl font-semibold tracking-tight text-muted">{t}</span>
            </span>
          ))}
        </Reveal>
      </div>
      <Reveal delay={0.15} className="flex-1 lg:-mx-24">
        <VideoPlayer
          src={video.src}
          poster={video.posterSrc}
          title={video.headline}
          durationLabel={video.durationLabel}
          fileHint={video.fileHint}
          chapters={video.chapters}
        />
      </Reveal>
    </Screen>
  )
}
