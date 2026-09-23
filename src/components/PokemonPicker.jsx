import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { dexNumber, filterPokedex } from '../data/pokedex'
import { typeColor } from '../data/types'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import Sprite from './Sprite'
import './PokemonPicker.css'

const MAX_RESULTS = 40

// Search-and-pick dialog used by the team builder and the comparison page
export default function PokemonPicker({ title = 'Choose a Pokémon', exclude = [], onPick, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef(null)

  useLockBodyScroll()

  const results = filterPokedex({ search: query, type: 'all', gen: 0, sort: 'id' })
    .filter(p => !exclude.includes(p.id))
    .slice(0, MAX_RESULTS)
  const activeIndex = Math.min(active, results.length - 1)

  useEffect(() => {
    listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const onKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIndex + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIndex - 1, 0)) }
    if (e.key === 'Enter' && results[activeIndex]) onPick(results[activeIndex])
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="picker" role="dialog" aria-modal="true" aria-label={title}>
      <motion.div className="picker__scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="picker__panel"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      >
        <div className="picker__head">
          <p className="eyebrow">{title}</p>
          <input
            autoFocus
            type="search"
            className="picker__input"
            placeholder="Search by name or number"
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="picker-results"
            aria-activedescendant={results[activeIndex] ? `pick-${results[activeIndex].id}` : undefined}
          />
        </div>

        <ul ref={listRef} id="picker-results" className="picker__list" role="listbox">
          {results.map((p, i) => (
            <li
              key={p.id}
              id={`pick-${p.id}`}
              role="option"
              aria-selected={i === activeIndex}
              className="picker__option"
              style={{ '--t': typeColor(p.types[0]) }}
              onPointerMove={() => i !== activeIndex && setActive(i)}
              onClick={() => onPick(p)}
            >
              <span className="picker__disc type-tint"><Sprite id={p.id} name="" /></span>
              <span className="picker__id">{dexNumber(p.id)}</span>
              <span className="picker__name">{p.name}</span>
              <span className="picker__types">
                {p.types.map(t => <span key={t} className="picker__dot" style={{ background: typeColor(t) }} title={t} />)}
              </span>
            </li>
          ))}
          {results.length === 0 && <li className="picker__empty">No matches</li>}
        </ul>
      </motion.div>
    </div>
  )
}
