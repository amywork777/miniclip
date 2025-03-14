"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Game {
  id: string
  title: string
  description?: string
  url: string
}

interface SearchAutoCompleteProps {
  games: Game[]
}

export function SearchAutoComplete({ games }: SearchAutoCompleteProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Filter games based on search term
  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = games
        .filter(
          (game) =>
            game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase())),
        )
        .slice(0, 5) // Limit to 5 results for dropdown

      setFilteredGames(filtered)
      setShowResults(true)
    } else {
      setFilteredGames([])
      setShowResults(false)
    }
  }, [searchTerm, games])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [wrapperRef])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setShowResults(false)
    }
  }

  // Handle game selection from dropdown
  const handleGameSelect = (gameId: string) => {
    router.push(`/game/${gameId}`)
    setShowResults(false)
    setSearchTerm("")
  }

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search games..."
            className="w-full pl-8 md:w-[260px] lg:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length > 1 && setShowResults(true)}
          />
        </div>
      </form>

      {showResults && filteredGames.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
          <ul className="py-1">
            {filteredGames.map((game) => (
              <li
                key={game.id}
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-accent"
                onClick={() => handleGameSelect(game.id)}
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                  <img
                    src={`/placeholder.svg?height=100&width=100&text=${encodeURIComponent(game.title.charAt(0))}`}
                    alt={game.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{game.title}</p>
                </div>
              </li>
            ))}
            <li className="border-t px-4 py-2">
              <button className="w-full text-left text-sm text-primary" onClick={handleSubmit}>
                See all results for "{searchTerm}"
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

