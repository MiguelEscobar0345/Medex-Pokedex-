import { navigate } from '../lib/router'

// Client-side navigation that still behaves like a link (new tab, copy URL…)
export default function Link({ to, onClick, ...props }) {
  const handleClick = e => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}
