import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/image-with-fallback"

interface Game {
  id: string
  title: string
  description?: string
  url: string
  screenshot?: string
}

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: GameGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {games.map((game) => (
        <Card key={game.id} className="overflow-hidden border-0 game-card">
          <Link href={`/game/${game.id}`} className="block hover:opacity-90 transition-opacity">
            <div className="aspect-video relative bg-muted">
              <ImageWithFallback
                src={game.screenshot || ""}
                fallbackSrc={`/placeholder.svg?height=300&width=500&text=${encodeURIComponent(game.title)}`}
                alt={game.title}
                className="object-cover h-full w-full pixelated"
              />
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium line-clamp-1 retro-font-text">{game.title}</h3>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}

// Helper function to generate a screenshot URL from the game URL
function generateScreenshotUrl(url: string): string | null {
  try {
    const gameUrl = new URL(url);
    const domain = gameUrl.hostname;
    // Try to generate a screenshot using the domain
    return `https://image.thum.io/get/width/600/crop/900/https://${domain}`;
  } catch {
    return null;
  }
}

