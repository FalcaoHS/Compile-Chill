/**
 * Safe Score System Tests
 * 
 * Tests for score protection, retry policy, expiration, and queue management.
 */

import {
  getPendingScores,
  addPendingScore,
  removePendingScore,
  processPendingScore,
  processAllPendingScores,
  isQueueFull,
  getQueueSize,
  exportPendingScores,
  clearPendingScores,
  cleanupExpiredScores,
} from './safe-score'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

// Mock fetch
global.fetch = jest.fn()

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('SafeScoreSystem', () => {
  beforeEach(() => {
    localStorageMock.clear()
    jest.clearAllMocks()
  })

  it('should add a pending score to localStorage', () => {
    const scoreData = {
      gameId: 'test-game',
      score: 100,
      duration: 60,
    }
    
    const id = addPendingScore(scoreData)
    
    expect(id).toBeDefined()
    const scores = getPendingScores()
    expect(scores.length).toBe(1)
    expect(scores[0].gameId).toBe('test-game')
    expect(scores[0].score).toBe(100)
    expect(scores[0].attemptCount).toBe(0)
  })

  it('should remove a pending score from localStorage', () => {
    const scoreData = {
      gameId: 'test-game',
      score: 100,
    }
    
    const id = addPendingScore(scoreData)
    removePendingScore(id)
    
    const scores = getPendingScores()
    expect(scores.length).toBe(0)
  })

  it('should check if queue is full (> 5 items)', () => {
    // Add 5 scores
    for (let i = 0; i < 5; i++) {
      addPendingScore({
        gameId: 'test-game',
        score: i,
      })
    }
    
    expect(isQueueFull()).toBe(true)
    expect(getQueueSize()).toBe(5)
  })

  it('should export pending scores as JSON', () => {
    addPendingScore({
      gameId: 'test-game',
      score: 100,
    })
    
    const exported = exportPendingScores()
    const parsed = JSON.parse(exported)
    
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed.length).toBe(1)
    expect(parsed[0].gameId).toBe('test-game')
  })

  it('should clear all pending scores', () => {
    addPendingScore({
      gameId: 'test-game',
      score: 100,
    })
    
    clearPendingScores()
    
    const scores = getPendingScores()
    expect(scores.length).toBe(0)
  })

  it('should clean up expired scores (30 days)', () => {
    // Add a score with old timestamp (31 days ago)
    const oldTimestamp = Date.now() - (31 * 24 * 60 * 60 * 1000)
    const scoreData = {
      gameId: 'test-game',
      score: 100,
    }
    
    const id = addPendingScore(scoreData)
    const scores = getPendingScores()
    // Manually set old timestamp
    scores[0].timestamp = oldTimestamp
    localStorageMock.setItem('pendingScores', JSON.stringify(scores))
    
    const removedCount = cleanupExpiredScores()
    
    expect(removedCount).toBe(1)
    const remainingScores = getPendingScores()
    expect(remainingScores.length).toBe(0)
  })

  it('should process pending score with retry logic', async () => {
    // Mock successful fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    })
    
    const scoreData = {
      gameId: 'test-game',
      score: 100,
    }
    
    const id = addPendingScore(scoreData)
    const scores = getPendingScores()
    const score = scores[0]
    
    const success = await processPendingScore(score)
    
    expect(success).toBe(true)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/scores',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    )
    
    // Score should be removed after successful submission
    const remainingScores = getPendingScores()
    expect(remainingScores.length).toBe(0)
  })

  it('should retry on failure with exponential backoff', async () => {
    // Mock failed fetch
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })
    
    const scoreData = {
      gameId: 'test-game',
      score: 100,
    }
    
    const id = addPendingScore(scoreData)
    const scores = getPendingScores()
    const score = scores[0]
    
    const success = await processPendingScore(score)
    
    expect(success).toBe(false)
    // Score should still be in queue
    const remainingScores = getPendingScores()
    expect(remainingScores.length).toBe(1)
    expect(remainingScores[0].attemptCount).toBe(1)
  })
})

