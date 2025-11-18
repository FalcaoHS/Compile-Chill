# Crypto Miner Game

An idle/incremental clicker game where players mine cryptocurrency by clicking and upgrading their mining equipment.

## Features

### Core Mechanics
- **Active Clicking**: Click the mining button to earn coins instantly
- **Passive Income**: Purchase miners that generate coins automatically over time
- **Offline Earnings**: Continue earning while away from the game (up to 48 hours)
- **Rate Limiting**: Anti-cheat protection prevents auto-clicker abuse (max 20 clicks/second)

### Upgrade System

#### Miners (10 Tiers)
1. Raspberry Pi Miner - 1 coin/sec
2. Old Laptop - 5 coins/sec
3. Gaming PC - 25 coins/sec
4. Server Rack - 100 coins/sec
5. ASIC Miner - 500 coins/sec
6. Mining Farm - 2,500 coins/sec
7. Data Center - 12,500 coins/sec
8. Quantum Computer - 62,500 coins/sec
9. Blockchain Node - 312,500 coins/sec
10. Dyson Sphere - 1,562,500 coins/sec

#### Click Power Upgrades (4 Levels)
- Better Keyboard: +1 per click
- Mechanical Switches: +5 per click
- Macro Scripts: +25 per click
- AI Assistant: +100 per click

#### Multiplier Upgrades (4 Levels)
- Overclocking: +10% all production
- Cooling System: +25% all production
- Power Optimization: +50% all production
- Blockchain Fork: +100% all production

## Technical Implementation

### File Structure
```
lib/games/crypto-miner/
  ├── game-logic.ts      # Core game mechanics and state management
  ├── storage.ts         # localStorage persistence
  └── README.md          # This file

components/games/crypto-miner/
  ├── MiningButton.tsx         # Main mining button with particle effects
  ├── StatsDisplay.tsx         # Game statistics display
  ├── UpgradeCard.tsx          # Individual upgrade card (memoized)
  ├── UpgradesPanel.tsx        # Upgrades panel with tabs
  └── OfflineEarningsModal.tsx # Modal for offline earnings

app/jogos/crypto-miner-game/
  └── page.tsx           # Main game page
```

### Performance Optimizations
- React.memo on UpgradeCard components to prevent unnecessary re-renders
- Debounced localStorage saves (every 5 seconds)
- Efficient game loop with requestAnimationFrame
- Number formatting for large values
- Rate limiting to prevent performance issues

### Data Persistence
- Game state saved to localStorage every 5 seconds
- Auto-save on window unload
- Save on page visibility change
- Versioned storage format for future migrations

### Accessibility
- Keyboard support (Space bar to mine, Tab navigation)
- ARIA labels on all interactive elements
- Focus indicators
- Screen reader friendly
- Color contrast meets WCAG AA standards

## Game Balance

### Exponential Pricing
Each upgrade tier uses an exponential cost formula:
```
cost = baseCost × (multiplier ^ quantityOwned)
```

### Progression Curve
- Early game (0-1000 coins): Focus on clicking and first miners
- Mid game (1K-100K): Balance between clicking upgrades and more miners
- Late game (100K+): Passive income dominates, focus on multipliers

### Offline Earnings Cap
- Maximum 48 hours of offline earnings
- Prevents exploitation
- Encourages regular return visits

## Theme Integration
All components use theme-aware styling:
- Background colors: `bg-page`, `bg-page-secondary`
- Borders: `border-border`
- Text: `text-text`, `text-text-secondary`
- Primary actions: `bg-primary`, `text-primary`
- Hover effects: `shadow-glow`, `shadow-glow-sm`

## Future Enhancements
- Achievement system integration
- Leaderboards and rankings
- Prestige/reset mechanics
- Random events and bonus drops
- Sound effects
- Advanced upgrades (automation, bots)
- Multiplayer features (trading, gifting)

## Testing Checklist
- ✅ Click mining increments coins correctly
- ✅ Passive income ticks every second accurately
- ✅ Upgrades can be purchased when affordable
- ✅ Upgrades cannot be purchased when unaffordable
- ✅ Offline earnings calculate correctly
- ✅ OfflineEarningsModal appears after returning from idle
- ✅ Game state persists between refreshes
- ✅ Theme switching works during gameplay
- ✅ Rate limiting prevents auto-clicker abuse
- ✅ Number formatting works for all ranges
- ✅ Responsive design works on all devices
- ✅ Keyboard navigation works throughout
- ✅ No console errors or warnings
- ✅ Performance is smooth (60fps)

## Known Limitations
- Very large numbers (>1e308) may require additional library (break_infinity.js)
- localStorage has storage limits (~5-10MB)
- Offline earnings capped at 48 hours
- No server-side validation (client-side only)

## Development Notes
- All game logic is pure and testable
- State management is immutable
- Components are theme-aware and responsive
- Code follows TypeScript best practices
- Performance-optimized for smooth gameplay

