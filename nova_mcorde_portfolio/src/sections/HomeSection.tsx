import { WaveText } from '../components/WaveText/WaveText'
import { nameWaveLines, profile, roleWaveLines } from '../data/portfolio'
import type { SectionId } from '../types/portfolio'

// Calcula el total de sílabas en roleWaveLines para que nameWaveLines continúe desde ahí
const roleSyllableCount = roleWaveLines.reduce((acc, line) => acc + line.length, 0)

type HomeSectionProps = {
  onNavigate: (section: SectionId) => void
}

export function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <section className="home-section">
      <header className="home-section__hero">
        {/* Ola 1: "Programador Junior" */}
        <WaveText
          as="h1"
          lines={roleWaveLines}
          ariaLabel="Programador Junior"
          className="home-title"
          globalOffset={0}
        />
        {/* Ola continúa en "Natalia Yamileth Urias Velasquez" */}
        <WaveText
          as="p"
          lines={nameWaveLines}
          ariaLabel={profile.name}
          className="home-name"
          globalOffset={roleSyllableCount}
        />
        <p className="home-location">{profile.location}</p>
      </header>

      <div className="home-section__intro">
        <p>
          <strong>Programador Full Stack Junior aún estudiando Ingeniería en Software.</strong> Con
          intereses en desarrollo web, interfaces modernas/con esencia, experiencias interactivas,
          inteligencia artificial generativa y arquitectura de sistemas que impulsen la calidad,
          estética y escalabilidad.
        </p>
        <p className="home-section__welcome">Seas bienvenido al espacio digital que alberga un poco de mi alma.</p>
      </div>

      <div className="home-section__actions" aria-label="Acciones principales">
        <button type="button" onClick={() => onNavigate('projects')}>
          Ver proyectos
        </button>
        <button type="button" onClick={() => onNavigate('about')}>
          Sobre mí
        </button>
      </div>

      <section className="first-meet" aria-labelledby="first-meet-title">
        <h2 id="first-meet-title">Our first meet</h2>
        <div className="first-meet__grid">
          <span />
          <span />
          <span />
        </div>
      </section>
    </section>
  )
}