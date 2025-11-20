# 🎓 Guia Completo para Iniciantes - Compile & Chill

> **Não se preocupe!** Este guia foi feito especialmente para você que está começando. Vamos explicar TUDO, passo a passo, com calma. No final, você terá o projeto rodando localmente e entenderá o que cada coisa faz! 🚀

## 📚 Índice

1. [Por que este guia existe?](#por-que-este-guia-existe)
2. [O que você vai aprender](#o-que-você-vai-aprender)
3. [Pré-requisitos (o que você precisa ter)](#pré-requisitos)
4. [Passo 1: Entendendo o que vamos instalar](#passo-1-entendendo-o-que-vamos-instalar)
5. [Passo 2: Instalando o Node.js](#passo-2-instalando-o-nodejs)
6. [Passo 3: Clonando o repositório](#passo-3-clonando-o-repositório)
7. [Passo 4: Instalando as dependências](#passo-4-instalando-as-dependências)
8. [Passo 5: Configurando o banco de dados](#passo-5-configurando-o-banco-de-dados)
9. [Passo 6: Configurando autenticação OAuth](#passo-6-configurando-autenticação-oauth)
10. [Passo 7: Configurando variáveis de ambiente](#passo-7-configurando-variáveis-de-ambiente)
11. [Passo 8: Configurando o banco de dados](#passo-8-configurando-o-banco-de-dados)
12. [Passo 9: Rodando o projeto](#passo-9-rodando-o-projeto)
13. [Conceitos importantes explicados](#conceitos-importantes-explicados)
14. [Troubleshooting (resolvendo problemas)](#troubleshooting)

---

## Por que este guia existe?

Este guia foi criado porque acreditamos que **qualquer pessoa pode aprender programação**, desde que tenha:
- ✅ Paciência
- ✅ Vontade de aprender
- ✅ Um guia bem explicado (que é este aqui!)

**Você não precisa ser um expert!** Este guia assume que você está começando e explica cada conceito do zero.

---

## O que você vai aprender

Ao final deste guia, você vai:
- ✅ Entender o que é Node.js e por que precisamos dele
- ✅ Saber o que são dependências e como funcionam
- ✅ Compreender o que é um banco de dados e por que usamos PostgreSQL
- ✅ Entender autenticação OAuth (login com X/Twitter)
- ✅ Saber o que são variáveis de ambiente e por que são importantes
- ✅ Ter o projeto rodando localmente na sua máquina!

---

## Pré-requisitos

### O que você PRECISA ter:

1. **Um computador** (Windows, Mac ou Linux)
2. **Conexão com internet**
3. **Uma conta no GitHub** (grátis, vamos criar se não tiver)
4. **Uma conta no X (Twitter)** (para autenticação)
5. **Paciência e vontade de aprender!** 😊

### O que você NÃO precisa ter:

- ❌ Conhecimento avançado de programação
- ❌ Experiência prévia com Node.js
- ❌ Ter rodado projetos antes
- ❌ Saber o que é um banco de dados

**Tudo isso você vai aprender aqui!**

### Considerações Especiais para Regiões com Acesso Digital Limitado

Este guia foi projetado para ser acessível para desenvolvedores, educadores e aprendizes na **Etiópia, Uganda e Tanzânia**, onde o acesso digital pode ser limitado. Aqui estão algumas dicas:

**Se você tem internet lenta ou instável:**
- Baixe o instalador do Node.js durante horários de menor tráfego quando possível
- Considere usar um gerenciador de downloads para arquivos grandes
- A etapa `npm install` pode levar mais tempo - isso é normal, tenha paciência
- Serviços de banco de dados em nuvem (Neon, Supabase) funcionam bem mesmo com conexões mais lentas

**Se você tem dados limitados:**
- Use bancos de dados em nuvem (Neon/Supabase) em vez de PostgreSQL local para economizar largura de banda
- O projeto foi projetado para funcionar eficientemente com recursos limitados
- Considere usar "Modo Economia de Dados" quando disponível (recurso planejado)

**Se você está em uma instituição educacional ou ONG:**
- Este projeto é perfeito para ensinar conceitos de programação
- Todas as ferramentas usadas são gratuitas e open-source
- Pode ser adaptado para uso offline no futuro
- Veja nossa [página de Impacto Social](/impacto-social) para oportunidades de parceria

**Lembre-se:** A comunidade de programação é global e solidária. Não hesite em pedir ajuda!

---

## Passo 1: Entendendo o que vamos instalar

Antes de começar, vamos entender **o que** vamos instalar e **por quê**. Isso vai te ajudar a entender o que está acontecendo em cada passo.

### Node.js - O que é e por que precisamos?

**O que é?**
Node.js é um "ambiente de execução" para JavaScript. Pense nele como um "motor" que permite rodar JavaScript fora do navegador (no seu computador).

**Por que precisamos?**
- Nosso projeto é feito em JavaScript/TypeScript
- Precisamos de algo para "executar" esse código
- Node.js faz isso por nós

**Analogia simples:**
Se o JavaScript é a "gasolina", o Node.js é o "motor do carro". Sem o motor, a gasolina não funciona!

### npm - O que é e por que precisamos?

**O que é?**
npm significa "Node Package Manager" (Gerenciador de Pacotes do Node). É uma ferramenta que vem junto com o Node.js.

**Por que precisamos?**
- Nosso projeto usa "bibliotecas" (código feito por outras pessoas)
- npm baixa e instala essas bibliotecas para nós
- É como uma "loja de aplicativos" para código

**Analogia simples:**
Se o Node.js é o "motor", o npm é o "mecânico" que instala as "peças" (bibliotecas) que o motor precisa.

### Git - O que é e por que precisamos?

**O que é?**
Git é um sistema de controle de versão. Ele permite baixar código de repositórios (como o GitHub).

**Por que precisamos?**
- O código do projeto está no GitHub
- Precisamos "baixar" esse código para nossa máquina
- Git faz isso por nós

**Analogia simples:**
Git é como um "download manager" especializado em código. Ele baixa o projeto inteiro para você trabalhar nele.

---

## Passo 2: Instalando o Node.js

### Por que instalar o Node.js primeiro?

Porque ele é a base de tudo! Sem ele, nada funciona. É como tentar dirigir sem ter um carro.

### Como instalar (Windows)

1. **Acesse o site oficial:**
   - Vá para: https://nodejs.org/
   - Você verá dois botões: "LTS" e "Current"
   - **Clique em "LTS"** (Long Term Support = Suporte de Longo Prazo = mais estável)

2. **Baixe o instalador:**
   - O arquivo será algo como: `node-v20.x.x-x64.msi`
   - Clique duas vezes nele para instalar

3. **Siga o assistente de instalação:**
   - Clique em "Next" em todas as telas
   - **IMPORTANTE:** Deixe marcada a opção "Automatically install the necessary tools"
   - Clique em "Install"
   - Aguarde a instalação terminar

4. **Verifique se funcionou:**
   - Abra o "Prompt de Comando" (cmd) ou PowerShell
   - Digite: `node --version`
   - Você deve ver algo como: `v20.x.x`
   - Digite: `npm --version`
   - Você deve ver algo como: `10.x.x`

   **Se aparecerem os números, está funcionando! 🎉**

### Como instalar (Mac)

1. **Opção A - Usando o site oficial (recomendado):**
   - Vá para: https://nodejs.org/
   - Clique em "LTS"
   - Baixe o arquivo `.pkg`
   - Abra o arquivo e siga o assistente

2. **Opção B - Usando Homebrew (se você já tem):**
   ```bash
   brew install node
   ```

3. **Verifique se funcionou:**
   - Abra o Terminal
   - Digite: `node --version`
   - Digite: `npm --version`

### Como instalar (Linux)

1. **Usando o gerenciador de pacotes (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Verifique se funcionou:**
   ```bash
   node --version
   npm --version
   ```

### O que acabamos de fazer?

Instalamos o Node.js e o npm. Agora seu computador pode:
- ✅ Executar código JavaScript
- ✅ Instalar bibliotecas usando npm

---

## Passo 3: Clonando o repositório

### O que é "clonar"?

"Clonar" significa fazer uma **cópia completa** do projeto do GitHub para o seu computador. É como fazer download, mas de forma especial que mantém a conexão com o repositório original.

### Por que precisamos clonar?

Porque o código está no GitHub (na nuvem) e precisamos dele na nossa máquina para trabalhar.

### Como clonar (método fácil - usando GitHub Desktop)

1. **Instale o GitHub Desktop:**
   - Vá para: https://desktop.github.com/
   - Baixe e instale

2. **Faça login no GitHub Desktop:**
   - Use sua conta do GitHub

3. **Clone o repositório:**
   - No GitHub Desktop, clique em "File" > "Clone Repository"
   - Cole a URL: `https://github.com/FalcaoHS/Compile-Chill`
   - Escolha onde salvar (ex: `C:\Users\SeuNome\Documents\Compile-Chill`)
   - Clique em "Clone"

### Como clonar (método avançado - usando Git no terminal)

1. **Abra o terminal/Prompt de Comando**

2. **Navegue até onde quer salvar o projeto:**
   ```bash
   cd Documents
   # ou
   cd Desktop
   ```

3. **Clone o repositório:**
   ```bash
   git clone https://github.com/FalcaoHS/Compile-Chill.git
   ```

4. **Entre na pasta do projeto:**
   ```bash
   cd Compile-Chill
   ```

### O que acabamos de fazer?

Baixamos todo o código do projeto para nossa máquina. Agora temos:
- ✅ Todos os arquivos do projeto
- ✅ A estrutura de pastas
- ✅ O código fonte completo

---

## Passo 4: Instalando as dependências

### O que são "dependências"?

Dependências são **bibliotecas** (código feito por outras pessoas) que nosso projeto precisa para funcionar. É como peças de um quebra-cabeça - cada uma tem uma função específica.

### Exemplos de dependências do nosso projeto:

- **Next.js**: Framework para criar aplicações web
- **React**: Biblioteca para criar interfaces
- **Prisma**: Ferramenta para trabalhar com banco de dados
- **NextAuth**: Sistema de autenticação
- E muitas outras!

### Por que precisamos instalar?

Porque essas bibliotecas não vêm com o código do projeto. Elas são baixadas separadamente quando você instala.

### Como instalar:

1. **Abra o terminal/Prompt de Comando**

2. **Navegue até a pasta do projeto:**
   ```bash
   cd Compile-Chill
   # ou o caminho onde você clonou
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

   **O que este comando faz?**
   - Lê o arquivo `package.json` (que lista todas as dependências)
   - Baixa cada biblioteca da internet
   - Instala na pasta `node_modules`
   - Pode levar alguns minutos (é normal!)

4. **Aguarde a instalação terminar:**
   - Você verá muitas linhas de texto
   - No final, deve aparecer algo como: "added 500 packages"

### O que acabamos de fazer?

Instalamos todas as bibliotecas que o projeto precisa. Agora temos:
- ✅ Next.js instalado
- ✅ React instalado
- ✅ Prisma instalado
- ✅ Todas as outras dependências

**Tempo estimado:** 2-5 minutos (depende da sua internet)

**Nota para regiões com conexões mais lentas:** Se você está na Etiópia, Uganda ou Tanzânia e tem internet mais lenta, esta etapa pode levar 10-15 minutos. Isso é completamente normal! Tenha paciência e deixe completar. A instalação funcionará da mesma forma independentemente da velocidade da conexão.

---

## Passo 5: Configurando o banco de dados

### O que é um banco de dados?

Um banco de dados é como uma **planilha gigante** onde guardamos informações. No nosso caso, vamos guardar:
- Dados dos usuários
- Pontuações dos jogos
- Histórico de partidas

### Por que precisamos de um banco de dados?

Porque precisamos **guardar informações** que persistem mesmo depois que o servidor desliga. Sem banco de dados, toda vez que você fechar o projeto, perderia todos os dados!

### O que é PostgreSQL?

PostgreSQL é um **tipo específico** de banco de dados. É gratuito, confiável e muito usado. Pense nele como um "armário de arquivos" super organizado.

### Opções para configurar o banco de dados:

Temos 3 opções. Vamos explicar cada uma:

#### Opção A: Neon (Recomendado para iniciantes) ⭐

**O que é Neon?**
Neon é um serviço que oferece PostgreSQL "na nuvem" (online). É grátis e muito fácil de usar.

**Por que é recomendado?**
- ✅ Não precisa instalar nada no seu computador
- ✅ Funciona imediatamente
- ✅ Grátis para começar
- ✅ Interface visual fácil

**Como configurar:**

1. **Acesse o site:**
   - Vá para: https://neon.tech/
   - Clique em "Sign Up" (Cadastrar)

2. **Crie uma conta:**
   - Você pode usar sua conta do GitHub (mais fácil!)
   - Ou criar conta com email

3. **Crie um novo projeto:**
   - Clique em "New Project"
   - Escolha um nome (ex: "compile-chill-dev")
   - Escolha a região mais próxima de você
     - **Para Etiópia, Uganda, Tanzânia:** Escolha a região disponível mais próxima (geralmente regiões da Europa ou Oriente Médio funcionam bem)
     - Não se preocupe se a região exata não estiver disponível - qualquer região funcionará
   - Clique em "Create Project"

4. **Copie a connection string:**
   - Na tela do projeto, você verá "Connection string"
   - Clique em "Copy" ao lado da connection string
   - Ela será algo como: `postgresql://usuario:senha@ep-xxx.neon.tech/dbname?sslmode=require`
   - **GUARDE ISSO!** Vamos usar depois

**O que acabamos de fazer?**
Criamos um banco de dados online que está pronto para usar. É como alugar um espaço de armazenamento na nuvem!

#### Opção B: Supabase

**O que é Supabase?**
Similar ao Neon, mas com mais recursos. Também é grátis e fácil.

**Como configurar:**

1. Acesse: https://supabase.com/
2. Crie uma conta
3. Crie um novo projeto
4. Vá em Settings > Database > Connection string
5. Copie a connection string

#### Opção C: PostgreSQL Local (Avançado)

**O que é?**
Instalar PostgreSQL diretamente no seu computador.

**Por que não recomendamos para iniciantes?**
- Mais complexo de configurar
- Precisa instalar software adicional
- Mais chance de dar erro

**Se quiser tentar mesmo assim:**
1. Baixe PostgreSQL: https://www.postgresql.org/download/
2. Instale seguindo o assistente
3. Crie um banco de dados chamado `compileandchill`
4. Anote usuário, senha e porta

---

## Passo 6: Configurando autenticação OAuth

### O que é OAuth?

OAuth é um sistema que permite **fazer login usando contas de outros serviços**. No nosso caso, vamos usar o X (Twitter) para login.

**Por que usar OAuth?**
- ✅ Usuário não precisa criar nova conta
- ✅ Mais seguro (o X cuida da segurança)
- ✅ Mais rápido (um clique e pronto)

### O que vamos fazer?

Vamos criar uma "aplicação" no X que permite nosso site fazer login com contas do X.

### Passo a passo detalhado:

#### 1. Acessar o Twitter Developer Portal

1. **Acesse:**
   - Vá para: https://developer.twitter.com/en/portal/dashboard
   - Faça login com sua conta do X (Twitter)

2. **O que é este portal?**
   - É um painel onde desenvolvedores criam "apps" (aplicações)
   - Nossa "app" vai ser o Compile & Chill
   - O X vai nos dar "credenciais" (chaves) para fazer login

#### 2. Criar um projeto (se não tiver)

1. **Clique em "Create Project"**
2. **Preencha:**
   - **Project name:** Compile & Chill (ou qualquer nome)
   - **Use case:** Escolha "Making a bot" ou "Exploring the API"
   - **Description:** Portal de jogos para desenvolvedores
3. **Clique em "Next"**
4. **Aceite os termos**
5. **Clique em "Create Project"**

#### 3. Criar uma App dentro do projeto

1. **Dentro do projeto, clique em "Add App"**
2. **Preencha:**
   - **App name:** compile-chill-dev (ou qualquer nome)
   - **Description:** App de desenvolvimento para Compile & Chill
3. **Clique em "Create App"**

#### 4. Configurar OAuth 2.0 (MUITO IMPORTANTE!)

**Por que este passo é importante?**
Sem configurar OAuth 2.0, não teremos as credenciais corretas para fazer login funcionar.

1. **Na página da App, clique na aba "Settings"** (ao lado de "Keys and tokens")

2. **Procure por "User authentication settings"**
   - Pode estar escrito "OAuth 2.0 Settings"
   - Clique em "Set up" ou "Edit"

3. **Configure:**
   - **Type of App:** Selecione "Web App, Automated App or Bot"
   - **App permissions:** Deixe "Read" selecionado
   - **Callback URI / Redirect URL:** `http://localhost:3000/api/auth/callback/twitter`
     - ⚠️ **IMPORTANTE:** Copie exatamente isso, sem espaços!
   - **Website URL:** `http://localhost:3000`
     - Se não aceitar, tente `http://127.0.0.1:3000`
     - Ou deixe em branco se for opcional

4. **Clique em "Save"**
   - ⚠️ **MUITO IMPORTANTE:** Salve! Sem salvar, as credenciais não aparecem!

#### 5. Obter as credenciais OAuth 2.0

**Por que precisamos dessas credenciais?**
Elas são como "chaves" que permitem nosso site se comunicar com o X para fazer login.

1. **Volte para a aba "Keys and tokens"**

2. **Procure pela seção "OAuth 2.0 Client ID and Client Secret"**
   - ⚠️ **ATENÇÃO:** Não use "API Key" ou "Bearer Token"!
   - Você precisa especificamente de "OAuth 2.0 Client ID" e "OAuth 2.0 Client Secret"

3. **Copie as credenciais:**
   - **Client ID:** Será algo como `abc123xyz...`
   - **Client Secret:** Clique em "Reveal" para ver, será algo como `def456uvw...`
   - **GUARDE ESSAS CREDENCIAIS!** Vamos usar no próximo passo

**O que acabamos de fazer?**
Criamos uma "aplicação" no X que permite nosso site fazer login. É como criar uma "chave" que permite nosso site acessar informações básicas da conta do X do usuário.

---

## Passo 7: Configurando variáveis de ambiente

### O que são variáveis de ambiente?

Variáveis de ambiente são **configurações secretas** que o projeto precisa, mas que não devem ser compartilhadas publicamente. É como senhas e chaves que ficam guardadas em um cofre.

### Por que usamos variáveis de ambiente?

Porque algumas informações são **sensíveis** (como senhas de banco de dados) e não devem estar no código que vai para o GitHub. Variáveis de ambiente ficam apenas na sua máquina.

### O que vamos configurar?

Vamos criar um arquivo `.env` (ponto env) com todas as configurações que o projeto precisa.

### Passo a passo:

1. **Na pasta do projeto, crie um arquivo chamado `.env`**
   - ⚠️ **IMPORTANTE:** O nome deve ser exatamente `.env` (com o ponto no início!)
   - No Windows, pode ser difícil criar arquivo começando com ponto
   - Solução: Use um editor de texto (VS Code, Notepad++) e salve como `.env`

2. **Abra o arquivo `.env` e cole o seguinte:**

```env
# ============================================
# CONFIGURAÇÃO DO BANCO DE DADOS
# ============================================
# Cole aqui a connection string que você copiou do Neon/Supabase
# Exemplo: postgresql://usuario:senha@ep-xxx.neon.tech/dbname?sslmode=require
DATABASE_URL="cole-aqui-sua-connection-string-do-neon"

# ============================================
# CONFIGURAÇÃO DO NEXTAUTH (Sistema de Autenticação)
# ============================================
# URL onde o projeto vai rodar (desenvolvimento local)
NEXTAUTH_URL="http://localhost:3000"

# Chave secreta para criptografar sessões
# Gere uma usando: openssl rand -base64 32
# Ou use: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="cole-aqui-o-secret-gerado"

# ============================================
# CREDENCIAIS DO X (TWITTER) OAuth
# ============================================
# Cole aqui as credenciais OAuth 2.0 que você obteve no passo 6
X_CLIENT_ID="cole-aqui-o-client-id-do-twitter"
X_CLIENT_SECRET="cole-aqui-o-client-secret-do-twitter"

# ============================================
# UPSTASH REDIS (Opcional para desenvolvimento)
# ============================================
# Rate limiting - previne abuso do sistema
# Se não quiser configurar agora, deixe vazio
# O sistema funcionará, mas sem rate limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

3. **Preencha cada variável:**

   **a) DATABASE_URL:**
   - Cole a connection string que você copiou do Neon
   - Deve ficar entre aspas: `DATABASE_URL="postgresql://..."`

   **b) NEXTAUTH_SECRET:**
   - Gere uma chave secreta:
     - **Windows (PowerShell):**
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
       ```
     - **Mac/Linux:**
       ```bash
       openssl rand -base64 32
       ```
     - **Online (se não tiver openssl):**
       - Acesse: https://generate-secret.vercel.app/32
       - Copie a string gerada
   - Cole no `.env` entre aspas

   **c) X_CLIENT_ID e X_CLIENT_SECRET:**
   - Cole as credenciais que você obteve no passo 6
   - Cada uma entre aspas

4. **Salve o arquivo**

### O que cada variável faz? (Explicação detalhada)

**DATABASE_URL:**
- É o "endereço" do banco de dados
- Contém usuário, senha, servidor e nome do banco
- O Prisma usa isso para conectar ao banco

**NEXTAUTH_URL:**
- É a URL onde o projeto roda
- Em desenvolvimento: `http://localhost:3000`
- Em produção: seria `https://seu-dominio.com`

**NEXTAUTH_SECRET:**
- É uma chave secreta para criptografar sessões de usuários
- Como uma "senha mestra" que protege os logins
- Deve ser única e segura (por isso geramos aleatoriamente)

**X_CLIENT_ID e X_CLIENT_SECRET:**
- São as "credenciais" que o X nos deu
- Permitem nosso site se comunicar com o X
- Como um "usuário e senha" para acessar a API do X

**UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN:**
- São para rate limiting (limitar requisições)
- Previnem que alguém abuse do sistema
- Opcionais para desenvolvimento

### ⚠️ IMPORTANTE: Segurança

- ❌ **NUNCA** commite o arquivo `.env` no GitHub!
- ✅ O arquivo `.gitignore` já está configurado para ignorar `.env`
- ✅ Mantenha suas credenciais seguras
- ✅ Use credenciais diferentes para desenvolvimento e produção

---

## Passo 8: Configurando o banco de dados

### O que vamos fazer?

Vamos criar as **tabelas** no banco de dados. Tabelas são como "planilhas" onde guardamos dados organizados.

### Por que precisamos fazer isso?

Porque o banco de dados começa vazio. Precisamos criar a estrutura (tabelas) antes de poder guardar dados.

### O que são "migrations"?

Migrations são "scripts" que criam ou modificam a estrutura do banco de dados. É como um "projeto de construção" que diz onde colocar cada coisa.

### Passo a passo:

1. **Abra o terminal na pasta do projeto**

2. **Execute o comando de migration:**
   ```bash
   npx prisma migrate dev
   ```

   **O que este comando faz?**
   - Lê o arquivo `prisma/schema.prisma` (que define a estrutura)
   - Cria as tabelas no banco de dados
   - Aplica índices (para buscas rápidas)
   - Cria relacionamentos entre tabelas
   - Gera o Prisma Client automaticamente

3. **Quando perguntar o nome da migration:**
   - Digite algo como: `init` ou `initial_setup`
   - Pressione Enter

4. **Aguarde a conclusão:**
   - Você verá mensagens como "Creating migration..."
   - No final, deve aparecer "Migration applied successfully"

### O que foi criado?

O Prisma criou estas tabelas no banco de dados:

- **users**: Guarda dados dos usuários (nome, avatar, etc.)
- **accounts**: Guarda informações de autenticação OAuth
- **sessions**: Guarda sessões de usuários logados
- **scores**: Guarda pontuações dos jogos
- **score_validation_fails**: Guarda tentativas de trapaça bloqueadas

### Se der erro:

**Erro: "Can't reach database server"**
- Verifique se a `DATABASE_URL` no `.env` está correta
- Verifique se copiou a connection string completa
- Teste a conexão no painel do Neon

**Erro: "P1001: Can't reach database server"**
- O banco de dados pode estar pausado (Neon pausa após inatividade)
- Acesse o painel do Neon e "resume" o projeto
- Tente novamente

**Erro: "Migration failed"**
- Verifique se não há outra migration pendente
- Tente: `npx prisma migrate reset` (cuidado: apaga dados!)
- Ou: `npx prisma db push` (alternativa mais simples)

### Gerar Prisma Client (se necessário):

Se o Prisma Client não foi gerado automaticamente:

```bash
npx prisma generate
```

**O que é Prisma Client?**
É um "cliente" (ferramenta) que permite nosso código JavaScript conversar com o banco de dados. É como um "tradutor" entre JavaScript e SQL.

---

## Passo 9: Rodando o projeto

### Chegou a hora! 🎉

Agora vamos **rodar o projeto** e ver tudo funcionando!

### Passo a passo:

1. **Abra o terminal na pasta do projeto**

2. **Execute o comando de desenvolvimento:**
   ```bash
   npm run dev
   ```

   **O que este comando faz?**
   - Inicia o servidor de desenvolvimento
   - Compila o código TypeScript para JavaScript
   - Fica "escutando" mudanças nos arquivos
   - Quando você salva um arquivo, recarrega automaticamente

3. **Aguarde a compilação:**
   - Você verá muitas linhas de texto
   - Procure por: "Ready" ou "Local: http://localhost:3000"
   - Quando aparecer, está pronto!

4. **Abra o navegador:**
   - Vá para: http://localhost:3000
   - Você deve ver a página inicial do Compile & Chill!

### O que você deve ver?

- ✅ Página inicial com lista de jogos
- ✅ Header com botão "Entrar com X"
- ✅ Tudo funcionando!

### Testando o login:

1. **Clique em "Entrar com X"**
2. **Você será redirecionado para o X**
3. **Autorize o aplicativo**
4. **Você será redirecionado de volta**
5. **Deve ver seu perfil no header!**

### Se algo não funcionar:

Veja a seção [Troubleshooting](#troubleshooting) abaixo!

---

## Conceitos importantes explicados

### O que é Next.js?

**Next.js** é um framework (estrutura) para criar aplicações web com React. Ele facilita:
- Roteamento (navegação entre páginas)
- Renderização no servidor
- Otimizações automáticas

**Analogia:** Se React é o "motor", Next.js é o "carro completo" com todas as peças já montadas.

### O que é React?

**React** é uma biblioteca para criar interfaces de usuário. Permite criar componentes reutilizáveis.

**Analogia:** React é como "blocos de LEGO" - você monta peças pequenas para fazer algo grande.

### O que é TypeScript?

**TypeScript** é JavaScript com "tipos". Ajuda a encontrar erros antes de rodar o código.

**Analogia:** Se JavaScript é escrever à mão, TypeScript é usar um corretor ortográfico.

### O que é Prisma?

**Prisma** é uma ferramenta que facilita trabalhar com banco de dados. Traduz JavaScript para SQL automaticamente.

**Analogia:** Prisma é como um "tradutor" que converte JavaScript em comandos de banco de dados.

### O que é NextAuth?

**NextAuth** é um sistema de autenticação. Gerencia login, sessões e segurança.

**Analogia:** NextAuth é como um "porteiro" que verifica se você pode entrar e te dá um "passe" (sessão).

### O que são migrations?

**Migrations** são scripts que modificam a estrutura do banco de dados de forma controlada e reversível.

**Analogia:** Migrations são como "versões" do banco de dados. Cada migration adiciona ou modifica algo.

---

## Troubleshooting

### Erro: "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
npm install
```

### Erro: "Port 3000 is already in use"

**Causa:** Outro processo está usando a porta 3000.

**Solução:**
- Feche outros projetos Next.js
- Ou mude a porta: `npm run dev -- -p 3001`

### Erro: "DATABASE_URL is missing"

**Causa:** Arquivo `.env` não existe ou está incorreto.

**Solução:**
- Verifique se o arquivo `.env` existe na raiz do projeto
- Verifique se `DATABASE_URL` está definida
- Reinicie o servidor após criar/editar `.env`

### Erro: "Invalid credentials" no login

**Causa:** Credenciais OAuth incorretas ou Callback URL errada.

**Solução:**
1. Verifique se está usando OAuth 2.0 credentials (não API Key)
2. Verifique se o Callback URL no Twitter está: `http://localhost:3000/api/auth/callback/twitter`
3. Reinicie o servidor após mudar `.env`

### Erro: "Prisma Client not generated"

**Causa:** Prisma Client não foi gerado.

**Solução:**
```bash
npx prisma generate
```

### Erro: "Migration failed"

**Causa:** Problema com a conexão ou estrutura do banco.

**Solução:**
```bash
npx prisma db push
```
Isso aplica o schema diretamente sem criar migration.

### Projeto não carrega no navegador

**Causa:** Servidor não iniciou corretamente.

**Solução:**
1. Pare o servidor (Ctrl+C)
2. Limpe o cache: `rm -rf .next` (Mac/Linux) ou `rmdir /s .next` (Windows)
3. Reinstale dependências: `rm -rf node_modules && npm install`
4. Tente novamente: `npm run dev`

### Erro de compilação TypeScript

**Causa:** Erros de tipo no código.

**Solução:**
```bash
npm run type-check
```
Isso mostra todos os erros de tipo. Corrija-os antes de rodar.

---

## 🎉 Parabéns!

Se você chegou até aqui e o projeto está rodando, **você conseguiu!** 🎊

### O que você aprendeu:

- ✅ Como instalar e usar Node.js
- ✅ Como clonar projetos do GitHub
- ✅ Como instalar dependências
- ✅ Como configurar banco de dados
- ✅ Como configurar autenticação OAuth
- ✅ Como usar variáveis de ambiente
- ✅ Como rodar um projeto Next.js

### Próximos passos:

1. **Explore o código:** Abra os arquivos e veja como funciona
2. **Faça mudanças:** Tente modificar algo e veja o resultado
3. **Leia a documentação:** Cada biblioteca tem docs excelentes
4. **Pratique:** Quanto mais você pratica, mais aprende!

### Lembre-se:

- ❌ **Não tenha medo de errar!** Erros são parte do aprendizado
- ✅ **Pergunte!** A comunidade está aqui para ajudar
- ✅ **Pesquise!** Google e Stack Overflow são seus amigos
- ✅ **Pratique!** A prática leva à perfeição

### Precisa de ajuda?

- Abra uma issue no GitHub
- Leia a documentação oficial
- Pergunte na comunidade
- **Para desenvolvedores na Etiópia, Uganda, Tanzânia:** Confira nossa [página de Impacto Social](/impacto-social) para suporte regional e oportunidades de parceria

### Contribuindo para Acesso Regional

Se você é desenvolvedor, tradutor ou educador na Etiópia, Uganda ou Tanzânia, considere:
- Traduzir documentação para idiomas locais (Amárico, Suaíli)
- Criar tutoriais específicos para desafios regionais
- Conectar com ONGs locais e escolas para distribuir este conteúdo
- Veja nossa [página de Impacto Social](/impacto-social) para mais formas de contribuir

**Você é capaz! Continue aprendendo! 🚀**

---

*Este guia foi feito com muito carinho para ajudar você a começar. Se tiver sugestões de melhoria, por favor compartilhe!*

