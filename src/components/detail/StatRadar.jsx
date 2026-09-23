import { motion } from 'motion/react'
import { STAT_LABELS } from '../../data/pokedex'
import './StatRadar.css'

// Clockwise from the top, the order the games draw it: HP, Atk, Def, Spe, SpD, SpA
const AXES = [0, 1, 2, 5, 4, 3]
const SIZE = 260
const C = SIZE / 2
const R = 86
const SCALE_MAX = 180

const point = (axis, ratio) => {
  const angle = (-90 + axis * 60) * (Math.PI / 180)
  return [C + Math.cos(angle) * R * ratio, C + Math.sin(angle) * R * ratio]
}

const toPath = ratios =>
  ratios.map((r, i) => `${i ? 'L' : 'M'}${point(i, r).map(n => n.toFixed(2)).join(' ')}`).join(' ') + ' Z'

const COLLAPSED = toPath(AXES.map(() => 0.02))

// series: [{ stats: number[6], color: string, label?: string }]
export default function StatRadar({ series }) {
  return (
    <svg className="radar" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Base stats radar chart">
      {[1 / 3, 2 / 3, 1].map(r => (
        <path key={r} className={`radar__ring ${r === 1 ? 'radar__ring--outer' : ''}`} d={toPath(AXES.map(() => r))} />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = point(i, 1)
        return <line key={i} className="radar__axis" x1={C} y1={C} x2={x} y2={y} />
      })}

      {series.map((s, n) => (
        <motion.path
          key={s.label ?? n}
          className="radar__shape"
          style={{ '--c': s.color }}
          initial={{ d: COLLAPSED }}
          animate={{ d: toPath(AXES.map(i => Math.min(s.stats[i] / SCALE_MAX, 1.08))) }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.2 + n * 0.1 }}
        />
      ))}

      {AXES.map((stat, i) => {
        const [x, y] = point(i, 1.3)
        return (
          <text key={stat} className="radar__label" x={x} y={y} textAnchor="middle" dominantBaseline="middle">
            {STAT_LABELS[stat]}
            {series.length === 1 && <tspan className="radar__value" x={x} dy="1.2em">{series[0].stats[stat]}</tspan>}
          </text>
        )
      })}
    </svg>
  )
}
