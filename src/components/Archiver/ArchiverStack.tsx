import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "../../types/portfolio";
import { ProjectModal } from "./ProjectModal";

// ── tipos ──────────────────────────────────────────────────────────────────────
type AnimPhase =
  | "idle"
  | "lift" // sube desde su posición antes de volar
  | "fly" // vuela por encima
  | "land"; // aterriza en destino

// ── timings ────────────────────────────────────────────────────────────────────
const T_LIFT = 320; // ms levantarse
const T_FLY = 400; // ms volar
const T_LAND = 280; // ms aterrizar + resto reordenarse

// ── helpers ────────────────────────────────────────────────────────────────────
function depthZ(pos: number) {
  return 40 - pos * 80;
}

type ArchiverStackProps = {
  projects: Project[];
};

export function ArchiverStack({ projects }: ArchiverStackProps) {
  const total = projects.length;

  const [order, setOrder] = useState<number[]>(() => projects.map((_, i) => i));
  const [activeDataIdx, setActiveDataIdx] = useState<number | null>(0); // ← frente activo al iniciar
  const [animating, setAnimating] = useState(false);

  // por cada dataIndex, guardamos su fase de animación
  const [phases, setPhases] = useState<Record<number, AnimPhase>>(() =>
    Object.fromEntries(projects.map((_, i) => [i, "idle" as AnimPhase])),
  );

  const [modalProject, setModalProject] = useState<Project | null>(null);

  const lockRef = useRef(false);

  // ── slideshow por folder activo ────────────────────────────────────────────
  const [slideIndices, setSlideIndices] = useState<Record<number, number>>({});
  const slideTimers = useRef<Record<number, ReturnType<typeof setInterval>>>(
    {},
  );

  const startSlideshow = useCallback(
    (dataIdx: number) => {
      const imgs = projects[dataIdx].images ?? [projects[dataIdx].image];
      if (imgs.length <= 1) return;
      slideTimers.current[dataIdx] = setInterval(() => {
        setSlideIndices((prev) => ({
          ...prev,
          [dataIdx]: ((prev[dataIdx] ?? 0) + 1) % imgs.length,
        }));
      }, 1400);
    },
    [projects],
  );

  const stopSlideshow = useCallback((dataIdx: number) => {
    clearInterval(slideTimers.current[dataIdx]);
    delete slideTimers.current[dataIdx];
    setSlideIndices((prev) => ({ ...prev, [dataIdx]: 0 }));
  }, []);

  useEffect(() => {
    return () => {
      Object.values(slideTimers.current).forEach(clearInterval);
    };
  }, []);

  // ── setPhase helper ────────────────────────────────────────────────────────
  const setPhase = (dataIdx: number, phase: AnimPhase) => {
    setPhases((prev) => ({ ...prev, [dataIdx]: phase }));
  };

  // ── rotar: frente → fondo ──────────────────────────────────────────────────
  const frontToBack = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setAnimating(true);
    setActiveDataIdx(null);

    const flyingDataIdx = order[0];
    const newFrontIdx = order[1] ?? order[0]; // ← el que quedará al frente

    // fase 1: lift
    setPhase(flyingDataIdx, "lift");

    setTimeout(() => {
      // fase 2: fly
      setPhase(flyingDataIdx, "fly");

      setTimeout(() => {
        setOrder((prev) => {
          const next = [...prev];
          next.push(next.shift()!);
          return next;
        });
        setPhase(flyingDataIdx, "land");

        setTimeout(() => {
          setPhase(flyingDataIdx, "idle");
          setActiveDataIdx(newFrontIdx); // ← activar el nuevo frente
          lockRef.current = false;
          setAnimating(false);
        }, T_LAND);
      }, T_FLY);
    }, T_LIFT);
  }, [order]);

  // ── rotar: fondo → frente ──────────────────────────────────────────────────
  const backToFront = useCallback(() => {
    if (lockRef.current) return;
    lockRef.current = true;
    setAnimating(true);
    setActiveDataIdx(null);

    const flyingDataIdx = order[order.length - 1];

    // fase 1: lift — emerge del fondo hacia arriba manteniéndose atrás en Z
    setPhase(flyingDataIdx, "lift");

    setTimeout(() => {
      // fase 2: fly — vuela por encima hacia el frente
      setPhase(flyingDataIdx, "fly");

      setTimeout(() => {
        // reordena: el último pasa al frente
        setOrder((prev) => {
          const next = [...prev];
          next.unshift(next.pop()!);
          return next;
        });
        setPhase(flyingDataIdx, "land");

        setTimeout(() => {
          setPhase(flyingDataIdx, "idle");
          setActiveDataIdx(flyingDataIdx); // ← activar el que llegó al frente
          lockRef.current = false;
          setAnimating(false);
        }, T_LAND);
      }, T_FLY);
    }, T_LIFT);
  }, [order]);

  // ── click en folder ────────────────────────────────────────────────────────
  const handleClick = (dataIdx: number) => {
    if (animating) return;
    if (activeDataIdx === dataIdx) {
      setActiveDataIdx(null);
      stopSlideshow(dataIdx);
    } else {
      if (activeDataIdx !== null) stopSlideshow(activeDataIdx);
      setActiveDataIdx(dataIdx);
      startSlideshow(dataIdx);
    }
  };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="archiver-scene">
        {/* controles: botones + indicador a la derecha del stack */}

        <div className="archiver-stack-wrap">
          <div className="archiver-stack" style={{ '--stack-count': total } as React.CSSProperties}>
            {order.map((dataIdx) => {
              const project = projects[dataIdx];
              const pos = order.indexOf(dataIdx);
              const phase = phases[dataIdx];
              const isActive = activeDataIdx === dataIdx;
              const images = project.images?.length
                ? project.images
                : [project.image];
              const slideIdx = slideIndices[dataIdx] ?? 0;
              const hasMultiple = images.length > 1;

              // z-index
              const zIndex =
                phase !== "idle" ? 999 : total - pos + (isActive ? 20 : 0);

              // clases CSS
              const classes = [
                "archiver",
                isActive ? "is-active" : "",
                phase === "lift" ? "is-lift" : "",
                phase === "fly" ? "is-fly" : "",
                phase === "land" ? "is-land" : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <article
                  key={dataIdx}
                  className={classes}
                  style={
                    {
                      "--depth-z": `${depthZ(pos)}px`,
                      "--pos": pos,
                      zIndex,
                    } as React.CSSProperties
                  }
                  onClick={() => handleClick(dataIdx)}
                >
                  <div
                    className="archiver__tab"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(dataIdx);
                    }}
                  >
                    <span className="archiver__tab-dot" aria-hidden="true" />
                    <span className="archiver__tab-label">{project.title}</span>
                  </div>

                  <div className="archiver__face">
                    {/* zona de imagen + slideshow */}
                    <div className="archiver__img-zone">
                      {images.map((src, i) => (
                        <img
                          key={src + i}
                          src={src}
                          alt={i === 0 ? project.title : ""}
                          className={[
                            "archiver__slide",
                            slideIdx === i ? "is-active" : "",
                          ].join(" ")}
                        />
                      ))}
                      {hasMultiple && (
                        <div className="archiver__dots" aria-hidden="true">
                          {images.map((_, i) => (
                            <span
                              key={i}
                              className={[
                                "archiver__dot",
                                slideIdx === i ? "is-active" : "",
                              ].join(" ")}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* info editorial */}
                    <div className="archiver__info">
                      <div className="archiver__info-row">
                        <p className="archiver__desc">{project.description}</p>
                        <button
                          type="button"
                          className="archiver__cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalProject(project);
                          }}
                        >
                          click for more
                        </button>
                      </div>
                      <span className="archiver__stack">
                        {project.stack.join(" · ")}
                      </span>
                    </div>
                  </div>

                  <div className="archiver__rest" aria-hidden="true">
                    <span>click para expandir</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
      <div className="archiver-controls">
        <div className="archiver-nav" aria-label="Navegar proyectos">
          <button
            type="button"
            className="archiver-nav__btn"
            onClick={backToFront}
            disabled={animating}
            aria-label="Traer al frente"
          >
            ↑
          </button>
          <button
            type="button"
            className="archiver-nav__btn"
            onClick={frontToBack}
            disabled={animating}
            aria-label="Mandar al fondo"
          >
            ↓
          </button>
        </div>

        <div className="archiver-indicator" aria-hidden="true">
          {projects.map((_, i) => (
            <span
              key={i}
              className={[
                "archiver-indicator__dot",
                order[0] === i ? "is-active" : "",
              ].join(" ")}
            />
          ))}
        </div>
      </div>

      <ProjectModal
        project={modalProject}
        index={modalProject ? projects.indexOf(modalProject) : undefined}
        onClose={() => setModalProject(null)}
      />
    </>
  );
}
