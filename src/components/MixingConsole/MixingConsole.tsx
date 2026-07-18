import { useCallback, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { SkillGroup } from '../../types/portfolio'

type MixingConsoleProps = {
  groups: SkillGroup[]
}

const FADER_MIN = 6
const FADER_MAX = 100

function hashToUnit(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 100000
  }
  return (hash % 1000) / 1000
}

function deriveLevel(name: string, learning: boolean, level?: number) {
  if (typeof level === 'number') {
    return Math.min(FADER_MAX, Math.max(FADER_MIN, level))
  }
  const unit = hashToUnit(name)
  return learning ? 20 + unit * 26 : 58 + unit * 38
}

export function MixingConsole({ groups }: MixingConsoleProps) {
  const initialLevels = useMemo(() => {
    const map: Record<string, number> = {}
    groups.forEach((group) => {
      group.items.forEach((item) => {
        const key = `${group.title}__${item.name}`
        map[key] = deriveLevel(item.name, Boolean(item.learning), item.level)
      })
    })
    return map
  }, [groups])

  const [levels, setLevels] = useState<Record<string, number>>(initialLevels)
  const draggingKeyRef = useRef<string | null>(null)
  const trackRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const updateFromPointer = useCallback((key: string, clientY: number) => {
    const track = trackRefs.current[key]
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = 1 - (clientY - rect.top) / rect.height
    const clamped = Math.min(FADER_MAX, Math.max(FADER_MIN, ratio * 100))
    setLevels((prev) => ({ ...prev, [key]: clamped }))
  }, [])

  const handlePointerDown = useCallback(
    (key: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
      draggingKeyRef.current = key
      event.currentTarget.setPointerCapture(event.pointerId)
      updateFromPointer(key, event.clientY)
    },
    [updateFromPointer],
  )

  const handlePointerMove = useCallback(
    (key: string) => (event: ReactPointerEvent<HTMLDivElement>) => {
      if (draggingKeyRef.current !== key) return
      updateFromPointer(key, event.clientY)
    },
    [updateFromPointer],
  )

  const stopDragging = useCallback(() => {
    draggingKeyRef.current = null
  }, [])

  const adjustByKeyboard = useCallback((key: string, delta: number) => {
    setLevels((prev) => ({
      ...prev,
      [key]: Math.min(FADER_MAX, Math.max(FADER_MIN, (prev[key] ?? 50) + delta)),
    }))
  }, [])

  return (
    <div className="mixing-console" role="group" aria-label="Panel de habilidades tipo consola de mezcla">
      {groups.map((group) => (
        <section className="mixing-console__channel-group" key={group.title}>
          <header className="mixing-console__plate">
            <span className="mixing-console__plate-label">{group.title}</span>
          </header>

          <div className="mixing-console__faders">
            {group.items.map((item) => {
              const key = `${group.title}__${item.name}`
              const level = levels[key] ?? 50
              const learning = Boolean(item.learning)

              return (
                <div className="fader-channel" key={key}>
                  <span
                    className={['fader-channel__led', learning ? 'is-learning' : 'is-core'].join(' ')}
                    aria-hidden="true"
                  />

                  <span className="fader-channel__readout">{Math.round(level)}</span>

                  <div
                    className={['fader-channel__track', learning ? 'is-learning' : ''].join(' ')}
                    ref={(node) => {
                      trackRefs.current[key] = node
                    }}
                    onPointerDown={handlePointerDown(key)}
                    onPointerMove={handlePointerMove(key)}
                    onPointerUp={stopDragging}
                    onPointerCancel={stopDragging}
                    role="slider"
                    aria-valuemin={FADER_MIN}
                    aria-valuemax={FADER_MAX}
                    aria-valuenow={Math.round(level)}
                    aria-label={item.name}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowUp') adjustByKeyboard(key, 3)
                      if (event.key === 'ArrowDown') adjustByKeyboard(key, -3)
                    }}
                  >
                    <div className="fader-channel__ticks" aria-hidden="true">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <span className="fader-channel__tick" key={i} />
                      ))}
                    </div>

                    <div className="fader-channel__fill" style={{ height: `${level}%` }} />
                    <div className="fader-channel__thumb" style={{ bottom: `${level}%` }} />
                  </div>

                  <span className="fader-channel__label">{item.name}</span>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}