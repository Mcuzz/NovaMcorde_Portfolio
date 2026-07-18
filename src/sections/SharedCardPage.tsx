import { profile } from "../data/portfolio";
import { CardFace } from "../components/BusinessCard/CardFace";

function decodeCardData(encoded: string) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(encoded)))) as {
      name?: string;
      role?: string;
    };
  } catch {
    return null;
  }
}

export function SharedCardPage({ encoded }: { encoded: string }) {
  const data = decodeCardData(encoded);
  const role = data?.role ?? "Programador Junior";

  return (
    <div className="shared-card-page">
      <div className="business-card-stage">
        <CardFace photoSrc={profile.portraitSrc} role={role} />
      </div>
      <a className="shared-card-page__link" href={window.location.pathname}>
        Ver el portfolio completo ↗
      </a>
    </div>
  );
}