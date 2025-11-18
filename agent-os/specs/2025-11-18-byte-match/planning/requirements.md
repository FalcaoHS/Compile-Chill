# Spec Requirements: Byte Match

## Initial Description
Implement memory matching game with dev-themed pairs (Git icons, /src folders, coffee script, etc.), theme-aware styling, and score tracking.

## Requirements Discussion

### First Round Questions

**Q1:** I assume a classic memory matching game where cards are face-down, players flip two at a time, and matching pairs stay face-up. Is that correct, or do you want a different mechanic?
**Answer:** 
- ✔ Sim, clássico memory game
- Cartas viradas para baixo → jogador vira duas → se combinarem, permanecem abertas
- ❌ Nada de mecânicas alternativas no MVP
- ⚠️ Header fixo: planejar o grid para nunca gerar scroll no desktop

**Q2:** I'm thinking a 4x4 grid (8 pairs) for a quick 1-3 minute game. Should we use a 4x4 grid, or prefer 4x6 (12 pairs) or 6x6 (18 pairs) for more challenge?
**Answer:** 
- ✔ 4×4 (8 pares) no MVP
- ⭐ dura 1–2 minutos, perfeito para a proposta
- No futuro: 4×6 (médio), 6×6 (hardcore dev mode)
- ❌ nada além do 4×4 por agora
- ⚠️ 4×4 cabe perfeitamente sem scroll se o canvas for responsivo

**Q3:** For dev-themed pairs, I'm thinking: Git icon, `/src` folder, CoffeeScript logo, `package.json`, `node_modules`, `.gitignore`, `README.md`, and `tsconfig.json`. Should we use these 8, or do you want different/additional pairs?
**Answer:** 
- ✔ Decisão final de pares (8 itens):
  - Git icon
  - node_modules (caixa gigante pixel)
  - package.json
  - tsconfig.json
  - CoffeeScript logo (pixelizado)
  - /src folder
  - .gitignore
  - README.md
- Observação importante: Para evitar problemas com copyright, usar versões pixel art próprias (não logos oficiais)
- No futuro: Dockerfile, yarn.lock, env vars, código bugado 😅
- Mas no MVP, só esses 8
- ⚠️ Manter tamanhos iguais para não forçar expansão vertical

**Q4:** I'm thinking scoring based on moves (fewer moves = higher score) and optionally time. Should we track moves only, or both moves and time?
**Answer:** 
- ✔ Score baseado em MOVES (menos = melhor)
- ✔ Registrar também TIME para ranking avançado no futuro
- Score enviado ao backend: moves, duration, gridSize, seed (opcional), matches sequence (opcional para validação leve)
- Fórmula sugerida: score = max(1, 100 - moves)
- Simples, claro, justo
- ⚠️ HUD do timer e moves deve caber no topo sem empurrar o canvas

**Q5:** I assume controls are click/tap to flip cards, with a brief delay between flips to show both cards before auto-flipping non-matches. Is that correct, or should we allow flipping multiple pairs quickly?
**Answer:** 
- ✔ Click/tap para virar carta
- ✔ Delay curto (300–600ms) antes de virá-las de volta
- ❌ Não permitir virar mais de duas ao mesmo tempo (senão vira bagunça para validar e pode bugar a UX)
- ⚠️ O delay não pode expandir o layout → usar overlay invisível

**Q6:** I'm thinking the game ends when all pairs are matched, showing a "Game Over" modal with final score, move count, and time. Should we include a "Play Again" button and "Back to Home" link, similar to Terminal 2048?
**Answer:** 
- ✔ Sim, igual ao Terminal 2048
- ✔ animação suave
- ✔ exibe: score final, total de moves, tempo total
- ✔ botões: Play Again, Back to Home, Share Score (no futuro)
- ⚠️ Modal deve ser fixed, não absolvido pelo canvas (evita scroll)

**Q7:** For visual feedback, I'm thinking: flip animations, match highlight (brief glow/pulse), and theme-aware card styling. Should we include these, or keep it minimal?
**Answer:** 
- ✔ Sim, mas moderado:
  - Flip animation (simples, elegante)
  - Glow/pulse ao acertar par
  - Tema-aware:
    - neon → glow fluido
    - pixel → efeito dithering rápido
    - terminal → ASCII flip
    - hacker → glitch leve
    - blueprint → linhas técnicas + pulse azul
- ❌ Nada de partículas pesadas
- ❌ Nada de efeitos 3D
- ❌ Nada que quebre FPS em mobile
- ⚠️ Efeitos não devem aumentar o tamanho do grid (evita scroll)

**Q8:** I assume we're NOT including: multiple difficulty levels, timer pressure mode, hints/power-ups, sound effects, or multiplayer. Is there anything else we should explicitly exclude?
**Answer:** 
- ❌ dificuldade múltipla
- ❌ modo com tempo pressionando
- ❌ power-ups (reveal, shuffle, freeze etc.)
- ❌ multiplayer
- ❌ baralhos temáticos extras
- ❌ sons avançados
- ❌ modo competitivo / torneio
- ❌ cartas gigantes (não caberia sem scroll)
- ⚠️ Reforço: evitar qualquer expansão vertical que crie scroll no desktop

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Terminal 2048 - Path: `app/jogos/terminal-2048/page.tsx`, `components/games/terminal-2048/`
  - Layout central + HUD no topo
  - Game Over modal
  - Botão "restart"
  - System de theme-awareness
  - Função de envio de score
  - Responsividade que evita scroll 🚨
- Feature: Dev Pong - Path: `app/jogos/dev-pong/page.tsx`, `components/games/dev-pong/`
  - Parte do input handling (touch)
  - Efeitos neon/pixel do tema
  - Sistema de tempo e loop de jogo
- Feature: Bit Runner - Path: `app/jogos/bit-runner/page.tsx`
  - Input handling (touch)
  - Efeitos neon/pixel do tema
- Feature: Hack Grid / Debug Maze - Path: `app/jogos/hack-grid/page.tsx`, `app/jogos/debug-maze/page.tsx`
  - Grid container
  - Responsividade para telas pequenas
  - Assets pixelizados

### Follow-up Questions

No follow-up questions needed. All requirements are clear and comprehensive.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - No visual files found.

## Requirements Summary

### Functional Requirements

**Game Mechanics:**
- Classic memory matching game: cards face-down, flip two at a time, matching pairs stay face-up
- 4×4 grid (8 pairs total)
- Game duration: 1-2 minutes (quick decompression break)
- Fixed header: grid must never cause scroll on desktop
- Cards must be equal size to avoid vertical expansion

**Dev-Themed Pairs (8 items):**
- Git icon
- node_modules (pixel box)
- package.json
- tsconfig.json
- CoffeeScript logo (pixelized)
- /src folder
- .gitignore
- README.md
- Important: Use custom pixel art versions (not official logos) to avoid copyright issues
- Future additions: Dockerfile, yarn.lock, env vars, código bugado

**Scoring System:**
- Score based on MOVES (fewer moves = better score)
- Formula: score = max(1, 100 - moves)
- Track TIME for future advanced rankings
- Score submission to backend includes: moves, duration, gridSize, seed (optional), matches sequence (optional for light validation)
- HUD with timer and moves must fit at top without pushing canvas down

**Controls:**
- Click/tap to flip cards
- Short delay (300-600ms) before flipping non-matching pairs back
- Prevent flipping more than two cards at once (prevents validation issues and UX bugs)
- Delay must not expand layout → use invisible overlay

**Game Over State:**
- Trigger: all pairs matched
- Modal with smooth animation (similar to Terminal 2048)
- Display: final score, total moves, total time
- Action buttons: "Play Again", "Back to Home", "Share Score" (future)
- Modal must be fixed, not absolutely positioned by canvas (prevents scroll)

**Visual Feedback:**
- Flip animation (simple, elegant)
- Glow/pulse effect when matching pair
- Theme-aware effects:
  - Neon theme → fluid glow
  - Pixel theme → quick dithering effect
  - Terminal theme → ASCII flip
  - Hacker theme → light glitch
  - Blueprint theme → technical lines + blue pulse
- No heavy particles, 3D effects, or anything that breaks FPS on mobile
- Effects must not increase grid size (prevents scroll)

### Reusability Opportunities

**From Terminal 2048:**
- Layout structure: central game area + HUD at top
- Game Over modal component pattern
- Restart button pattern
- Theme-awareness system integration
- Score submission function pattern
- Responsive layout that prevents scroll

**From Dev Pong / Bit Runner:**
- Touch input handling patterns
- Neon/pixel theme effects
- Game timing and loop system

**From Hack Grid / Debug Maze:**
- Grid container patterns
- Responsive design for small screens
- Pixelized asset patterns

### Scope Boundaries

**In Scope:**
- 4×4 grid memory matching game
- 8 dev-themed pairs with custom pixel art
- Move-based scoring with time tracking
- Click/tap controls with flip delay
- Game Over modal with score, moves, time
- Theme-aware visual effects (flip, glow, pulse)
- Responsive layout that prevents desktop scroll
- Score submission to backend

**Out of Scope:**
- Multiple difficulty levels (4×6, 6×6 grids - future)
- Timer pressure mode
- Power-ups (reveal, shuffle, freeze, etc.)
- Multiplayer
- Extra thematic decks
- Advanced sound effects
- Competitive/tournament mode
- Large cards that would cause scroll
- Any vertical expansion that creates scroll on desktop

### Technical Considerations

**Layout Constraints:**
- Fixed header: grid must never cause scroll on desktop
- 4×4 grid must fit responsively without scroll
- HUD (timer + moves) must fit at top without pushing canvas
- Modal must be fixed positioning (not canvas-relative)
- All effects must not expand grid size

**Theme Integration:**
- Use existing theme system from `lib/themes.ts`
- Apply theme-aware effects per theme type (neon, pixel, terminal, hacker, blueprint)
- All components must respond to theme changes in real-time

**Performance:**
- Maintain 60 FPS on mobile devices
- Avoid heavy particles or 3D effects
- Optimize animations for smooth performance

**Score Validation:**
- Structure game state for future server-side validation
- Track moves, duration, gridSize, seed (optional), matches sequence (optional)
- Follow existing score submission pattern from Terminal 2048

**Asset Requirements:**
- Custom pixel art versions of dev-themed pairs (avoid copyright issues)
- Equal-sized cards to prevent layout expansion
- Theme-aware styling for all visual elements

