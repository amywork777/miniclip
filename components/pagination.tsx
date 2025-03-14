"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  totalGames: number
  gamesPerPage: number
}

export function Pagination({ totalGames, gamesPerPage }: PaginationProps) {
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page") || "1")
  const totalPages = Math.ceil(totalGames / gamesPerPage)

  return (
    <div className="mt-6 flex flex-col items-center space-y-4">
      <div className="flex justify-between items-center w-full">
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage <= 1}
          className="retro-button"
        >
          <Link
            href={{
              pathname: "/",
              query: { page: Math.max(1, currentPage - 1) },
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Link>
        </Button>
        <div className="font-mono text-sm">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          asChild
          disabled={currentPage >= totalPages}
          className="retro-button"
        >
          <Link
            href={{
              pathname: "/",
              query: { page: Math.min(totalPages, currentPage + 1) },
            }}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  )
} 