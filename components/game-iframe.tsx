"use client"

import { useState } from 'react'

interface GameIframeProps {
  src: string
  title: string
}

export function GameIframe({ src, title }: GameIframeProps) {
  const [hasError, setHasError] = useState(false)
  
  return (
    <div className="w-full">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
        <iframe
          src={src}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Play ${title}`}
          onError={() => {
            console.error("Error loading iframe:", src);
            setHasError(true);
          }}
        ></iframe>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        If the game doesn't load properly, you can also <a href={src} target="_blank" rel="noopener noreferrer" className="text-primary underline">open it in a new tab</a>.
      </p>
    </div>
  )
} 