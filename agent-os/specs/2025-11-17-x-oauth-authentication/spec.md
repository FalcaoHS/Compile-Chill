# Specification: X OAuth Authentication

## Goal
Implement NextAuth with X (Twitter) OAuth provider to enable users to authenticate with a single button, retrieve their X account information (name, avatar, ID), and manage their session through a database-backed authentication system.

## User Stories
- As a developer, I want to sign in with my X account using a single button so that I can quickly access the platform without creating a separate account
- As an authenticated user, I want to see my profile information and easily log out so that I can manage my session securely

## Specific Requirements

**NextAuth Configuration**
- Configure NextAuth.js with X OAuth provider using environment variables for client ID and secret
- Set up NextAuth API route handler at `/api/auth/[...nextauth]` using App Router pattern
- Configure database adapter (Prisma) for session persistence instead of JWT
- Set callback URL to redirect to home page after successful authentication
- Configure session strategy to use database sessions

**Prisma User Model**
- Create User model with fields: id (auto-increment), name (string), avatar (string, nullable), xId (string, unique), createdAt (timestamp), updatedAt (timestamp)
- Add NextAuth required tables via Prisma adapter: Account, Session, VerificationToken
- Ensure xId has unique constraint to prevent duplicate accounts
- Add indexes on xId and id for query performance

**Login Button Component**
- Create reusable login button component that displays "Entrar com X" when user is not authenticated
- Button should trigger NextAuth signIn function with X provider
- Show loading state with "Conectando…" text and small spinner during authentication
- Handle authentication errors with generic message: "Não foi possível fazer login. Tente novamente."
- Component should be theme-aware to match application's visual themes

**Header Integration**
- Place login button in fixed header component
- When authenticated, replace button with "Perfil" button showing user avatar
- "Perfil" button should have dropdown menu with "Sair" (logout) option
- Dropdown should be accessible via keyboard navigation and screen readers
- Header should persist across all pages

**Home Page Integration**
- Add prominent version of login button on home page for unauthenticated users
- Button should match header button functionality and styling
- Remove or hide button when user is authenticated

**User Data Management**
- On first authentication, create User record in database with X account data
- On subsequent authentications, update existing User record if X account data changed
- Store only necessary data: name, avatar URL, and X account ID
- Session should reference persisted user ID for future features (rankings, scores, feed)

**Logout Functionality**
- Implement logout via NextAuth signOut function
- Logout should clear session from database and client
- After logout, redirect user to home page
- Logout accessible from "Perfil" dropdown menu in header

**Error Handling**
- Catch and handle authentication errors at API route level
- Return generic error messages to frontend (no technical details)
- Log detailed error information server-side only
- Display user-friendly error message: "Não foi possível fazer login. Tente novamente."
- Handle network errors, OAuth provider errors, and database errors gracefully

**Session Management**
- Use NextAuth database adapter for session persistence
- Session should include user ID for future feature integration
- Configure session expiration and refresh behavior
- Ensure session data is securely stored and transmitted

**Environment Configuration**
- Store X OAuth credentials in environment variables (NEXTAUTH_URL, X_CLIENT_ID, X_CLIENT_SECRET, NEXTAUTH_SECRET)
- Configure callback URLs for development and production environments
- Document required environment variables in project setup

## Visual Design
No visual assets provided.

## Existing Code to Leverage
No existing authentication code or components to reuse. This is the foundational authentication feature.

## Out of Scope
- Protected pages or route middleware for authentication checks
- User profile page display (only authentication, not profile viewing)
- Integration with rankings, scores, or feed features
- Password-based authentication or email/password login
- Email verification or account activation
- Account management features (password reset, email change, etc.)
- Multi-provider authentication (only X OAuth, no Google, GitHub, etc.)
- Two-factor authentication or additional security layers
- User role management or permissions system
- Session timeout warnings or automatic logout

