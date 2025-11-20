# 🎮 Compile & Chill

> Portal de descompressão para desenvolvedores com jogos temáticos, sistema de rankings e autenticação via X (Twitter).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)

## 🌐 Outros Idiomas / Other Languages / Otros Idiomas

- 🇧🇷 [Português (PT-BR)](README.md) - Padrão / Default
- 🇺🇸 [English (EN)](README.en.md)
- 🇪🇸 [Español (ES)](README.es.md)

## 🎓 É Iniciante? Começando na Programação?

**Não se preocupe!** Criamos guias completos e detalhados especialmente para você:

### 🌟 Guia Super Simples (Recomendado para Iniciantes Absolutos!)

- 🇧🇷 **[Guia Super Simples (Português)](docs/GUIA_SUPER_SIMPLES_PT.md)** ⭐ **NOVO!**
  - Explicado como para uma criança de 8 anos
  - Cada conceito explicado com analogias do dia a dia
  - Passos extremamente detalhados
  - Perfeito para quem tem zero conhecimento técnico
  - Linguagem super acessível e acolhedora

### 📚 Guias Completos (Para Quem Quer Mais Detalhes)

- 🇧🇷 **[Guia Completo para Iniciantes (Português)](docs/GUIA_INICIANTE_PT.md)** - Explicações passo a passo, conceitos explicados, troubleshooting
- 🇺🇸 **[Complete Beginner's Guide (English)](docs/BEGINNER_GUIDE_EN.md)** - Step-by-step explanations, concepts explained, troubleshooting
- 🇪🇸 **[Guía Completa para Principiantes (Español)](docs/GUIA_INICIANTE_ES.md)** - Explicaciones paso a paso, conceptos explicados, solución de problemas
- 🇹🇿 **[Mwongozo Kamili wa Mwanzo (Swahili)](docs/BEGINNER_GUIDE_SW.md)** - Mwongozo kamili kwa wanaoanza, dhana zote zilizo elezwa, kutatua matatizo
- 🇪🇹 **[ሙሉ የጀማሪ መመሪያ (Amharic)](docs/BEGINNER_GUIDE_AM.md)** - ሙሉ መመሪያ ለጀማሪዎች፣ ሁሉም ጽንሰ-ሐሳቦች ተብራርተዋል፣ ችግሮችን መፍታት

**O que você vai encontrar nos guias:**
- ✅ Explicação de cada conceito (Node.js, npm, Git, etc.)
- ✅ Passo a passo detalhado com exemplos
- ✅ Por que cada coisa é necessária (não só como fazer)
- ✅ Troubleshooting completo para problemas comuns
- ✅ Analogias simples para entender conceitos complexos
- ✅ Acalmando e incentivando desenvolvedores iniciantes

**Se você seguir qualquer guia, vai terminar com o sistema rodando localmente!** 🚀

## 🌍 Impacto Social / Regiões de Interesse

Nosso projeto busca apoiar comunidades com **acesso limitado a recursos digitais**. Estamos focados em três países onde vemos grande oportunidade de impacto:

- **🇪🇹 Etiópia** — acesso digital baixo, muitos jovens sem conexão
- **🇺🇬 Uganda** — barreiras de infraestrutura e alto custo de dados
- **🇹🇿 Tanzânia** — comunidades rurais com acesso limitado e grande interesse por tecnologia

**Como contribuir:**
- 📝 Produzir documentação e tutoriais em inglês + línguas locais (amárico, suaíli)
- 💾 Criar versões "light" da ferramenta para uso offline ou com baixa largura de banda
- 🤝 Conectar com ONGs locais, escolas ou projetos de educação digital

**Saiba mais:** Visite nossa [página de Impacto Social](/impacto-social) para mais informações sobre parcerias e formas de contribuir.

## 💝 Sobre o Projeto

Compile & Chill não tem intenção de ganhar dinheiro com isso.

A ideia é simples: levar informação e acesso pra quem precisa, especialmente pra desenvolvedores que têm recursos limitados. Por isso, tudo aqui é de graça — sem anúncios, sem assinaturas, sem cobrança nenhuma.

É um projeto feito com carinho pela comunidade dev, pra criar um espaço onde todo mundo se sinta acolhido e possa descomprimir.

## ✨ Sobre o Projeto

Compile & Chill é um portal criado especialmente para desenvolvedores que desejam alguns minutos de relaxamento sem sair do "clima dev". O projeto une jogos leves, estética hacker/cyber, personalização de temas, ranking global, login simplificado via X (Twitter) e compartilhamento social.

### 🎯 Características Principais

- 🎮 **10 Jogos Temáticos**: Terminal 2048, Crypto Miner, Dev Pong, Stack Overflow Dodge e mais
- 🎨 **5 Temas Visuais**: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev
- 🏆 **Sistema de Rankings**: Rankings globais e por jogo com validação anti-cheat
- 🔐 **Autenticação OAuth**: Login único via X (Twitter) com NextAuth.js v5
- 📊 **Perfis de Usuário**: Histórico de jogos, melhores scores e estatísticas
- 🎯 **Validação de Scores**: Sistema robusto de validação server-side para prevenir trapaças
- ⚡ **Performance**: Otimizado com Next.js 14 App Router e TypeScript

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

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização utilitária
- **Framer Motion** - Animações
- **Zustand** - Gerenciamento de estado
- **Matter.js** - Física para jogos

### Backend
- **Next.js API Routes** - API serverless
- **Prisma** - ORM para PostgreSQL
- **NextAuth.js v5** - Autenticação OAuth
- **Zod** - Validação de schemas

### Infraestrutura
- **PostgreSQL** - Banco de dados
- **Upstash Redis** - Rate limiting
- **Vercel** - Deploy (recomendado)

## 🤖 Desenvolvimento com IA

Este projeto foi **completamente desenvolvido usando ferramentas de IA** como copilotos de código. Todo o código foi "vibecodado" com:

- **[Cursor](https://cursor.sh)** - Editor de código com IA integrada
- **[ChatGPT](https://chat.openai.com)** - Assistente de IA da OpenAI
- **[Gemini](https://gemini.google.com)** - Modelo de IA do Google
- **[Canvas](https://canvas.app)** - Ferramenta de design e prototipagem com IA

### ⚠️ Importante

Por ter sido desenvolvido principalmente com assistência de IA, **podem existir erros, inconsistências ou código não otimizado** em algumas partes do projeto. Contribuições, correções e melhorias são muito bem-vindas!

Este projeto também foi desenvolvido usando **[Agent OS](https://github.com/buildermethods/agent-os)**, um sistema para melhor planejamento e execução de tarefas de desenvolvimento de software com agentes de IA.

### O que é Agent OS?

**Agent OS** transforma agentes de IA de programação de "estagiários confusos" em desenvolvedores produtivos. Com workflows estruturados que capturam seus padrões, sua stack e os detalhes únicos do seu codebase, o Agent OS fornece aos seus agentes as especificações necessárias para entregar código de qualidade na primeira tentativa—não na quinta.

### Características do Agent OS

- ✅ **Spec-Driven Development**: Desenvolvimento guiado por especificações detalhadas
- ✅ **Workflows Estruturados**: Processos organizados de planejamento e implementação
- ✅ **Padrões e Standards**: Captura e aplica padrões do projeto automaticamente
- ✅ **Documentação Automática**: Gera documentação técnica durante o desenvolvimento
- ✅ **Compatível com**: Claude Code, Cursor, ou qualquer outra ferramenta de IA

### Especificações Técnicas

Todas as especificações detalhadas de features, planejamento e implementação estão disponíveis em [`specs/`](./specs/). Essas specs documentam:

- 📋 **Planejamento**: Requisitos, ideias iniciais e decisões de design
- 📝 **Especificações**: Documentação técnica detalhada de cada feature
- ✅ **Implementação**: Passo a passo de como cada feature foi implementada
- 🎯 **Verificações**: Testes e validações realizadas

Cada feature tem sua própria pasta com data, contendo todo o histórico de desenvolvimento, desde a ideia inicial até a implementação completa.

**Repositório oficial do Agent OS**: [https://github.com/buildermethods/agent-os](https://github.com/buildermethods/agent-os)

---

## 📁 Estrutura do Projeto

```
compile-and-chill/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── jogos/             # Páginas dos jogos
│   └── ...
├── components/             # Componentes React
│   ├── games/             # Componentes específicos de jogos
│   └── ...
├── lib/                    # Utilitários e lógica
│   ├── games/             # Lógica dos jogos
│   ├── game-validators/   # Validação de scores
│   └── ...
├── hooks/                  # React hooks customizados
├── prisma/                 # Schema e migrations
├── public/                 # Arquivos estáticos
├── specs/                  # Especificações técnicas (Agent OS)
│   └── [features]/        # Especificações de cada feature
├── agent-os/              # Configuração do Agent OS
│   ├── commands/          # Comandos do Agent OS
│   ├── product/           # Missão, roadmap e tech stack
│   └── standards/         # Padrões de código
└── types/                  # Definições TypeScript
```

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Cria build de produção
npm run start            # Inicia servidor de produção

# Qualidade de Código
npm run lint             # Executa ESLint
npm run lint:fix         # Corrige problemas do ESLint
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formata código com Prettier
npm run format:check     # Verifica formatação

# Banco de Dados
npm run db:generate      # Gera Prisma Client
npm run db:push          # Aplica mudanças no schema
npm run db:migrate       # Executa migrations
npm run db:studio        # Abre Prisma Studio
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para diretrizes sobre como contribuir para o projeto.

**Idiomas disponíveis:**
- [Português](CONTRIBUTING.md) (padrão)
- [English](CONTRIBUTING.en.md)
- [Español](CONTRIBUTING.es.md)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔐 Segurança

- ⚠️ Nunca commite credenciais no Git
- ⚠️ Use variáveis de ambiente diferentes para dev/prod
- ⚠️ Mantenha o `NEXTAUTH_SECRET` seguro e único
- ⚠️ Configure HTTPS em produção
- ⚠️ Revise o [SECURITY.md](SECURITY.md) para mais informações sobre segurança

## 👤 Autor

**Hudson Falcão Silva**

📧 **Email:** [falcaoh@gmail.com](mailto:falcaoh@gmail.com)

## 🙏 Agradecimentos

- Todos os contribuidores que ajudam a melhorar este projeto
- A comunidade open-source por todas as ferramentas incríveis utilizadas

