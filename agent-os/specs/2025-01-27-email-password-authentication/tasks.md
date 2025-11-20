# Task Breakdown: Email/Password + Google OAuth Authentication

## Overview
Total Tasks: 6 groups, 40+ sub-tasks

## Task List

### Database Layer

#### Task Group 1: Schema Updates and Migrations
**Dependencies:** None

- [x] 1.0 Complete database layer updates
  - [ ] 1.1 Write 2-8 focused tests for User model with new fields
    - Test user creation without xId (email/password users)
    - Test user creation with xId (X OAuth users - backward compatibility)
    - Test unique constraint on email field
    - Test optional xId constraint (can be null)
    - Test encrypted name storage and retrieval
    - Skip exhaustive edge cases and performance tests
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 1.2 Update Prisma User model schema
    - Change xId from `String @unique` to `String? @unique` (make optional)
    - Add email field: `email String? @unique` (optional, unique)
    - Add passwordHash field: `passwordHash String?` (optional, for bcrypt hash)
    - Add nameEncrypted field: `nameEncrypted String?` (optional, for AES-256 encrypted name)
    - Change avatar field: `avatar String? @db.Text` (to support base64 data)
    - Maintain all existing fields: name, xUsername, theme, showPublicHistory, etc.
    - Keep all existing relationships and indexes
  - [x] 1.3 Create migration for schema changes
    - Generate migration to alter User table
    - Make xId nullable and maintain unique constraint
    - Add new columns (email, passwordHash, nameEncrypted)
    - Alter avatar column type to Text
    - Add index on email field for query performance
    - Ensure migration is backward compatible (existing X users continue working)
  - [x] 1.4 Verify database compatibility
    - Test migration runs successfully on existing database
    - Verify existing X-authenticated users remain functional
    - Verify new fields accept null values correctly
    - Ensure unique constraints work for both xId and email
  - [ ] 1.5 Ensure database layer tests pass
    - Run ONLY the 2-8 tests written in 1.1
    - Verify migrations run successfully
    - Verify User model can be created with and without xId
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 1.1 pass
- User model supports optional xId and email fields
- Migrations run successfully without breaking existing data
- Unique constraints work correctly for both xId and email
- Backward compatibility maintained for X-authenticated users

### Security & Encryption Utilities

#### Task Group 2: Encryption, Password, and Email Validation
**Dependencies:** Task Group 1

- [x] 2.0 Complete security utilities
  - [ ] 2.1 Write 2-8 focused tests for encryption utilities
    - Test name encryption and decryption
    - Test unique IV generation per encryption
    - Test decryption with wrong key fails
    - Test password hashing and comparison
    - Test email format validation
    - Skip exhaustive security testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 2.2 Create `lib/encryption.ts` for name encryption
    - Implement AES-256-GCM encryption function
    - Generate unique IV (initialization vector) for each encryption
    - Store IV with encrypted data (prepend or separate field)
    - Use ENCRYPTION_KEY from environment variable (32 bytes)
    - Implement decryption function with IV extraction
    - Handle encryption/decryption errors gracefully
  - [x] 2.3 Create `lib/password.ts` for password hashing
    - Implement bcrypt hash function (salt rounds 10-12)
    - Implement password comparison function (bcrypt.compare)
    - Validate password strength: 6-100 characters, no special requirements
    - Never store or log passwords in plain text
  - [x] 2.4 Create `lib/email-validation.ts` for email validation
    - Implement format validation with regex pattern
    - Extract domain from email address
    - Implement DNS lookup (check MX or A records)
    - Add 5-second timeout for DNS queries
    - Implement in-memory cache (Map) with 24-hour TTL for valid domains
    - Return true (accept) if DNS fails or times out (don't block users)
  - [x] 2.5 Create `lib/avatar.ts` for base64 conversion
    - Implement image to base64 conversion function
    - Validate file size (max 2MB before conversion)
    - Validate file type (jpg, png, webp only)
    - Return base64 string in format: `data:image/[type];base64,[data]`
    - Handle conversion errors gracefully
  - [ ] 2.6 Ensure security utilities tests pass
    - Run ONLY the 2-8 tests written in 2.1
    - Verify encryption/decryption works correctly
    - Verify password hashing and comparison works
    - Verify email validation works (format + DNS)
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 2.1 pass
- Names can be encrypted and decrypted correctly
- Passwords are hashed with bcrypt before storage
- Email validation checks format and domain existence
- Avatar images convert to base64 correctly
- All utilities handle errors gracefully

### NextAuth Configuration

#### Task Group 3: Google OAuth and Credentials Providers
**Dependencies:** Task Groups 1, 2

- [x] 3.0 Complete NextAuth configuration
  - [ ] 3.1 Write 2-8 focused tests for authentication flows
    - Test Google OAuth authentication flow
    - Test email/password authentication flow
    - Test "Remember Me" session duration (30 days vs 24 hours)
    - Test user creation for both providers
    - Test backward compatibility with X OAuth
    - Skip exhaustive error scenario testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 3.2 Add Google OAuth provider to NextAuth
    - Install Google provider from next-auth/providers/google
    - Configure with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from environment
    - Add Google provider to providers array in auth.config.ts
    - Configure callback to handle Google profile data
    - Set up redirect to `/setup-profile` for first-time Google users
  - [x] 3.3 Add Credentials provider for email/password
    - Create Credentials provider in auth.config.ts
    - Configure credentials: email (type: email), password (type: password)
    - Implement authorize function to validate email/password
    - Look up user by email in database
    - Compare provided password with stored passwordHash using bcrypt
    - Return user object or null based on validation
    - Handle "Remember Me" preference from credentials
  - [x] 3.4 Update auth adapter for multiple providers
    - Modify `createUser` in lib/auth-adapter.ts to handle users without xId
    - Support user creation with email/passwordHash for Credentials provider
    - Support user creation with Google account data (no xId)
    - Maintain existing X OAuth user creation logic
    - Update `getUserByAccount` to support Google provider lookup
  - [x] 3.5 Implement dynamic session duration (Remember Me)
    - Detect "Remember Me" preference in Credentials provider
    - Set session maxAge to 30 days when Remember Me is checked
    - Set session maxAge to 24 hours when Remember Me is unchecked
    - Configure cookie persistence based on Remember Me preference
    - Ensure session configuration works for all providers
  - [x] 3.6 Update signIn callback for Google OAuth
    - Handle Google profile data extraction (name, email, picture)
    - Check if user is first-time Google user (no User record exists)
    - Redirect first-time users to `/setup-profile` page
    - Skip setup for returning Google users
    - Store Google account link in Account table
  - [ ] 3.7 Ensure NextAuth configuration tests pass
    - Run ONLY the 2-8 tests written in 3.1
    - Verify Google OAuth flow works end-to-end
    - Verify email/password authentication works
    - Verify Remember Me affects session duration
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 3.1 pass
- Google OAuth provider works correctly
- Credentials provider validates email/password correctly
- Remember Me checkbox affects session duration
- Adapter supports all three providers (X, Google, Credentials)
- First-time Google users redirect to setup page

### API Routes

#### Task Group 4: API Updates for Multiple Providers
**Dependencies:** Task Groups 1, 2, 3

- [x] 4.0 Complete API route updates
  - [ ] 4.1 Write 2-8 focused tests for API routes
    - Test `/api/users/me` returns decrypted name
    - Test `/api/users/me` handles users without xId
    - Test `/api/users/[id]` returns decrypted name
    - Test `/api/users/[id]` uses fallback when no xId
    - Test backward compatibility with X-authenticated users
    - Skip exhaustive API testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 4.2 Update `/api/users/me` route
    - Decrypt `nameEncrypted` field when returning user data
    - Handle users without xId (use email or name as identifier)
    - Return avatar from base64 field (convert if needed)
    - Maintain backward compatibility with existing X users
    - Add error handling for decryption failures
  - [x] 4.3 Update `/api/users/[id]` route
    - Decrypt `nameEncrypted` field for public profile
    - Use fallback identifier when user has no xId (email or name)
    - Return avatar from base64 field
    - Maintain existing functionality for X-authenticated users
    - Handle decryption errors gracefully (return generic error)
  - [ ] 4.4 Ensure API route tests pass
    - Run ONLY the 2-8 tests written in 4.1
    - Verify name decryption works correctly
    - Verify fallback logic works for users without xId
    - Verify backward compatibility maintained
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 4.1 pass
- `/api/users/me` decrypts names and handles all provider types
- `/api/users/[id]` decrypts names and uses fallbacks correctly
- Backward compatibility maintained for X-authenticated users
- Error handling works for decryption failures

### Frontend Components

#### Task Group 5: UI Components for Authentication
**Dependencies:** Task Groups 3, 4

- [ ] 5.0 Complete UI components
  - [ ] 5.1 Write 2-8 focused tests for UI components
    - Test Google login button renders and functions
    - Test email/password login form validation
    - Test signup form submission
    - Test profile setup page for Google users
    - Test Remember Me checkbox affects session
    - Skip exhaustive UI state testing
    - **IGNORED: Tests are skipped per project instruction**
  - [x] 5.2 Create GoogleLoginButton component ✅
    - Reuse LoginButton component pattern from components/LoginButton.tsx
    - Display "Entrar com Google" text
    - Trigger NextAuth signIn with "google" provider
    - Show loading state during authentication
    - Handle errors with generic message
    - Make theme-aware with TailwindCSS
    - Ensure keyboard accessibility
  - [x] 5.3 Create EmailLoginForm component ✅
    - Create form with email and password fields
    - Add "Permanecer logado" checkbox
    - Implement client-side validation (email format, password length)
    - Show validation errors inline
    - Submit via NextAuth Credentials provider
    - Include link to signup page
    - Make theme-aware and responsive
  - [x] 5.4 Create SignupForm component ✅
    - Create form with name, email, password, confirm password fields
    - Add avatar picker section (predefined avatares + upload)
    - Implement client-side validation
    - Convert uploaded image to base64 before submission
    - Validate image size (max 2MB) and type (jpg/png/webp)
    - Show preview of selected avatar
    - Submit to /api/auth/signup endpoint
    - Auto-login after successful signup
  - [x] 5.5 Create `/signup` page ✅
    - Use SignupForm component
    - Add page layout with theme-aware styling
    - Include Google and X login buttons
    - Handle form submission and errors
    - Redirect to home after successful signup
    - Add link to login page
    - Make responsive (mobile, tablet, desktop)
  - [x] 5.6 Create `/setup-profile` page for Google OAuth ✅
    - Display form with "Nome a ser exibido" field (required)
    - Add avatar selection: use Google photo, predefined avatars, or upload
    - Convert chosen avatar to base64 before saving
    - Encrypt name before saving to database
    - Submit to /api/users/setup-profile endpoint
    - Redirect to home after submission
    - Show only for first-time Google users
  - [x] 5.7 Create AvatarPicker component ✅
    - Display grid of predefined avatares (6 options in base64)
    - Allow selection of predefined avatar
    - Allow upload of custom image
    - Support Google photo URL conversion
    - Show preview of selected avatar
    - Validate file size and type before conversion
    - Convert to base64 format
    - Make theme-aware and responsive
  - [x] 5.8 Create LoginModal component ✅
    - Modal with all login options (X, Google, Email/Password)
    - Can be used on home page or other pages
    - Maintains existing styling and layout
    - Responsive design
    - Note: Home page can use LoginModal if needed, but Header already has LoginButton
  - [x] 5.9 Create API routes ✅
    - Created /api/auth/signup route for email/password signup
    - Created /api/users/setup-profile route for Google profile setup
    - Both routes handle validation, encryption, and database operations
  - [ ] 5.10 Ensure UI component tests pass
    - Run ONLY the 2-8 tests written in 5.1
    - Verify all login methods work from UI
    - Verify signup form works correctly
    - Verify profile setup page works for Google users
    - Do NOT run the entire test suite at this stage
    - **IGNORED: Tests are skipped per project instruction**

**Acceptance Criteria:**
- The 2-8 tests written in 5.1 pass
- Google login button works correctly
- Email/password login form validates and submits
- Signup form creates users with encrypted data
- Profile setup page works for first-time Google users
- Avatar picker converts images to base64
- All components are theme-aware and responsive
- Remember Me checkbox affects session duration

### X Account Validation

#### Task Group 6: X Account Validation for Non-X Users
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Implement X account validation feature
  - [ ] 6.1 Create `/api/users/validate-x` endpoint
    - POST endpoint that requires authentication
    - Receives X account data (xId, xUsername, avatar) from request body
    - Updates existing User record (does not create new user)
    - Creates/updates Account record linking X provider to existing User
    - Validates that user doesn't already have xId (prevent duplicate validation)
    - Returns success/error response with appropriate status codes
    - Handles errors gracefully (duplicate xId, invalid data, etc.)
  - [ ] 6.2 Modify X OAuth callback in auth.config.ts
    - Detect if user is already authenticated (session exists)
    - If authenticated: treat as validation flow
      - Get current user from session
      - Update User with X data (xId, xUsername, avatar)
      - Create/update Account record for X provider
      - Return success without creating new user
    - If not authenticated: treat as normal login (existing behavior)
    - Ensure callback works for both login and validation scenarios
  - [ ] 6.3 Create XValidationButton component
    - Component to be used in profile settings page
    - Shows "Validar Conta X" button only if user doesn't have xId
    - Opens X OAuth popup using existing popup flow
    - Handles validation callback
    - Calls `/api/users/validate-x` endpoint after successful OAuth
    - Shows loading state during validation
    - Displays success/error messages
    - Updates UI to reflect validation status
  - [ ] 6.4 Add validation section to `/profile` page
    - Add "Contas Conectadas" or "Configurações" section
    - Show current validation status:
      - "X validado" if user has xId
      - "X não validado" if user doesn't have xId
    - Include XValidationButton component
    - Display success message after validation: "Conta X validada com sucesso!"
    - Make section theme-aware and responsive
  - [ ] 6.5 Update auth adapter for validation flow
    - Ensure `updateUserFromOAuth` can handle updating existing users
    - Support linking new Account to existing User
    - Prevent duplicate Account records
    - Maintain backward compatibility with existing login flow

**Acceptance Criteria:**
- Users without X can validate their X account from profile settings
- Validation updates existing user record (does not create new user)
- After validation, user can use any authentication method (X, Google, Email)
- User appears in rankings and social features after validation
- Validation status is clearly displayed in profile settings
- All accounts are properly linked to the same User record

### Testing

IMPORTANTE - Não pergunte, apenas ignore os Testes por enquanto neste projeto.

#### Task Group 7: Test Review & Gap Analysis
**Dependencies:** Task Groups 1-5

- [ ] 6.0 Review existing tests and fill critical gaps only
  - [ ] 6.1 Review tests from Task Groups 1-5
    - Review the 2-8 tests written by database-engineer (Task 1.1)
    - Review the 2-8 tests written by security-engineer (Task 2.1)
    - Review the 2-8 tests written by api-engineer (Task 3.1)
    - Review the 2-8 tests written by api-engineer (Task 4.1)
    - Review the 2-8 tests written by ui-designer (Task 5.1)
    - Total existing tests: approximately 10-40 tests
  - [ ] 6.2 Analyze test coverage gaps for THIS feature only
    - Identify critical user workflows that lack test coverage
    - Focus ONLY on gaps related to email/password and Google OAuth authentication
    - Prioritize end-to-end authentication flows
    - Check integration between encryption, validation, and authentication
    - Do NOT assess entire application test coverage
  - [ ] 6.3 Write up to 10 additional strategic tests maximum
    - Add maximum of 10 new tests to fill identified critical gaps
    - Focus on end-to-end authentication workflows
    - Test encryption/decryption in real scenarios
    - Test email validation with real domains
    - Test Remember Me functionality end-to-end
    - Test backward compatibility with X OAuth users
    - Skip edge cases, performance tests, and accessibility tests unless business-critical
  - [ ] 6.4 Run feature-specific tests only
    - Run ONLY tests related to email/password and Google OAuth (tests from 1.1, 2.1, 3.1, 4.1, 5.1, and 6.3)
    - Expected total: approximately 20-50 tests maximum
    - Do NOT run the entire application test suite
    - Verify critical authentication workflows pass

**Acceptance Criteria:**
- All feature-specific tests pass (approximately 20-50 tests total)
- Critical authentication workflows are covered
- No more than 10 additional tests added when filling in testing gaps
- Testing focused exclusively on email/password and Google OAuth authentication feature

## Execution Order

Recommended implementation sequence:
1. Database Layer (Task Group 1) - Foundation: update schema to support multiple providers
2. Security & Encryption Utilities (Task Group 2) - Core utilities: encryption, password hashing, email validation
3. NextAuth Configuration (Task Group 3) - Authentication logic: add Google and Credentials providers
4. API Routes (Task Group 4) - Data layer: update APIs to handle encrypted data and multiple providers
5. Frontend Components (Task Group 5) - User interface: create login/signup forms and pages
6. X Account Validation (Task Group 6) - Allow non-X users to validate X account later
7. Test Review & Gap Analysis (Task Group 7) - Quality assurance: ensure comprehensive coverage

