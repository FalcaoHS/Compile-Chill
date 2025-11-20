📘 Guia Oficial de Criação de Temas — Compile & Chill

Autor: Hudson "Shuk" Falcão
Data: 19/11/2025
Versão: 2.0
Motivo: Criar um padrão simples, organizado e acessível para colaboradores da comunidade criarem novos temas visuais para o Compile & Chill — permitindo que cada dev deixe sua marca, com créditos exibidos dentro do site.

🎨 Como funciona

Este documento é um DRIVER para gerar novos temas usando IA ou criação manual.
Basta responder as perguntas abaixo e fornecer este documento completo para um agente de IA.
O agente irá:

✅ Gerar toda a especificação técnica do tema
✅ Criar a estrutura de pastas correta em `agent-os/specs/`
✅ Organizar todos os arquivos de documentação
✅ Atualizar referências no sistema
✅ Garantir que tudo está alinhado e documentado

As respostas serão usadas para gerar:

❇️ Paleta de cores do tema
🎭 Variações de orbs
🏺 Objetos decorativos na quadra
⚡ Efeitos e partículas especiais
✨ Easter eggs opcionais
📝 Créditos do criador (nome + GitHub/X)
📁 Estrutura completa de arquivos e pastas

Este formato deve ser seguido sempre que criar um novo tema.

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

1. **O agente DEVE fazer perguntas antes de criar arquivos!**
   - NUNCA criar arquivos sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer ação

2. **O agente DEVE criar a estrutura de pastas corretamente!**
   - SEMPRE criar em `agent-os/specs/YYYY-MM-DD-[theme-id]/`
   - SEMPRE seguir a estrutura documentada
   - NUNCA criar arquivos fora do lugar

3. **O agente DEVE verificar e organizar arquivos existentes!**
   - SEMPRE verificar se há arquivos fora do lugar
   - SEMPRE corrigir nomes de arquivos com typos
   - SEMPRE remover pastas vazias
   - SEMPRE verificar referências quebradas

4. **O agente DEVE seguir o fluxo completo!**
   - Não pular nenhuma etapa
   - Não assumir respostas
   - Sempre aguardar confirmação do usuário

**O agente NUNCA deve:**
- ❌ Criar arquivos sem perguntar primeiro
- ❌ Criar estrutura de pastas incorreta
- ❌ Pular etapas de validação
- ❌ Assumir o que o usuário quer
- ❌ Criar arquivos duplicados ou fora do lugar

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente pergunta sobre o tema (se não tiver todas as informações)
2. O agente cria a estrutura de pastas
3. O agente verifica arquivos existentes
4. O agente organiza arquivos se necessário
5. O agente cria/atualiza documentação
6. O agente valida que tudo está alinhado
7. O agente gera relatório das mudanças

---

Ao processar este driver, o agente DEVE:

1. **Criar estrutura de pastas** em `agent-os/specs/YYYY-MM-DD-[theme-id]/`:
   ```
   agent-os/specs/YYYY-MM-DD-[theme-id]/
   ├── planning/
   │   ├── raw-idea.md (conteúdo fornecido pelo colaborador)
   │   ├── requirements.md (gerado a partir das respostas)
   │   ├── answers/ (se houver perguntas/respostas)
   │   └── visuals/ (para assets visuais, se houver)
   ├── implementation/ (criado durante implementação)
   ├── spec.md (especificação técnica completa)
   └── tasks.md (breakdown de tarefas)
   ```

2. **Verificar e organizar arquivos existentes**:
   - Mover arquivos para pastas corretas se estiverem fora do lugar
   - Corrigir nomes de arquivos com typos
   - Remover pastas vazias
   - Verificar referências quebradas

3. **Atualizar documentação do sistema**:
   - Verificar se `lib/themes.ts` está atualizado
   - Verificar se há testes necessários
   - Garantir que a documentação está alinhada

4. **Validar estrutura**:
   - Todos os arquivos devem estar nas pastas corretas
   - Nomes de arquivos devem seguir padrão kebab-case
   - Referências entre documentos devem estar corretas

🧩 Checklist de Informações Obrigatórias

(Deve ser incluído no issue/pull request ou enviado à IA)

👤 1. Autor do Tema

Seu nome (como deve aparecer no site):

GitHub:

X/Twitter:

Motivação do tema (1 frase):

🎨 2. Identidade do Tema

Nome do Tema:

ID sugerido (kebab-case, ex: "neo-forest", "galactic-force"):

Resumo em 1 frase (essência do tema):
Ex: "Energia cósmica neon misturada com glitch digital."

🌈 3. Paleta Base (mínimo 4 cores)

(Forneça nomes simples + hex)

Cor primária:

Cor secundária:

Cor de fundo:

Accent (detalhes/partículas):

Cores adicionais (opcional):
- Highlight:
- Border:
- Glow:
- Muted:

Sugestão: você pode pedir para a LLM gerar a paleta após descrever o tema.

🪐 4. Variações das Orbs (1 a 10 variações)

(A orb contém a foto do usuário no centro — aqui você descreve o "anel/ornamento" em volta)

Para cada variação descreva:

Nome da variação (kebab-case, ex: "sacred-usb", "golden-keycap"):

Descrição curta visual:

Estilo geométrico/formas:

Efeitos especiais (glow, partículas, pulsação etc. — opcional):

Ex: "Anel de circuitos verdes em forma radial com pequenos impulsos elétricos."

🏺 5. Objetos Decorativos do Tema (1 a 5 objetos)

Para cada objeto descreva:

Nome (kebab-case):

Representação visual (formas simples; sem IP):

Localização sugerida na quadra (ex: canto inferior esquerdo):

Layer (background/midground/foreground):

Ele é animado? (sim/não):

Se animado, descreva a animação:

🌬 6. Efeitos Especiais (opcionais)

(Podem acontecer quando a bola quica, acerta a cesta ou bate no aro)

Liste ideias como:

- Faíscas
- Raios
- Ondas de choque
- Glow
- Partículas temáticas
- Filtros temporários

Para cada efeito, especifique:
- Trigger (quando acontece):
- Descrição visual:
- Duração:

🪄 7. Easter Egg Opcional

(Aparece raramente, chance entre 0.1% e 1%)

Descreva:

O evento raro:

Qual animação acontece:

Duração aproximada:

Chance de ativação (0.1% a 1%):

É único por usuário? (sim/não):

Ex: "Um monumento pixel sagrado aparece por 1.5s e explode em fractais."

📱 8. Comportamento no Mobile

Escolha:

A) Desabilitar efeitos no mobile-lite (recomendado para performance)

B) Manter efeitos reduzidos (50% de partículas, animações simplificadas)

C) Versão totalmente simplificada (apenas objetos estáticos)

🔏 9. Observações de Segurança/IP

Confirme:

- [ ] O tema NÃO usa imagens de marcas registradas
- [ ] O tema é inspirado, não reproduz logos/licenças
- [ ] Todos os objetos são formas geométricas abstratas
- [ ] Não há referências diretas a IP protegido
- [ ] Todos os elementos são procedurais (Canvas 2D, sem assets)

🧪 Formato final esperado pela IA (para gerar o tema)

Copie e cole o template abaixo e preencha:

```markdown
# Novo Tema — Template

## 1. Autor
Nome:
GitHub:
X/Twitter:
Motivo:

## 2. Identidade
Nome do Tema:
ID do Tema:
Resumo:

## 3. Paleta
Primária:
Secundária:
Fundo:
Accent:
Highlight:
Border:
Glow:
Muted:

## 4. Variações das Orbs
1. Nome:
   - Descrição:
   - Formas:
   - Efeitos:
2. Nome:
   - Descrição:
   - Formas:
   - Efeitos:
(…até 10)

## 5. Objetos Decorativos
1. Nome:
   - Representação:
   - Localização:
   - Layer:
   - Animado: sim/não
   - Animação (se aplicável):

## 6. Efeitos Especiais
- Efeito 1:
  - Trigger:
  - Descrição:
  - Duração:
- Efeito 2:
  - Trigger:
  - Descrição:
  - Duração:

## 7. Easter Egg
- Evento:
- Animação:
- Duração:
- Chance:
- Único por usuário: sim/não

## 8. Mobile
Modo: A/B/C

## 9. IP/Safety
- [x] Não usa IP protegido
- [x] Formas geométricas abstratas
- [x] Renderização procedural
```

📋 Checklist de Validação Pós-Geração

Após o agente gerar a especificação, verifique:

- [ ] Estrutura de pastas criada corretamente em `agent-os/specs/`
- [ ] Arquivo `spec.md` criado com especificação completa
- [ ] Arquivo `tasks.md` criado com breakdown de tarefas
- [ ] Arquivo `planning/requirements.md` criado
- [ ] Todos os arquivos estão nas pastas corretas
- [ ] Nomes de arquivos seguem padrão kebab-case
- [ ] Não há referências quebradas
- [ ] Documentação está alinhada com outros temas existentes

🔗 Referências Úteis

- Estrutura de temas existentes: `agent-os/specs/2025-11-20-indiana-jones-theme/`
- Sistema de temas: `lib/themes.ts`
- Canvas de orbs: `components/DevOrbsCanvas.tsx`
- Documentação de decorative objects: `agent-os/specs/2025-11-20-theme-decorative-objects/`
