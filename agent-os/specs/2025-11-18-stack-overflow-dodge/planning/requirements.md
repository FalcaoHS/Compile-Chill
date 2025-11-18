# Spec Requirements: Stack Overflow Dodge

## Initial Description
Create dodge game where players avoid falling "errors" with power-ups ("resolveu!", "copiou do stackoverflow"), score tracking, and theme integration.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the player controls a character or cursor that moves left/right (or freely) at the bottom of the screen to dodge falling "errors" from the top. Is that correct, or should movement be different (e.g., free movement across the screen, or a fixed position with dodge mechanics)?
**Answer:** 
- ✔ Personagem/cursor se move apenas horizontalmente na parte inferior da tela
- Estilo "classic dodge game", extremamente intuitivo
- Simples, rápido, funciona em mobile e desktop
- Não gera problemas de espaço vertical (importante para evitar scroll!)
- ❌ NÃO usar: movimento livre pela tela inteira, teleport, dash lateral (poder para outra versão)
- ⚠️ A barra inferior + canvas devem caber sem forçar scroll

**Q2:** For the falling "errors", I'm thinking dev-themed error messages like "TypeError", "ReferenceError", "SyntaxError", "404 Not Found", or similar. Should we include these types, or focus on visual error representations (red X icons, broken code symbols, etc.)?
**Answer:** 
- ✔ DEVE ser dev-themed, mas legível rápido
- Tipos recomendados:
  - TypeError
  - ReferenceError
  - SyntaxError
  - 404 Not Found
  - NullPointerException
  - Segmentation Fault (tema hacker)
  - Undefined is not a function (tema JS)
  - linhas bugadas pixeladas
- Forma visual: caixinhas pixel, com brilho neon (tema-aware), texto curto no centro ("TypeError" etc.), velocidade aumenta ao longo do tempo
- ❌ NÃO usar logos oficiais
- ❌ NÃO usar texto muito longo (o jogador não consegue ler)
- ⚠️ Tamanho fixo dos erros para não ampliar a área vertical

**Q3:** For power-ups like "resolveu!" and "copiou do stackoverflow", I'm thinking:
   - "resolveu!" could clear nearby errors or grant temporary invincibility
   - "copiou do stackoverflow" could slow down falling errors or grant bonus points
   Is that the intended behavior, or should they work differently?
**Answer:** 
- 1. "resolveu!":
  - limpa todos os erros próximos
  - ou dá 2–3 segundos de invencibilidade
  - animação de explosão pixel/neon
  - efeito rápido (não longo)
- 2. "copiou do stackoverflow":
  - reduz velocidade dos erros por 3–5 segundos
  - pequeno bônus de pontos
  - efeito visual: "vento" subindo ou glitch azul
- ❌ NÃO usar: power-ups permanentes, upgrades cumulativos, barra de energia
- Mantém o jogo simples, divertido, estilo arcade
- ⚠️ Power-ups devem ser pequenos e não empurrar layout

**Q4:** I assume the score increases over time (survival-based) and gets bonuses from collecting power-ups. Should we use this time-based scoring with power-up bonuses, or a different system (e.g., points per error avoided, combo multipliers)?
**Answer:** 
- ✔ Sistema de Pontuação: survival-based + bônus por power-ups
- O score aumenta automaticamente com o tempo: 1 ponto por X milissegundos vivos (gateway de 10–15 pts por segundo)
- Bônus:
  - +50 ao pegar "resolveu!"
  - +30 ao pegar "copiou do stackoverflow"
  - combos opcionais no futuro
- ❌ NÃO usar: pontos por erro desviado (difícil medir), multiplicadores avançados no MVP
- Simples = mais divertido
- ⚠️ HUD deve ser compacto, horizontal, bem no topo do canvas

**Q5:** I'm thinking the game gets progressively harder by increasing the fall speed of errors, spawning them more frequently, and adding more complex patterns (multiple errors at once). Is that the approach you want?
**Answer:** 
- ✔ Aumento progressivo por:
  - velocidade dos erros aumentando
  - spawn rate maior
  - erros nascendo em padrões mais complexos (2–3 simultâneos)
- Após certo tempo:
  - eventos "caos" com chuva intensa por 2–3 segundos
  - depois volta ao normal
- Sem fases, só dificuldade crescente estilo endless
- ⚠️ Toda dificuldade deve caber dentro do mesmo canvas sem expandir altura

**Q6:** For visual style, should we use pixel art (like Bit Runner), minimalist geometric shapes (like Dev Pong), or a mix? Should errors and power-ups be clearly distinguishable with theme-aware colors?
**Answer:** 
- ✔ Estilo visual: pixel + neon
- Misturar Pixel Runner + Pong, mas de forma minimalista
- Recomendações:
  - personagem pixelado
  - erros com borda neon leve
  - partículas pequenas caindo
  - tema-aware:
    - Neon Future → roxo+azul
    - Cyber Hacker → verde matrix
    - Pixel Lab → cores vibrantes e dithering
    - Terminal → ASCII errors X e !!!
- ❌ NÃO: partículas exageradas, animações 3D, sprites pesados
- ⚠️ Efeitos leves para não exigir expandir canvas (evitar scroll)

**Q7:** For controls, I assume keyboard (arrow keys or WASD for movement) and touch (swipe or tap to move). Is that correct, or should we include mouse controls (click to move)?
**Answer:** 
- ✔ Desktop:
  - Setas (←/→)
  - A/D
  - Mouse move opcional (tracking horizontal leve)
- ✔ Mobile:
  - Swipe esquerdo/direito
  - Botões virtuais opcionais (pequenos, sem interferir no canvas)
- ❌ Não usar: toques no topo da tela, movimento vertical, multitoque avançado
- ⚠️ Botões de toque devem ficar fora da área que pode causar scroll

**Q8:** I assume we're NOT including: multiple characters, special abilities beyond power-ups, multiple game modes, boss errors, or collectible items beyond power-ups. Is there anything else we should explicitly exclude?
**Answer:** 
- ❌ O que NÃO entra no MVP:
  - múltiplos personagens
  - skins
  - habilidades especiais
  - modos extras (campanha, boss)
  - itens colecionáveis além dos 2 power-ups
  - física avançada
  - integração com StackOverflow real (óbvio mas precisa dizer)
  - eventos aleatórios gigantes
  - telas maiores que a viewport
- ⚠️ Reforço: nenhum elemento do jogo pode empurrar a página para baixo

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Bit Runner - Path: `app/jogos/bit-runner/page.tsx`, `components/games/bit-runner/`
  - Layout structure: header with back link, title, HUD, game area
  - Canvas rendering with pixel art, theme-aware colors, 60 FPS optimization
  - Game loop with requestAnimationFrame pattern
  - Input handling (keyboard and touch/swipe)
  - Score submission to API
  - Game over modal pattern
- Feature: Dev Pong - Path: `app/jogos/dev-pong/page.tsx`, `components/games/dev-pong/`
  - Canvas rendering integration pattern
  - Minimalist arcade style
  - Mouse controls pattern (click and drag)
  - Score display component structure
- Feature: Terminal 2048 - Path: `app/jogos/terminal-2048/page.tsx`, `components/games/terminal-2048/`
  - Layout structure: header with back link, title, HUD, game area, instructions footer
  - ScoreDisplay component structure, responsive sizing, theme-aware styling
  - GameOverModal component with AnimatePresence, backdrop blur, score display, action buttons (Play Again, Back to Home)
  - Theme system integration
- Feature: Hack Grid / Debug Maze - Path: `app/jogos/hack-grid/page.tsx`, `app/jogos/debug-maze/page.tsx`
  - h-screen layout without vertical scroll pattern
  - Stats bar pattern (border-b border-border bg-page-secondary flex-shrink-0)
  - Game area with flex-1 overflow-hidden flex items-center justify-center
  - ScoreDisplay and GameOverModal components

**Components to potentially reuse:**
- ScoreDisplay component structure (from Terminal 2048, Bit Runner, Hack Grid)
- GameOverModal component structure (from Terminal 2048, Bit Runner, Dev Pong)
- Game page layout template (h-screen flex flex-col overflow-hidden pattern)
- Canvas rendering patterns (from Bit Runner, Dev Pong)
- Input handling patterns (keyboard from Terminal 2048, touch/swipe from Bit Runner)
- Score submission API integration (from Bit Runner, Terminal 2048)
- Theme system integration (all games)

**Backend logic to reference:**
- Score submission API: `app/api/scores/route.ts` - POST endpoint for score submission
- Score metadata structure (duration, moves, level)
- Validation with Zod schemas

### Follow-up Questions

No follow-up questions needed. All requirements are clear and comprehensive.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - No visual files found.

## Requirements Summary

### Functional Requirements

**Player Movement:**
- Character/cursor moves only horizontally at the bottom of the screen
- Classic dodge game style, extremely intuitive
- Simple, fast, works on mobile and desktop
- No vertical space issues (important to avoid scroll!)
- Bottom bar + canvas must fit without forcing scroll

**Falling Errors System:**
- Dev-themed error messages: TypeError, ReferenceError, SyntaxError, 404 Not Found, NullPointerException, Segmentation Fault, Undefined is not a function, buggy pixelated lines
- Visual form: pixel boxes, with neon glow (theme-aware), short text in center ("TypeError" etc.), speed increases over time
- Fixed error size to not expand vertical area
- No official logos
- No very long text (player can't read it)

**Power-up System:**
- "resolveu!": clears all nearby errors OR grants 2-3 seconds of invincibility, pixel/neon explosion animation, quick effect (not long)
- "copiou do stackoverflow": reduces error speed for 3-5 seconds, small point bonus, visual effect: "wind" rising or blue glitch
- No permanent power-ups, no cumulative upgrades, no energy bar
- Power-ups must be small and not push layout

**Scoring System:**
- Survival-based + power-up bonuses
- Score increases automatically with time: 1 point per X milliseconds alive (gateway of 10-15 pts per second)
- Bonuses:
  - +50 when collecting "resolveu!"
  - +30 when collecting "copiou do stackoverflow"
  - Optional combos for future
- No points per error dodged (hard to measure)
- No advanced multipliers in MVP
- HUD must be compact, horizontal, right at top of canvas

**Difficulty Progression:**
- Progressive increase by:
  - Error speed increasing
  - Higher spawn rate
  - Errors spawning in more complex patterns (2-3 simultaneous)
- After certain time:
  - "chaos" events with intense rain for 2-3 seconds
  - Then returns to normal
- No phases, just endless increasing difficulty
- All difficulty must fit within same canvas without expanding height

**Visual Design:**
- Pixel + neon style
- Mix Pixel Runner + Pong, but minimalist
- Pixel character
- Errors with light neon border
- Small falling particles
- Theme-aware:
  - Neon Future → purple+blue
  - Cyber Hacker → matrix green
  - Pixel Lab → vibrant colors and dithering
  - Terminal → ASCII errors X and !!!
- No exaggerated particles, 3D animations, heavy sprites
- Light effects to not require expanding canvas (avoid scroll)

**Controls:**
- Desktop: Arrow keys (←/→), A/D, optional mouse move (light horizontal tracking)
- Mobile: Left/right swipe, optional virtual buttons (small, don't interfere with canvas)
- No touches at top of screen, no vertical movement, no advanced multitouch
- Touch buttons must be outside area that can cause scroll

### Reusability Opportunities

**UI Components:**
- ScoreDisplay component structure from Terminal 2048, Bit Runner, Hack Grid
- GameOverModal component structure from Terminal 2048, Bit Runner, Dev Pong
- Game page layout template (h-screen flex flex-col overflow-hidden pattern)

**Game Logic Patterns:**
- Canvas rendering patterns from Bit Runner (pixel art, theme-aware colors, 60 FPS optimization)
- Game loop with requestAnimationFrame pattern from Bit Runner
- Input handling patterns: keyboard from Terminal 2048, touch/swipe from Bit Runner

**Backend Patterns:**
- Score submission API integration from Bit Runner, Terminal 2048
- Score metadata structure (duration, moves, level)
- Validation with Zod schemas

**Theme System:**
- Theme-aware styling using CSS variables
- Theme integration patterns from all existing games

### Scope Boundaries

**In Scope:**
- Horizontal movement at bottom of screen
- Dev-themed falling errors from top
- Two power-ups: "resolveu!" and "copiou do stackoverflow"
- Survival-based scoring with power-up bonuses
- Progressive difficulty (speed, spawn rate, patterns)
- Pixel + neon visual style, theme-aware
- Keyboard, touch, and optional mouse controls
- Score tracking and submission
- Game over modal
- Responsive design (mobile and desktop)
- No vertical scroll (h-screen layout)

**Out of Scope:**
- Multiple characters
- Skins
- Special abilities beyond the 2 power-ups
- Extra modes (campaign, boss)
- Collectible items beyond the 2 power-ups
- Advanced physics
- Real StackOverflow integration
- Giant random events
- Screens larger than viewport
- Free movement across entire screen
- Teleport mechanics
- Lateral dash (power for another version)
- Permanent power-ups
- Cumulative upgrades
- Energy bar
- Points per error dodged
- Advanced multipliers in MVP
- Multiple difficulty levels
- Phases or levels
- Exaggerated particles
- 3D animations
- Heavy sprites

### Technical Considerations

**Integration Points:**
- Score submission API: `app/api/scores/route.ts`
- Theme system integration (all 5 themes)
- Session management for authenticated score submission

**Existing System Constraints:**
- Must use h-screen layout without vertical scroll (UI/UX Guidelines)
- Canvas must fit within viewport without expanding
- All elements must respect theme switching without layout shifts
- Responsive design required (mobile and desktop)

**Technology Preferences:**
- Canvas API for rendering (like Bit Runner, Dev Pong)
- Framer Motion for modal animations
- TailwindCSS for styling
- Theme tokens (CSS variables) for theme-aware styling
- requestAnimationFrame for game loop (60 FPS target)

**Similar Code Patterns to Follow:**
- Bit Runner canvas rendering pattern
- Terminal 2048 page layout structure
- Bit Runner input handling (keyboard + touch)
- Dev Pong mouse controls pattern (optional)
- Hack Grid/Debug Maze h-screen layout pattern
- All games' ScoreDisplay and GameOverModal component patterns

