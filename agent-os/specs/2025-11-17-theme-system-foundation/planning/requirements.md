# Spec Requirements: Theme System Foundation

## Initial Description

"Quero que crie todos, use a sua criatividade ao máximo para que fique algo impactante, bonito e agradável em todos os temas, imagine algo único. Theme System Foundation."

## Requirements Discussion

### First Round Questions

**Q1:** Theme Implementation Approach: I'm assuming we should use CSS custom properties (CSS variables) combined with TailwindCSS configuration to define theme tokens (colors, fonts, effects) for each of the 5 themes. Should we extend the current Tailwind config with theme-specific design tokens, or would you prefer a different approach?

**Answer:** Use CSS custom properties (variáveis) + Tailwind. Padrão: definir tokens por tema como CSS vars em atributos data-theme="..." (ou classes), e mapear cores do Tailwind para essas variáveis. Isso dá o melhor dos dois mundos: performance do Tailwind e flexibilidade das vars.

**Q2:** Theme Switcher Location: I'm thinking the theme switcher should be in the Header component (as mentioned in roadmap item 22), accessible from all pages. Should it be a dropdown menu, a horizontal button group, or a more creative UI element (like a visual theme preview grid)?

**Answer:** Header fixo (acessível em todas as páginas) — confirmado. UI recomendada: mini visual preview grid (3×2 tiles) dentro de um dropdown — melhor usabilidade e mais "épico" que botões simples. Cada tile mostra miniatura do tema (fundo + sample text + small animated accent). Ao passar o mouse, o tile pode animar (hover preview). Fluxo: Header: ícone (paleta) → abre dropdown com previews + botão "Salvar no perfil" (só aparece se autenticado). Atalho: tecla T para abrir switcher (opcional).

**Q3:** Theme Persistence: I assume we should persist the selected theme in localStorage so it persists across sessions. Should we also sync it with the user's profile in the database (for authenticated users), or is localStorage-only persistence sufficient for this foundation?

**Answer:** Persistência localStorage: obrigatória (funciona offline/guest). Sincronizar com DB: sim, sincronizar para usuários autenticados. OnLogin: se usuário tem preferência salva no DB → aplica. On change (auth user): enviar PATCH /api/users/me/theme para salvar. Mantém coerência entre dispositivos. Rationale: localStorage é rápido e sem backend; DB garante preferência entre dispositivos.

**Q4:** State Management Library: The tech stack mentions Zustand or Jotai. I'm assuming Zustand would be a good fit for theme state management. Should we create a dedicated theme store, or would you prefer Jotai for this?

**Answer:** Use Zustand para a store global de tema. É simples, performático e integra bem com componentes. Crie uma store dedicada useThemeStore() com getters/setters e efeito para persistência/localStorage + sync API.

**Q5:** Theme Transitions: To make it impactful and pleasant, I'm thinking we should add smooth transitions when switching themes (using Framer Motion or CSS transitions). Should transitions be instant, or would you prefer a brief animated transition (e.g., fade, slide, or a unique effect per theme)?

**Answer:** Use curtas animações — não instantâneas. Recomendo fade + subtle transform (300–450ms). Use CSS transitions para cores e Framer Motion para overlay/preview effects quando trocar de tema. Sugestão: transição padrão: fade-out overlay → trocar vars → fade-in overlay (300ms). Para temas com personalidade, adicione um micro efeito específico (ex.: scanline slide-in para Cyber, pixel glitch flash para Pixel Lab).

**Q6:** Theme-Specific Effects: Based on the raw idea descriptions (scanlines for Cyber Hacker, pixel effects for Pixel Lab, neon glows for Neon Future, etc.), I'm assuming each theme should have unique visual effects and animations. Should these effects be applied globally (background effects, overlays) or only to specific components?

**Answer:** Efeitos globais (background, overlays, scanlines, background-grain, neon bloom): aplique via containers de nível alto (ex.: <ThemeEffects /> montado no layout). Efeitos de componente (botões, cards, tiles): aplicar classes utilitárias que leem as CSS vars (ex.: .btn usa box-shadow: var(--btn-glow)), e algumas variações por tema se necessário. Motivo: separação de preocupações — melhora performance (evita aplicar heavy effects em cada componente).

**Q7:** Design Tokens Structure: I'm thinking we should define comprehensive design tokens for each theme (primary/secondary colors, background gradients, border styles, typography, shadows, glows, etc.). Should we create a structured theme configuration object that can be easily extended, or do you have a specific structure in mind?

**Answer:** Um objeto JS que documenta tokens (útil para storybook e UI devs) + CSS que aplica os tokens por tema. themes.js (documentação / exportável) com objeto THEMES contendo name e vars para cada tema. CSS (aplicar tokens): :root { /* fallback / default */ } e [data-theme="cyber"] { --color-bg: #070912; ... } repetir para outros temas.

**Q8:** Scope Boundaries: For this foundation, I'm assuming we should focus on: theme switching infrastructure, persistence, global context, and basic theme-aware styling for existing components (Header, buttons, etc.). Should we exclude theme-specific implementations for games (which will come later), or include basic game theme styling in this foundation?

**Answer:** Incluir infra de theme switching completa: store (Zustand), aplicação runtime dos CSS vars, persistência localStorage, sync API hooks (stubbed), ThemeSwitcher UI (dropdown com previews), Transitions e component tokens (Header, Buttons, Cards, Inputs). ❌ Exclua por enquanto: implementações completas de efeitos que exigem mudanças nas engines dos jogos (Pixi, WebGL). ✅ Inclua: funções utilitárias e classes CSS para games usarem (ex.: data-theme hook, helper applyThemeToCanvas(canvas, theme)).

### Existing Code to Reference

**Similar Features Identified:**
- Feature: Header Component - Path: `components/Header.tsx`
  - Components to potentially reuse: Header structure and layout
  - Backend logic to reference: None (frontend-only feature)
- Feature: LoginButton Component - Path: `components/LoginButton.tsx`
  - Components to potentially reuse: Button styling patterns and theme-aware classes
  - Backend logic to reference: None
- Feature: ProfileButton Component - Path: `components/ProfileButton.tsx`
  - Components to potentially reuse: Dropdown menu pattern for ThemeSwitcher reference
  - Backend logic to reference: None
- Feature: Providers Component - Path: `app/providers.tsx`
  - Components to potentially reuse: Provider wrapper pattern for ThemeProvider
  - Backend logic to reference: None
- Feature: Root Layout - Path: `app/layout.tsx`
  - Components to potentially reuse: Layout structure for mounting ThemeEffects component
  - Backend logic to reference: None
- Feature: User Model - Path: `prisma/schema.prisma`
  - Components to potentially reuse: User model structure
  - Backend logic to reference: Need to add `theme` field to User model for database persistence

**User Recommendation:**
User mentioned reusing Header (include ThemeSwitcher), Layout (mount ThemeEffects), and Button (adapt tokens). User indicated they can provide paths if needed, but recommended these integration points.

### Follow-up Questions

No follow-up questions needed. User provided comprehensive and detailed answers covering all aspects.

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze.

## Requirements Summary

### Functional Requirements

**Core Theme System:**
- Implement CSS custom properties (CSS variables) with data-theme attributes
- Extend Tailwind config to reference CSS variables (avoid compiling tokens per theme)
- Create themes.js configuration object documenting all theme tokens
- Create CSS rules applying tokens per theme using [data-theme="..."] selectors
- Support 5 themes: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev

**Theme Switcher UI:**
- Location: Fixed Header component, accessible from all pages
- UI Pattern: Mini visual preview grid (3×2 tiles) within dropdown
- Each tile shows: theme preview (background + sample text + small animated accent)
- Hover interaction: Tiles animate on hover (hover preview)
- Icon: Palette icon in header opens dropdown
- Optional: Keyboard shortcut (T key) to open switcher
- Authenticated users: Show "Salvar no perfil" button in dropdown

**State Management:**
- Use Zustand for global theme state management
- Create dedicated useThemeStore() with getters/setters
- Implement persistence effect for localStorage
- Implement API sync hooks for authenticated users

**Theme Persistence:**
- localStorage: Required (works offline/guest users)
- Database sync: Required for authenticated users
- On login: If user has theme preference in DB → apply it
- On theme change (authenticated): Send PATCH /api/users/me/theme to save
- Maintains consistency across devices

**Theme Transitions:**
- Use short animations (not instant): 300-450ms duration
- Default transition: fade-out overlay → swap vars → fade-in overlay (300ms)
- Use CSS transitions for colors
- Use Framer Motion for overlay/preview effects
- Theme-specific micro effects:
  - Cyber Hacker: scanline slide-in
  - Pixel Lab: pixel glitch flash
  - (Other themes to be defined)

**Theme-Specific Effects:**
- Global effects (background, overlays, scanlines, background-grain, neon bloom): Apply via high-level containers (<ThemeEffects /> mounted in layout)
- Component effects (buttons, cards, tiles): Apply utility classes reading CSS vars (e.g., .btn uses box-shadow: var(--btn-glow))
- Rationale: Separation of concerns, improves performance (avoids applying heavy effects on each component)

**Backend Integration:**
- Create API route: PATCH /api/users/me/theme
- Add `theme` field to User model in Prisma schema
- Sync theme preference on login and theme change
- Use NextAuth session for authentication

**Utility Functions:**
- Include utility functions and CSS classes for games to use
- Example: data-theme hook, helper applyThemeToCanvas(canvas, theme)
- Exclude: Full implementations of effects requiring game engine changes (Pixi, WebGL)

### Reusability Opportunities

**Components to Adapt:**
- Header component: Add ThemeSwitcher integration
- Layout component: Mount ThemeEffects component
- Button components (LoginButton, ProfileButton): Adapt to use theme tokens
- Providers component: Add ThemeProvider wrapper pattern

**Backend Patterns:**
- User model: Add theme field for persistence
- API routes: Follow existing NextAuth session pattern for protected routes

### Scope Boundaries

**In Scope:**
- Theme switching infrastructure (Zustand store)
- Runtime application of CSS vars
- localStorage persistence
- Database sync API hooks (stubbed initially)
- ThemeSwitcher UI component (dropdown with previews)
- Theme transitions and component tokens (Header, Buttons, Cards, Inputs)
- Utility functions and CSS classes for games to use
- ThemeEffects component for global effects
- Tailwind config extension for CSS variable references
- themes.js configuration object
- CSS rules for theme application

**Out of Scope:**
- Full implementations of effects requiring game engine changes (Pixi, WebGL)
- Complete game theme styling (will come in later game implementations)
- Advanced theme customization beyond the 5 predefined themes
- Theme editor or theme creation tools

### Technical Considerations

**Integration Points:**
- Tailwind config: Extend to reference CSS variables (colors, shadows, etc.)
- Root layout: Mount ThemeEffects component for global effects
- Header component: Integrate ThemeSwitcher dropdown
- Providers component: Add ThemeProvider wrapper
- User model: Add theme field (String, optional)
- API routes: Create /api/users/me/theme endpoint

**Technology Stack:**
- CSS Custom Properties (CSS Variables)
- TailwindCSS (extended config)
- Zustand (state management)
- Framer Motion (transitions and animations)
- Next.js API Routes (backend sync)
- Prisma (database schema)
- NextAuth (authentication for sync)

**Performance Considerations:**
- Avoid compiling tokens per theme in Tailwind config (prevents rebuilds)
- Keep tokens as runtime CSS variables
- Apply global effects via high-level containers (not per component)
- Use CSS transitions for color changes (performant)
- Debounce API sync calls for theme changes

**Design Token Structure:**
- themes.js: JavaScript object documenting tokens (exportable, useful for Storybook/UI devs)
- CSS: Rules applying tokens per theme using [data-theme="..."] selectors
- Example tokens per theme:
  - Colors: --color-bg, --color-primary, --color-accent, --color-muted, --color-glow
  - Typography: --font
  - Effects: --scanline-opacity, --btn-glow, etc.

**Example Implementation Patterns:**
- Tailwind config extends colors to reference CSS vars: `page: "var(--color-bg)"`
- Theme store applies vars: `document.documentElement.style.setProperty(k, v)`
- Theme switcher shows visual preview grid with hover animations
- Transitions use fade overlay pattern (300ms)
- API sync debounced for authenticated users

