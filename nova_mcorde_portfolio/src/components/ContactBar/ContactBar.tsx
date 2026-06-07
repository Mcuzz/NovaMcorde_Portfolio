import { contactLinks } from '../../data/portfolio'

export function ContactBar() {
  return (
    <section className="contact-bar" aria-labelledby="contact-title">
      <h2 id="contact-title">Contact</h2>
      <p>Interested in some amazing project? Get in touch; I’ll be happy to be in.</p>

      <ul className="contact-bar__links" aria-label="Contact links">
        {contactLinks.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              target={link.href.startsWith('http') ? '_blank' : undefined}
            >
              <span aria-hidden="true">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <small>© Natalia Urias, 2026</small>
    </section>
  )
}
