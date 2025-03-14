import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GameGrid } from "@/components/game-grid"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { games } from "@/app/page"
import { ThemeToggle } from "@/components/theme-toggle"
import { getApprovedGames } from "@/lib/actions"
import { Logo } from "@/components/logo"
import { Pagination } from "@/components/pagination"

// Number of games per page
const GAMES_PER_PAGE = 48;

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const currentPage = Number(searchParams.page) || 1;

  // Get approved games and combine with predefined games
  const approvedGames = await getApprovedGames();
  const allGames = [...games, ...approvedGames];

  // Filter games based on search query
  const filteredGames = allGames.filter((game) => {
    if (!query) return true;
    return game.title.toLowerCase().includes(query.toLowerCase()) ||
           (game.description && game.description.toLowerCase().includes(query.toLowerCase()));
  });

  // Pagination logic
  const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
  const endIndex = startIndex + GAMES_PER_PAGE;
  const paginatedGames = filteredGames.slice(startIndex, endIndex);

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
        <Button variant="ghost" size="sm" asChild className="mb-6 retro-button">
          <Link href="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to all games
          </Link>
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold retro-font">
            {query ? `Search results for "${query}"` : "All Games"}
          </h1>
          <p className="mt-2 text-muted-foreground retro-font-text">
            {filteredGames.length === 0
              ? "No games found. Try a different search."
              : `Found ${filteredGames.length} game${filteredGames.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        {filteredGames.length > 0 && (
          <>
            <GameGrid games={paginatedGames} />
            <Pagination totalGames={filteredGames.length} gamesPerPage={GAMES_PER_PAGE} />
          </>
        )}
      </main>
      <footer className="border-t bg-background/95">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left retro-font-text">
              &copy; {new Date().getFullYear()} AI Miniclip. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

