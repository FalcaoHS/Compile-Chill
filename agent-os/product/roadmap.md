# Product Roadmap

1. [x] X OAuth Authentication — Implement NextAuth with X OAuth provider, allowing users to sign in with a single button and retrieve name, avatar, and ID from X account `S` ✅

2. [x] Theme System Foundation — Create theme switching infrastructure with 5 visual themes (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev), theme persistence, and global theme context using Zustand/Jotai `M` ✅

3. [x] Home Page with Game List — Build home page displaying all 10 games in a grid layout with theme-aware styling, game cards with descriptions, and navigation to individual game pages `S` ✅

4. [x] First Game: Terminal 2048 — Implement Terminal 2048 game with dev-themed tiles (files, folders, extensions), theme-aware styling, score tracking, and game over state. Include server-side game state validation to prevent score manipulation `M` ✅

5. [x] Game Score Storage — Create Prisma schema for game scores, API routes to save scores, and database models for users, games, and scores with proper relationships `S` ✅

5a. [ ] Security Foundation — Implement security middleware: protected API routes with NextAuth session validation, generic error handling (no sensitive error exposure), input validation with Zod schemas, and rate limiting on score submission endpoints `M`

5b. [ ] Game Score Validation System — Create server-side validation system that verifies game scores are legitimate: validate game state transitions, check for impossible scores, verify game duration matches score, and reject manipulated submissions `M`

6. [ ] User Profile Page — Build profile page displaying user avatar, name from X, game history, and basic statistics (total games played, best scores per game) with proper authorization checks `M`

7. [ ] Global Rankings Page — Create rankings page showing top players globally and per-game leaderboards with pagination, sorting, and theme-aware UI. Ensure all ranking data is read-only and properly sanitized `M`

8. [x] Second Game: Byte Match — Implement memory matching game with dev-themed pairs (Git icons, /src folders, coffee script, etc.), theme-aware styling, and score tracking `M` ✅

9. [x] Third Game: Dev Pong — Build minimal Pong game with futuristic aesthetics, theme integration, score tracking, and responsive controls `M` ✅

10. [x] Fourth Game: Bit Runner — Implement endless runner game with pixel character, dev-themed obstacles (compilers, bugs, brackets), distance tracking, and theme-aware visuals `L` ✅

11. [x] Fifth Game: Stack Overflow Dodge — Create dodge game where players avoid falling "errors" with power-ups ("resolveu!", "copiou do stackoverflow"), score tracking, and theme integration `M` ✅

12. [ ] Social Feed Page — Build internal timeline showing game results shared by users, with like and comment functionality, pagination, and theme-aware UI. Implement input sanitization for comments and validate all feed interactions server-side `L`

13. [ ] Share to Feed Feature — Add functionality for users to post their game results to the internal feed after completing a game, with optional message and automatic game data. Validate game result authenticity server-side before allowing feed posts `S`

14. [ ] X Sharing with Image Generation — Implement automatic image generation using html-to-image/canvas based on game results and current theme, with @vercel/og for social sharing, including automatic hashtags (#devtime, #jogosdev, #devdescompressao, #codingbreak) `M`

15. [ ] Sixth Game: Hack Grid — Build logic puzzle game where players connect network nodes by illuminating paths, with neon animations, theme integration, and score tracking `M`

16. [ ] Seventh Game: Debug Maze — Create maze game where players guide a "bug" to the patch, with retro pixel theme, score tracking, and theme-aware styling `M`

17. [ ] Eighth Game: Refactor Rush — Implement puzzle game where players reorganize "code blocks" to clean files, with particle effects on moves, theme integration, and score tracking `M`

18. [ ] Ninth Game: Crypto Miner Game — Build idle clicker game where players mine blocks, with simple scaling, light gamification, theme-aware UI, and score tracking `M`

19. [ ] Tenth Game: Packet Switch — Create routing logic game where players direct packets, with network particle animations, theme integration, and score tracking `M`

20. [ ] Achievement System — Implement achievement/medal system with unlockable achievements based on gameplay milestones, display on user profiles, and notification system `M`

21. [ ] Monthly Seasons — Add season system that resets rankings monthly, tracks season history, displays current season info, and manages season transitions automatically `M`

22. [ ] Header Navigation — Create fixed minimalist header with theme switcher, current mode indicator, navigation links, and user profile access `S`

23. [ ] Game Page Layout — Build consistent game page template with game canvas/area, score display, controls, theme-aware styling, and navigation back to home `S`

24. [ ] Responsive Design & Animations — Implement responsive layouts for all pages using TailwindCSS, add Framer Motion animations for smooth transitions, and ensure mobile-friendly game controls `M`

25. [ ] Security Hardening — Implement Content Security Policy (CSP) headers, finalize CORS configuration, add comprehensive input sanitization for all user-generated content, implement CSRF protection, and conduct security audit of all API endpoints `M`

> Notes
> - Order items by technical dependencies and product architecture
> - Each item should represent an end-to-end (frontend + backend) functional and testable feature
> - MVP path: Items 1-7 provide core functionality (auth, themes, home, first game, scores, profile, rankings)
> - Security is critical: Items 5a and 5b must be implemented before accepting any game scores to prevent manipulation
> - Social features (items 12-14) build on the foundation and require proper input validation
> - Remaining games (items 15-19) can be developed in parallel after core infrastructure is solid
> - Polish features (items 20-24) enhance the experience after core functionality is complete
> - Security hardening (item 25) should be completed before production launch

