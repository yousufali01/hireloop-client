import * as React from "react"

const MOBILE_BREAKPOINT = 768
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

export function useIsMobile() {
  const subscribe = React.useCallback((onStoreChange: () => void) => {
    const mql = window.matchMedia(MOBILE_QUERY)
    mql.addEventListener("change", onStoreChange)
    return () => mql.removeEventListener("change", onStoreChange)
  }, [])

  const isMobile = React.useSyncExternalStore(
    subscribe,
    () => {
      const mql = window.matchMedia(MOBILE_QUERY)
      return mql.matches
    },
    // SSR snapshot: server never renders the mobile layout
    () => false
  )

  return !!isMobile
}
