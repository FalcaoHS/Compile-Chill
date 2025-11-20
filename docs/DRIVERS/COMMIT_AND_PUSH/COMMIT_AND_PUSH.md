📘 Commit & Contribution Driver — Compile & Chill

Autor: Hudson "Shuk" Falcão
Data: 19/11/2025
Versão: 2.0
Objetivo: Definir um padrão claro, simples, elegante e sustentável para commits, branches, revisão, testes e publicação, permitindo que colaboradores mantenham coerência e qualidade no repositório.

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

1. **O agente DEVE fazer perguntas antes de commitar!**
   - NUNCA commitar sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer comando Git

2. **O agente DEVE verificar `agent-os/` antes de cada commit!**
   - SEMPRE rodar `git status` antes de commitar
   - Se `agent-os/` aparecer, REMOVER imediatamente: `git reset HEAD agent-os/`
   - NUNCA commitar se `agent-os/` estiver na lista

3. **O agente DEVE criar branch separada para mudanças grandes!**
   - Mais de 5 arquivos = OBRIGATÓRIO criar branch
   - Features novas = OBRIGATÓRIO criar branch
   - Refatorações = OBRIGATÓRIO criar branch
   - NUNCA sugerir commit direto na main para mudanças grandes

4. **O agente DEVE seguir o fluxo de perguntas abaixo!**
   - Não pular nenhuma etapa
   - Não assumir respostas
   - Sempre aguardar confirmação do usuário

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente pergunta o que mudou
2. O agente pergunta o tipo de commit
3. O agente pergunta sobre a branch
4. O agente pergunta se é mudança grande
5. O agente valida o que será commitado (verifica `agent-os/`)
6. O agente gera os comandos
7. O agente pede confirmação final

**O agente NUNCA deve:**
- ❌ Commitar sem perguntar primeiro
- ❌ Commitar `agent-os/` (mesmo que o usuário peça)
- ❌ Commitar direto na main para mudanças grandes
- ❌ Pular etapas de validação
- ❌ Assumir o que o usuário quer

🚫 REGRA CRÍTICA: O que NUNCA deve ser commitado

**IMPORTANTE - Leia com atenção:**

❌ **NUNCA commitar a pasta `agent-os/`**
- Esta pasta contém configurações internas do sistema Agent OS
- Não faz parte do código do projeto Compile & Chill
- Deve ser ignorada pelo Git

❌ **NUNCA commitar arquivos de drivers que não sejam do sistema**
- Apenas drivers em `docs/DRIVERS/` relacionados ao sistema devem ser commitados
- Drivers internos do Agent OS não devem ser commitados

❌ **NUNCA commitar arquivos sensíveis:**
- `.env` e `.env.*` (já no .gitignore)
- Credenciais e chaves de API
- Arquivos temporários
- Logs e cache

**Antes de cada commit, o agente DEVE verificar:**
```bash
git status
```

E garantir que NENHUM arquivo da pasta `agent-os/` esteja na lista de arquivos a serem commitados.

Se houver arquivos de `agent-os/` na lista, o agente DEVE:
1. Alertar o usuário
2. Remover esses arquivos do staging: `git reset HEAD agent-os/`
3. Verificar se `agent-os/` está no `.gitignore`
4. Só então prosseguir com o commit

🎯 1. Padrão de Nomenclatura de Commits

Usando um modelo inspirado no Conventional Commits, mas adaptado para o estilo do projeto:

```
<tipo>: <descrição curta e objetiva>
```

**Exemplos:**
```
feat: adiciona tema 'star-wars' com 10 orb variations
fix: corrige crash no DevOrbsCanvas ao carregar em mobile
perf: reduz partículas no FPS Guardian para 35 FPS
style: ajusta alinhamento da scoreboard no tema neon
refactor: separa physics do canvas principal
docs: adiciona guia de criação de temas
test: adiciona testes para score anti-cheat
chore: atualiza dependências internas
```

**Tipos disponíveis:**

- `feat:` - nova funcionalidade
- `fix:` - correção de bug
- `perf:` - otimização
- `style:` - ajustes visuais e CSS
- `refactor:` - reestruturação sem mudança de comportamento
- `docs:` - documentação
- `test:` - testes unitários
- `chore:` - rotinas internas
- `build:` - ajustes de build/configuração

**Regras:**
- → Sempre escrever em português simples, frases curtas
- → Usar minúsculas no tipo
- → Nada de emojis no prefixo
- → Máximo 72 caracteres na primeira linha

🌱 2. Padrão de Descrição do Commit

Após a linha principal, usar corpo do commit com:

- O que foi feito
- Por que foi feito
- Impacto no sistema
- Alguma instrução especial

**Exemplo:**

```
feat: adiciona easter egg 'The Force Reveal'

- Introduz evento raro 0.4% com nave aparecendo no canvas
- Ativa apenas 1x por usuário
- Conecta com o sistema de particles + FPS guardian
- Reorganiza arquivos do tema Star Wars
```

**Formato:**
- Linha em branco após o título
- Cada item em uma linha começando com `-`
- Máximo 100 caracteres por linha
- Usar português simples

🌿 3. Padrão de Branches

Sempre criar uma branch com esta estrutura:

```
tipo/area-descricao-curta
```

**Exemplos:**
```
feat/theme-star-wars
feat/new-game-packet-switch
fix/canvas-mobile-lite
perf/particle-optimizer
refactor/split-devorbs-modules
docs/create-theme-guide
```

**Regras:**
- Sem acentos
- Sem espaços
- Tudo minúsculo
- Sempre contextualizado
- Máximo 50 caracteres
- Usar hífen para separar palavras

### 📦 Quando Usar Branch Separada (OBRIGATÓRIO)

**SEMPRE criar branch separada para:**

✅ **Mudanças grandes** (mais de 5 arquivos modificados)
✅ **Novas features** (qualquer `feat:`)
✅ **Refatorações** (qualquer `refactor:`)
✅ **Mudanças que afetam múltiplos módulos**
✅ **Novos temas** (sempre em branch separada)
✅ **Novos jogos** (sempre em branch separada)
✅ **Mudanças em arquitetura** (canvas, performance, auth)
✅ **Mudanças que podem quebrar funcionalidades existentes**

**NUNCA commitar direto na main para:**
- ❌ Features novas
- ❌ Refatorações
- ❌ Mudanças em múltiplos arquivos
- ❌ Qualquer coisa que precise de revisão

**Pode commitar direto na main APENAS para:**
- ✅ Correções de typos em documentação
- ✅ Ajustes de formatação (se muito pequenos)
- ✅ Atualizações de dependências menores
- ⚠️ **Sempre com confirmação explícita do usuário**

### 🔀 Fluxo para Mudanças Grandes

**Para mudanças grandes, seguir este fluxo:**

1. **Criar branch específica:**
   ```bash
   git checkout -b feat/theme-star-wars-complete
   ```

2. **Fazer commits incrementais na branch:**
   ```bash
   # Commit 1: Estrutura base
   git commit -m "feat: adiciona estrutura base do tema star-wars"
   
   # Commit 2: Orb variations
   git commit -m "feat: implementa 10 orb variations do tema star-wars"
   
   # Commit 3: Decorative objects
   git commit -m "feat: adiciona objetos decorativos do tema star-wars"
   ```

3. **Testar completamente na branch:**
   - Rodar todos os testes
   - Testar manualmente
   - Verificar em diferentes dispositivos

4. **Push da branch:**
   ```bash
   git push origin feat/theme-star-wars-complete
   ```

5. **Abrir Pull Request:**
   - Criar PR no GitHub
   - Preencher descrição completa
   - Aguardar revisão e aprovação

6. **Merge apenas após aprovação:**
   - Nunca fazer merge direto
   - Sempre via Pull Request
   - Aguardar CI/CD passar

💡 4. Checklist Before Commit (pré-commit)

**Antes de commitar, sempre rodar:**

✔ **1. Verificar erros de TypeScript**
```bash
pnpm ts:check
```

✔ **2. Verificar build**
```bash
pnpm build
```

✔ **3. ESLint**
```bash
pnpm lint
```

✔ **4. Formatação Prettier**
```bash
pnpm format
```

✔ **5. Verificar arquivos a serem commitados**
```bash
git status
```
- Verificar que `agent-os/` NÃO está na lista
- Verificar que `.env` NÃO está na lista
- Verificar que apenas arquivos relevantes estão sendo commitados

✔ **6. Testar páginas críticas manualmente:**
- Home
- DevOrbsCanvas
- Login (X OAuth)
- Terminal 2048
- Qualquer jogo alterado

✔ **7. Verificar mobile-lite (se impacto no canvas)**
- DevTools → Toggle Device Mode → iPhone SE
- Testar em modo mobile-lite

🤖 5. DRIVER para Automação no Cursor

**Este é o prompt do bot que vai ajudar sempre que o dev digitar "commit":**

---

### 🔧 Cursor Commit Assistant — DRIVER

Quando o usuário disser "commit" ou pedir para commitar, você DEVE executar o seguinte fluxo:

#### **ETAPA 1: Fazer Perguntas (OBRIGATÓRIO)**

**Pergunta 1:** "O que mudou exatamente?"
- Aguardar resposta do usuário
- Entender o escopo das mudanças

**Pergunta 2:** "Qual o tipo de commit? (feat, fix, perf, refactor, style, docs, test, chore, build)"
- Se o usuário não souber, sugerir baseado nas mudanças
- Explicar o tipo escolhido

**Pergunta 3:** "Qual o nome da branch? (ou posso sugerir baseado no tipo?)"
- Se o usuário não tiver branch, sugerir: `tipo/descricao-curta`
- Validar nome da branch (sem acentos, espaços, tudo minúsculo)

**Pergunta 4:** "Deseja criar nova branch ou usar a atual?"
- Verificar branch atual: `git branch --show-current`
- Se não existir, criar nova

**Pergunta 5:** "Deseja que eu verifique os arquivos antes de commitar?"
- Sempre verificar `git status`
- **CRÍTICO:** Verificar se `agent-os/` está na lista
- Se estiver, alertar e remover antes de prosseguir

#### **ETAPA 2: Gerar Automaticamente**

Após as perguntas, gerar:

1. **Mensagem de commit completa** (seguindo padrão deste documento)
2. **Nome da branch padronizado** (se necessário)
3. **Lista de etapas pré-commit** que devem ser rodadas
4. **Comandos Git completos** para o terminal

#### **ETAPA 3: Validação Final**

**Pergunta 6:** "Deseja que eu gere os comandos completos para o terminal?"
- Se sim, gerar comandos completos
- Se não, apenas mostrar a mensagem de commit

**Pergunta 7:** "Esta é uma mudança grande? (mais de 5 arquivos, nova feature, refatoração)"
- Se SIM: **OBRIGATÓRIO criar branch separada**
- Se NÃO: Perguntar se deseja commitar direto na main
- ⚠️ **SÓ liberar commit direto na main se:**
  - Mudança muito pequena (1-2 arquivos)
  - Apenas documentação ou typos
  - Usuário confirmar explicitamente
- ⚠️ **NUNCA sugerir commit direto na main para:**
  - Features novas
  - Refatorações
  - Mudanças em múltiplos arquivos
  - Qualquer coisa que precise de revisão

**Pergunta 8:** "Deseja commitar e subir direto na main?"
- ⚠️ **SÓ liberar se o usuário confirmar explicitamente**
- ⚠️ **NUNCA sugerir commit direto na main sem confirmação**
- Sempre sugerir criar branch e abrir PR

**Pergunta 9:** "Deseja abrir um Pull Request agora?"
- Se sim, fornecer link do GitHub para criar PR
- Se não, apenas fazer push da branch
- **Para mudanças grandes, sempre sugerir criar PR**

#### **ETAPA 4: Execução (se autorizado)**

Se o usuário autorizar, executar:

```bash
# Verificar status
git status

# Verificar que agent-os/ não está na lista
# Se estiver, remover: git reset HEAD agent-os/

# Criar branch (se necessário)
git checkout -b <nome-da-branch>

# Adicionar arquivos (exceto agent-os/)
git add .

# Verificar novamente antes de commitar
git status

# Commit
git commit -m "<commit message>"

# Push
git push origin <nome-da-branch>
```

---

🛠 6. Hooks Opcionais para Automatizar (Husky)

Você pode ativar hooks do Husky para automatizar validações:

**Pre-commit:**
```bash
pnpm lint && pnpm format && pnpm ts:check
```

**Pre-push:**
```bash
pnpm build
```

**Arquivo `.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint
pnpm format
pnpm ts:check
```

**Arquivo `.husky/pre-push`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm build
```

**Nota:** Adicionar verificação de `agent-os/` no pre-commit seria ideal, mas pode ser feito manualmente também.

🧷 7. Fluxo Recomendado para Qualquer Colaborador

**Passo a passo completo:**

1. **Buscar a main:**
   ```bash
   git pull origin main
   ```

2. **Criar branch:**
   ```bash
   git checkout -b feat/theme-star-wars
   ```

3. **Codar**
   - Fazer as alterações necessárias
   - Seguir padrões do projeto

4. **Testar**
   - Rodar testes
   - Testar manualmente
   - Verificar em diferentes dispositivos

5. **Pré-commit**
   - Rodar checklist completo
   - Verificar que `agent-os/` não será commitado

6. **Commit**
   - Usar mensagem padronizada
   - Seguir formato deste documento

7. **Push**
   ```bash
   git push origin feat/theme-star-wars
   ```

8. **Abrir PR**
   - Criar Pull Request no GitHub
   - Preencher descrição do PR
   - Aguardar revisão

⭐ 8. Benefícios deste Driver

- ✅ Contribuidores uniformes
- ✅ PRs limpos e organizados
- ✅ Issues claras e bem documentadas
- ✅ Sem commits-caos
- ✅ Sem branches aleatórias
- ✅ Menos bugs em produção
- ✅ Deploy confiável para Vercel
- ✅ Histórico Git limpo e útil
- ✅ Facilita code review

🚀 9. Checklist de Validação Final

Antes de finalizar o commit, verificar:

- [ ] Mensagem de commit segue o padrão
- [ ] Branch nomeada corretamente
- [ ] TypeScript sem erros (`pnpm ts:check`)
- [ ] Build funciona (`pnpm build`)
- [ ] Lint passa (`pnpm lint`)
- [ ] Código formatado (`pnpm format`)
- [ ] `agent-os/` NÃO está nos arquivos a serem commitados
- [ ] `.env` NÃO está nos arquivos a serem commitados
- [ ] Apenas arquivos relevantes estão sendo commitados
- [ ] Testes manuais realizados
- [ ] Mobile-lite testado (se aplicável)

📋 10. Conclusão

Este driver:

- ✅ Padroniza commits e branches
- ✅ Organiza o fluxo de trabalho
- ✅ Facilita contribuição
- ✅ Ajuda o time
- ✅ Ajuda a IA
- ✅ Evita retrabalho
- ✅ Evita bugs introduzidos por pressa
- ✅ Protege contra commits acidentais de arquivos sensíveis

**Lembre-se:**
- O agente DEVE fazer perguntas antes de commitar
- O agente DEVE verificar que `agent-os/` não será commitado
- O agente DEVE validar tudo antes de executar comandos Git

**Localização deste arquivo:**
- `/docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`
- Linkar no README principal
