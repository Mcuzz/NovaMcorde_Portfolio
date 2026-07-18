import { useState } from 'react'
import { contactLinks, navigationSections } from '../../data/portfolio'
import type { SectionId } from '../../types/portfolio'
import Logo from '../../assets/logo.svg?react'

type MobileNavProps = {
  activeSection: SectionId
  onNavigate: (section: SectionId) => void
  onResetFace: () => void
}

export function MobileNav({ activeSection, onNavigate, onResetFace }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigate = (section: SectionId) => {
    onNavigate(section)
    setIsOpen(false)
  }

  return (
    <>
      <header className="mobile-nav-bar">
        <span className="mobile-nav-bar__mark" aria-hidden="true">
          <Logo />
        </span>

        <button
          type="button"
          className={['mobile-nav-bar__toggle', isOpen ? 'is-open' : ''].join(' ')}
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={['mobile-nav-drawer', isOpen ? 'is-open' : ''].join(' ')}>
        <nav className="mobile-nav-drawer__links" aria-label="Navegación del portafolio">
          {navigationSections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={[
                'mobile-nav-drawer__link',
                activeSection === section.id ? 'is-active' : '',
              ].join(' ')}
              onClick={() => handleNavigate(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="mobile-nav-drawer__reset"
          onClick={() => {
            onResetFace()
            setIsOpen(false)
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
          Reiniciar rostro
        </button>

        <ul className="mobile-nav-drawer__contact" aria-label="Contact links">
          {contactLinks.map((link) => {
            const Icon = link.icon

            return (
              <li key={link.id}>
                <a
                  href={link.href}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  aria-label={link.label}
                >
                  <Icon className="mobile-nav-drawer__icon" aria-hidden="true" focusable="false" />
                  <span>{link.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      {isOpen && (
        <button
          type="button"
          className="mobile-nav-scrim"
          aria-label="Cerrar menú"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}