# 🚀 Drivers — Compile & Chill

Esta pasta contém todos os drivers automatizados para gerenciar o projeto Compile & Chill.

## 📁 Estrutura

```
docs/DRIVERS/
├── ARCHYGIENE/
│   ├── ARCHITECTURE_HYGIENE_DRIVER.md (PT)
│   └── ARCHITECTURE_HYGIENE_DRIVER.en.md (EN)
├── COMMIT_AND_PUSH/
│   ├── COMMIT_AND_PUSH.md (PT)
│   └── COMMIT_AND_PUSH.en.md (EN)
├── THEME_CREATION/
│   ├── THEME_CREATION_DRIVER.md (PT)
│   └── THEME_CREATION_DRIVER.en.md (EN)
├── SETUP/
│   ├── INSTALL.md (PT)
│   └── INSTALL.en.md (EN)
├── AUTO/
│   ├── AUTODEPLOY.md (PT)
│   └── AUTODEPLOY.en.md (EN)
└── README.md (este arquivo)
```

## 🎯 Drivers Disponíveis

### 1. 🧼 Architecture Hygiene Driver

**Localização:** `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`

**O que faz:**
- Revisa toda a estrutura de pastas e arquivos
- Identifica arquivos fora do lugar ou com nomes incorretos
- Verifica e corrige referências quebradas
- Organiza módulos conforme arquitetura recomendada
- Cria/atualiza documentação técnica
- Padroniza nomes e convenções
- Valida que tudo está alinhado

**Quando usar:**
- Após implementar muitas features
- Quando a estrutura está desorganizada
- Antes de fazer commits grandes
- Quando há arquivos fora do lugar

**Versões:**
- 🇧🇷 [Português](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md)
- 🇺🇸 [English](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.en.md)

---

### 2. 📘 Commit & Push Driver

**Localização:** `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`

**O que faz:**
- Padroniza mensagens de commit
- Cria branches apropriadas
- Valida arquivos antes de commitar (especialmente `agent-os/`)
- Gera mensagens de commit seguindo padrão
- Sugere criação de Pull Requests
- Garante que commits seguem convenções

**Quando usar:**
- Antes de fazer qualquer commit
- Para garantir que commits estão padronizados
- Para validar que `agent-os/` não será commitado
- Para criar branches apropriadas

**Versões:**
- 🇧🇷 [Português](COMMIT_AND_PUSH/COMMIT_AND_PUSH.md)
- 🇺🇸 [English](COMMIT_AND_PUSH/COMMIT_AND_PUSH.en.md)

---

### 3. 🎨 Theme Creation Driver

**Localização:** `THEME_CREATION/THEME_CREATION_DRIVER.md`

**O que faz:**
- Gera especificação técnica completa do tema
- Cria estrutura de pastas correta em `agent-os/specs/`
- Organiza todos os arquivos de documentação
- Atualiza referências no sistema
- Garante que tudo está alinhado e documentado

**Quando usar:**
- Quando um colaborador quer criar um novo tema
- Para padronizar criação de temas
- Para garantir que temas seguem estrutura correta
- Para automatizar processo de criação de temas

**Versões:**
- 🇧🇷 [Português](THEME_CREATION/THEME_CREATION_DRIVER.md)
- 🇺🇸 [English](THEME_CREATION/THEME_CREATION_DRIVER.en.md)

---

### 4. ⚙️ Environment Setup Driver

**Localização:** `SETUP/INSTALL.md`

**O que faz:**
- Valida pré-requisitos (Node.js, pnpm, Git)
- Instala dependências automaticamente
- Gera `NEXTAUTH_SECRET` automaticamente
- Cria arquivo `.env` com template completo
- Configura banco de dados (Prisma migrations)
- Configura OAuth (X/Twitter)
- Configura Upstash Redis (opcional)
- Valida build e TypeScript
- Executa tudo automaticamente (mínimo de perguntas)

**Quando usar:**
- Primeira vez configurando o ambiente
- Reconfigurando ambiente após mudanças
- Quando precisa de setup rápido e automatizado
- Para novos colaboradores

**Versões:**
- 🇧🇷 [Português](SETUP/INSTALL.md)
- 🇺🇸 [English](SETUP/INSTALL.en.md) (em breve)

---

### 5. 🚀 Auto Deploy Driver

**Localização:** `AUTO/AUTODEPLOY.md`

**O que faz:**
- Executa automaticamente Architecture Hygiene Driver
- Executa automaticamente Commit & Push Driver
- Garante que código está organizado antes de commitar
- Gera relatório completo das mudanças
- Automatiza processo completo de preparação para deploy

**Quando usar:**
- Quando quer preparar código completo para deploy
- Quando quer garantir organização + commit padronizado
- Para automatizar processo completo
- Antes de fazer deploy em produção

**Versões:**
- 🇧🇷 [Português](AUTO/AUTODEPLOY.md)
- 🇺🇸 [English](AUTO/AUTODEPLOY.en.md)

---

## 📖 Como Usar os Drivers

### Para Agentes de IA:

Os drivers são documentos markdown que contêm instruções detalhadas para executar tarefas específicas. Para usar um driver:

1. **Abra o arquivo do driver** (ex: `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`)
2. **Leia TODAS as seções**, especialmente:
   - "REGRAS OBRIGATÓRIAS" (no topo)
   - "Instruções para o Agente de IA"
   - Todas as etapas do processo
3. **Siga o processo passo a passo** conforme descrito
4. **Faça perguntas ao usuário** quando necessário (o driver indica quando perguntar)
5. **Valide cada etapa** antes de prosseguir
6. **Gere um relatório final** das mudanças realizadas

### Para Colaboradores Humanos:

1. **Escolha o driver apropriado** para sua necessidade
2. **Leia o documento completo** para entender o que será feito
3. **Forneça o driver para um agente de IA** (como Cursor, ChatGPT, Claude, etc.)
4. **Responda as perguntas** que o agente fizer
5. **Revise o relatório final** gerado pelo agente

### Exemplo de Uso com Agente de IA:

```
Você: "Execute o driver de Architecture Hygiene"
Agente: [Lê o arquivo ARCHITECTURE_HYGIENE_DRIVER.md]
Agente: "Vou analisar a estrutura do projeto. Posso prosseguir?"
Você: "Sim"
Agente: [Executa análise, reorganiza arquivos, gera relatório]
Agente: "Concluído! Relatório: [lista de mudanças]"
```

---

## 🔄 Fluxo Recomendado

### Para Preparar Código para Deploy:

1. **Usar Auto Deploy Driver** (`AUTO/AUTODEPLOY.md`)
   - Executa tudo automaticamente na sequência correta
   - Recomendado para a maioria dos casos
   - **Como usar:** Forneça o arquivo `AUTO/AUTODEPLOY.md` para o agente e diga "Execute este driver"

### Para Apenas Organizar Arquitetura:

1. **Usar Architecture Hygiene Driver** (`ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`)
   - Apenas reorganização, sem commit
   - **Como usar:** Forneça o arquivo `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md` para o agente e diga "Execute este driver"

### Para Apenas Fazer Commit:

1. **Usar Commit & Push Driver** (`COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`)
   - Apenas commit, sem reorganização
   - **Como usar:** Forneça o arquivo `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md` para o agente e diga "Execute este driver"

### Para Criar um Novo Tema:

1. **Usar Theme Creation Driver** (`THEME_CREATION/THEME_CREATION_DRIVER.md`)
   - Cria estrutura completa para novo tema
   - **Como usar:** Forneça o arquivo `THEME_CREATION/THEME_CREATION_DRIVER.md` para o agente e responda as perguntas sobre o tema

### Para Configurar Ambiente do Zero:

1. **Usar Environment Setup Driver** (`SETUP/INSTALL.md`)
   - Configura todo o ambiente automaticamente
   - **Como usar:** Arraste o arquivo `SETUP/INSTALL.md` para o prompt e dê Enter! O agente executará tudo automaticamente (apenas perguntará credenciais externas)

## ⚙️ Instruções Detalhadas por Driver

### 🧼 Architecture Hygiene Driver

**Passo a passo:**

1. Forneça o arquivo `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md` para o agente
2. O agente irá:
   - Analisar toda a estrutura de pastas
   - Identificar arquivos fora do lugar
   - Verificar referências quebradas
   - Reorganizar conforme necessário
   - Criar/atualizar documentação
   - Gerar relatório completo
3. Revise o relatório antes de aprovar mudanças

**Comando sugerido para o agente:**
```
Execute o driver: docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md
```

---

### 📘 Commit & Push Driver

**Passo a passo:**

1. Forneça o arquivo `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md` para o agente
2. O agente irá fazer perguntas:
   - "Quais arquivos foram modificados?"
   - "Esta é uma mudança grande?"
   - "Qual o tipo de mudança? (feat, fix, docs, etc.)"
3. O agente irá:
   - Validar que `agent-os/` não será commitado
   - Criar branch se necessário
   - Gerar mensagem de commit padronizada
   - Sugerir criação de Pull Request
4. Revise a mensagem de commit antes de aprovar

**Comando sugerido para o agente:**
```
Execute o driver: docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md
```

---

### 🎨 Theme Creation Driver

**Passo a passo:**

1. Forneça o arquivo `THEME_CREATION/THEME_CREATION_DRIVER.md` para o agente
2. O agente irá fazer perguntas sobre:
   - Nome do tema
   - Paleta de cores
   - Variações de orbs
   - Objetos decorativos
   - Efeitos especiais
   - Easter eggs
   - Créditos do criador
3. O agente irá:
   - Criar estrutura em `agent-os/specs/YYYY-MM-DD-[theme-id]/`
   - Gerar toda documentação necessária
   - Atualizar referências no sistema
   - Validar que tudo está correto
4. Revise a especificação gerada

**Comando sugerido para o agente:**
```
Execute o driver: docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md
```

---

### ⚙️ Environment Setup Driver

**Passo a passo:**

1. Forneça o arquivo `SETUP/INSTALL.md` para o agente (ou arraste o arquivo para o prompt)
2. O agente irá executar automaticamente:
   - Validar pré-requisitos (Node.js, pnpm, Git)
   - Instalar dependências
   - Gerar `NEXTAUTH_SECRET` automaticamente
   - Criar arquivo `.env` com template completo
   - Rodar migrations do Prisma
   - Validar build e TypeScript
3. O agente irá perguntar apenas:
   - Connection string do banco (se não existir)
   - Credenciais OAuth (X/Twitter) (se não existirem)
   - Credenciais Upstash Redis (opcional)
4. Revise o relatório final

**Comando sugerido para o agente:**
```
Execute o driver: docs/DRIVERS/SETUP/INSTALL.md
```

**Ou simplesmente:** Arraste o arquivo `INSTALL.md` para o prompt e dê Enter!

---

### 🚀 Auto Deploy Driver

**Passo a passo:**

1. Forneça o arquivo `AUTO/AUTODEPLOY.md` para o agente
2. O agente irá executar automaticamente:
   - **Etapa 1:** Architecture Hygiene Driver
   - **Etapa 2:** Commit & Push Driver
3. O agente irá:
   - Gerar relatório de cada etapa
   - Validar todas as mudanças
   - Criar relatório final consolidado
4. Revise o relatório final antes de aprovar

**Comando sugerido para o agente:**
```
Execute o driver: docs/DRIVERS/AUTO/AUTODEPLOY.md
```

---

## ⚠️ Regras Importantes

### O que NUNCA deve ser commitado:

- ❌ Pasta `agent-os/` (configurações internas do Agent OS)
- ❌ Arquivos `.env` e `.env.*` (credenciais)
- ❌ Arquivos temporários e logs
- ❌ Drivers internos do Agent OS

### O agente sempre deve:

- ✅ Fazer perguntas antes de executar
- ✅ Validar cada etapa antes de prosseguir
- ✅ Gerar relatório das mudanças
- ✅ Seguir todas as regras obrigatórias

## 📚 Outros Drivers

**Nota:** O Theme Creation Driver não é executado pelo Auto Deploy, apenas quando necessário criar novos temas.

## 🔗 Links Úteis

- [Architecture Hygiene Driver (PT)](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md)
- [Architecture Hygiene Driver (EN)](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.en.md)
- [Commit & Push Driver (PT)](COMMIT_AND_PUSH/COMMIT_AND_PUSH.md)
- [Commit & Push Driver (EN)](COMMIT_AND_PUSH/COMMIT_AND_PUSH.en.md)
- [Auto Deploy Driver (PT)](AUTO/AUTODEPLOY.md)
- [Auto Deploy Driver (EN)](AUTO/AUTODEPLOY.en.md)
- [Theme Creation Driver (PT)](THEME_CREATION/THEME_CREATION_DRIVER.md)
- [Theme Creation Driver (EN)](THEME_CREATION/THEME_CREATION_DRIVER.en.md)
- [Environment Setup Driver (PT)](SETUP/INSTALL.md)
- [Environment Setup Driver (EN)](SETUP/INSTALL.en.md) (em breve)

## 📝 Notas

- Todos os drivers seguem o mesmo padrão de instruções
- Todos têm versões em PT e EN
- Todos têm regras obrigatórias explícitas
- Todos fazem perguntas antes de executar
- Todos geram relatórios das mudanças

