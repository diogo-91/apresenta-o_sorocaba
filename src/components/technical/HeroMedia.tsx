import { hero } from '../../data/content'
import { BlueprintPlant } from './BlueprintPlant'

export function HeroMedia() {
  const { videoSrc, posterSrc } = hero.media

  if (videoSrc) {
    return (
      <video
        className="absolute inset-0 size-full object-cover"
        src={videoSrc}
        poster={posterSrc ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-paper" aria-hidden="true">
      <div className="blueprint-grid absolute inset-0" />
      <BlueprintPlant className="absolute inset-0 size-full text-blueprint opacity-70" />
    </div>
  )
}
