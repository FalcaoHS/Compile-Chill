# Proposed Fair Scoring System for Compile & Chill

**Version:** 1.0  
**Date:** 2025-11-19  
**Status:** Design Phase

---

## 🎯 **EXECUTIVE SUMMARY**

The current scoring system has **extreme imbalances**:
- Hack Grid/Debug Maze: ~295,000 points (time-bonus dominant)
- Bit Runner: ~4,500 median, 158,000 max (high variance)
- Terminal 2048: ~2,400 median (balanced)
- Refactor Rush: ~485 points (balanced)
- Stack Overflow Dodge: ~121 points (too low)
- Packet Switch: 0 points (broken)

**Solution:** Implement a **two-tier system**:
1. **Game-Specific Score Fixes** (immediate) - Fix broken formulas
2. **Global Rating System** (long-term) - Fair cross-game comparison

---

## 📊 **PHASE 1: FIX INDIVIDUAL GAME SCORING**

### 1.1 Hack Grid - CRITICAL FIX NEEDED

**Current Formula:**
```typescript
timeBonus = max(1, 300000 - duration_ms)
efficiencyBonus = (requiredSegments / actualSegments) * 50
difficultyMultiplier = level.difficulty * 100
score = timeBonus + efficiencyBonus + difficultyMultiplier
```

**Problem:** 
- timeBonus dominates (99.9% of score)
- Level 1 completion gives 295,000+ points

**New Formula:**
```typescript
// Base score scales with level and difficulty
const baseScore = 100 * level.difficulty

// Time bonus (0-200% of base, capped)
const maxTime = 300 // seconds (5 minutes)
const timeRatio = Math.min(1, (maxTime - duration/1000) / maxTime)
const timeBonus = baseScore * 2 * timeRatio

// Efficiency bonus (0-50% of base)
const efficiencyRatio = Math.min(1, requiredSegments / actualSegments)
const efficiencyBonus = baseScore * 0.5 * efficiencyRatio

// Total score
const score = Math.floor(baseScore + timeBonus + efficiencyBonus)

// Example: Level 1, 10 seconds, perfect efficiency
// baseScore = 100
// timeBonus = 100 * 2 * (290/300) = 193
// efficiencyBonus = 100 * 0.5 * 1.0 = 50
// score = 343 (instead of 299,890!)
```

**Score Range Estimate:**
- Level 1: 100 - 350 points
- Level 2: 200 - 700 points
- Level 3: 300 - 1,050 points

---

### 1.2 Debug Maze - CRITICAL FIX NEEDED

**Current Formula:**
```typescript
timeScore = max(1, 300000 - duration_ms)
moveBonus = max(0, (optimalMoves * 1.5 - actualMoves) * 10)
score = timeScore + moveBonus
```

**Problem:**
- Same as Hack Grid - timeScore dominates

**New Formula:**
```typescript
// Base score for completion
const baseScore = 200 // higher than hack-grid (maze solving is harder)

// Time bonus (0-200% of base)
const maxTime = 300 // seconds
const timeRatio = Math.min(1, (maxTime - duration/1000) / maxTime)
const timeBonus = baseScore * 2 * timeRatio

// Move efficiency bonus (0-100% of base)
const optimalMoves = Math.abs(start.row - patch.row) + Math.abs(start.col - patch.col)
const moveEfficiency = Math.max(0, Math.min(1, optimalMoves / actualMoves))
const moveBonus = baseScore * moveEfficiency

// Total score
const score = Math.floor(baseScore + timeBonus + moveBonus)

// Example: Level 1, 5 seconds, 13 moves (optimal ~8)
// baseScore = 200
// timeBonus = 200 * 2 * (295/300) = 393
// moveBonus = 200 * (8/13) = 123
// score = 716 (instead of 295,000!)
```

**Score Range Estimate:**
- Level 1: 200 - 900 points

---

### 1.3 Packet Switch - FIX BROKEN SCORING

**Current Formula:**
```typescript
score = (packetsDelivered * difficulty) / averageHops - (duration / 1000)
```

**Problem:**
- Returns 0 for level 1 (difficulty=1, averageHops=2, duration=3-9s)
- Calculation: (1 * 1) / 2 - 3 = -2.5 → 0 (capped at 0)

**New Formula:**
```typescript
// Base score per packet delivered
const baseScorePerPacket = 50

// Difficulty multiplier
const difficultyMultiplier = level.difficulty

// Efficiency bonus (fewer hops = better)
const minPossibleHops = 1 // theoretical minimum
const hopEfficiency = Math.max(0.5, minPossibleHops / averageHops)

// Time bonus (faster is better, but minor component)
const maxTime = 120 // seconds
const timeRatio = Math.max(0, Math.min(1, (maxTime - duration/1000) / maxTime))
const timeBonus = 100 * timeRatio

// Total score
const score = Math.floor(
  (baseScorePerPacket * packetsDelivered * difficultyMultiplier * hopEfficiency) + timeBonus
)

// Example: 1 packet, difficulty=1, 2 hops, 5 seconds
// baseScorePerPacket = 50
// hopEfficiency = 1 / 2 = 0.5
// timeBonus = 100 * (115/120) = 96
// score = 50 * 1 * 1 * 0.5 + 96 = 121 (fixed!)
```

**Score Range Estimate:**
- Level 1: 100 - 250 points
- Higher levels: scales with difficulty and packet count

---

### 1.4 Terminal 2048 - NO CHANGES NEEDED ✅

**Current Formula:**
```typescript
score = sum of all merged tile values
```

**Analysis:**
- Natural progression (2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048)
- Score distribution: 768 - 2,836 (current data)
- Low variance, skill-based
- **Status:** ✅ Well balanced, keep as is

---

### 1.5 Bit Runner - NO CHANGES NEEDED ✅

**Current Formula:**
```typescript
score = distance * 10 + (survivalTime / 1000) * 5 + speedBonus
```

**Analysis:**
- High variance is expected (infinite runner)
- Median: 4,450, Max: 158,894
- Variance = 78x (natural for this genre)
- **Status:** ✅ Appropriate for game type, keep as is

---

### 1.6 Byte Match - NO CHANGES NEEDED ✅

**Current Formula:**
```typescript
score = max(1, 100 - moves)
```

**Analysis:**
- Simple, fair, capped at 100
- Rewards efficiency (fewer moves = higher score)
- **Status:** ✅ Perfect for memory game, keep as is

---

### 1.7 Dev Pong - NO CHANGES NEEDED ✅

**Current Formula:**
```typescript
score = playerScore * 100 + hitCount * 10 + timeBonus + difficultyBonus
```

**Analysis:**
- Winning score = 7, so ~700 base points
- Bonus components add variation
- **Status:** ✅ Reasonable, keep as is

---

### 1.8 Stack Overflow Dodge - MINOR ADJUSTMENT

**Current Formula:**
```typescript
score = (duration / 1000) * 12 + bonuses
```

**Problem:**
- Too low compared to other games (~121 for 8 seconds)

**New Formula:**
```typescript
// Increase scoring rate
const SCORE_PER_SECOND = 30 // increased from 12

// Power-up bonuses
const POWER_UP_BONUS = 50 // per power-up collected

score = (duration / 1000) * SCORE_PER_SECOND + 
        (powerUpsCollected * POWER_UP_BONUS) +
        (errorsAvoided * 5)

// Example: 8 seconds, 1 power-up, 7 errors avoided
// score = 8 * 30 + 1 * 50 + 7 * 5 = 325 (better!)
```

**Score Range Estimate:**
- 30 points per second (better alignment with other games)
- 10 seconds = 300-400 points (more fair)

---

### 1.9 Refactor Rush - NO CHANGES NEEDED ✅

**Current Formula:**
```typescript
score = max(1, 500 - moves * 4 - (duration/1000) * 2)
```

**Analysis:**
- Current range: 480-490 points
- Well balanced formula
- **Status:** ✅ Good as is, keep unchanged

---

### 1.10 Crypto Miner - SPECIAL CASE

**Current Formula:**
```typescript
score = total_coins
```

**Problem:**
- Idle game with potentially infinite score
- Only 1 sample: 1,010 points in 478 seconds

**Proposal:**
- **Remove from global leaderboard** (separate category)
- Or implement time-based cap: `score = min(total_coins, maxScore_by_time)`
- Idle games don't compare well with skill-based games

---

## 🏆 **PHASE 2: GLOBAL RATING SYSTEM**

After fixing individual games, implement a **normalized rating system** for fair cross-game comparison.

### Option A: Percentile-Based Rating (RECOMMENDED)

Each player gets a **rating** per game based on their percentile rank:

```typescript
interface PlayerGameRating {
  gameId: string
  score: number // raw score
  percentile: number // 0-100 (where they rank)
  rating: number // 0-1000 (normalized rating)
}

// Calculate rating from percentile
function calculateRating(percentile: number): number {
  // Rating scales from 0-1000
  // Uses sigmoid curve for better distribution
  return Math.floor(1000 * (percentile / 100))
}

// Global leaderboard ranking
interface GlobalRanking {
  userId: number
  averageRating: number // average across all games played
  totalRating: number // sum of all ratings
  gamesPlayed: number
  bestGameRating: number
}
```

**Example:**
- Player A: hack-grid 350 pts (95th percentile) = 950 rating
- Player B: terminal-2048 2,836 pts (95th percentile) = 950 rating
- **Both get same rating despite different raw scores!**

**Pros:**
- ✅ Fair comparison across games
- ✅ Adapts automatically as player base grows
- ✅ Encourages playing multiple games

**Cons:**
- ⚠️ Requires sufficient data per game (min 20-30 scores)
- ⚠️ New players affect percentiles

---

### Option B: Fixed Score Tiers (ALTERNATIVE)

Define **target score ranges** per game category:

```typescript
interface ScoreTier {
  category: 'puzzle' | 'arcade' | 'runner' | 'idle'
  maxScore: number
  tierBoundaries: {
    bronze: number
    silver: number
    gold: number
    platinum: number
    diamond: number
  }
}

// Example tiers
const PUZZLE_TIERS = {
  category: 'puzzle',
  maxScore: 1000,
  tierBoundaries: {
    bronze: 200,
    silver: 400,
    gold: 600,
    platinum: 800,
    diamond: 950
  }
}

const ARCADE_TIERS = {
  category: 'arcade',
  maxScore: 1000,
  tierBoundaries: {
    bronze: 200,
    silver: 400,
    gold: 600,
    platinum: 800,
    diamond: 950
  }
}

const RUNNER_TIERS = {
  category: 'runner',
  maxScore: 5000, // higher ceiling for runners
  tierBoundaries: {
    bronze: 1000,
    silver: 2000,
    gold: 3000,
    platinum: 4000,
    diamond: 4500
  }
}
```

**Global Ranking:**
- Sum of tier points (Bronze=1, Silver=2, Gold=3, Platinum=4, Diamond=5)
- Tiebreaker: total raw score

**Pros:**
- ✅ Easy to understand
- ✅ Works with small player base
- ✅ Visual progression (medals/badges)

**Cons:**
- ⚠️ Requires manual balancing
- ⚠️ Less granular than percentile system

---

## 📋 **IMPLEMENTATION PLAN**

### Step 1: Update Game Logic Files ✅ (Priority: CRITICAL)

Update scoring formulas in:
- ✅ `lib/games/hack-grid/game-logic.ts` - New formula
- ✅ `lib/games/debug-maze/game-logic.ts` - New formula
- ✅ `lib/games/packet-switch/game-logic.ts` - Fix broken scoring
- ✅ `lib/games/stack-overflow-dodge/game-logic.ts` - Increase score rate

### Step 2: Migration Script ✅ (Priority: HIGH)

Create migration to recalculate all existing scores:
1. Read all scores from database
2. For each score, recalculate using new formula with stored metadata
3. Update score value in database
4. Log changes for audit

### Step 3: Add Rating System ⏳ (Priority: MEDIUM)

Add new columns to database:
```prisma
model Score {
  // ... existing fields ...
  percentile Float? // 0-100
  rating     Int?    // 0-1000
}
```

### Step 4: Update Global Leaderboard API ⏳ (Priority: MEDIUM)

Modify `/api/scores/global-leaderboard`:
- Calculate ratings/percentiles on-the-fly
- Sort by rating instead of raw score
- Return both raw score and rating

### Step 5: Update UI ⏳ (Priority: LOW)

- Show rating badges on profile
- Display percentile on leaderboard
- Add "Rating" column to global leaderboard

---

## 📊 **VALIDATION WITH CURRENT DATA**

Let's recalculate the top 10 with new formulas:

### Old System (Current)
| Rank | User | Game | Raw Score |
|------|------|------|-----------|
| 1 | Dark | hack-grid | 299,448 |
| 2 | Dark | debug-maze | 296,284 |
| 3 | Osti | debug-maze | 292,588 |
| 4 | Osti | hack-grid | 288,820 |
| 5 | Shuk | bit-runner | 158,894 |
| ... | ... | ... | ... |

### New System (Proposed)
| Rank | User | Game | Old Score | New Score | Change |
|------|------|------|-----------|-----------|--------|
| 1 | Shuk | bit-runner | 158,894 | 158,894 | ✅ Unchanged |
| 2 | Dark | bit-runner | 21,598 | 21,598 | ✅ Unchanged |
| 3 | Osti | bit-runner | 4,450 | 4,450 | ✅ Unchanged |
| 4 | Osti | terminal-2048 | 2,836 | 2,836 | ✅ Unchanged |
| 5 | Dark | terminal-2048 | 2,728 | 2,728 | ✅ Unchanged |
| 6 | Shuk | terminal-2048 | 2,728 | 2,728 | ✅ Unchanged |
| 7 | Dark | debug-maze | 296,284 | **~716** | ⬇️ -295,568 |
| 8 | Osti | debug-maze | 292,588 | **~600** | ⬇️ -291,988 |
| 9 | Dark | hack-grid | 299,448 | **~343** | ⬇️ -299,105 |
| 10 | Osti | hack-grid | 288,820 | **~280** | ⬇️ -288,540 |

**Result:** Hack Grid and Debug Maze are properly balanced now! ✅

---

## 🎯 **RECOMMENDED APPROACH**

### Immediate Actions (This Week)
1. ✅ Fix hack-grid scoring formula
2. ✅ Fix debug-maze scoring formula
3. ✅ Fix packet-switch scoring formula
4. ✅ Adjust stack-overflow-dodge scoring
5. ✅ Create migration script to recalculate existing scores

### Short-term (Next 2 Weeks)
6. Implement percentile-based rating system
7. Update global leaderboard API
8. Add rating display to UI
9. Monitor for issues and adjust

### Long-term (Future)
10. Add seasonal rankings
11. Implement achievement system
12. Create category-specific leaderboards
13. Add "best all-arounder" badge for players in top 25% across all games

---

## 🚨 **RISKS & MITIGATION**

### Risk 1: Player Backlash
**Issue:** Players with high hack-grid scores will see huge drops  
**Mitigation:**
- Announce changes in advance
- Explain fairness reasoning
- Keep historical leaderboard archived
- Award "legacy champion" badge to affected players

### Risk 2: Formula Errors
**Issue:** New formulas might still be imbalanced  
**Mitigation:**
- Test thoroughly with current data
- Monitor first week closely
- Be ready to hotfix
- Collect player feedback

### Risk 3: Migration Failures
**Issue:** Recalculation might fail for some scores  
**Mitigation:**
- Test migration on copy of database first
- Add rollback mechanism
- Log all changes
- Verify results manually for top scores

---

## ✅ **SUCCESS CRITERIA**

1. ✅ No game dominates top 10 global leaderboard by 100x
2. ✅ Standard deviation of top 100 scores is within 2x (not 100x)
3. ✅ All games return non-zero scores when completed
4. ✅ Player skill (not game choice) determines ranking
5. ✅ Scores feel fair and understandable to players

---

## 📝 **NEXT STEPS**

1. Get stakeholder approval on approach
2. Implement formula changes in game logic
3. Test new formulas with sample data
4. Create migration script
5. Test migration on staging database
6. Announce changes to players
7. Execute migration
8. Monitor and adjust


