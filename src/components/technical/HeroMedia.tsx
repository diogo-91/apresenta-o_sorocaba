import { hero } from '../../data/content'
import { BlueprintPlant } from './BlueprintPlant'

export function HeroMedia() {
  const { videoSrc, posterSrc, placeholderLabel } = hero.media

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
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      <div className="blueprint-grid absolute inset-0 opacity-70" />
      <BlueprintPlant className="absolute inset-0 size-full text-blueprint opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blueprint/50 to-transparent motion-safe:animate-[scan_9s_linear_infinite]" />
      <p className="label-mono absolute right-5 top-20 border border-dashed border-line-strong px-2 py-1 text-faint md:right-10 lg:right-32 lg:top-24">
        {placeholderLabel}
      </p>
    </div>
  )
}
