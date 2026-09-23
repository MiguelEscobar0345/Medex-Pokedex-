# MeDex

A field guide to all 1,025 Pokémon, built with React, Vite and [Motion](https://motion.dev).

Live → **[medex-pokedex.vercel.app](https://medex-pokedex.vercel.app/)**

---

## Features

- **All 1,025 species** (Gen I–IX) with instant search by name or number
- **Filters** by type and generation, plus sorting by number, name, base stat total or speed
- **Motion throughout** — cards tilt toward the cursor, the grid reflows when filters change,
  the active filter pill slides, and the background takes on the color of the selected type
- **Detail view** — the artwork flies from its card into a panel with the Pokédex entry,
  abilities, a stat radar that morphs between Pokémon, the evolution chain (with how each
  stage evolves) and type matchups. Play the cry, toggle shiny artwork, and step through
  the list with the arrow keys or by swiping. On mobile it's a swipe-to-dismiss sheet
- **Team builder** — up to six Pokémon, saved in your browser, with defensive coverage per
  attacking type, offensive gaps, the biggest threats and average stats
- **Compare** two Pokémon head to head: overlaid radar, stat duel, type advantage verdict and
  suggested rivals (`/compare/charizard-vs-blastoise`)
- **Who’s that Pokémon?** — guess from the silhouette with multiple choice or by typing the name
  (one typo forgiven), filter by generation, and chase your best streak
- **Shareable URLs** — every Pokémon has its own page, e.g. `/pokemon/pikachu`
- **Light and dark themes** that follow the system, with a manual toggle
- **Accessible** — keyboard shortcuts (`/` or `Ctrl+K` to search, `Esc` to close),
  focus management, and animations reduced when the OS asks for it

## Getting started

```bash
git clone https://github.com/MiguelEscobar0345/Medex-Pokedex-.git
cd Medex-Pokedex-
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | Run ESLint |
| `npm run data` | Regenerate `src/data/pokedex.json` from PokéAPI |

## How it works

**Static index, live details.** `scripts/build-pokedex.mjs` pulls every species' name,
generation, types and base stats from the PokéAPI GraphQL endpoint into a ~22 KB (gzipped)
JSON file. The grid, filters and sorting run entirely on that file, so there is no request
per card. Entry text, abilities and measurements are fetched from the REST API when a
detail view opens, and cached in memory.

**Artwork** comes straight from the PokéAPI sprites repository.

**Routing** is a ~50 line History API router (`src/lib/router.js`); `vercel.json` rewrites
unknown paths to `index.html` so deep links work.

## Project structure

```
src/
├── components/
│   ├── detail/            # Detail panel and its sections
│   ├── AmbientBackground  # Type-tinted drifting light
│   ├── Filters            # Type / generation pills and sorting
│   ├── Hero               # Title reveal, counter and featured Pokémon
│   ├── PokemonCard        # Card with pointer tilt and parallax
│   ├── PokemonGrid        # Animated grid with infinite scroll
│   └── …
├── data/                  # pokedex.json, type chart and helpers
├── hooks/
├── lib/                   # API client and router
└── styles/                # Design tokens and base styles
```

## Credits

Data and artwork from [PokéAPI](https://pokeapi.co). Pokémon and Pokémon names are
trademarks of Nintendo, Game Freak and The Pokémon Company.

MIT © [Miguel E. Escobar P.](https://github.com/MiguelEscobar0345)
