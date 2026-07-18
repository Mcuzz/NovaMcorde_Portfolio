import type { ComponentType, SVGProps } from 'react'

export type SectionId = 'home' | 'about' | 'skills' | 'projects'

export type NavigationSection = {
  id: SectionId
  label: string
  ariaLabel: string
}

export type ContactLink = {
  id: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  href: string
}

export type ProjectGif = {
  src: string
  caption: string
}

export type Project = {
  title: string
  description: string
  stack: string[]
  href?: string
  status?: 'live' | 'soon'
  image: string
  images?: string[]
  gifs?: ProjectGif[]
}
export type SkillGroup = {
  title: string
  items: Array<{
    name: string
    learning?: boolean
    /** 0-100. Si se omite, el nivel se genera automáticamente a partir del nombre. */
    level?: number
  }>
}

export type WaveTextLine = string[]
