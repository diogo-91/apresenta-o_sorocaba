import { useRef, useState } from 'react'
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { CornerMarks } from '../ui/CornerMarks'
import { BlueprintPlant } from './BlueprintPlant'

export type Chapter = { id: string; label: string; startSeconds: number | null }

type Props = {
  src: string | null
  poster: string | null
  title: string
  durationLabel: string
  fileHint: string
  chapters: Chapter[]
}

function timecode(seconds: number) {
  const s = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export function VideoPlayer({ src, poster, title, durationLabel, fileHint, chapters }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const available = Boolean(src)

  const toggle = () => {
    const el = video.current
    if (!el) return
    if (el.paused) void el.play()
    else el.pause()
  }

  const seek = (seconds: number) => {
    const el = video.current
    if (!el) return
    el.currentTime = seconds
    void el.play()
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={frame} data-cursor="explore" className="relative aspect-[4/5] overflow-hidden bg-paper-2 sm:aspect-video lg:aspect-auto lg:h-[470px]">
        {available ? (
          <video
            ref={video}
            className="absolute inset-0 size-full object-cover"
            src={src!}
            poster={poster ?? undefined}
            preload="none"
            playsInline
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onClick={toggle}
          />
        ) : (
          <div className="absolute inset-0" aria-hidden="true">
            <div className="blueprint-grid absolute inset-0 opacity-60" />
            <BlueprintPlant className="absolute inset-0 size-full text-blueprint opacity-30 motion-safe:animate-[kenburns_36s_ease-in-out_infinite_alternate]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-paper)_95%)]" />
          </div>
        )}
        <CornerMarks className="border-fg/50" size="size-4" />

        {!playing && (
          <button
            type="button"
            onClick={toggle}
            disabled={!available}
            aria-label={available ? `Reproduzir: ${title}` : 'Vídeo ainda não disponível'}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <span className="flex size-20 items-center justify-center border border-fg/70 bg-paper/60 transition-colors duration-300 ease-mech group-enabled:group-hover:border-accent group-enabled:group-hover:bg-accent group-enabled:group-hover:text-fg lg:size-24">
              <Play size={26} strokeWidth={1.5} aria-hidden="true" className="translate-x-0.5" />
            </span>
            {!available && (
              <span className="label-mono max-w-[30ch] px-6 text-center text-muted">
                Vídeo institucional · arquivo a inserir
                <span className="mt-1 block normal-case tracking-normal text-faint">{fileHint}</span>
              </span>
            )}
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-paper/90 to-transparent px-4 pb-3 pt-10">
          <button type="button" onClick={toggle} disabled={!available} aria-label={playing ? 'Pausar' : 'Reproduzir'} className="flex size-9 items-center justify-center text-fg disabled:text-faint">
            {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.1}
            value={time}
            disabled={!available}
            onChange={(e) => {
              if (video.current) video.current.currentTime = Number(e.target.value)
            }}
            aria-label="Posição do vídeo"
            className="h-1 flex-1 cursor-pointer appearance-none bg-line-strong accent-accent disabled:cursor-not-allowed"
          />
          <span className="label-mono tabular-nums text-muted">
            {timecode(time)} / {duration ? timecode(duration) : durationLabel}
          </span>
          <button type="button" onClick={() => setMuted((v) => !v)} disabled={!available} aria-label={muted ? 'Ativar som' : 'Silenciar'} className="flex size-9 items-center justify-center text-fg disabled:text-faint">
            {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => void frame.current?.requestFullscreen?.()}
            disabled={!available}
            aria-label="Tela cheia"
            className="hidden size-9 items-center justify-center text-fg disabled:text-faint sm:flex"
          >
            <Maximize size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ol className="grid grid-cols-3 border-t border-line lg:mx-24" aria-label="Capítulos do vídeo">
        {chapters.map((chapter, i) => {
          const seekable = available && chapter.startSeconds != null
          return (
            <li key={chapter.id} className="border-r border-line last:border-r-0">
              <button
                type="button"
                disabled={!seekable}
                onClick={() => seekable && seek(chapter.startSeconds!)}
                className="flex w-full flex-col items-start gap-1 px-3 py-3 text-left transition-colors duration-300 enabled:hover:bg-fg/5 sm:px-4"
              >
                <span className="label-mono text-faint">CAP. {String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-base font-semibold tracking-tight sm:text-lg">{chapter.label}</span>
                <span className="label-mono text-faint">{chapter.startSeconds != null ? timecode(chapter.startSeconds) : '[--:--]'}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
