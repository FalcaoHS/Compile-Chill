# Compile & Chill

Portal de descompressão para desenvolvedores.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (vem com Node.js)
- **PostgreSQL** ([Download](https://www.postgresql.org/download/)) ou use um serviço como [Neon](https://neon.tech/), [Supabase](https://supabase.com/), ou [Railway](https://railway.app/)
- Conta no **X (Twitter)** para obter credenciais OAuth

## 🚀 Guia de Configuração Passo a Passo

### 1. Instalar Dependências

Clone o repositório (se ainda não fez) e instale as dependências:

```bash
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

#### Opção A: PostgreSQL Local

1. Instale o PostgreSQL no seu sistema
2. Crie um banco de dados:
   ```sql
   CREATE DATABASE compileandchill;
   ```
3. Anote as credenciais (usuário, senha, host, porta)

#### Opção B: Serviço Cloud (Recomendado para desenvolvimento)

**Neon (PostgreSQL Serverless - Grátis):**
1. Acesse [https://neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a connection string fornecida

**Supabase (PostgreSQL - Grátis):**
1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Vá em Settings > Database > Connection string
5. Copie a connection string (URI format)

**Railway (PostgreSQL - Grátis):**
1. Acesse [https://railway.app](https://railway.app)
2. Crie uma conta gratuita
3. Crie um novo projeto > Add PostgreSQL
4. Copie a DATABASE_URL fornecida

### 3. Obter Credenciais OAuth do X (Twitter)

1. **Acesse o Twitter Developer Portal:**
   - Link: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
   - Faça login com sua conta do X (Twitter)

2. **Usar Projeto Existente ou Criar Novo App:**
   
   **Opção A: Se você JÁ TEM um projeto:**
   - Selecione seu projeto existente no dashboard
   - Dentro do projeto, procure por "Apps" ou "Applications" (geralmente na barra lateral ou no topo)
   - Você pode:
     - **Usar um app existente**: Clique no app e vá para "Settings" > "User authentication settings"
     - **Criar um novo app dentro do projeto**: 
       - Procure por "Add App", "Create App", ou botão "+" dentro da seção de Apps
       - Se não encontrar, você pode usar um app existente e apenas configurar as URLs de callback
       - **Dica**: Você pode usar o mesmo app para múltiplos projetos, apenas configure diferentes Callback URLs
   
   **Opção B: Se você NÃO TEM um projeto:**
   - Clique em "Create Project" ou "New Project"
   - Preencha as informações do projeto
   - Depois, crie um novo App dentro do projeto
   - Preencha as informações do App:
     - **App name**: Compile & Chill (ou qualquer nome)
     - **App description**: Portal de descompressão para desenvolvedores
     - **Website URL**: `http://localhost:3000` (para desenvolvimento)
     - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANTE**

3. **Configurar OAuth 2.0 (OBRIGATÓRIO - faça isso PRIMEIRO):**
   - Dentro do seu App, vá na aba **"Settings"** (ao lado de "Keys and tokens")
   - Procure por **"User authentication settings"** ou **"OAuth 2.0 Settings"**
   - Clique em **"Set up"** ou **"Edit"** para configurar OAuth 2.0
   - Configure rapidamente:
     - **Type of App**: Selecione **"Web App, Automated App or Bot"** (Confidential client)
     - **App permissions**: Deixe **"Read"** selecionado (já está por padrão)
     - **Callback URI / Redirect URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANTE**
     - **Website URL**: 
       - Se não aceitar `http://localhost:3000`, tente:
       - `http://127.0.0.1:3000` (IP local)
       - Ou use um serviço temporário como `http://localhost` (sem porta)
       - Ou deixe em branco se for opcional
       - ⚠️ **O mais importante é o Callback URI estar correto!**
   - **Salve as alterações** (muito importante!)
   - ⚠️ **ATENÇÃO**: As credenciais OAuth 2.0 (Client ID e Client Secret) só aparecem DEPOIS de configurar OAuth 2.0!

4. **Obter Credenciais OAuth 2.0:**
   - Após configurar OAuth 2.0, volte para a aba **"Keys and tokens"**
   - Procure pela seção **"OAuth 2.0 Client ID and Client Secret"** ou **"OAuth 2.0 credentials"**
   - Você verá:
     - **Client ID** (será seu `X_CLIENT_ID`)
     - **Client Secret** (será seu `X_CLIENT_SECRET`) - pode ter um botão "Reveal" para mostrar
   - ⚠️ **IMPORTANTE**: 
     - **NÃO use** as "Consumer Keys" (API Key and Secret) - essas são para API v1.1
     - **NÃO use** "Bearer Token" ou "Access Token and Secret" - essas são diferentes
     - Você precisa especificamente das credenciais **OAuth 2.0** (Client ID e Client Secret)
     - Se não aparecer a seção OAuth 2.0, volte ao passo 3 e certifique-se de ter salvo a configuração
     - Mantenha essas credenciais seguras e nunca as commite no Git!

### 4. Configurar Upstash Redis (para Rate Limiting)

**Opção A: Upstash (Recomendado - Grátis):**
1. Acesse [https://upstash.com](https://upstash.com)
2. Crie uma conta gratuita
3. Crie um novo Redis database
4. Copie a **REST URL** e **REST TOKEN** fornecidos
5. Adicione essas variáveis ao seu `.env` (veja passo 6)

**Opção B: Pular Rate Limiting (Desenvolvimento):**
- Se você não quiser configurar rate limiting agora, pode deixar as variáveis vazias
- O sistema funcionará, mas rate limiting não estará ativo
- ⚠️ **Importante**: Configure Upstash antes de fazer deploy em produção

### 5. Gerar NEXTAUTH_SECRET

Gere uma chave secreta segura para o NextAuth:

**No Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**No Linux/Mac:**
```bash
openssl rand -base64 32
```

**Alternativa online (se não tiver openssl):**
- Acesse [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Copie a string gerada

### 6. Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Connection
# Substitua pelos seus valores reais
DATABASE_URL="postgresql://usuario:senha@localhost:5432/compileandchill?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cole-aqui-o-secret-gerado-no-passo-4"

# X OAuth Credentials (obtidas no passo 3)
X_CLIENT_ID="cole-aqui-o-client-id-do-twitter"
X_CLIENT_SECRET="cole-aqui-o-client-secret-do-twitter"

# Upstash Redis (para Rate Limiting - opcional para desenvolvimento)
# Obtenha em: https://upstash.com/
UPSTASH_REDIS_REST_URL="cole-aqui-o-url-do-upstash-redis"
UPSTASH_REDIS_REST_TOKEN="cole-aqui-o-token-do-upstash-redis"
```

**Exemplo com Neon:**
```env
DATABASE_URL="postgresql://usuario:senha@ep-xxx-xxx.us-east-2.aws.neon.tech/compileandchill?sslmode=require"
```

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git (já está no `.gitignore`)
- Mantenha suas credenciais seguras
- Use credenciais diferentes para desenvolvimento e produção

### 7. Executar Migrations do Prisma

Configure o banco de dados executando as migrations:

```bash
npx prisma migrate dev
```

Isso irá:
- Criar todas as tabelas necessárias (users, accounts, sessions, verification_tokens)
- Aplicar os índices e constraints
- Gerar o Prisma Client automaticamente

**Se der erro de conexão:**
- Verifique se o PostgreSQL está rodando
- Confirme que a `DATABASE_URL` está correta
- Teste a conexão: `npx prisma db pull` (deve listar as tabelas)

### 8. Gerar Prisma Client (se necessário)

Se o Prisma Client não foi gerado automaticamente:

```bash
npx prisma generate
```

### 9. Executar o Projeto

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:3000**

## ✅ Verificação

Após seguir todos os passos, você deve conseguir:

1. ✅ Acessar http://localhost:3000 sem erros
2. ✅ Ver o botão "Entrar com X" no header e na home
3. ✅ Clicar no botão e ser redirecionado para o X para autorizar
4. ✅ Após autorizar, ser redirecionado de volta e ver seu perfil no header

## 🔧 Troubleshooting

### Erro: "Você não conseguiu dar acesso ao aplicativo" ou "Invalid credentials"
**Solução passo a passo:**

1. **Verifique o Callback URL no Twitter Developer Portal:**
   - Vá em Settings > User authentication settings
   - O Callback URI deve estar EXATAMENTE: `http://localhost:3000/api/auth/callback/twitter`
   - ⚠️ **IMPORTANTE**: 
     - Deve começar com `http://` (não `https://`)
     - Deve ter `/api/auth/callback/twitter` no final
     - Não pode ter espaços ou caracteres extras
     - Salve as alterações após editar

2. **Verifique se está usando as credenciais OAuth 2.0 corretas:**
   - No `.env`, você deve usar:
     - `X_CLIENT_ID` = OAuth 2.0 Client ID (não API Key)
     - `X_CLIENT_SECRET` = OAuth 2.0 Client Secret (não API Key Secret)
   - Essas credenciais aparecem DEPOIS de configurar OAuth 2.0 em Settings
   - Se você copiou "API Key" e "API Key Secret", essas são erradas! Precisa das OAuth 2.0 credentials

3. **Verifique se o Type of App está correto:**
   - Deve ser "Web App, Automated App or Bot" (Confidential client)
   - Não pode ser "Native App"

4. **Reinicie o servidor após mudar o .env:**
   ```bash
   # Pare o servidor (Ctrl+C) e rode novamente:
   npm run dev
   ```

### Erro: "Database connection failed"
- Verifique se o PostgreSQL está rodando
- Confirme a `DATABASE_URL` no `.env`
- Teste a conexão manualmente

### Erro: "NEXTAUTH_SECRET is missing"
- Certifique-se de que o arquivo `.env` existe na raiz
- Verifique se a variável `NEXTAUTH_SECRET` está definida
- Reinicie o servidor após criar/editar o `.env`

### Erro: "Prisma Client not generated"
```bash
npx prisma generate
```

### Ver logs do Prisma
O Prisma está configurado para logar queries em desenvolvimento. Verifique o console.

## 📚 Links Úteis

- **Twitter Developer Portal**: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
- **NextAuth.js v5 Docs**: [https://authjs.dev](https://authjs.dev)
- **Prisma Docs**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Neon (PostgreSQL Serverless)**: [https://neon.tech](https://neon.tech)
- **Supabase**: [https://supabase.com](https://supabase.com)

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Prisma** (PostgreSQL)
- **NextAuth.js v5** (beta)

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Cria build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa linter
```

## 🔐 Segurança

- ⚠️ Nunca commite credenciais no Git
- ⚠️ Use variáveis de ambiente diferentes para dev/prod
- ⚠️ Mantenha o `NEXTAUTH_SECRET` seguro e único
- ⚠️ Configure HTTPS em produção

