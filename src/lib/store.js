import { useSyncExternalStore } from 'react'
import { getById } from '../data/pokedex'

// Tiny external stores so the team and toasts can be shared by components
// that live far apart (detail view, dock, team page) without prop drilling.
function createStore(initial, { key, sanitize = v => v } = {}) {
  let value = initial
  if (key) {
    try {
      const saved = localStorage.getItem(key)
      if (saved) value = sanitize(JSON.parse(saved))
    } catch { /* storage unavailable or corrupt */ }
  }
  const listeners = new Set()
  return {
    get: () => value,
    set(next) {
      value = typeof next === 'function' ? next(value) : next
      if (key) {
        try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
      }
      listeners.forEach(l => l())
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

export const useStore = store => useSyncExternalStore(store.subscribe, store.get)

// Team: up to six Pokémon ids, persisted
export const TEAM_SIZE = 6

export const teamStore = createStore([], {
  key: 'medex-team',
  sanitize: ids => (Array.isArray(ids) ? [...new Set(ids)].filter(id => getById(id)).slice(0, TEAM_SIZE) : []),
})

export function toggleTeamMember(pokemon) {
  const team = teamStore.get()
  if (team.includes(pokemon.id)) {
    teamStore.set(team.filter(id => id !== pokemon.id))
    showToast(`${pokemon.name} left your team`)
  } else if (team.length >= TEAM_SIZE) {
    showToast('Your team is full — remove someone first')
  } else {
    teamStore.set([...team, pokemon.id])
    showToast(`${pokemon.name} joined your team`)
  }
}

// Toasts: one message at a time, replaced by the next
export const toastStore = createStore(null)

let toastId = 0
export function showToast(message) {
  toastStore.set({ id: ++toastId, message })
}
