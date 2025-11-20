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
      // PT: Sempre salva no localStorage primeiro (backup caso falhe) | EN: Always save to localStorage first (backup if fails) | ES: Siempre guarda en localStorage primero (respaldo si falla) | FR: Toujours sauvegarder dans localStorage d'abord (sauvegarde si échec) | DE: Immer zuerst in localStorage speichern (Backup bei Fehler)
      addPendingScore(data)

      // PT: Se autenticado, tenta enviar imediatamente | EN: If authenticated, try to submit immediately | ES: Si autenticado, intenta enviar inmediatamente | FR: Si authentifié, essaie d'envoyer immédiatement | DE: Wenn authentifiziert, sofort senden versuchen
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
            // PT: Sucesso - remove da fila pendente (já foi salvo no servidor) | EN: Success - remove from pending queue (already saved on server) | ES: Éxito - quita de cola pendiente (ya guardado en servidor) | FR: Succès - retire de la file d'attente (déjà sauvegardé sur serveur) | DE: Erfolg - aus Warteschlange entfernen (bereits auf Server gespeichert)
            const { removePendingScore } = require('@/lib/performance/safe-score')
            // PT: Encontra e remove o score pendente que acabamos de adicionar | EN: Find and remove the pending score we just added | ES: Encuentra y quita el score pendiente que acabamos de agregar | FR: Trouve et retire le score en attente qu'on vient d'ajouter | DE: Findet und entfernt den soeben hinzugefügten ausstehenden Score
            const pendingScores = require('@/lib/performance/safe-score').getPendingScores()
            const latest = pendingScores[pendingScores.length - 1]
            if (latest) {
              removePendingScore(latest.id)
            }
            return true
          } else if (response.status === 401) {
            // PT: Sessão expirada - score já está no localStorage, tentará depois | EN: Session expired - score already in localStorage, will retry later | ES: Sesión expirada - score ya en localStorage, reintentará después | FR: Session expirée - score déjà dans localStorage, réessayera plus tard | DE: Sitzung abgelaufen - Score bereits in localStorage, wird später erneut versuchen
            logScoreSaveFailure(data.gameId, 1)
            showToast('Sua pontuação será enviada quando você entrar novamente.', 'info')
            return false
          } else {
            // PT: Outro erro - score já está no localStorage, tentará depois | EN: Other error - score already in localStorage, will retry later | ES: Otro error - score ya en localStorage, reintentará después | FR: Autre erreur - score déjà dans localStorage, réessayera plus tard | DE: Anderer Fehler - Score bereits in localStorage, wird später erneut versuchen
            logScoreSaveFailure(data.gameId, 1)
            showToast('Sua pontuação será enviada quando você entrar novamente.', 'warning')
            return false
          }
        } catch (error) {
          // PT: Erro de rede - score já está no localStorage, tentará depois | EN: Network error - score already in localStorage, will retry later | ES: Error de red - score ya en localStorage, reintentará después | FR: Erreur réseau - score déjà dans localStorage, réessayera plus tard | DE: Netzwerkfehler - Score bereits in localStorage, wird später erneut versuchen
          
          logScoreSaveFailure(data.gameId, 1)
          showToast('Sua pontuação será enviada quando você entrar novamente.', 'warning')
          return false
        }
      } else {
        // PT: Não autenticado - score está no localStorage, enviará ao fazer login | EN: Not authenticated - score in localStorage, will submit on login | ES: No autenticado - score en localStorage, enviará al iniciar sesión | FR: Non authentifié - score dans localStorage, enverra à la connexion | DE: Nicht authentifiziert - Score in localStorage, wird bei Anmeldung gesendet
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

