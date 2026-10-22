function Toast({ message }) {
  if (!message) return null

  return (
    <div
      role="status"
      className="fixed bottom-24 left-1/2 z-[100] w-max max-w-[calc(100%-2.5rem)] -translate-x-1/2 rounded-full bg-[#0E1C31] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_24px_rgba(14,28,49,.22)] animate-toast-in"
    >
      {message}
    </div>
  )
}

export default Toast
