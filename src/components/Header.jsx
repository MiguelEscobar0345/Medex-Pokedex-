import React, { useRef } from 'react'
import { TYPE_LIST } from '../utils/typeColors'

export default function Header({ search, onSearch, activeType, onTypeChange }) {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: 'smooth' })
  }

  return (
    <>
      <style>{`
        .pills-row::-webkit-scrollbar { display: none; }
        @media (max-width: 640px) {
          .header-row { flex-wrap: wrap; height: auto !important; padding: 10px 16px 0 !important; gap: 10px !important; }
          .header-search { width: 100% !important; max-width: 100% !important; order: 2; }
          .header-logo { order: 1; }
          .header-pills-wrap { order: 3; width: 100%; padding-bottom: 10px; }
        }
      `}</style>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(245,245,247,0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
        }}
      >
        <div
          className="header-row"
          style={{
            width: '100%',
            padding: '0 32px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxSizing: 'border-box',
          }}
        >
          {/* Logo */}
          <a
            className="header-logo"
            href="/"
            style={{
              textDecoration: 'none',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#1d1d1f',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {'Me'}
            <span style={{ color: '#395144' }}>{'Dex'}</span>
          </a>

          {/* Search */}
          <div
            className="header-search"
            style={{ position: 'relative', width: 240, flexShrink: 0 }}
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#aeaeb2" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                position: 'absolute', left: 12, top: '50%',
                transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1,
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search Pokémon…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                background: 'rgba(0,0,0,0.06)',
                border: '1.5px solid transparent',
                borderRadius: 10,
                padding: '0 14px 0 36px',
                fontFamily: "'Inter', -apple-system, sans-serif",
                fontSize: '0.875rem',
                fontWeight: 400,
                color: '#1d1d1f',
                caretColor: '#395144',
                outline: 'none',
                transition: 'all 0.18s ease',
                boxSizing: 'border-box',
                display: 'block',
              }}
              onFocus={(e) => {
                e.target.style.background = '#ffffff'
                e.target.style.borderColor = '#395144'
                e.target.style.boxShadow = '0 0 0 3px rgba(57,81,68,0.15)'
              }}
              onBlur={(e) => {
                e.target.style.background = 'rgba(0,0,0,0.06)'
                e.target.style.borderColor = 'transparent'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Pills wrap */}
          <div
            className="header-pills-wrap"
            style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}
          >
            {/* Arrow left */}
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Scrollable pills */}
            <div
              ref={scrollRef}
              className="pills-row"
              style={{
                display: 'flex', gap: 6, overflowX: 'auto', flex: 1,
                scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
                padding: '2px 0',
              }}
            >
              {TYPE_LIST.map((type) => (
                <button
                  key={type}
                  onClick={() => onTypeChange(type)}
                  style={{
                    height: 32, padding: '0 14px',
                    border: `1.5px solid ${activeType === type ? '#395144' : 'rgba(0,0,0,0.1)'}`,
                    borderRadius: '100px',
                    background: activeType === type ? '#395144' : 'transparent',
                    color: activeType === type ? '#ffffff' : '#6e6e73',
                    fontFamily: 'inherit', fontSize: '0.775rem', fontWeight: 500,
                    whiteSpace: 'nowrap', flexShrink: 0,
                    transition: 'all 0.18s ease', cursor: 'pointer',
                  }}
                >
                  {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            {/* Arrow right */}
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              style={{
                flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
                border: '1px solid rgba(0,0,0,0.1)', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}