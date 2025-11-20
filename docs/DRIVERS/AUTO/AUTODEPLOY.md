🚀 Auto Deploy Driver — Compile & Chill

Autor: Hudson "Shuk" Falcão
Data: 19/11/2025
Versão: 1.1
Objetivo: Driver automático que executa sequencialmente os processos de higienização de arquitetura e commit organizado, garantindo que o código esteja sempre limpo, organizado e pronto para deploy.

⚠️ **CRÍTICO: ANTES de executar este driver, o agente DEVE ler:**
- `docs/DRIVERS/TOKEN_MANAGEMENT.md` - Gerenciamento de tokens (OBRIGATÓRIO)
- Este arquivo contém regras sobre consumo de tokens e modo leve
- O agente DEVE informar sobre tokens e perguntar sobre plano antes de executar

🤖 IMPORTANTE: Instruções para o Agente de IA

**⚠️ REGRAS OBRIGATÓRIAS - O AGENTE DEVE SEGUIR EXATAMENTE:**

0. **O agente DEVE ler TOKEN_MANAGEMENT.md ANTES de executar!**
   - SEMPRE ler `docs/DRIVERS/TOKEN_MANAGEMENT.md` primeiro
   - SEMPRE informar sobre consumo estimado de tokens
   - SEMPRE perguntar sobre plano (pago/free)
   - SEMPRE oferecer modo leve
   - NUNCA executar sem informar sobre tokens
   - NUNCA ignorar preocupações do usuário sobre consumo

1. **O agente DEVE executar os drivers na sequência correta!**
   - PRIMEIRO: Architecture Hygiene Driver
   - SEGUNDO: Commit & Push Driver
   - NUNCA pular etapas
   - NUNCA inverter a ordem

2. **O agente DEVE fazer perguntas antes de executar cada etapa!**
   - NUNCA executar sem perguntar primeiro
   - NUNCA assumir o que o usuário quer
   - SEMPRE perguntar antes de executar qualquer ação

3. **O agente DEVE validar cada etapa antes de prosseguir!**
   - SEMPRE validar que a etapa anterior foi concluída
   - SEMPRE verificar se há erros antes de continuar
   - NUNCA prosseguir se houver problemas não resolvidos

4. **O agente DEVE gerar relatório completo ao final!**
   - Listar todas as mudanças feitas
   - Documentar decisões tomadas
   - Criar checklist de validação

**Fluxo esperado (OBRIGATÓRIO seguir):**
1. O agente pergunta se o usuário quer executar o Auto Deploy
2. O agente executa Architecture Hygiene Driver (com perguntas)
3. O agente valida que a higienização foi concluída
4. O agente executa Commit & Push Driver (com perguntas)
5. O agente gera relatório completo das mudanças

**O agente NUNCA deve:**
- ❌ Executar sem perguntar primeiro
- ❌ Pular etapas ou inverter ordem
- ❌ Prosseguir sem validar etapa anterior
- ❌ Assumir o que o usuário quer
- ❌ Executar commits sem seguir o driver de commit

🔄 AUTO-ATUALIZAÇÃO: Melhoria Contínua dos Drivers

**⚠️ REGRA CRÍTICA - O agente DEVE auto-atualizar os drivers quando necessário:**

1. **O agente DEVE identificar problemas e melhorias:**
   - Quando o usuário tiver dúvidas sobre o processo
   - Quando o usuário reclamar de algo que aconteceu
   - Quando o agente identificar um problema recorrente
   - Quando houver ambiguidade nas instruções

2. **O agente DEVE atualizar o driver correspondente:**
   - Identificar qual driver precisa ser atualizado
   - Adicionar regras claras para evitar o problema
   - Documentar a mudança no próprio driver
   - Atualizar a versão do driver (incrementar versão)

3. **O agente DEVE seguir este processo:**
   ```
   a) Identificar o problema/dúvida/reclamação
   b) Entender a causa raiz
   c) Propor solução no driver
   d) Perguntar ao usuário: "Identifiquei um problema. Posso atualizar o driver [NOME] para evitar que isso aconteça novamente?"
   e) Se autorizado, atualizar o driver
   f) Documentar a mudança no histórico do driver
   ```

4. **Exemplos de situações que requerem atualização:**
   - Usuário pergunta "por que você fez X?" → Adicionar regra explícita sobre X
   - Usuário reclama "isso não deveria acontecer" → Adicionar validação/prevenção
   - Agente comete erro recorrente → Adicionar checklist ou validação
   - Instrução ambígua causa confusão → Esclarecer instrução

5. **Formato de atualização do driver:**
   - Adicionar na seção "REGRAS OBRIGATÓRIAS" se for regra crítica
   - Adicionar na seção "O agente NUNCA deve" se for algo proibido
   - Adicionar checklist de validação se for necessário verificar algo
   - Incrementar versão (ex: 1.0 → 1.1)
   - Adicionar nota no final: "📝 Histórico de Atualizações"

**Exemplo de atualização:**
```
Se o usuário reclamar: "Você não deveria ter commitado sem perguntar"
→ Adicionar em "REGRAS OBRIGATÓRIAS": "O agente DEVE SEMPRE perguntar antes de executar git commit"
→ Adicionar em "O agente NUNCA deve": "❌ Executar git commit sem confirmação explícita do usuário"
→ Incrementar versão: 1.0 → 1.1
```

🎯 Como Funciona

Este driver automatiza o processo completo de preparação do código para deploy:

1. **Higienização da Arquitetura** (`ARCHITECTURE_HYGIENE_DRIVER.md`)
   - Reorganiza arquivos e pastas
   - Corrige nomes e referências
   - Atualiza documentação
   - Valida estrutura

2. **Commit Organizado** (`COMMIT_AND_PUSH.md`)
   - Cria branch apropriada
   - Gera mensagem de commit padronizada
   - Valida arquivos (especialmente `agent-os/`)
   - Faz push e sugere PR

**Benefícios:**
- ✅ Código sempre organizado antes de commitar
- ✅ Commits sempre padronizados
- ✅ Processo completo automatizado
- ✅ Menos erros e retrabalho

📋 Fluxo Completo do Auto Deploy

### ETAPA 1: Inicialização

**Pergunta 1:** "Deseja executar o Auto Deploy completo? (Higienização + Commit)"
- Se SIM: Prosseguir
- Se NÃO: Perguntar qual etapa específica deseja

**Pergunta 2:** "Há mudanças não commitadas no momento?"
- Verificar: `git status`
- Se houver, informar ao usuário
- Perguntar se deseja incluir no commit

### ETAPA 2: Architecture Hygiene Driver

**Executar o driver:** `docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`

**O agente DEVE:**
1. Ler e seguir TODAS as instruções do Architecture Hygiene Driver
2. Fazer TODAS as perguntas necessárias
3. Executar análise completa da estrutura
4. Reorganizar arquivos (se necessário e autorizado)
5. Atualizar documentação
6. Validar que tudo está alinhado
7. Gerar relatório da higienização

**Após concluir, validar:**
- [ ] Estrutura de pastas está correta
- [ ] Arquivos estão nos lugares certos
- [ ] Nomes de arquivos estão padronizados
- [ ] Referências estão corretas
- [ ] Documentação está atualizada

**Pergunta 3:** "A higienização foi concluída com sucesso? Deseja prosseguir para o commit?"
- Se houver problemas, resolver antes de prosseguir
- Se tudo OK, prosseguir para próxima etapa

### ETAPA 3: Commit & Push Driver

**Executar o driver:** `docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`

**O agente DEVE:**
1. Ler e seguir TODAS as instruções do Commit & Push Driver
2. Fazer TODAS as perguntas necessárias (9 perguntas obrigatórias)
3. Verificar `agent-os/` antes de commitar
4. Criar branch apropriada (se mudança grande)
5. Gerar mensagem de commit padronizada
6. Validar arquivos a serem commitados
7. Executar commit e push (se autorizado)
8. Sugerir criação de PR

**Após concluir, validar:**
- [ ] Commit foi feito com sucesso
- [ ] Branch foi criada (se necessário)
- [ ] `agent-os/` NÃO foi commitado
- [ ] Mensagem de commit segue padrão
- [ ] Push foi realizado

### ETAPA 4: Relatório Final

**O agente DEVE gerar relatório completo:**

```
📊 Relatório do Auto Deploy

✅ Higienização da Arquitetura:
- Arquivos movidos: [lista]
- Arquivos renomeados: [lista]
- Referências atualizadas: [lista]
- Documentação criada/atualizada: [lista]

✅ Commit & Push:
- Branch criada: [nome]
- Arquivos commitados: [número]
- Mensagem de commit: [mensagem]
- Push realizado: [sim/não]
- PR sugerido: [link]

⚠️ Ações Pendentes:
- [lista de ações que precisam ser feitas manualmente]
```

🚫 O que NUNCA deve ser feito

**O agente NUNCA deve:**
- ❌ Executar commits sem seguir o driver de commit
- ❌ Commitar `agent-os/` (mesmo que o usuário peça)
- ❌ Pular etapas de validação
- ❌ Prosseguir sem resolver problemas da etapa anterior
- ❌ Executar sem perguntar ao usuário
- ❌ Assumir o que o usuário quer

📁 Estrutura de Arquivos

```
docs/
  DRIVERS/
    ARCHYGIENE/
      ARCHITECTURE_HYGIENE_DRIVER.md
      ARCHITECTURE_HYGIENE_DRIVER.en.md
    COMMIT_AND_PUSH/
      COMMIT_AND_PUSH.md
      COMMIT_AND_PUSH.en.md
    AUTO/
      AUTODEPLOY.md (este arquivo)
      AUTODEPLOY.en.md
```

🔗 Referências

- Architecture Hygiene Driver: `docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`
- Commit & Push Driver: `docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`
- Theme Creation Driver: `docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md` (não executado neste driver)

📋 Checklist de Validação Final

Antes de finalizar o Auto Deploy, verificar:

**Higienização:**
- [ ] Estrutura de pastas está correta
- [ ] Arquivos estão organizados
- [ ] Referências estão atualizadas
- [ ] Documentação está completa

**Commit:**
- [ ] Branch foi criada (se necessário)
- [ ] Mensagem de commit segue padrão
- [ ] `agent-os/` NÃO foi commitado
- [ ] `.env` NÃO foi commitado
- [ ] Apenas arquivos relevantes foram commitados
- [ ] Push foi realizado com sucesso

**Geral:**
- [ ] Todas as etapas foram concluídas
- [ ] Nenhum erro foi ignorado
- [ ] Relatório foi gerado
- [ ] Usuário foi informado de todas as mudanças

📝 Histórico de Atualizações

**Versão 1.1 (20/11/2025):**
- Adicionada seção de AUTO-ATUALIZAÇÃO para melhoria contínua dos drivers
- Instruções para o agente auto-atualizar o driver quando identificar problemas ou receber feedback do usuário

**Versão 1.0 (19/11/2025):**
- Versão inicial do Auto Deploy Driver

🚀 Conclusão

Este driver automatiza o processo completo de preparação do código para deploy, garantindo:

- ✅ Código sempre organizado
- ✅ Commits sempre padronizados
- ✅ Processo completo automatizado
- ✅ Menos erros e retrabalho
- ✅ Deploy confiável

**Lembre-se:**
- O agente DEVE executar os drivers na sequência correta
- O agente DEVE fazer perguntas antes de cada etapa
- O agente DEVE validar cada etapa antes de prosseguir
- O agente DEVE gerar relatório completo ao final

**Localização deste arquivo:**
- `/docs/DRIVERS/AUTO/AUTODEPLOY.md`
- Linkar no README principal

