import { useEffect, useRef } from 'react'
import { motion, useDragControls } from 'motion/react'
import { GENERATIONS, dexNumber } from '../../data/pokedex'
import { typeColor } from '../../data/types'
import { usePokemonDetail } from '../../hooks/usePokemonDetail'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Sprite from '../Sprite'
import TypeBadge from '../TypeBadge'
import StatBars from './StatBars'
import './PokemonDetail.css'

const EASE = [0.22, 1, 0.36, 1]
const PANEL_SPRING = { type: 'spring', stiffness: 280, damping: 32 }

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

function useLockBodyScroll() {
  useEffect(() => {
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = ''
      body.style.paddingRight = ''
    }
  }, [])
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

export default function PokemonDetail({ pokemon, onClose }) {
  const { id, name, types, stats, total, gen } = pokemon
  const { detail, error } = usePokemonDetail(id)
  const compact = useMediaQuery('(max-width: 899px)')
  const dragControls = useDragControls()
  const closeRef = useRef(null)
  const generation = GENERATIONS[gen - 1]

  useLockBodyScroll()

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const previous = document.title
    document.title = `${name} · MeDex`
    return () => { document.title = previous }
  }, [name])

  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    return () => opener?.focus?.({ preventScroll: true })
  }, [])

  const panelMotion = compact
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { opacity: 0, y: 48, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 32, scale: 0.98 } }

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
        transition={PANEL_SPRING}
        drag={compact ? 'y' : false}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 600) onClose()
        }}
      >
        <div className="detail__stage type-tint" onPointerDown={e => compact && dragControls.start(e)}>
          {compact && <span className="detail__handle" aria-hidden="true" />}
          <span className="detail__number" aria-hidden="true">{String(id).padStart(3, '0')}</span>
          <motion.span
            className="detail__disc"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          <motion.div
            className="detail__sprite"
            initial={{ y: 30, scale: 0.85, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16, delay: 0.08 }}
          >
            <Sprite id={id} name={name} eager />
          </motion.div>
        </div>

        <motion.div className="detail__body" variants={stagger} initial="hidden" animate="visible">
          <motion.header className="detail__head" variants={item}>
            <p className="eyebrow">
              {dexNumber(id)} · {detail?.genus || (error ? 'Pokémon' : <Placeholder width="7em" />)}
            </p>
            <h2 className="detail__name">{name}</h2>
            <div className="detail__types">
              {types.map(t => <TypeBadge key={t} type={t} size="md" />)}
              {detail?.legendary && <span className="detail__tag">Legendary</span>}
              {detail?.mythical && <span className="detail__tag">Mythical</span>}
            </div>
          </motion.header>

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
            <StatBars stats={stats} total={total} />
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
