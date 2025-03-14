"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { adminLogin } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"

export default function AdminLoginPage() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    // Add a hidden email value since we're not collecting it from the user
    formData.append("email", "admin@example.com")
    
    const result = await adminLogin(formData)

    if (result.success) {
      router.push("/admin")
      router.refresh()
    } else {
      setError(result.error || "Authentication failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>
          <h2 className="mt-4 text-2xl font-bold">Admin Login</h2>
          <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to access the dashboard</p>
        </div>
        <Card>
          <form action={handleSubmit} className="space-y-4">
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter the admin password to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" type="password" required autoFocus />
              </div>
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center">
          <Link href="/" className="text-sm text-primary hover:underline">
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

