# Medex (Pokédex API)

A modern, production-grade Pokédex web application built with React and Vite. Designed with: frosted glass surfaces, fluid animations, and a refined typographic system.

Live demo → (https://medex-pokedex.vercel.app/)!

---

## Preview

> Clean cards, smooth spring animations, and a full-detail bottom sheet modal — all powered by the free [PokéAPI](https://pokeapi.co).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build tool | Vite 5 |
| Styling | CSS-in-JS (inline styles + CSS variables) |
| Data | [PokéAPI](https://pokeapi.co) — public REST API |
| Fonts | Playfair Display · Inter (Google Fonts) |
| Deployment | Vercel |

---

## Features

- **898 Pokémon** loaded from the official PokéAPI
- **Real-time search** — filter by name instantly
- **Type filtering** — 18 type pills in the sticky header
- **Paginated grid** — loads 40 at a time for performance
- **Detail modal** — height, weight, base stats with animated bars, flavor text, and abilities
- **Response caching** — API calls cached in memory; no duplicate requests
- **Accessible** — keyboard navigable cards and modal, ARIA roles, focus management
- **Responsive** — works on mobile, tablet, and desktop

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repo
git clone https://github.com/MiguelEscobar0345/MeDex.git
cd pokedex

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
pokedex/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Sticky nav with search + type filters
│   │   ├── PokemonCard.jsx     # Individual Pokémon card
│   │   ├── PokemonModal.jsx    # Detail bottom sheet
│   │   ├── TypeBadge.jsx       # Reusable type pill
│   │   └── Loader.jsx          # Animated loading dots
│   ├── hooks/
│   │   ├── usePokemonList.js   # Fetch + filter + paginate list
│   │   └── usePokemonDetail.js # Fetch single Pokémon detail
│   ├── utils/
│   │   └── typeColors.js       # Type → color mapping
│   ├── styles/
│   │   └── globals.css         # CSS variables + keyframes
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## Deploy on Vercel

### Option 1 — Vercel CLI

```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub Import

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set **Framework Preset** to `Vite`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. Click **Deploy**

The `vercel.json` handles client-side routing automatically.

---

## Design Decisions

**Why inline styles over a CSS framework?**  
Full control over every property without specificity conflicts or unused CSS. The component stays self-contained — ideal for a portfolio piece where code clarity matters.

**Why no state management library?**  
The app's state is simple enough to handle with `useState` and `useCallback`. Adding Redux or Zustand would be over-engineering for this scope.

**Why cache API responses in module-level objects?**  
PokéAPI is rate-limited. Caching prevents redundant requests on filter/search changes within the same session, without needing localStorage or a service worker.

---

## API Reference

All data comes from the free, open [PokéAPI](https://pokeapi.co). No API key required.

| Endpoint | Usage |
|----------|-------|
| `GET /pokemon?limit=898` | Full Pokémon name list |
| `GET /type/{type}` | Pokémon filtered by type |
| `GET /pokemon/{id or name}` | Full detail for one Pokémon |
| `GET /pokemon-species/{id}` | Flavor text + genus |

---

## License

MIT © [Miguel E. Escobar P.](https://github.com/MiguelEscobar0345/MiguelPortfolio)
