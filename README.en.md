# 🎮 Compile & Chill

> A decompression portal for developers with themed games, ranking system, and X (Twitter) authentication.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)

## ✨ About the Project

Compile & Chill is a portal created especially for developers who want a few minutes of relaxation without leaving the "dev vibe". The project combines light games, hacker/cyber aesthetics, theme customization, global rankings, simplified login via X (Twitter), and social sharing.

### 🎯 Main Features

- 🎮 **10 Themed Games**: Terminal 2048, Crypto Miner, Dev Pong, Stack Overflow Dodge, and more
- 🎨 **5 Visual Themes**: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev
- 🏆 **Ranking System**: Global and per-game rankings with anti-cheat validation
- 🔐 **OAuth Authentication**: Single sign-on via X (Twitter) with NextAuth.js v5
- 📊 **User Profiles**: Game history, best scores, and statistics
- 🎯 **Score Validation**: Robust server-side validation system to prevent cheating
- ⚡ **Performance**: Optimized with Next.js 14 App Router and TypeScript

## 📋 Prerequisites

Before you begin, make sure you have installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **PostgreSQL** ([Download](https://www.postgresql.org/download/)) or use a service like [Neon](https://neon.tech/), [Supabase](https://supabase.com/), or [Railway](https://railway.app/)
- **X (Twitter)** account to obtain OAuth credentials

## 🚀 Step-by-Step Setup Guide

### 1. Install Dependencies

Clone the repository (if you haven't already) and install dependencies:

```bash
npm install
```

### 2. Configure PostgreSQL Database

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database:
   ```sql
   CREATE DATABASE compileandchill;
   ```
3. Note the credentials (user, password, host, port)

#### Option B: Cloud Service (Recommended for development)

**Neon (PostgreSQL Serverless - Free):**
1. Visit [https://neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the provided connection string

**Supabase (PostgreSQL - Free):**
1. Visit [https://supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database > Connection string
5. Copy the connection string (URI format)

**Railway (PostgreSQL - Free):**
1. Visit [https://railway.app](https://railway.app)
2. Create a free account
3. Create a new project > Add PostgreSQL
4. Copy the provided DATABASE_URL

### 3. Get X (Twitter) OAuth Credentials

1. **Access the Twitter Developer Portal:**
   - Link: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
   - Log in with your X (Twitter) account

2. **Use Existing Project or Create New App:**
   
   **Option A: If you ALREADY HAVE a project:**
   - Select your existing project in the dashboard
   - Within the project, look for "Apps" or "Applications" (usually in the sidebar or top)
   - You can:
     - **Use an existing app**: Click on the app and go to "Settings" > "User authentication settings"
     - **Create a new app within the project**: 
       - Look for "Add App", "Create App", or "+" button within the Apps section
       - If you can't find it, you can use an existing app and just configure different Callback URLs
       - **Tip**: You can use the same app for multiple projects, just configure different Callback URLs
   
   **Option B: If you DON'T HAVE a project:**
   - Click "Create Project" or "New Project"
   - Fill in the project information
   - Then, create a new App within the project
   - Fill in the App information:
     - **App name**: Compile & Chill (or any name)
     - **App description**: Decompression portal for developers
     - **Website URL**: `http://localhost:3000` (for development)
     - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANT**

3. **Configure OAuth 2.0 (MANDATORY - do this FIRST):**
   - Within your App, go to the **"Settings"** tab (next to "Keys and tokens")
   - Look for **"User authentication settings"** or **"OAuth 2.0 Settings"**
   - Click **"Set up"** or **"Edit"** to configure OAuth 2.0
   - Configure quickly:
     - **Type of App**: Select **"Web App, Automated App or Bot"** (Confidential client)
     - **App permissions**: Leave **"Read"** selected (default)
     - **Callback URI / Redirect URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANT**
     - **Website URL**: 
       - If it doesn't accept `http://localhost:3000`, try:
       - `http://127.0.0.1:3000` (local IP)
       - Or use a temporary service like `http://localhost` (without port)
       - Or leave blank if optional
       - ⚠️ **The most important thing is the Callback URI being correct!**
   - **Save the changes** (very important!)
   - ⚠️ **ATTENTION**: OAuth 2.0 credentials (Client ID and Client Secret) only appear AFTER configuring OAuth 2.0!

4. **Get OAuth 2.0 Credentials:**
   - After configuring OAuth 2.0, go back to the **"Keys and tokens"** tab
   - Look for the **"OAuth 2.0 Client ID and Client Secret"** or **"OAuth 2.0 credentials"** section
   - You will see:
     - **Client ID** (will be your `X_CLIENT_ID`)
     - **Client Secret** (will be your `X_CLIENT_SECRET`) - may have a "Reveal" button to show
   - ⚠️ **IMPORTANT**: 
     - **DO NOT use** "Consumer Keys" (API Key and Secret) - these are for API v1.1
     - **DO NOT use** "Bearer Token" or "Access Token and Secret" - these are different
     - You need specifically **OAuth 2.0** credentials (Client ID and Client Secret)
     - If the OAuth 2.0 section doesn't appear, go back to step 3 and make sure you saved the configuration
     - Keep these credentials secure and never commit them to Git!

### 4. Configure Upstash Redis (for Rate Limiting)

**Option A: Upstash (Recommended - Free):**
1. Visit [https://upstash.com](https://upstash.com)
2. Create a free account
3. Create a new Redis database
4. Copy the **REST URL** and **REST TOKEN** provided
5. Add these variables to your `.env` (see step 6)

**Option B: Skip Rate Limiting (Development):**
- If you don't want to configure rate limiting now, you can leave the variables empty
- The system will work, but rate limiting won't be active
- ⚠️ **Important**: Configure Upstash before deploying to production

### 5. Generate NEXTAUTH_SECRET

Generate a secure secret key for NextAuth:

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**On Linux/Mac:**
```bash
openssl rand -base64 32
```

**Online alternative (if you don't have openssl):**
- Visit [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Copy the generated string

### 6. Create .env File

Create a `.env` file in the project root:

```env
# Database Connection
# Replace with your actual values
DATABASE_URL="postgresql://user:password@localhost:5432/compileandchill?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="paste-the-secret-generated-in-step-4-here"

# X OAuth Credentials (obtained in step 3)
X_CLIENT_ID="paste-your-twitter-client-id-here"
X_CLIENT_SECRET="paste-your-twitter-client-secret-here"

# Upstash Redis (for Rate Limiting - optional for development)
# Get at: https://upstash.com/
UPSTASH_REDIS_REST_URL="paste-your-upstash-redis-url-here"
UPSTASH_REDIS_REST_TOKEN="paste-your-upstash-redis-token-here"
```

**Example with Neon:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/compileandchill?sslmode=require"
```

**⚠️ IMPORTANT:**
- Never commit the `.env` file to Git (already in `.gitignore`)
- Keep your credentials secure
- Use different credentials for development and production

### 7. Run Prisma Migrations

Configure the database by running migrations:

```bash
npx prisma migrate dev
```

This will:
- Create all necessary tables (users, accounts, sessions, verification_tokens)
- Apply indexes and constraints
- Automatically generate Prisma Client

**If you get a connection error:**
- Check if PostgreSQL is running
- Confirm that `DATABASE_URL` is correct
- Test the connection: `npx prisma db pull` (should list tables)

### 8. Generate Prisma Client (if needed)

If Prisma Client wasn't generated automatically:

```bash
npx prisma generate
```

### 9. Run the Project

Start the development server:

```bash
npm run dev
```

The project will be available at: **http://localhost:3000**

## ✅ Verification

After following all steps, you should be able to:

1. ✅ Access http://localhost:3000 without errors
2. ✅ See the "Sign in with X" button in the header and home
3. ✅ Click the button and be redirected to X to authorize
4. ✅ After authorizing, be redirected back and see your profile in the header

## 🔧 Troubleshooting

### Error: "You couldn't grant access to the application" or "Invalid credentials"
**Step-by-step solution:**

1. **Check the Callback URL in Twitter Developer Portal:**
   - Go to Settings > User authentication settings
   - The Callback URI must be EXACTLY: `http://localhost:3000/api/auth/callback/twitter`
   - ⚠️ **IMPORTANT**: 
     - Must start with `http://` (not `https://`)
     - Must have `/api/auth/callback/twitter` at the end
     - Cannot have spaces or extra characters
     - Save changes after editing

2. **Check if you're using the correct OAuth 2.0 credentials:**
   - In `.env`, you should use:
     - `X_CLIENT_ID` = OAuth 2.0 Client ID (not API Key)
     - `X_CLIENT_SECRET` = OAuth 2.0 Client Secret (not API Key Secret)
   - These credentials appear AFTER configuring OAuth 2.0 in Settings
   - If you copied "API Key" and "API Key Secret", those are wrong! You need OAuth 2.0 credentials

3. **Check if the Type of App is correct:**
   - Must be "Web App, Automated App or Bot" (Confidential client)
   - Cannot be "Native App"

4. **Restart the server after changing .env:**
   ```bash
   # Stop the server (Ctrl+C) and run again:
   npm run dev
   ```

### Error: "Database connection failed"
- Check if PostgreSQL is running
- Confirm `DATABASE_URL` in `.env`
- Test the connection manually

### Error: "NEXTAUTH_SECRET is missing"
- Make sure the `.env` file exists in the root
- Check if the `NEXTAUTH_SECRET` variable is defined
- Restart the server after creating/editing `.env`

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### View Prisma logs
Prisma is configured to log queries in development. Check the console.

## 📚 Useful Links

- **Twitter Developer Portal**: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
- **NextAuth.js v5 Docs**: [https://authjs.dev](https://authjs.dev)
- **Prisma Docs**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Neon (PostgreSQL Serverless)**: [https://neon.tech](https://neon.tech)
- **Supabase**: [https://supabase.com](https://supabase.com)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Static typing
- **TailwindCSS** - Utility styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **Matter.js** - Physics for games

### Backend
- **Next.js API Routes** - Serverless API
- **Prisma** - ORM for PostgreSQL
- **NextAuth.js v5** - OAuth authentication
- **Zod** - Schema validation

### Infrastructure
- **PostgreSQL** - Database
- **Upstash Redis** - Rate limiting
- **Vercel** - Deployment (recommended)

## 📁 Project Structure

```
compile-and-chill/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── jogos/             # Game pages
│   └── ...
├── components/             # React components
│   ├── games/             # Game-specific components
│   └── ...
├── lib/                    # Utilities and logic
│   ├── games/             # Game logic
│   ├── game-validators/   # Score validation
│   └── ...
├── hooks/                  # Custom React hooks
├── prisma/                 # Schema and migrations
├── public/                 # Static files
└── types/                  # TypeScript definitions
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Create production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
npm run format:check     # Check formatting

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Apply schema changes
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to the project.

**Available languages:**
- [English](CONTRIBUTING.md) (default)
- [Español](CONTRIBUTING.es.md)
- [Português](CONTRIBUTING.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔐 Security

- ⚠️ Never commit credentials to Git
- ⚠️ Use different environment variables for dev/prod
- ⚠️ Keep `NEXTAUTH_SECRET` secure and unique
- ⚠️ Configure HTTPS in production
- ⚠️ Review [SECURITY.md](SECURITY.md) for more security information

## 👤 Author

**Hudson Falcão Silva**

## 🙏 Acknowledgments

- All contributors who help improve this project
- The open-source community for all the amazing tools used

## 🌐 Other Languages

- [Português (PT-BR)](README.md) - Default
- [Español (ES)](README.es.md)

## 🎓 Are You a Beginner? Just Starting with Programming?

**Don't worry!** We created complete and detailed guides especially for you:

- 🇧🇷 **[Complete Beginner's Guide (Português)](docs/GUIA_INICIANTE_PT.md)** - Step-by-step explanations, concepts explained, troubleshooting
- 🇺🇸 **[Complete Beginner's Guide (English)](docs/BEGINNER_GUIDE_EN.md)** - Step-by-step explanations, concepts explained, troubleshooting
- 🇪🇸 **[Complete Beginner's Guide (Español)](docs/GUIA_INICIANTE_ES.md)** - Step-by-step explanations, concepts explained, troubleshooting

**What you'll find in the guides:**
- ✅ Explanation of each concept (Node.js, npm, Git, etc.)
- ✅ Detailed step-by-step with examples
- ✅ Why each thing is necessary (not just how to do it)
- ✅ Complete troubleshooting for common problems
- ✅ Simple analogies to understand complex concepts
- ✅ Calming and encouraging beginner developers

**If you follow the guide, you'll end up with the system running locally!** 🚀

---

**Note:** This is the English version. For other languages, see the links above.

