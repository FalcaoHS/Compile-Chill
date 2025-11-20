# Specification: Home Page with Game List

## Goal
Build a home page that displays all 10 games in a responsive grid layout with theme-aware styling, game cards with descriptions, and navigation to individual game pages. The page should integrate seamlessly with the existing theme system and maintain current authentication functionality.

## User Stories
- As a user, I want to see all available games on the home page so that I can quickly discover and access them
- As a user, I want game cards to be visually appealing and theme-aware so that they match my selected theme
- As a user, I want to click on a game card to navigate to that game's page
- As a developer, I want a clean, maintainable structure for game data so that adding new games is easy

## Specific Requirements

### Layout Structure
- Hero section at top: logo, title "Compile & Chill", tagline "Portal de descompressão para desenvolvedores"
- Game grid below hero: responsive grid displaying 10 game cards
- Grid breakpoints:
  - Mobile (sm): 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 3 columns
  - Large desktop (xl): 4 columns
- Maintain existing authentication UI (login button, session buttons)

### Game Card Component
- Display game name prominently
- Show game description (1-2 lines)
- Include visual icon/emoji (temporary until game assets)
- Theme-aware styling:
  - Background: `bg-page-secondary`
  - Border: `border-border`
  - Text: `text-text` and `text-text-secondary`
  - Hover: `hover:bg-page`, `hover:border-primary`, `shadow-glow-sm`
- Smooth hover animations (Framer Motion)
- Clickable card linking to `/jogos/[game-slug]`
- Accessible (keyboard navigation, ARIA labels)

### Games Configuration
- Create `lib/games.ts` with games array
- Each game object contains:
  - `id`: string (slug, e.g., "terminal-2048")
  - `name`: string (display name)
  - `description`: string (short description)
  - `route`: string (path to game page)
  - `icon`: string (emoji or icon name, temporary)
  - `category`: string (optional, for future filtering)

### Theme Integration
- Use theme tokens for all styling
- Cards respond to theme changes instantly
- Theme-specific hover effects (glow intensity, shadow colors)
- Maintain consistency with existing theme-aware components

### Responsive Design
- Mobile-first approach
- Cards maintain consistent aspect ratio
- Touch-friendly tap targets (min 44x44px)
- Proper spacing and padding on all screen sizes

### Navigation
- Each card links to game page route
- Game pages don't exist yet, so can show placeholder or "Coming Soon"
- Maintain existing Header navigation
- Preserve browser back button functionality

## Visual Design
- Cards should feel modern and polished
- Hover states should be subtle but noticeable
- Grid should feel balanced and organized
- Typography should use theme font family

## Existing Code to Leverage
- `components/Header.tsx` - Already has theme switcher and navigation
- `lib/themes.ts` - Theme tokens available
- `app/page.tsx` - Current home page to enhance
- `components/LoginButton.tsx` - Authentication UI
- `components/ProfileButton.tsx` - User profile UI

## Out of Scope
- Game page implementations (separate features)
- Game statistics/analytics
- Search and filter functionality
- Game categories/tags filtering
- User favorites/bookmarks
- Game difficulty indicators (future)

