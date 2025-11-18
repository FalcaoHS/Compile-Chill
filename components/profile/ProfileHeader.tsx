"use client"

import Image from "next/image"
import { useThemeStore } from "@/lib/theme-store"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"

interface ProfileHeaderProps {
  name: string
  avatar: string | null
  handle: string
  joinDate: Date | string
  theme: string | null
  isOwnProfile?: boolean
}

// Auto-generate a fun bio based on join date
function generateBio(joinDate: Date | string): string {
  const date = typeof joinDate === "string" ? new Date(joinDate) : joinDate
  const now = new Date()
  const daysSinceJoin = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysSinceJoin < 7) {
    return "🚀 Recém-chegado ao portal!"
  } else if (daysSinceJoin < 30) {
    return "⭐ Explorador iniciante"
  } else if (daysSinceJoin < 90) {
    return "🎮 Jogador dedicado"
  } else if (daysSinceJoin < 180) {
    return "🏆 Veterano do portal"
  } else {
    return "👑 Lenda do Compile & Chill"
  }
}

export function ProfileHeader({
  name,
  avatar,
  handle,
  joinDate,
  theme,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const { theme: currentTheme } = useThemeStore()
  const bio = generateBio(joinDate)
  
  // Format join date
  const date = typeof joinDate === "string" ? new Date(joinDate) : joinDate
  const formattedJoinDate = date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="mb-8">
      <div className="
        p-6 sm:p-8
        bg-page-secondary
        border-2 border-border
        rounded-xl
        shadow-glow-sm
      ">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                width={120}
                height={120}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-border shadow-glow-sm"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-600 flex items-center justify-center border-2 border-border shadow-glow-sm">
                <span className="text-white text-3xl sm:text-4xl font-bold">
                  {name[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text font-theme mb-2">
              {name}
            </h1>
            <p className="text-text-secondary mb-2">
              @{handle}
            </p>
            <p className="text-sm text-text-secondary mb-3 italic">
              {bio}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span>
                Entrou em {formattedJoinDate}
              </span>
              {isOwnProfile && (
                <div className="flex items-center gap-2">
                  <span>Tema:</span>
                  <ThemeSwitcher />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

