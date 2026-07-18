import type { SkillGroup } from '../../types/portfolio'

type SkillsIndexProps = {
  groups: SkillGroup[]
}

function getMastheadSkills(groups: SkillGroup[]) {
  return groups
    .flatMap((group) => group.items)
    .filter((item) => !item.learning)
    .slice(0, 6)
    .map((item) => item.name)
}

export function SkillsIndex({ groups }: SkillsIndexProps) {
  const mastheadSkills = getMastheadSkills(groups)

  return (
    <div className="skills-index">
      <div className="skills-index__masthead">
        <p className="section-eyebrow">Actualmente favoreciendo</p>
        <div className="tag-row">
          {mastheadSkills.map((skill) => (
            <span className="tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <hr className="divider" />

      <div className="skills-index__groups">
        {groups.map((group, groupIndex) => (
          <section className="skills-index__group" key={group.title}>
            <span className="skills-index__number" aria-hidden="true">
              {String(groupIndex + 1).padStart(2, '0')}
            </span>

            <div className="skills-index__content">
              <p className="section-eyebrow">{group.title}</p>

              <ul className="skills-index__list">
                {group.items.map((item) => (
                  <li
                    className={['skills-index__item', item.learning ? 'is-learning' : ''].join(' ')}
                    key={item.name}
                  >
                    <span className="skills-index__name">{item.name}</span>
                    <span className="skills-index__leader" aria-hidden="true" />
                    <span className="skills-index__tag">
                      {item.learning ? 'aprendiendo' : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}