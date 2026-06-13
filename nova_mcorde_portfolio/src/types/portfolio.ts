export type SectionId = 'home' | 'about' | 'skills' | 'projects'

export type NavigationSection = {
  id: SectionId
  label: string
  ariaLabel: string
}

export type ContactLink = {
  id: string
  icon: string
  label: string
  href: string
}

export type Project = {
  title: string
  description: string
  stack: string[]
  href?: string
  status?: 'live' | 'soon'
  image: string
  images?: string[]
}

export type SkillGroup = {
  title: string
  items: Array<{
    name: string
    learning?: boolean
  }>
}

export type WaveTextLine = string[]