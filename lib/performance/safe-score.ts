/**
 * Safe Score System
 * 
 * Protects scores from loss due to network issues, session expiration, or errors.
 * Implements:
 * - localStorage pending score queue
 * - Retry policy with exponential backoff (1s, 2s, 4s, 8s, 16s)
 * - Score expiration (30 days)
 * - Toast notifications for failures and successes
 * - Automatic processing on login/home load
 * - Queue management (warns when > 5 items)
 */

export interface PendingScore {
  id: string
  gameId: string
  score: number
  duration?: number | null
  moves?: number | null
  level?: number | null
  metadata?: Record<string, any> | null
  timestamp: number
  attemptCount: number
  lastAttemptTime: number
}

const STORAGE_KEY = 'pendingScores'
const MAX_ATTEMPTS = 5
const EXPIRATION_DAYS = 30
const MAX_QUEUE_SIZE = 5
const BACKOFF_DELAYS = [1000, 2000, 4000, 8000, 16000] // 1s, 2s, 4s, 8s, 16s

/**
 * Get all pending scores from localStorage
 */
export function getPendingScores(): PendingScore[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const scores: PendingScore[] = JSON.parse(stored)
    
    // Filter out expired scores
    const now = Date.now()
    const expirationMs = EXPIRATION_DAYS * 24 * 60 * 60 * 1000
    const validScores = scores.filter(score => {
      const age = now - score.timestamp
      return age < expirationMs
    })
    
    // Update localStorage if expired scores were removed
    if (validScores.length !== scores.length) {
      savePendingScores(validScores)
    }
    
    return validScores
  } catch (error) {
    console.error('Error reading pending scores:', error)
    return []
  }
}

/**
 * Save pending scores to localStorage
 */
function savePendingScores(scores: PendingScore[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch (error) {
    console.error('Error saving pending scores:', error)
  }
}

/**
 * Add a score to the pending queue
 */
export function addPendingScore(scoreData: {
  gameId: string
  score: number
  duration?: number | null
  moves?: number | null
  level?: number | null
  metadata?: Record<string, any> | null
}): string {
  const pendingScore: PendingScore = {
    id: `pending-${Date.now()}-${Math.random()}`,
    gameId: scoreData.gameId,
    score: scoreData.score,
    duration: scoreData.duration,
    moves: scoreData.moves,
    level: scoreData.level,
    metadata: scoreData.metadata,
    timestamp: Date.now(),
    attemptCount: 0,
    lastAttemptTime: 0,
  }
  
  const scores = getPendingScores()
  scores.push(pendingScore)
  savePendingScores(scores)
  
  return pendingScore.id
}

/**
 * Remove a pending score from the queue
 */
export function removePendingScore(id: string): void {
  const scores = getPendingScores()
  const filtered = scores.filter(score => score.id !== id)
  savePendingScores(filtered)
}

/**
 * Update attempt count and last attempt time
 */
function updatePendingScoreAttempt(id: string): void {
  const scores = getPendingScores()
  const score = scores.find(s => s.id === id)
  if (score) {
    score.attemptCount++
    score.lastAttemptTime = Date.now()
    savePendingScores(scores)
  }
}

/**
 * Submit a score to the API
 */
async function submitScore(score: PendingScore): Promise<boolean> {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        gameId: score.gameId,
        score: score.score,
        duration: score.duration,
        moves: score.moves,
        level: score.level,
        metadata: score.metadata,
      }),
    })
    
    if (!response.ok) {
      // Check if it's an authentication error
      if (response.status === 401) {
        // Session expired, keep score in queue
        return false
      }
      
      // Other errors, will retry
      throw new Error(`Score submission failed: ${response.status}`)
    }
    
    return true
  } catch (error) {
    console.error('Error submitting score:', error)
    return false
  }
}

/**
 * Process a single pending score with retry logic
 */
export async function processPendingScore(score: PendingScore): Promise<boolean> {
  // Check if we should retry (based on attempt count and backoff delay)
  if (score.attemptCount > 0) {
    const delay = BACKOFF_DELAYS[Math.min(score.attemptCount - 1, BACKOFF_DELAYS.length - 1)]
    const timeSinceLastAttempt = Date.now() - score.lastAttemptTime
    
    if (timeSinceLastAttempt < delay) {
      // Not enough time has passed, skip for now
      return false
    }
  }
  
  // Check if max attempts reached
  if (score.attemptCount >= MAX_ATTEMPTS) {
    // Max attempts reached, remove from queue (or mark as failed)
    removePendingScore(score.id)
    return false
  }
  
  // Update attempt count
  updatePendingScoreAttempt(score.id)
  
  // Try to submit
  const success = await submitScore(score)
  
  if (success) {
    // Remove from queue on success
    removePendingScore(score.id)
    return true
  }
  
  return false
}

/**
 * Process all pending scores (FIFO order)
 */
export async function processAllPendingScores(): Promise<{
  processed: number
  failed: number
  total: number
}> {
  const scores = getPendingScores()
  let processed = 0
  let failed = 0
  
  // Process in FIFO order (oldest first)
  const sortedScores = [...scores].sort((a, b) => a.timestamp - b.timestamp)
  
  for (const score of sortedScores) {
    const success = await processPendingScore(score)
    if (success) {
      processed++
    } else {
      failed++
    }
    
    // Add small delay between submissions to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  return {
    processed,
    failed,
    total: scores.length,
  }
}

/**
 * Check if queue is full (> 5 items)
 */
export function isQueueFull(): boolean {
  const scores = getPendingScores()
  return scores.length >= MAX_QUEUE_SIZE
}

/**
 * Get queue size
 */
export function getQueueSize(): number {
  return getPendingScores().length
}

/**
 * Export pending scores as JSON (for download/share)
 */
export function exportPendingScores(): string {
  const scores = getPendingScores()
  return JSON.stringify(scores, null, 2)
}

/**
 * Clear all pending scores (use with caution)
 */
export function clearPendingScores(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Clean up expired scores
 */
export function cleanupExpiredScores(): number {
  const scores = getPendingScores()
  const now = Date.now()
  const expirationMs = EXPIRATION_DAYS * 24 * 60 * 60 * 1000
  
  const validScores = scores.filter(score => {
    const age = now - score.timestamp
    return age < expirationMs
  })
  
  const removedCount = scores.length - validScores.length
  
  if (removedCount > 0) {
    savePendingScores(validScores)
  }
  
  return removedCount
}

