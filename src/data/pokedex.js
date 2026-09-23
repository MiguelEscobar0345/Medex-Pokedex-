import rows from './pokedex.json'

export const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
export const STAT_LABELS = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe']

export const POKEDEX = rows.map(([id, slug, name, gen, types, stats]) => ({
  id,
  slug,
  name,
  gen,
  types,
  stats,
  total: stats.reduce((sum, s) => sum + s, 0),
}))

export const TOTAL_SPECIES = POKEDEX.length

const bySlug = new Map(POKEDEX.map(p => [p.slug, p]))
const byId = new Map(POKEDEX.map(p => [p.id, p]))

export const getBySlug = slug => bySlug.get(slug)
export const getById = id => byId.get(id)

export const GENERATIONS = [
  { id: 1, numeral: 'I', region: 'Kanto' },
  { id: 2, numeral: 'II', region: 'Johto' },
  { id: 3, numeral: 'III', region: 'Hoenn' },
  { id: 4, numeral: 'IV', region: 'Sinnoh' },
  { id: 5, numeral: 'V', region: 'Unova' },
  { id: 6, numeral: 'VI', region: 'Kalos' },
  { id: 7, numeral: 'VII', region: 'Alola' },
  { id: 8, numeral: 'VIII', region: 'Galar' },
  { id: 9, numeral: 'IX', region: 'Paldea' },
]

const SPRITES = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

export const artworkUrl = (id, shiny = false) => `${SPRITES}/${shiny ? 'shiny/' : ''}${id}.png`
export const cryUrl = id => `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`
export const dexNumber = id => `#${String(id).padStart(4, '0')}`

export const SORTS = [
  { id: 'id', label: 'Number', compare: (a, b) => a.id - b.id },
  { id: 'name', label: 'Name', compare: (a, b) => a.name.localeCompare(b.name) },
  { id: 'total', label: 'Base stats', compare: (a, b) => b.total - a.total || a.id - b.id },
  { id: 'speed', label: 'Speed', compare: (a, b) => b.stats[5] - a.stats[5] || a.id - b.id },
]

export function filterPokedex({ search, type, gen, sort }) {
  const q = search.trim().toLowerCase()
  const byNumber = /^#?\d+$/.test(q) ? Number(q.replace('#', '')) : null
  const list = POKEDEX.filter(p =>
    (type === 'all' || p.types.includes(type)) &&
    (gen === 0 || p.gen === gen) &&
    (!q || (byNumber !== null ? String(p.id).startsWith(String(byNumber)) : p.name.toLowerCase().includes(q) || p.slug.includes(q)))
  )
  const sorter = SORTS.find(s => s.id === sort) ?? SORTS[0]
  return list.sort(sorter.compare)
}

export const randomPokemon = (exclude) => {
  let p
  do p = POKEDEX[Math.floor(Math.random() * POKEDEX.length)]
  while (exclude && p.id === exclude)
  return p
}
