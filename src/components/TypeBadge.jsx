import { typeColor, typeLabel } from '../data/types'
import './TypeBadge.css'

export default function TypeBadge({ type, size = 'sm' }) {
  return (
    <span className={`type-badge type-badge--${size} type-tint type-ink`} style={{ '--t': typeColor(type) }}>
      <span className="type-badge__dot" aria-hidden="true" />
      {typeLabel(type)}
    </span>
  )
}
