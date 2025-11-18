"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { LoginButton } from "@/components/LoginButton"
import { GameCard } from "@/components/GameCard"
import { getAllGames } from "@/lib/games"
import { DevOrbsCanvas } from "@/components/DevOrbsCanvas"
import { ShakeButton } from "@/components/ShakeButton"

interface UserData {
  userId: number
  avatar: string | null
  username: string
  lastLogin: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const handleShakeRef = useRef<(() => void) | null>(null)
  const games = getAllGames()
  const [users, setUsers] = useState<UserData[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)

  // Fetch recent users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true)
        const response = await fetch("/api/users/recent")
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", response.status, errorText)
          throw new Error(`Failed to fetch users: ${response.status}`)
        }

        const data = await response.json()
        console.log("Users fetched:", data.users?.length || 0, "users")
        setUsers(data.users || [])
        setUsersError(null)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsersError("Failed to load users")
        // Fallback to empty array - fake profiles will be used
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }

    fetchUsers()

    // Refresh users every 10 seconds
    const interval = setInterval(fetchUsers, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-page">
      {/* Physics Area - Replaces Hero Section */}
      <div className="w-full relative" style={{ height: "calc(100vh - 96px)", minHeight: "400px" }}>
        {/* Canvas sempre montado para não resetar física/orbs em cada refetch */}
        <DevOrbsCanvas 
          users={users} 
          onShakeReady={(handleShake) => {
            handleShakeRef.current = handleShake
          }}
        />
        
        {/* Shake Button */}
        <ShakeButton 
          onShake={() => {
            if (handleShakeRef.current) {
              handleShakeRef.current()
            }
          }}
        />

        {/* Overlay de status (não desmonta o canvas) */}
        {usersLoading && (
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-4">
            <p className="text-xs sm:text-sm text-text-secondary bg-page-secondary/80 px-3 py-1 rounded border border-border/40">
              Carregando Dev Orbs...
            </p>
          </div>
        )}
        {usersError && (
          <div className="pointer-events-none absolute inset-0 flex items-start justify-center pt-4">
            <p className="text-xs sm:text-sm text-red-400 bg-page-secondary/80 px-3 py-1 rounded border border-border/40">
              Falha ao carregar usuários recentes. Usando orbs padrão.
            </p>
          </div>
        )}
      </div>

      {/* Games Grid - Below Physics Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 font-theme">
            Jogos Disponíveis
          </h2>
          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            gap-4
            sm:gap-6
          ">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
