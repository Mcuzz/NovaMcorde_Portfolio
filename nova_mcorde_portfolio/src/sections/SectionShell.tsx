import type { ReactNode } from 'react'

type SectionShellProps = {
  eyebrow?: string
  title?: string
  children: ReactNode
}

export function SectionShell({ eyebrow, title, children }: SectionShellProps) {
  return (
    <section className="portfolio-section">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      {title ? <h1 className="section-title">{title}</h1> : null}
      {children}
    </section>
  )
}
