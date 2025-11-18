"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { StatisticsPanel } from "@/components/profile/StatisticsPanel"
import { ScoreCard } from "@/components/profile/ScoreCard"
import { TweetCard } from "@/components/profile/TweetCard"
import { ProfileNavigation } from "@/components/profile/ProfileNavigation"

interface UserProfile {
  id: number
  name: string
  avatar: string | null
  handle: string
  theme: string | null
  showPublicHistory: boolean
  joinDate: string
}

interface UserStats {
  totalGames: number
  averageDuration: number
  highestScore: number
  bestScoresByGame: Record<string, number>
  favoriteGames: Array<{ gameId: string; count: number; name: string }>
  bestStreak: number
  mostActiveHour: number
}

interface Score {
  id: number
  gameId: string
  score: number
  duration: number | null
  moves: number | null
  createdAt: string
  metadata?: any
}

interface Tweet {
  id: string
  text: string
  createdAt: string
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [scores, setScores] = useState<Score[]>([])
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [tweetsError, setTweetsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin")
    }
  }, [status, router])

  // Fetch profile data
  useEffect(() => {
    if (status === "authenticated" && session?.user && !fetchingRef.current) {
      fetchingRef.current = true
      const fetchData = async () => {
        try {
          // Fetch profile
          const profileRes = await fetch("/api/users/me", {
            credentials: "include",
          })
          if (!profileRes.ok) throw new Error("Failed to fetch profile")
          const profileData = await profileRes.json()
          setProfile(profileData.user)

          // Fetch stats
          const statsRes = await fetch("/api/users/me/stats", {
            credentials: "include",
          })
          if (!statsRes.ok) throw new Error("Failed to fetch stats")
          const statsData = await statsRes.json()
          setStats(statsData.stats)

          // Fetch scores
          const scoresRes = await fetch("/api/scores/me", {
            credentials: "include",
          })
          if (!scoresRes.ok) throw new Error("Failed to fetch scores")
          const scoresData = await scoresRes.json()
          // Sort by score (most epic first) then by date (most recent first)
          const sortedScores = scoresData.scores.sort((a: Score, b: Score) => {
            if (b.score !== a.score) return b.score - a.score
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
          setScores(sortedScores)

          // Fetch tweets (optional - don't block if it fails)
          try {
            const tweetsRes = await fetch("/api/users/me/tweets", {
              credentials: "include",
            })
            if (tweetsRes.ok) {
              const tweetsData = await tweetsRes.json()
              setTweets(tweetsData.tweets || [])
            } else if (tweetsRes.status === 429) {
              // Handle rate limit specifically
              setTweetsError("Limite de requisições atingido. Tente mais tarde.")
            } else {
              const errorData = await tweetsRes.json().catch(() => ({}))
              if (errorData.error?.code === "no_token" || errorData.error?.code === "invalid_token") {
                setTweetsError("Faça login novamente para ver seus tweets")
              } else if (errorData.error?.code === "rate_limit") {
                setTweetsError("Limite de requisições atingido. Tente mais tarde.")
              } else {
                setTweetsError("Não foi possível carregar tweets")
              }
            }
          } catch (error) {
            console.error("Error fetching tweets:", error)
            setTweetsError("Erro ao carregar tweets")
          }
        } catch (error) {
          console.error("Error fetching profile data:", error)
        } finally {
          setLoading(false)
          fetchingRef.current = false
        }
      }

      fetchData()
    }
  }, [status, session])

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-page pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-text-secondary">Carregando perfil...</div>
          </div>
        </div>
      </main>
    )
  }

  if (!profile || !stats) {
    return (
      <main className="min-h-screen bg-page pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-text-secondary">Erro ao carregar perfil</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-page pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileNavigation isOwnProfile={true} />

        <ProfileHeader
          name={profile.name}
          avatar={profile.avatar}
          handle={profile.handle}
          joinDate={profile.joinDate}
          theme={profile.theme}
          isOwnProfile={true}
        />

        <StatisticsPanel
          totalGames={stats.totalGames}
          averageDuration={stats.averageDuration}
          highestScore={stats.highestScore}
          bestScoresByGame={stats.bestScoresByGame}
          favoriteGames={stats.favoriteGames}
          bestStreak={stats.bestStreak}
          mostActiveHour={stats.mostActiveHour}
        />

        {/* Tweets Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 font-theme">
            Últimos Tweets
          </h2>
          {tweetsError ? (
            <div className="
              p-6
              bg-page-secondary
              border border-border
              rounded-lg
              text-center
            ">
              <p className="text-text-secondary">{tweetsError}</p>
            </div>
          ) : tweets.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {tweets.map((tweet) => (
                <TweetCard
                  key={tweet.id}
                  id={tweet.id}
                  text={tweet.text}
                  createdAt={tweet.createdAt}
                  metrics={tweet.metrics}
                />
              ))}
            </div>
          ) : (
            <div className="
              p-8
              bg-page-secondary
              border border-border
              rounded-lg
              text-center
            ">
              <p className="text-text-secondary">
                Nenhum tweet encontrado
              </p>
            </div>
          )}
        </div>

        {/* Score Cards */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-text mb-6 font-theme">
            Histórico de Partidas
          </h2>
          {scores.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {scores.map((score) => (
                <ScoreCard
                  key={score.id}
                  id={score.id}
                  gameId={score.gameId}
                  score={score.score}
                  duration={score.duration}
                  moves={score.moves}
                  createdAt={score.createdAt}
                  metadata={score.metadata}
                />
              ))}
            </div>
          ) : (
            <div className="
              p-8
              bg-page-secondary
              border border-border
              rounded-lg
              text-center
            ">
              <p className="text-text-secondary">
                Nenhuma partida registrada ainda. Comece a jogar!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

