import { motion } from 'motion/react'
import { teamStore, useStore } from '../lib/store'
import Link from './Link'
import './Nav.css'

const ICONS = {
  dex: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16" /><circle cx="12" cy="12" r="2.5" /></>,
  team: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>,
  compare: <><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" /></>,
  game: <><path d="M12 3a9 9 0 1 0 9 9" /><path d="M12 7v5l3 2" /><path d="M17 3h4v4" /></>,
}

const SECTIONS = [
  { id: 'home', to: '/', label: 'Pokédex', icon: 'dex' },
  { id: 'team', to: '/team', label: 'Team', icon: 'team' },
  { id: 'compare', to: '/compare', label: 'Compare', icon: 'compare' },
]

export default function Nav({ section, variant = 'top' }) {
  const teamSize = useStore(teamStore).length

  return (
    <nav className={`nav nav--${variant}`} aria-label="Sections">
      {SECTIONS.map(s => {
        const active = s.id === section
        return (
          <Link key={s.id} to={s.to} className={`nav__link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
            {active && <motion.span layoutId={`nav-pill-${variant}`} className="nav__pill" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <svg className="nav__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[s.icon]}
            </svg>
            <span className="nav__label">{s.label}</span>
            {s.id === 'team' && teamSize > 0 && (
              <motion.span key={teamSize} className="nav__badge" initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 600, damping: 18 }}>
                {teamSize}
              </motion.span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
