import type { ReactNode } from 'react'
import { ContactBar } from '../components/ContactBar/ContactBar'
import { FaceNavigation } from '../components/FaceNavigation/FaceNavigation'
import { FaceBackdrop } from '../components/FaceNavigation/FaceBackDrop'
import { MobileNav } from '../components/MobileNav/MobileNav'
import { MobileActionDock } from '../components/MobileNav/MobileActionDock'
import { useFaceNavigationCanvas } from '../hooks/useFaceNavigationCanvas'
import { useIsMobile } from '../hooks/useIsMobile'
import { profile } from '../data/portfolio'
import type { SectionId } from '../types/portfolio'

type PortfolioLayoutProps = {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
  snapNotice: SectionId
  themeMode: 'light' | 'dark'
  onToggleTheme: () => void
  children: ReactNode
}

export function PortfolioLayout({
  activeSection,
  onNavigate,
  snapNotice,
  themeMode,
  onToggleTheme,
  children,
}: PortfolioLayoutProps) {
  const isMobile = useIsMobile()

  // Instancia propia del hook para el modo móvil: alimenta el canvas de
  // fondo (FaceBackdrop), el botón "reset" del drawer y el snapshot que usa
  // el dock flotante para "Generate card". En desktop esta instancia queda
  // sin canvas asociado (no dibuja nada) porque FaceNavigation trae la suya.
  const { canvasRef, captureSnapshot, resetFace } = useFaceNavigationCanvas({
    activeSection,
    onSelect: onNavigate,
    portraitSrc: profile.portraitSrc,
  })

  return (
    <div className={['portfolio-shell', isMobile ? 'portfolio-shell--mobile' : ''].join(' ')}>
      {isMobile ? (
        <>
          <FaceBackdrop canvasRef={canvasRef} />
          <MobileNav activeSection={activeSection} onNavigate={onNavigate} onResetFace={resetFace} />
        </>
      ) : (
        <aside className="sidebar" aria-label="Navegación del portafolio">
          <FaceNavigation
            activeSection={activeSection}
            onNavigate={onNavigate}
            themeMode={themeMode}
            onToggleTheme={onToggleTheme}
          />
          <ContactBar />
        </aside>
      )}

      <main className="content-panel">
        <div className="section-stage">{children}</div>
      </main>

      {isMobile && (
        <MobileActionDock
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
          captureSnapshot={captureSnapshot}
        />
      )}

      <div className="snap-flash" aria-hidden="true" key={snapNotice}>
        {snapNotice}
      </div>
    </div>
  )
}