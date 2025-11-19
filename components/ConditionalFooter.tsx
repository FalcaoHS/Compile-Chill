"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./Footer"

/**
 * Conditional Footer Component
 * 
 * Renders the Footer on all pages EXCEPT:
 * - Individual game pages (/jogos/[game-name])
 * 
 * This provides a cleaner, more immersive gaming experience
 * without distractions at the bottom of the screen.
 */
export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't render footer on individual game pages
  // Game pages match pattern: /jogos/[game-name]
  // But DO render on /jogos (game list page)
  const isGamePage = pathname.startsWith('/jogos/') && pathname !== '/jogos/'
  
  if (isGamePage) {
    return null
  }
  
  return <Footer />
}

