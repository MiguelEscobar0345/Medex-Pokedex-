import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { TOTAL_SPECIES, dexNumber, randomPokemon } from '../data/pokedex'
import { typeColor } from '../data/types'
import { navigate } from '../lib/router'
import Link from './Link'
import CountUp from './CountUp'
import Sprite from './Sprite'
import TypeBadge from './TypeBadge'
import './Hero.css'

const EASE = [0.22, 1, 0.36, 1]
const ROTATE_MS = 7000

function RevealLine({ children, index }) {
  return (
    <span className="reveal-line">
      <motion.span
        className="reveal-line__inner"
        initial={{ y: '110%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: 0.1 + index * 0.12, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  )
}

const fadeUp = delay => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: EASE },
})

export default function Hero() {
  const [featured, setFeatured] = useState(() => randomPokemon())
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setFeatured(p => randomPokemon(p.id)), ROTATE_MS)
    return () => clearInterval(t)
  }, [paused, featured])

  const shuffle = () => setFeatured(p => randomPokemon(p.id))

  return (
    <section className="hero page">
      <div className="hero__copy">
        <motion.p className="eyebrow" {...fadeUp(0)}>National Pokédex · Gen I–IX</motion.p>
        <h1 className="hero__title">
          <RevealLine index={0}>A field guide</RevealLine>
          <RevealLine index={1}>to <CountUp value={TOTAL_SPECIES} duration={1.8} className="hero__count" /> Pokémon.</RevealLine>
        </h1>
        <motion.p className="hero__lede" {...fadeUp(0.35)}>
          Search by name or number, filter by type and generation, and open any entry
          for stats, evolutions and type matchups.
        </motion.p>
        <motion.div className="hero__cta" {...fadeUp(0.45)}>
          <a href="#dex" className="btn btn--solid">Browse the Pokédex</a>
          <button className="btn btn--ghost" onClick={() => navigate(`/pokemon/${randomPokemon().slug}`)}>
            Surprise me
          </button>
        </motion.div>
      </div>

      <motion.div
        className="hero__stage"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2, ease: EASE }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={featured.id}
            className="hero__feature"
            style={{ '--t': typeColor(featured.types[0]) }}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <motion.span
              className="hero__number"
              aria-hidden="true"
              variants={{ enter: { x: 60, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: -60, opacity: 0 } }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {dexNumber(featured.id).slice(1)}
            </motion.span>
            <motion.span
              className="hero__disc type-tint"
              variants={{ enter: { scale: 0.6, opacity: 0 }, center: { scale: 1, opacity: 1 }, exit: { scale: 1.15, opacity: 0 } }}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <motion.div
              className="hero__sprite"
              variants={{ enter: { y: 40, scale: 0.8, opacity: 0 }, center: { y: 0, scale: 1, opacity: 1 }, exit: { y: -30, scale: 1.05, opacity: 0 } }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            >
              <Link to={`/pokemon/${featured.slug}`} className="hero__float" aria-label={`Open ${featured.name}`}>
                <Sprite id={featured.id} name={featured.name} eager />
              </Link>
            </motion.div>
            <motion.div
              className="hero__caption"
              variants={{ enter: { y: 12, opacity: 0 }, center: { y: 0, opacity: 1 }, exit: { opacity: 0 } }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            >
              <span className="eyebrow">{dexNumber(featured.id)}</span>
              <strong>{featured.name}</strong>
              <span className="hero__types">
                {featured.types.map(t => <TypeBadge key={t} type={t} />)}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          className="btn btn--ghost btn--icon hero__shuffle"
          onClick={shuffle}
          aria-label="Show another Pokémon"
          whileTap={{ rotate: 180, scale: 0.9 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
        </motion.button>
      </motion.div>
    </section>
  )
}
