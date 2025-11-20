# Session Monitoring Guide

Complete guide for monitoring active sessions and detecting anomalies in production.

---

## 🔍 Session Monitoring SQL Queries

### Query 1: List All Active Sessions

**Purpose:** View all current active sessions with user information

```sql
SELECT 
  s.id,
  s."sessionToken",
  s."userId",
  s.expires,
  u.id as user_id,
  u.name as user_name,
  u."xId" as user_x_id,
  u."xUsername" as user_x_username,
  CASE 
    WHEN s.expires > NOW() THEN 'active'
    ELSE 'expired'
  END as status,
  EXTRACT(EPOCH FROM (s.expires - NOW())) / 3600 as hours_until_expiry
FROM sessions s
LEFT JOIN users u ON s."userId" = u.id
ORDER BY s.expires DESC
LIMIT 100;
```

**Expected Result:** List of sessions with user details, showing which are active or expired.

**Red Flags:**
- Sessions with `userId` that don't match any user (NULL user_name)
- Sessions that expired but weren't cleaned up
- Unusually high number of sessions for single user

---

### Query 2: Detect Duplicate Session Tokens (CRITICAL)

**Purpose:** Find duplicate `sessionToken` values (SHOULD ALWAYS RETURN 0 ROWS)

```sql
SELECT 
  "sessionToken",
  COUNT(*) as duplicate_count,
  ARRAY_AGG("userId") as user_ids,
  ARRAY_AGG(expires) as expiry_dates
FROM sessions
GROUP BY "sessionToken"
HAVING COUNT(*) > 1;
```

**Expected Result:** 0 rows (empty result set)

**🚨 CRITICAL:** If this returns ANY rows, it indicates:
- Database UNIQUE constraint failure (should be impossible)
- Critical bug in session creation logic
- **ACTION:** Immediately run emergency cleanup procedure

---

### Query 3: Find Sessions Without Valid User

**Purpose:** Detect orphaned sessions (user deleted but session remains)

```sql
SELECT 
  s.id,
  s."sessionToken",
  s."userId",
  s.expires
FROM sessions s
LEFT JOIN users u ON s."userId" = u.id
WHERE u.id IS NULL;
```

**Expected Result:** 0 rows (or very few)

**Red Flags:**
- Multiple orphaned sessions indicates cleanup issue
- **ACTION:** Delete orphaned sessions (see cleanup procedure)

---

### Query 4: Detect Rapid Session Creation

**Purpose:** Find users creating many sessions in short time (possible attack)

```sql
SELECT 
  s."userId",
  u.name,
  u."xUsername",
  COUNT(*) as session_count,
  MIN(s."createdAt") as first_session,
  MAX(s."createdAt") as last_session,
  EXTRACT(EPOCH FROM (MAX(s."createdAt") - MIN(s."createdAt"))) / 60 as minutes_span
FROM sessions s
JOIN users u ON s."userId" = u.id
WHERE s."createdAt" > NOW() - INTERVAL '1 hour'
GROUP BY s."userId", u.name, u."xUsername"
HAVING COUNT(*) > 10
ORDER BY session_count DESC;
```

**Expected Result:** 0 rows (or very few with legitimate explanation)

**Red Flags:**
- User creating > 10 sessions in 1 hour
- **ACTION:** Investigate user behavior, possible account compromise

**Note:** If `createdAt` column doesn't exist on sessions table, use this alternative:

```sql
SELECT 
  s."userId",
  u.name,
  u."xUsername",
  COUNT(*) as session_count
FROM sessions s
JOIN users u ON s."userId" = u.id
GROUP BY s."userId", u.name, u."xUsername"
HAVING COUNT(*) > 5
ORDER BY session_count DESC;
```

---

### Query 5: Session-to-User Ratio

**Purpose:** Calculate healthy ratio (should be < 3 sessions per user)

```sql
SELECT 
  COUNT(DISTINCT s."userId") as total_users,
  COUNT(s.id) as total_sessions,
  ROUND(COUNT(s.id)::numeric / NULLIF(COUNT(DISTINCT s."userId"), 0), 2) as sessions_per_user
FROM sessions s
WHERE s.expires > NOW();
```

**Expected Result:** `sessions_per_user` should be between 1.0 and 3.0

**Red Flags:**
- Ratio > 3.0 indicates users have too many active sessions
- Ratio < 0.5 indicates possible session cleanup issue
- **ACTION:** Review session creation and expiry logic

---

### Query 6: Recent Sessions by User

**Purpose:** See session history for specific user (for support/debugging)

```sql
-- Replace 123 with actual user ID
SELECT 
  s.id,
  s."sessionToken",
  s.expires,
  CASE 
    WHEN s.expires > NOW() THEN 'active'
    ELSE 'expired'
  END as status,
  EXTRACT(EPOCH FROM (NOW() - s.expires)) / 3600 as hours_since_expiry
FROM sessions s
WHERE s."userId" = 123
ORDER BY s.expires DESC
LIMIT 20;
```

---

### Query 7: Count Active vs Expired Sessions

**Purpose:** Monitor session cleanup effectiveness

```sql
SELECT 
  CASE 
    WHEN expires > NOW() THEN 'active'
    ELSE 'expired'
  END as status,
  COUNT(*) as count
FROM sessions
GROUP BY status;
```

**Expected Result:** 
- Active: reasonable number based on active users
- Expired: should be 0 or very low (if cleanup is working)

**Red Flags:**
- Large number of expired sessions indicates cleanup not running
- **ACTION:** Implement or fix session cleanup cron job

---

## 📊 Monitoring Dashboard Setup

### Neon Dashboard Access

1. Go to [Neon Console](https://console.neon.com/)
2. Select your project: **compilechill**
3. Click **"SQL Editor"** tab
4. Copy/paste queries above to run them

### Recommended Monitoring Schedule

**Daily (Automated):**
- Query 2: Detect duplicate session tokens
- Query 3: Find orphaned sessions
- Query 5: Session-to-user ratio

**Weekly (Manual Review):**
- Query 1: Review all active sessions
- Query 4: Check for rapid session creation
- Query 7: Verify session cleanup

**On-Demand (Support/Debugging):**
- Query 6: Recent sessions by user

---

## 🚨 Alert Thresholds

Set up alerts (manual or automated) for these conditions:

| Metric | Threshold | Severity | Action |
|--------|-----------|----------|--------|
| Duplicate session tokens | > 0 | 🔴 CRITICAL | Immediate emergency cleanup |
| Orphaned sessions | > 10 | 🟠 HIGH | Run cleanup procedure |
| Sessions per user | > 3.0 | 🟠 HIGH | Investigate session creation |
| Rapid session creation | > 10/hour | 🟡 MEDIUM | Check for compromised account |
| Expired sessions | > 100 | 🟡 MEDIUM | Fix cleanup job |

---

## 📈 Healthy Baseline Metrics

**Expected values for production:**

- **Total active sessions:** ~50-500 (depends on user base)
- **Sessions per user:** 1.0 - 2.5 average
- **Duplicate tokens:** 0 (always)
- **Orphaned sessions:** 0 - 5 maximum
- **Expired sessions:** 0 - 10 maximum
- **Session creation rate:** ~10-50 per hour during peak

---

## 🔄 Session Cleanup

### Automatic Cleanup (Recommended)

NextAuth should automatically clean up expired sessions. Verify with Query 7.

### Manual Cleanup (If Needed)

**Delete expired sessions:**

```sql
DELETE FROM sessions
WHERE expires < NOW();
```

**Delete orphaned sessions:**

```sql
DELETE FROM sessions s
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = s."userId"
);
```

---

## 🔍 Troubleshooting

### Issue: Too Many Active Sessions

**Symptoms:** Query 1 shows hundreds of active sessions for same user

**Possible Causes:**
- User not logging out properly
- Multiple devices/browsers
- Session not expiring correctly

**Solution:**
```sql
-- Delete all but most recent session for user (replace 123 with userId)
DELETE FROM sessions
WHERE "userId" = 123
AND id NOT IN (
  SELECT id FROM sessions
  WHERE "userId" = 123
  ORDER BY expires DESC
  LIMIT 1
);
```

### Issue: Sessions Not Expiring

**Symptoms:** Query 7 shows many expired sessions

**Possible Causes:**
- Cleanup cron job not running
- NextAuth cleanup disabled

**Solution:**
1. Manually delete expired sessions (see cleanup above)
2. Verify NextAuth session cleanup is enabled
3. Consider implementing custom cleanup cron

---

## 📝 Logging Integration

Session monitoring queries should be cross-referenced with application logs:

**Search logs for:**
- `[AUTH-ADAPTER] Session created` - Normal session creation
- `[AUTH-ADAPTER] Duplicate session token detected` - 🚨 CRITICAL
- `[SESSION-CALLBACK] User ID mismatch` - 🚨 CRITICAL
- `[SESSION-CALLBACK] User not found` - ⚠️ Warning

**Log Locations:**
- **Development:** Console output
- **Production (Vercel):** Vercel Functions logs

---

## 🆘 Emergency Response

If session leakage is detected:

1. **IMMEDIATE:** See `SESSION_EMERGENCY_CLEANUP.md`
2. Run Query 2 to identify affected sessions
3. Check logs for mismatch warnings
4. Delete duplicate sessions
5. Force logout all users if necessary
6. Deploy hotfix
7. Monitor for 24 hours post-fix

---

## 📊 Performance Considerations

**Query Performance:**
- All queries use indexed columns (`sessionToken`, `userId`)
- Queries should complete in < 100ms even with 10,000+ sessions
- If slow, check EXPLAIN ANALYZE and ensure indexes exist

**Database Load:**
- Run monitoring queries max once per minute
- Use read replicas if available
- Consider caching results for dashboard

---

## 🔐 Security Notes

- ⚠️ Session monitoring queries expose sensitive data (session tokens)
- Only run these queries from secure, authenticated environment
- Never log full session tokens in production
- Truncate tokens to first 8 chars in logs (already implemented)
- Restrict database access to authorized personnel only

---

## ✅ Health Check Checklist

Run weekly to ensure session system health:

- [ ] Query 2 returns 0 rows (no duplicates)
- [ ] Query 3 returns < 5 rows (minimal orphaned)
- [ ] Query 5 shows ratio between 1.0 - 3.0
- [ ] Query 7 shows < 10 expired sessions
- [ ] No critical warnings in application logs
- [ ] Session creation rate is normal (not spiking)
- [ ] No user reports of session issues

---

For emergency procedures, see: `SESSION_EMERGENCY_CLEANUP.md`

