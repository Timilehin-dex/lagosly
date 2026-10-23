import { useCallback, useRef, useState } from 'react'

// useState that survives page changes and refreshes.
// It writes to the browser immediately when you set a value, so data is not lost
// even if you navigate to another page in the same moment.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  const latest = useRef(value)

  const setStored = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? next(latest.current) : next
      latest.current = resolved
      setValue(resolved)
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // storage full or blocked: the app still works, it just won't persist
      }
    },
    [key],
  )

  return [value, setStored]
}
