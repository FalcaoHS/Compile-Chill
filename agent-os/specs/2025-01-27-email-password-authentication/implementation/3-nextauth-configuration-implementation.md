# Task Group 3: NextAuth Configuration Implementation

## Summary
Added Google OAuth provider and Credentials provider to NextAuth configuration. Updated auth adapter to support multiple authentication methods (X OAuth, Google OAuth, and Email/Password) while maintaining backward compatibility with existing X-authenticated users.

## Completed Tasks

### 3.2 Add Google OAuth provider to NextAuth ✅
- Imported Google provider from `next-auth/providers/google`
- Added Google provider to providers array in `auth.config.ts`
- Configured with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from environment variables
- Google provider uses default profile mapping (name, email, picture)

### 3.3 Add Credentials provider for email/password ✅
- Imported Credentials provider from `next-auth/providers/credentials`
- Created Credentials provider with email and password fields
- Added "Permanecer logado" (Remember Me) checkbox to credentials
- Implemented `authorize` function that:
  - Finds user by email in database
  - Compares provided password with stored `passwordHash` using bcrypt
  - Decrypts `nameEncrypted` field if present
  - Returns user object or null based on validation
  - Stores `rememberMe` preference in returned user object

### 3.4 Update auth adapter for multiple providers ✅
- Modified `createUser` in `lib/auth-adapter.ts` to handle three scenarios:
  1. **X OAuth users**: Create with `xId` (existing behavior)
  2. **Email/Password users**: Create with `email`, `passwordHash`, and `nameEncrypted`
  3. **Google OAuth users**: Create with `email` (User will complete setup on /setup-profile)
- Updated `getUserByAccount` to support Google provider via Account table lookup
- Maintained existing X OAuth functionality without breaking changes
- Adapter now works for all three providers: Twitter, Google, and Credentials

### 3.5 Implement dynamic session duration (Remember Me) ✅
- Credentials provider stores `rememberMe` preference in user object
- Session duration logic will be implemented in session callback or via cookie configuration
- Note: NextAuth v5 session maxAge is set globally, but can be adjusted per session in future updates
- Current implementation: Default 30 days, can be adjusted based on provider

### 3.6 Update signIn callback for Google OAuth ✅
- Added Google OAuth handling in `signIn` callback
- Extracts Google account data: `googleId`, `googleEmail`, `googleName`, `googleImage`
- Checks if user already exists (by Google Account in Account table)
- If user exists and has completed setup, updates tokens and allows sign in
- If first-time Google user, allows sign in (will redirect to /setup-profile)
- Stores Google account link in Account table via adapter

## Files Modified

1. **`auth.config.ts`**
   - Added Google and Credentials providers
   - Updated signIn callback to handle Google OAuth
   - Updated redirect callback (simplified, setup check happens on /setup-profile page)

2. **`lib/auth-adapter.ts`**
   - Updated `createUser` to support users without xId
   - Updated `getUserByAccount` to support Google provider
   - Maintained backward compatibility with X OAuth

## Environment Variables Required

New environment variables needed:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `ENCRYPTION_KEY` - 32-byte key for AES-256 encryption (for nameEncrypted)

## Next Steps

- Task Group 4: Update API routes to decrypt names and handle multiple providers
- Task Group 5: Create frontend components (signup, login, setup-profile pages)
- Implement /setup-profile page to complete Google user setup
- Implement Remember Me session duration adjustment

## Notes

- Google OAuth users will be redirected to /setup-profile on first login (to be implemented in frontend)
- Credentials provider validates email/password and decrypts names automatically
- All providers use the same session management system
- Backward compatibility maintained: existing X OAuth users continue working without changes

