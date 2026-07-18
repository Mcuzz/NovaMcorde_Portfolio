import { useState } from "react";
import { navigationSections, profile } from "../../data/portfolio";
import { useFaceNavigationCanvas } from "../../hooks/useFaceNavigationCanvas";
import { BusinessCard } from "../BusinessCard/BusinessCard";
import type { SectionId } from "../../types/portfolio";

type FaceNavigationProps = {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
};

export function FaceNavigation({
  activeSection,
  onNavigate,
  themeMode,
  onToggleTheme,
}: FaceNavigationProps) {
  const { canvasRef, captureSnapshot, resetFace } = useFaceNavigationCanvas({
    activeSection,
    onSelect: onNavigate,
    portraitSrc: profile.portraitSrc,
  });

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  function getLabelPosition(angle: number) {
    const radius = 135;

    return {
      left: 130 + Math.cos(angle) * radius,
      top: 130 + Math.sin(angle) * radius,
    };
  }

  const handleGenerateCard = () => {
    setSnapshot(captureSnapshot());
    setIsCardOpen(true);
  };

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

        <button
          type="button"
          className="face-nav__reset"
          onClick={resetFace}
          aria-label="Reiniciar rostro"
          title="Reiniciar rostro"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7" />
            <path d="M3 4v5h5" />
          </svg>
        </button>

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

      <button
        type="button"
        className="theme-switch"
        aria-pressed={themeMode === "dark"}
        aria-label={`Cambiar a modo ${themeMode === "dark" ? "claro" : "oscuro"}`}
        onClick={onToggleTheme}
      >
        <span className="theme-switch__label">
          {themeMode === "dark" ? "dark" : "light"}
        </span>
        <span className="theme-switch__track" aria-hidden="true">
          <span className="theme-switch__thumb" />
        </span>
      </button>

      <button
        type="button"
        className="generate-card-btn"
        onClick={handleGenerateCard}
      >
        <span className="generate-card-btn__label">Generate card</span>
        <span className="generate-card-btn__icon" aria-hidden="true">✦</span>
      </button>

      {isCardOpen && (
        <BusinessCard
          photoSrc={snapshot ?? profile.portraitSrc}
          onClose={() => setIsCardOpen(false)}
        />
      )}
    </div>
  );
}