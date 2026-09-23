const API = 'https://pokeapi.co/api/v2'

// One in-flight or settled promise per URL, so repeat views never refetch.
const cache = new Map()

function getJSON(url) {
  if (!cache.has(url)) {
    const request = fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        return res.json()
      })
      .catch(err => {
        cache.delete(url)
        throw err
      })
    cache.set(url, request)
  }
  return cache.get(url)
}

const clean = text => text.replace(/[\f\n­]+/g, ' ').replace(/POKéMON/g, 'Pokémon').replace(/\s+/g, ' ').trim()

const english = entries => entries.filter(e => e.language.name === 'en')

export async function fetchPokemonDetail(id) {
  const [pokemon, species] = await Promise.all([
    getJSON(`${API}/pokemon/${id}`),
    getJSON(`${API}/pokemon-species/${id}`),
  ])
  const flavors = english(species.flavor_text_entries)
  return {
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    baseExperience: pokemon.base_experience,
    abilities: pokemon.abilities.map(a => ({ name: a.ability.name.replace(/-/g, ' '), hidden: a.is_hidden })),
    cry: pokemon.cries?.latest ?? null,
    genus: english(species.genera)[0]?.genus ?? '',
    flavor: flavors.length ? clean(flavors[flavors.length - 1].flavor_text) : '',
    captureRate: species.capture_rate,
    habitat: species.habitat?.name ?? null,
    legendary: species.is_legendary,
    mythical: species.is_mythical,
    evolutionChainUrl: species.evolution_chain?.url ?? null,
  }
}

export const fetchEvolutionChain = url => getJSON(url)
