import { useState } from 'react'
import { BusinessCard } from '../BusinessCard/BusinessCard'
import { profile } from '../../data/portfolio'

type MobileActionDockProps = {
  themeMode: 'light' | 'dark'
  onToggleTheme: () => void
  captureSnapshot: () => string | null
}

export function MobileActionDock({ themeMode, onToggleTheme, captureSnapshot }: MobileActionDockProps) {
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [snapshot, setSnapshot] = useState<string | null>(null)

  const handleGenerateCard = () => {
    setSnapshot(captureSnapshot())
    setIsCardOpen(true)
  }

  return (
    <div className="mobile-action-dock">
      <button
        type="button"
        className="mobile-action-dock__theme"
        aria-pressed={themeMode === 'dark'}
        aria-label={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`}
        onClick={onToggleTheme}
      >
        <span className="mobile-action-dock__theme-label">
          {themeMode === 'dark' ? 'dark' : 'light'}
        </span>
        <span className="mobile-action-dock__theme-track" aria-hidden="true">
          <span className="mobile-action-dock__theme-thumb" />
        </span>
      </button>

      <button
        type="button"
        className="mobile-action-dock__generate"
        onClick={handleGenerateCard}
      >
        <span>Generate card</span>
        <span aria-hidden="true">✦</span>
      </button>

      {isCardOpen && (
        <BusinessCard
          photoSrc={snapshot ?? profile.portraitSrc}
          onClose={() => setIsCardOpen(false)}
        />
      )}
    </div>
  )
}