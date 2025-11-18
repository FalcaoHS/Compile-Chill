"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { LoginButton } from "@/components/LoginButton"
import { GameCard } from "@/components/GameCard"
import { getAllGames } from "@/lib/games"
import { DevOrbsCanvas } from "@/components/DevOrbsCanvas"
import { ShakeButton } from "@/components/ShakeButton"
import { DropsCanvas } from "@/components/DropsCanvas"
import { EmoteBubble } from "@/components/EmoteBubble"
import { HackerPanel } from "@/components/hacker-panel/HackerPanel"
import { getEmotesByRarity, getEmoteById } from "@/lib/canvas/emotes/emote-loader"
import { useSafeScore } from "@/hooks/useSafeScore"
import { startSessionMonitoring, stopSessionMonitoring } from "@/lib/performance/session-stability"
import { CanvasRestartButton } from "@/components/CanvasRestartButton"
import { Test99BasketsButton } from "@/components/Test99BasketsButton"
import { DevMaster99Egg } from "@/components/DevMaster99Egg"

interface UserData {
  userId: number
  avatar: string | null
  username: string
  lastLogin: string
}

export default function Home() {
  const { data: session, status } = useSession()
  const handleShakeRef = useRef<(() => void) | null>(null)
  const spawnEmoteRef = useRef<((type: string, x: number, y: number) => void) | null>(null)
  const games = getAllGames()
  const [users, setUsers] = useState<UserData[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [showHackerPanel, setShowHackerPanel] = useState(false)
  const [show99Egg, setShow99Egg] = useState(false)
  const { processPendingScores } = useSafeScore()

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

  // Process pending scores on load (if authenticated)
  useEffect(() => {
    if (session?.user) {
      processPendingScores()
    }
  }, [session, processPendingScores])

  // Session stability monitoring
  useEffect(() => {
    if (session) {
      startSessionMonitoring(session)
    }
    
    return () => {
      stopSessionMonitoring()
    }
  }, [session])

  return (
    <main className="min-h-screen bg-page">
      <CanvasRestartButton />
      {/* Physics Area - Replaces Hero Section */}
      <div className="w-full relative" style={{ height: "calc(100vh - 96px)", minHeight: "400px" }}>
        {/* DevOrbs Canvas - Bottom layer */}
        <DevOrbsCanvas 
          users={users} 
          onShakeReady={(handleShake) => {
            handleShakeRef.current = handleShake
          }}
          onScoreChange={(score) => {
            // Check if score reached 99
            if (score === 99) {
              if (typeof window !== 'undefined') {
                const eggUnlocked = localStorage.getItem('compilechill_egg_99_v1')
                if (!eggUnlocked) {
                  // Save unlock
                  localStorage.setItem('compilechill_egg_99_v1', JSON.stringify({
                    unlockedAt: new Date().toISOString(),
                    device: navigator.userAgent
                  }))
                  // Show easter egg
                  setShow99Egg(true)
                }
              }
            }
          }}
          onTest99Baskets={() => {
            // Remove unlock flag for testing
            if (typeof window !== 'undefined') {
              localStorage.removeItem('compilechill_egg_99_v1')
            }
            setShow99Egg(true)
          }}
        />
        
        {/* Drops Canvas - Middle layer (above DevOrbs) */}
        <DropsCanvas
          onReward={(type, value) => {
            // Handle reward (client state only for now)
            console.log(`Reward granted: ${type} = ${value}`)
            // TODO: Display reward UI/animation
          }}
        />
        
        {/* Emotes Canvas - Top layer (above Drops) */}
        <EmoteBubble 
          onReady={(spawnEmoteFn) => {
            spawnEmoteRef.current = spawnEmoteFn
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

        {/* Hacker Panel Toggle Button */}
        <button
          onClick={() => setShowHackerPanel(!showHackerPanel)}
          className="absolute top-20 right-4 md:right-4 z-30 px-3 py-2 bg-page-secondary text-text border border-border rounded hover:bg-page-secondary/80 hover:border-primary transition-colors text-sm font-theme flex items-center gap-2"
          style={{ pointerEvents: 'auto' }}
          aria-label="Toggle Hacker Panel"
        >
          <span className="text-primary">[</span>
          <span>{showHackerPanel ? 'HIDE' : 'TERMINAL'}</span>
          <span className="text-primary">]</span>
        </button>

        {/* Test 99 Baskets Button - Hidden */}
        {/* <Test99BasketsButton
          onTrigger={() => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('compilechill_egg_99_v1')
            }
            setShow99Egg(true)
          }}
        /> */}

        {/* Hacker Panel - Overlay layer (highest z-index when visible) */}
        {showHackerPanel && (
          <div 
            className="absolute top-28 right-4 w-80 h-80 md:w-96 md:h-96 z-[60] border border-primary rounded"
            style={{ 
              pointerEvents: 'auto',
              boxShadow: '0 0 20px rgba(126, 249, 255, 0.3)',
            }}
          >
            <HackerPanel 
              className="w-full h-full"
              enabled={showHackerPanel}
            />
          </div>
        )}
        
        {/* Temporary Emote Test Buttons - Hidden */}
        <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-30 hidden" style={{ pointerEvents: 'auto' }}>
          <button
            onClick={() => {
              if (spawnEmoteRef.current) {
                const rareEmotes = getEmotesByRarity('rare')
                if (rareEmotes.length > 0) {
                  const randomEmote = rareEmotes[Math.floor(Math.random() * rareEmotes.length)]
                  const x = Math.random() * window.innerWidth
                  const y = 100 + Math.random() * 200
                  spawnEmoteRef.current(randomEmote.id, x, y)
                }
              }
            }}
            className="px-4 py-2 bg-accent text-page rounded border border-border hover:bg-accent-hover transition-colors text-sm font-theme"
          >
            🎯 Test Rare
          </button>
          
          <button
            onClick={() => {
              if (spawnEmoteRef.current) {
                const epicEmotes = getEmotesByRarity('epic')
                if (epicEmotes.length > 0) {
                  const randomEmote = epicEmotes[Math.floor(Math.random() * epicEmotes.length)]
                  const x = Math.random() * window.innerWidth
                  const y = 100 + Math.random() * 200
                  spawnEmoteRef.current(randomEmote.id, x, y)
                }
              }
            }}
            className="px-4 py-2 bg-purple-500 text-page rounded border border-border hover:bg-purple-600 transition-colors text-sm font-theme"
          >
            ⚡ Test Epic
          </button>
          
          <button
            onClick={() => {
              if (spawnEmoteRef.current) {
                const legendaryEmotes = getEmotesByRarity('legendary')
                if (legendaryEmotes.length > 0) {
                  const randomEmote = legendaryEmotes[Math.floor(Math.random() * legendaryEmotes.length)]
                  const x = Math.random() * window.innerWidth
                  const y = 100 + Math.random() * 200
                  spawnEmoteRef.current(randomEmote.id, x, y)
                }
              }
            }}
            className="px-4 py-2 bg-yellow-500 text-page rounded border border-yellow-400 hover:bg-yellow-600 transition-colors text-sm font-theme shadow-lg shadow-yellow-500/50"
          >
            ⭐ Test Legendary
          </button>
          
                <button
                  onClick={() => {
                    if (spawnEmoteRef.current) {
                      // Mix of all rarities
                      const commonEmotes = ['rage', 'segfault', '404', 'rmrf', 'compile', 'deploy']
                      const rareEmotes = getEmotesByRarity('rare')
                      const epicEmotes = getEmotesByRarity('epic')
                      const legendaryEmotes = getEmotesByRarity('legendary')
                      
                      const allEmotes = [
                        ...commonEmotes,
                        ...rareEmotes.map(e => e.id),
                        ...epicEmotes.map(e => e.id),
                        ...legendaryEmotes.map(e => e.id)
                      ]
                      
                      const randomEmote = allEmotes[Math.floor(Math.random() * allEmotes.length)]
                      const x = Math.random() * window.innerWidth
                      const y = 100 + Math.random() * 200
                      spawnEmoteRef.current(randomEmote, x, y)
                    }
                  }}
                  className="px-4 py-2 bg-primary text-page rounded border border-border hover:bg-primary-hover transition-colors text-sm font-theme"
                >
                  🎲 Random All
                </button>
                
                <button
                  onClick={() => {
                    if (spawnEmoteRef.current) {
                      const productOwnerEmote = getEmoteById('product_owner')
                      if (productOwnerEmote) {
                        const x = Math.random() * window.innerWidth
                        const y = 100 + Math.random() * 200
                        spawnEmoteRef.current('product_owner', x, y)
                      } else {
                        console.warn('Product Owner emote not found!')
                      }
                    }
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-white rounded border-2 border-yellow-400 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 transition-all text-sm font-theme shadow-lg shadow-yellow-500/50 font-bold"
                >
                  👑 Product Owner (Unique)
                </button>
        </div>

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

      {/* 99 Baskets Easter Egg */}
      {show99Egg && (
        <DevMaster99Egg
          onClose={() => {
            setShow99Egg(false)
            // Save unlock after closing
            if (typeof window !== 'undefined') {
              localStorage.setItem('compilechill_egg_99_v1', JSON.stringify({
                unlockedAt: new Date().toISOString(),
                device: navigator.userAgent
              }))
            }
          }}
        />
      )}
    </main>
  );
}
