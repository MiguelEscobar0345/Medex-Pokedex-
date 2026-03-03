import React, { useState, useEffect } from 'react'
import TypeBadge from './TypeBadge'
import { getTypeStyle } from '../utils/typeColors'
import { fetchPokemonDetail } from '../hooks/usePokemonDetail'

export default function PokemonCard({ pokemon, index, onClick }) {
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchPokemonDetail(pokemon.url)
      .then(d => { if (!cancelled) setDetail(d) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [pokemon.url])

  if (!detail) {
    return (
      <div
        style={{
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 22,
          height: 220,
          animation: 'pulse 1.4s ease infinite',
        }}
      />
    )
  }

  const types    = detail.types.map(t => t.type.name)
  const primary  = types[0]
  const style    = getTypeStyle(primary)
  const img      =
    detail.sprites.other['official-artwork']?.front_default ||
    detail.sprites.front_default

  return (
    <article
      onClick={() => onClick(pokemon.url)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(pokemon.url)}
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(0,0,0,0.06)',
        borderRadius: 22,
        padding: '20px 18px 16px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${Math.min(index, 20) * 30}ms`,
        transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Blob background */}
      <div
        style={{
          position: 'absolute',
          right: -24, bottom: -24,
          width: 110, height: 110,
          borderRadius: '50%',
          background: style.gradient,
          opacity: 0.6,
          filter: 'blur(4px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Number */}
      <div
        style={{
          fontSize: '0.7rem', fontWeight: 500,
          color: '#aeaeb2', letterSpacing: '0.06em',
          textTransform: 'uppercase', marginBottom: 2,
          position: 'relative', zIndex: 1,
        }}
      >
        #{String(detail.id).padStart(3, '0')}
      </div>

      {/* Image */}
      <img
        src={img}
        alt={detail.name}
        loading="lazy"
        style={{
          display: 'block',
          width: 96, height: 96,
          objectFit: 'contain',
          margin: '4px auto 10px',
          imageRendering: 'auto',
          filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.1))',
          position: 'relative', zIndex: 1,
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        }}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.1) translateY(-4px)' }}
        onMouseLeave={e => { e.target.style.transform = 'none' }}
      />

      {/* Name */}
      <div
        style={{
          fontSize: '0.975rem', fontWeight: 600,
          letterSpacing: '-0.01em',
          textTransform: 'capitalize',
          color: '#1d1d1f',
          marginBottom: 8,
          position: 'relative', zIndex: 1,
        }}
      >
        {detail.name}
      </div>

      {/* Types */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        {types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
      </div>
    </article>
  )
}