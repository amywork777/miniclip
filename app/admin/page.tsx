import { redirect } from "next/navigation"
import Link from "next/link"
import { getSubmittedGames, approveGame, rejectGame, deleteGame } from "@/lib/actions"
import { isAuthenticated, adminLogout } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Logo } from "@/components/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Trash } from "lucide-react"

export default async function AdminPage() {
  // Check if user is authenticated
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect("/admin/login")
  }

  const submittedGames = await getSubmittedGames()
  
  // Check for Supabase environment variables
  const hasSupabaseConfig = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form action={adminLogout}>
              <Button variant="outline" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="container py-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <Button asChild>
              <Link href="/">Back to Site</Link>
            </Button>
          </div>

          {!hasSupabaseConfig && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Supabase Not Configured</AlertTitle>
              <AlertDescription>
                Your site is running without Supabase integration. Game submissions are stored in memory and will be lost when the server restarts. 
                To enable persistent storage, set the NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Game Submissions</h2>

            {submittedGames.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No games have been submitted yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedGames.map(game => (
                    <TableRow key={game.id}>
                      <TableCell>{new Date(game.createdAt || "").toLocaleDateString()}</TableCell>
                      <TableCell>
                        <a href={game.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {game.title}
                        </a>
                      </TableCell>
                      <TableCell>{typeof game.submittedBy === 'object' ? game.submittedBy.email : game.submittedBy}</TableCell>
                      <TableCell>
                        <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                          game.status === "approved" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                          game.status === "rejected" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" :
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}>
                          {game.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {game.status === "pending" && (
                            <>
                              <form action={approveGame}>
                                <input type="hidden" name="id" value={game.id} />
                                <Button variant="outline" size="sm" type="submit">
                                  Approve
                                </Button>
                              </form>
                              <form action={rejectGame}>
                                <input type="hidden" name="id" value={game.id} />
                                <Button variant="outline" size="sm" type="submit">
                                  Reject
                                </Button>
                              </form>
                            </>
                          )}
                          <form action={deleteGame}>
                            <input type="hidden" name="id" value={game.id} />
                            <Button variant="outline" size="sm" type="submit" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </form>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>
      <footer className="border-t bg-background/95">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} AI Miniclip Admin Panel
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

