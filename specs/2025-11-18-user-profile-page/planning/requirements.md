# Spec Requirements: User Profile Page

## Initial Description

User Profile Page

## Requirements Discussion

### First Round Questions

**Q1:** I assume the profile page is accessible at `/perfil` or `/profile` and shows the authenticated user's own profile. Is that correct, or should it be accessible via a different route?

**Answer:** 
- Perfil próprio: `/profile`
- Perfil público: `/u/[username]` (ou `[id]` caso não haja username)
- Motivo: deixa separado o "meu perfil" do "perfil público", melhora DX e simplifica regras de autorização.

**Q2:** I'm thinking the page should display: user avatar (from X), user name (from X), total games played across all games, and best score per game. Should we also include additional statistics like average score, recent game history list, or total playtime?

**Answer:** 
Exibir:
- Avatar do X (obrigatório)
- Nome
- @handle ou username do X
- Bio curta (gerada automaticamente, opcional e divertido)
- Data em que entrou no portal
- Tema atual (com botão para alterar)
- Estatísticas gerais:
  - total de jogos jogados
  - melhor score por jogo
  - média de duração por jogo
  - conquistas (badges)
  - Feed pessoal de scores (listado do mais recente ao mais épico)

📌 Estética: Nada de layout genérico. Use visual estilo HUD sci-fi / blueprint / cyber UI dependente do tema.

**Q3:** For game history, I'm assuming we should show a list of recent games (last 10-20 games) with game name, score, date, and a link to view details. Should we include pagination for older games, or keep it limited to recent games only?

**Answer:** 
"Score Cards Cinemáticos" → cada entrada do histórico vira um card estilizado, contendo:

Exemplo de card:
- Título: Terminal 2048 — Score 8192
- Subinfo:
  - Duração: 3m20s
  - Movimentos: 62
  - Data: 2025-11-18
- Visual:
  - Mini gráfico de oscilação (gerado via canvas)
  - Cor + efeitos baseados no tema ativo
- Botões:
  - Compartilhar no X (gera imagem via canvas)
  - Ver detalhes (abre modal com board final, seeds, replay info)

Cards devem ser:
- responsivos
- animados
- únicos por tema (pixel effects / neon glow / hacker scanline etc.)

**Q4:** For authorization, I assume users can only view their own profile page (not other users' profiles). Is that correct, or should we allow viewing other users' profiles (public profiles)?

**Answer:** 
Regras finais:

Perfil próprio (`/profile`):
- ✔ mostra tudo
- ✔ pode alterar tema
- ✔ pode deletar score (futuro)
- ✔ pode alterar preferências

Perfil público (`/u/[user]`):
- ✔ mostra avatar, nome, scores públicos, conquistas
- ❌ NÃO mostra:
  - e-mail
  - feed privado
  - temas bloqueados (se houver)
  - preferências
  - configurações

Se o usuário desabilitar "mostrar histórico público", `/u/[id]` exibe apenas avatar + nome + um card "Este usuário mantém o histórico privado".

**Q5:** I'm thinking the page should be theme-aware, matching the user's selected theme (Cyber Hacker, Pixel Lab, etc.) and using the existing theme system. Should we also allow theme switching directly from the profile page?

**Answer:** 
A página de perfil deve ser 100% theme-aware. Isso significa:
- todos os backgrounds, glows, sombras e tipografia seguem o tema ativo
- cada tema injeta effects layer diferente:
  - Cyber Hacker → scanlines + ruído digital
  - Pixel Lab → dithering + sprites micro
  - Neon Future → glow forte + reflexos
  - Blueprint → grids + anotações desenhadas
  - Terminal Minimal → ASCII, bordas monoespaçadas

O perfil se torna a vitrine visual do tema.

**Q6:** For navigation, I assume we should add a link to the profile page from the existing ProfileButton dropdown menu. Should we also add a link in the header or other navigation areas?

**Answer:** 
No topo do perfil, padrão:
- Voltar (para home)
- Jogos
- Feed
- Ranking
- Configurações (aparece apenas no `/profile`)
- Tema (drop visual grid)

Simples, direto, sem navegação redundante.

**Q7:** For the statistics display, I'm assuming we should show best scores per game in a card/grid layout similar to the home page game cards. Should we also show rankings (user's position in global leaderboard per game) or keep it to personal statistics only?

**Answer:** 
Use blocos densos estilo painel sci-fi:

Estatísticas recomendadas:
- Total de partidas
- Média de duração
- Maior score (global)
- Jogos favoritos (mais jogados)
- Melhor streak
- Distribuição de horários em que joga (ex.: mais ativo às 22h)
- Badge progress

Formato visual:
- sparkline do histórico
- mini gráfico polar de hábitos
- barras horizontais com efeitos do tema

Tudo leve, sem gráficos pesados.

**Q8:** Are there any features or data points you'd like to exclude from this initial profile page implementation? For example, achievements/medals (mentioned in roadmap item 20) or social feed integration (roadmap items 12-14)?

**Answer:** 
❌ 8. Excluído do escopo inicial

Para não atrasar a entrega:

Fora da primeira fase:
- edições de perfil (bio manual)
- badges complexos
- animações 3D
- visualização completa de replay
- estatísticas avançadas por jogo
- paginação infinita do histórico
- comentários no perfil
- página de conquistas detalhada
- configurações de privacidade avançadas

Dentro da primeira fase:
- perfil básico
- histórico básico
- statistics cards simples
- compartilhamento de score
- tema aplicado
- navegação essencial

### Existing Code to Reference

**Similar Features Identified:**
- Feature: GameCard Component - Path: `components/GameCard.tsx`
  - Components to potentially reuse: Card styling patterns, hover effects, theme-aware borders and backgrounds
  - Backend logic to reference: None (frontend component)

- Feature: ScoreDisplay Component - Path: `components/games/terminal-2048/ScoreDisplay.tsx`
  - Components to potentially reuse: Score display formatting, theme-aware styling for statistics
  - Backend logic to reference: None (frontend component)

- Feature: User Scores API - Path: `app/api/scores/me/route.ts`
  - Components to potentially reuse: API endpoint pattern for fetching user scores
  - Backend logic to reference: Score fetching logic, filtering by gameId, authentication pattern using `withAuth`

- Feature: ProfileButton Component - Path: `components/ProfileButton.tsx`
  - Components to potentially reuse: User avatar display, dropdown menu patterns, session handling
  - Backend logic to reference: None (frontend component)

- Feature: Theme System - Path: `components/ThemeProvider.tsx`, `lib/theme-store.ts`, `lib/themes.ts`
  - Components to potentially reuse: Theme context, theme switching logic, theme-aware styling utilities
  - Backend logic to reference: Theme persistence API endpoint pattern

### Follow-up Questions

No follow-up questions were needed - all answers were comprehensive and clear.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets found in the visuals folder.

## Requirements Summary

### Functional Requirements
- **Profile Routes:**
  - Own profile: `/profile` (authenticated users only)
  - Public profile: `/u/[username]` or `/u/[id]` (publicly accessible)

- **User Information Display:**
  - Avatar from X (required)
  - Name from X
  - @handle or username from X
  - Auto-generated short bio (optional, fun)
  - Join date (when user entered the portal)
  - Current theme (with button to change)

- **Statistics Display:**
  - Total games played
  - Best score per game
  - Average duration per game
  - Achievements/badges
  - Personal score feed (listed from most recent to most epic)
  - Additional stats: total matches, average duration, highest score (global), favorite games (most played), best streak, activity time distribution, badge progress

- **Game History Display:**
  - "Score Cards Cinemáticos" (Cinematic Score Cards)
  - Each entry is a styled card containing:
    - Title: Game name — Score value
    - Subinfo: Duration, Moves, Date
    - Visual: Mini oscillation graph (generated via canvas), color + effects based on active theme
    - Buttons: Share on X (generates image via canvas), View details (opens modal with final board, seeds, replay info)
  - Cards must be: responsive, animated, unique per theme (pixel effects / neon glow / hacker scanline etc.)

- **Authorization:**
  - Own profile (`/profile`): Shows everything, can change theme, can delete scores (future), can change preferences
  - Public profile (`/u/[user]`): Shows avatar, name, public scores, achievements. Does NOT show: email, private feed, blocked themes, preferences, settings
  - Privacy option: If user disables "show public history", public profile shows only avatar + name + card "This user keeps history private"

- **Theme Integration:**
  - 100% theme-aware page
  - All backgrounds, glows, shadows, and typography follow active theme
  - Each theme injects different effects layer:
    - Cyber Hacker → scanlines + digital noise
    - Pixel Lab → dithering + micro sprites
    - Neon Future → strong glow + reflections
    - Blueprint → grids + drawn annotations
    - Terminal Minimal → ASCII, monospace borders
  - Profile becomes visual showcase of the theme

- **Navigation:**
  - Top of profile page: Back (to home), Games, Feed, Ranking, Settings (only on `/profile`), Theme (visual grid dropdown)
  - Simple, direct, no redundant navigation

- **Statistics Format:**
  - Dense sci-fi panel style blocks
  - Visual elements: sparkline of history, mini polar graph of habits, horizontal bars with theme effects
  - Lightweight, no heavy graphs

- **User Actions Enabled:**
  - View own profile with full details
  - View public profiles (limited information)
  - Change theme from profile page
  - Share score cards to X (with generated image)
  - View score details in modal
  - Navigate to other sections (Games, Feed, Ranking)

- **Data to be Managed:**
  - User profile data (avatar, name, handle, bio, join date)
  - User statistics (total games, best scores, averages, streaks)
  - Game history (scores, dates, durations, moves)
  - Theme preferences
  - Privacy settings (public/private history)

### Reusability Opportunities
- **Components:**
  - `GameCard.tsx` - Card styling patterns, hover effects, theme-aware styling
  - `ScoreDisplay.tsx` - Score formatting and display patterns
  - `ProfileButton.tsx` - Avatar display, dropdown patterns, session handling

- **Backend Patterns:**
  - `app/api/scores/me/route.ts` - Pattern for fetching user scores with authentication
  - `withAuth` utility - Authentication pattern for protected routes
  - Theme API endpoints - Pattern for theme persistence

- **Similar Features to Model After:**
  - Home page game grid layout for statistics display
  - Game page layouts for consistent navigation patterns
  - Theme system integration patterns

### Scope Boundaries

**In Scope:**
- Basic profile page (`/profile` and `/u/[user]`)
- Basic game history display (cinematic score cards)
- Simple statistics cards
- Score sharing functionality
- Theme application and switching
- Essential navigation
- Public/private profile distinction
- Theme-aware visual effects

**Out of Scope:**
- Profile editing (manual bio editing)
- Complex badges system
- 3D animations
- Complete replay visualization
- Advanced per-game statistics
- Infinite pagination of history
- Comments on profile
- Detailed achievements page
- Advanced privacy settings configuration

### Technical Considerations
- **Integration Points:**
  - NextAuth session management for authentication
  - Prisma database queries for user data and scores
  - Theme system (Zustand/Jotai store) for theme state
  - Canvas API for generating score card images and mini graphs
  - X OAuth for user data (avatar, name, handle)

- **Existing System Constraints:**
  - Must use Next.js 14 App Router
  - Must follow existing theme system architecture
  - Must use TailwindCSS for styling
  - Must use existing authentication patterns (`withAuth`)
  - Must follow existing API route patterns

- **Technology Preferences:**
  - Next.js 14 with React (App Router)
  - TailwindCSS for styling
  - Framer Motion for animations (light animations)
  - Canvas API for graph generation and image creation
  - Theme system integration (existing Zustand/Jotai store)

- **Similar Code Patterns to Follow:**
  - Card component patterns from `GameCard.tsx`
  - Score display patterns from `ScoreDisplay.tsx`
  - API route patterns from `app/api/scores/me/route.ts`
  - Theme-aware styling patterns from existing components
  - Navigation patterns from game pages

