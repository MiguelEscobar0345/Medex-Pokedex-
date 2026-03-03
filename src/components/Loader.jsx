import React from 'react'

export default function Loader({ fullPage = false }) {
  const containerStyle = fullPage
    ? {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: 1, minHeight: '60vh',
      }
    : {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 0',
      }

  return (
    <div style={containerStyle} aria-label="Loading">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 8, height: 8,
            borderRadius: '50%',
            background: '#0071e3',
            margin: '0 4px',
            animation: `pulse 0.8s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
    </div>
  )
}