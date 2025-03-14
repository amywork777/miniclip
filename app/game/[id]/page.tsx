import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameGrid } from "@/components/game-grid"
import { games } from "@/app/page"
import { ThemeToggle } from "@/components/theme-toggle"
import { getApprovedGames } from "@/lib/actions"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { GameIframe } from "@/components/game-iframe"
import { Logo } from "@/components/logo"

interface GamePageProps {
  params: {
    id: string
  }
}

export default async function GamePage({ params }: GamePageProps) {
  // Get approved games
  const approvedGames = await getApprovedGames()

  // Combine with predefined games
  const allGames = [...games, ...approvedGames]

  // Find the requested game
  const game = allGames.find((g) => g.id === params.id)

  if (!game) {
    return (
      <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Game not found</h1>
        <p className="mb-6 text-muted-foreground">The game you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    )
  }

  // Get other games
  const otherGames = allGames.filter((g) => g.id !== game.id).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <Button variant="outline" size="sm" asChild className="retro-button">
              <Link href="/submit">Submit Game</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 retro-button">
            <Link href="/" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to games
            </Link>
          </Button>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted game-card">
              <ImageWithFallback
                src={game.screenshot || ''}
                fallbackSrc={`/placeholder.svg?height=300&width=500&text=${encodeURIComponent(game.title)}`}
                alt={game.title}
                className="h-full w-full object-cover pixelated"
              />
            </div>
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h1 className="mt-2 text-3xl font-bold retro-font">{game.title}</h1>
                </div>
                {game.description && <p className="text-muted-foreground retro-font-text">{game.description}</p>}
              </div>
              <Button size="lg" className="mt-4 retro-button" asChild>
                <a href={`#game-frame`} className="flex items-center gap-2">
                  Play Game
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div id="game-frame" className="mt-8 w-full">
          <h2 className="mb-4 text-2xl font-bold retro-font">Play {game.title}</h2>
          <GameIframe src={game.url} title={game.title} />
        </div>

        {otherGames.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight retro-font">More Games</h2>
            <GameGrid games={otherGames} />
          </section>
        )}
      </main>
      <footer className="border-t bg-background/95">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left retro-font-text">
              &copy; {new Date().getFullYear()} AI Miniclip. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground retro-font-text">
                About
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground retro-font-text">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground retro-font-text">
                Privacy
              </Link>
              <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground retro-font-text">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </footer>
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

