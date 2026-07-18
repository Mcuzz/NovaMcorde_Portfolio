import { forwardRef } from "react";
import type { ReactNode } from "react";
import { contactLinks, nameWaveLines, profile, roleWaveLines } from "../../data/portfolio";
import type { WaveTextLine } from "../../types/portfolio";
import Logo from "../../assets/logo.svg?react";

type CardFaceProps = {
  photoSrc: string;
  role?: string;
};

const services = [
  "Aplicaciones y Diseño Web",
  "Software a Medida",
  "Automatización de Procesos",
  "Seguridad Base",
];

function findContact(id: string) {
  return contactLinks.find((link) => link.id === id);
}

function formatContactValue(href: string) {
  return href.replace(/^tel:/, "").replace(/^mailto:/, "");
}

// Alterna sílabas en itálica/recta, igual que el efecto de WaveText,
// pero estático (sin animación) para que se pueda exportar a PNG.
function renderSyllables(lines: WaveTextLine[], keyPrefix: string): ReactNode[] {
  let index = 0;
  const nodes: ReactNode[] = [];

  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      nodes.push(<span key={`${keyPrefix}-space-${lineIndex}`}> </span>);
    }

    line.forEach((syllable) => {
      const isItalic = index % 2 === 1;
      nodes.push(
        <span
          className={["card-wave-syllable", isItalic ? "is-italic" : ""].join(" ")}
          key={`${keyPrefix}-${index}`}
        >
          {syllable}
        </span>,
      );
      index += 1;
    });
  });

  return nodes;
}

export const CardFace = forwardRef<HTMLDivElement, CardFaceProps>(
  ({ photoSrc }, ref) => {
    const phone = findContact("phone");
    const email = findContact("mail") ?? findContact("email");
    const PhoneIcon = phone?.icon;
    const EmailIcon = email?.icon;

    return (
      <div className="business-card" ref={ref}>
        <div className="business-card__col-left">
          <div className="business-card__photo-wrap">
            <img
              src={photoSrc}
              alt={profile.name}
              className="business-card__photo"
            />
          </div>

          <div className="business-card__contact">
            <p className="business-card__contact-title">Contact</p>
            <ul className="business-card__contact-list">
              {phone && PhoneIcon && (
                <li>
                  <span className="business-card__contact-icon" aria-hidden="true">
                    <PhoneIcon />
                  </span>
                  <span>{formatContactValue(phone.href)}</span>
                </li>
              )}
              {email && EmailIcon && (
                <li>
                  <span className="business-card__contact-icon" aria-hidden="true">
                    <EmailIcon />
                  </span>
                  <span>{formatContactValue(email.href)}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="business-card__header">
          <h2 className="business-card__title">
            {renderSyllables(roleWaveLines, "role")}
          </h2>
          <p className="business-card__name">
            {renderSyllables(nameWaveLines, "name")}
          </p>
        </div>

        <div className="business-card__logo" aria-hidden="true">
          <Logo />
        </div>

        <div className="business-card__services">
          <p className="business-card__services-title">May I Serve..?</p>
          <ul className="business-card__services-list">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  },
);

CardFace.displayName = "CardFace";