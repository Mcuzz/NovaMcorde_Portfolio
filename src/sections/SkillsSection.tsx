import { SkillsIndex } from '../components/SkillsIndex/SkillsIndex'
import { skillGroups } from '../data/portfolio'
import { SectionShell } from './SectionShell'

type SkillsSectionProps = {
  className?: string
  id?: string
}

export function SkillsSection({ className, id }: SkillsSectionProps) {
  return (
    <SectionShell eyebrow="Herramientas y sensibilidad técnica" title="Skills" id={id} className={className}>
      <SkillsIndex groups={skillGroups} />
    </SectionShell>
  )
}