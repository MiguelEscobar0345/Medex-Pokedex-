import { AnimatePresence, motion } from 'motion/react'
import { TYPES, defensiveProfile, typeColor, typeLabel } from '../../data/types'
import './Matchups.css'

const GROUPS = [
  { id: 'weak', label: 'Weak to', test: m => m > 1 },
  { id: 'resist', label: 'Resists', test: m => m > 0 && m < 1 },
  { id: 'immune', label: 'Immune to', test: m => m === 0 },
]

const MULTIPLIER = { 4: '4×', 2: '2×', 0.5: '½×', 0.25: '¼×', 0: '0×' }

export default function Matchups({ types }) {
  const profile = defensiveProfile(types)

  return (
    <div className="matchups">
      {GROUPS.map(group => {
        const list = TYPES.filter(t => group.test(profile[t])).sort((a, b) => profile[b] - profile[a])
        return (
          <div key={group.id} className="matchups__row">
            <span className="matchups__label">{group.label}</span>
            <div className="matchups__types">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.length === 0 && (
                  <motion.span key="none" className="matchups__none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    None
                  </motion.span>
                )}
                {list.map(t => (
                  <motion.span
                    key={t}
                    layout
                    className={`matchup type-tint type-ink ${profile[t] >= 4 || (profile[t] > 0 && profile[t] <= 0.25) ? 'is-strong' : ''}`}
                    style={{ '--t': typeColor(t) }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  >
                    {typeLabel(t)}
                    <b>{MULTIPLIER[profile[t]]}</b>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      })}
    </div>
  )
}
