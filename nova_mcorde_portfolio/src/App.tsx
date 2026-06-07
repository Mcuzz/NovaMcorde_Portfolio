import { useCallback, useMemo, useState } from 'react'
import { PortfolioLayout } from './layouts/PortfolioLayout'
import { AboutSection } from './sections/AboutSection'
import { HomeSection } from './sections/HomeSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { SkillsSection } from './sections/SkillsSection'
import type { SectionId } from './types/portfolio'

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [snapNotice, setSnapNotice] = useState<SectionId>('home')

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection(section)
    setSnapNotice(section)
  }, [])

  const sectionContent = useMemo(
    () => ({
      home: <HomeSection onNavigate={navigateTo} />,
      about: <AboutSection />,
      skills: <SkillsSection />,
      projects: <ProjectsSection />,
    }),
    [navigateTo],
  )

  return (
    <PortfolioLayout
      activeSection={activeSection}
      onNavigate={navigateTo}
      snapNotice={snapNotice}
    >
      {sectionContent[activeSection]}
    </PortfolioLayout>
  )
}

export default App
