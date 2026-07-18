
import { WaveText } from "../components/WaveText/WaveText";
import { nameWaveLines, profile, roleWaveLines } from "../data/portfolio";
import type { SectionId } from "../types/portfolio";
import { AboutSection } from "./AboutSection";
import { ProjectsSection } from "./ProjectsSection";
import { SkillsSection } from "./SkillsSection";

const roleSyllableCount = roleWaveLines.reduce(
  (acc, line) => acc + line.length,
  0,
);

type HomeSectionProps = {
  onNavigate: (section: SectionId) => void;
};

export function HomeSection({ onNavigate }: HomeSectionProps) {
  return (
    <section className="home-section">
      <header className="home-section__hero" id="home" data-portfolio-section>
        <div className="home-section__hero-content">
          <div className="home-section__hero-identity">
            <WaveText
              as="h1"
              lines={roleWaveLines}
              ariaLabel="Programador Junior"
              className="home-title"
              globalOffset={0}
            />
            <WaveText
              as="p"
              lines={nameWaveLines}
              ariaLabel={profile.name}
              className="home-name"
              globalOffset={roleSyllableCount}
            />
          </div>
          <div className="home-section__welcome">
            <strong>
              Seas bienvenido al espacio digital que alberga un poco de mi alma.
            </strong>
          </div>
        </div>
      </header>

      <div className="home-section__intro">
        <p>
          <strong>
            Programador Full Stack Junior aún estudiando Ingeniería en Software.
          </strong>{" "}
          Escribo codigo para que las maquinas hagan lo que yo quiero que hagan, y paso el resto del tiempo averiguando por que no lo hicieron. Con intereses en desarrollo web, interfaces modernas/con esencia,
          experiencias interactivas, inteligencia artificial generativa y
          arquitectura de sistemas que impulsen la calidad, estética y
          escalabilidad.
        </p>
      </div>

      <div className="home-section__actions" aria-label="Acciones principales">
        <button type="button" onClick={() => onNavigate("projects")}>
          Ver proyectos
        </button>
        <button type="button" onClick={() => onNavigate("about")}>
          Sobre mí
        </button>
      </div>


      <ProjectsSection id="projects" className="home-section__block" />
      <SkillsSection id="skills" className="home-section__block" />
      <AboutSection id="about" className="home-section__block" />

      <footer className="section-footer">
        <div className="section-footer__line" />

        <div className="section-footer__content">
          <p>Designed & developed by Natalia.</p>

          <p>Built with React & TypeScript.</p>
        </div>
      </footer>
    </section>
  );
}
