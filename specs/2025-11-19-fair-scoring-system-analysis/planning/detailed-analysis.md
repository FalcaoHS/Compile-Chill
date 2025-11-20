# Detailed Score Analysis - Compile & Chill Games

**Analysis Date:** 2025-11-19  
**Total Best Scores:** 23  
**Games Analyzed:** 8 out of 11 total games

---

## 🚨 **CRITICAL FINDINGS**

### The Imbalance Problem

The current global leaderboard is **severely imbalanced**. Games can be ranked into 3 distinct tiers based on score magnitude:

#### **Tier 1: EXTREME SCORES (290,000 - 300,000 points)**
- **hack-grid**: Mean 294,134 | Range: 288,820 - 299,448
- **debug-maze**: Mean 294,436 | Range: 292,588 - 296,284

#### **Tier 2: HIGH VARIANCE SCORES (120 - 160,000 points)**
- **bit-runner**: Mean 46,743 | Range: 2,028 - 158,894 (78x variance!)
- **terminal-2048**: Mean 2,036 | Range: 768 - 2,836
- **crypto-miner-game**: 1,010 points (only 1 sample)
- **refactor-rush**: Mean 485 | Range: 480 - 490

#### **Tier 3: LOW SCORES (0 - 200 points)**
- **stack-overflow-dodge**: 121 points (only 1 sample)
- **packet-switch**: 0 points (broken scoring?)

### Impact on Global Ranking

**Current top 10 global leaderboard would be:**
1. 299,448 - hack-grid
2. 296,284 - debug-maze  
3. 294,436 - debug-maze
4. 288,820 - hack-grid
5. 158,894 - bit-runner
6. 21,598 - bit-runner
7. 4,450 - bit-runner
8. 2,836 - terminal-2048
9. 2,728 - terminal-2048
10. 2,728 - terminal-2048

**Result:** Players who complete hack-grid or debug-maze level 1 **ONCE** will dominate the leaderboard forever, regardless of skill in other games.

---

## 📊 **DEEP DIVE: HACK GRID**

### Current Scoring Formula

```typescript
timeBonus = max(1, 300000 - duration_ms)
efficiencyBonus = (requiredSegments / actualSegments) * 50
difficultyMultiplier = level.difficulty * 100
score = timeBonus + efficiencyBonus + difficultyMultiplier
```

### Actual Scores Analysis

**Score #1: 299,448 points**
- User: Dark 🏴‍☠️
- Duration: 0ms (likely <1ms, rounded to 0)
- Moves: 2
- Segments: 6
- Level: 1

**Calculation breakdown:**
```
timeBonus = max(1, 300000 - 0) = 300,000
efficiencyBonus = (6 / 6) * 50 = 50 (perfect efficiency)
difficultyMultiplier = 1 * 100 = 100
score = 300,000 + 50 + 100 = 300,150
```
*Actual score was 299,448, suggesting duration was ~552ms*

**Score #2: 288,820 points**
- User: Osti
- Duration: 11ms
- Moves: 3
- Segments: 12

**Calculation breakdown:**
```
timeBonus = max(1, 300000 - 11) = 299,989
efficiencyBonus = (6 / 12) * 50 = 25 (50% efficiency)
difficultyMultiplier = 1 * 100 = 100
score = 299,989 + 25 + 100 = 300,114
```
*Actual was 288,820, suggesting duration was ~11,280ms (11 seconds)*

### The Problem

1. **timeBonus is 99.95% of the score** (300,000 out of 300,150)
2. Level 1 is trivially easy (2-3 moves)
3. **ANY completion under 5 minutes** gives 295,000+ points
4. This is **100x larger** than any other game's typical score

---

## 📊 **DEEP DIVE: DEBUG MAZE**

### Current Scoring Formula

```typescript
// From metadata analysis - similar to hack-grid
timeBonus = max(1, 300000 - duration_ms)
moveEfficiency = some_bonus_based_on_moves
score = timeBonus + moveEfficiency
```

### Actual Scores Analysis

**Score #1: 296,284 points**
- Duration: 3,781ms (~3.8 seconds)
- Moves: 13
- Level: 1

**Score #2: 292,588 points**
- Duration: 7,477ms (~7.5 seconds)
- Moves: 13
- Level: 1

### The Problem

Same issue as hack-grid:
- **timeBonus dominates** (296,000+ points)
- Level 1 completion = instant leaderboard domination
- Both players took same moves (13), but 4-second difference = 3,700 point difference

---

## 📊 **OTHER GAMES ANALYSIS**

### **Bit Runner** (Infinite Runner)
- **Median:** 4,450 points
- **Max:** 158,894 points (outlier, 227 seconds survival)
- **Typical range:** 2,000 - 22,000 points
- **Problem:** High skill ceiling, huge variance

### **Terminal 2048** (Puzzle)
- **Median:** 2,400 points
- **Max:** 2,836 points (best tile: 256)
- **Typical range:** 768 - 2,836 points
- **Status:** ✅ Most balanced game (low variance, skill-based)

### **Refactor Rush** (Puzzle)
- **Median:** 485 points
- **Range:** 480 - 490 points
- **Status:** ✅ Very stable, time-based

### **Stack Overflow Dodge** (Survival)
- **Only score:** 121 points (8.5 seconds survival)
- **Formula:** ~12 points/second
- **Status:** ⚠️ Too low compared to others

### **Crypto Miner** (Idle)
- **Only score:** 1,010 points (478 seconds played)
- **Status:** ⚠️ Unclear scaling, needs more data

### **Packet Switch** (Puzzle)
- **All scores:** 0 points
- **Status:** 🚨 BROKEN SCORING SYSTEM

---

## 🎯 **PROBLEM SUMMARY**

### Score Distribution Comparison

| Game | Mean | Median | Min | Max | Coefficient of Variation |
|------|------|--------|-----|-----|--------------------------|
| hack-grid | 294,134 | 288,820 | 288,820 | 299,448 | **0.018** (very low) |
| debug-maze | 294,436 | 292,588 | 292,588 | 296,284 | **0.006** (very low) |
| bit-runner | 46,743 | 4,450 | 2,028 | 158,894 | **1.39** (VERY HIGH) |
| terminal-2048 | 2,036 | 2,400 | 768 | 2,836 | **0.35** (healthy) |
| refactor-rush | 485 | 480 | 480 | 490 | **0.01** (very low) |
| stack-overflow-dodge | 121 | 121 | 121 | 121 | **0** (only 1 sample) |
| crypto-miner-game | 1,010 | 1,010 | 1,010 | 1,010 | **0** (only 1 sample) |
| packet-switch | 0 | 0 | 0 | 0 | **0** (broken) |

### Key Issues

1. **Magnitude Imbalance:** hack-grid/debug-maze are 100-1000x larger than other games
2. **Formula Issues:** Time-bonus-dominant formulas (hack-grid, debug-maze)
3. **Broken Games:** packet-switch returns 0 score
4. **Missing Games:** No data for byte-match, dev-pong, dev-fifteen-hex
5. **Variance Problems:** bit-runner has 78x variance (min to max)

### Why This Matters

**Current State:**
- A player who completes hack-grid level 1 in 1 second gets 299,000+ points
- A player who masters terminal-2048 and reaches tile 256 gets ~2,800 points
- **The hack-grid player wins by 106x** despite terminal-2048 being much harder

**This creates:**
- Unfair competition
- No incentive to play multiple games
- Discouragement for skilled players
- Meta-gaming (everyone just plays hack-grid)

---

## 💡 **RECOMMENDED SOLUTIONS**

### Option 1: Normalized Percentile System
- Convert all scores to percentiles within their game
- Global ranking = sum/average of percentiles across all games
- **Pro:** Fair comparison across games
- **Con:** Requires sufficient data per game

### Option 2: Fixed Score Caps per Category
- Puzzle games: max 1,000 points
- Arcade games: max 5,000 points  
- Infinite runners: max 10,000 points
- Idle games: separate category
- **Pro:** Easy to understand
- **Con:** Requires rebalancing all formulas

### Option 3: ELO-Style Rating System
- Each game has its own rating pool
- Global rating = weighted average of game ratings
- Ratings adjust based on competition
- **Pro:** Self-balancing over time
- **Con:** Complex to implement, needs active player base

### Option 4: Trophy/Medal System
- Scores divided into tiers (Bronze, Silver, Gold, Platinum, Diamond)
- Global ranking based on trophy count + tier quality
- **Pro:** Easy to understand, feels rewarding
- **Con:** Less granular competition

---

## 🔧 **IMMEDIATE FIXES NEEDED**

### 1. Fix Hack Grid Scoring
**Current formula:**
```typescript
score = max(1, 300000 - duration) + (requiredSegments/actualSegments)*50 + level*100
```

**Proposed formula:**
```typescript
// Base score for completion
baseScore = 100 * level

// Time bonus (capped at 2x base)
timeBonus = baseScore * max(0, min(2, (300 - duration/1000) / 300))

// Efficiency bonus (up to 50% of base)
efficiencyBonus = baseScore * 0.5 * (requiredSegments / actualSegments)

// Final score
score = baseScore + timeBonus + efficiencyBonus

// Example for level 1, 5 seconds, perfect efficiency:
// baseScore = 100
// timeBonus = 100 * ((300 - 5) / 300) = 98.3
// efficiencyBonus = 100 * 0.5 * 1.0 = 50
// score = 248 (instead of 299,950!)
```

### 2. Fix Debug Maze Scoring
Similar adjustment - cap timeBonus to reasonable multiplier.

### 3. Fix Packet Switch
Investigate why scoring returns 0, implement proper formula.

### 4. Add Missing Game Data
- byte-match, dev-pong, dev-fifteen-hex have no scores yet
- Need to test these games

---

## 📈 **NEXT STEPS**

1. ✅ Data exported and analyzed
2. ⏳ Design normalized scoring system (in progress)
3. ⏳ Validate formulas with current data
4. ⏳ Implement score adjustments
5. ⏳ Create migration to recalculate existing scores
6. ⏳ Test and validate fairness
7. ⏳ Deploy and monitor

---

## 📝 **NOTES**

- Sample size is still small (23 scores, 8 games)
- Some games have only 1-2 scores (unreliable statistics)
- Need more data to validate percentile-based systems
- Consider soft launch of new system with both old/new rankings visible

