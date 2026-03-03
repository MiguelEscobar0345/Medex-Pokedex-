import { useState, useEffect, useCallback } from 'react'

const API = 'https://pokeapi.co/api/v2'
const PAGE_SIZE = 40

// Cache so we don't re-fetch on filter changes
const listCache = {}
const typeCache = {}

export function usePokemonList(activeType, searchQuery) {
  const [allPokemon, setAllPokemon]   = useState([])   // full list for current filter
  const [visible, setVisible]         = useState([])   // sliced list rendered so far
  const [offset, setOffset]           = useState(0)
  const [hasMore, setHasMore]         = useState(false)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  // Load master list or type-filtered list
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    setAllPokemon([])
    setVisible([])
    setOffset(0)

    async function load() {
      try {
        let list = []

        if (activeType === 'all') {
          if (!listCache['all']) {
            const res = await fetch(`${API}/pokemon?limit=898&offset=0`)
            if (!res.ok) throw new Error('Failed to fetch Pokémon list')
            const data = await res.json()
            listCache['all'] = data.results
          }
          list = listCache['all']
        } else {
          if (!typeCache[activeType]) {
            const res = await fetch(`${API}/type/${activeType}`)
            if (!res.ok) throw new Error(`Failed to fetch type: ${activeType}`)
            const data = await res.json()
            typeCache[activeType] = data.pokemon.map(p => p.pokemon)
          }
          list = typeCache[activeType]
        }

        if (!cancelled) {
          setAllPokemon(list)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [activeType])

  // Apply search + paginate
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    const filtered = q
      ? allPokemon.filter(p => p.name.includes(q))
      : allPokemon

    const first = filtered.slice(0, PAGE_SIZE)
    setVisible(first)
    setOffset(PAGE_SIZE)
    setHasMore(filtered.length > PAGE_SIZE)
  }, [allPokemon, searchQuery])

  const loadMore = useCallback(() => {
    const q = searchQuery.trim().toLowerCase()
    const filtered = q
      ? allPokemon.filter(p => p.name.includes(q))
      : allPokemon

    const next = filtered.slice(offset, offset + PAGE_SIZE)
    setVisible(prev => [...prev, ...next])
    setOffset(prev => prev + PAGE_SIZE)
    setHasMore(offset + PAGE_SIZE < filtered.length)
  }, [allPokemon, offset, searchQuery])

  return { visible, hasMore, loading, error, loadMore }
}