// Each type has: bg (light bg), color (text/accent), gradient (card gradient)
export const TYPE_COLORS = {
  fire:     { bg: '#fff1ec', color: '#e8470a', gradient: 'linear-gradient(135deg, #ffe8de 0%, #ffd0bc 100%)' },
  water:    { bg: '#e8f2ff', color: '#0062cc', gradient: 'linear-gradient(135deg, #dceeff 0%, #c0dcff 100%)' },
  grass:    { bg: '#eafbee', color: '#1a8c35', gradient: 'linear-gradient(135deg, #ddf5e3 0%, #c0edcc 100%)' },
  electric: { bg: '#fff9e0', color: '#c98000', gradient: 'linear-gradient(135deg, #fff4c4 0%, #ffe99a 100%)' },
  psychic:  { bg: '#ffeef8', color: '#c0186a', gradient: 'linear-gradient(135deg, #ffe4f4 0%, #ffc8e8 100%)' },
  ice:      { bg: '#e8faff', color: '#007b9e', gradient: 'linear-gradient(135deg, #d8f4ff 0%, #b8ecff 100%)' },
  dragon:   { bg: '#eeecff', color: '#4040c8', gradient: 'linear-gradient(135deg, #e4e0ff 0%, #ccc8ff 100%)' },
  dark:     { bg: '#f0f0f2', color: '#2c2c2e', gradient: 'linear-gradient(135deg, #e8e8ea 0%, #d0d0d4 100%)' },
  fairy:    { bg: '#fff0f8', color: '#c0326e', gradient: 'linear-gradient(135deg, #ffe8f4 0%, #ffd0e8 100%)' },
  normal:   { bg: '#f5f5f7', color: '#6e6e73', gradient: 'linear-gradient(135deg, #ededf0 0%, #dcdce0 100%)' },
  fighting: { bg: '#fff0ee', color: '#b82010', gradient: 'linear-gradient(135deg, #ffe4e0 0%, #ffc8c0 100%)' },
  poison:   { bg: '#f5ebff', color: '#7a20b8', gradient: 'linear-gradient(135deg, #eedcff 0%, #ddbcff 100%)' },
  ground:   { bg: '#fffaee', color: '#9c7000', gradient: 'linear-gradient(135deg, #fff4d8 0%, #ffe9b0 100%)' },
  flying:   { bg: '#eef4ff', color: '#2060c0', gradient: 'linear-gradient(135deg, #e0ecff 0%, #c4d8ff 100%)' },
  bug:      { bg: '#f0faeb', color: '#3a7a20', gradient: 'linear-gradient(135deg, #e4f7dc 0%, #ccefbb 100%)' },
  rock:     { bg: '#f5f0e8', color: '#7a6840', gradient: 'linear-gradient(135deg, #ede8d8 0%, #ddd4bc 100%)' },
  ghost:    { bg: '#eeeaff', color: '#5035b8', gradient: 'linear-gradient(135deg, #e4dcff 0%, #ccc0ff 100%)' },
  steel:    { bg: '#f0f2f4', color: '#4a5870', gradient: 'linear-gradient(135deg, #e4e8ec 0%, #ccd4dc 100%)' },
}

export const TYPE_LIST = [
  'all', 'fire', 'water', 'grass', 'electric', 'psychic',
  'ice', 'dragon', 'dark', 'fairy', 'normal', 'fighting',
  'poison', 'ground', 'flying', 'bug', 'rock', 'ghost', 'steel',
]

export const getTypeStyle = (type) =>
  TYPE_COLORS[type] || { bg: '#f5f5f7', color: '#6e6e73', gradient: 'linear-gradient(135deg, #ededf0 0%, #dcdce0 100%)' }

// Stat abbreviations
export const STAT_ABBR = {
  hp:              'HP',
  attack:          'ATK',
  defense:         'DEF',
  'special-attack':  'SpA',
  'special-defense': 'SpD',
  speed:           'SPD',
}