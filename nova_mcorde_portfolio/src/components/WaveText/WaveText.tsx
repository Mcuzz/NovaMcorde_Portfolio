import type { CSSProperties, ElementType } from 'react'
import type { WaveTextLine } from '../../types/portfolio'

type WaveTextProps = {
  as?: ElementType
  lines: WaveTextLine[]
  className?: string
  ariaLabel: string
}

export function WaveText({ as: Component = 'div', lines, className = '', ariaLabel }: WaveTextProps) {
  const lineOffsets = lines.map((_, lineIndex) =>
    lines.slice(0, lineIndex).reduce((total, line) => total + line.length, 0),
  )

  return (
    <Component className={['wave-text', className].join(' ')} aria-label={ariaLabel}>
      {lines.map((line, lineIndex) => (
        <span className="wave-text__line" aria-hidden="true" key={`${line.join('-')}-${lineIndex}`}>
          {line.map((syllable, syllableIndex) => {
            const index = lineOffsets[lineIndex] + syllableIndex

            return (
              <span
                className="wave-text__unit"
                key={`${syllable}-${index}`}
                style={{ '--wave-delay': `${index * 0.13}s` } as CSSProperties}
              >
                {syllable}
              </span>
            )
          })}
        </span>
      ))}
    </Component>
  )
}
