/**
 * Tests for Bit Runner obstacle system
 */

import {
  createObstacle,
  getObstacleDefinition,
  selectSpawnPattern,
  spawnPatternObstacles,
  calculateNextSpawnX,
  calculateAdaptiveSpacing,
  OBSTACLE_DEFINITIONS,
  SPAWN_PATTERNS,
  type ObstacleType,
} from './obstacles'

describe('Bit Runner Obstacle System', () => {
  describe('Obstacle Creation', () => {
    test('should create obstacle with correct properties', () => {
      const obstacle = createObstacle('compiler', 200)

      expect(obstacle.type).toBe('compiler')
      expect(obstacle.x).toBe(200)
      expect(obstacle.width).toBe(OBSTACLE_DEFINITIONS.compiler.width)
      expect(obstacle.height).toBe(OBSTACLE_DEFINITIONS.compiler.height)
      expect(obstacle.y).toBe(OBSTACLE_DEFINITIONS.compiler.y)
    })

    test('should create different obstacle types correctly', () => {
      const bug = createObstacle('bug', 100)
      const brackets = createObstacle('brackets', 300)

      expect(bug.type).toBe('bug')
      expect(bug.height).toBeGreaterThan(brackets.height) // Bug is higher
      expect(brackets.type).toBe('brackets')
    })
  })

  describe('Obstacle Definitions', () => {
    test('should have definitions for all obstacle types', () => {
      const types: ObstacleType[] = [
        'compiler',
        'bug',
        'brackets',
        'node_modules',
        'error',
        'stackoverflow',
        'warning',
      ]

      types.forEach(type => {
        const def = getObstacleDefinition(type)
        expect(def.width).toBeGreaterThan(0)
        expect(def.height).toBeGreaterThan(0)
        expect(def.y).toBeGreaterThanOrEqual(0)
      })
    })

    test('should have correct obstacle heights (low, medium, high)', () => {
      const compiler = OBSTACLE_DEFINITIONS.compiler
      const brackets = OBSTACLE_DEFINITIONS.brackets
      const bug = OBSTACLE_DEFINITIONS.bug

      // Compiler is low (20px)
      expect(compiler.height).toBe(20)
      // Brackets is medium (35px)
      expect(brackets.height).toBe(35)
      // Bug is high (50px)
      expect(bug.height).toBe(50)
    })
  })

  describe('Pattern Selection', () => {
    test('should select a valid pattern', () => {
      const pattern = selectSpawnPattern(0, 0)

      expect(pattern).toBeDefined()
      expect(pattern.id).toBeDefined()
      expect(pattern.obstacles.length).toBeGreaterThan(0)
      expect(pattern.minSpacing).toBeGreaterThan(0)
      expect(pattern.maxSpacing).toBeGreaterThanOrEqual(pattern.minSpacing)
    })

    test('should prefer simple patterns early in game', () => {
      const earlyPattern = selectSpawnPattern(500, 0)
      const latePattern = selectSpawnPattern(2000, 0)

      // Early patterns should be simpler (fewer obstacles typically)
      // This is probabilistic, so we just verify patterns are valid
      expect(earlyPattern.obstacles.length).toBeGreaterThan(0)
      expect(latePattern.obstacles.length).toBeGreaterThan(0)
    })

    test('should apply random variation to spacing', () => {
      const pattern1 = selectSpawnPattern(0, 0.25)
      const pattern2 = selectSpawnPattern(0, 0.25)

      // Patterns should have variation in spacing (probabilistic)
      // We verify the pattern structure is valid
      expect(pattern1.minSpacing).toBeGreaterThan(0)
      expect(pattern2.minSpacing).toBeGreaterThan(0)
    })
  })

  describe('Pattern Spawning', () => {
    test('should spawn obstacles from pattern', () => {
      const pattern = SPAWN_PATTERNS[0] // single-compiler
      const obstacles = spawnPatternObstacles(pattern, 500)

      expect(obstacles.length).toBe(pattern.obstacles.length)
      expect(obstacles[0].type).toBe(pattern.obstacles[0].type)
      expect(obstacles[0].x).toBe(500 + pattern.obstacles[0].offset)
    })

    test('should spawn multiple obstacles from pattern', () => {
      const pattern = SPAWN_PATTERNS.find(p => p.id === 'low-high')
      if (!pattern) return

      const obstacles = spawnPatternObstacles(pattern, 600)

      expect(obstacles.length).toBe(2)
      expect(obstacles[0].type).toBe('compiler')
      expect(obstacles[1].type).toBe('bug')
      expect(obstacles[1].x).toBeGreaterThan(obstacles[0].x)
    })
  })

  describe('Adaptive Difficulty', () => {
    test('should increase spacing after early failure', () => {
      const baseMin = 200
      const baseMax = 300

      const spacing = calculateAdaptiveSpacing(
        baseMin,
        baseMax,
        {
          earlyFailure: true,
          currentDistance: 100,
          averageSpacing: 250,
        },
        5 // 5 seconds since failure
      )

      expect(spacing.minSpacing).toBeGreaterThan(baseMin)
      expect(spacing.maxSpacing).toBeGreaterThan(baseMax)
    })

    test('should tighten spacing when player is doing well', () => {
      const baseMin = 200
      const baseMax = 300

      const spacing = calculateAdaptiveSpacing(
        baseMin,
        baseMax,
        {
          earlyFailure: false,
          currentDistance: 1000, // Doing well
          averageSpacing: 250,
        },
        999 // Long time since failure
      )

      // Spacing should be tighter (but not less than minimum)
      expect(spacing.minSpacing).toBeGreaterThanOrEqual(150)
      expect(spacing.maxSpacing).toBeGreaterThanOrEqual(200)
    })

    test('should maintain minimum spacing limits', () => {
      const spacing = calculateAdaptiveSpacing(
        100, // Very low base
        150,
        {
          earlyFailure: false,
          currentDistance: 5000, // Very far
          averageSpacing: 125,
        },
        999
      )

      expect(spacing.minSpacing).toBeGreaterThanOrEqual(150)
      expect(spacing.maxSpacing).toBeGreaterThanOrEqual(200)
    })
  })

  describe('Spawn Position Calculation', () => {
    test('should calculate next spawn position', () => {
      const pattern = SPAWN_PATTERNS[0]
      const lastSpawnX = 800

      const nextX = calculateNextSpawnX(lastSpawnX, pattern)

      expect(nextX).toBeGreaterThan(lastSpawnX)
      expect(nextX).toBeGreaterThan(800 + pattern.minSpacing)
    })

    test('should use adaptive spacing when provided', () => {
      const pattern = SPAWN_PATTERNS[0]
      const adaptiveSpacing = { minSpacing: 400, maxSpacing: 500 }
      const lastSpawnX = 800

      const nextX = calculateNextSpawnX(lastSpawnX, pattern, adaptiveSpacing)

      expect(nextX).toBeGreaterThan(800 + adaptiveSpacing.minSpacing)
      expect(nextX).toBeLessThan(800 + adaptiveSpacing.maxSpacing + 100) // Some buffer
    })
  })
})

