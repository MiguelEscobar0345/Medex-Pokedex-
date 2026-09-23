// One base color per type; tints and text colors are derived in CSS
// (see .type-tint / .type-ink in base.css) so they adapt to dark mode.
export const TYPE_COLORS = {
  normal: '#9c9a86',
  fire: '#e8672c',
  water: '#3b82c4',
  grass: '#4e9a4a',
  electric: '#e0b010',
  ice: '#4fb8c9',
  fighting: '#c0412f',
  poison: '#9453b0',
  ground: '#c49a4a',
  flying: '#7e92d6',
  psychic: '#e0567e',
  bug: '#8fa324',
  rock: '#a89140',
  ghost: '#6456a0',
  dragon: '#5a4fd8',
  dark: '#5a4f4a',
  steel: '#7c8c9c',
  fairy: '#d77fb0',
}

export const TYPES = Object.keys(TYPE_COLORS)

export const typeColor = type => TYPE_COLORS[type] ?? TYPE_COLORS.normal

export const typeLabel = type => type.charAt(0).toUpperCase() + type.slice(1)

// Attacking type -> defending types it hits for 2x, 0.5x and 0x
const CHART = {
  normal: { double: [], half: ['rock', 'steel'], zero: ['ghost'] },
  fire: { double: ['grass', 'ice', 'bug', 'steel'], half: ['fire', 'water', 'rock', 'dragon'], zero: [] },
  water: { double: ['fire', 'ground', 'rock'], half: ['water', 'grass', 'dragon'], zero: [] },
  electric: { double: ['water', 'flying'], half: ['electric', 'grass', 'dragon'], zero: ['ground'] },
  grass: { double: ['water', 'ground', 'rock'], half: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'], zero: [] },
  ice: { double: ['grass', 'ground', 'flying', 'dragon'], half: ['fire', 'water', 'ice', 'steel'], zero: [] },
  fighting: { double: ['normal', 'ice', 'rock', 'dark', 'steel'], half: ['poison', 'flying', 'psychic', 'bug', 'fairy'], zero: ['ghost'] },
  poison: { double: ['grass', 'fairy'], half: ['poison', 'ground', 'rock', 'ghost'], zero: ['steel'] },
  ground: { double: ['fire', 'electric', 'poison', 'rock', 'steel'], half: ['grass', 'bug'], zero: ['flying'] },
  flying: { double: ['grass', 'fighting', 'bug'], half: ['electric', 'rock', 'steel'], zero: [] },
  psychic: { double: ['fighting', 'poison'], half: ['psychic', 'steel'], zero: ['dark'] },
  bug: { double: ['grass', 'psychic', 'dark'], half: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'], zero: [] },
  rock: { double: ['fire', 'ice', 'flying', 'bug'], half: ['fighting', 'ground', 'steel'], zero: [] },
  ghost: { double: ['psychic', 'ghost'], half: ['dark'], zero: ['normal'] },
  dragon: { double: ['dragon'], half: ['steel'], zero: ['fairy'] },
  dark: { double: ['psychic', 'ghost'], half: ['fighting', 'dark', 'fairy'], zero: [] },
  steel: { double: ['ice', 'rock', 'fairy'], half: ['fire', 'water', 'electric', 'steel'], zero: [] },
  fairy: { double: ['fighting', 'dragon', 'dark'], half: ['fire', 'poison', 'steel'], zero: [] },
}

export function effectiveness(attacking, defending) {
  const row = CHART[attacking]
  if (row.zero.includes(defending)) return 0
  if (row.double.includes(defending)) return 2
  if (row.half.includes(defending)) return 0.5
  return 1
}

// Damage multiplier every attacking type deals to a Pokémon with these types
export function defensiveProfile(types) {
  return Object.fromEntries(
    TYPES.map(attacking => [attacking, types.reduce((m, t) => m * effectiveness(attacking, t), 1)])
  )
}
