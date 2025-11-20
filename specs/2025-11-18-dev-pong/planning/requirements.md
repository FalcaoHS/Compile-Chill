# Spec Requirements: Dev Pong

## Initial Description
Build minimal Pong game with futuristic aesthetics, theme integration, score tracking, and responsive controls.

## Requirements Discussion

### First Round Questions

**Q1:** I assume this is a single-player game where the player controls one paddle and plays against a simple AI opponent. Is that correct, or should we include multiplayer (local 2-player on same keyboard)?
**Answer:** Single-player contra uma AI simples. Mantém o jogo leve, rápido e de "descompressão". Menor esforço de implementação. 2-player local pode ser adicionado depois como "Modo Caos". Decisão final: ✔ single-player agora, ❌ multiplayer por enquanto.

**Q2:** For the "dev" aesthetic, I'm thinking the paddles could be styled as code brackets `[` and `]`, and the ball could be a pixel/dot with a trailing particle effect. Should we add dev-themed elements like this, or keep it minimal with just theme-aware colors?
**Answer:** Sim — dev aesthetic no limite, mas tasteful. 
- Paddles como brackets: Esquerda = `[`, Direita = `]` (feitos com espessura neon ou pixel dependendo do tema)
- A bola com identidade dev: um pixel brilhante "•" com rastro de partículas baseado no tema, ocasional "glitch micro" ao colidir (1 frame distort)
- Efeitos sutis: código flutuando em background (scanlines ou símbolos), linhas horizontais estilo terminal
- ⚠️ Não exagerar para não atrapalhar gameplay

**Q3:** I assume the player paddle is controlled with keyboard (W/S or Arrow Up/Down keys) and optionally mouse movement for desktop, with touch drag/swipe for mobile. Is that correct?
**Answer:** 
- ✔ Teclado: W/S, Setas Up/Down
- ✔ Mouse (opcional): mover paddle acompanhando Y do cursor (desativável para mobile)
- ✔ Mobile: toque/arraste vertical no lado esquerdo
É o conjunto mais confortável e universal.

**Q4:** I'm thinking a classic Pong scoring where first to reach 7 points wins the match, with the final score being points earned (winning = 7 points). Should we use this approach, or track cumulative points across multiple matches as the submittable score?
**Answer:** Jogo termina quando alguém faz 7 pontos. Score enviado = quantos pontos o jogador fez (máximo 7). Para ranking e metas internas, guardar também duração e hits. Por quê não acumular? → porque vira grind, não descompressão. → manter jogos curtos é o DNA do portal. Decisão final: ✔ score final = pontos do match (0 a 7), ✔ histórico registra tudo, ❌ nada de score cumulativo por enquanto.

**Q5:** Should the AI opponent have a fixed difficulty level, or should it progressively get harder as the player scores points?
**Answer:** AI com dificuldade adaptativa suave e invisível. Regras: começa lenta, acompanha erro médio do jogador, escala leve a cada ponto do jogador, nunca deve ficar impossível. Justificativa: → sensação de progresso sem frustração.

**Q6:** I assume matches are designed to be quick (2-3 minutes max), fitting the "decompression break" model like Terminal 2048. Is that correct?
**Answer:** Sim — máximo 2–3 minutos, ideal 1–2 mins. Um match deve ser: rápido, divertido, replayable, ótimo para ocupação mental curta (descompressão).

**Q7:** For the "futuristic aesthetics," should we add simple particle effects on ball hits, paddle glow effects, and smooth animations? Or keep it extremely minimal with just clean shapes and theme colors?
**Answer:** Use efeitos visuais, porém moderados:
- ✔ Efeitos recomendados: glow no paddle baseado no tema, partículas ao bater na parede, rastro neon/pixel/glitch da bola, micro tremer ao colidir em alta velocidade, leve paralaxe no background (dependendo do tema)
- ❌ Evitar: explosões pesadas, efeitos volumétricos, partículas demais (para manter FPS alto e universal)

**Q8:** I assume we're NOT including: power-ups, multiple game modes, sound effects (for now), replay functionality, or ball speed variations. Is there anything else we should explicitly exclude?
**Answer:** Para não atrasar o MVP, excluir:
- ❌ power-ups
- ❌ modos de jogo alternativos
- ❌ SFX avançados (somente se quiser um "bip minimal")
- ❌ replay
- ❌ dificuldade múltipla
- ❌ skins
- ❌ pontuação cumulativa
- ❌ multiplayer
- ❌ física avançada (spin, bounce irregular)
Mantenha "Pong moderno tech".

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Terminal 2048 - Path: `specs/2025-11-18-terminal-2048/`
- Game Layout Pattern: título em cima, score/top HUD, canvas central, footer com controles, theme-aware container
- Score Display Components: barra superior, HUD lateral (opcional), modal de "match finalizado"
- Game Over Modal: animar entrada, botão "jogar de novo", botão "compartilhar", botão "voltar ao portal"
- Theme Integration: já existe camada de theme-awareness → reaproveitar classes e CSS vars para paddles, bola, background
- Control Handling: O sistema de teclado/touch do Terminal 2048 pode ser 90% reutilizado, mudando apenas movimento por eixo Y e sensibilidade/taxa de update

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
- Single-player vs adaptive AI
- First to 7 points wins
- Match duration: 1-3 minutes (ideal 1-2 mins)
- AI starts slow and adapts to player skill
- AI scales difficulty per player point scored
- AI never becomes impossible

**Dev-Themed Aesthetics:**
- Left paddle: `[` bracket
- Right paddle: `]` bracket
- Ball: pixel brilhante "•" with particle trail
- Ball: micro glitch effect on collision (1 frame distort)
- Background: floating code symbols, scanlines, terminal horizontal lines
- Theme-aware colors and effects (neon/pixel depending on theme)

**Controls:**
- Keyboard: W/S keys or Arrow Up/Down keys
- Mouse: paddle follows Y position of cursor (optional, can be disabled on mobile)
- Mobile: touch/drag vertical on left side of screen

**Visual Effects:**
- Paddle glow based on theme
- Particles on wall hits
- Ball trail (neon/pixel/glitch style)
- Micro shake on high-velocity collision
- Light parallax in background (theme-dependent)
- Maintain high FPS across devices

**Score Tracking:**
- Track points scored by player (0-7)
- Track match duration
- Track ball hits count
- Submit final score to database (player's points, max 7)
- Store duration and hits for internal ranking metrics

**Game Over State:**
- Show modal when match ends (someone reaches 7 points)
- Display final score
- "Play Again" button
- "Share" button
- "Back to Home" button
- Theme-aware modal styling
- Animated entrance

### Reusability Opportunities

**From Terminal 2048:**
- Game page layout structure (`/app/jogos/terminal-2048/page.tsx`)
- Score display components
- Game over modal component
- Theme integration patterns
- Keyboard and touch control handling (adapt for Y-axis movement)
- Theme-aware containers and styling

**From Theme System:**
- Theme tokens from `lib/themes.ts`
- Theme context and switching
- CSS variables for colors and effects

**From Games Infrastructure:**
- Game configuration from `lib/games.ts`
- Game card navigation patterns from `components/GameCard.tsx`

### Scope Boundaries

**In Scope:**
- Single-player gameplay
- Adaptive AI opponent
- Dev-themed paddles (brackets) and ball (pixel with trail)
- Keyboard, mouse, and touch controls
- Score tracking and submission (0-7 points)
- Match duration: 1-3 minutes
- Theme-aware visual effects (glow, particles, trails)
- Background dev aesthetic (floating code, scanlines)
- Game over modal with replay/share/home options
- Responsive layout (mobile and desktop)

**Out of Scope:**
- Multiplayer (local 2-player) - future "Modo Caos"
- Power-ups
- Multiple game modes
- Advanced sound effects (maybe minimal "bip" only)
- Replay functionality
- Multiple difficulty settings (AI adapts automatically)
- Paddle/ball skins
- Cumulative scoring across matches
- Advanced physics (spin, irregular bounce)
- Heavy visual effects (explosions, volumetric effects, excessive particles)

### Technical Considerations

**Rendering:**
- Use Canvas API for game rendering (lighter than Pixi.js for this simple game)
- Ensure 60 FPS on all devices
- Optimize particle systems for performance

**Game State:**
- Track paddle positions (player and AI)
- Track ball position and velocity
- Track score (player and AI)
- Track match start time
- Track hit count
- Structure for server-side validation (future feature 5b)

**AI Implementation:**
- Start with slow reaction time
- Calculate player's average error/skill
- Gradually increase AI speed per player point
- Never make AI perfect (always beatable)

**Theme Integration:**
- Use theme tokens for colors
- Apply theme-specific effects (neon glow for Neon Future, pixel for Pixel Lab, etc.)
- Respond to theme changes in real-time

**Controls:**
- Debounce rapid inputs
- Smooth paddle movement
- Touch gesture detection for mobile
- Mouse position tracking for optional mouse control

**Similar Code Patterns:**
- Follow game page structure from Terminal 2048
- Reuse modal components and patterns
- Maintain consistent HUD/score display style
- Follow existing control handling patterns

