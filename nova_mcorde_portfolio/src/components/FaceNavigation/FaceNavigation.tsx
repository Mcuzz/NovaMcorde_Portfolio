import { navigationSections, profile } from "../../data/portfolio";
import { useFaceNavigationCanvas } from "../../hooks/useFaceNavigationCanvas";
import type { SectionId } from "../../types/portfolio";

type FaceNavigationProps = {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
};


export function FaceNavigation({
  activeSection,
  onNavigate,
}: FaceNavigationProps) {
  const { canvasRef } = useFaceNavigationCanvas({
    activeSection,
    onSelect: onNavigate,
    portraitSrc: profile.portraitSrc,
  });

  function getLabelPosition(angle: number) {
    const radius = 135;

    return {
      left: 130 + Math.cos(angle) * radius,
      top: 130 + Math.sin(angle) * radius,
    };
  }
  return (
    <div className="face-nav">
      <div className="face-nav__header">
        <p>
          Deforma el rostro arrastrando el cursor, o selecciona la opción a la
          cual deseas navegar
        </p>
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

        {navigationSections.map((section, index) => {
          const angles = [
            (-3 * Math.PI) / 4,
            -Math.PI / 2,
            Math.PI / 4,
            Math.PI / 2,
          ];

          const pos = getLabelPosition(angles[index]);

          return (
            <button
              key={section.id}
              type="button"
              className={[
                "face-nav__label",
                activeSection === section.id ? "is-active" : "",
              ].join(" ")}
              style={{
                position: "absolute",
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => onNavigate(section.id)}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
