import { motion } from 'motion/react'
import { STAT_LABELS } from '../../data/pokedex'
import CountUp from '../CountUp'
import './StatBars.css'

const MAX_STAT = 255

export default function StatBars({ stats, total }) {
  return (
    <ul className="stats">
      {stats.map((value, i) => (
        <li key={STAT_LABELS[i]} className="stats__row">
          <span className="stats__label">{STAT_LABELS[i]}</span>
          <CountUp className="stats__value" value={value} duration={0.9} />
          <span className="stats__track">
            <motion.span
              className={`stats__bar ${value >= 100 ? 'is-high' : ''}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: value / MAX_STAT }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.15 + i * 0.06 }}
            />
          </span>
        </li>
      ))}
      <li className="stats__row stats__row--total">
        <span className="stats__label">Total</span>
        <CountUp className="stats__value" value={total} duration={1.1} />
      </li>
    </ul>
  )
}
