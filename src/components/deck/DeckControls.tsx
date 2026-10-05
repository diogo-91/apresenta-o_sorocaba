import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, Maximize, Minimize } from 'lucide-react'
import { pad2 } from '../../data/screens'

type Props = {
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onOpenIndex: () => void
}

const button =
  'flex size-10 items-center justify-center text-fg transition-colors duration-300 ease-mech hover:bg-fg hover:text-paper disabled:pointer-events-none disabled:text-faint/50'

export function DeckControls({ index, total, onPrev, onNext, onOpenIndex }: Props) {
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
      <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Slide anterior" className={button}>
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <span className="label-mono min-w-[4.5rem] text-center tabular-nums text-fg" aria-live="polite">
        {pad2(index + 1)}
        <span className="text-faint"> / {pad2(total)}</span>
      </span>
      <button type="button" onClick={onNext} disabled={index === total - 1} aria-label="Próximo slide" className={button}>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
      <span className="h-6 w-px bg-line-strong" aria-hidden="true" />
      <button type="button" onClick={onOpenIndex} aria-label="Índice de slides" aria-haspopup="dialog" className={button}>
        <LayoutGrid size={16} aria-hidden="true" />
      </button>
      <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? 'Sair da tela cheia' : 'Tela cheia'} className={button}>
        {fullscreen ? <Minimize size={16} aria-hidden="true" /> : <Maximize size={16} aria-hidden="true" />}
      </button>
    </nav>
  )
}
