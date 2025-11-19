# Fair Scoring System Analysis - Spec Documentation

**Spec ID:** 2025-11-19-fair-scoring-system-analysis  
**Status:** ✅ Analysis Complete, Ready for Implementation  
**Priority:** CRITICAL  
**Date:** 2025-11-19

---

## 📋 QUICK SUMMARY

This spec analyzes the severe scoring imbalances in the Compile & Chill game platform and proposes a comprehensive fair scoring system.

### Problem
- **Hack Grid** and **Debug Maze** generate ~295,000 points per completion
- Other games generate 100-3,000 points
- Result: 100x-1000x imbalance makes global rankings unfair
- **Packet Switch** returns 0 points (broken)

### Solution
- Fix game-specific formulas (Phase 1)
- Implement category-aware rankings (Phase 2)

---

## 📂 DOCUMENTS IN THIS SPEC

### 1. `raw-idea.md`
Original problem description and initial observations.

### 2. `score-data-export.json`
Complete export of all 23 best scores from the database with full metadata.

### 3. `score-analysis-summary.md`
Statistical summary of current score distributions by game.

### 4. `detailed-analysis.md`
Comprehensive deep-dive into each game's scoring system:
- Formula breakdown
- Score examples
- Problem identification
- Coefficient of variation calculations

**Key Findings:**
- Hack Grid: 294,134 mean (99.9% from timeBonus)
- Debug Maze: 294,436 mean (same issue)
- Terminal 2048: 2,036 mean (✅ balanced)
- Bit Runner: 46,743 mean with 78x variance (natural for runners)
- Packet Switch: 0 points (broken)

### 5. `proposed-fair-scoring-system.md`
Complete redesign of scoring formulas with:
- New formulas for each game
- Score range estimates
- Migration plan
- Two-phase implementation strategy

**New Formula Examples:**
```typescript
// Hack Grid (OLD): 299,000 points
// Hack Grid (NEW): 350 points
// Reduction: 99.9%

// Debug Maze (OLD): 295,000 points  
// Debug Maze (NEW): 723 points
// Reduction: 99.75%
```

### 6. `validation-results.json`
Output from validation script testing new formulas against real data.

**Results:**
- Top 10 now shows game diversity
- No more 100x imbalances within categories
- Packet Switch fixed (0 → 124 points)
- Bit Runner naturally dominates (expected for infinite runners)

### 7. `final-recommendations.md` ⭐ **START HERE**
Executive summary with actionable recommendations:
- Immediate fixes needed
- Migration strategy
- Player communication plan
- Success criteria
- Next steps

---

## 🎯 KEY METRICS

### Before Fix
| Metric | Value |
|--------|-------|
| Max Score | 299,448 |
| Min Score (non-zero) | 121 |
| Variance | 2,474x |
| Games in Top 10 | 2 (hack-grid, debug-maze) |
| Broken Games | 1 (packet-switch) |

### After Fix (Projected)
| Metric | Value |
|--------|-------|
| Max Score | 158,894 (bit-runner outlier) |
| Min Score (non-zero) | 85 |
| Variance | ~1,869x (mostly from infinite runner) |
| Games in Top 10 | 3+ categories |
| Broken Games | 0 ✅ |

---

## 🚀 IMPLEMENTATION STATUS

### Phase 1: Fix Game Formulas (CRITICAL)
- [ ] Update `lib/games/hack-grid/game-logic.ts`
- [ ] Update `lib/games/debug-maze/game-logic.ts`
- [ ] Update `lib/games/packet-switch/game-logic.ts`
- [ ] Update `lib/games/stack-overflow-dodge/game-logic.ts`
- [ ] Create migration script `scripts/migrate-scores.ts`
- [ ] Test on staging database
- [ ] Announce to players (1 week notice)
- [ ] Execute migration
- [ ] Monitor for 48 hours

### Phase 2: Category System (FUTURE)
- [ ] Design category-aware API
- [ ] Add database columns (category, percentile, rating)
- [ ] Implement normalized rating calculation
- [ ] Update leaderboard endpoints
- [ ] Add category filters to UI
- [ ] Award category badges

---

## 📊 AFFECTED GAMES

| Game | Status | Action | Score Change |
|------|--------|--------|--------------|
| **hack-grid** | 🚨 CRITICAL | Formula rewrite | 299K → 350 |
| **debug-maze** | 🚨 CRITICAL | Formula rewrite | 295K → 723 |
| **packet-switch** | 🚨 BROKEN | Fix calculation | 0 → 124 |
| **stack-overflow-dodge** | ⚠️ Minor | Increase rate | 121 → 340 |
| **terminal-2048** | ✅ Good | No changes | - |
| **bit-runner** | ✅ Good | No changes | - |
| **byte-match** | ✅ Good | No changes | - |
| **refactor-rush** | ✅ Good | No changes | - |
| **dev-pong** | ℹ️ No data | Test needed | - |
| **crypto-miner** | ℹ️ Special | Separate board | - |
| **dev-fifteen-hex** | ℹ️ No data | Test needed | - |

---

## 🎓 LESSONS LEARNED

1. **Time-dominant formulas are dangerous**
   - Hack Grid and Debug Maze both used `score = max(1, 300000 - duration)`
   - This made time 99.9% of the score
   - Solution: Cap time bonus as a multiplier, not absolute value

2. **Infinite runners need special treatment**
   - Bit Runner's high variance (78x) is expected and healthy
   - Cannot fairly compare unlimited score games to fixed puzzles
   - Solution: Category-based rankings

3. **Test formulas with real data**
   - Validation script caught stack-overflow-dodge formula error
   - Projected scores before deployment
   - Always verify with actual player scores

4. **Player communication is critical**
   - 30% of scores will change
   - Some players will see 99% reductions
   - Need clear explanation and "legacy champion" recognition

---

## 📞 CONTACTS & STAKEHOLDERS

**Owner:** Development Team  
**Reviewers:** Product, Community Management  
**Affected:** All players with scores in modified games

---

## 🔗 RELATED SPECS

- `2025-11-18-global-rankings-page` - UI for displaying rankings
- `2025-11-18-game-score-storage` - Database schema
- `2025-11-18-game-score-validation-system` - Anti-cheat

---

## 📝 CHANGELOG

### 2025-11-19 - Initial Analysis
- Exported all 23 scores from database
- Identified 100x+ imbalances
- Designed new formulas
- Validated against real data
- Created implementation plan

---

## ✅ APPROVAL CHECKLIST

Before implementation:
- [ ] Product owner reviewed and approved
- [ ] Technical review completed
- [ ] Migration script tested on staging
- [ ] Rollback plan documented
- [ ] Player communication drafted
- [ ] Monitoring plan established

---

**For detailed implementation instructions, see [`final-recommendations.md`](./final-recommendations.md)**

