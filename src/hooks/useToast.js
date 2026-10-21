import { useCallback, useEffect, useRef, useState } from 'react'

// const [message, showToast] = useToast()
// showToast('Saved!') shows the message for ~2s, then clears it.
export default function useToast(duration = 1800) {
  const [message, setMessage] = useState('')
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const showToast = useCallback(
    (text) => {
      clearTimeout(timer.current)
      setMessage(text)
      timer.current = setTimeout(() => setMessage(''), duration)
    },
    [duration],
  )

  return [message, showToast]
}
