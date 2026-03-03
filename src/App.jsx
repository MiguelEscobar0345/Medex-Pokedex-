import React, { useState, useCallback } from 'react'
import Header from './components/Header'
import PokemonCard from './components/PokemonCard'
import PokemonModal from './components/PokemonModal'
import Loader from './components/Loader'
import { usePokemonList } from './hooks/usePokemonList'
import Footer from './components/Footer'

export default function App() {
  const [search, setSearch]         = useState('')
  const [activeType, setActiveType] = useState('all')
  const [selectedUrl, setSelectedUrl] = useState(null)

  const { visible, hasMore, loading, error, loadMore } = usePokemonList(activeType, search)

  const handleCardClick = useCallback(url => setSelectedUrl(url), [])
  const handleClose     = useCallback(() => setSelectedUrl(null), [])
  const handleSearch    = useCallback(val => setSearch(val), [])
  const handleType      = useCallback(t => { setActiveType(t); setSearch('') }, [])

  return (
    <>
      <Header
        search={search}
        onSearch={handleSearch}
        activeType={activeType}
        onTypeChange={handleType}
      />

        <main
          style={{
            width: '100%',
            padding: '44px 40px 80px',
            flex: 1,
          }}
        >
        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2rem, 5vw, 3.4rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
              color: '#1d1d1f',
              marginBottom: 10,
            }}
          >
            All Pokémon,<br />Evolved design.
          </h1>
          <p style={{ fontSize: '1rem', color: '#6e6e73', fontWeight: 300 }}>
            Explore the complete Pokédex.{' '}
            <strong style={{ fontWeight: 500, color: '#1d1d1f' }}>898 species</strong>{' '}
            at your fingertips.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div
            style={{
              textAlign: 'center', padding: '60px 20px',
              color: '#6e6e73',
            }}
          >
            <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>Something went wrong</p>
            <p style={{ fontSize: '0.875rem', color: '#aeaeb2' }}>{error}</p>
          </div>
        )}

        {/* Initial loading */}
        {loading && visible.length === 0 && <Loader fullPage />}

        {/* Empty state */}
        {!loading && visible.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontSize: '1.1rem', color: '#6e6e73', marginBottom: 8 }}>No Pokémon found</p>
            <p style={{ fontSize: '0.875rem', color: '#aeaeb2' }}>Try a different name or type filter</p>
          </div>
        )}

        {/* Grid */}
        {visible.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 16,
            }}
          >
            {visible.map((pokemon, i) => (
              <PokemonCard
                key={pokemon.name}
                pokemon={pokemon}
                index={i}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}

        {/* Loading more */}
        {loading && visible.length > 0 && <Loader />}

        {/* Load more button */}
        {hasMore && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
            <button
              onClick={loadMore}
              style={{
                height: 48, padding: '0 36px',
                background: '#1d1d1f', color: '#ffffff',
                border: 'none', borderRadius: 14,
                fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 500,
                letterSpacing: '-0.01em',
                transition: 'background 0.18s, transform 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#3a3a3c'
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#1d1d1f'
                e.currentTarget.style.transform = 'none'
              }}
            >
              Load more Pokémon
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modal */}
      <PokemonModal url={selectedUrl} onClose={handleClose} />
    </>
  )
}