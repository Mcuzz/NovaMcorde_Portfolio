import { useEffect, useRef } from 'react'
import type { Project } from '../../types/portfolio'

type ProjectModalProps = {
  project: Project | null
  index?: number
  onClose: () => void
}

function isVideoSrc(src: string) {
  return /\.(mp4|webm)$/i.test(src)
}

export function ProjectModal({ project, index, onClose }: ProjectModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [project, onClose])

  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [project])

  const images = project?.images?.length
    ? project.images
    : project ? [project.image] : []

  const gifs = project?.gifs ?? []
  const isSingleWord = project ? !project.title.trim().includes(' ') : false
  const number = typeof index === 'number' ? String(index + 1).padStart(2, '0') : null

  return (
    <div
      ref={overlayRef}
      className={['project-modal-overlay', project ? 'is-open' : ''].join(' ')}
      aria-modal="true"
      role="dialog"
      aria-label={project?.title ?? 'Detalle de proyecto'}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <article className="project-modal">
        <button
          type="button"
          className="project-modal__close"
          aria-label="Cerrar"
          onClick={onClose}
        >
          ✕
        </button>

        {project && (
          <>
            <header className="project-modal__masthead">
              <p className="project-modal__eyebrow">
                {number ? `Proyecto Nº ${number}` : 'Proyecto destacado'}
              </p>
            </header>

            <h2
              className={[
                'project-modal__title',
                isSingleWord ? 'project-modal__title--single-word' : '',
              ].join(' ')}
            >
              {project.title}
            </h2>
            <div className="project-modal__rule" aria-hidden="true" />

            <div className="project-modal__gallery">
              {project.status && (
                <span className={['project-modal__status', `is-${project.status}`].join(' ')}>
                  {project.status === 'live' ? 'En vivo' : 'Próximamente'}
                </span>
              )}
              {images.map((src, i) => (
                <img
                  key={src + i}
                  src={src}
                  alt={`${project.title} — vista ${i + 1}`}
                  className="project-modal__img"
                />
              ))}
            </div>

            <div className="project-modal__body">
              <p className="project-modal__desc">{project.description}</p>

              <div className="project-modal__stack">
                {project.stack.map((tech) => (
                  <span key={tech} className="project-modal__tag">{tech}</span>
                ))}
              </div>

              
            </div>

            {gifs.length > 0 && (
              <div className="project-modal__motion">
                <p className="project-modal__motion-label">En movimiento</p>
                <div className="project-modal__carousel" role="group" aria-label="Demos animadas, desliza para ver más">
                  {gifs.map((gif, i) => (
                    <figure className="project-modal__gif-card" key={gif.src + i}>
                      {isVideoSrc(gif.src) ? (
                        <video
                          className="project-modal__gif"
                          src={gif.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          aria-label={gif.caption}
                        />
                      ) : (
                        <img
                          src={gif.src}
                          alt={gif.caption}
                          className="project-modal__gif"
                          loading="lazy"
                        />
                      )}
                      <figcaption className="project-modal__gif-caption">{gif.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {project.href && project.href !== '#' && (
              <a
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="project-modal__link"
              >
                  No te aburro mas, visitalo aqui ↗
                </a>
              )}

            
          </>
        )}
      </article>
    </div>
  )
}