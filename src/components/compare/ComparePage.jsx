import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { POKEDEX, STAT_LABELS, dexNumber, getBySlug, randomPokemon } from '../../data/pokedex'
import { typeColor, typeLabel } from '../../data/types'
import { navigate } from '../../lib/router'
import { bestStab } from '../../lib/team'
import CountUp from '../CountUp'
import Link from '../Link'
import PageHead from '../PageHead'
import PokemonPicker from '../PokemonPicker'
import Sprite from '../Sprite'
import TypeBadge from '../TypeBadge'
import StatRadar from '../detail/StatRadar'
import './ComparePage.css'

const MAX_STAT = 255
const SPRING = { type: 'spring', stiffness: 300, damping: 30 }
const FALLBACK_B = '#aa8b56'

const pathFor = (a, b) => (a && b ? `/compare/${a.slug}-vs-${b.slug}` : a || b ? `/compare/${(a || b).slug}` : '/compare')

// Pokémon of the same primary type with the closest base stat total
function rivalsFor(p) {
  return POKEDEX
    .filter(o => o.id !== p.id && o.types[0] === p.types[0])
    .sort((x, y) => Math.abs(x.total - p.total) - Math.abs(y.total - p.total))
    .slice(0, 4)
}

function Slot({ pokemon, color, label, onPick }) {
  if (!pokemon) {
    return (
      <motion.button layout className="compare-slot compare-slot--empty" onClick={onPick} transition={SPRING}>
        <span className="team-slot__plus" aria-hidden="true">+</span>
        Choose {label}
      </motion.button>
    )
  }
  return (
    <motion.div layout layoutId={`compare-${pokemon.id}`} className="compare-slot" style={{ '--t': color }} transition={SPRING}>
      <Link to={`/pokemon/${pokemon.slug}`} className="compare-slot__art">
        <span className="compare-slot__disc type-tint" />
        <Sprite id={pokemon.id} name={pokemon.name} />
      </Link>
      <div className="compare-slot__meta">
        <span className="eyebrow">{dexNumber(pokemon.id)}</span>
        <h2>{pokemon.name}</h2>
        <div className="compare-slot__types">{pokemon.types.map(t => <TypeBadge key={t} type={t} />)}</div>
        <button className="btn btn--ghost compare-slot__change" onClick={onPick}>Change</button>
      </div>
    </motion.div>
  )
}

function Verdict({ a, b }) {
  const line = (x, y) => {
    const { type, multiplier } = bestStab(x, y)
    const strength = multiplier > 1 ? 'is-good' : multiplier < 1 ? 'is-bad' : ''
    const label = multiplier === 0 ? 'no effect' : `${multiplier}×`
    return (
      <p className="verdict__line">
        <strong>{x.name}</strong>’s best {typeLabel(type)} moves hit <strong>{y.name}</strong> for{' '}
        <span className={`verdict__mult ${strength}`}>{label}</span>
      </p>
    )
  }
  const diff = a.total - b.total
  return (
    <div className="verdict">
      {line(a, b)}
      {line(b, a)}
      <p className="verdict__line">
        {diff === 0 ? 'Their base stat totals are identical.' : (
          <><strong>{diff > 0 ? a.name : b.name}</strong> has <span className="verdict__mult">{Math.abs(diff)}</span> more total base stats.</>
        )}
      </p>
    </div>
  )
}

export default function ComparePage({ a: slugA, b: slugB }) {
  const a = slugA ? getBySlug(slugA) : null
  const b = slugB ? getBySlug(slugB) : null
  const [picking, setPicking] = useState(null)

  const colorA = a ? typeColor(a.types[0]) : undefined
  let colorB = b ? typeColor(b.types[0]) : undefined
  if (b && colorA === colorB) colorB = b.types[1] ? typeColor(b.types[1]) : FALLBACK_B

  const set = (slot, p) => navigate(slot === 'a' ? pathFor(p, b) : pathFor(a, p), { replace: true })

  return (
    <section className="page compare">
      <PageHead eyebrow="Head to head" title="Compare" lede="Put two Pokémon side by side: base stats, type advantage and who comes out ahead.">
        <button className="btn btn--ghost" onClick={() => navigate(pathFor(randomPokemon(), randomPokemon()), { replace: true })}>
          Random matchup
        </button>
      </PageHead>

      <div className="compare__head">
        <Slot pokemon={a} color={colorA} label="a Pokémon" onPick={() => setPicking('a')} />
        <motion.button
          className="compare__swap btn btn--ghost btn--icon"
          onClick={() => navigate(pathFor(b, a), { replace: true })}
          disabled={!a && !b}
          aria-label="Swap sides"
          whileTap={{ rotate: 180 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
          </svg>
        </motion.button>
        <Slot pokemon={b} color={colorB} label="a rival" onPick={() => setPicking('b')} />
      </div>

      {a && b ? (
        <motion.div className="compare__body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="compare__radar">
            <StatRadar series={[{ stats: a.stats, color: colorA, label: 'a' }, { stats: b.stats, color: colorB, label: 'b' }]} />
            <div className="compare__legend">
              <span style={{ '--c': colorA }}>{a.name}</span>
              <span style={{ '--c': colorB }}>{b.name}</span>
            </div>
          </div>

          <ul className="duel">
            {STAT_LABELS.map((label, i) => {
              const va = a.stats[i]
              const vb = b.stats[i]
              return (
                <li key={label} className="duel__row">
                  <CountUp value={va} className={`duel__value ${va > vb ? 'is-win' : ''}`} duration={0.8} />
                  <span className="duel__track duel__track--a">
                    <motion.span className="duel__bar" style={{ background: colorA }} initial={{ scaleX: 0 }} animate={{ scaleX: va / MAX_STAT }} transition={{ ...SPRING, delay: i * 0.05 }} />
                  </span>
                  <span className="duel__label">{label}</span>
                  <span className="duel__track">
                    <motion.span className="duel__bar" style={{ background: colorB }} initial={{ scaleX: 0 }} animate={{ scaleX: vb / MAX_STAT }} transition={{ ...SPRING, delay: i * 0.05 }} />
                  </span>
                  <CountUp value={vb} className={`duel__value ${vb > va ? 'is-win' : ''}`} duration={0.8} />
                </li>
              )
            })}
            <li className="duel__row duel__row--total">
              <CountUp value={a.total} className={`duel__value ${a.total > b.total ? 'is-win' : ''}`} />
              <span />
              <span className="duel__label">Total</span>
              <span />
              <CountUp value={b.total} className={`duel__value ${b.total > a.total ? 'is-win' : ''}`} />
            </li>
          </ul>

          <Verdict a={a} b={b} />
        </motion.div>
      ) : (a || b) ? (
        <div className="compare__suggest">
          <p className="eyebrow">Suggested rivals</p>
          <div className="compare__rivals">
            {rivalsFor(a || b).map(r => (
              <button key={r.id} className="rival" style={{ '--t': typeColor(r.types[0]) }} onClick={() => set(a ? 'b' : 'a', r)}>
                <span className="rival__disc type-tint"><Sprite id={r.id} name="" /></span>
                <span>{r.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AnimatePresence>
        {picking && (
          <PokemonPicker
            title={picking === 'a' ? 'Choose a Pokémon' : 'Choose a rival'}
            exclude={[a?.id, b?.id].filter(Boolean)}
            onPick={p => {
              set(picking, p)
              setPicking(null)
            }}
            onClose={() => setPicking(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
