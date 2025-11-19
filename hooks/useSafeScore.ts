/**
 * useSafeScore Hook
 * 
 * Hook for safely submitting scores with automatic retry and localStorage backup.
 */

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
  addPendingScore,
  processAllPendingScores,
  isQueueFull,
  getQueueSize,
} from '@/lib/performance/safe-score'
import { showToast } from '@/components/Toast'
import { logScoreSaveFailure } from '@/lib/performance/light-logging'

interface SubmitScoreData {
  gameId: string
  score: number
  duration?: number | null
  moves?: number | null
  level?: number | null
  metadata?: Record<string, any> | null
  gameState?: Record<string, any> | null
}

interface UseSafeScoreReturn {
  submitScore: (data: SubmitScoreData) => Promise<boolean>
  processPendingScores: () => Promise<void>
  isQueueFull: () => boolean
  getQueueSize: () => number
}

export function useSafeScore(): UseSafeScoreReturn {
  const { data: session } = useSession()

  /**
   * Submit score safely (with localStorage backup)
   */
  const submitScore = useCallback(
    async (data: SubmitScoreData): Promise<boolean> => {
      // Always save to localStorage first
      addPendingScore(data)

      // If user is authenticated, try to submit immediately
      if (session?.user) {
        try {
          const response = await fetch('/api/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              gameId: data.gameId,
              score: data.score,
              duration: data.duration,
              moves: data.moves,
              level: data.level,
              metadata: data.metadata,
              gameState: data.gameState,
            }),
          })

          if (response.ok) {
            // Success - remove from pending queue
            const { removePendingScore } = require('@/lib/performance/safe-score')
            // Find and remove the pending score we just added
            const pendingScores = require('@/lib/performance/safe-score').getPendingScores()
            const latest = pendingScores[pendingScores.length - 1]
            if (latest) {
              removePendingScore(latest.id)
            }
            return true
          } else if (response.status === 401) {
            // Session expired - score is already in localStorage, will retry later
            logScoreSaveFailure(data.gameId, 1)
            showToast('Sua pontuação será enviada quando você entrar novamente.', 'info')
            return false
          } else {
            // Other error - score is already in localStorage, will retry later
            logScoreSaveFailure(data.gameId, 1)
            showToast('Sua pontuação será enviada quando você entrar novamente.', 'warning')
            return false
          }
        } catch (error) {
          // Network error - score is already in localStorage, will retry later
          
          logScoreSaveFailure(data.gameId, 1)
          showToast('Sua pontuação será enviada quando você entrar novamente.', 'warning')
          return false
        }
      } else {
        // Not authenticated - score is in localStorage, will submit on login
        showToast('Sua pontuação será enviada quando você entrar novamente.', 'info')
        return false
      }
    },
    [session]
  )

  /**
   * Process all pending scores
   */
  const processPendingScores = useCallback(async () => {
    if (!session?.user) return

    const result = await processAllPendingScores()
    
    if (result.processed > 0) {
      showToast('Pontuação pendente enviada com sucesso!', 'success')
    }
    
    // Check if queue is full
    if (isQueueFull()) {
      showToast('Muitas pontuações pendentes. Considere baixar seus dados.', 'warning', 8000)
    }
  }, [session])

  return {
    submitScore,
    processPendingScores,
    isQueueFull: () => isQueueFull(),
    getQueueSize: () => getQueueSize(),
  }
}

