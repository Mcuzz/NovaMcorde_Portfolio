import { ArchiverStack } from "../components/Archiver/ArchiverStack";
import { projects } from "../data/portfolio";
import { SectionShell } from "./SectionShell";

type ProjectsSectionProps = {
  className?: string
  id?: string
}

export function ProjectsSection({ className, id }: ProjectsSectionProps) {
  return (
    <>
      <SectionShell
        eyebrow="Trabajo seleccionado"
        title="Take a look at my projects"
        id={id}
        className={className}
      >
          <p className="section-lead">
          Proyectos que he llevado a cabo con la misión de probar el potencial de las herramientas que
          he manejado hasta el momento.
        </p>
        
        <ArchiverStack projects={projects} />
        
      </SectionShell>

      {/* el modal ya está dentro de ArchiverStack */}
    </>
  );
}
