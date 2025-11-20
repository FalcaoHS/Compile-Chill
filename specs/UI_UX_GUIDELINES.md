# UI/UX Guidelines - Compile & Chill

## Diretrizes de Interface para Jogos

Este documento estabelece padrões de interface e experiência do usuário para todos os jogos da plataforma Compile & Chill.

## Layout Desktop (Obrigatório)

### 1. Sem Barra de Rolagem Vertical
- **Obrigatório:** Todo o conteúdo do jogo deve ser visível sem necessidade de scroll vertical no desktop
- Use `height: 100vh` ou `h-screen` para aproveitar toda a altura da viewport
- Layout deve ser `flex` com `overflow-hidden` para gerenciar o espaço
- Componentes internos podem ter scroll se necessário (como lista de upgrades)

### 2. Painel de Ajuda Lateral (Recomendado)
- **Posição:** Lateral esquerda, fixo
- **Largura:** 320px (w-80 no Tailwind)
- **Comportamento:**
  - Visível por padrão no desktop (opcional no mobile)
  - Pode ser escondido pelo usuário
  - Botão flutuante aparece quando escondido
  - Animação suave de entrada/saída (Framer Motion)

#### Estrutura do Painel de Ajuda

```tsx
<aside className="hidden lg:flex flex-col w-80 border-r border-border bg-page-secondary">
  <header className="p-4 border-b border-border">
    <h3>Como Jogar</h3>
    <button onClick={hidePanel}>✕</button>
  </header>
  
  <div className="flex-1 overflow-y-auto p-4">
    {/* Instruções */}
    {/* Dicas */}
    {/* Estratégias */}
  </div>
</aside>
```

#### Botão Flutuante

```tsx
{!showHelpPanel && (
  <button
    onClick={showPanel}
    className="fixed left-4 top-24 z-40 w-12 h-12 bg-primary text-white rounded-full shadow-glow"
  >
    📖
  </button>
)}
```

### 3. Estrutura de Layout Recomendada

```tsx
<div className="h-screen flex flex-col bg-page overflow-hidden">
  {/* Header - Fixed height */}
  <header className="border-b border-border bg-page-secondary flex-shrink-0">
    {/* Navigation, Title */}
  </header>
  
  {/* Main content area */}
  <div className="flex-1 flex overflow-hidden">
    {/* Help Panel (optional, collapsible) */}
    <aside className="w-80 border-r border-border">
      {/* Help content */}
    </aside>
    
    {/* Game content */}
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Stats bar (fixed) */}
      <div className="border-b border-border flex-shrink-0">
        {/* Stats */}
      </div>
      
      {/* Game area (scrollable if needed) */}
      <div className="flex-1 overflow-y-auto">
        {/* Game components */}
      </div>
    </main>
  </div>
</div>
```

## Conteúdo do Painel de Ajuda

### Seções Obrigatórias

1. **Instruções Básicas**
   - Como jogar (controles principais)
   - Mecânicas do jogo
   - Objetivos
   - Atalhos de teclado

2. **Dicas** (Opcional mas recomendado)
   - Sugestões para iniciantes
   - Truques úteis
   - Otimizações

3. **Estratégia** (Opcional)
   - Estratégias por fase do jogo (início, meio, avançado)
   - Meta-game
   - Progressão recomendada

### Formatação Visual

```tsx
{/* Exemplo de seção de instruções */}
<div className="bg-page border border-border rounded-lg p-4">
  <h4 className="font-semibold text-text mb-3 text-sm">Instruções Básicas</h4>
  <ul className="text-sm text-text-secondary space-y-3">
    <li className="flex gap-2">
      <span className="flex-shrink-0">🎮</span>
      <div>
        <strong className="text-text">Título da Instrução</strong>
        <p className="text-xs mt-1">Descrição detalhada</p>
      </div>
    </li>
  </ul>
</div>
```

## Responsividade

### Mobile
- Painel de ajuda escondido por padrão
- Botão de ajuda no header (?) abre modal ou painel expansível
- Scroll vertical permitido no mobile
- Layout vertical (stacked)

### Tablet
- Similar ao mobile ou desktop dependendo da orientação
- Landscape: comportamento desktop
- Portrait: comportamento mobile

### Desktop (lg: 1024px+)
- Painel lateral visível por padrão
- Layout horizontal otimizado
- Sem scroll vertical na viewport principal
- Componentes internos podem ter scroll

## Animações

### Transições do Painel
```tsx
<AnimatePresence>
  {showPanel && (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Content */}
    </motion.aside>
  )}
</AnimatePresence>
```

### Botão Flutuante
```tsx
<motion.button
  initial={{ x: -100, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: -100, opacity: 0 }}
  whileHover={{ scale: 1.1 }}
>
  📖
</motion.button>
```

## Theme Integration

- Todos os componentes devem usar tokens de tema
- Painel de ajuda: `bg-page-secondary`
- Bordas: `border-border`
- Texto: `text-text`, `text-text-secondary`
- Botão primário: `bg-primary`

## Acessibilidade

- Botões devem ter `aria-label` descritivo
- Atalhos de teclado documentados
- Suporte a navegação por Tab
- Focus visível em elementos interativos
- Contraste de cores WCAG AA

## Estados do Jogo

### Loading
```tsx
<div className="h-screen flex items-center justify-center">
  <div className="text-center">
    <div className="text-6xl animate-pulse">🎮</div>
    <p className="text-text-secondary">Carregando...</p>
  </div>
</div>
```

### Game Over
- Modal centralizado
- Opções claras (jogar novamente, voltar ao menu)
- Estatísticas finais

## Performance

- Usar `overflow-hidden` na viewport principal
- Scroll apenas em sub-componentes
- Lazy load de componentes pesados
- Otimizar animações (60fps)

## Exemplos de Implementação

### ✅ Crypto Miner Game
Implementação completa seguindo estas diretrizes:
- Layout sem scroll vertical
- Painel de ajuda lateral colapsável
- Botão flutuante quando painel está escondido
- Estrutura flex otimizada

Arquivo: `app/jogos/crypto-miner-game/page.tsx`

## Checklist de Implementação

Para cada novo jogo, verificar:

- [ ] Layout `h-screen flex flex-col overflow-hidden`
- [ ] Header fixo (flex-shrink-0)
- [ ] Painel de ajuda lateral (desktop)
- [ ] Botão flutuante quando painel escondido
- [ ] Conteúdo principal sem scroll vertical
- [ ] Sub-componentes com scroll conforme necessário
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Animações suaves (Framer Motion)
- [ ] Theme-aware (todos os tokens)
- [ ] Acessível (ARIA, keyboard)
- [ ] Performance otimizada (60fps)

## Referências

- Tailwind CSS: https://tailwindcss.com/
- Framer Motion: https://www.framer.com/motion/
- WCAG 2.1: https://www.w3.org/WAI/WCAG21/quickref/

---

**Nota:** Estas diretrizes devem ser seguidas em TODOS os novos jogos. Jogos existentes devem ser gradualmente atualizados para seguir este padrão.

**Última atualização:** 2025-11-18
**Implementado em:** Crypto Miner Game

