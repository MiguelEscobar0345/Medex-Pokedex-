import { AnimatePresence, motion } from 'motion/react'
import { getById } from '../data/pokedex'
import { TEAM_SIZE, teamStore, useStore } from '../lib/store'
import Link from './Link'
import Sprite from './Sprite'
import './TeamDock.css'

// Floating summary of the current team, shown while browsing the Pokédex
export default function TeamDock({ visible }) {
  const team = useStore(teamStore).map(getById)

  return (
    <AnimatePresence>
      {visible && team.length > 0 && (
        <motion.div
          className="dock"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <Link to="/team" className="dock__link" aria-label={`Your team: ${team.map(p => p.name).join(', ')}`}>
            <span className="dock__label">Team</span>
            <span className="dock__slots">
              {Array.from({ length: TEAM_SIZE }, (_, i) => {
                const p = team[i]
                return (
                  <span key={p ? p.id : `empty-${i}`} className={`dock__slot ${p ? '' : 'is-empty'}`}>
                    {p && (
                      <motion.span
                        className="dock__sprite"
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 520, damping: 16 }}
                      >
                        <Sprite id={p.id} name="" />
                      </motion.span>
                    )}
                  </span>
                )
              })}
            </span>
            <span className="dock__cta" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
