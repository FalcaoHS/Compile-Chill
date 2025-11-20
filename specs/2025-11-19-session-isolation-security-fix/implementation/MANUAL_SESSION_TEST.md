# Manual Session Isolation Test

This document provides step-by-step instructions for manually testing session isolation between users.

**⚠️ Run this test BEFORE deploying to production after any auth-related changes**

---

## 🎯 Test Objective

Verify that User A's session is completely isolated from User B's session, and that refreshing/navigating never causes session leakage.

---

## 📋 Prerequisites

- [ ] Two X (Twitter) accounts for testing
  - Account A: Your primary test account
  - Account B: Secondary test account (or ask colleague)
- [ ] Two browsers installed (e.g., Chrome + Firefox, or Chrome + Incognito)
- [ ] Application deployed and accessible
- [ ] Database access for verification queries (optional)

---

## 🧪 Test Procedure

### Part 1: Basic Session Isolation

#### Step 1: Setup Test Environment

1. **Browser A** (Normal Chrome):
   - Clear all cookies and cache
   - Navigate to: `https://compileandchill.dev` (or your test URL)
   - Verify you are NOT logged in

2. **Browser B** (Incognito Chrome or Firefox):
   - Open incognito/private window
   - Navigate to: `https://compileandchill.dev`
   - Verify you are NOT logged in

#### Step 2: Login as User A

**In Browser A:**

1. Click "Login" button
2. Login with X Account A
3. After redirect, verify:
   - ✅ You see Account A's name in header
   - ✅ Profile button shows Account A's avatar
   - ✅ URL is `https://compileandchill.dev` (no error params)

4. Navigate to Profile page (`/profile`)
5. Verify profile shows Account A's data:
   - ✅ Name matches Account A
   - ✅ X username matches Account A
   - ✅ Stats are Account A's stats

6. **RECORD Account A Info:**
   - Name: ________________
   - X Username: ________________
   - Session appears correct: YES / NO

#### Step 3: Login as User B

**In Browser B (while Browser A still logged in):**

1. Click "Login" button
2. Login with X Account B (different account)
3. After redirect, verify:
   - ✅ You see Account B's name in header
   - ✅ Profile button shows Account B's avatar
   - ✅ URL is correct (no errors)

4. Navigate to Profile page (`/profile`)
5. Verify profile shows Account B's data:
   - ✅ Name matches Account B
   - ✅ X username matches Account B
   - ✅ Stats are Account B's stats

6. **RECORD Account B Info:**
   - Name: ________________
   - X Username: ________________
   - Session appears correct: YES / NO

#### Step 4: Verify Isolation (Critical)

**⚠️ THIS IS THE CRITICAL TEST**

1. **In Browser A:**
   - Refresh the page (F5)
   - Check header: Should still show Account A's name
   - **❌ FAIL:** If you see Account B's name → SESSION LEAKAGE
   - **✅ PASS:** Still shows Account A

2. **In Browser B:**
   - Refresh the page (F5)
   - Check header: Should still show Account B's name
   - **❌ FAIL:** If you see Account A's name → SESSION LEAKAGE
   - **✅ PASS:** Still shows Account B

3. **Repeat refreshes 10 times in BOTH browsers:**
   - Browser A: Refresh 10x → Should ALWAYS show Account A
   - Browser B: Refresh 10x → Should ALWAYS show Account B
   - **Record:** Any session switches? YES / NO

#### Step 5: Navigation Test

**In Browser A:**

1. Navigate to `/jogos` (games page)
2. Navigate to `/ranking` (leaderboard)
3. Navigate to `/profile`
4. Navigate back to home `/`
5. After each navigation, verify header shows Account A

**In Browser B:**

1. Navigate to `/jogos`
2. Navigate to `/ranking`
3. Navigate to `/profile`
4. Navigate back to home `/`
5. After each navigation, verify header shows Account B

**Record any session switches:** YES / NO

---

### Part 2: Rapid Refresh Test

This test simulates the original bug scenario.

#### Step 6: Rapid Alternating Refreshes

1. **Browser A:** Refresh page
2. **Immediately switch to Browser B:** Refresh page
3. **Immediately switch to Browser A:** Refresh page
4. **Continue alternating rapidly for 20 refreshes**

**After each refresh, verify:**
- Browser A ALWAYS shows Account A
- Browser B ALWAYS shows Account B
- No session leakage occurs

**Record results:**
- Total refreshes: 20
- Session switches detected: _______ (should be 0)
- Test PASSED / FAILED

---

### Part 3: Cookie Inspection

#### Step 7: Inspect Session Cookies

**Browser A:**

1. Open DevTools (F12)
2. Go to Application tab → Cookies
3. Look for cookie: `next-auth.session-token` (dev) or `__Secure-next-auth.session-token` (prod)
4. Verify cookie attributes:
   - ✅ HttpOnly: true
   - ✅ Secure: true (production only)
   - ✅ SameSite: Lax
   - ✅ Domain: `.compileandchill.dev` or `compileandchill.dev`
   - ✅ Path: `/`

**Browser B:**

1. Repeat cookie inspection
2. Verify cookie attributes match

**Compare session tokens:**
- Are they different between Browser A and B? (Should be YES)
- Record first 8 chars of each token:
  - Browser A: ________________
  - Browser B: ________________
  - Tokens are different: YES / NO

---

### Part 4: Database Verification (Optional)

If you have database access, run these queries:

#### Query 1: Verify Two Sessions Exist

```sql
SELECT 
  s.id,
  LEFT(s."sessionToken", 8) as token_preview,
  s."userId",
  u.name,
  u."xUsername"
FROM sessions s
JOIN users u ON s."userId" = u.id
WHERE u."xUsername" IN ('account_a_username', 'account_b_username')
  AND s.expires > NOW()
ORDER BY s.id DESC;
```

**Expected:** 2 rows, one for each user, with different tokens

#### Query 2: Check for Duplicate Tokens

```sql
SELECT "sessionToken", COUNT(*)
FROM sessions
GROUP BY "sessionToken"
HAVING COUNT(*) > 1;
```

**Expected:** 0 rows (no duplicates)

---

## ✅ Pass Criteria

Test is considered **PASSED** if ALL of the following are true:

- [ ] Browser A ALWAYS shows Account A's data (100% of time)
- [ ] Browser B ALWAYS shows Account B's data (100% of time)
- [ ] No session switches detected during 10+ refreshes per browser
- [ ] No session switches during rapid alternating refresh test
- [ ] Session cookies have correct security attributes
- [ ] Session tokens are different between browsers
- [ ] Database shows 2 distinct sessions with no duplicates
- [ ] No errors in browser console or server logs

---

## ❌ Failure Scenarios

If ANY of these occur, the test has **FAILED**:

### Critical Failures (P0)

- ❌ Browser A shows Account B's name at any point
- ❌ Browser B shows Account A's name at any point
- ❌ Same session token appears in both browsers
- ❌ Database shows duplicate session tokens

### High Severity (P1)

- ❌ Session cookies missing HttpOnly or Secure flags
- ❌ Session cookie domain is incorrect
- ❌ Errors in console related to authentication

### Medium Severity (P2)

- ❌ User logged out unexpectedly
- ❌ Session expires too quickly (< 24 hours)
- ❌ Warnings in server logs about session issues

---

## 🚨 If Test Fails

1. **STOP deployment immediately**
2. Do NOT proceed to production
3. Document the failure:
   - Which step failed?
   - What did you see vs. what was expected?
   - Screenshots if possible
4. Check server logs for:
   - `[SESSION-CALLBACK] User ID mismatch`
   - `[AUTH-ADAPTER] Duplicate session token`
5. Review recent changes to:
   - `auth.config.ts`
   - `lib/auth-adapter.ts`
   - `middleware.ts`
6. Consult `SESSION_EMERGENCY_CLEANUP.md` if session leakage detected

---

## 📊 Test Report Template

After completing test, fill out this report:

```
# Session Isolation Test Report

**Date:** YYYY-MM-DD HH:MM
**Tester:** [Your Name]
**Environment:** Production / Staging / Development
**Test Result:** PASSED / FAILED

## Test Details

**Browsers Used:**
- Browser A: [Chrome 120 / Firefox 115 / etc]
- Browser B: [Incognito Chrome / Firefox / etc]

**Test Accounts:**
- Account A: @username_a
- Account B: @username_b

## Results by Section

### Part 1: Basic Session Isolation
- Step 1-3 Setup: PASSED / FAILED
- Step 4 Isolation: PASSED / FAILED
- Step 5 Navigation: PASSED / FAILED

### Part 2: Rapid Refresh
- Total refreshes: 20
- Session switches: 0
- Result: PASSED / FAILED

### Part 3: Cookie Inspection
- Cookie attributes correct: YES / NO
- Tokens different: YES / NO
- Result: PASSED / FAILED

### Part 4: Database Verification (if applicable)
- Two sessions found: YES / NO
- No duplicates: YES / NO
- Result: PASSED / FAILED

## Overall Result

**PASS** / **FAIL**

## Notes

[Any observations, warnings, or issues noticed during testing]

## Recommendations

[Any recommendations for improvements or follow-up actions]
```

---

## 🔄 Testing Frequency

Run this manual test:

- **Required:** Before every production deployment involving auth changes
- **Recommended:** Weekly in staging environment
- **Emergency:** After any session-related incident
- **Routine:** Monthly as part of security audit

---

## 📞 Support

If you have questions about this test or encounter issues:

- Check: `SESSION_MONITORING.md` for monitoring queries
- Check: `SESSION_EMERGENCY_CLEANUP.md` for emergency procedures
- Review: Recent changes in git history for auth files
- Contact: [Team Lead / Security Contact]

---

**Last Updated:** 2025-11-19  
**Next Review:** After any auth system changes

