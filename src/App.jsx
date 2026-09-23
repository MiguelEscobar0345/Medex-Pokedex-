import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { filterPokedex, getBySlug } from './data/pokedex'
import { goBack, matchRoute, navigate, usePath } from './lib/router'
import AmbientBackground from './components/AmbientBackground'
import Header from './components/Header'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Filters from './components/Filters'
import PokemonGrid from './components/PokemonGrid'
import PokemonDetail from './components/detail/PokemonDetail'
import TeamPage from './components/team/TeamPage'
import ComparePage from './components/compare/ComparePage'
import TeamDock from './components/TeamDock'
import Toast from './components/Toast'
import Footer from './components/Footer'

const DEFAULT_FILTERS = { search: '', type: 'all', gen: 0, sort: 'id' }

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export default function App() {
  const route = matchRoute(usePath())
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  // The card a detail view was opened from, so its sprite can fly between them
  const [origin, setOrigin] = useState(null)
  const dexRef = useRef(null)

  const list = useMemo(() => filterPokedex(filters), [filters])
  const selected = route.name === 'pokemon' ? getBySlug(route.params.slug) : null
  // The detail view opens on top of the Pokédex, so it belongs to that section
  const section = route.name === 'pokemon' ? 'home' : route.name

  useEffect(() => {
    if (route.name === 'pokemon' && !selected) navigate('/', { replace: true })
  }, [route.name, selected])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [section])

  const updateFilters = next => {
    setFilters(next)
    // Keep the start of the results in view: jump up if we're deep in the
    // grid, or scroll down if the results are still below the fold.
    const top = dexRef.current?.getBoundingClientRect().top
    if (top !== undefined && (top < 0 || top > window.innerHeight * 0.6)) {
      dexRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const resetKey = `${filters.type}|${filters.gen}|${filters.sort}|${filters.search}`

  return (
    <>
      <AmbientBackground type={section === 'home' ? filters.type : 'all'} />

      <div className="app" inert={selected ? true : undefined}>
        <Header
          search={filters.search}
          onSearch={section === 'home' ? search => updateFilters({ ...filters, search }) : undefined}
        >
          <Nav section={section} />
        </Header>

        <AnimatePresence mode="wait" initial={false}>
          <motion.main key={section} className="main" {...PAGE_TRANSITION}>
            {section === 'home' && (
              <>
                <Hero />
                <div id="dex" ref={dexRef} className="dex-anchor" />
                <Filters filters={filters} onChange={updateFilters} count={list.length} />
                <div className="page results">
                  <PokemonGrid
                    list={list}
                    resetKey={resetKey}
                    selectedId={selected?.id}
                    onOpen={setOrigin}
                    onReset={() => updateFilters(DEFAULT_FILTERS)}
                  />
                </div>
              </>
            )}
            {section === 'team' && <TeamPage />}
            {section === 'compare' && <ComparePage a={route.params.a} b={route.params.b} />}
          </motion.main>
        </AnimatePresence>

        <Footer />
      </div>

      <Nav section={section} variant="bottom" />
      <TeamDock visible={section === 'home' && !selected} />
      <Toast />

      <AnimatePresence>
        {selected && (
          <PokemonDetail
            key="detail"
            pokemon={selected}
            list={list}
            shared={origin === selected.id}
            onNavigate={p => {
              setOrigin(null)
              navigate(`/pokemon/${p.slug}`, { replace: true })
            }}
            onClose={() => goBack('/')}
          />
        )}
      </AnimatePresence>
    </>
  )
}
