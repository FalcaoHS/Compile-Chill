# Anti-Cheat: Score Cleanup Procedures

**Date:** 2025-11-19  
**Issue:** User managed to submit 900 million points via client-side manipulation

---

## 🚨 What Happened?

A user exploited a vulnerability in score validation to submit impossibly high scores:
- **Score submitted:** 900,000,000 points
- **Method:** Client-side manipulation (browser DevTools or modified requests)
- **Vulnerability:** No maximum score validation in `lib/validations/score.ts`

---

## ✅ Fix Applied

### 1. Added Score Validation

**File:** `lib/validations/score.ts`

```typescript
const MAX_SCORE = 1_000_000 // 1 million points max

score: z
  .number()
  .int("Score must be an integer")
  .min(0, "Score cannot be negative")
  .max(MAX_SCORE, "Score cannot exceed 1,000,000 (possible cheating detected)")
```

### 2. Added Anti-Cheat Logging

**File:** `app/api/scores/route.ts`

Logs all attempts to submit scores > 1 million with:
- User ID and name
- Game ID
- Attempted score
- Timestamp
- IP address

---

## 🔍 Identify Fraudulent Scores

### Query 1: Find All Suspicious Scores

```sql
-- Find scores above reasonable maximum (1 million)
SELECT 
  s.id,
  s."userId",
  u.name as user_name,
  u."xUsername" as x_username,
  s."gameId",
  s.score,
  s."isBestScore",
  s."createdAt"
FROM scores s
JOIN users u ON s."userId" = u.id
WHERE s.score > 1000000
ORDER BY s.score DESC;
```

**Expected:** Should identify the 900 million score and any others

---

### Query 2: Leaderboard Impact Analysis

```sql
-- Check which suspicious scores are flagged as best scores
SELECT 
  s."gameId",
  COUNT(*) as suspicious_count,
  MAX(s.score) as highest_fraudulent,
  STRING_AGG(DISTINCT u.name, ', ') as affected_users
FROM scores s
JOIN users u ON s."userId" = u.id
WHERE s.score > 1000000
GROUP BY s."gameId"
ORDER BY highest_fraudulent DESC;
```

**Purpose:** See which games have fraudulent leaderboard entries

---

### Query 3: User Cheating History

```sql
-- Check if user has multiple suspicious scores (repeat offender)
SELECT 
  u.id,
  u.name,
  u."xUsername",
  COUNT(*) as suspicious_submissions,
  MAX(s.score) as highest_score,
  MIN(s."createdAt") as first_suspicious,
  MAX(s."createdAt") as last_suspicious
FROM scores s
JOIN users u ON s."userId" = u.id
WHERE s.score > 1000000
GROUP BY u.id, u.name, u."xUsername"
ORDER BY suspicious_submissions DESC, highest_score DESC;
```

---

## 🧹 Cleanup Procedures

### Procedure 1: Delete Single Fraudulent Score

**Use when:** Single suspicious score needs removal

```sql
-- Replace <score_id> with actual ID from Query 1
DELETE FROM scores 
WHERE id = <score_id> 
  AND score > 1000000;

-- Verify deletion
SELECT COUNT(*) FROM scores WHERE id = <score_id>;
-- Expected: 0
```

---

### Procedure 2: Delete All Scores Above Threshold

**Use when:** Multiple fraudulent scores exist

⚠️ **WARNING:** This will delete ALL scores above 1 million

```sql
-- Backup first!
CREATE TABLE scores_fraudulent_backup AS
SELECT * FROM scores WHERE score > 1000000;

-- Verify backup
SELECT COUNT(*) FROM scores_fraudulent_backup;

-- Delete fraudulent scores
DELETE FROM scores WHERE score > 1000000;

-- Verify deletion
SELECT COUNT(*) FROM scores WHERE score > 1000000;
-- Expected: 0
```

---

### Procedure 3: Reset User's Scores for Specific Game

**Use when:** User has multiple suspicious scores in one game

```sql
-- Replace <user_id> and <game_id>
-- Backup first
CREATE TABLE scores_user_backup AS
SELECT * FROM scores 
WHERE "userId" = <user_id> 
  AND "gameId" = '<game_id>'
  AND score > 1000000;

-- Delete suspicious scores for this user/game combo
DELETE FROM scores 
WHERE "userId" = <user_id> 
  AND "gameId" = '<game_id>'
  AND score > 1000000;
```

---

### Procedure 4: Recalculate Best Scores

**Use after:** Deleting fraudulent scores

After cleanup, legitimate scores may need `isBestScore` flag updated:

```sql
-- For each game, recalculate best scores
WITH ranked_scores AS (
  SELECT 
    id,
    "userId",
    "gameId",
    score,
    ROW_NUMBER() OVER (PARTITION BY "userId", "gameId" ORDER BY score DESC) as rank
  FROM scores
)
UPDATE scores s
SET "isBestScore" = (rs.rank = 1)
FROM ranked_scores rs
WHERE s.id = rs.id;
```

---

## 🔒 Prevention Measures

### Already Implemented ✅

1. **Server-side validation** - Max score: 1,000,000
2. **Type validation** - Must be integer
3. **Range validation** - Must be >= 0
4. **Anti-cheat logging** - Attempts logged with user info
5. **Rate limiting** - 10 submissions per minute per user

### Additional Recommendations

#### 1. Per-Game Score Limits

Some games naturally have lower max scores:

```typescript
const GAME_MAX_SCORES: Record<string, number> = {
  'bit-runner': 50_000,
  'terminal-2048': 100_000,
  'dev-pong': 30_000,
  // ... add all games
}

// In validation:
const gameMaxScore = GAME_MAX_SCORES[gameId] || 1_000_000
```

#### 2. Score Velocity Checks

Detect impossibly fast score increases:

```typescript
// Check last score timestamp
const lastScore = await prisma.score.findFirst({
  where: { userId, gameId },
  orderBy: { createdAt: 'desc' }
})

if (lastScore) {
  const timeDiff = Date.now() - lastScore.createdAt.getTime()
  const scoreDiff = score - lastScore.score
  
  // Flag if score increased too fast (e.g., 100k points in 1 second)
  if (timeDiff < 1000 && scoreDiff > 100_000) {
    console.warn('[ANTI-CHEAT] Impossible score velocity')
  }
}
```

#### 3. Game State Validation

Some games send `gameState` - validate it matches the score:

```typescript
// For games like 2048, verify score matches board state
if (gameId === 'terminal-2048' && gameState) {
  const calculatedScore = calculateScoreFromBoard(gameState.board)
  if (Math.abs(calculatedScore - score) > 100) {
    throw new Error('Score does not match game state')
  }
}
```

#### 4. Replay Validation

Store game moves and replay them server-side:

```typescript
// Store moves in metadata
metadata: {
  moves: ['up', 'right', 'down', ...],
  seed: 12345 // for deterministic replay
}

// Server validates by replaying
const replayScore = replayGame(gameId, metadata.moves, metadata.seed)
if (replayScore !== score) {
  throw new Error('Score does not match replay')
}
```

---

## 📊 Monitoring

### Daily Checks

Run these queries daily to detect cheating:

```sql
-- Check for any scores approaching limit
SELECT 
  u.name,
  s."gameId",
  s.score,
  s."createdAt"
FROM scores s
JOIN users u ON s."userId" = u.id
WHERE s.score > 500000  -- Half of max limit
  AND s."createdAt" > NOW() - INTERVAL '24 hours'
ORDER BY s.score DESC;
```

### Log Monitoring

Search Vercel logs for:
- `[ANTI-CHEAT] Score manipulation attempt`
- Check frequency and users
- Ban repeat offenders if needed

---

## 🚫 User Ban Procedure

If user is repeat offender:

### 1. Document Violations

```sql
-- Get user's cheating history
SELECT 
  s.id,
  s."gameId",
  s.score,
  s."createdAt"
FROM scores s
WHERE s."userId" = <user_id>
  AND s.score > 1000000
ORDER BY s."createdAt" DESC;
```

### 2. Delete All User's Scores (Optional)

```sql
-- Backup
CREATE TABLE scores_banned_user_<user_id> AS
SELECT * FROM scores WHERE "userId" = <user_id>;

-- Delete
DELETE FROM scores WHERE "userId" = <user_id>;
```

### 3. Mark User as Banned (if implementing ban system)

```sql
-- Add 'banned' field to users table first, then:
UPDATE users 
SET banned = true, 
    "bannedAt" = NOW(),
    "banReason" = 'Score manipulation'
WHERE id = <user_id>;
```

---

## 🔍 Forensic Analysis

For the current incident (900M score):

### Find the Culprit

```sql
SELECT 
  s.id as score_id,
  s."userId",
  u.name,
  u."xId",
  u."xUsername",
  s."gameId",
  s.score,
  s."createdAt",
  s."isBestScore"
FROM scores s
JOIN users u ON s."userId" = u.id
WHERE s.score = 900000000;
```

### User's Full Score History

```sql
-- Replace <user_id> from above query
SELECT 
  "gameId",
  score,
  "isBestScore",
  "createdAt"
FROM scores
WHERE "userId" = <user_id>
ORDER BY "createdAt" DESC;
```

### Check if Legit Scores Exist

```sql
-- See if user has any reasonable scores
SELECT 
  "gameId",
  MIN(score) as min_score,
  MAX(score) as max_score,
  AVG(score) as avg_score,
  COUNT(*) as total_submissions
FROM scores
WHERE "userId" = <user_id>
GROUP BY "gameId";
```

---

## ✅ Post-Cleanup Checklist

After cleaning fraudulent scores:

- [ ] Verify fraudulent scores deleted (Query 1 returns 0)
- [ ] Backup created before deletion
- [ ] Best scores recalculated (Procedure 4)
- [ ] Leaderboards updated
- [ ] User notified (if needed)
- [ ] Incident documented
- [ ] Monitoring set up to prevent recurrence

---

## 📝 Incident Template

```markdown
# Score Manipulation Incident Report

**Date:** YYYY-MM-DD
**Reporter:** [Name]
**Affected Game:** [game-id]

## Details
- User ID: [id]
- User Name: [name]
- Fraudulent Score: [score]
- Actual Max Score: [legit score if known]
- Detection Method: [manual/automated/user report]

## Actions Taken
1. [X] Fraudulent score deleted
2. [X] User history reviewed
3. [ ] User banned (if applicable)
4. [X] Leaderboards updated
5. [X] Prevention measures implemented

## Root Cause
- Missing max score validation
- Client-side score calculation

## Prevention
- Server-side validation added
- Anti-cheat logging implemented
- [Other measures]
```

---

## 🛠️ Tools

### Quick Score Check Script

```sql
-- Paste in Neon SQL Editor for quick check
WITH score_stats AS (
  SELECT 
    "gameId",
    COUNT(*) as total_scores,
    MAX(score) as max_score,
    AVG(score) as avg_score,
    COUNT(CASE WHEN score > 1000000 THEN 1 END) as suspicious_count
  FROM scores
  GROUP BY "gameId"
)
SELECT * FROM score_stats
WHERE suspicious_count > 0 OR max_score > 500000
ORDER BY max_score DESC;
```

---

**Last Updated:** 2025-11-19  
**Next Review:** After implementing additional anti-cheat measures

