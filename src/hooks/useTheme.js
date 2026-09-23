import { useState } from 'react'

const STORAGE_KEY = 'medex-theme'

function currentTheme() {
  const explicit = document.documentElement.dataset.theme
  if (explicit) return explicit
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme)

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* storage unavailable */ }
    setTheme(next)
  }

  return [theme, toggle]
}
