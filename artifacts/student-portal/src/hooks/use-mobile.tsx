import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect if the current viewport width is below the mobile breakpoint (768px).
 * @returns {boolean} True if the viewport is mobile-sized.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
