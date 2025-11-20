# Spec Requirements: X OAuth Authentication

## Initial Description
X OAuth Authentication — Implement NextAuth with X OAuth provider, allowing users to sign in with a single button and retrieve name, avatar, and ID from X account

## Requirements Discussion

### First Round Questions

**Q1:** I assume the "Entrar com X" button will appear on the home page or in a fixed header. Should we have a dedicated login page (`/login`) or keep the button inline on the home/header?

**Answer:** Botão "Entrar com X" ficará no header fixo + versão destacada na home. Não terá página /login dedicada — não precisa.

**Q2:** I'm thinking that after successful authentication, we should redirect to the home page or keep the user on the current page. If the user is already authenticated, should the button change to "Profile" or "Sign Out"?

**Answer:** Após login bem-sucedido, redirecionar sempre para a Home. Se o usuário já estiver autenticado, o botão vira "Perfil", com um menu contendo "Sair".

**Q3:** I'm assuming that after retrieving name, avatar, and ID from X, we should create/update a record in the database (Prisma) on first authentication. Or should we just use NextAuth session?

**Answer:** Sim: criar/atualizar o registro no banco (Prisma) na primeira autenticação. A sessão pega apenas os dados necessários — não armazenamos tudo só na session.

**Q4:** I'm assuming that for authentication failures, we should show generic error messages (e.g., "Unable to sign in. Please try again.") without exposing technical details. Is that correct?

**Answer:** Sim. Mensagem genérica: "Não foi possível fazer login. Tente novamente." Sem logs sensíveis no front.

**Q5:** I'm thinking we should use NextAuth's default session configuration (JWT or database session). Since we need the user ID for rankings and scores, should we prefer database session?

**Answer:** Sessão no banco (via NextAuth adapter). Necessário porque rankings, posts e feed dependem do ID persistido.

**Q6:** Should we include a logout button/functionality in this feature, or leave it for later? If yes, where should it appear (header, profile menu)?

**Answer:** Terá logout desde o início. Local: menu dentro do botão Perfil (avatar) no header.

**Q7:** I'm assuming we should show loading states during the authentication process. Should we show a loading state on the button or a global spinner?

**Answer:** Sim, obrigatórios: No botão → "Conectando…" + spinner pequeno. Efeito leve global (fade) opcional, mas não necessário.

**Q8:** I'm assuming this feature covers only the initial login functionality. Protected pages, authentication middleware, and integration with other features (profile, rankings) will be handled in later roadmap items. Is that correct, or are there any other aspects we should include in this feature?

**Answer:** Confirmado: Esta feature cobre apenas login e sessão. Páginas protegidas, middleware, perfil, ranking etc → próximos itens do roadmap.

### Existing Code to Reference

No similar existing features identified for reference.

The project appears to be in early stages with no existing authentication code or components to reuse.

### Follow-up Questions

No follow-up questions needed. All requirements were clearly answered.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements
- **Login Button Location:** 
  - Primary: Fixed header with "Entrar com X" button
  - Secondary: Prominent version on home page
  - No dedicated `/login` page needed

- **Authentication Flow:**
  - Single button "Entrar com X" triggers X OAuth flow
  - After successful authentication, always redirect to Home page
  - Button state changes based on authentication status:
    - Not authenticated: Shows "Entrar com X"
    - Authenticated: Shows "Perfil" with dropdown menu containing "Sair" (logout)

- **Data Management:**
  - Create/update user record in database (Prisma) on first authentication
  - Store: name, avatar, and ID from X account
  - Use NextAuth database adapter for session persistence
  - Session contains only necessary data, not all user information

- **Error Handling:**
  - Generic error message: "Não foi possível fazer login. Tente novamente."
  - No sensitive error details exposed to frontend
  - Detailed errors logged server-side only

- **Loading States:**
  - Button shows "Conectando…" text with small spinner during authentication
  - Optional global fade effect (not required)

- **Logout Functionality:**
  - Included in this feature
  - Accessible via dropdown menu in "Perfil" button (avatar) in header

- **Session Management:**
  - Database session via NextAuth adapter
  - Required for future features (rankings, posts, feed) that depend on persisted user ID

### Reusability Opportunities
- No existing authentication components or patterns to reuse
- This is the foundational authentication feature for the application
- Future features (profile page, protected routes, middleware) will build upon this implementation

### Scope Boundaries
**In Scope:**
- NextAuth configuration with X (Twitter) OAuth provider
- Login button in header and home page
- User data retrieval (name, avatar, ID) from X account
- Database user record creation/update on first authentication
- Session management via NextAuth database adapter
- Logout functionality in profile dropdown menu
- Loading states on login button
- Generic error handling for authentication failures
- Redirect to home page after successful login
- Button state changes (login → profile) based on authentication status

**Out of Scope:**
- Protected pages/routes (middleware for route protection)
- User profile page display
- Integration with rankings, scores, or feed features
- Password-based authentication
- Email verification
- Account management features
- Multi-provider authentication (only X OAuth)

### Technical Considerations
- **Technology Stack:**
  - Next.js 14 (App Router)
  - NextAuth.js with X OAuth provider
  - Prisma ORM with PostgreSQL
  - NextAuth database adapter for session management

- **Integration Points:**
  - X OAuth API for authentication
  - Prisma schema for User model
  - NextAuth API routes (`/api/auth/[...nextauth]`)
  - Header component for login button
  - Home page for prominent login button placement

- **Security Requirements:**
  - Generic error messages (no sensitive information exposure)
  - Secure storage of OAuth credentials in environment variables
  - Server-side validation of authentication tokens
  - Session management via secure database adapter

- **User Experience:**
  - Single-click authentication flow
  - Clear visual feedback during authentication (loading state)
  - Seamless redirect to home after login
  - Intuitive button state changes (login ↔ profile)

- **Database Schema:**
  - User model with fields: id, name, avatar, xId (X account ID)
  - NextAuth session and account tables (via adapter)
  - Timestamps for created/updated tracking

