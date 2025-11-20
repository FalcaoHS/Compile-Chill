# 🎓 Complete Beginner's Guide - Compile & Chill

> **Don't worry!** This guide was made especially for you who are just starting out. We'll explain EVERYTHING, step by step, calmly. By the end, you'll have the project running locally and understand what each thing does! 🚀

## 📚 Table of Contents

1. [Why does this guide exist?](#why-does-this-guide-exist)
2. [What you'll learn](#what-youll-learn)
3. [Prerequisites (what you need)](#prerequisites)
4. [Step 1: Understanding what we'll install](#step-1-understanding-what-well-install)
5. [Step 2: Installing Node.js](#step-2-installing-nodejs)
6. [Step 3: Cloning the repository](#step-3-cloning-the-repository)
7. [Step 4: Installing dependencies](#step-4-installing-dependencies)
8. [Step 5: Setting up the database](#step-5-setting-up-the-database)
9. [Step 6: Configuring OAuth authentication](#step-6-configuring-oauth-authentication)
10. [Step 7: Configuring environment variables](#step-7-configuring-environment-variables)
11. [Step 8: Setting up the database](#step-8-setting-up-the-database)
12. [Step 9: Running the project](#step-9-running-the-project)
13. [Important concepts explained](#important-concepts-explained)
14. [Troubleshooting (solving problems)](#troubleshooting)

---

## Why does this guide exist?

This guide was created because we believe **anyone can learn programming**, as long as they have:
- ✅ Patience
- ✅ Willingness to learn
- ✅ A well-explained guide (which is this one!)

**You don't need to be an expert!** This guide assumes you're starting out and explains every concept from scratch.

---

## What you'll learn

By the end of this guide, you will:
- ✅ Understand what Node.js is and why we need it
- ✅ Know what dependencies are and how they work
- ✅ Understand what a database is and why we use PostgreSQL
- ✅ Understand OAuth authentication (login with X/Twitter)
- ✅ Know what environment variables are and why they're important
- ✅ Have the project running locally on your machine!

---

## Prerequisites

### What you NEED to have:

1. **A computer** (Windows, Mac, or Linux)
2. **Internet connection**
3. **A GitHub account** (free, we'll create one if you don't have it)
4. **An X (Twitter) account** (for authentication)
5. **Patience and willingness to learn!** 😊

### What you DON'T need to have:

- ❌ Advanced programming knowledge
- ❌ Previous experience with Node.js
- ❌ Have run projects before
- ❌ Know what a database is

**You'll learn all of this here!**

---

## Step 1: Understanding what we'll install

Before we start, let's understand **what** we'll install and **why**. This will help you understand what's happening in each step.

### Node.js - What is it and why do we need it?

**What is it?**
Node.js is a "runtime environment" for JavaScript. Think of it as an "engine" that allows running JavaScript outside the browser (on your computer).

**Why do we need it?**
- Our project is made in JavaScript/TypeScript
- We need something to "execute" this code
- Node.js does this for us

**Simple analogy:**
If JavaScript is the "fuel", Node.js is the "car engine". Without the engine, the fuel doesn't work!

### npm - What is it and why do we need it?

**What is it?**
npm means "Node Package Manager". It's a tool that comes with Node.js.

**Why do we need it?**
- Our project uses "libraries" (code made by other people)
- npm downloads and installs these libraries for us
- It's like an "app store" for code

**Simple analogy:**
If Node.js is the "engine", npm is the "mechanic" that installs the "parts" (libraries) the engine needs.

### Git - What is it and why do we need it?

**What is it?**
Git is a version control system. It allows downloading code from repositories (like GitHub).

**Why do we need it?**
- The project code is on GitHub
- We need to "download" this code to our machine
- Git does this for us

**Simple analogy:**
Git is like a specialized "download manager" for code. It downloads the entire project for you to work on.

---

## Step 2: Installing Node.js

### Why install Node.js first?

Because it's the foundation of everything! Without it, nothing works. It's like trying to drive without having a car.

### How to install (Windows)

1. **Visit the official website:**
   - Go to: https://nodejs.org/
   - You'll see two buttons: "LTS" and "Current"
   - **Click on "LTS"** (Long Term Support = more stable)

2. **Download the installer:**
   - The file will be something like: `node-v20.x.x-x64.msi`
   - Double-click it to install

3. **Follow the installation wizard:**
   - Click "Next" on all screens
   - **IMPORTANT:** Keep checked the option "Automatically install the necessary tools"
   - Click "Install"
   - Wait for installation to finish

4. **Verify it worked:**
   - Open "Command Prompt" (cmd) or PowerShell
   - Type: `node --version`
   - You should see something like: `v20.x.x`
   - Type: `npm --version`
   - You should see something like: `10.x.x`

   **If you see the numbers, it's working! 🎉**

### How to install (Mac)

1. **Option A - Using the official website (recommended):**
   - Go to: https://nodejs.org/
   - Click on "LTS"
   - Download the `.pkg` file
   - Open the file and follow the wizard

2. **Option B - Using Homebrew (if you already have it):**
   ```bash
   brew install node
   ```

3. **Verify it worked:**
   - Open Terminal
   - Type: `node --version`
   - Type: `npm --version`

### How to install (Linux)

1. **Using package manager (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Verify it worked:**
   ```bash
   node --version
   npm --version
   ```

### What did we just do?

We installed Node.js and npm. Now your computer can:
- ✅ Execute JavaScript code
- ✅ Install libraries using npm

---

## Step 3: Cloning the repository

### What is "cloning"?

"Cloning" means making a **complete copy** of the project from GitHub to your computer. It's like downloading, but in a special way that maintains connection with the original repository.

### Why do we need to clone?

Because the code is on GitHub (in the cloud) and we need it on our machine to work.

### How to clone (easy method - using GitHub Desktop)

1. **Install GitHub Desktop:**
   - Go to: https://desktop.github.com/
   - Download and install

2. **Log in to GitHub Desktop:**
   - Use your GitHub account

3. **Clone the repository:**
   - In GitHub Desktop, click "File" > "Clone Repository"
   - Paste the URL: `https://github.com/FalcaoHS/Compile-Chill`
   - Choose where to save (e.g., `C:\Users\YourName\Documents\Compile-Chill`)
   - Click "Clone"

### How to clone (advanced method - using Git in terminal)

1. **Open terminal/Command Prompt**

2. **Navigate to where you want to save the project:**
   ```bash
   cd Documents
   # or
   cd Desktop
   ```

3. **Clone the repository:**
   ```bash
   git clone https://github.com/FalcaoHS/Compile-Chill.git
   ```

4. **Enter the project folder:**
   ```bash
   cd Compile-Chill
   ```

### What did we just do?

We downloaded all the project code to our machine. Now we have:
- ✅ All project files
- ✅ The folder structure
- ✅ Complete source code

---

## Step 4: Installing dependencies

### What are "dependencies"?

Dependencies are **libraries** (code made by other people) that our project needs to work. It's like puzzle pieces - each one has a specific function.

### Examples of our project's dependencies:

- **Next.js**: Framework for creating web applications
- **React**: Library for creating interfaces
- **Prisma**: Tool for working with databases
- **NextAuth**: Authentication system
- And many others!

### Why do we need to install them?

Because these libraries don't come with the project code. They are downloaded separately when you install.

### How to install:

1. **Open terminal/Command Prompt**

2. **Navigate to the project folder:**
   ```bash
   cd Compile-Chill
   # or the path where you cloned
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

   **What does this command do?**
   - Reads the `package.json` file (which lists all dependencies)
   - Downloads each library from the internet
   - Installs in the `node_modules` folder
   - May take a few minutes (this is normal!)

4. **Wait for installation to finish:**
   - You'll see many lines of text
   - At the end, you should see something like: "added 500 packages"

### What did we just do?

We installed all the libraries the project needs. Now we have:
- ✅ Next.js installed
- ✅ React installed
- ✅ Prisma installed
- ✅ All other dependencies

**Estimated time:** 2-5 minutes (depends on your internet)

---

## Step 5: Setting up the database

### What is a database?

A database is like a **giant spreadsheet** where we store information. In our case, we'll store:
- User data
- Game scores
- Match history

### Why do we need a database?

Because we need to **store information** that persists even after the server shuts down. Without a database, every time you close the project, you'd lose all data!

### What is PostgreSQL?

PostgreSQL is a **specific type** of database. It's free, reliable, and widely used. Think of it as a super organized "file cabinet".

### Options for setting up the database:

We have 3 options. Let's explain each one:

#### Option A: Neon (Recommended for beginners) ⭐

**What is Neon?**
Neon is a service that offers PostgreSQL "in the cloud" (online). It's free and very easy to use.

**Why is it recommended?**
- ✅ No need to install anything on your computer
- ✅ Works immediately
- ✅ Free to start
- ✅ Easy visual interface

**How to set it up:**

1. **Visit the website:**
   - Go to: https://neon.tech/
   - Click "Sign Up"

2. **Create an account:**
   - You can use your GitHub account (easier!)
   - Or create account with email

3. **Create a new project:**
   - Click "New Project"
   - Choose a name (e.g., "compile-chill-dev")
   - Choose the region closest to you
   - Click "Create Project"

4. **Copy the connection string:**
   - On the project screen, you'll see "Connection string"
   - Click "Copy" next to the connection string
   - It will be something like: `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`
   - **SAVE THIS!** We'll use it later

**What did we just do?**
We created an online database that's ready to use. It's like renting cloud storage space!

#### Option B: Supabase

**What is Supabase?**
Similar to Neon, but with more features. Also free and easy.

**How to set it up:**

1. Visit: https://supabase.com/
2. Create an account
3. Create a new project
4. Go to Settings > Database > Connection string
5. Copy the connection string

#### Option C: Local PostgreSQL (Advanced)

**What is it?**
Installing PostgreSQL directly on your computer.

**Why not recommended for beginners?**
- More complex to set up
- Need to install additional software
- More chance of errors

**If you want to try anyway:**
1. Download PostgreSQL: https://www.postgresql.org/download/
2. Install following the wizard
3. Create a database called `compileandchill`
4. Note username, password, and port

---

## Step 6: Configuring OAuth authentication

### What is OAuth?

OAuth is a system that allows **logging in using other services' accounts**. In our case, we'll use X (Twitter) for login.

**Why use OAuth?**
- ✅ User doesn't need to create a new account
- ✅ More secure (X handles security)
- ✅ Faster (one click and done)

### What are we going to do?

We'll create an "application" on X that allows our site to log in with X accounts.

### Detailed step by step:

#### 1. Access Twitter Developer Portal

1. **Visit:**
   - Go to: https://developer.twitter.com/en/portal/dashboard
   - Log in with your X (Twitter) account

2. **What is this portal?**
   - It's a dashboard where developers create "apps" (applications)
   - Our "app" will be Compile & Chill
   - X will give us "credentials" (keys) to log in

#### 2. Create a project (if you don't have one)

1. **Click "Create Project"**
2. **Fill in:**
   - **Project name:** Compile & Chill (or any name)
   - **Use case:** Choose "Making a bot" or "Exploring the API"
   - **Description:** Gaming portal for developers
3. **Click "Next"**
4. **Accept the terms**
5. **Click "Create Project"**

#### 3. Create an App within the project

1. **Within the project, click "Add App"**
2. **Fill in:**
   - **App name:** compile-chill-dev (or any name)
   - **Description:** Development app for Compile & Chill
3. **Click "Create App"**

#### 4. Configure OAuth 2.0 (VERY IMPORTANT!)

**Why is this step important?**
Without configuring OAuth 2.0, we won't have the correct credentials to make login work.

1. **On the App page, click the "Settings" tab** (next to "Keys and tokens")

2. **Look for "User authentication settings"**
   - May be written as "OAuth 2.0 Settings"
   - Click "Set up" or "Edit"

3. **Configure:**
   - **Type of App:** Select "Web App, Automated App or Bot"
   - **App permissions:** Leave "Read" selected
   - **Callback URI / Redirect URL:** `http://localhost:3000/api/auth/callback/twitter`
     - ⚠️ **IMPORTANT:** Copy exactly this, no spaces!
   - **Website URL:** `http://localhost:3000`
     - If it doesn't accept, try `http://127.0.0.1:3000`
     - Or leave blank if optional

4. **Click "Save"**
   - ⚠️ **VERY IMPORTANT:** Save! Without saving, credentials won't appear!

#### 5. Get OAuth 2.0 credentials

**Why do we need these credentials?**
They are like "keys" that allow our site to communicate with X for login.

1. **Go back to the "Keys and tokens" tab**

2. **Look for the "OAuth 2.0 Client ID and Client Secret" section**
   - ⚠️ **ATTENTION:** Don't use "API Key" or "Bearer Token"!
   - You need specifically "OAuth 2.0 Client ID" and "OAuth 2.0 Client Secret"

3. **Copy the credentials:**
   - **Client ID:** Will be something like `abc123xyz...`
   - **Client Secret:** Click "Reveal" to see, will be something like `def456uvw...`
   - **SAVE THESE CREDENTIALS!** We'll use them in the next step

**What did we just do?**
We created an "application" on X that allows our site to log in. It's like creating a "key" that allows our site to access basic information from the user's X account.

---

## Step 7: Configuring environment variables

### What are environment variables?

Environment variables are **secret settings** that the project needs, but shouldn't be shared publicly. It's like passwords and keys kept in a safe.

### Why do we use environment variables?

Because some information is **sensitive** (like database passwords) and shouldn't be in code that goes to GitHub. Environment variables stay only on your machine.

### What are we going to configure?

We'll create a `.env` file (dot env) with all the settings the project needs.

### Step by step:

1. **In the project folder, create a file called `.env`**
   - ⚠️ **IMPORTANT:** The name must be exactly `.env` (with the dot at the beginning!)
   - On Windows, it may be difficult to create a file starting with a dot
   - Solution: Use a text editor (VS Code, Notepad++) and save as `.env`

2. **Open the `.env` file and paste the following:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Paste here the connection string you copied from Neon/Supabase
# Example: postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
DATABASE_URL="paste-your-neon-connection-string-here"

# ============================================
# NEXTAUTH CONFIGURATION (Authentication System)
# ============================================
# URL where the project will run (local development)
NEXTAUTH_URL="http://localhost:3000"

# Secret key for encrypting sessions
# Generate one using: openssl rand -base64 32
# Or use: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="paste-generated-secret-here"

# ============================================
# X (TWITTER) OAuth CREDENTIALS
# ============================================
# Paste here the OAuth 2.0 credentials you obtained in step 6
X_CLIENT_ID="paste-your-twitter-client-id-here"
X_CLIENT_SECRET="paste-your-twitter-client-secret-here"

# ============================================
# UPSTASH REDIS (Optional for development)
# ============================================
# Rate limiting - prevents system abuse
# If you don't want to configure now, leave empty
# System will work, but without rate limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

3. **Fill in each variable:**

   **a) DATABASE_URL:**
   - Paste the connection string you copied from Neon
   - Should be in quotes: `DATABASE_URL="postgresql://..."`

   **b) NEXTAUTH_SECRET:**
   - Generate a secret key:
     - **Windows (PowerShell):**
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
       ```
     - **Mac/Linux:**
       ```bash
       openssl rand -base64 32
       ```
     - **Online (if you don't have openssl):**
       - Visit: https://generate-secret.vercel.app/32
       - Copy the generated string
   - Paste in `.env` in quotes

   **c) X_CLIENT_ID and X_CLIENT_SECRET:**
   - Paste the credentials you obtained in step 6
   - Each in quotes

4. **Save the file**

### What does each variable do? (Detailed explanation)

**DATABASE_URL:**
- It's the "address" of the database
- Contains user, password, server, and database name
- Prisma uses this to connect to the database

**NEXTAUTH_URL:**
- It's the URL where the project runs
- In development: `http://localhost:3000`
- In production: would be `https://your-domain.com`

**NEXTAUTH_SECRET:**
- It's a secret key for encrypting user sessions
- Like a "master password" that protects logins
- Must be unique and secure (that's why we generate randomly)

**X_CLIENT_ID and X_CLIENT_SECRET:**
- They are the "credentials" X gave us
- Allow our site to communicate with X
- Like a "username and password" to access X's API

**UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN:**
- They are for rate limiting (limiting requests)
- Prevent someone from abusing the system
- Optional for development

### ⚠️ IMPORTANT: Security

- ❌ **NEVER** commit the `.env` file to GitHub!
- ✅ The `.gitignore` file is already configured to ignore `.env`
- ✅ Keep your credentials secure
- ✅ Use different credentials for development and production

---

## Step 8: Setting up the database

### What are we going to do?

We'll create the **tables** in the database. Tables are like "spreadsheets" where we store organized data.

### Why do we need to do this?

Because the database starts empty. We need to create the structure (tables) before we can store data.

### What are "migrations"?

Migrations are "scripts" that create or modify the database structure. It's like a "construction project" that says where to put each thing.

### Step by step:

1. **Open terminal in the project folder**

2. **Run the migration command:**
   ```bash
   npx prisma migrate dev
   ```

   **What does this command do?**
   - Reads the `prisma/schema.prisma` file (which defines the structure)
   - Creates tables in the database
   - Applies indexes (for fast searches)
   - Creates relationships between tables
   - Generates Prisma Client automatically

3. **When asked for migration name:**
   - Type something like: `init` or `initial_setup`
   - Press Enter

4. **Wait for completion:**
   - You'll see messages like "Creating migration..."
   - At the end, you should see "Migration applied successfully"

### What was created?

Prisma created these tables in the database:

- **users**: Stores user data (name, avatar, etc.)
- **accounts**: Stores OAuth authentication information
- **sessions**: Stores logged-in user sessions
- **scores**: Stores game scores
- **score_validation_fails**: Stores blocked cheating attempts

### If you get an error:

**Error: "Can't reach database server"**
- Check if `DATABASE_URL` in `.env` is correct
- Check if you copied the complete connection string
- Test the connection in Neon's panel

**Error: "P1001: Can't reach database server"**
- The database may be paused (Neon pauses after inactivity)
- Access Neon's panel and "resume" the project
- Try again

**Error: "Migration failed"**
- Check if there's no other pending migration
- Try: `npx prisma migrate reset` (careful: deletes data!)
- Or: `npx prisma db push` (simpler alternative)

### Generate Prisma Client (if needed):

If Prisma Client wasn't generated automatically:

```bash
npx prisma generate
```

**What is Prisma Client?**
It's a "client" (tool) that allows our JavaScript code to talk to the database. It's like a "translator" between JavaScript and SQL.

---

## Step 9: Running the project

### The moment has arrived! 🎉

Now we'll **run the project** and see everything working!

### Step by step:

1. **Open terminal in the project folder**

2. **Run the development command:**
   ```bash
   npm run dev
   ```

   **What does this command do?**
   - Starts the development server
   - Compiles TypeScript code to JavaScript
   - "Listens" for file changes
   - When you save a file, reloads automatically

3. **Wait for compilation:**
   - You'll see many lines of text
   - Look for: "Ready" or "Local: http://localhost:3000"
   - When it appears, it's ready!

4. **Open the browser:**
   - Go to: http://localhost:3000
   - You should see the Compile & Chill home page!

### What should you see?

- ✅ Home page with game list
- ✅ Header with "Sign in with X" button
- ✅ Everything working!

### Testing login:

1. **Click "Sign in with X"**
2. **You'll be redirected to X**
3. **Authorize the application**
4. **You'll be redirected back**
5. **Should see your profile in the header!**

### If something doesn't work:

See the [Troubleshooting](#troubleshooting) section below!

---

## Important concepts explained

### What is Next.js?

**Next.js** is a framework (structure) for creating web applications with React. It facilitates:
- Routing (navigation between pages)
- Server-side rendering
- Automatic optimizations

**Analogy:** If React is the "engine", Next.js is the "complete car" with all parts already assembled.

### What is React?

**React** is a library for creating user interfaces. Allows creating reusable components.

**Analogy:** React is like "LEGO blocks" - you assemble small pieces to make something big.

### What is TypeScript?

**TypeScript** is JavaScript with "types". Helps find errors before running code.

**Analogy:** If JavaScript is writing by hand, TypeScript is using a spell checker.

### What is Prisma?

**Prisma** is a tool that makes working with databases easier. Translates JavaScript to SQL automatically.

**Analogy:** Prisma is like a "translator" that converts JavaScript into database commands.

### What is NextAuth?

**NextAuth** is an authentication system. Manages login, sessions, and security.

**Analogy:** NextAuth is like a "doorman" who checks if you can enter and gives you a "pass" (session).

### What are migrations?

**Migrations** are scripts that modify the database structure in a controlled and reversible way.

**Analogy:** Migrations are like "versions" of the database. Each migration adds or modifies something.

---

## Troubleshooting

### Error: "Cannot find module"

**Cause:** Dependencies not installed.

**Solution:**
```bash
npm install
```

### Error: "Port 3000 is already in use"

**Cause:** Another process is using port 3000.

**Solution:**
- Close other Next.js projects
- Or change port: `npm run dev -- -p 3001`

### Error: "DATABASE_URL is missing"

**Cause:** `.env` file doesn't exist or is incorrect.

**Solution:**
- Check if `.env` file exists in project root
- Check if `DATABASE_URL` is defined
- Restart server after creating/editing `.env`

### Error: "Invalid credentials" on login

**Cause:** Incorrect OAuth credentials or wrong Callback URL.

**Solution:**
1. Check if you're using OAuth 2.0 credentials (not API Key)
2. Check if Callback URL on Twitter is: `http://localhost:3000/api/auth/callback/twitter`
3. Restart server after changing `.env`

### Error: "Prisma Client not generated"

**Cause:** Prisma Client wasn't generated.

**Solution:**
```bash
npx prisma generate
```

### Error: "Migration failed"

**Cause:** Problem with connection or database structure.

**Solution:**
```bash
npx prisma db push
```
This applies the schema directly without creating a migration.

### Project doesn't load in browser

**Cause:** Server didn't start correctly.

**Solution:**
1. Stop the server (Ctrl+C)
2. Clear cache: `rm -rf .next` (Mac/Linux) or `rmdir /s .next` (Windows)
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Try again: `npm run dev`

### TypeScript compilation error

**Cause:** Type errors in code.

**Solution:**
```bash
npm run type-check
```
This shows all type errors. Fix them before running.

---

## 🎉 Congratulations!

If you made it here and the project is running, **you did it!** 🎊

### What you learned:

- ✅ How to install and use Node.js
- ✅ How to clone projects from GitHub
- ✅ How to install dependencies
- ✅ How to set up a database
- ✅ How to configure OAuth authentication
- ✅ How to use environment variables
- ✅ How to run a Next.js project

### Next steps:

1. **Explore the code:** Open files and see how it works
2. **Make changes:** Try modifying something and see the result
3. **Read documentation:** Each library has excellent docs
4. **Practice:** The more you practice, the more you learn!

### Remember:

- ❌ **Don't be afraid to make mistakes!** Errors are part of learning
- ✅ **Ask!** The community is here to help
- ✅ **Research!** Google and Stack Overflow are your friends
- ✅ **Practice!** Practice makes perfect

### Need help?

- Open an issue on GitHub
- Read official documentation
- Ask the community

**You can do it! Keep learning! 🚀**

---

*This guide was made with lots of care to help you get started. If you have improvement suggestions, please share!*

