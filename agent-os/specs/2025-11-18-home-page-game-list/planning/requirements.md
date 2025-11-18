# Spec Requirements: Home Page with Game List

## Initial Description

"Home Page with Game List — Build home page displaying all 10 games in a grid layout with theme-aware styling, game cards with descriptions, and navigation to individual game pages"

## Requirements Discussion

### Key Decisions

**1. Layout Structure:**
- Replace current centered home page with a grid layout
- Keep hero section at top (logo, title, tagline) for branding
- Display 10 game cards in responsive grid below hero section
- Grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)

**2. Game Card Design:**
- Each card should be theme-aware (use theme tokens)
- Include: game name, description, visual icon/preview
- Hover effects with theme-specific animations
- Clickable card that navigates to game page
- Optional: difficulty indicator, play count (future)

**3. Game Data Structure:**
- Create a games configuration file (`lib/games.ts`) with:
  - Game ID (slug)
  - Display name
  - Description
  - Route path
  - Icon/emoji (temporary until game pages exist)
  - Category/tags (optional)

**4. Navigation:**
- Each card links to `/jogos/[game-slug]` route
- Game pages don't exist yet, so links can be placeholder or show "Coming Soon"
- Maintain existing navigation (Header links)

**5. Theme Integration:**
- Use theme tokens for card backgrounds, borders, text colors
- Apply theme-specific hover effects (glow, shadow, transform)
- Cards should respond to theme changes instantly

**6. Responsive Design:**
- Mobile-first approach
- Grid adapts: 1 col (sm), 2 cols (md), 3 cols (lg), 4 cols (xl)
- Cards maintain aspect ratio
- Touch-friendly tap targets

**7. Existing Functionality:**
- Keep login button for unauthenticated users
- Keep "Ver Jogos" and "Ver Ranking" buttons for authenticated users
- Integrate with existing Header component
- Maintain theme switcher functionality

## Games List

The 10 games to display:

1. **Terminal 2048** - Puzzle game with dev-themed tiles
2. **Byte Match** - Memory matching game with dev-themed pairs
3. **Dev Pong** - Minimal Pong game with futuristic aesthetics
4. **Bit Runner** - Endless runner with pixel character
5. **Stack Overflow Dodge** - Dodge game avoiding falling "errors"
6. **Hack Grid** - Logic puzzle connecting network nodes
7. **Debug Maze** - Maze game guiding a "bug" to the patch
8. **Refactor Rush** - Puzzle reorganizing "code blocks"
9. **Crypto Miner Game** - Idle clicker mining blocks
10. **Packet Switch** - Routing logic game directing packets

## Technical Approach

- Use Next.js App Router (existing structure)
- Use TailwindCSS with theme tokens (existing setup)
- Use Framer Motion for card animations
- Create reusable GameCard component
- Create games configuration file
- Update `app/page.tsx` with new layout

## Out of Scope

- Game page implementations (coming in future features)
- Game statistics/play counts (future feature)
- Game search/filter (future enhancement)
- Game categories/tags filtering (future enhancement)

