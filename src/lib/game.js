import { POKEDEX, artworkUrl } from '../data/pokedex'

const shuffle = arr => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const RECENT_LIMIT = 30

// A round: the answer plus three distractors from the same pool.
// `recent` holds ids to avoid repeating the same Pokémon too soon.
export function createRound(gens, recent = []) {
  const pool = gens.length ? POKEDEX.filter(p => gens.includes(p.gen)) : POKEDEX
  const fresh = pool.filter(p => !recent.includes(p.id))
  const source = fresh.length ? fresh : pool
  const answer = source[Math.floor(Math.random() * source.length)]
  const distractors = shuffle(pool.filter(p => p.id !== answer.id)).slice(0, 3)
  // Warm the cache so the silhouette appears without a loading gap
  new Image().src = artworkUrl(answer.id)
  return { answer, options: shuffle([answer, ...distractors]) }
}

export const remember = (recent, id) => [id, ...recent].slice(0, RECENT_LIMIT)

const normalize = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = tmp
    }
  }
  return row[b.length]
}

// Exact match, or one typo for longer names
export function isCorrectGuess(guess, pokemon) {
  const g = normalize(guess)
  if (!g) return false
  return [pokemon.name, pokemon.slug].some(n => {
    const target = normalize(n)
    return g === target || (target.length > 5 && distance(g, target) <= 1)
  })
}
