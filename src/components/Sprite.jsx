import { useState } from 'react'
import { motion } from 'motion/react'
import { artworkUrl } from '../data/pokedex'
import './Sprite.css'

// Sources that already finished loading, so a sprite shown again (e.g. the
// card image reappearing in the detail view) doesn't fade in a second time.
const LOADED = new Set()

export default function Sprite({ id, name, shiny = false, className = '', layoutId, eager = false, style }) {
  const src = artworkUrl(id, shiny)
  const [loadedSrc, setLoadedSrc] = useState(() => (LOADED.has(src) ? src : null))
  const loaded = loadedSrc === src

  const markLoaded = () => {
    LOADED.add(src)
    setLoadedSrc(src)
  }

  return (
    <div className={`sprite ${className}`} style={style}>
      {!loaded && <span className="sprite__placeholder shimmer" aria-hidden="true" />}
      <motion.img
        src={src}
        alt={name}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        layoutId={layoutId}
        className="sprite__img"
        onLoad={markLoaded}
        onError={markLoaded}
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.88, y: loaded ? 0 : 8 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], layout: { type: 'spring', stiffness: 160, damping: 22 } }}
      />
    </div>
  )
}
