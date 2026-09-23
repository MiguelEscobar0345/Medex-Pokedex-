import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { filterPokedex, getBySlug } from './data/pokedex'
import { goBack, matchRoute, navigate, usePath } from './lib/router'
import AmbientBackground from './components/AmbientBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import Filters from './components/Filters'
import PokemonGrid from './components/PokemonGrid'
import PokemonDetail from './components/detail/PokemonDetail'
import Footer from './components/Footer'

const DEFAULT_FILTERS = { search: '', type: 'all', gen: 0, sort: 'id' }

export default function App() {
  const route = matchRoute(usePath())
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const dexRef = useRef(null)

  const list = useMemo(() => filterPokedex(filters), [filters])
  const selected = route.name === 'pokemon' ? getBySlug(route.params.slug) : null

  useEffect(() => {
    if (route.name === 'pokemon' && !selected) navigate('/', { replace: true })
  }, [route.name, selected])

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
      <AmbientBackground type={filters.type} />

      <div className="app" inert={selected ? true : undefined}>
        <Header search={filters.search} onSearch={search => updateFilters({ ...filters, search })} />
        <main className="main">
          <Hero />
          <div id="dex" ref={dexRef} className="dex-anchor" />
          <Filters filters={filters} onChange={updateFilters} count={list.length} />
          <div className="page results">
            <PokemonGrid
              list={list}
              resetKey={resetKey}
              selectedId={selected?.id}
              onReset={() => updateFilters(DEFAULT_FILTERS)}
            />
          </div>
        </main>
        <Footer />
      </div>

      <AnimatePresence>
        {selected && <PokemonDetail key="detail" pokemon={selected} onClose={() => goBack('/')} />}
      </AnimatePresence>
    </>
  )
}
