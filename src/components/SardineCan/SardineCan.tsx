import { useState } from "react";
import type { MouseEvent } from "react";
import type { Project } from "../../types/portfolio";

type SardineCanProps = {
  project: Project;
};

export function SardineCan({ project }: SardineCanProps) {
  const [open, setOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.image];
  const hasMultipleImages = images.length > 1;

  const showPrevImage = (event: MouseEvent) => {
    event.stopPropagation();
    setImageIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNextImage = (event: MouseEvent) => {
    event.stopPropagation();
    setImageIndex((index) => (index + 1) % images.length);
  };

  const openDetails = (event: MouseEvent) => {
    event.stopPropagation();

    if (project.href) {
      window.open(project.href, "_blank", "noreferrer");
    }
  };

  return (
    <article className={["sardine-can", open ? "is-open" : ""].join(" ")}>
      <div className="sardine-can__interior">
        <div className="sardine-can__gallery">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${project.title} — vista ${index + 1}`}
              className={[
                "sardine-can__image",
                index === imageIndex ? "is-active" : "",
              ].join(" ")}
            />
          ))}

          {hasMultipleImages ? (
            <>
              <button
                type="button"
                className="sardine-can__arrow sardine-can__arrow--prev"
                onClick={showPrevImage}
                aria-label="Imagen anterior"
              >
                ‹
              </button>
              <button
                type="button"
                className="sardine-can__arrow sardine-can__arrow--next"
                onClick={showNextImage}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          ) : null}

          <button
            type="button"
            className="sardine-can__details"
            onClick={openDetails}
          >
            toca para ver más detalles
          </button>
        </div>
      </div>

      <button
        type="button"
        className="sardine-can__lid"
        onClick={() => setOpen((value) => !value)}
        aria-pressed={open}
        aria-label={
          open
            ? `Cerrar lata de ${project.title}`
            : `Abrir lata de ${project.title}`
        }
      >
        tsx
        <span className="sardine-can__emblem" aria-hidden="true">
          <span className="sardine-can__emblem-rectangle sardine-can__emblem-rectangle--base" />
          <span className="sardine-can__emblem-circle sardine-can__emblem-circle--a" />
          <span className="sardine-can__emblem-circle sardine-can__emblem-circle--b" />
        </span>
        <span className="sardine-can__description">{project.description}</span>
        <span className="sardine-can__title">{project.title}</span>
        <span className="sardine-can__tab" aria-hidden="true" />
      </button>
    </article>
  );
}
