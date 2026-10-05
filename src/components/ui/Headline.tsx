import { WordReveal } from '../motion/WordReveal'

type Props = {
  id?: string
  text: string
  size?: 'xl' | 'lg' | 'md'
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
}

export function Headline({ id, text, size = 'lg', as: Tag = 'h2', className = '', delay }: Props) {
  return (
    <Tag id={id} className={`display-${size} ${className}`}>
      <WordReveal text={text} delay={delay} />
    </Tag>
  )
}
