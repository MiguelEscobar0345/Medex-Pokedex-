import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useDragControls } from 'motion/react'
import { GENERATIONS, POKEDEX, dexNumber } from '../../data/pokedex'
import { typeColor } from '../../data/types'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll'
import { teamStore, toggleTeamMember, useStore } from '../../lib/store'
import Link from '../Link'
import Sprite from '../Sprite'
import TypeBadge from '../TypeBadge'
import StatBars from './StatBars'
import StatRadar from './StatRadar'
import EvolutionChain from './EvolutionChain'
import Matchups from './Matchups'
import { CryButton, ShinyButton } from './StageControls'
import './PokemonDetail.css'

const EASE = [0.22, 1, 0.36, 1]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Artwork and number slide in from the side we're navigating towards
const slide = {
  enter: dir => ({ x: dir * 140, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: dir => ({ x: dir * -140, opacity: 0 }),
}

function Placeholder({ lines = 1, width = '100%' }) {
  return (
    <span className="detail__placeholder">
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className="shimmer" style={{ width: i === lines - 1 && lines > 1 ? '60%' : width }} />
      ))}
    </span>
  )
}

// Neighbours follow the list the user is browsing (e.g. only Fire types),
// falling back to National Dex order when the Pokémon isn't in it.
function neighbours(list, id) {
  const source = list.some(p => p.id === id) ? list : POKEDEX
  const i = source.findIndex(p => p.id === id)
  return [source[i - 1] ?? null, source[i + 1] ?? null]
}

export default function PokemonDetail({ pokemon, list, shared, onNavigate, onClose }) {
  const { id, name, types, stats, total, gen } = pokemon
  const { detail, error } = usePokemonDetail(id)
  const compact = useMediaQuery('(max-width: 899px)')
  const dragControls = useDragControls()
  const closeRef = useRef(null)
  const bodyRef = useRef(null)
  const [direction, setDirection] = useState(0)
  const [shiny, setShiny] = useState(false)
  const [prev, next] = neighbours(list, id)
  const inTeam = useStore(teamStore).includes(id)
  const generation = GENERATIONS[gen - 1]
  const layoutId = shared && !compact ? `sprite-${id}` : undefined

  // Keep showing the last evolution chain while the next Pokémon loads, so
  // stepping through one family doesn't flash an empty section.
  const chainUrl = detail?.evolutionChainUrl
  const [shownChain, setShownChain] = useState(chainUrl)
  if (chainUrl && chainUrl !== shownChain) setShownChain(chainUrl)

  useLockBodyScroll()

  const go = (target, dir) => {
    if (!target) return
    setDirection(dir)
    bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    onNavigate(target)
  }

  const goRelative = target => go(target, target.id > id ? 1 : -1)

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' && next) go(next, 1)
      if (e.key === 'ArrowLeft' && prev) go(prev, -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    const previous = document.title
    document.title = `${name} · MeDex by miguesco`
    return () => { document.title = previous }
  }, [name])

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    return () => opener?.focus?.({ preventScroll: true })
  }, [])

  // Desktop keeps the panel free of transforms so the shared sprite can fly
  // in from its card; mobile slides the sheet up instead.
  const panelMotion = compact
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' }, transition: { type: 'spring', stiffness: 280, damping: 32 } }
    : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } }

  return (
    <div className="detail" role="dialog" aria-modal="true" aria-label={name}>
      <motion.div
        className="detail__scrim"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.article
        className="detail__panel"
        style={{ '--t': typeColor(types[0]) }}
        {...panelMotion}
        drag={compact ? 'y' : false}
        dragListener={false}
        dragControls={dragControls}
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose()
        }}
      >
        <motion.div
          className="detail__stage"
          onPointerDown={e => compact && !e.target.closest('button') && dragControls.start(e)}
          onPanEnd={(_, info) => {
            const { x, y } = info.offset
            if (Math.abs(x) < 60 || Math.abs(x) < Math.abs(y)) return
            if (x < 0) go(next, 1)
            else go(prev, -1)
          }}
        >
          <motion.div
            className="detail__stage-bg type-tint"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(75% at 50% 50%)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.span
                key={id}
                className="detail__number"
                aria-hidden="true"
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: EASE }}
              >
                {String(id).padStart(3, '0')}
              </motion.span>
            </AnimatePresence>
            <motion.span
              className="detail__disc"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </motion.div>

          {compact && <span className="detail__handle" aria-hidden="true" />}

          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={id}
              className="detail__art"
              custom={direction}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <motion.div
                className="detail__sprite"
                initial={layoutId ? false : { y: 30, scale: 0.85, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.08 }}
              >
                <Sprite id={id} name={name} shiny={shiny} layoutId={layoutId} eager />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="detail__controls">
            <CryButton id={id} name={name} />
            <ShinyButton shiny={shiny} onToggle={() => setShiny(s => !s)} />
            <span className="detail__spacer" />
            <button className="stage-btn" onClick={() => go(prev, -1)} disabled={!prev} aria-label={prev ? `Previous: ${prev.name}` : 'No previous Pokémon'} title={prev?.name}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button className="stage-btn" onClick={() => go(next, 1)} disabled={!next} aria-label={next ? `Next: ${next.name}` : 'No next Pokémon'} title={next?.name}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </motion.div>

        <motion.div ref={bodyRef} className="detail__body" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={item}>
            <motion.header
              key={id}
              className="detail__head"
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <p className="eyebrow">
                {dexNumber(id)} · {detail?.genus || (error ? 'Pokémon' : <Placeholder width="7em" />)}
              </p>
              <h2 className="detail__name">{name}</h2>
              <div className="detail__types">
                {types.map(t => <TypeBadge key={t} type={t} size="md" />)}
                {detail?.legendary && <span className="detail__tag">Legendary</span>}
                {detail?.mythical && <span className="detail__tag">Mythical</span>}
              </div>
              <div className="detail__actions">
                <button className={`btn ${inTeam ? 'btn--solid' : 'btn--ghost'}`} onClick={() => toggleTeamMember(pokemon)} aria-pressed={inTeam}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.svg
                      key={inTeam ? 'in' : 'out'}
                      width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                    >
                      {inTeam ? <path d="m5 12 5 5 9-10" /> : <path d="M12 5v14M5 12h14" />}
                    </motion.svg>
                  </AnimatePresence>
                  {inTeam ? 'In your team' : 'Add to team'}
                </button>
                <Link to={`/compare/${pokemon.slug}`} className="btn btn--ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" /></svg>
                  Compare
                </Link>
              </div>
            </motion.header>
          </motion.div>

          <motion.p className="detail__flavor" variants={item}>
            {detail?.flavor || (error ? 'Couldn’t load the Pokédex entry. Check your connection and try again.' : <Placeholder lines={3} />)}
          </motion.p>

          <motion.dl className="detail__facts" variants={item}>
            <div>
              <dt>Height</dt>
              <dd>{detail ? `${detail.height.toFixed(1)} m` : '—'}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{detail ? `${detail.weight.toFixed(1)} kg` : '—'}</dd>
            </div>
            <div>
              <dt>Region</dt>
              <dd>{generation.region} <small>Gen {generation.numeral}</small></dd>
            </div>
            <div className="detail__abilities">
              <dt>Abilities</dt>
              <dd>
                {detail
                  ? detail.abilities.map(a => (
                      <span key={a.name} className={`detail__ability ${a.hidden ? 'is-hidden' : ''}`} title={a.hidden ? 'Hidden ability' : undefined}>
                        {a.name}
                      </span>
                    ))
                  : '—'}
              </dd>
            </div>
          </motion.dl>

          <motion.section className="detail__section" variants={item}>
            <h3 className="eyebrow">Base stats</h3>
            <div className="detail__stats">
              <StatRadar series={[{ stats, color: typeColor(types[0]) }]} />
              <StatBars stats={stats} total={total} />
            </div>
          </motion.section>

          <motion.section className="detail__section" variants={item}>
            <h3 className="eyebrow">Evolution</h3>
            <EvolutionChain url={shownChain} pending={!error} currentId={id} onSelect={goRelative} />
          </motion.section>

          <motion.section className="detail__section" variants={item}>
            <h3 className="eyebrow">Type matchups</h3>
            <Matchups types={types} />
          </motion.section>
        </motion.div>

        <button ref={closeRef} className="btn btn--ghost btn--icon detail__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.article>
    </div>
  )
}
