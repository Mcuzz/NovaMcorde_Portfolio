import type { ReactNode } from 'react'
import { ContactBar } from '../components/ContactBar/ContactBar'
import { FaceNavigation } from '../components/FaceNavigation/FaceNavigation'
import type { SectionId } from '../types/portfolio'

type PortfolioLayoutProps = {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
  snapNotice: SectionId
  children: ReactNode
}

export function PortfolioLayout({
  activeSection,
  onNavigate,
  snapNotice,
  children,
}: PortfolioLayoutProps) {
  return (
    <div className="portfolio-shell">
      <aside className="sidebar" aria-label="Navegación del portafolio">
        <FaceNavigation activeSection={activeSection} onNavigate={onNavigate} />
        <ContactBar />
      </aside>

      <main className="content-panel" aria-live="polite">
        <div className="section-stage" key={activeSection}>
          {children}
        </div>
      </main>

      <div className="snap-flash" aria-hidden="true" key={snapNotice}>
        {snapNotice}
      </div>
    </div>
  )
}
