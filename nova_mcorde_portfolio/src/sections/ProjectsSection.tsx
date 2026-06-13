import { SardineCan } from '../components/SardineCan/SardineCan'
import { projects } from '../data/portfolio'
import { SectionShell } from './SectionShell'

export function ProjectsSection() {
  return (
    <SectionShell title="Take a look at this project">
      <p className="section-lead">
        Proyectos que he llevado a cabo con la misión de probar el potencial de las herramientas que he
        manejado hasta el momento.
      </p>

      <div className="sardine-can-grid" aria-label="Lista de proyectos destacados">
        {projects.map((project) => (
          <SardineCan project={project} key={project.title} />
        ))}
        <div className="sardine-can sardine-can--empty" aria-hidden="true">
          <span>Próximamente...</span>
        </div>
      </div>
    </SectionShell>
  )
}