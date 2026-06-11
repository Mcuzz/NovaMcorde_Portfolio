import { useEffect, useMemo, useState } from "react";

type Project = {
  title: string;
  image: string;
  description: string;
  stack: string[];
};

type Props = {
  projects: Project[];
  autoPlay?: boolean;
  interval?: number;
};

export default function Carousel3D({
  projects,
  autoPlay = true,
  interval = 3000,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  const count = projects.length;
  const angleStep = useMemo(() => 360 / count, [count]);

  const activeProject = projects[activeIndex];

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % count);
    setFlippedCard(null);
    setPaused(false);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
    setFlippedCard(null);
    setPaused(false);
  };

  const toggleCard = (index: number) => {
    if (index !== activeIndex) return;
    if (flippedCard === index) {
      setFlippedCard(null);
      setPaused(false);
    } else {
      setFlippedCard(index);
      setPaused(true);
    }
  };

  useEffect(() => {
    if (!autoPlay || paused) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, paused, count]);

  return (
    <div className="carousel3d-scene">
      {/* Info superior — cambia con la carta activa */}
      <div className="carousel3d-info">
        <p className="carousel3d-info__eyebrow"><strong>Our first meet.</strong> Explora algunos de mis proyectos en
            esta vista previa.</p>
        <h3 className="carousel3d-info__title">{activeProject.title}</h3>
        <p className="carousel3d-info__desc">{activeProject.description}</p>
        <p className="carousel3d-info__hint">
          {flippedCard === activeIndex ? "← clic para volver" : "clic en la carta para ver el stack →"}
        </p>
      </div>

      {/* Carrusel 3D */}
      <div className="carousel3d-wrapper">
        <div
          className="carousel3d"
          style={{ transform: `rotateY(-${activeIndex * angleStep}deg)` }}
        >
          {projects.map((project, i) => {
            const rotate = i * angleStep;
            return (
              <div
                key={project.title}
                className="carousel3d__item"
                style={{ transform: `rotateY(${rotate}deg) translateZ(380px)` }}
              >
                <div
                  className={`c3d-card ${flippedCard === i ? "c3d-card--flipped" : ""} ${i === activeIndex ? "c3d-card--active" : ""}`}
                  onClick={() => toggleCard(i)}
                >
                  {/* Frente */}
                  <div className="c3d-card__front">
                    <img src={project.image} alt={project.title} />
                  </div>

                  {/* Dorso — solo iconos/pills del stack */}
                  <div className="c3d-card__back">
                    <p className="c3d-card__back-label">stack</p>
                    <div className="c3d-card__stack">
                      {project.stack.map((tech) => (
                        <span key={tech} className="c3d-card__tech">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="carousel3d-controls">
          <button type="button" className="carousel3d-button" onClick={prev} aria-label="Proyecto anterior">
            ←
          </button>
          <button type="button" className="carousel3d-button" onClick={next} aria-label="Proyecto siguiente">
            →
          </button>
        </div>
      </div>
    </div>
  );
}