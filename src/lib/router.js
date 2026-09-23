import { useSyncExternalStore } from 'react'

// A minimal History API router: the app only has a handful of routes,
// so a dependency isn't worth it.
const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  window.addEventListener('popstate', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('popstate', listener)
  }
}

const getPath = () => window.location.pathname

export const usePath = () => useSyncExternalStore(subscribe, getPath)

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname) return
  // inApp marks entries we pushed, so closing a view can go back instead of pushing
  window.history[replace ? 'replaceState' : 'pushState']({ inApp: !replace || window.history.state?.inApp }, '', to)
  listeners.forEach(l => l())
}

const ROUTES = [
  { name: 'pokemon', pattern: /^\/pokemon\/([a-z0-9-]+)\/?$/, params: ['slug'] },
  { name: 'team', pattern: /^\/team\/?$/ },
  { name: 'compare', pattern: /^\/compare(?:\/([a-z0-9-]+)-vs-([a-z0-9-]+))?\/?$/, params: ['a', 'b'] },
  { name: 'game', pattern: /^\/game\/?$/ },
]

// Return to the previous in-app page if there is one, otherwise go to `fallback`
export function goBack(fallback = '/') {
  if (window.history.state?.inApp) window.history.back()
  else navigate(fallback, { replace: true })
}

export function matchRoute(path) {
  for (const route of ROUTES) {
    const m = path.match(route.pattern)
    if (m) {
      const params = Object.fromEntries((route.params ?? []).map((key, i) => [key, m[i + 1]]))
      return { name: route.name, params }
    }
  }
  return { name: 'home', params: {} }
}
