# Specification: Email/Password + Google OAuth Authentication

## Goal
Implement alternative authentication methods (Email/Password and Google OAuth) alongside existing X OAuth to provide users with multiple login options when X authentication fails, while maintaining full compatibility with existing X-authenticated users and ensuring secure storage of sensitive data (encrypted names, hashed passwords, base64 avatars).

## User Stories
- As a user experiencing X login issues, I want to sign up with email and password so that I can access the platform without depending on X authentication
- As a new user, I want to sign in with Google OAuth so that I can quickly create an account using my existing Google credentials
- As an authenticated user, I want my name to be securely encrypted and my password hashed so that my personal data is protected
- As a user who signed up with email/password or Google, I want to validate my X account later so that I can participate in rankings and social features
- As a user with a validated X account, I want to use any authentication method (X, Google, or Email) to access my account

## Specific Requirements

**Database Schema Updates**
- Make `xId` field optional in User model (change from `String @unique` to `String? @unique`)
- Add `email` field as optional unique string for email/password authentication
- Add `passwordHash` field as optional string for bcrypt-hashed passwords
- Add `nameEncrypted` field as optional string for AES-256 encrypted user names
- Change `avatar` field type to `String? @db.Text` to store base64-encoded images
- Maintain all existing relationships and indexes
- Ensure migration is backward compatible with existing X-authenticated users

**Email/Password Authentication (Credentials Provider)**
- Create `/signup` page with form for name, email, password, confirm password, and avatar selection
- Implement NextAuth Credentials Provider that validates email/password against database
- Hash passwords with bcrypt (salt rounds 10-12) before storing in database
- Encrypt user names with AES-256-GCM before storing (key from environment variable, unique IV per record)
- Validate email format with regex and verify domain exists via DNS lookup (MX or A record)
- Cache domain validation results for 24 hours to avoid repeated DNS queries
- Implement simple password rules: minimum 6 characters, maximum 100 characters, no special requirements
- Convert uploaded avatar images to base64 format (max 2MB, jpg/png/webp only) before storing

**Google OAuth Provider**
- Add Google OAuth provider to NextAuth configuration using environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
- After successful Google authentication, redirect first-time users to `/setup-profile` page
- On `/setup-profile`, request display name (to be encrypted) and avatar choice (use Google photo, select predefined avatar, or upload custom image)
- Skip setup page for users who have already configured their profile
- Store Google account link in Account table with provider "google"
- Encrypt display name and convert chosen avatar to base64 before saving to database

**Authentication UI Components**
- Extend existing LoginButton component pattern to create GoogleLoginButton and EmailLoginButton variants
- Add "Entrar com Google" button alongside existing "Entrar com X" button on home page
- Add "Ou entrar com Email e Senha" link that expands to show email/password login form
- Include "Permanecer logado" checkbox in email/password login form
- Create signup form component with avatar picker (predefined avatars in base64 + upload option)
- Maintain theme-aware styling consistent with existing LoginButton and ProfileButton components
- Ensure all new components are keyboard accessible and screen reader friendly

**Session Management with Remember Me**
- Implement dynamic session duration based on "Permanecer logado" checkbox state
- When checkbox is checked: set session maxAge to 30 days with persistent cookie
- When checkbox is unchecked: set session maxAge to 24 hours with session cookie
- Configure NextAuth session strategy to use database sessions (already configured)
- Ensure session creation respects remember me preference from credentials provider

**Email Validation Service**
- Create `lib/email-validation.ts` with format validation (regex) and domain verification (DNS)
- Extract domain from email address and verify MX or A records exist
- Implement 5-second timeout for DNS queries to prevent blocking
- Cache valid domains in memory (Map) with 24-hour TTL
- Return true (accept email) if DNS verification fails or times out (don't block users)
- Provide user feedback during validation: "Verificando email..." message

**Encryption and Security Utilities**
- Create `lib/encryption.ts` with functions to encrypt/decrypt user names using AES-256-GCM
- Generate unique IV (initialization vector) for each encrypted name
- Store IV alongside encrypted data (prepend or use separate field)
- Use 32-byte encryption key from ENCRYPTION_KEY environment variable
- Create `lib/password.ts` with bcrypt hash and compare functions
- Ensure password validation happens before hashing
- Never store passwords in plain text or log sensitive data

**API Route Updates**
- Update `/api/users/me` to decrypt `nameEncrypted` field when returning user data
- Add fallback logic for users without `xId` (use email or name as identifier)
- Update `/api/users/[id]` to decrypt names and handle users without `xId` gracefully
- Ensure all API responses maintain backward compatibility with existing X-authenticated users
- Add error handling for decryption failures (return generic error, log details server-side)

**Auth Adapter Modifications**
- Modify `lib/auth-adapter.ts` `createUser` method to handle users without `xId` (email/password and Google users)
- Update `getUserByAccount` to support Google provider lookup via Account table
- Ensure adapter works for all three providers: Twitter, Google, and Credentials
- Maintain existing X OAuth functionality without breaking changes
- Handle user creation with encrypted name and hashed password for Credentials provider

**Profile Setup Page for Google OAuth**
- Create `/setup-profile` page that appears only after first Google authentication
- Display form with required "Nome a ser exibido" field and avatar selection options
- Provide three avatar options: use Google photo (convert to base64), select from predefined avatars, or upload custom image
- Validate name is not empty and encrypt before saving
- Convert chosen avatar to base64 format (max 2MB) before storing
- After submission, create User record and redirect to home page
- Store flag to prevent showing setup page on subsequent Google logins

**X Account Validation for Non-X Users**
- Users who authenticate with X enter directly into the system (ranking, social features enabled)
- Users who sign up with Email/Password or Google can validate their X account later from profile settings
- Create `/api/users/validate-x` endpoint (POST) that:
  - Requires authentication (user must be logged in)
  - Receives X account data (xId, xUsername, avatar) from OAuth callback
  - Updates existing User record (does not create new user)
  - Creates/updates Account record linking X to existing User
  - Returns success/error response
- Modify X OAuth callback to detect if user is already authenticated:
  - If authenticated: treat as validation (update existing user, link X account)
  - If not authenticated: treat as normal login (create or find user)
- Add X validation UI component in `/profile` page:
  - Show "Validar Conta X" button only if user doesn't have xId
  - Open X OAuth popup for validation
  - After successful validation, call `/api/users/validate-x` endpoint
  - Update UI to show validation status
  - Display success message: "Conta X validada com sucesso!"
- After X validation:
  - User can use any authentication method (X, Google, Email) to access account
  - All accounts are linked to the same User record
  - User appears in rankings and social features
  - User can participate in all X-integrated functionality

## Visual Design
No visual assets provided. Design will follow existing authentication component patterns (LoginButton, ProfileButton) with theme-aware TailwindCSS styling, maintaining consistency with current UI/UX.

## Existing Code to Leverage

**LoginButton Component (`components/LoginButton.tsx`)**
- Reuse button structure, loading states, error handling, and theme-aware styling patterns
- Create variants for Google and Email login buttons following same component architecture
- Maintain consistent user experience across all authentication methods

**ProfileButton Component (`components/ProfileButton.tsx`)**
- No changes needed - component already works with any authenticated user regardless of provider
- Will automatically display avatars from base64 data once APIs are updated to return them

**Auth Adapter (`lib/auth-adapter.ts`)**
- Extend existing custom adapter to support multiple providers instead of only Twitter
- Reuse session creation, user lookup, and account linking patterns
- Modify `createUser` and `getUserByAccount` methods to handle users without `xId`

**NextAuth Configuration (`auth.config.ts`)**
- Add Google provider alongside existing Twitter provider
- Add Credentials provider for email/password authentication
- Reuse existing session configuration, cookie settings, and callback patterns
- Maintain existing Twitter OAuth functionality without modifications

**API Routes (`app/api/users/me/route.ts`, `app/api/users/[id]/route.ts`)**
- Extend existing user data retrieval logic to decrypt names and handle multiple provider types
- Reuse authentication middleware and error handling patterns
- Add fallback logic for users without `xId` while maintaining backward compatibility

## Out of Scope
- Email verification via SMTP (only format and domain validation, no email sending)
- Password recovery/reset functionality (requires SMTP for email delivery)
- Real-time email validation during typing (validation only on form submission)
- Multiple avatars per user (single avatar stored as base64)
- Profile editing after account creation (future enhancement)
- Integration with additional OAuth providers (GitHub, Facebook, etc.)
- Two-factor authentication or additional security layers
- Account deletion or deactivation features
- Email change functionality after signup
- Social login account linking (connecting multiple providers to one account)

