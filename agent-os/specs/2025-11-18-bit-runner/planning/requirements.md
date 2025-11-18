# Spec Requirements: Bit Runner

## Initial Description
Implement endless runner game with pixel character, dev-themed obstacles (compilers, bugs, brackets), distance tracking, and theme-aware visuals.

## Requirements Discussion

### First Round Questions

**Q1:** I assume the character runs automatically from left to right, and the player controls jumping (spacebar/up arrow) and ducking (down arrow) to avoid obstacles. Is that correct, or should we include other actions like sliding or double-jump?
**Answer:** 
- ✔ Corrida automática left → right
- ✔ Controles: Space / ↑ = jump, ↓ = duck
- ❌ Nada de slide separado
- ❌ Nada de duplo pulo (aumenta complexidade e deixa menos "dev-clean")
- Se quiser algo extra mais tarde: jump buffer + coyote time (para suavizar inputs)

**Q2:** For dev-themed obstacles, I'm thinking: Compilers (low obstacles), Bugs (high obstacles), Brackets (medium obstacles). Should we include other dev-themed obstacles?
**Answer:** 
- ✔ Obstáculos principais (MVP):
  - Compilers → obstáculos baixos → pular
  - Bugs → obstáculos altos → abaixar
  - Brackets {} [] () → médio → pode pular OU abaixar
- ✔ Adicionais recomendados (leve, não poluir a tela):
  - node_modules/ (grande bloco gigante) — jump
  - ERROR: Unexpected Token — placa suspensa/alta → duck
  - Stack Overflow flame — efeito flamejante pixelado (alto)
  - Warnings amarelos — médios
- ⚠️ Mantenha tudo em pixel e tema-aware
- ⚠️ Evitar excesso de texto (torna a leitura confusa no movimento)
- ❌ Obstáculos que NÃO entram no MVP: Animações complexas tipo boss, obstáculos que mudam de posição, obstáculos que se mexem, obstáculos "interativos" (ex.: abrir/fechar), obstáculos com comportamento físico (desnecessário). Somente versões estáticas por enquanto.

**Q3:** I assume the game gets progressively harder by increasing scroll speed, spawning obstacles more frequently, and adding more complex obstacle patterns. Is that the approach you want?
**Answer:** 
- ✔ Aumento de dificuldade por:
  - Aumento gradual da velocidade do ground
  - Menor espaçamento entre obstáculos
  - Padrões mais complexos (pair combos, double obstacles, high-low combos)
  - Velocidade de spawn levemente aleatória
- ⚠️ Nada de mudar física do personagem
- ⚠️ Nada de hits instantâneos injustos

**Q4:** I'm thinking the score equals distance traveled, with potential bonuses. Should we use this distance-based scoring?
**Answer:** 
- ✔ Score = distância percorrida (excelente, intuitivo, universal)
- ✔ Bônus adicionais opcionais para V2:
  - sobrevivência perfeita (sem hit)
  - combos de obstacles avoided (10 consecutivos = +X bonus)
- ❌ Nada de itens colecionáveis no MVP (deixa o jogo mais limpo e focado)

**Q5:** For the pixel character, should it be a simple pixel sprite, a more detailed dev-themed character, or minimalist?
**Answer:** 
- ✔ Pixel character minimalista, MAS com identidade dev
- Opções:
  - Uma silhueta pixel com óculos brilhantes
  - Um personagem 12–16px correndo com pose estilizada
  - Se quiser o toque dev explícito: mochila com stickers, chapéu pixelado, camisa com </> ou { }
- Características:
  - Simples, legível, high contrast, tema-aware
  - Animação de 2–4 frames para correr
  - Duck → animação comprimida
  - Jump → 2 frames no ar
  - Nada de personagens complexos que carregam peso visual
- ❌ Estilos que NÃO entram: bonecos realistas, mascotes 3D, personagens meme, personagens estilo IA padronizada

**Q6:** I assume obstacles spawn randomly ahead of the character. Should we use pure random spawning, pattern-based spawning, or adaptive difficulty?
**Answer:** 
- ✔ Pattern-based + random variation (perfeito para sensação de "flow state" sem injustiças)
- Sistema:
  - Patterns predefinidos de 2–4 obstáculos
  - Randomização leve entre patterns (20–30%)
  - Algoritmo adaptativo:
    - Se o jogador falha cedo → spawn mais espaçado por 15–20s
    - Se vai bem → aperta gradualmente
  - Isso cria engajamento real, sem parecer cheat
- ❌ Não usar: spawns puramente aleatórios (injusto), spawns baseados em RNG puro

**Q7:** Like other games in the portal, I assume matches should be quick (2-5 minutes max). Should we let players play until they hit an obstacle, add a time limit, or keep it truly endless?
**Answer:** 
- ✔ Jogo endless até bater em um obstáculo
- ✔ Mas com duração típica de 1 a 3 minutos (super alinhado com Portal de Descompressão)
- Sem limite artificial de tempo
- ❌ Não incluir: meta de distância, "níveis", modo de 30s/60s, timeline de fases. Somente endless + dificuldade crescente.

**Q8:** I assume we're NOT including: power-ups, collectibles, multiple characters, special abilities, or multiple game modes. Is there anything else we should explicitly exclude?
**Answer:** 
- ❌ O que NÃO entra no MVP:
  - power-ups
  - vários personagens
  - itens colecionáveis
  - diferentes cenários
  - sistema de skins
  - modos extra (time trial, hardcore)
  - achievements complexos
  - música avançada
  - física avançada (pulo variável, momentum profundo)
- (Tudo isso pode ir para V2 ou V3 depois do portal ganhar público)

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Terminal 2048 - Path: `agent-os/specs/2025-11-18-terminal-2048/`
- Feature: Dev Pong - Path: `agent-os/specs/2025-11-18-dev-pong/`
- Layout: header HUD, botão "restart", container theme-aware, modal game over, compartilhamento de score
- Theme Integration: usar as CSS vars dos temas, efeitos extras (neon glow, scanline, pixel grain, glitch artefactual)
- Control Handling: Sistema de teclado consolidado, Touch gestures adaptados do 2048
- Score System: mesma rota POST /api/scores, mesma lógica de validade (distância = score)

### Follow-up Questions

No follow-up questions needed. All requirements are clear and comprehensive.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
N/A - No visual files found.

## Requirements Summary

### Functional Requirements

**Character Movement:**
- Automatic running from left to right
- Jump control: Spacebar or Up Arrow key
- Duck control: Down Arrow key
- No sliding or double-jump (keeps it dev-clean)
- Future enhancement: jump buffer + coyote time for smoother inputs

**Obstacle System:**
- **Main Obstacles (MVP):**
  - Compilers: Low obstacles (must jump over)
  - Bugs: High obstacles (must duck under)
  - Brackets {} [] (): Medium obstacles (can jump or duck)
- **Additional Obstacles (light, don't clutter screen):**
  - node_modules/: Large block (must jump)
  - ERROR: Unexpected Token: Suspended/high sign (must duck)
  - Stack Overflow flame: Pixelated flaming effect (high)
  - Warnings (yellow): Medium obstacles
- All obstacles: Pixel art, theme-aware, static (no movement or position changes)
- Avoid excessive text (confusing during movement)

**Difficulty Progression:**
- Gradual ground speed increase
- Reduced spacing between obstacles over time
- More complex patterns (pair combos, double obstacles, high-low combos)
- Slightly random spawn velocity
- No changes to character physics
- No instant unfair hits

**Scoring System:**
- Score = distance traveled (intuitive, universal)
- Optional bonuses for V2:
  - Perfect survival (no hits)
  - Obstacle avoidance combos (10 consecutive = bonus)
- No collectible items in MVP (keeps game clean and focused)

**Character Design:**
- Minimalist pixel character with dev identity
- Options: Silhouette with glowing glasses, 12-16px character with stylized running pose
- Dev touches: Backpack with stickers, pixelated hat, shirt with </> or { }
- Characteristics:
  - Simple, readable, high contrast, theme-aware
  - 2-4 frame running animation
  - Duck: compressed animation
  - Jump: 2 frames in air
  - No complex characters with visual weight
- Excluded styles: Realistic characters, 3D mascots, meme characters, AI-generated style characters

**Obstacle Spawning:**
- Pattern-based + random variation (perfect for flow state without unfairness)
- System:
  - Predefined patterns of 2-4 obstacles
  - Light randomization between patterns (20-30%)
  - Adaptive algorithm:
    - If player fails early → more spaced spawns for 15-20s
    - If doing well → gradually tightens
  - Creates real engagement without feeling like cheating
- Not using: Pure random spawns (unfair), RNG-based spawns

**Game Duration:**
- Endless until hitting an obstacle
- Typical duration: 1-3 minutes (aligned with Decompression Portal)
- No artificial time limit
- Excluded: Distance goals, "levels", 30s/60s modes, phase timelines
- Only endless + increasing difficulty

### Reusability Opportunities

**From Terminal 2048 and Dev Pong:**
- Game page layout structure (header, HUD, restart button, container)
- Game over modal pattern
- Score display components
- Theme-aware styling and CSS variables
- Keyboard control handling
- Touch gesture handling
- Score submission API pattern (POST /api/scores)
- Theme integration (neon glow, scanlines, pixel grain, glitch artifacts)

### Scope Boundaries

**In Scope:**
- Automatic left-to-right running
- Jump and duck controls
- Dev-themed static obstacles (compilers, bugs, brackets, node_modules, errors, warnings)
- Distance-based scoring
- Pattern-based obstacle spawning with adaptive difficulty
- Progressive difficulty (speed, spacing, patterns)
- Pixel character with dev identity (12-16px, 2-4 frame animations)
- Theme-aware visuals
- Game over on obstacle hit
- Score submission to API

**Out of Scope:**
- Power-ups
- Multiple characters
- Collectible items
- Different backgrounds/scenarios
- Skin system
- Extra modes (time trial, hardcore)
- Complex achievements
- Advanced music
- Advanced physics (variable jump, deep momentum)
- Sliding action
- Double-jump
- Moving or interactive obstacles
- Boss-style complex animations
- Obstacles that change position
- Time limits or distance goals
- Level system
- Phase timelines

### Technical Considerations

**Rendering:**
- Use Canvas API (lighter than Pixi.js for this game)
- Maintain 60 FPS performance
- Pixel art style with theme-aware colors
- Simple animations (2-4 frames for character)

**Game State:**
- Track character position and state (running, jumping, ducking)
- Track distance traveled (score)
- Track obstacle positions and patterns
- Track game speed (increases over time)
- Track spawn patterns and timing
- Structure for future server-side validation

**Controls:**
- Keyboard: Space/Up Arrow for jump, Down Arrow for duck
- Touch: Swipe up for jump, swipe down for duck
- Debounce rapid inputs
- Smooth character state transitions

**Theme Integration:**
- Use theme tokens for colors
- Apply theme-specific effects (neon glow, scanlines, pixel grain)
- Character and obstacles adapt to current theme
- Background elements theme-aware

**Similar Code Patterns:**
- Follow game page structure from Terminal 2048/Dev Pong
- Reuse modal components and patterns
- Maintain consistent HUD/score display style
- Follow existing control handling patterns
- Use same score submission endpoint

