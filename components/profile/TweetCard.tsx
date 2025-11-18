"use client"

import { useThemeStore } from "@/lib/theme-store"
import { motion } from "framer-motion"

interface TweetCardProps {
  id: string
  text: string
  createdAt: string
  metrics: {
    likes: number
    retweets: number
    replies: number
  }
}

// Format date to relative time (e.g., "2h ago", "3d ago")
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "agora"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d`
  } else {
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    })
  }
}

// Format tweet text with links and mentions
function formatTweetText(text: string): React.ReactNode {
  // Split text by URLs, mentions, and hashtags
  const parts: Array<{ type: "text" | "link" | "mention" | "hashtag"; content: string }> = []
  let remaining = text

  // Match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g
  // Match mentions (@username)
  const mentionRegex = /@(\w+)/g
  // Match hashtags (#hashtag)
  const hashtagRegex = /#(\w+)/g

  // Extract URLs
  const urlMatches = [...remaining.matchAll(urlRegex)]
  urlMatches.forEach((match) => {
    const before = remaining.substring(0, match.index)
    if (before) {
      parts.push({ type: "text", content: before })
    }
    parts.push({ type: "link", content: match[0] })
    remaining = remaining.substring((match.index || 0) + match[0].length)
  })

  // If no URLs, process mentions and hashtags
  if (parts.length === 0) {
    remaining = text
    const allMatches: Array<{ index: number; type: "mention" | "hashtag"; content: string }> = []

    // Collect all mentions
    ;[...remaining.matchAll(mentionRegex)].forEach((match) => {
      allMatches.push({
        index: match.index || 0,
        type: "mention",
        content: match[0],
      })
    })

    // Collect all hashtags
    ;[...remaining.matchAll(hashtagRegex)].forEach((match) => {
      allMatches.push({
        index: match.index || 0,
        type: "hashtag",
        content: match[0],
      })
    })

    // Sort by index
    allMatches.sort((a, b) => a.index - b.index)

    let lastIndex = 0
    allMatches.forEach((match) => {
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: remaining.substring(lastIndex, match.index),
        })
      }
      parts.push({ type: match.type, content: match.content })
      lastIndex = match.index + match.content.length
    })

    if (lastIndex < remaining.length) {
      parts.push({ type: "text", content: remaining.substring(lastIndex) })
    }
  } else {
    // Add remaining text after URLs
    if (remaining) {
      parts.push({ type: "text", content: remaining })
    }
  }

  // If no special formatting needed, return plain text
  if (parts.length === 0) {
    return <span>{text}</span>
  }

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "link") {
          return (
            <a
              key={index}
              href={part.content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {part.content}
            </a>
          )
        } else if (part.type === "mention") {
          return (
            <span key={index} className="text-accent font-medium">
              {part.content}
            </span>
          )
        } else if (part.type === "hashtag") {
          return (
            <span key={index} className="text-accent-secondary font-medium">
              {part.content}
            </span>
          )
        } else {
          return <span key={index}>{part.content}</span>
        }
      })}
    </>
  )
}

export function TweetCard({ id, text, createdAt, metrics }: TweetCardProps) {
  const { theme } = useThemeStore()

  const tweetUrl = `https://twitter.com/i/web/status/${id}`

  // Theme-specific styling
  const themeStyles = {
    cyber: "border-cyber-accent shadow-cyber-glow",
    pixel: "border-pixel-accent shadow-pixel-glow",
    neon: "border-neon-accent shadow-neon-glow",
    terminal: "border-terminal-accent shadow-terminal-glow",
    blueprint: "border-blueprint-accent shadow-blueprint-glow",
  }

  const borderStyle = themeStyles[theme as keyof typeof themeStyles] || themeStyles.cyber

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        p-4 sm:p-6
        bg-page-secondary
        border-2 ${borderStyle}
        rounded-lg
        hover:shadow-glow-md
        transition-all duration-300
      `}
    >
      {/* Tweet Text */}
      <div className="mb-4">
        <p className="text-text text-base sm:text-lg leading-relaxed">
          {formatTweetText(text)}
        </p>
      </div>

      {/* Tweet Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-text-secondary">
        <div className="flex items-center gap-4">
          {/* Likes */}
          <div className="flex items-center gap-1">
            <span className="text-accent">❤️</span>
            <span>{metrics.likes > 0 ? metrics.likes.toLocaleString("pt-BR") : "0"}</span>
          </div>

          {/* Retweets */}
          <div className="flex items-center gap-1">
            <span className="text-accent">🔄</span>
            <span>{metrics.retweets > 0 ? metrics.retweets.toLocaleString("pt-BR") : "0"}</span>
          </div>

          {/* Replies */}
          <div className="flex items-center gap-1">
            <span className="text-accent">💬</span>
            <span>{metrics.replies > 0 ? metrics.replies.toLocaleString("pt-BR") : "0"}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>{formatRelativeTime(createdAt)}</span>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-accent
              hover:text-accent-hover
              hover:underline
              transition-colors
            "
            aria-label="Ver tweet no X"
          >
            ↗️
          </a>
        </div>
      </div>
    </motion.div>
  )
}

