"use client"

interface RankingsTabsProps {
  activeTab: "global" | "per-game"
  onTabChange: (tab: "global" | "per-game") => void
}

export function RankingsTabs({ activeTab, onTabChange }: RankingsTabsProps) {
  const tabs = [
    { id: "global" as const, label: "Global", icon: "🌍" },
    { id: "per-game" as const, label: "Por Jogo", icon: "🎮" },
  ]

  return (
    <div className="mb-6">
      <div className="
        flex items-center gap-2
        p-1
        bg-page-secondary
        border border-border
        rounded-lg
      ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1
              inline-flex items-center justify-center gap-2
              px-4 py-2.5
              rounded-md
              text-sm font-medium
              transition-all duration-200
              ${
                activeTab === tab.id
                  ? "bg-primary text-page shadow-glow-sm"
                  : "text-text hover:bg-page hover:text-primary"
              }
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

