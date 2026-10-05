import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { ambient } from '../../data/content'

export function SoundToggle({ className }: { className: string }) {
  const audio = useRef<HTMLAudioElement | null>(null)
  const [on, setOn] = useState(false)

  useEffect(() => () => audio.current?.pause(), [])

  if (!ambient.audioSrc) return null

  const toggle = () => {
    audio.current ??= Object.assign(new Audio(ambient.audioSrc!), { loop: true, volume: 0.4 })
    if (on) audio.current.pause()
    else void audio.current.play()
    setOn(!on)
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={on} aria-label={on ? 'Desligar som' : 'Ligar som'} className={className}>
      {on ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
    </button>
  )
}
