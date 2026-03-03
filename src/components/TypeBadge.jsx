import React from 'react'
import { getTypeStyle } from '../utils/typeColors'

export default function TypeBadge({ type, size = 'sm' }) {
  const style = getTypeStyle(type)

  const sizes = {
    sm: { height: '22px', padding: '0 9px', fontSize: '0.68rem' },
    md: { height: '26px', padding: '0 12px', fontSize: '0.75rem' },
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...sizes[size],
        borderRadius: '100px',
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'inherit',
      }}
    >
      {type}
    </span>
  )
}