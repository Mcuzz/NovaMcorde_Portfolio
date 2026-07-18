import type { CSSProperties, ElementType } from 'react'
import type { WaveTextLine } from '../../types/portfolio'

type WaveTextProps = {
  as?: ElementType
  lines: WaveTextLine[]
  className?: string
  ariaLabel: string
  globalOffset?: number // offset global de sílabas para la ola continua
  waveId?: string       // id único para coordinar animaciones entre componentes
}

export function WaveText({
  as: Component = 'div',
  lines,
  className = '',
  ariaLabel,
  globalOffset = 0,
}: WaveTextProps) {
  const lineOffsets = lines.map((_, lineIndex) =>
    lines.slice(0, lineIndex).reduce((total, line) => total + line.length, 0),
  )

  return (
    <Component className={['wave-text', className].join(' ')} aria-label={ariaLabel}>
      {lines.map((line, lineIndex) => (
        <span className="wave-text__line" aria-hidden="true" key={`${line.join('-')}-${lineIndex}`}>
          {line.map((syllable, syllableIndex) => {
            const localIndex = lineOffsets[lineIndex] + syllableIndex
            const globalIndex = globalOffset + localIndex
            // Delay en función del índice global para que la ola sea continua
            const delay = `${globalIndex * 0.08}s`

            return (
              <span
                className="wave-text__unit"
                key={`${syllable}-${localIndex}`}
                style={{ '--wave-delay': delay } as CSSProperties}
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