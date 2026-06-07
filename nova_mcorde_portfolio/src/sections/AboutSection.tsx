import { SectionShell } from './SectionShell'

const traits = ['café lover', 'gamer casual', 'aprendiz perpetua', 'Hermosillo, MX', 'open to remote']

export function AboutSection() {
  return (
    <SectionShell eyebrow="Sobre mi forma de construir" title="About me">
      <div className="copy-stack">
        <p>
          Soy desarrolladora junior con un ojo puesto en el código y el otro en el diseño. Me interesa
          construir experiencias web que sean técnicamente sólidas, pero también memorables y con
          personalidad.
        </p>
        <p>
          Actualmente estoy fortaleciendo React, TypeScript y arquitectura frontend. Me gusta entender
          cómo una idea visual puede convertirse en componentes mantenibles, accesibles y fáciles de
          escalar.
        </p>
      </div>

      <div className="tag-row" aria-label="Detalles personales">
        {traits.map((trait) => (
          <span className="tag" key={trait}>
            {trait}
          </span>
        ))}
      </div>
    </SectionShell>
  )
}
