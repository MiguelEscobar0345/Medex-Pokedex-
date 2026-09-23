import { useEffect, useState } from 'react'
import { fetchEvolutionChain } from '../lib/api'
import { chainToStages } from '../lib/evolution'

export function useEvolutionChain(url) {
  const [result, setResult] = useState({ url: null, stages: null })

  useEffect(() => {
    if (!url) return
    let cancelled = false
    fetchEvolutionChain(url)
      .then(chain => { if (!cancelled) setResult({ url, stages: chainToStages(chain) }) })
      .catch(() => { if (!cancelled) setResult({ url, stages: [] }) })
    return () => { cancelled = true }
  }, [url])

  return result.url === url ? result.stages : null
}
