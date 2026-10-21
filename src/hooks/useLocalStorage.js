import { useEffect, useState } from 'react'

// useState that survives page changes and refreshes.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked: the app still works, it just won't persist
    }
  }, [key, value])

  return [value, setValue]
}
