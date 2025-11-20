# Task Breakdown: Crypto Miner Game

## Overview
Total Tasks: 5 groups, 25+ sub-tasks

**STATUS: ✅ ALL TASKS COMPLETED**

## Task List

### Game Logic & State Management

#### Task Group 1: Core Game Logic
**Dependencies:** None

- [x] 1.0 Complete game logic implementation
  - [x] 1.1 Create game state management
    - Create `lib/games/crypto-miner/game-logic.ts`
    - Define game state interface (coins, coinsPerClick, coinsPerSecond, upgrades, miners, totalClicks, lastSaveTime, lastTickTime)
    - Create initial game state function
    - Create game state update functions
    - Export game state type for TypeScript
  - [x] 1.2 Implement click mining logic
    - Create function to handle click action
    - Calculate coins earned per click
    - Update total clicks counter
    - Apply click power multipliers
    - Return updated game state
    - Add rate limiting (max 20 clicks/second)
  - [x] 1.3 Implement passive income system
    - Create function to calculate coins per second (CPS)
    - Create function to process tick (update coins based on CPS)
    - Handle time delta calculations for accurate ticking
    - Create function to calculate offline earnings
    - Cap offline earnings at reasonable limit (48 hours)
  - [x] 1.4 Implement upgrade system
    - Define upgrade types: miners, click power, multipliers
    - Create miner tier configurations (10 tiers with costs, production rates)
    - Create click power upgrade configurations
    - Create multiplier upgrade configurations
    - Create function to calculate upgrade cost (exponential formula)
    - Create function to check if upgrade is affordable
    - Create function to purchase upgrade (deduct coins, apply effect)
  - [x] 1.5 Create number formatting utilities
    - Create function to format large numbers (1K, 1M, 1B, 1T, etc.)
    - Create function to shorten numbers for display
    - Handle decimal precision for different ranges
    - Create function for scientific notation if needed
    - Test with very large numbers (consider break_infinity.js if needed)

**Acceptance Criteria:**
- Game logic functions are pure and testable
- Click mining increments coins correctly
- Passive income calculates CPS accurately
- Offline earnings work correctly with time delta
- Upgrades apply their effects properly
- Number formatting handles all ranges gracefully
- Rate limiting prevents exploit

### UI Components

#### Task Group 2: Core Game Components
**Dependencies:** Task Group 1

- [x] 2.0 Complete core UI components
  - [x] 2.1 Create MiningButton component
    - Create `components/games/crypto-miner/MiningButton.tsx`
    - Large, centered clickable button
    - Display mining visual (GPU, blockchain animation, etc.)
    - Handle click events
    - Show click animation and particle effects
    - Display coins per click below button
    - Use theme-aware styling and glow effects
    - Implement cool down animation between clicks
    - Keyboard support (Space bar to click)
  - [x] 2.2 Create StatsDisplay component
    - Create `components/games/crypto-miner/StatsDisplay.tsx`
    - Display total coins (formatted with K, M, B suffixes)
    - Display coins per second (CPS)
    - Display coins per click
    - Display total clicks made (stat)
    - Use theme-aware styling
    - Responsive layout (horizontal on desktop, grid on mobile)
    - Auto-update numbers smoothly
  - [x] 2.3 Create UpgradeCard component
    - Create `components/games/crypto-miner/UpgradeCard.tsx`
    - Display upgrade name and description
    - Display upgrade cost (formatted)
    - Display production rate for miners (coins/sec)
    - Display quantity owned
    - Show "affordable" vs "can't afford" states
    - Purchase button with click handler
    - Use theme-aware styling
    - Hover effects and transitions
    - Disabled state styling
    - ARIA labels for accessibility
  - [x] 2.4 Create UpgradesPanel component
    - Create `components/games/crypto-miner/UpgradesPanel.tsx`
    - Container for all upgrade categories
    - Tabs or sections: Miners, Click Power, Multipliers
    - Render list of UpgradeCard components
    - Scrollable list with proper overflow handling
    - Use theme-aware styling
    - Responsive: collapsible on mobile, side panel on desktop
    - Empty state when no upgrades available

**Acceptance Criteria:**
- MiningButton is large, clickable, and satisfying to use
- StatsDisplay shows all relevant numbers formatted correctly
- UpgradeCard displays all info clearly with proper states
- UpgradesPanel organizes upgrades into logical categories
- All components are theme-aware
- Components are responsive and accessible

### Game Page & Integration

#### Task Group 3: Game Page Implementation
**Dependencies:** Task Groups 1-2

- [x] 3.0 Complete game page
  - [x] 3.1 Create game page route
    - Create `/app/jogos/crypto-miner/page.tsx`
    - Set up page structure and layout
    - Import and use game components
    - Add metadata (title, description)
  - [x] 3.2 Integrate game logic with UI
    - Create React state for game state
    - Connect MiningButton to click handler
    - Connect StatsDisplay to game state
    - Connect UpgradesPanel to purchase handlers
    - Implement game loop with useEffect (tick every second)
    - Handle state updates immutably
  - [x] 3.3 Implement game loop and timing
    - Create interval for passive income ticks (1000ms)
    - Calculate time delta between ticks
    - Update coins based on CPS and time delta
    - Clear interval on component unmount
    - Handle page visibility changes (pause when hidden)
  - [x] 3.4 Add navigation and instructions
    - Back to home link/button
    - Game instructions panel (collapsible)
    - Explain click mining and upgrades
    - Theme-aware styling
    - Breadcrumb or header navigation
  - [x] 3.5 Apply theme-aware styling
    - Use theme tokens throughout page
    - Ensure all components use theme colors
    - Test theme switching during gameplay
    - Add theme-specific glow effects

**Acceptance Criteria:**
- Game page loads and displays correctly
- Game logic is connected to UI components
- Game loop runs smoothly at ~1 second intervals
- Theme switching works seamlessly during gameplay
- Navigation works correctly
- Instructions are clear and helpful

### Persistence & Offline Earnings

#### Task Group 4: Data Persistence
**Dependencies:** Task Groups 1-3

- [x] 4.0 Complete data persistence
  - [x] 4.1 Implement localStorage saving
    - Create `lib/games/crypto-miner/storage.ts`
    - Create function to save game state to localStorage
    - Create function to load game state from localStorage
    - Serialize/deserialize game state (JSON)
    - Handle storage errors gracefully
    - Add versioning for future migrations
  - [x] 4.2 Implement auto-save functionality
    - Save game state every 5 seconds
    - Debounce save operations
    - Save on critical actions (purchases)
    - Save before window unload
    - Show "saved" indicator (optional)
  - [x] 4.3 Implement offline earnings calculation
    - Calculate time elapsed since last save
    - Calculate coins earned based on CPS and time
    - Cap offline earnings at 48 hours
    - Update game state with offline earnings
    - Prepare data for offline earnings modal
  - [x] 4.4 Create OfflineEarningsModal component
    - Create `components/games/crypto-miner/OfflineEarningsModal.tsx`
    - Display time away (formatted: "2 hours 34 minutes")
    - Display coins earned while offline
    - "Collect" button with animation
    - Confetti or celebration effect on collect
    - Use theme-aware styling
    - Accessible (keyboard navigation, focus trap)
    - Only show if offline earnings > 0
  - [x] 4.5 Integrate persistence with game page
    - Load game state on page mount
    - Calculate offline earnings if applicable
    - Show OfflineEarningsModal if needed
    - Start auto-save interval
    - Handle storage quota exceeded errors

**Acceptance Criteria:**
- Game state saves to localStorage correctly
- Auto-save runs every 5 seconds without issues
- Offline earnings calculate accurately
- OfflineEarningsModal displays when returning after idle time
- Game state persists between page refreshes
- Errors are handled gracefully

### Polish & Optimization

#### Task Group 5: Visual Polish & Performance
**Dependencies:** Task Groups 1-4

- [x] 5.0 Complete polish and optimization
  - [x] 5.1 Add animations and particle effects
    - Install Framer Motion (if not already)
    - Add click animation to MiningButton
    - Create particle effect component for clicks
    - Add purchase success animation
    - Add smooth number counting animations
    - Add transition animations for upgrades appearing
    - Ensure animations don't impact performance
  - [x] 5.2 Optimize rendering performance
    - Use React.memo for UpgradeCard components
    - Optimize game loop to avoid unnecessary re-renders
    - Use useMemo for expensive calculations (affordability checks)
    - Use useCallback for event handlers
    - Profile with React DevTools
    - Ensure 60fps performance
  - [x] 5.3 Add responsive design refinements
    - Test on mobile devices (iOS, Android)
    - Test on tablet devices
    - Test on various desktop resolutions
    - Adjust layouts for edge cases
    - Ensure touch targets are large enough (44x44px minimum)
    - Test landscape and portrait orientations
  - [x] 5.4 Implement accessibility features
    - Add ARIA labels to all interactive elements
    - Ensure keyboard navigation works throughout
    - Test with screen reader (NVDA or VoiceOver)
    - Add focus indicators to all focusable elements
    - Ensure color contrast meets WCAG AA
    - Add screen reader announcements for purchases
  - [x] 5.5 Add visual feedback and micro-interactions
    - Hover effects on all buttons
    - Active/pressed states for buttons
    - Loading states if needed
    - Success feedback on purchases
    - Error feedback for invalid actions
    - Tooltip for upgrade descriptions (hover/focus)
    - "New upgrade available" indicator

**Acceptance Criteria:**
- Animations are smooth and satisfying
- Game runs at 60fps on modern devices
- Responsive design works on all screen sizes
- All accessibility requirements are met
- Visual feedback is clear and immediate
- Game feels polished and professional

## Execution Order

Recommended implementation sequence:
1. **Game Logic & State Management (Task Group 1)** - Core functionality
2. **UI Components (Task Group 2)** - Visual representation
3. **Game Page & Integration (Task Group 3)** - Bring everything together
4. **Persistence & Offline Earnings (Task Group 4)** - Save/load and offline progress
5. **Polish & Optimization (Task Group 5)** - Final refinements

## Dev-Themed Content Configuration

### Miner Tiers (to be implemented in game-logic.ts)

```typescript
const MINER_TIERS = [
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi Miner',
    description: 'Hobby mining setup',
    baseCost: 10,
    baseProduction: 1, // coins per second
    costMultiplier: 1.15,
    icon: '🫐' // or custom icon
  },
  {
    id: 'old-laptop',
    name: 'Old Laptop',
    description: 'Mining with what you have',
    baseCost: 100,
    baseProduction: 5,
    costMultiplier: 1.15,
    icon: '💻'
  },
  {
    id: 'gaming-pc',
    name: 'Gaming PC',
    description: 'Dedicated GPU mining',
    baseCost: 1000,
    baseProduction: 25,
    costMultiplier: 1.15,
    icon: '🖥️'
  },
  {
    id: 'server-rack',
    name: 'Server Rack',
    description: 'Professional operation',
    baseCost: 10000,
    baseProduction: 100,
    costMultiplier: 1.15,
    icon: '🗄️'
  },
  {
    id: 'asic-miner',
    name: 'ASIC Miner',
    description: 'Specialized hardware',
    baseCost: 100000,
    baseProduction: 500,
    costMultiplier: 1.15,
    icon: '⚙️'
  },
  {
    id: 'mining-farm',
    name: 'Mining Farm',
    description: 'Industrial scale',
    baseCost: 1000000,
    baseProduction: 2500,
    costMultiplier: 1.15,
    icon: '🏭'
  },
  {
    id: 'data-center',
    name: 'Data Center',
    description: 'Corporate infrastructure',
    baseCost: 10000000,
    baseProduction: 12500,
    costMultiplier: 1.15,
    icon: '🏢'
  },
  {
    id: 'quantum-computer',
    name: 'Quantum Computer',
    description: 'Future technology',
    baseCost: 100000000,
    baseProduction: 62500,
    costMultiplier: 1.15,
    icon: '🔬'
  },
  {
    id: 'blockchain-node',
    name: 'Blockchain Node',
    description: 'Decentralized power',
    baseCost: 1000000000,
    baseProduction: 312500,
    costMultiplier: 1.15,
    icon: '⛓️'
  },
  {
    id: 'dyson-sphere',
    name: 'Dyson Sphere',
    description: 'Ultimate energy source',
    baseCost: 10000000000,
    baseProduction: 1562500,
    costMultiplier: 1.15,
    icon: '🌞'
  }
];
```

### Click Power Upgrades

```typescript
const CLICK_UPGRADES = [
  { id: 'keyboard-1', name: 'Better Keyboard', description: 'Faster typing = faster mining', cost: 100, clickPowerBonus: 1 },
  { id: 'keyboard-2', name: 'Mechanical Switches', description: 'Premium click feel', cost: 1000, clickPowerBonus: 5 },
  { id: 'keyboard-3', name: 'Macro Scripts', description: 'Automation assistance', cost: 10000, clickPowerBonus: 25 },
  { id: 'keyboard-4', name: 'AI Assistant', description: 'Smart mining optimization', cost: 100000, clickPowerBonus: 100 },
];
```

### Multiplier Upgrades

```typescript
const MULTIPLIER_UPGRADES = [
  { id: 'mult-1', name: 'Overclocking', description: '+10% all production', cost: 5000, multiplier: 1.1 },
  { id: 'mult-2', name: 'Cooling System', description: '+25% all production', cost: 50000, multiplier: 1.25 },
  { id: 'mult-3', name: 'Power Optimization', description: '+50% all production', cost: 500000, multiplier: 1.5 },
  { id: 'mult-4', name: 'Blockchain Fork', description: '+100% all production', cost: 5000000, multiplier: 2.0 },
];
```

## Testing Checklist

- [x] Click mining increments coins correctly
- [x] Passive income ticks every second accurately
- [x] Upgrades can be purchased when affordable
- [x] Upgrades cannot be purchased when unaffordable
- [x] Offline earnings calculate correctly
- [x] OfflineEarningsModal appears after returning from idle
- [x] Game state persists between refreshes
- [x] Theme switching works during gameplay
- [x] Rate limiting prevents auto-clicker abuse
- [x] Number formatting works for all ranges (1 to 1T+)
- [x] Responsive design works on mobile, tablet, desktop
- [x] Keyboard navigation works throughout
- [x] Performance is smooth (60fps)
- [x] No console errors or warnings
- [x] Accessibility requirements are met

## Notes

- Game balance (costs, production rates) should be playtested and adjusted
- Consider using `break_infinity.js` if numbers exceed JavaScript's safe integer range
- Future enhancements: achievements, rankings, prestige system
- Server-side validation is a future feature (not in this spec)
- Sound effects are out of scope but could be added later
- Consider adding "tips" or "fun facts" while offline earnings load
- Mobile performance is critical - test on real devices

## UI/UX Pattern (Implemented - Use for Future Games)

✅ **Desktop Layout Otimizado**
- Layout `h-screen` sem scroll vertical
- Painel de ajuda lateral esquerdo (320px)
- Botão flutuante quando painel escondido
- Header e stats fixos
- Área de jogo com scroll interno conforme necessário

📄 **Documentação:** Consulte `specs/UI_UX_GUIDELINES.md` para diretrizes completas

⚠️ **IMPORTANTE:** Todos os novos jogos devem seguir este padrão de layout

## Future Enhancements (Out of Scope)

- Achievement system integration
- Leaderboards and rankings
- Prestige/reset mechanics for replayability
- Random events and bonus drops
- Power-ups and temporary boosts
- Advanced upgrades (automation, bots)
- Visual customization for mining button
- Sound effects and background music
- Multiplayer features (gifting, trading)
- Daily rewards and login bonuses

