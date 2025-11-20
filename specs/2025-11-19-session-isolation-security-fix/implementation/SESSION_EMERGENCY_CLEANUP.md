# Session Emergency Cleanup Procedure

**⚠️ USE ONLY IN EMERGENCY SITUATIONS**

This document provides step-by-step procedures for handling critical session security incidents.

---

## 🚨 When to Use This Procedure

Use this emergency procedure if you detect:

1. **Session Leakage:** User A sees User B's data
2. **Duplicate Session Tokens:** Query from SESSION_MONITORING.md returns duplicate tokens
3. **User ID Mismatch:** Critical warnings in logs about session-user mismatch
4. **Mass Account Compromise:** Evidence of widespread session hijacking

---

## ⚠️ Pre-Emergency Checklist

Before executing emergency procedures:

- [ ] Confirm the incident is real (not user error or browser cache)
- [ ] Identify affected users if possible
- [ ] Take screenshots/logs as evidence
- [ ] Notify team members
- [ ] Prepare rollback plan

---

## 🔴 PROCEDURE 1: Clear All Sessions (Nuclear Option)

**Use when:** Widespread session leakage, uncertain scope of compromise

**Impact:** ⚠️ **ALL USERS WILL BE LOGGED OUT**

### Step 1: Backup Current Sessions

```sql
-- Create backup of sessions table
CREATE TABLE sessions_backup_<TIMESTAMP> AS 
SELECT * FROM sessions;

-- Verify backup
SELECT COUNT(*) FROM sessions_backup_<TIMESTAMP>;
```

Replace `<TIMESTAMP>` with current timestamp (e.g., `20251119_0300`)

### Step 2: Delete All Sessions

```sql
-- Delete all sessions (forces all users to re-login)
DELETE FROM sessions;

-- Verify deletion
SELECT COUNT(*) FROM sessions;
-- Expected: 0
```

### Step 3: Verify Application State

1. Try to access authenticated pages - should redirect to login
2. Login with test account - should work normally
3. Refresh page - should stay logged in (new session working)

### Step 4: Monitor for Issues

- Watch logs for session creation
- Run monitoring queries (see SESSION_MONITORING.md)
- Check for duplicate token warnings

### Step 5: User Communication

**Email/announcement template:**

```
Subject: Security Update - Please Log In Again

We've implemented a security update that requires all users to log in again. 
Your data is safe, and this is a precautionary measure.

Simply visit [https://compileandchill.dev] and log in with your X account.

Thank you for your understanding.
```

---

## 🟠 PROCEDURE 2: Clear Sessions for Specific Users

**Use when:** Specific users affected, limited scope

**Impact:** ⚠️ Affected users will be logged out

### Step 1: Identify Affected Users

```sql
-- Find user by name or xUsername
SELECT id, name, "xId", "xUsername" 
FROM users 
WHERE name ILIKE '%bruno%' 
   OR "xUsername" ILIKE '%bruno%';
```

### Step 2: Backup Affected Sessions

```sql
-- Replace user_ids with actual IDs (e.g., 123, 456)
CREATE TABLE affected_sessions_backup AS
SELECT * FROM sessions 
WHERE "userId" IN (123, 456);
```

### Step 3: Delete Affected Sessions

```sql
-- Replace user_ids with actual IDs
DELETE FROM sessions 
WHERE "userId" IN (123, 456);

-- Verify deletion
SELECT COUNT(*) FROM sessions 
WHERE "userId" IN (123, 456);
-- Expected: 0
```

### Step 4: Notify Affected Users

Contact users directly if possible, or wait for them to notice and re-login.

---

## 🟡 PROCEDURE 3: Clear Duplicate Sessions Only

**Use when:** Duplicate tokens detected but no evidence of leakage

**Impact:** ⚠️ Minimal - only duplicate sessions deleted

### Step 1: Identify Duplicates

```sql
-- Find duplicate session tokens
SELECT 
  "sessionToken",
  COUNT(*) as count,
  ARRAY_AGG(id) as session_ids,
  ARRAY_AGG("userId") as user_ids
FROM sessions
GROUP BY "sessionToken"
HAVING COUNT(*) > 1;
```

### Step 2: Keep Newest, Delete Older

```sql
-- For each duplicate token, delete all but the most recent
WITH duplicates AS (
  SELECT 
    "sessionToken",
    id,
    ROW_NUMBER() OVER (PARTITION BY "sessionToken" ORDER BY expires DESC) as rn
  FROM sessions
  WHERE "sessionToken" IN (
    SELECT "sessionToken" 
    FROM sessions 
    GROUP BY "sessionToken" 
    HAVING COUNT(*) > 1
  )
)
DELETE FROM sessions
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
```

### Step 3: Verify No Duplicates Remain

```sql
-- Should return 0 rows
SELECT "sessionToken", COUNT(*) 
FROM sessions 
GROUP BY "sessionToken" 
HAVING COUNT(*) > 1;
```

---

## 🟢 PROCEDURE 4: Clear Orphaned Sessions

**Use when:** Routine cleanup of sessions without valid users

**Impact:** ✅ No user impact (users already deleted)

### Step 1: Identify Orphaned Sessions

```sql
SELECT s.*
FROM sessions s
LEFT JOIN users u ON s."userId" = u.id
WHERE u.id IS NULL;
```

### Step 2: Delete Orphaned Sessions

```sql
DELETE FROM sessions
WHERE id IN (
  SELECT s.id
  FROM sessions s
  LEFT JOIN users u ON s."userId" = u.id
  WHERE u.id IS NULL
);
```

---

## 🔄 Post-Emergency Actions

After executing any emergency procedure:

### Immediate (0-1 hour)

- [ ] Verify cleanup completed successfully
- [ ] Monitor logs for new session creation
- [ ] Run all monitoring queries (SESSION_MONITORING.md)
- [ ] Test login/logout functionality
- [ ] Check for any error reports from users

### Short-term (1-24 hours)

- [ ] Review session creation patterns
- [ ] Look for duplicate token warnings in logs
- [ ] Monitor session-to-user ratio
- [ ] Check for repeated incidents
- [ ] Document incident in team knowledge base

### Medium-term (1-7 days)

- [ ] Analyze root cause of incident
- [ ] Review and improve session security code
- [ ] Update monitoring thresholds if needed
- [ ] Schedule code review of auth system
- [ ] Consider additional security measures

---

## 🔍 Root Cause Analysis

After emergency response, investigate:

**1. Review Logs**

Search for these critical patterns:
```
[AUTH-ADAPTER] Duplicate session token detected
[SESSION-CALLBACK] User ID mismatch
[AUTH-ADAPTER] Error creating user
[SESSION-CALLBACK] User not found
```

**2. Check Configuration**

- Verify `NEXTAUTH_URL` is correct: `https://compileandchill.dev`
- Verify `NEXTAUTH_SECRET` is set and strong
- Check cookie configuration in `auth.config.ts`
- Verify database UNIQUE constraints exist

**3. Review Recent Changes**

- Check git history for recent auth-related changes
- Review recent deployments
- Check for environment variable changes in Vercel

**4. Test Isolation**

Run manual isolation tests:
1. Login as User A in normal browser
2. Login as User B in incognito browser
3. Refresh both browsers multiple times
4. Verify User A never sees User B's data

---

## 🛡️ Prevention Measures

To prevent future incidents:

### Code Level

- ✅ Explicit cookie configuration (implemented)
- ✅ Environment variable validation (implemented)
- ✅ Session logging and monitoring (implemented)
- ✅ User ID mismatch detection (implemented)
- ⏳ Session isolation integration tests (recommended)

### Infrastructure Level

- [ ] Set up automated monitoring alerts
- [ ] Schedule daily session health checks
- [ ] Implement session cleanup cron job
- [ ] Set up staging environment for testing
- [ ] Enable database query logging (if needed)

### Process Level

- [ ] Require code review for all auth changes
- [ ] Test session isolation before production deploy
- [ ] Maintain incident response runbook
- [ ] Schedule quarterly security audits
- [ ] Keep emergency contact list updated

---

## 📞 Emergency Contacts

**During Incident:**

- Team Lead: [Contact Info]
- Database Admin: [Contact Info]  
- Security Contact: [Contact Info]

**Post-Incident:**

- Document in: [Issue Tracker URL]
- Notify: [Stakeholder List]

---

## 📊 Incident Severity Levels

| Level | Description | Response Time | Procedure |
|-------|-------------|---------------|-----------|
| 🔴 **P0 - Critical** | Active session leakage, confirmed | Immediate | PROCEDURE 1 |
| 🟠 **P1 - High** | Duplicate tokens, potential leakage | < 1 hour | PROCEDURE 2/3 |
| 🟡 **P2 - Medium** | Orphaned sessions, monitoring alerts | < 4 hours | PROCEDURE 4 |
| 🟢 **P3 - Low** | Routine cleanup, no active issues | < 24 hours | PROCEDURE 4 |

---

## 📝 Incident Report Template

After resolving incident, complete this report:

```markdown
# Session Security Incident Report

**Date:** YYYY-MM-DD HH:MM UTC
**Severity:** P0 / P1 / P2 / P3
**Incident ID:** INC-YYYYMMDD-NNN

## Summary
[Brief description of what happened]

## Timeline
- **HH:MM** - Incident detected
- **HH:MM** - Emergency procedure initiated
- **HH:MM** - Cleanup completed
- **HH:MM** - Monitoring verified
- **HH:MM** - Incident resolved

## Impact
- Users affected: [number/names]
- Sessions deleted: [count]
- Duration: [time]
- Data leaked: Yes/No

## Root Cause
[Technical explanation of what caused the incident]

## Actions Taken
1. [List procedures executed]
2. [Verification steps]
3. [User communication]

## Prevention Measures
1. [Code changes made/planned]
2. [Process improvements]
3. [Monitoring enhancements]

## Lessons Learned
[What we learned and how to prevent recurrence]
```

---

## 🔒 Security Reminders

- **Never** share session tokens in public channels
- **Always** use secure, authenticated database access
- **Document** all emergency actions taken
- **Test** procedures in staging before production
- **Verify** backups before deleting data
- **Communicate** with users transparently

---

## ✅ Procedure Verification Checklist

Before closing incident:

- [ ] No duplicate session tokens (Query 2 returns 0)
- [ ] No orphaned sessions (Query 3 returns 0)
- [ ] Session-to-user ratio healthy (Query 5: 1-3)
- [ ] No critical warnings in logs (past 1 hour)
- [ ] Login/logout working correctly
- [ ] No user reports of session issues
- [ ] Incident documented
- [ ] Team notified
- [ ] Prevention measures planned

---

**Last Updated:** 2025-11-19  
**Next Review:** After any session-related incident or quarterly

