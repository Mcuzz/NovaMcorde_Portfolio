import type { Project } from '../../types/portfolio'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>

      <div className="project-card__meta">
        <span>{project.stack.join(' · ')}</span>
        {project.href ? <a href={project.href}>↗ Ver proyecto</a> : null}
      </div>
    </article>
  )
}
