import { useEffect } from 'react'

// Stops the page behind a dialog from scrolling, without a layout shift
// where the scrollbar used to be.
export function useLockBodyScroll() {
  useEffect(() => {
    const { body, documentElement } = document
    const scrollbar = window.innerWidth - documentElement.clientWidth
    body.style.overflow = 'hidden'
    body.style.paddingRight = `${scrollbar}px`
    return () => {
      body.style.overflow = ''
      body.style.paddingRight = ''
    }
  }, [])
}
