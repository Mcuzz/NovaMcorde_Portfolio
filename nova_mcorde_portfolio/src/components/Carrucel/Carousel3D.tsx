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

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const toggleCard = (index: number) => {
    if (flippedCard === index) {
      setFlippedCard(null);
      setPaused(false);

      return;
    }

    setFlippedCard(index);
    setPaused(true);
  };

  useEffect(() => {
    if (!autoPlay || paused) return;

    const id = setInterval(next, interval);

    return () => clearInterval(id);
  }, [autoPlay, interval, paused, count]);

  return (
    <div className="carousel3d-wrapper">
      <div
        className="carousel3d"
        style={{
          transform: `rotateY(-${activeIndex * angleStep}deg)`,
        }}
      >
        {projects.map((project, i) => {
          const rotate = i * angleStep;

          return (
            <div
              key={project.title}
              className="carousel3d__item"
              style={{
                transform: `rotateY(${rotate}deg) translateZ(380px)`,
              }}
            >
              <div
                className={`project-card ${
                  flippedCard === i ? "project-card--flipped" : ""
                }`}
                onClick={() => toggleCard(i)}
              >
                {/* Frente */}

                <div className="project-card__front">
                  <img src={project.image} alt={project.title} />
                </div>

                {/* Atrás */}

                <div className="project-card__back">
                  <h3>{project.title}</h3>

                  <p>{project.description}</p>

                  <div className="project-card__stack">
                    {project.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="carousel3d-controls">
        <button
          type="button"
          className="carousel3d-button"
          onClick={prev}
          aria-label="Previous project"
        >
          ←
        </button>

        <button
          type="button"
          className="carousel3d-button"
          onClick={() => {
            setPaused(false);
            next();
          }}
          aria-label="Next project"
        >
          →
        </button>
      </div>
    </div>
  );
}
