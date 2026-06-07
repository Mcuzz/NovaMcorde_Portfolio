import { navigationSections, profile } from '../../data/portfolio'
import { useFaceNavigationCanvas } from '../../hooks/useFaceNavigationCanvas'
import type { SectionId } from '../../types/portfolio'

type FaceNavigationProps = {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
}

const labelClassBySection: Record<SectionId, string> = {
  home: 'face-nav__label--home',
  projects: 'face-nav__label--projects',
  skills: 'face-nav__label--skills',
  about: 'face-nav__label--about',
}

export function FaceNavigation({ activeSection, onNavigate }: FaceNavigationProps) {
  const { canvasRef } = useFaceNavigationCanvas({
    activeSection,
    onSelect: onNavigate,
    portraitSrc: profile.portraitSrc,
  })

  return (
    <div className="face-nav">
      <div className="face-nav__header">
        <p>Deforma el rostro arrastrando el cursor, o selecciona la opción a la cual deseas navegar</p>
        <span aria-hidden="true" />
        <strong>Play with my face</strong>
      </div>

      <div className="face-nav__orb">
        <canvas
          ref={canvasRef}
          className="face-nav__canvas"
          aria-label="Rostro interactivo para navegar entre secciones"
          role="img"
        />

        {navigationSections.map((section) => (
          <button
            type="button"
            key={section.id}
            className={[
              'face-nav__label',
              labelClassBySection[section.id],
              activeSection === section.id ? 'is-active' : '',
            ].join(' ')}
            aria-label={section.ariaLabel}
            aria-current={activeSection === section.id ? 'page' : undefined}
            onClick={() => onNavigate(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>
    </div>
  )
}
