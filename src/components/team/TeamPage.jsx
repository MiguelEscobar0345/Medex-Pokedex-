import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { dexNumber, getById } from '../../data/pokedex'
import { typeColor, typeLabel } from '../../data/types'
import { TEAM_SIZE, teamStore, toggleTeamMember, useStore } from '../../lib/store'
import { averageStats, defensiveCoverage, offensiveCoverage } from '../../lib/team'
import Link from '../Link'
import PokemonPicker from '../PokemonPicker'
import Sprite from '../Sprite'
import TypeBadge from '../TypeBadge'
import StatRadar from '../detail/StatRadar'
import PageHead from '../PageHead'
import './TeamPage.css'

const SLOT_SPRING = { type: 'spring', stiffness: 380, damping: 30 }

function Analysis({ team }) {
  const defense = defensiveCoverage(team)
  const offense = offensiveCoverage(team)
  const threats = defense.filter(d => d.danger).sort((a, b) => b.weak - b.resist - (a.weak - a.resist))
  const uncovered = offense.filter(o => o.by.length === 0)
  const avg = averageStats(team)

  return (
    <motion.div className="team-analysis" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <section className="analysis-card analysis-card--wide">
        <header>
          <h2>Defensive coverage</h2>
          <p>How many of your Pokémon are weak to, or resist, each attacking type.</p>
        </header>
        <div className="coverage">
          {defense.map(({ type, weak, resist, danger }) => (
            <div key={type} className={`coverage__cell ${danger ? 'is-danger' : ''}`} style={{ '--t': typeColor(type) }}>
              <span className="coverage__type type-ink">{typeLabel(type)}</span>
              <span className="coverage__pips" aria-label={`${weak} weak, ${resist} resist`}>
                {Array.from({ length: weak }, (_, i) => (
                  <motion.i key={`w${i}`} layout className="pip pip--weak" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }} />
                ))}
                {Array.from({ length: resist }, (_, i) => (
                  <motion.i key={`r${i}`} layout className="pip pip--resist" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }} />
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className="coverage__legend">
          <span><i className="pip pip--weak" /> weak</span>
          <span><i className="pip pip--resist" /> resists</span>
        </p>
      </section>

      <section className="analysis-card">
        <header>
          <h2>Watch out for</h2>
          <p>Types that hit more of your team hard than your team can take.</p>
        </header>
        {threats.length ? (
          <ul className="analysis-list">
            {threats.map(t => (
              <li key={t.type}>
                <TypeBadge type={t.type} size="md" />
                <span>{t.weak} weak · {t.resist} resist</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="analysis-good">No glaring weaknesses. Nicely balanced.</p>
        )}
      </section>

      <section className="analysis-card">
        <header>
          <h2>Offensive gaps</h2>
          <p>Types none of your Pokémon hit super-effectively with their own type.</p>
        </header>
        {uncovered.length ? (
          <div className="analysis-types">
            {uncovered.map(o => <TypeBadge key={o.type} type={o.type} size="md" />)}
          </div>
        ) : (
          <p className="analysis-good">Every type is covered.</p>
        )}
      </section>

      <section className="analysis-card">
        <header>
          <h2>Average stats</h2>
          <p>Base stat total averages {avg.reduce((a, b) => a + b, 0)}.</p>
        </header>
        <StatRadar series={[{ stats: avg, color: 'var(--accent)' }]} />
      </section>
    </motion.div>
  )
}

export default function TeamPage() {
  const team = useStore(teamStore).map(getById)
  const [picking, setPicking] = useState(false)

  return (
    <section className="page team">
      <PageHead
        eyebrow="Team builder"
        title="Your team"
        lede="Pick up to six Pokémon to see which types your team handles well and where it’s exposed."
      >
        {team.length > 0 && (
          <button className="btn btn--ghost" onClick={() => teamStore.set([])}>Clear team</button>
        )}
      </PageHead>

      <div className="team__slots">
        <AnimatePresence mode="popLayout" initial={false}>
          {team.map(p => (
            <motion.div
              key={p.id}
              layout
              className="team-slot"
              style={{ '--t': typeColor(p.types[0]) }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={SLOT_SPRING}
            >
              <Link to={`/pokemon/${p.slug}`} className="team-slot__link">
                <span className="team-slot__disc type-tint">
                  <Sprite id={p.id} name={p.name} />
                </span>
                <span className="team-slot__id">{dexNumber(p.id)}</span>
                <span className="team-slot__name">{p.name}</span>
                <span className="team-slot__types">
                  {p.types.map(t => <TypeBadge key={t} type={t} />)}
                </span>
              </Link>
              <button className="team-slot__remove" onClick={() => toggleTeamMember(p)} aria-label={`Remove ${p.name}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </motion.div>
          ))}
          {Array.from({ length: TEAM_SIZE - team.length }, (_, i) => (
            <motion.button
              key={`empty-${team.length + i}`}
              layout
              className="team-slot team-slot--empty"
              onClick={() => setPicking(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={SLOT_SPRING}
            >
              <span className="team-slot__plus" aria-hidden="true">+</span>
              <span>Add Pokémon</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {team.length > 0 ? (
        <Analysis team={team} />
      ) : (
        <p className="team__hint">
          Tip: open any Pokémon and press <strong>Add to team</strong>, or use the empty slots above.
        </p>
      )}

      <AnimatePresence>
        {picking && (
          <PokemonPicker
            title="Add to your team"
            exclude={team.map(p => p.id)}
            onPick={p => {
              toggleTeamMember(p)
              setPicking(false)
            }}
            onClose={() => setPicking(false)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
