import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cryUrl } from '../../data/pokedex'

export function CryButton({ id, name }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => () => audioRef.current?.pause(), [])

  const play = () => {
    audioRef.current?.pause()
    const audio = new Audio(cryUrl(id))
    audio.volume = 0.45
    audio.onended = () => setPlaying(false)
    audio.onerror = () => setPlaying(false)
    audioRef.current = audio
    setPlaying(true)
    audio.play().catch(() => setPlaying(false))
  }

  return (
    <button className={`stage-btn ${playing ? 'is-playing' : ''}`} onClick={play} aria-label={`Play ${name}'s cry`} title="Play cry">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path className="wave wave--1" d="M15.5 9.5a3.5 3.5 0 0 1 0 5" />
        <path className="wave wave--2" d="M18.5 7a7 7 0 0 1 0 10" />
      </svg>
    </button>
  )
}

const SPARKS = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

export function ShinyButton({ shiny, onToggle }) {
  const [bursts, setBursts] = useState(0)

  return (
    <button
      className={`stage-btn ${shiny ? 'is-on' : ''}`}
      onClick={() => {
        if (!shiny) setBursts(b => b + 1)
        onToggle()
      }}
      aria-pressed={shiny}
      aria-label="Show shiny coloring"
      title="Shiny"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3c.4 4.2 1.8 5.6 6 6-4.2.4-5.6 1.8-6 6-.4-4.2-1.8-5.6-6-6 4.2-.4 5.6-1.8 6-6Z" />
        <path d="M19 15c.2 1.6.8 2.2 2.4 2.4-1.6.2-2.2.8-2.4 2.4-.2-1.6-.8-2.2-2.4-2.4 1.6-.2 2.2-.8 2.4-2.4Z" />
      </svg>
      <AnimatePresence>
        {bursts > 0 && (
          <span key={bursts} className="sparks" aria-hidden="true">
            {SPARKS.map(angle => (
              <motion.span
                key={angle}
                className="spark"
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: Math.cos(angle) * 28, y: Math.sin(angle) * 28, scale: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
          </span>
        )}
      </AnimatePresence>
    </button>
  )
}
