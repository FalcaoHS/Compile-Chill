# Specification: Theme System Foundation

## Goal
Create a comprehensive theme switching infrastructure with 5 distinct visual themes (Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev) that enables users to switch themes instantly with smooth transitions, persistent preferences, and visually impactful theme-specific effects.

## User Stories
- As a developer, I want to switch between 5 unique visual themes instantly so that I can personalize my experience and match my aesthetic preferences
- As an authenticated user, I want my theme preference to sync across devices so that I have a consistent experience everywhere I access the platform
- As a user, I want smooth, visually appealing transitions when switching themes so that the experience feels polished and professional

## Specific Requirements

**CSS Custom Properties & Tailwind Integration**
- Implement CSS custom properties (CSS variables) using data-theme attributes on document root
- Extend Tailwind config to reference CSS variables (e.g., `colors: { page: "var(--color-bg)" }`)
- Avoid compiling tokens per theme in Tailwind config to prevent rebuilds
- Keep tokens as runtime CSS variables for performance
- Create themes.js configuration object documenting all theme tokens (exportable for Storybook/UI devs)
- Define CSS rules applying tokens per theme using `[data-theme="..."]` selectors
- Support 5 themes: cyber (Cyber Hacker), pixel (Pixel Lab), neon (Neon Future), terminal (Terminal Minimal), blueprint (Blueprint Dev)

**Zustand Theme Store**
- Create dedicated useThemeStore() with Zustand for global theme state management
- Implement getters/setters for current theme
- Add persistence effect for localStorage (required for offline/guest users)
- Implement API sync hooks for authenticated users (debounced)
- Store applies CSS vars to document.documentElement.style.setProperty() on theme change
- Initialize theme from localStorage on mount, fallback to 'cyber' if none exists

**Theme Switcher UI Component**
- Location: Fixed Header component, accessible from all pages
- UI Pattern: Mini visual preview grid (3×2 tiles) within dropdown menu
- Each tile displays: theme preview (background + sample text + small animated accent)
- Hover interaction: Tiles animate on hover (hover preview effect)
- Icon: Palette icon in header opens dropdown
- Optional keyboard shortcut: T key to open switcher
- Authenticated users: Show "Salvar no perfil" button in dropdown (only when logged in)
- Follow ProfileButton dropdown pattern for accessibility (keyboard navigation, click outside to close, Escape to close)

**Theme Persistence & Database Sync**
- localStorage persistence: Required (works offline/guest users)
- Database sync: Required for authenticated users via PATCH /api/users/me/theme
- On login: If user has theme preference in DB → apply it (override localStorage)
- On theme change (authenticated): Send debounced PATCH request to save preference
- Maintains consistency across devices for authenticated users
- Add `theme` field (String, optional) to User model in Prisma schema

**Theme Transitions & Animations**
- Use short animations (not instant): 300-450ms duration
- Default transition: fade-out overlay → swap CSS vars → fade-in overlay (300ms)
- Use CSS transitions for color changes (performant)
- Use Framer Motion for overlay/preview effects when switching themes
- Theme-specific micro effects: scanline slide-in for Cyber Hacker, pixel glitch flash for Pixel Lab
- Apply transitions to root element for smooth color transitions across all components

**Theme-Specific Global Effects**
- Global effects (background, overlays, scanlines, background-grain, neon bloom): Apply via high-level container component
- Create ThemeEffects component mounted in root layout
- Effects applied via CSS classes reading theme CSS variables
- Separation of concerns: avoid applying heavy effects on each component
- Component effects (buttons, cards, tiles): Apply utility classes reading CSS vars (e.g., `.btn` uses `box-shadow: var(--btn-glow)`)
- Each theme defines unique effect variables (e.g., `--scanline-opacity`, `--neon-bloom-intensity`)

**Theme Configuration & Design Tokens**
- Create themes.js with THEMES object containing name and vars for each theme
- Define comprehensive design tokens: colors (bg, primary, accent, muted, glow), typography (font family), effects (opacity, intensity)
- Structure allows easy extension and documentation
- CSS rules in globals.css apply tokens using `[data-theme="..."]` selectors
- Include fallback values in `:root` selector
- Tokens exported for use in components and utilities

**API Route for Theme Sync**
- Create PATCH /api/users/me/theme endpoint following Next.js App Router pattern
- Use NextAuth session for authentication (getSession from next-auth)
- Validate theme value against allowed themes (cyber, pixel, neon, terminal, blueprint)
- Update User model theme field via Prisma
- Return generic error messages to frontend (no technical details)
- Log detailed errors server-side only
- Follow existing API route patterns from auth implementation

**Component Theme Integration**
- Adapt Header component to include ThemeSwitcher integration
- Adapt LoginButton and ProfileButton to use theme tokens (replace hardcoded colors)
- Mount ThemeEffects component in root layout for global effects
- Add ThemeProvider wrapper in Providers component (follow SessionProvider pattern)
- Update existing components to use theme-aware Tailwind classes (e.g., `bg-page`, `text-primary`)
- Ensure all components respond to theme changes via CSS variable updates

**Utility Functions for Games**
- Create helper function `applyThemeToCanvas(canvas, theme)` for games to use
- Provide data-theme hook utility for game components
- Include CSS classes that games can apply for theme-aware styling
- Exclude full implementations of effects requiring game engine changes (Pixi, WebGL)
- Document utilities for future game implementations

## Visual Design
No visual assets provided.

## Existing Code to Leverage

**Header Component (`components/Header.tsx`)**
- Reuse fixed header structure and layout pattern
- Integrate ThemeSwitcher in the header's auth section area
- Follow existing responsive design patterns (mobile, tablet, desktop)
- Maintain existing navigation structure while adding theme switcher

**ProfileButton Component (`components/ProfileButton.tsx`)**
- Reference dropdown menu pattern for ThemeSwitcher implementation
- Reuse click-outside-to-close, Escape key handling, and keyboard navigation patterns
- Follow accessibility patterns (aria-expanded, aria-haspopup, role="menu")
- Use similar dropdown positioning and styling approach

**Providers Component (`app/providers.tsx`)**
- Follow SessionProvider wrapper pattern for ThemeProvider
- Add ThemeProvider alongside SessionProvider in Providers component
- Maintain clean component composition structure

**Root Layout (`app/layout.tsx`)**
- Mount ThemeEffects component in layout for global effects
- Follow existing layout structure and organization
- Maintain HTML lang attribute and metadata structure

**Prisma User Model (`prisma/schema.prisma`)**
- Add `theme` field (String, optional) to existing User model
- Follow existing field naming conventions and structure
- Use existing Prisma client pattern from `lib/prisma.ts`

**API Route Pattern (`app/api/auth/[...nextauth]/route.ts`)**
- Follow Next.js App Router API route structure
- Use NextAuth session pattern for authentication in theme API route
- Follow existing error handling patterns (generic messages, server-side logging)

## Out of Scope
- Full implementations of effects requiring game engine changes (Pixi.js, WebGL modifications)
- Complete game theme styling (will come in later game implementation specs)
- Advanced theme customization beyond the 5 predefined themes
- Theme editor or theme creation tools for users
- Theme marketplace or sharing themes between users
- Per-component theme overrides (all components use global theme)
- Theme preview in separate modal or page (only dropdown preview)
- Theme scheduling or automatic theme switching based on time
- Theme animations during initial page load (only transitions on manual switch)
- Server-side theme rendering (themes applied client-side only)

