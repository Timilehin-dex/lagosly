import { useState } from 'react'

// <img> that falls back to a blue gradient if the picture can't load
// (useful for the linked design images until you download them locally).
function SmartImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`bg-linear-to-br from-[#214FC7] to-[#4169E1] ${className}`}
      />
    )
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={className} />
}

export default SmartImage
