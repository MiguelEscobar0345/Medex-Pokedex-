import { getById } from '../data/pokedex'

const idFromUrl = url => Number(url.match(/\/(\d+)\/?$/)[1])
const words = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

// A short human label for how a Pokémon evolves, e.g. "Lv. 16", "Thunder Stone"
export function describeEvolution(details) {
  if (!details.length) return ''
  const d = details.find(x => x.is_default) ?? details[details.length - 1]
  const when = d.time_of_day ? ` (${d.time_of_day})` : ''

  switch (d.trigger?.name) {
    case 'level-up':
      if (d.min_level) return `Lv. ${d.min_level}${when}`
      if (d.min_happiness) return `Friendship${when}`
      if (d.min_affection) return `Affection${when}`
      if (d.known_move) return `Knows ${words(d.known_move.name)}`
      if (d.known_move_type) return `Knows a ${words(d.known_move_type.name)} move`
      if (d.held_item) return `Level up holding ${words(d.held_item.name)}${when}`
      if (d.location) return `Level up at ${words(d.location.name)}`
      return `Level up${when}`
    case 'use-item':
      return words(d.item?.name ?? 'item')
    case 'trade':
      if (d.held_item) return `Trade holding ${words(d.held_item.name)}`
      if (d.trade_species) return `Trade for ${words(d.trade_species.name)}`
      return 'Trade'
    default:
      return words(d.trigger?.name ?? '')
  }
}

// Flattens the chain tree into stages: [[base], [stage 1 …], [stage 2 …]]
export function chainToStages(chain) {
  const stages = []
  const walk = (node, depth) => {
    const pokemon = getById(idFromUrl(node.species.url))
    if (pokemon) {
      stages[depth] ??= []
      stages[depth].push({ pokemon, how: describeEvolution(node.evolution_details) })
    }
    node.evolves_to.forEach(next => walk(next, depth + 1))
  }
  walk(chain.chain, 0)
  return stages
}
