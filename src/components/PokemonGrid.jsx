import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import PokemonCard from './PokemonCard'
import Sprite from './Sprite'
import './PokemonGrid.css'

const PAGE = 36
const EASE = [0.22, 1, 0.36, 1]

export default function PokemonGrid({ list, resetKey, selectedId, onOpen, onReset }) {
  const [limit, setLimit] = useState(PAGE)
  const [prevKey, setPrevKey] = useState(resetKey)
  const sentinelRef = useRef(null)

  // Filters changed: start again from the first page
  if (resetKey !== prevKey) {
    setPrevKey(resetKey)
    setLimit(PAGE)
  }

  const hasMore = limit < list.length

  // Re-created after every page so it fires again if the sentinel is still in range
  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setLimit(l => l + PAGE) },
      { rootMargin: '900px 0px' }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [limit, hasMore])

  if (list.length === 0) {
    return (
      <motion.div className="grid-empty" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Sprite id={54} name="Psyduck" className="grid-empty__sprite" />
        <h3>No Pokémon match that search</h3>
        <p>Even Psyduck is confused. Try another name, number or filter.</p>
        <button className="btn btn--ghost" onClick={onReset}>Clear filters</button>
      </motion.div>
    )
  }

  return (
    <>
      <div className="grid">
        <AnimatePresence mode="popLayout">
          {list.slice(0, limit).map((p, i) => (
            <motion.div
              key={p.id}
              layout="position"
              className="grid__cell"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: (i % 6) * 0.045, ease: EASE } }}
              viewport={{ once: true, margin: '0px 0px -40px 0px' }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
              transition={{ layout: { type: 'spring', stiffness: 320, damping: 34 } }}
            >
              <PokemonCard pokemon={p} hideSprite={p.id === selectedId} onOpen={onOpen} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {hasMore && <div ref={sentinelRef} className="grid-sentinel" aria-hidden="true" />}
    </>
  )
}
