# 🛠️ Driver Creation Driver — Compile & Chill

Autor: Hudson "Shuk" Falcão  
Data: 20/11/2025  
Versão: 1.0  
Objetivo: Driver completo para criação de novos drivers no Compile & Chill, garantindo que todos os drivers sigam padrões de qualidade, estrutura consistente, regras obrigatórias e integração adequada com o sistema.

⚠️ **CRÍTICO: ANTES de executar este driver, o agente DEVE ler:**
- `docs/DRIVERS/TOKEN_MANAGEMENT.md` - Gerenciamento de tokens (OBRIGATÓRIO)
- Este arquivo contém regras sobre consumo de tokens e modo leve
- O agente DEVE informar sobre tokens e perguntar sobre plano antes de executar
- **Este driver pode consumir ~8.000-15.000 tokens (modo completo) ou ~3.000-6.000 tokens (modo leve)**

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

0. **O agente DEVE ler TOKEN_MANAGEMENT.md ANTES de executar!**
   - SEMPRE ler `docs/DRIVERS/TOKEN_MANAGEMENT.md` primeiro
   - SEMPRE informar sobre consumo estimado de tokens (~8.000-15.000 tokens modo completo)
   - SEMPRE perguntar sobre plano (pago/free)
   - SEMPRE oferecer modo leve (~3.000-6.000 tokens, redução ~60-70%)
   - NUNCA executar sem informar sobre tokens
   - NUNCA ignorar preocupações do usuário sobre consumo

1. **O agente DEVE fazer TODAS as perguntas antes de criar arquivos!**
   - NUNCA criar arquivos sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer ação
   - SEMPRE exemplificar respostas para dar insights ao colaborador

2. **O agente DEVE seguir a estrutura padrão de drivers!**
   - SEMPRE incluir todas as seções obrigatórias
   - SEMPRE seguir o formato estabelecido
   - NUNCA criar drivers sem estrutura completa
   - SEMPRE validar que todas as seções estão presentes

3. **O agente DEVE integrar o novo driver no README!**
   - SEMPRE adicionar no README principal
   - SEMPRE atualizar lista de drivers disponíveis
   - SEMPRE criar seção de instruções detalhadas
   - NUNCA criar driver sem integrar no sistema

4. **O agente DEVE seguir o fluxo completo de perguntas!**
   - Não pular nenhuma etapa
   - Não assumir respostas
   - Sempre aguardar confirmação do usuário
   - Sempre gerar relatório das mudanças

**O agente NUNCA deve:**
- ❌ Criar arquivos sem perguntar primeiro
- ❌ Criar drivers sem estrutura completa
- ❌ Ignorar padrões estabelecidos
- ❌ Pular etapas de validação
- ❌ Assumir o que o usuário quer
- ❌ Criar driver sem integrar no README

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente lê TOKEN_MANAGEMENT.md e informa sobre tokens
2. O agente faz PERGUNTA 1: Nome e objetivo do driver
3. O agente faz PERGUNTA 2: Quando usar o driver
4. O agente faz PERGUNTA 3: Fluxo de perguntas/etapas
5. O agente faz PERGUNTA 4: Regras obrigatórias
6. O agente faz PERGUNTA 5: Estrutura de arquivos
7. O agente faz PERGUNTA 6: Integração com README
8. O agente faz PERGUNTA 7: Versão em inglês
9. O agente avalia tudo e pergunta se pode criar
10. O agente cria arquivos (se autorizado)
11. O agente integra no README
12. O agente gera relatório completo

🔄 AUTO-ATUALIZAÇÃO: Melhoria Contínua dos Drivers

**⚠️ REGRA CRÍTICA - O agente DEVE auto-atualizar este driver quando necessário:**

1. **O agente DEVE identificar problemas e melhorias:**
   - Quando o usuário tiver dúvidas sobre criação de drivers
   - Quando o usuário reclamar de algo no processo
   - Quando o agente identificar padrões de problemas recorrentes
   - Quando houver ambiguidade sobre como criar drivers

2. **O agente DEVE atualizar este driver:**
   - Adicionar regras na seção "REGRAS OBRIGATÓRIAS"
   - Adicionar perguntas na seção de perguntas se necessário
   - Adicionar exemplos na seção de exemplos
   - Incrementar versão do driver (ex: 1.0 → 1.1)
   - Documentar a mudança no histórico

3. **O agente DEVE seguir este processo:**
   ```
   a) Identificar o problema/dúvida/reclamação sobre criação de drivers
   b) Entender a causa (ex: falta de validação, pergunta ambígua)
   c) Propor solução (ex: adicionar validação, esclarecer pergunta)
   d) Perguntar: "Identifiquei um problema no processo de criação de drivers. Posso atualizar o Driver Creation Driver para evitar que isso aconteça novamente?"
   e) Se autorizado, atualizar o driver
   f) Documentar: "📝 Histórico: [Data] - [Problema] - [Solução]"
   ```

4. **Exemplos de situações que requerem atualização:**
   - Usuário: "Por que você não perguntou sobre X?" → Adicionar pergunta sobre X
   - Usuário: "Isso não deveria ter sido criado assim" → Adicionar validação/regra
   - Agente cria driver sem estrutura completa → Adicionar checklist obrigatório
   - Dúvida sobre onde colocar arquivos → Adicionar exemplo mais claro

---

## 🎯 Como Funciona

Este driver guia a criação completa de novos drivers no Compile & Chill através de perguntas estruturadas e validações, garantindo que todos os drivers:

- ✅ Seguem padrões de qualidade
- ✅ Têm estrutura consistente
- ✅ Incluem regras obrigatórias
- ✅ Estão bem documentados
- ✅ Estão integrados no sistema
- ✅ Têm auto-atualização

---

## 📋 PERGUNTAS OBRIGATÓRIAS (Fluxo Completo)

### PERGUNTA 1: Nome e Objetivo do Driver

**O agente DEVE perguntar:**

"Qual o nome do driver e qual seu objetivo principal? Descreva em 2-3 frases o que o driver faz."

**Exemplos de respostas (para dar insights):**
- ✅ "Driver de criação de componentes React - Gera componentes React padronizados com TypeScript, testes e documentação"
- ✅ "Driver de validação de código - Valida código TypeScript, ESLint, Prettier e gera relatório de qualidade"
- ✅ "Driver de deploy - Automatiza processo de build, testes e deploy para produção"
- ✅ "Driver de documentação - Gera documentação automática de APIs e componentes"

**O agente DEVE:**
- Anotar nome e objetivo
- Verificar se o nome é claro e descritivo
- Verificar se o objetivo é específico
- Sugerir melhorias se necessário

**Validações:**
- [ ] Nome é claro e descritivo
- [ ] Objetivo é específico e mensurável
- [ ] Não é duplicado (verificar drivers existentes)
- [ ] Nome segue convenção (kebab-case para arquivos)

---

### PERGUNTA 2: Quando Usar o Driver

**O agente DEVE perguntar:**

"Quando este driver deve ser usado? Descreva os cenários de uso."

**Exemplos de respostas (para dar insights):**
- ✅ "Quando um colaborador quer criar um novo componente React"
- ✅ "Antes de fazer commit, para validar qualidade do código"
- ✅ "Quando precisa fazer deploy para produção"
- ✅ "Quando precisa documentar uma nova feature"

**O agente DEVE:**
- Entender os cenários de uso
- Identificar se é driver de uso frequente ou ocasional
- Avaliar se faz sentido criar driver para esse caso
- Sugerir melhorias se necessário

**Validações:**
- [ ] Cenários de uso são claros
- [ ] Driver resolve um problema real
- [ ] Não é redundante com drivers existentes
- [ ] Faz sentido ter um driver para isso

---

### PERGUNTA 3: Fluxo de Perguntas/Etapas

**O agente DEVE perguntar:**

"Qual o fluxo de perguntas ou etapas que o driver deve seguir? Liste as perguntas principais ou etapas do processo."

**Exemplos de respostas (para dar insights):**
- ✅ "1. Perguntar nome do componente, 2. Perguntar tipo (button, input, etc.), 3. Perguntar props necessárias, 4. Perguntar se quer testes, 5. Criar arquivos"
- ✅ "1. Validar TypeScript, 2. Validar ESLint, 3. Validar Prettier, 4. Executar testes, 5. Gerar relatório"
- ✅ "1. Perguntar ambiente (dev/staging/prod), 2. Validar variáveis de ambiente, 3. Executar build, 4. Executar testes, 5. Fazer deploy"

**O agente DEVE:**
- Entender o fluxo completo
- Identificar quantas perguntas/etapas são necessárias
- Avaliar se o fluxo é lógico
- Sugerir melhorias se necessário

**Validações:**
- [ ] Fluxo é lógico e completo
- [ ] Perguntas/etapas são necessárias
- [ ] Não há etapas redundantes
- [ ] Fluxo segue padrão dos outros drivers

---

### PERGUNTA 4: Regras Obrigatórias

**O agente DEVE perguntar:**

"Quais regras obrigatórias o driver deve seguir? Liste as regras que o agente DEVE seguir ao executar este driver."

**Exemplos de respostas (para dar insights):**
- ✅ "Sempre perguntar antes de criar arquivos, sempre validar TypeScript antes de criar, sempre criar testes se solicitado"
- ✅ "Sempre executar validações na ordem correta, sempre gerar relatório ao final, sempre alertar sobre erros"
- ✅ "Sempre validar variáveis de ambiente, sempre fazer backup antes de deploy, sempre confirmar antes de executar"

**O agente DEVE:**
- Entender as regras obrigatórias
- Verificar se são consistentes com outros drivers
- Sugerir regras adicionais se necessário
- Garantir que regras são claras e específicas

**Validações:**
- [ ] Regras são claras e específicas
- [ ] Regras são consistentes com outros drivers
- [ ] Inclui regra sobre perguntar antes de executar
- [ ] Inclui regra sobre gerar relatório

---

### PERGUNTA 5: Estrutura de Arquivos

**O agente DEVE perguntar:**

"Onde o driver deve ser criado? Seguindo a estrutura padrão?"

**Estrutura padrão sugerida:**
```
docs/DRIVERS/[DRIVER_NAME]/
  ├── [DRIVER_NAME]_DRIVER.md (PT)
  └── [DRIVER_NAME]_DRIVER.en.md (EN - opcional)
```

**Exemplos:**
- ✅ "Em `docs/DRIVERS/COMPONENT_CREATION/COMPONENT_CREATION_DRIVER.md`"
- ✅ "Em `docs/DRIVERS/CODE_VALIDATION/CODE_VALIDATION_DRIVER.md`"
- ✅ "Em `docs/DRIVERS/DEPLOY/DEPLOY_DRIVER.md`"

**O agente DEVE:**
- Confirmar estrutura
- Perguntar se quer versão em inglês
- Listar todos os arquivos que serão criados
- Validar que nome segue convenção

**Validações:**
- [ ] Estrutura segue padrão
- [ ] Nome do diretório segue convenção (UPPER_SNAKE_CASE)
- [ ] Nome do arquivo segue convenção (UPPER_SNAKE_CASE_DRIVER.md)
- [ ] Não conflita com drivers existentes

---

### PERGUNTA 6: Integração com README

**O agente DEVE perguntar:**

"O driver deve ser adicionado ao README principal? Em qual seção?"

**O agente DEVE:**
- Confirmar que será adicionado ao README
- Perguntar em qual seção (se houver dúvida)
- Listar todas as atualizações que serão feitas no README
- Validar que integração está completa

**Atualizações padrão no README:**
- Adicionar na lista de drivers disponíveis
- Adicionar seção "Quando usar"
- Adicionar seção de instruções detalhadas
- Adicionar nos links úteis

**Validações:**
- [ ] Será adicionado ao README
- [ ] Todas as seções necessárias serão atualizadas
- [ ] Links estão corretos
- [ ] Numeração está correta (se aplicável)

---

### PERGUNTA 7: Versão em Inglês

**O agente DEVE perguntar:**

"Deseja criar versão em inglês do driver? (opcional, mas recomendado)"

**Opções:**
1. **Sim, criar agora:** O agente cria ambas as versões
2. **Sim, criar depois:** O agente cria apenas PT e documenta que EN será criado depois
3. **Não precisa:** O agente cria apenas PT

**O agente DEVE:**
- Se "Sim, criar agora", perguntar se quer tradução automática ou manual
- Se "Sim, criar depois", documentar no README
- Se "Não precisa", apenas criar PT

---

### PERGUNTA 8: Confirmação Final

**O agente DEVE listar TUDO que será criado:**

```
📋 Resumo do que será criado:

Estrutura de diretórios:
- docs/DRIVERS/[DRIVER_NAME]/

Arquivos do driver:
- docs/DRIVERS/[DRIVER_NAME]/[DRIVER_NAME]_DRIVER.md (PT)
- docs/DRIVERS/[DRIVER_NAME]/[DRIVER_NAME]_DRIVER.en.md (EN - se solicitado)

Atualizações no README:
- Adicionar na lista de drivers disponíveis
- Adicionar seção "Quando usar"
- Adicionar seção de instruções detalhadas
- Adicionar nos links úteis

Deseja que eu crie tudo isso agora?
```

**O agente DEVE:**
- Aguardar confirmação explícita
- NUNCA criar sem confirmação
- Se "Não", perguntar o que ajustar

---

## 🎯 Padrões Obrigatórios

### Estrutura do Driver (OBRIGATÓRIO seguir)

**Template mínimo:**
```markdown
# [Nome do Driver] — Compile & Chill

Autor: Hudson "Shuk" Falcão  
Data: [DD/MM/YYYY]  
Versão: 1.0  
Objetivo: [Descrição do objetivo]

⚠️ **CRÍTICO: ANTES de executar este driver, o agente DEVE ler:**
- `docs/DRIVERS/TOKEN_MANAGEMENT.md` - Gerenciamento de tokens (OBRIGATÓRIO)
- Este arquivo contém regras sobre consumo de tokens e modo leve
- O agente DEVE informar sobre tokens e perguntar sobre plano antes de executar
- **Este driver pode consumir ~[X] tokens (modo completo) ou ~[Y] tokens (modo leve)**

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

0. **O agente DEVE ler TOKEN_MANAGEMENT.md ANTES de executar!**
   - SEMPRE ler `docs/DRIVERS/TOKEN_MANAGEMENT.md` primeiro
   - SEMPRE informar sobre consumo estimado de tokens
   - SEMPRE perguntar sobre plano (pago/free)
   - SEMPRE oferecer modo leve
   - NUNCA executar sem informar sobre tokens

1. **[Regras específicas do driver]**

🔄 AUTO-ATUALIZAÇÃO: Melhoria Contínua dos Drivers

[Seção de auto-atualização]

---

## 🎯 Como Funciona

[Descrição de como o driver funciona]

---

## 📋 PERGUNTAS OBRIGATÓRIAS (Fluxo Completo)

[Perguntas do driver]

---

## 🎯 Padrões Obrigatórios

[Padrões específicos do driver]

---

## 🚫 O que NUNCA deve ser criado

[O que nunca deve ser criado]

---

## ✅ Checklist de Validação Final

[Checklist]

---

## 📝 Histórico de Atualizações

**Versão 1.0 ([DD/MM/YYYY]):**
- Versão inicial do [Nome do Driver]

---

## 🔗 Referências

[Referências relevantes]
```

### Seções Obrigatórias

**TODOS os drivers DEVE ter:**
- ✅ Cabeçalho com autor, data, versão, objetivo
- ✅ Aviso sobre TOKEN_MANAGEMENT.md
- ✅ Seção "IMPORTANTE: Instruções para o Agente de IA"
- ✅ Seção "REGRAS OBRIGATÓRIAS"
- ✅ Seção "AUTO-ATUALIZAÇÃO"
- ✅ Seção "Como Funciona"
- ✅ Seção de perguntas/etapas
- ✅ Seção "Padrões Obrigatórios"
- ✅ Seção "O que NUNCA deve ser criado"
- ✅ Seção "Checklist de Validação Final"
- ✅ Seção "Histórico de Atualizações"
- ✅ Seção "Referências"

### Convenções de Nomenclatura

**Diretórios:**
- UPPER_SNAKE_CASE (ex: `COMPONENT_CREATION`, `CODE_VALIDATION`)

**Arquivos:**
- UPPER_SNAKE_CASE_DRIVER.md (ex: `COMPONENT_CREATION_DRIVER.md`)
- Versão EN: `COMPONENT_CREATION_DRIVER.en.md`

**Nomes no README:**
- Título: "Driver Name" (ex: "Component Creation Driver")
- Descrição: Frase curta e clara

---

## 🚫 O que NUNCA deve ser criado

**O agente NUNCA deve criar:**
- ❌ Drivers sem estrutura completa
- ❌ Drivers sem seção de regras obrigatórias
- ❌ Drivers sem referência a TOKEN_MANAGEMENT.md
- ❌ Drivers sem auto-atualização
- ❌ Drivers sem integração no README
- ❌ Drivers duplicados (verificar existentes)
- ❌ Drivers com nomes que não seguem convenção
- ❌ Drivers sem histórico de atualizações

---

## ✅ Checklist de Validação Final

Antes de criar os arquivos, o agente DEVE verificar:

**Estrutura:**
- [ ] Diretório segue convenção (UPPER_SNAKE_CASE)
- [ ] Arquivo segue convenção (UPPER_SNAKE_CASE_DRIVER.md)
- [ ] Não conflita com drivers existentes

**Conteúdo:**
- [ ] Todas as seções obrigatórias estão presentes
- [ ] Regras obrigatórias são claras e específicas
- [ ] Fluxo de perguntas/etapas está completo
- [ ] Exemplos estão incluídos
- [ ] Referência a TOKEN_MANAGEMENT.md está presente

**Integração:**
- [ ] Será adicionado ao README
- [ ] Todas as seções do README serão atualizadas
- [ ] Links estão corretos
- [ ] Numeração está correta

**Qualidade:**
- [ ] Driver está bem documentado
- [ ] Exemplos são claros
- [ ] Validações estão completas
- [ ] Histórico de atualizações está presente

---

## 📝 Histórico de Atualizações

**Versão 1.0 (20/11/2025):**
- Versão inicial do Driver Creation Driver
- Fluxo completo de 8 perguntas obrigatórias
- Padrões de estrutura e nomenclatura
- Integração com README

---

## 🔗 Referências

- Token Management: `docs/DRIVERS/TOKEN_MANAGEMENT.md`
- README Principal: `docs/DRIVERS/README.md`
- Exemplos de drivers: `docs/DRIVERS/*/`
- Architecture Hygiene Driver: `docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`
- Theme Creation Driver: `docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md`
- Game Creation Driver: `docs/DRIVERS/GAME_CREATION/GAME_CREATION_DRIVER.md`

---

## 🚀 Conclusão

Este driver garante que todos os drivers criados no Compile & Chill:

- ✅ Seguem padrões de qualidade
- ✅ Têm estrutura consistente
- ✅ Incluem regras obrigatórias
- ✅ Estão bem documentados
- ✅ Estão integrados no sistema
- ✅ Têm auto-atualização

**Lembre-se:**
- O agente DEVE fazer TODAS as perguntas antes de criar
- O agente DEVE seguir estrutura padrão
- O agente DEVE integrar no README
- O agente DEVE gerar relatório completo ao final

**Localização deste arquivo:**
- `/docs/DRIVERS/DRIVER_CREATION/DRIVER_CREATION_DRIVER.md`
- Linkar no README principal

