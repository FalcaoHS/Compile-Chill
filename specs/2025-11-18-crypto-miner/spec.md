# Specification: Crypto Miner Game

## Goal
Build an idle/incremental clicker game where players mine cryptocurrency by clicking and upgrading their mining equipment. The game should feature developer-themed upgrades, theme-aware styling, persistent progress storage, and engaging idle mechanics that reward both active clicking and passive progression.

## User Stories
- As a player, I want to mine crypto by clicking so that I can accumulate currency quickly when actively playing
- As a player, I want to purchase upgrades that generate passive income so that I can progress while idle
- As a player, I want to see my mining rate and total mined crypto so that I can track my progress
- As a player, I want my progress saved automatically so that I can continue from where I left off
- As a player, I want the game to be theme-aware so that it matches my selected visual theme
- As a developer, I want the game to calculate offline earnings so that players are rewarded for coming back

## Specific Requirements

### Core Game Mechanics
- **Click Mining:**
  - Click/tap to mine cryptocurrency
  - Each click generates base amount (e.g., 1 coin)
  - Click power can be upgraded
  - Visual feedback on each click (animation, particle effects)
  - Rate limiting to prevent auto-clicker abuse (max 20 clicks/second)

- **Passive Income:**
  - Miners generate coins automatically over time
  - Multiple tiers of miners with increasing costs and production rates
  - Miners run even when player is offline (calculate on return)
  - Display total coins per second (CPS)

- **Upgrade System:**
  - Click upgrades: increase coins per click
  - Miner upgrades: unlock and upgrade various mining equipment
  - Multiplier upgrades: boost all production by percentage
  - Dev-themed upgrades (Raspberry Pi miner, GPU rig, ASIC farm, Quantum computer, etc.)

### Game Balance
- **Pricing Progression:**
  - Each upgrade tier costs exponentially more
  - Early game: affordable upgrades (10-1000 coins)
  - Mid game: expensive upgrades (1K-1M coins)
  - Late game: massive upgrades (1M+ coins)
  - Use exponential growth formula: `baseCost * (multiplier ^ level)`

- **Production Rates:**
  - Tier 1 Miner: 1 coin/sec, costs 10 coins
  - Tier 2 Miner: 5 coins/sec, costs 100 coins
  - Tier 3 Miner: 25 coins/sec, costs 1,000 coins
  - Tier 4 Miner: 100 coins/sec, costs 10,000 coins
  - Tier 5 Miner: 500 coins/sec, costs 100,000 coins
  - (Balancing to be adjusted during testing)

### UI Components
- **Mining Area:**
  - Large clickable button/area in center
  - Visual representation of mining (animated GPU, blockchain, etc.)
  - Particle effects on click
  - Display coins per click

- **Stats Display:**
  - Total coins (formatted: 1K, 1M, 1B, etc.)
  - Coins per second
  - Coins per click
  - Total clicks made (stat tracking)

- **Upgrades Panel:**
  - List of available miners
  - Each miner shows: name, cost, coins/sec, quantity owned
  - Click power upgrades
  - Multiplier upgrades
  - Visual indicator for affordable upgrades
  - "Can't afford" state styling

- **Offline Earnings Modal:**
  - Shows when player returns after being idle
  - Display time away
  - Display coins earned while away
  - "Collect" button with animation

### Dev-Themed Content

#### Miner Types (Upgrade Tiers)
1. **Raspberry Pi Miner** - "hobby mining setup"
2. **Old Laptop** - "mining with what you have"
3. **Gaming PC** - "dedicated GPU mining"
4. **Server Rack** - "professional operation"
5. **ASIC Miner** - "specialized hardware"
6. **Mining Farm** - "industrial scale"
7. **Data Center** - "corporate infrastructure"
8. **Quantum Computer** - "future technology"
9. **Blockchain Node** - "decentralized power"
10. **Dyson Sphere** - "ultimate energy source"

#### Click Power Upgrades
- **Better Keyboard** - faster typing = faster mining
- **Mechanical Switches** - premium click feel
- **Macro Scripts** - automation assistance
- **AI Assistant** - smart mining optimization

#### Multiplier Upgrades
- **Overclocking** - +10% all production
- **Cooling System** - +25% all production
- **Power Optimization** - +50% all production
- **Blockchain Fork** - +100% all production

### Theme Integration
- Use theme tokens for all colors:
  - Background: `bg-page-secondary`
  - Cards: `bg-page`, `border-border`
  - Text: `text-text`, `text-text-secondary`
  - Primary actions: `bg-primary`, `text-primary`
  - Success states: `text-success`
  - Hover effects: `hover:bg-page`, `shadow-glow-sm`
- Mining button adapts to theme (different glow effects per theme)
- Particle colors match theme palette
- All components respond to theme changes instantly

### Data Persistence
- **LocalStorage (Phase 1):**
  - Save game state every 5 seconds
  - Store: coins, upgrades owned, click power, last save timestamp
  - Calculate offline earnings on load

- **Database (Phase 2 - Future):**
  - Save to Prisma/database for cloud sync
  - Enable cross-device progress
  - Track game statistics for rankings

### Responsive Design
- **Desktop:** Side-by-side layout (mining area | upgrades panel)
- **Tablet:** Stacked layout with upgrades below mining area
- **Mobile:** Vertical layout, collapsible upgrades panel

### Accessibility
- Keyboard support: Space bar to mine, Tab navigation
- ARIA labels for all interactive elements
- Focus indicators on all buttons
- Screen reader announcements for purchases/upgrades
- Color contrast meets WCAG AA standards

### Performance
- Efficient rendering (avoid unnecessary re-renders)
- Use `React.memo` for upgrade list items
- Debounce localStorage saves
- Use `requestAnimationFrame` for smooth animations
- Number formatting for large values (1.23M instead of 1234567)

## Visual Design
- Clean, modern interface with clear hierarchy
- Mining button should be large, prominent, and satisfying to click
- Upgrade cards should feel like shop items
- Numbers should be easy to read with clear formatting
- Animations should be smooth and not distracting
- Theme-aware glow effects for premium feel

## Existing Code to Leverage
- `components/Header.tsx` - Navigation and theme switcher
- `lib/themes.ts` - Theme tokens
- `lib/games.ts` - Game configuration
- Existing game patterns from Terminal 2048

## Validation & Anti-Cheat
- **Client-Side (Phase 1):**
  - Rate limit clicks to prevent auto-clickers
  - Validate upgrade purchases (enough coins, valid tier)
  - Offline earnings capped at reasonable limit (e.g., 48 hours max)
  
- **Server-Side (Phase 2 - Future):**
  - Validate all game state changes server-side
  - Detect impossible progression rates
  - Store authoritative game state in database

## Out of Scope (Future Features)
- Multiplayer features (trading, gifting)
- Achievement system (separate feature)
- Leaderboards/rankings (separate feature)
- Sound effects and music
- Advanced prestige/reset mechanics
- Real cryptocurrency integration (obviously!)
- Power-ups and temporary boosts
- Random events and bonuses

## Success Metrics
- Game is playable and fun for 5+ minute sessions
- Progression feels balanced (not too fast or slow)
- Offline earnings encourage players to return
- Theme integration is seamless
- No major bugs or exploits
- Mobile and desktop experiences are both excellent

## Technical Considerations
- Use BigInt or library (like break_infinity.js) for very large numbers
- Implement exponential cost formula for upgrades
- Cache upgrade affordability calculations
- Use web workers for offline earnings calculation if needed
- Format numbers with suffixes (K, M, B, T, etc.)

## Game Flow
1. Player lands on game page
2. Sees mining button and starter UI
3. Clicks to earn first coins
4. Purchases first miner upgrade
5. Sees passive income begin
6. Continues clicking and upgrading
7. Leaves game, returns later
8. Receives offline earnings modal
9. Continues progression cycle

## Implementation Priority
1. Core clicking mechanics and UI
2. Basic miner upgrades (first 3 tiers)
3. Persistent storage (localStorage)
4. Offline earnings calculation
5. Complete upgrade system (all tiers)
6. Theme integration and polish
7. Responsive design refinement
8. Performance optimization

## UI/UX Improvements (Implemented)

### Desktop Layout Optimization
- **No Vertical Scroll**: Layout otimizado para usar 100% da altura da viewport sem necessidade de scroll
- **Help Panel Lateral**: Painel de ajuda posicionado na lateral esquerda (320px)
  - Visível por padrão no desktop
  - Pode ser escondido pelo usuário
  - Contém instruções básicas, dicas e estratégias
  - Scroll interno para conteúdo longo
- **Floating Help Button**: Botão circular flutuante aparece quando o painel está escondido
  - Posicionado no canto superior esquerdo
  - Animação suave de entrada/saída
  - Reabre o painel de ajuda
- **Flexbox Layout**: Estrutura flex otimizada para gerenciar espaço vertical
  - Header fixo (não rola)
  - Stats bar fixo (não rola)
  - Área de jogo ajustável

### Responsive Behavior
- **Desktop (lg+)**: Painel lateral visível, layout horizontal sem scroll
- **Mobile/Tablet**: Painel escondido por padrão, scroll vertical permitido

**Nota:** Estas melhorias estabelecem o padrão visual para todos os futuros jogos. Consulte `specs/UI_UX_GUIDELINES.md` para diretrizes completas.

