import { useEffect, type RefObject } from 'react'

export function useAutoplayVideo(video: RefObject<HTMLVideoElement | null>, src: string | undefined) {
  useEffect(() => {
    const el = video.current
    if (!el || !src) return
    el.muted = true
    el.defaultMuted = true
    const play = () => void el.play().catch(() => {})
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : el.pause()))
    observer.observe(el)
    return () => observer.disconnect()
  }, [video, src])
}
