import { motion } from 'motion/react'
import { typeColor } from '../../data/types'
import { useEvolutionChain } from '../../hooks/useEvolutionChain'
import Sprite from '../Sprite'
import './EvolutionChain.css'

export default function EvolutionChain({ url, pending, currentId, onSelect }) {
  const stages = useEvolutionChain(url)

  if (!url && !pending) return null

  if (!stages) {
    return (
      <div className="evo evo--loading" aria-hidden="true">
        {[0, 1, 2].map(i => <span key={i} className="evo__skeleton shimmer" />)}
      </div>
    )
  }

  if (stages.flat().length <= 1) {
    return <p className="evo__single">This Pokémon doesn’t evolve.</p>
  }

  return (
    <ol className="evo">
      {stages.map((stage, s) => (
        <li key={s} className={`evo__stage ${stage.length > 3 ? 'is-wide' : ''}`}>
          {s > 0 && (
            <svg className="evo__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          )}
          <ul className="evo__options">
            {stage.map(({ pokemon, how }, i) => {
              const current = pokemon.id === currentId
              return (
                <motion.li
                  key={pokemon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: s * 0.12 + i * 0.04, duration: 0.4 }}
                >
                  <button
                    className={`evo__mon ${current ? 'is-current' : ''}`}
                    style={{ '--t': typeColor(pokemon.types[0]) }}
                    onClick={() => !current && onSelect(pokemon)}
                    aria-current={current ? 'true' : undefined}
                  >
                    <span className="evo__disc type-tint">
                      {current && <motion.span layoutId="evo-ring" className="evo__ring" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                      <Sprite id={pokemon.id} name={pokemon.name} />
                    </span>
                    <span className="evo__name">{pokemon.name}</span>
                    {how && <span className="evo__how">{how}</span>}
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </li>
      ))}
    </ol>
  )
}
