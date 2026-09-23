import { typeColor } from '../data/types'
import './AmbientBackground.css'

// Soft drifting light behind the page, tinted by the active type filter
export default function AmbientBackground({ type }) {
  const color = !type || type === 'all' ? 'var(--accent)' : typeColor(type)
  return (
    <div className="ambient" style={{ '--ambient': color }} aria-hidden="true">
      <span className="ambient__blob ambient__blob--a" />
      <span className="ambient__blob ambient__blob--b" />
    </div>
  )
}
