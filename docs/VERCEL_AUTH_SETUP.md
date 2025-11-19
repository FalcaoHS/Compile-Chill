# Vercel Authentication Setup Guide

Complete guide for configuring authentication environment variables on Vercel to ensure secure session handling and prevent session leakage.

---

## ⚠️ CRITICAL: Session Security Configuration

**This configuration is essential to prevent session leakage between users.**

The session isolation security fix requires specific environment variable configuration in Vercel. Incorrect configuration can lead to cookies with wrong domains, causing session leakage.

---

## Required Environment Variables

### 1. NEXTAUTH_URL

**Purpose:** Defines the canonical URL of your application. Used for cookie domain extraction and OAuth callbacks.

**Format:** `https://[your-domain]`

**Production Example:**
```
NEXTAUTH_URL=https://compileandchill.dev
```

**⚠️ IMPORTANT:**
- MUST start with `https://` in production (not `http://`)
- MUST match your custom domain exactly
- MUST NOT include trailing slash
- MUST NOT include port number (`:443` is implicit for HTTPS)

**Common Mistakes:**
- ❌ `http://compileandchill.dev` (missing HTTPS)
- ❌ `https://compileandchill.dev/` (trailing slash)
- ❌ `compileandchill.dev` (missing protocol)
- ❌ `https://your-app.vercel.app` (using Vercel domain instead of custom domain)
- ✅ `https://compileandchill.dev` (CORRECT)

---

### 2. NEXTAUTH_SECRET

**Purpose:** Secret key for encrypting session tokens. Must be unique and cryptographically secure.

**Format:** At least 32 characters, randomly generated

**How to Generate:**

**On Windows (PowerShell):**
```powershell [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On Linux/Mac:**
```bash openssl rand -base64 32
```

**Online (if openssl not available):**
- Visit: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Copy the generated string

**Production Example:**
```
NEXTAUTH_SECRET=Xg7J2kP9mNqR5sT8vYzA3bC6dE1fH4iK7lM0nO2pQ5rS8t
```

**⚠️ IMPORTANT:**
- MUST be at least 32 characters
- MUST be different from development
- MUST be kept secret (never commit to Git)
- SHOULD be regenerated if compromised

---

### 3. X_CLIENT_ID

**Purpose:** Twitter/X OAuth application Client ID

**Format:** String provided by Twitter Developer Portal

**Where to Get:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. Go to "Keys and tokens" tab
4. Copy "OAuth 2.0 Client ID"

**Production Example:**
```
X_CLIENT_ID=YourClientIDFromTwitter123
```

---

### 4. X_CLIENT_SECRET

**Purpose:** Twitter/X OAuth application Client Secret

**Format:** String provided by Twitter Developer Portal

**Where to Get:**
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. Go to "Keys and tokens" tab
4. Copy "OAuth 2.0 Client Secret"

**Production Example:**
```
X_CLIENT_SECRET=YourClientSecretFromTwitter456
```

**⚠️ IMPORTANT:**
- Keep this secret secure
- Never commit to Git or share publicly

---

### 5. DATABASE_URL (Required)

**Purpose:** PostgreSQL database connection string

**Format:** `postgresql://[user]:[password]@[host]/[database]`

**Neon Example:**
```
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-1.aws.neon.tech/compileandchill?sslmode=require
```

---

### 6. Upstash Redis (Optional but Recommended)

**Purpose:** Rate limiting to prevent API abuse

**Variables:**
```
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Where to Get:**
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a Redis database
3. Copy REST URL and REST TOKEN

**Note:** Rate limiting will be disabled without these variables, but authentication will still work.

---

## Step-by-Step Vercel Configuration

### Step 1: Access Environment Variables

1. Go to your Vercel project dashboard
2. Click on **"Settings"** tab
3. Click on **"Environment Variables"** in left sidebar

### Step 2: Add Each Variable

For **each** of the required variables above:

1. Click **"Add New"** button
2. **Key:** Enter the variable name (e.g., `NEXTAUTH_URL`)
3. **Value:** Enter the variable value (e.g., `https://compileandchill.dev`)
4. **Environments:** Select **Production** (also select Preview if you want)
5. Click **"Save"**

### Step 3: Verify Configuration

After adding all variables, you should see:

```
✅ NEXTAUTH_URL (Production)
✅ NEXTAUTH_SECRET (Production)
✅ X_CLIENT_ID (Production)
✅ X_CLIENT_SECRET (Production)
✅ DATABASE_URL (Production)
✅ UPSTASH_REDIS_REST_URL (Production) [Optional]
✅ UPSTASH_REDIS_REST_TOKEN (Production) [Optional]
```

### Step 4: Redeploy

**IMPORTANT:** Environment variable changes require a redeploy.

1. Go to **"Deployments"** tab
2. Click **"..."** menu on latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

---

## Twitter OAuth Callback URL

**CRITICAL:** Twitter Developer Portal must have the correct callback URL.

### Production Callback URL

```
https://compileandchill.dev/api/auth/callback/twitter
```

**Steps to Configure:**

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Select your app
3. Click **"User authentication settings"**
4. Under **"Callback URI / Redirect URL"**, add:
   ```
   https://compileandchill.dev/api/auth/callback/twitter
   ```
5. Click **"Save"**

**⚠️ IMPORTANT:**
- MUST use `https://` (not `http://`)
- MUST match your `NEXTAUTH_URL` domain
- MUST end with `/api/auth/callback/twitter`

---

## Validation Checklist

After configuration, verify:

- [ ] `NEXTAUTH_URL` starts with `https://` in production
- [ ] `NEXTAUTH_URL` matches your custom domain exactly
- [ ] `NEXTAUTH_SECRET` is at least 32 characters
- [ ] `NEXTAUTH_SECRET` is different from development
- [ ] `X_CLIENT_ID` and `X_CLIENT_SECRET` are set
- [ ] Twitter callback URL matches `NEXTAUTH_URL` domain
- [ ] Environment variables are set for **Production** environment
- [ ] Deployment completed successfully after adding variables

---

## Testing After Deployment

### 1. Check Server Logs

After deployment, check Vercel logs:

```
✅ Authentication environment validation passed
```

If you see errors, fix the indicated variables and redeploy.

### 2. Test Login Flow

1. Visit your production site: `https://compileandchill.dev`
2. Click "Login" or "Entrar com X"
3. Authorize with Twitter/X
4. Verify you're redirected back and logged in
5. Refresh the page - you should stay logged in
6. Check browser cookies (DevTools → Application → Cookies)
   - Should see `__Secure-next-auth.session-token`
   - Domain should be `.compileandchill.dev`
   - Flags should include `Secure`, `HttpOnly`, `SameSite=Lax`

### 3. Test Session Isolation

**CRITICAL TEST:**

1. Open browser in normal mode, login as User A
2. Open browser in incognito mode, login as User B
3. Refresh both browsers multiple times
4. Verify User A never sees User B's data
5. Verify User B never sees User A's data

---

## Troubleshooting

### Issue: "Authentication environment validation failed"

**Cause:** Missing or invalid environment variables

**Solution:**
1. Check Vercel logs for specific error messages
2. Verify each variable is set correctly
3. Ensure variable names match exactly (case-sensitive)
4. Redeploy after fixing

### Issue: "Callback URL mismatch" or OAuth error

**Cause:** Twitter callback URL doesn't match NEXTAUTH_URL

**Solution:**
1. Verify `NEXTAUTH_URL` in Vercel matches your domain
2. Update Twitter Developer Portal callback URL to match
3. Ensure both use `https://` and correct domain

### Issue: Cookies not being set or wrong domain

**Cause:** NEXTAUTH_URL misconfigured

**Solution:**
1. Verify `NEXTAUTH_URL` format is correct: `https://compileandchill.dev`
2. Check browser DevTools → Application → Cookies
3. Cookie domain should be `.compileandchill.dev` (with leading dot)
4. Redeploy after fixing `NEXTAUTH_URL`

### Issue: Session works but logs out on refresh

**Cause:** Cookie not persisting, possibly wrong domain

**Solution:**
1. Check `NEXTAUTH_URL` is your custom domain, not `.vercel.app`
2. Verify cookie domain in browser matches site domain
3. Ensure `NEXTAUTH_SECRET` is set and correct

---

## Security Best Practices

1. **Use Different Secrets:** Never use the same `NEXTAUTH_SECRET` for dev/staging/production
2. **Rotate Secrets:** If `NEXTAUTH_SECRET` is compromised, regenerate it (will log out all users)
3. **Keep Secrets Secure:** Never commit secrets to Git or share them publicly
4. **Monitor Sessions:** Use session monitoring queries to detect anomalies
5. **Verify Isolation:** Regularly test that sessions are properly isolated between users

---

## Support Resources

- **NextAuth.js Docs:** [https://next-auth.js.org/](https://next-auth.js.org/)
- **Vercel Docs:** [https://vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
- **Twitter Developer Portal:** [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)

---

## Emergency: Session Leakage Detected

If session leakage is detected in production:

1. **IMMEDIATELY:** Pause all deployments in Vercel
2. Check `NEXTAUTH_URL` configuration
3. Check cookie configuration in browser DevTools
4. Run session monitoring SQL queries (see `docs/SESSION_MONITORING.md`)
5. If needed, clear all sessions: see emergency cleanup procedure
6. Fix configuration issues
7. Redeploy with correct configuration
8. Test thoroughly before enabling again

**Contact:** Keep team available for rapid response if issues detected

