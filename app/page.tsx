import Link from "next/link"

import { Button } from "@/components/ui/button"
import { GameGrid } from "@/components/game-grid"
import { SearchAutoComplete } from "@/components/search-autocomplete"
import { ThemeToggle } from "@/components/theme-toggle"
import { getApprovedGames } from "@/lib/actions"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { Logo } from "@/components/logo"
import { Pagination } from "@/components/pagination"

// Number of games per page
const GAMES_PER_PAGE = 48;

export default async function HomePage({ 
  searchParams 
}: { 
  searchParams: { page?: string } 
}) {
  // Get approved games from submissions
  const approvedGames = await getApprovedGames()

  // Combine with predefined games
  const allGames = [...games, ...approvedGames]
  
  // Pagination logic
  const currentPage = Number(searchParams.page) || 1;
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const endIndex = startIndex + GAMES_PER_PAGE;
  const paginatedGames = allGames.slice(startIndex, endIndex);

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
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <SearchAutoComplete games={allGames} />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container py-6">
        <section className="mb-8 space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight retro-font">Featured Games</h1>
              <p className="text-muted-foreground retro-font-text">Discover and play the best AI games</p>
            </div>
            <div className="relative block sm:hidden">
              <SearchAutoComplete games={allGames} />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredGames.slice(0, 3).map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} className="group relative overflow-hidden rounded-lg game-card">
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <ImageWithFallback
                    src={game.screenshot || ''}
                    fallbackSrc={`/placeholder.svg?height=300&width=500&text=${encodeURIComponent(game.title)}`}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 pixelated"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-xl font-bold text-white retro-font-text">{game.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight retro-font">All Games</h2>
          </div>
          <GameGrid games={paginatedGames} />
          <Pagination totalGames={allGames.length} gamesPerPage={GAMES_PER_PAGE} />
        </section>
      </main>
      <footer className="border-t bg-background/95">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left retro-font-text">
              &copy; {new Date().getFullYear()} AI Miniclip. All rights reserved.
            </p>
            <div className="flex gap-4 items-center">
              <Button variant="outline" size="sm" asChild className="retro-button">
                <Link href="/submit">Submit Game</Link>
              </Button>
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

// Sample data - would be replaced with actual data from a database
export const featuredGames = [
  {
    id: "10",
    title: "Fly Pieter",
    description:
      "A fun free-to-play MMO flight sim, 100% made with AI, without loading screens and GBs of updates every time you wanna play.",
    url: "https://fly.pieter.com",
    screenshot: "/screenshots/fly-pieter.png",
  },
  {
    id: "15",
    title: "FPS Warehouse",
    description: "A first-person shooter game with WASD controls and shift to run.",
    url: "https://fps-warehouse.netlify.app/",
    screenshot: "/screenshots/fps-warehouse.png",
  },
  {
    id: "16",
    title: "3D Solar System",
    description: "Interactive 3D model of our solar system. Use mouse to orbit and scroll to zoom.",
    url: "https://solarsystem.connekt.studio/",
    screenshot: "/screenshots/3d-solar-system.png",
  },
]

export const games = [
  ...featuredGames,
  {
    id: "18",
    title: "Polytrack",
    description: "Interactive music experience.",
    url: "http://beta-polytrack.kodub.com",
    screenshot: "/screenshots/polytrack.png",
  },
  {
    id: "19",
    title: "Party",
    description: "Social party game experience.",
    url: "https://party.wearezizo.com",
    screenshot: "/screenshots/party.png",
  },
  {
    id: "20",
    title: "Vibe Sail",
    description: "Relaxing sailing experience.",
    url: "http://vibesail.com",
    screenshot: "/screenshots/vibe-sail.png",
  },
  {
    id: "1",
    title: "Kawaii Characters",
    description: "Create and customize adorable kawaii characters in this fun interactive game.",
    url: "https://kawaiicharacters.pretzel.design",
    screenshot: "/screenshots/kawaii-characters.png",
  },
  {
    id: "14",
    title: "Pulsr Quanta",
    description:
      "Navigate through quantum space as a Quantum Hatchling. Collect objectives, defeat enemies, and evolve your quantum entity.",
    url: "https://pulsrquanta.com",
    screenshot: "/screenshots/pulsr-quanta.png",
  },
]

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

