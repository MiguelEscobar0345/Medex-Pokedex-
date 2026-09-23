import { motion } from 'motion/react'
import { GENERATIONS, SORTS } from '../data/pokedex'
import { TYPES, typeColor, typeLabel } from '../data/types'
import CountUp from './CountUp'
import './Filters.css'

const PILL_SPRING = { type: 'spring', stiffness: 500, damping: 38 }

function Chip({ active, onClick, layoutId, children, ...props }) {
  return (
    <button
      className={`chip ${active ? 'is-active' : ''}`}
      aria-pressed={active}
      onClick={e => {
        e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        onClick()
      }}
      {...props}
    >
      {active && <motion.span layoutId={layoutId} className="chip__bg" transition={PILL_SPRING} />}
      <span className="chip__label">{children}</span>
    </button>
  )
}

export default function Filters({ filters, onChange, count }) {
  const set = patch => onChange({ ...filters, ...patch })

  return (
    <div className="filters">
      <div className="page filters__inner">
        <div className="filters__scroller" aria-label="Filter by type">
          <Chip active={filters.type === 'all'} layoutId="type-chip" onClick={() => set({ type: 'all' })}>
            All types
          </Chip>
          {TYPES.map(t => (
            <Chip key={t} active={filters.type === t} layoutId="type-chip" onClick={() => set({ type: t })} style={{ '--t': typeColor(t) }}>
              <span className="chip__dot" aria-hidden="true" />
              {typeLabel(t)}
            </Chip>
          ))}
        </div>

        <div className="filters__row">
          <div className="filters__scroller filters__gens" aria-label="Filter by generation">
            <Chip active={filters.gen === 0} layoutId="gen-chip" onClick={() => set({ gen: 0 })}>
              All gens
            </Chip>
            {GENERATIONS.map(g => (
              <Chip key={g.id} active={filters.gen === g.id} layoutId="gen-chip" onClick={() => set({ gen: g.id })} title={`Generation ${g.numeral} · ${g.region}`}>
                {g.numeral}
              </Chip>
            ))}
          </div>

          <label className="sort">
            <span>Sort</span>
            <select value={filters.sort} onChange={e => set({ sort: e.target.value })}>
              {SORTS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>

          <p className="filters__count" aria-live="polite">
            <CountUp value={count} duration={0.6} /> Pokémon
          </p>
        </div>
      </div>
    </div>
  )
}
