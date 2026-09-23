import { TYPES, defensiveProfile, effectiveness } from '../data/types'

// For each attacking type: how many team members take extra damage from it,
// and how many resist it (immunities count as resisting).
export function defensiveCoverage(team) {
  const profiles = team.map(p => defensiveProfile(p.types))
  return TYPES.map(type => {
    const weak = profiles.filter(pr => pr[type] > 1).length
    const resist = profiles.filter(pr => pr[type] < 1).length
    return { type, weak, resist, danger: weak >= 2 && weak > resist }
  })
}

// Defending types that at least one team member hits super-effectively with
// a move of its own type (same-type attack bonus).
export function offensiveCoverage(team) {
  const attacking = [...new Set(team.flatMap(p => p.types))]
  return TYPES.map(type => ({
    type,
    by: attacking.filter(a => effectiveness(a, type) > 1),
  }))
}

export function averageStats(team) {
  if (!team.length) return [0, 0, 0, 0, 0, 0]
  return team[0].stats.map((_, i) => Math.round(team.reduce((sum, p) => sum + p.stats[i], 0) / team.length))
}

// Best multiplier the attacker's own types deal to the defender
export function bestStab(attacker, defender) {
  return attacker.types
    .map(type => ({ type, multiplier: defender.types.reduce((m, t) => m * effectiveness(type, t), 1) }))
    .sort((a, b) => b.multiplier - a.multiplier)[0]
}
