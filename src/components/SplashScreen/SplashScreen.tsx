import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import './splashscreen.css'

type SplashScreenProps = {
  onFinish: () => void
}

type SvgPiece = {
  id: string
  x: number
  y: number
  w: number
  h: number
}

// ── Piezas de la cruz (extraídas de cruz.svg) ───────────────────
const CROSS_PIECES: SvgPiece[] = [
  { id: 'top', x: 648, y: 150, w: 199, h: 466 },
  { id: 'left', x: 440, y: 638, w: 194, h: 188 },
  { id: 'center', x: 653, y: 638, w: 194, h: 188 },
  { id: 'right', x: 861, y: 638, w: 194, h: 188 },
  { id: 'bottom', x: 653, y: 848, w: 198, h: 467 },
]

// ── Piezas extra de logo.svg (los "corchetes" que arman las iniciales) ──
const BRACKET_PIECES: SvgPiece[] = [
  { id: 'top-left-vertical', x: 0, y: 150, w: 198, h: 466 },
  { id: 'top-bar', x: 0, y: 149, w: 847, h: 110 },
  { id: 'bottom-right-vertical', x: 1301, y: 848, w: 199, h: 467 },
  { id: 'bottom-bar', x: 652, y: 1206, w: 848, h: 109 },
]

// ── Timings (ms) — deben coincidir con las duraciones declaradas en splashscreen.css ──
const CROSS_STEP_MS = 130
const CROSS_DRAW_MS = 480
const BRACKETS_START_MS = 1450
const BRACKET_STEP_MS = 90
const BRACKET_DURATION_MS = 420
const HOLD_MS = 450
const EXIT_MS = 520

const bracketsEnd =
  BRACKETS_START_MS + (BRACKET_PIECES.length - 1) * BRACKET_STEP_MS + BRACKET_DURATION_MS
const exitTriggerAt = bracketsEnd + HOLD_MS

const REDUCED_HOLD_MS = 480
const REDUCED_EXIT_MS = 280

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const exitAt = prefersReducedMotion ? REDUCED_HOLD_MS : exitTriggerAt
    const exitDuration = prefersReducedMotion ? REDUCED_EXIT_MS : EXIT_MS

    const exitTimer = window.setTimeout(() => setIsExiting(true), exitAt)
    const finishTimer = window.setTimeout(onFinish, exitAt + exitDuration)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(finishTimer)
    }
  }, [onFinish, prefersReducedMotion])

  const handleSkip = () => {
    if (isExiting) return
    setIsExiting(true)
    window.setTimeout(onFinish, prefersReducedMotion ? REDUCED_EXIT_MS : EXIT_MS)
  }

  return (
    <div
      className={[
        'splash-screen',
        isExiting ? 'is-exiting' : '',
        prefersReducedMotion ? 'splash-screen--reduced' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleSkip}
      aria-hidden="true"
    >
      <svg
        className="splash-screen__mark"
        viewBox="0 0 1500 1500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="splash-cross">
          {CROSS_PIECES.map((piece, index) => {
            const delay = `${index * CROSS_STEP_MS}ms`

            return (
              <g key={piece.id} style={{ '--delay': delay } as React.CSSProperties}>
                <rect
                  className="splash-piece__outline"
                  x={piece.x}
                  y={piece.y}
                  width={piece.w}
                  height={piece.h}
                  pathLength={1}
                />
                <rect
                  className="splash-piece__fill"
                  x={piece.x}
                  y={piece.y}
                  width={piece.w}
                  height={piece.h}
                />
              </g>
            )
          })}
        </g>

        <g className="splash-brackets">
          {BRACKET_PIECES.map((piece, index) => (
            <rect
              key={piece.id}
              className="splash-bracket"
              x={piece.x}
              y={piece.y}
              width={piece.w}
              height={piece.h}
              style={
                {
                  '--delay': `${BRACKETS_START_MS + index * BRACKET_STEP_MS}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      </svg>
    </div>
  )
}

// Nota: CROSS_DRAW_MS no se referencia directamente arriba porque su valor
// vive en el @keyframes de splashscreen.css (splash-draw). Si cambias la
// duración del trazo en el CSS, actualiza esta constante para mantener
// coherencia visual/lectura del código.
void CROSS_DRAW_MS