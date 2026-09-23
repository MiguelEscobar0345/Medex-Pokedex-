import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useAnimate } from 'motion/react'
import { GENERATIONS, dexNumber } from '../../data/pokedex'
import { typeColor } from '../../data/types'
import { createRound, isCorrectGuess, remember } from '../../lib/game'
import Link from '../Link'
import PageHead from '../PageHead'
import Sprite from '../Sprite'
import TypeBadge from '../TypeBadge'
import './GamePage.css'

const BEST_KEY = 'medex-game-best'
const SPARKS = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2)

const readBest = () => {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0 } catch { return 0 }
}

export default function GamePage() {
  const [gens, setGens] = useState([])
  const [mode, setMode] = useState('choice')
  const [round, setRound] = useState(() => createRound([]))
  const [recent, setRecent] = useState([])
  const [status, setStatus] = useState('guessing') // guessing | correct | wrong
  const [picked, setPicked] = useState(null)
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 })
  const [best, setBest] = useState(readBest)
  const [stageRef, animateStage] = useAnimate()

  const revealed = status !== 'guessing'
  const { answer, options } = round

  const next = (nextGens = gens) => {
    setRecent(r => remember(r, answer.id))
    setRound(createRound(nextGens, remember(recent, answer.id)))
    setStatus('guessing')
    setPicked(null)
    setGuess('')
  }

  const resolve = correct => {
    setStatus(correct ? 'correct' : 'wrong')
    const streak = correct ? score.streak + 1 : 0
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1, streak }))
    if (streak > best) {
      setBest(streak)
      try { localStorage.setItem(BEST_KEY, String(streak)) } catch { /* ignore */ }
    }
    if (!correct) animateStage(stageRef.current, { x: [0, -14, 12, -8, 6, 0] }, { duration: 0.45 })
  }

  const choose = option => {
    if (revealed) return
    setPicked(option.id)
    resolve(option.id === answer.id)
  }

  const submitGuess = e => {
    e.preventDefault()
    if (revealed || !guess.trim()) return
    resolve(isCorrectGuess(guess, answer))
  }

  useEffect(() => {
    const onKey = e => {
      if (mode !== 'choice' || revealed || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)) return
      const n = Number(e.key)
      if (n >= 1 && n <= options.length) choose(options[n - 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const toggleGen = id => {
    const nextGens = gens.includes(id) ? gens.filter(g => g !== id) : [...gens, id].sort((a, b) => a - b)
    setGens(nextGens)
    next(nextGens)
  }

  const accuracy = score.total ? Math.round((score.correct / score.total) * 100) : 0

  return (
    <section className="page game">
      <PageHead eyebrow="Mini game" title="Who’s that Pokémon?" lede="Guess the Pokémon from its silhouette. Build a streak — your best one is saved on this device.">
        <div className="game__scores">
          <div className="score">
            <span className="score__label">Streak</span>
            <motion.span key={score.streak} className="score__value" initial={{ scale: 1.5, color: 'var(--accent)' }} animate={{ scale: 1, color: 'var(--ink)' }}>
              {score.streak}
            </motion.span>
          </div>
          <div className="score">
            <span className="score__label">Best</span>
            <span className="score__value">{best}</span>
          </div>
          <div className="score">
            <span className="score__label">Accuracy</span>
            <span className="score__value">{accuracy}%</span>
          </div>
        </div>
      </PageHead>

      <div className="game__settings">
        <div className="game__gens" aria-label="Generations">
          <button className={`chip ${gens.length === 0 ? 'is-active' : ''}`} aria-pressed={gens.length === 0} onClick={() => { setGens([]); next([]) }}>
            {gens.length === 0 && <motion.span layoutId="game-gen-all" className="chip__bg" />}
            <span className="chip__label">All gens</span>
          </button>
          {GENERATIONS.map(g => {
            const on = gens.includes(g.id)
            return (
              <button key={g.id} className={`chip ${on ? 'is-active' : ''}`} aria-pressed={on} onClick={() => toggleGen(g.id)} title={g.region}>
                {on && <motion.span className="chip__bg" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />}
                <span className="chip__label">{g.numeral}</span>
              </button>
            )
          })}
        </div>
        <div className="segmented" role="radiogroup" aria-label="Mode">
          {[['choice', 'Choices'], ['type', 'Type it']].map(([id, label]) => (
            <button key={id} role="radio" aria-checked={mode === id} className={`segmented__option ${mode === id ? 'is-active' : ''}`} onClick={() => setMode(id)}>
              {mode === id && <motion.span layoutId="game-mode" className="segmented__bg" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`game__board ${revealed ? 'is-revealed' : ''}`} style={{ '--t': typeColor(answer.types[0]) }}>
        <div ref={stageRef} className="game__stage">
          <span className="game__rays" aria-hidden="true" />
          <motion.span className="game__disc" animate={{ scale: status === 'correct' ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.5 }} />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={answer.id}
              className="game__sprite"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <Sprite id={answer.id} name={revealed ? answer.name : 'Mystery Pokémon'} eager />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {status === 'correct' && (
              <span className="sparks" aria-hidden="true">
                {SPARKS.map(angle => (
                  <motion.span
                    key={angle}
                    className="spark spark--big"
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{ x: Math.cos(angle) * 180, y: Math.sin(angle) * 180, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                ))}
              </span>
            )}
          </AnimatePresence>
        </div>

        <div className="game__panel">
          <AnimatePresence mode="wait" initial={false}>
            {revealed ? (
              <motion.div key="result" className="game__result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <p className={`game__verdict ${status}`}>{status === 'correct' ? 'Correct!' : 'Not quite —'}</p>
                <h2 className="game__answer">
                  <span className="reveal-line">
                    <motion.span className="reveal-line__inner" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}>
                      It’s {answer.name}
                    </motion.span>
                  </span>
                </h2>
                <div className="game__answer-meta">
                  <span className="eyebrow">{dexNumber(answer.id)}</span>
                  {answer.types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
                <div className="game__actions">
                  {/* autoFocus: keyboard players can keep going with Enter */}
                  <button autoFocus className="btn btn--solid" onClick={() => next()}>
                    Next Pokémon
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </button>
                  <Link to={`/pokemon/${answer.slug}`} className="btn btn--ghost">See entry</Link>
                </div>
              </motion.div>
            ) : mode === 'choice' ? (
              <motion.div key={`choices-${answer.id}`} className="game__options" initial="hidden" animate="visible" exit={{ opacity: 0 }} variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
                {options.map((o, i) => (
                  <motion.button
                    key={o.id}
                    className="game__option"
                    onClick={() => choose(o)}
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <kbd>{i + 1}</kbd>
                    {o.name}
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.form key={`type-${answer.id}`} className="game__type" onSubmit={submitGuess} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <input autoFocus className="game__input" value={guess} onChange={e => setGuess(e.target.value)} placeholder="Type its name…" autoComplete="off" spellCheck="false" aria-label="Your guess" />
                <div className="game__actions">
                  <button type="submit" className="btn btn--solid" disabled={!guess.trim()}>Guess</button>
                  <button type="button" className="btn btn--ghost" onClick={() => resolve(false)}>Give up</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {revealed && mode === 'choice' && picked !== answer.id && picked !== null && (
            <p className="game__note">You picked {options.find(o => o.id === picked)?.name}.</p>
          )}
        </div>
      </div>
    </section>
  )
}
