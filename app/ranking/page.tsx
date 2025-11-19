"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Header } from "@/components/Header"
import { RankingsTabs } from "@/components/rankings/RankingsTabs"
import { GameSelector } from "@/components/rankings/GameSelector"
import { RankingsList } from "@/components/rankings/RankingsList"
import { PaginationControls } from "@/components/rankings/PaginationControls"
import { EmptyState } from "@/components/rankings/EmptyState"
import { getAllGames } from "@/lib/games"

type TabType = "global" | "per-game"

interface RankingEntry {
  rank: number
  id: number
  userId: number
  userName: string
  userAvatar: string
  score: number
  duration?: number | null
  moves?: number | null
  gameId?: string
  gameName?: string
  gameIcon?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function RankingPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<TabType>("global")
  const [selectedGameId, setSelectedGameId] = useState<string>(getAllGames()[0].id)
  const [currentPage, setCurrentPage] = useState(1)
  const [rankings, setRankings] = useState<RankingEntry[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch rankings data
  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let url: string
        if (activeTab === "global") {
          url = `/api/scores/global-leaderboard?page=${currentPage}&limit=20`
        } else {
          url = `/api/scores/leaderboard?gameId=${selectedGameId}&page=${currentPage}&limit=20`
        }

        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error("Erro ao buscar rankings")
        }

        const data = await response.json()

        if (activeTab === "global") {
          // Global leaderboard format
          const formattedRankings: RankingEntry[] = data.leaderboard.map((entry: any) => ({
            rank: entry.rank,
            id: entry.id,
            userId: entry.user.id,
            userName: entry.user.name || "Jogador",
            userAvatar: entry.user.avatar || "",
            score: entry.score,
            duration: entry.duration,
            moves: entry.moves,
            gameId: entry.gameId,
            gameName: entry.gameName,
            gameIcon: entry.gameIcon,
          }))
          setRankings(formattedRankings)
          setPagination(data.pagination)
        } else {
          // Per-game leaderboard format
          const formattedRankings: RankingEntry[] = data.leaderboard.map((entry: any) => ({
            rank: entry.rank,
            id: entry.id,
            userId: entry.user.id,
            userName: entry.user.name || "Jogador",
            userAvatar: entry.user.avatar || "",
            score: entry.score,
            duration: entry.duration,
            moves: entry.moves,
          }))
          setRankings(formattedRankings)
          setPagination(data.pagination)
        }
      } catch (err) {
        
        setError("Não foi possível carregar os rankings. Tente novamente.")
        setRankings([])
        setPagination(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRankings()
  }, [activeTab, selectedGameId, currentPage])

  // Reset to page 1 when changing tabs or game
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handleGameChange = (gameId: string) => {
    setSelectedGameId(gameId)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Get current user ID for highlighting
  const currentUserId = session?.user?.id ? parseInt(session.user.id) : undefined

  return (
    <div className="min-h-screen bg-page pt-24">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text mb-2 font-theme">
            🏆 Rankings
          </h1>
          <p className="text-text-secondary">
            Veja os melhores jogadores e suas conquistas
          </p>
        </div>

        {/* Tabs */}
        <RankingsTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Game Selector (only for per-game view) */}
        {activeTab === "per-game" && (
          <GameSelector
            selectedGameId={selectedGameId}
            onGameChange={handleGameChange}
          />
        )}

        {/* Error State */}
        {error && (
          <div className="
            p-6
            bg-page-secondary
            border-2 border-red-500
            rounded-lg
            text-center
            mb-6
          ">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {/* Rankings List or Empty State */}
        {!error && !isLoading && rankings.length === 0 ? (
          <EmptyState
            message={
              activeTab === "per-game"
                ? "Este jogo ainda não tem scores registrados. Seja o primeiro!"
                : undefined
            }
          />
        ) : (
          <>
            <RankingsList
              rankings={rankings}
              currentUserId={currentUserId}
              isLoading={isLoading}
            />

            {/* Pagination */}
            {!isLoading && pagination && pagination.totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {/* Total count info */}
        {!isLoading && pagination && rankings.length > 0 && (
          <div className="mt-6 text-center text-sm text-text-secondary">
            Mostrando {rankings.length} de {pagination.total.toLocaleString()} scores
          </div>
        )}
      </main>
    </div>
  )
}

