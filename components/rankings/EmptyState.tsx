"use client"

import Link from "next/link"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="
      p-8 sm:p-12
      bg-page-secondary
      border-2 border-border
      rounded-lg
      text-center
    ">
      <div className="mb-4 text-6xl">🏆</div>
      <h3 className="text-xl font-bold text-text mb-2 font-theme">
        Nenhum Score Registrado
      </h3>
      <p className="text-text-secondary mb-6">
        {message || "Seja o primeiro a aparecer no ranking! Comece a jogar agora."}
      </p>
      <Link
        href="/"
        className="
          inline-flex items-center gap-2
          px-6 py-3
          bg-primary
          text-page
          font-bold
          rounded-lg
          shadow-glow
          hover:shadow-glow-lg
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        "
      >
        <span>🎮</span>
        <span>Ir para Jogos</span>
      </Link>
    </div>
  )
}

