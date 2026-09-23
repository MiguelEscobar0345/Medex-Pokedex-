import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Link from './Link'
import { useTheme } from '../hooks/useTheme'
import './Header.css'

export function LogoMark({ size = 26 }) {
  return (
    <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="var(--accent)" />
      <g fill="none" stroke="var(--accent-ink)" strokeWidth="5">
        <circle cx="32" cy="32" r="17" />
        <path d="M15 32h34" />
        <circle cx="32" cy="32" r="6" fill="var(--accent)" />
      </g>
    </svg>
  )
}

function ThemeToggle() {
  const [theme, toggle] = useTheme()
  const dark = theme === 'dark'
  return (
    <button className="btn btn--ghost btn--icon theme-toggle" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.svg
          key={theme}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        >
          {dark ? (
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          ) : (
            <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>
          )}
        </motion.svg>
      </AnimatePresence>
    </button>
  )
}

export default function Header({ search, onSearch, children }) {
  const inputRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // "/" or Ctrl/⌘+K focuses the search from anywhere
  useEffect(() => {
    const onKey = e => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
      if ((e.key === '/' && !typing) || (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="page header__row">
        <Link to="/" className="logo" aria-label="MeDex home">
          <LogoMark />
          <span className="logo__word">Me<span>Dex</span></span>
        </Link>

        {onSearch && (
          <label className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span className="visually-hidden">Search Pokémon</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search by name or number"
              value={search}
              onChange={e => onSearch(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  onSearch('')
                  e.currentTarget.blur()
                }
              }}
              autoComplete="off"
              spellCheck="false"
            />
            <kbd aria-hidden="true">/</kbd>
          </label>
        )}

        <div className="header__actions">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
