import { ProjectCard } from '../components/ProjectCard/ProjectCard'
import { projects } from '../data/portfolio'
import { SectionShell } from './SectionShell'

export function ProjectsSection() {
  return (
    <SectionShell title="Take a look at this project">
      <p className="section-lead">
        Proyectos que he llevado a cabo con la misión de probar el potencial de las herramientas que he
        manejado hasta el momento.
      </p>

      <div className="project-carousel" aria-label="Lista de proyectos destacados">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.title} />
        ))}
        <article className="project-card project-card--empty">
          <span>Próximamente...</span>
        </article>
      </div>
    </SectionShell>
  )
}
