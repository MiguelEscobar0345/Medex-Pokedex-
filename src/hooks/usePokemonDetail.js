import { useEffect, useState } from 'react'
import { fetchPokemonDetail } from '../lib/api'

export function usePokemonDetail(id) {
  const [result, setResult] = useState({ id: null, detail: null, error: null })

  useEffect(() => {
    if (!id) return
    let cancelled = false
    fetchPokemonDetail(id)
      .then(detail => { if (!cancelled) setResult({ id, detail, error: null }) })
      .catch(error => { if (!cancelled) setResult({ id, detail: null, error }) })
    return () => { cancelled = true }
  }, [id])

  // Ignore a result that belongs to the previously shown Pokémon
  const current = result.id === id ? result : { detail: null, error: null }
  return { detail: current.detail, error: current.error, loading: !current.detail && !current.error }
}
