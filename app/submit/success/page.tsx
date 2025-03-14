import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  return (
    <main className="flex-1">
      <div className="container max-w-screen-md py-12">
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <div className="flex flex-col items-center space-y-4 py-6">
              <div className="rounded-full bg-primary/10 p-2">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">Game Submitted Successfully!</CardTitle>
                <CardDescription className="text-base">
                  Thank you for your contribution to AI Miniclip.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">What happens next?</h3>
                <p className="text-muted-foreground">
                  Your game has been submitted for review by our admin team. This process typically takes 1-2 business days. Once approved, your game will appear on the AI Miniclip homepage.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Review process</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>We check that the submitted game meets our content guidelines</li>
                  <li>We verify the game works properly and is appropriate for our audience</li>
                  <li>We add a screenshot if one wasn't provided</li>
                  <li>We publish the game to our platform if everything is in order</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                <Button asChild size="lg" className="flex-1">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="flex-1">
                  <Link href="/submit">Submit Another Game</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

