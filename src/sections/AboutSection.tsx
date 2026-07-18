import { SectionShell } from './SectionShell'

type AboutSectionProps = {
  className?: string
  id?: string
}

//por favor cambia esto pronto...
const traits = ['+3 coffeE cups per day', 'a kind of artist', 'aprendiz perpetua', 'Hermosillo, MX', 'open to remote', 'Wish materializer']

export function AboutSection({ className, id }: AboutSectionProps) {
  return (
    <SectionShell eyebrow="Sobre mi forma de construir" title="About me" id={id} className={className}>
      <div className="about-mini">
        <div className="about-mini__portrait" aria-hidden="true">
          <span>foto pronto</span>
        </div>

        <div className="about-mini__copy">
          <p className="about-mini__motto">Wish materializer</p>
          <p className="about-mini__desc">
            Puedo desarrollar desde plataformas completas hasta herramientas especializadas
            orientadas a necesidades técnicas específicas.
          </p>
        </div>
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

