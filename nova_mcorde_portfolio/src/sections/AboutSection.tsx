import { SectionShell } from './SectionShell'

//por favor cambia esto pronto...
const traits = ['+3 coffeE cups per day', 'a kind of artist', 'aprendiz perpetua', 'Hermosillo, MX', 'open to remote', 'Wish materializer']

export function AboutSection() {
  return (
    <SectionShell eyebrow="Sobre mi forma de construir" title="About me">
      <div className="copy-stack">
        <p>
          Soy desarrolladora junior interesada en la interacción humano–computadora y en el diseño de sistemas capaces de resolver problemas reales. Disfruto construir software que combine una experiencia clara para quien lo usa con una arquitectura sólida que le respalde, ya sea en aplicaciones web, móviles o de escritorio.
        </p>
        <p>
          Puedo desarrollar desde plataformas completas hasta herramientas especializadas orientadas a necesidades técnicas específicas.
        </p>
        <p>
          Actualmente estoy fortaleciendo React, TypeScript y arquitectura frontend/backend. 

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
