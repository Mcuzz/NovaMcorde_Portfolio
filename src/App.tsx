import { useCallback, useEffect, useState } from 'react'
import { PortfolioLayout } from './layouts/PortfolioLayout'
import { HomeSection } from './sections/HomeSection'
import type { SectionId } from './types/portfolio'

type ThemeMode = 'light' | 'dark'

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [snapNotice, setSnapNotice] = useState<SectionId>('home')
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection(section)
    setSnapNotice(section)

    const target = document.getElementById(section)
    const scrollPanel = document.querySelector('.content-panel')

    if (target instanceof HTMLElement && scrollPanel instanceof HTMLElement) {
      const panelBounds = scrollPanel.getBoundingClientRect()
      const targetBounds = target.getBoundingClientRect()
      const targetTop = scrollPanel.scrollTop + targetBounds.top - panelBounds.top - 28

      scrollPanel.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
      })
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeMode((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    document.documentElement.style.colorScheme = themeMode
    window.localStorage.setItem('portfolio-theme', themeMode)
  }, [themeMode])

  useEffect(() => {
    const sectionIds: SectionId[] = ['home', 'projects', 'skills', 'about']
    const root = document.querySelector('.content-panel')

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const sectionId = visibleEntry?.target.id as SectionId | undefined

        if (sectionId) {
          setActiveSection(sectionId)
        }
      },
      {
        root,
        rootMargin: '-24% 0px -52% 0px',
        threshold: [0.18, 0.34, 0.5, 0.68],
      },
    )

    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId)

      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <PortfolioLayout
      activeSection={activeSection}
      onNavigate={navigateTo}
      snapNotice={snapNotice}
      themeMode={themeMode}
      onToggleTheme={toggleTheme}
    >
      <HomeSection onNavigate={navigateTo} />
    </PortfolioLayout>
  )
}

export default App
