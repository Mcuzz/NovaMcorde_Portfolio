import { useEffect, useMemo, useState } from "react";

type Project = {
  title: string;
  image: string;
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

  const count = projects.length;

  // Precalcular ángulos
  const angleStep = useMemo(() => 360 / count, [count]);

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % count);
  };

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  useEffect(() => {
    if (!autoPlay) return;

    const id = setInterval(() => {
      next();
    }, interval);

    return () => clearInterval(id);
  }, [autoPlay, interval, count]);

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
              key={i}
              className="carousel3d__item"
              style={{
                transform: `rotateY(${rotate}deg) translateZ(380px)`,
              }}
            >
              <img src={project.image} alt={project.title} />
            </div>
          );
        })}
      </div>

      <div className="carousel3d-controls">
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
      </div>
    </div>
  );
}