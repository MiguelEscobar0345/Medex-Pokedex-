import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { dexNumber } from '../data/pokedex'
import { typeColor } from '../data/types'
import Link from './Link'
import Sprite from './Sprite'
import TypeBadge from './TypeBadge'
import './PokemonCard.css'

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 }
const finePointer = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

export default function PokemonCard({ pokemon, hideSprite = false }) {
  const { id, slug, name, types } = pokemon

  // Pointer position within the card, from -0.5 to 0.5 on each axis
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), SPRING)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), SPRING)
  const spriteX = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), SPRING)
  const spriteY = useSpring(useTransform(py, [-0.5, 0.5], [-8, 8]), SPRING)
  const numberX = useTransform(spriteX, v => v * -1.6)

  const handleMove = e => {
    if (!finePointer) return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }

  const handleLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <Link
      to={`/pokemon/${slug}`}
      className="card"
      style={{ '--t': typeColor(types[0]) }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      <motion.div className="card__inner" style={{ rotateX, rotateY, transformPerspective: 900 }}>
        <div className="card__bg" aria-hidden="true">
          <motion.span className="card__number" style={{ x: numberX }}>
            {String(id).padStart(3, '0')}
          </motion.span>
          <span className="card__disc type-tint" />
        </div>

        <motion.div className="card__sprite" style={{ x: spriteX, y: spriteY }}>
          {!hideSprite && <Sprite id={id} name={name} />}
        </motion.div>

        <div className="card__meta">
          <span className="card__id">{dexNumber(id)}</span>
          <h3 className="card__name">{name}</h3>
          <div className="card__types">
            {types.map(t => <TypeBadge key={t} type={t} />)}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
