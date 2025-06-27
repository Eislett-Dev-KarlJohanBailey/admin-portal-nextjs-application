
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

type UrlStateValue = string | number | boolean | string[] | null | undefined

export interface UrlStateOptions {
  shallow?: boolean
  scroll?: boolean
}

export function useUrlState<T extends Record<string, UrlStateValue>>(
  initialState: T,
  options: UrlStateOptions = { shallow: true, scroll: false }
) {
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)
  const [state, setState] = useState<T>(initialState)

  // Initialize state from URL on first render
  useEffect(() => {
    if (!router.isReady) return

    const stateFromUrl: Partial<T> = {} as Partial<T>
    
    // Process each key from initialState
    Object.keys(initialState).forEach((key) => {
      const queryValue = router.query[key]
      
      if (queryValue !== undefined) {
        // Handle different types
        if (Array.isArray(initialState[key])) {
          // Handle array values
          stateFromUrl[key as keyof T] = (
            Array.isArray(queryValue) ? queryValue : [queryValue]
          ) as T[keyof T]
        } else if (typeof initialState[key] === "boolean") {
          // Handle boolean values
          stateFromUrl[key as keyof T] = (
            queryValue === "true"
          ) as T[keyof T]
        } else if (typeof initialState[key] === "number") {
          // Handle number values
          stateFromUrl[key as keyof T] = (
            Number(queryValue)
          ) as T[keyof T]
        } else {
          // Handle string values
          stateFromUrl[key as keyof T] = (
            Array.isArray(queryValue) ? queryValue[0] : queryValue
          ) as T[keyof T]
        }
      }
    })
    
    // Merge URL state with initial state
    setState({ ...initialState, ...stateFromUrl })
    setIsInitialized(true)
  }, [router.isReady, router.query, initialState])

  // Update URL when state changes
  const updateState = useCallback((newState: Partial<T>) => {
    if (!router.isReady || !isInitialized) return

    const updatedState = { ...state, ...newState }
    setState(updatedState)
    
    // Prepare query params
    const query: Record<string, string | string[]> = { ...router.query }
    
    // Update query with new state values
    Object.keys(updatedState).forEach((key) => {
      const value = updatedState[key as keyof T]
      
      if (value === undefined || value === null || value === "") {
        // Remove empty values from URL
        delete query[key]
      } else if (Array.isArray(value)) {
        // Handle array values
        if (value.length > 0) {
          query[key] = value
        } else {
          delete query[key]
        }
      } else {
        // Handle other values
        query[key] = String(value)
      }
    })
    
    // Update URL
    router.push(
      {
        pathname: router.pathname,
        query
      },
      undefined,
      {
        shallow: options.shallow,
        scroll: options.scroll
      }
    )
  }, [router, state, isInitialized, options])

  return [state, updateState] as const
}
