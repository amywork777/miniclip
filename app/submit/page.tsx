import Link from "next/link"
import { submitGame } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"

export default function SubmitGamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/submit">Submit Game</Link>
            </Button>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="container py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Submit Your Game</h1>
            <p className="text-muted-foreground">
              Share your game with our community. Just provide the URL to your game.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <form action={submitGame} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="url"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Game URL
                </label>
                <Input id="url" name="url" type="url" placeholder="https://yourgame.com" required />
                <p className="text-xs text-muted-foreground">We'll review your game and add it to our site if approved.</p>
              </div>

              <Button type="submit" className="w-full">
                Submit Game
              </Button>
            </form>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background/95">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} AI Miniclip. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

