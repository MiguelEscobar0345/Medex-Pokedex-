import { motion } from 'motion/react'
import './Footer.css'

const LINKS = [
  { label: 'Portfolio', href: 'https://miguesco.dev' },
  { label: 'GitHub', href: 'https://github.com/MiguelEscobar0345' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/miguel-escobar-p' },
  { label: 'Instagram', href: 'https://www.instagram.com/escomiguep' },
  { label: 'Email', href: 'mailto:miguelescobarp03@gmail.com' },
]

const EASE = [0.22, 1, 0.36, 1]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__top">
          <div className="footer__brand">
            <p className="eyebrow">Designed &amp; built by Miguel Escobar</p>
            {/* Observe the visible link, not the masked text: the text starts
                fully clipped, so it would never register as in view */}
            <motion.a
              href="https://miguesco.dev"
              target="_blank"
              rel="noreferrer"
              className="footer__name"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <span className="reveal-line">
                <motion.span
                  className="reveal-line__inner"
                  variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  miguesco
                  <svg className="footer__name-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </motion.span>
              </span>
            </motion.a>
          </div>

          <nav className="footer__links" aria-label="Social links">
            {LINKS.map(l => (
              <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <span>{l.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            ))}
          </nav>
        </div>

        <div className="footer__bottom">
          <p>
            Data from <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a>.
            Pokémon and Pokémon names are trademarks of Nintendo, Game Freak and The Pokémon Company.
          </p>
          <button className="btn btn--ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
