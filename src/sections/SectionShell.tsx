import type { ReactNode } from 'react'

type SectionShellProps = {
  eyebrow?: string
  title?: string
  id?: string
  className?: string
  children: ReactNode
}

export function SectionShell({ eyebrow, title, id, className, children }: SectionShellProps) {
  return (
    <section
      className={['portfolio-section', className ?? ''].filter(Boolean).join(' ')}
      data-portfolio-section={id ? true : undefined}
      id={id}
    >
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      {title ? <h1 className="section-title">{title}</h1> : null}
      {children}
    </section>
  )
}
