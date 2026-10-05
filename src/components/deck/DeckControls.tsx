import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize } from 'lucide-react'
import { pad2 } from '../../data/screens'
import { SoundToggle } from './SoundToggle'

type Props = {
  index: number
  total: number
  step: number
  steps: number
  onPrev: () => void
  onNext: () => void
  onOpenIndex: () => void
}

const button =
  'flex size-10 items-center justify-center text-fg transition-colors duration-300 ease-mech hover:bg-fg hover:text-paper disabled:pointer-events-none disabled:text-faint/50'

export function DeckControls({ index, total, step, steps, onPrev, onNext, onOpenIndex }: Props) {
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.()
  }

  return (
    <nav aria-label="Controles da apresentação" className="fixed bottom-4 right-4 z-40 flex items-center border border-line-strong bg-paper/95 shadow-sm">
      <button type="button" onClick={onPrev} disabled={index === 0 && step === 0} aria-label="Anterior" className={button}>
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span className="label-mono flex min-w-[4.5rem] flex-col items-center text-center tabular-nums text-fg" aria-live="polite">
        <span>
          {pad2(index + 1)}
          <span className="text-faint"> / {pad2(total)}</span>
        </span>
        {steps > 1 && (
          <span className="mt-1 flex justify-center gap-1" aria-label={`Passo ${step + 1} de ${steps}`}>
            {Array.from({ length: steps }, (_, i) => (
              <span key={i} className={`h-0.5 w-2.5 transition-colors duration-300 ${i <= step ? 'bg-accent' : 'bg-line-strong'}`} />
            ))}
          </span>
        )}
      </span>
      <button type="button" onClick={onNext} disabled={index === total - 1 && step === steps - 1} aria-label="Próximo" className={button}>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <span className="h-6 w-px bg-line-strong" aria-hidden="true" />
      <button type="button" onClick={onOpenIndex} aria-label="Índice de slides" aria-haspopup="dialog" className={button}>
        <LayoutGrid size={16} aria-hidden="true" />
      </button>
      <SoundToggle className={button} />
      <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} className={button}>
        {fullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
      </button>
    </nav>
  )
}
