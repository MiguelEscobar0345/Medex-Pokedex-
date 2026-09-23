import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

const format = n => Math.round(n).toLocaleString('en-US')

// Animates from the previously shown value to `value` once visible.
export default function CountUp({ value, duration = 1.2, className }) {
  const ref = useRef(null)
  const shown = useRef(0)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView) return
    const controls = animate(shown.current, value, {
      duration: reduceMotion ? 0 : duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: v => {
        shown.current = v
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [value, inView, duration, reduceMotion])

  return <span ref={ref} className={className}>{format(0)}</span>
}
