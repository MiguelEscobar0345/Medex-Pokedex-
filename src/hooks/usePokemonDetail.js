import { useState, useEffect } from 'react'

const API = 'https://pokeapi.co/api/v2'
const detailCache = {}
const speciesCache = {}

export function usePokemonDetail(url) {
  const [detail, setDetail]   = useState(null)
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    if (!url) {
      setDetail(null)
      setSpecies(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    async function load() {
      try {
        // Fetch main detail
        if (!detailCache[url]) {
          const res = await fetch(url)
          if (!res.ok) throw new Error('Failed to fetch Pokémon detail')
          detailCache[url] = await res.json()
        }
        const d = detailCache[url]

        if (!cancelled) setDetail(d)

        // Fetch species for flavor text
        const specUrl = d.species.url
        if (!speciesCache[specUrl]) {
          const sres = await fetch(specUrl)
          if (sres.ok) speciesCache[specUrl] = await sres.json()
        }

        if (!cancelled) {
          setSpecies(speciesCache[specUrl] || null)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [url])

  // Extract English flavor text
  const flavorText = species?.flavor_text_entries
    ?.find(e => e.language.name === 'en')
    ?.flavor_text
    ?.replace(/\f|\n/g, ' ') || ''

  // Extract English genus (e.g. "Flame Pokémon")
  const genus = species?.genera
    ?.find(g => g.language.name === 'en')
    ?.genus || ''

  return { detail, flavorText, genus, loading, error }
}

// Separate lightweight hook for cards — fetches detail on demand
const cardCache = {}

export async function fetchPokemonDetail(url) {
  if (cardCache[url]) return cardCache[url]
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  cardCache[url] = await res.json()
  return cardCache[url]
}