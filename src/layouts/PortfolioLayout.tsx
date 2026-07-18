import type { ReactNode } from 'react'
import { ContactBar } from '../components/ContactBar/ContactBar'
import { FaceNavigation } from '../components/FaceNavigation/FaceNavigation'
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
  return (
    <div className="portfolio-shell">
      <aside className="sidebar" aria-label="Navegación del portafolio">
        <FaceNavigation
          activeSection={activeSection}
          onNavigate={onNavigate}
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
        />
        <ContactBar />
      </aside>

      <main className="content-panel">
        <div className="section-stage">
          {children}
        </div>
      </main>

      <div className="snap-flash" aria-hidden="true" key={snapNotice}>
        {snapNotice}
      </div>
    </div>
  )
}
