import React, { useEffect, useRef } from 'react'
import TypeBadge from './TypeBadge'
import Loader from './Loader'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { getTypeStyle, STAT_ABBR } from '../utils/typeColors'

export default function PokemonModal({ url, onClose }) {
  const { detail, flavorText, genus, loading } = usePokemonDetail(url)
  const overlayRef = useRef(null)

  // Trap scroll on body
  useEffect(() => {
    document.body.style.overflow = url ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [url])

  // Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!url) return null

  const types   = detail?.types.map(t => t.type.name) || []
  const primary = types[0] || 'normal'
  const style   = getTypeStyle(primary)
  const img     = detail?.sprites.other['official-artwork']?.front_default
                || detail?.sprites.front_default

  const stats = detail?.stats || []

  return (
    <div
      ref={overlayRef}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeIn 0.25s ease',
        padding: '0',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={detail?.name || 'Pokémon detail'}
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '28px 28px 0 0',
          padding: '14px 28px 52px',
          animation: 'scaleIn 0.32s cubic-bezier(0.34,1.3,0.64,1)',
          scrollbarWidth: 'none',
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 40, height: 4, borderRadius: 2,
            background: '#e5e5ea', margin: '0 auto 22px',
          }}
        />

        {loading || !detail ? (
          <Loader />
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 4 }}>
              {/* Image box */}
              <div
                style={{
                  flexShrink: 0,
                  width: 120, height: 120,
                  borderRadius: 20,
                  background: style.gradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <img
                  src={img}
                  alt={detail.name}
                  style={{
                    width: 92, height: 92, objectFit: 'contain',
                    imageRendering: 'auto',
                    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.14))',
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div
                  style={{
                    fontSize: '0.7rem', fontWeight: 500, color: '#aeaeb2',
                    letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 2,
                  }}
                >
                  #{String(detail.id).padStart(3, '0')} · {genus}
                </div>
                <h2
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.85rem',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    textTransform: 'capitalize',
                    color: '#1d1d1f',
                    lineHeight: 1.1,
                    marginBottom: 10,
                  }}
                >
                  {detail.name}
                </h2>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {types.map(t => <TypeBadge key={t} type={t} size="md" />)}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: '#f2f2f7', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#e5e5ea' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f2f2f7' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick stats chips */}
            <div style={{ display: 'flex', gap: 10, margin: '18px 0' }}>
              {[
                { label: 'Height', value: `${(detail.height / 10).toFixed(1)} m` },
                { label: 'Weight', value: `${(detail.weight / 10).toFixed(1)} kg` },
                { label: 'Base EXP', value: detail.base_experience ?? '—' },
              ].map(chip => (
                <div
                  key={chip.label}
                  style={{
                    flex: 1, background: '#f5f5f7',
                    borderRadius: 14, padding: '10px 14px',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#aeaeb2', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {chip.label}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1d1d1f', marginTop: 2 }}>
                    {chip.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Flavor text */}
            {flavorText && (
              <p
                style={{
                  fontSize: '0.9rem', color: '#6e6e73', lineHeight: 1.65,
                  fontWeight: 300, marginBottom: 22,
                  borderLeft: `3px solid ${style.bg}`,
                  paddingLeft: 12,
                }}
              >
                {flavorText}
              </p>
            )}

            {/* Base stats */}
            <div
              style={{
                fontSize: '0.68rem', fontWeight: 600, color: '#aeaeb2',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12,
              }}
            >
              Base Stats
            </div>

            {stats.map(s => {
              const abbr = STAT_ABBR[s.stat.name] || s.stat.name.slice(0, 3).toUpperCase()
              const pct  = Math.min(100, (s.base_stat / 255) * 100)
              return (
                <div key={s.stat.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 36, fontSize: '0.7rem', fontWeight: 600, color: '#aeaeb2', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>
                    {abbr}
                  </div>
                  <div style={{ width: 30, fontSize: '0.88rem', fontWeight: 600, color: '#1d1d1f', textAlign: 'right', flexShrink: 0 }}>
                    {s.base_stat}
                  </div>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#f0f0f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        borderRadius: 3,
                        background: `linear-gradient(90deg, ${style.color}, ${style.color}88)`,
                        transition: 'width 0.9s cubic-bezier(0.34,1.1,0.64,1)',
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {/* Abilities */}
            <div
              style={{
                fontSize: '0.68rem', fontWeight: 600, color: '#aeaeb2',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginTop: 22, marginBottom: 10,
              }}
            >
              Abilities
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {detail.abilities.map(a => (
                <span
                  key={a.ability.name}
                  style={{
                    height: 30, padding: '0 14px',
                    borderRadius: '100px',
                    background: '#f0f0f5',
                    fontSize: '0.78rem', fontWeight: 500,
                    textTransform: 'capitalize', color: '#6e6e73',
                    display: 'inline-flex', alignItems: 'center',
                    border: a.is_hidden ? `1px dashed #aeaeb2` : 'none',
                  }}
                >
                  {a.ability.name}{a.is_hidden ? ' ✦' : ''}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}