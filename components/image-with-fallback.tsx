"use client"

import { useState, useEffect } from 'react'

interface ImageWithFallbackProps {
  src: string
  fallbackSrc: string
  alt: string
  className?: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, className }: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  
  useEffect(() => {
    // Check if src is a local file path
    if (src && src.startsWith('/')) {
      setImgSrc(src)
      return
    }
    
    // If it's a URL, try using a screenshot service
    if (src) {
      setImgSrc(src)
    } else {
      // If no src is provided, use fallback
      setImgSrc(fallbackSrc)
    }
  }, [src, fallbackSrc])
  
  // If still loading, show a placeholder gradient
  if (!imgSrc) {
    return (
      <div className={`bg-gradient-to-br from-muted/50 to-muted ${className}`} />
    )
  }
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        // If image fails to load, use fallback
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc)
        }
      }}
    />
  )
} 