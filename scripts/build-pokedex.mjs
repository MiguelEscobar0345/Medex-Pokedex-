// Generates src/data/pokedex.json: a compact index of every species
// (name, generation, types, base stats) so the grid, filters, team builder
// and game work instantly without one request per card.
//
// Run with: npm run data
import { writeFile } from 'node:fs/promises'

const ENDPOINT = 'https://beta.pokeapi.co/graphql/v1beta'
const STAT_ORDER = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed']
const ENGLISH = 9

const query = `{
  species: pokemon_v2_pokemonspecies(order_by: { id: asc }) {
    id
    name
    generation_id
    names: pokemon_v2_pokemonspeciesnames(where: { language_id: { _eq: ${ENGLISH} } }) { name }
    pokemon: pokemon_v2_pokemons(where: { is_default: { _eq: true } }) {
      types: pokemon_v2_pokemontypes(order_by: { slot: asc }) { type: pokemon_v2_type { name } }
      stats: pokemon_v2_pokemonstats { base_stat stat: pokemon_v2_stat { name } }
    }
  }
}`

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
})
if (!res.ok) throw new Error(`PokéAPI responded ${res.status}`)
const { data, errors } = await res.json()
if (errors) throw new Error(JSON.stringify(errors))

// Row format: [id, slug, name, generation, types[], stats[6]]
const rows = data.species.map(s => {
  const p = s.pokemon[0]
  const stats = STAT_ORDER.map(key => p.stats.find(st => st.stat.name === key)?.base_stat ?? 0)
  return [s.id, s.name, s.names[0]?.name ?? s.name, s.generation_id, p.types.map(t => t.type.name), stats]
})

await writeFile(new URL('../src/data/pokedex.json', import.meta.url), JSON.stringify(rows))
console.log(`Wrote ${rows.length} species`)
