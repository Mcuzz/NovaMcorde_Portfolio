import { skillGroups } from '../data/portfolio'
import { SectionShell } from './SectionShell'

export function SkillsSection() {
  return (
    <SectionShell eyebrow="Herramientas y sensibilidad técnica" title="Skills">
      <div className="skills-stack">
        {skillGroups.map((group) => (
          <section className="skills-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="skill-grid">
              {group.items.map((skill) => (
                <span className={['skill-pill', skill.learning ? 'is-learning' : ''].join(' ')} key={skill.name}>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </SectionShell>
  )
}
