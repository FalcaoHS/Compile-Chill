# 🚀 Drivers — Compile & Chill

This folder contains all automated drivers to manage the Compile & Chill project.

## 📁 Structure

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
└── README.md (this file)
```

## 🎯 Available Drivers

### 1. 🧼 Architecture Hygiene Driver

**Location:** `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`

**What it does:**
- Reviews entire folder and file structure
- Identifies files in wrong locations or with incorrect names
- Checks and fixes broken references
- Organizes modules according to recommended architecture
- Creates/updates technical documentation
- Standardizes names and conventions
- Validates everything is aligned

**When to use:**
- After implementing many features
- When structure is disorganized
- Before making large commits
- When there are files in wrong places

**Versions:**
- 🇧🇷 [Portuguese](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md)
- 🇺🇸 [English](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.en.md)

---

### 2. 📘 Commit & Push Driver

**Location:** `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`

**What it does:**
- Standardizes commit messages
- Creates appropriate branches
- Validates files before committing (especially `agent-os/`)
- Generates commit messages following pattern
- Suggests Pull Request creation
- Ensures commits follow conventions

**When to use:**
- Before making any commit
- To ensure commits are standardized
- To validate that `agent-os/` won't be committed
- To create appropriate branches

**Versions:**
- 🇧🇷 [Portuguese](COMMIT_AND_PUSH/COMMIT_AND_PUSH.md)
- 🇺🇸 [English](COMMIT_AND_PUSH/COMMIT_AND_PUSH.en.md)

---

### 3. 🎨 Theme Creation Driver

**Location:** `THEME_CREATION/THEME_CREATION_DRIVER.md`

**What it does:**
- Generates complete technical specification of theme
- Creates correct folder structure in `agent-os/specs/`
- Organizes all documentation files
- Updates system references
- Ensures everything is aligned and documented

**When to use:**
- When a contributor wants to create a new theme
- To standardize theme creation
- To ensure themes follow correct structure
- To automate theme creation process

**Versions:**
- 🇧🇷 [Portuguese](THEME_CREATION/THEME_CREATION_DRIVER.md)
- 🇺🇸 [English](THEME_CREATION/THEME_CREATION_DRIVER.en.md)

---

### 4. ⚙️ Environment Setup Driver

**Location:** `SETUP/INSTALL.md`

**What it does:**
- Validates prerequisites (Node.js, pnpm, Git)
- Installs dependencies automatically
- Generates `NEXTAUTH_SECRET` automatically
- Creates `.env` file with complete template
- Sets up database (Prisma migrations)
- Configures OAuth (X/Twitter)
- Configures Upstash Redis (optional)
- Validates build and TypeScript
- Executes everything automatically (minimum questions)

**When to use:**
- First time setting up the environment
- Reconfiguring environment after changes
- When you need quick and automated setup
- For new collaborators

**Versions:**
- 🇧🇷 [Portuguese](SETUP/INSTALL.md)
- 🇺🇸 [English](SETUP/INSTALL.en.md) (coming soon)

---

### 5. 🚀 Auto Deploy Driver

**Location:** `AUTO/AUTODEPLOY.md`

**What it does:**
- Automatically executes Architecture Hygiene Driver
- Automatically executes Commit & Push Driver
- Ensures code is organized before committing
- Generates complete report of changes
- Automates complete deployment preparation process

**When to use:**
- When you want to prepare complete code for deployment
- When you want to ensure organization + standardized commit
- To automate complete process
- Before deploying to production

**Versions:**
- 🇧🇷 [Portuguese](AUTO/AUTODEPLOY.md)
- 🇺🇸 [English](AUTO/AUTODEPLOY.en.md)

---

## 📖 How to Use the Drivers

### For AI Agents:

Drivers are markdown documents containing detailed instructions to execute specific tasks. To use a driver:

1. **Open the driver file** (e.g., `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`)
2. **Read ALL sections**, especially:
   - "MANDATORY RULES" (at the top)
   - "Instructions for AI Agent"
   - All process steps
3. **Follow the process step by step** as described
4. **Ask questions to the user** when necessary (the driver indicates when to ask)
5. **Validate each step** before proceeding
6. **Generate a final report** of changes made

### For Human Collaborators:

1. **Choose the appropriate driver** for your need
2. **Read the complete document** to understand what will be done
3. **Provide the driver to an AI agent** (like Cursor, ChatGPT, Claude, etc.)
4. **Answer the questions** the agent asks
5. **Review the final report** generated by the agent

### Example Usage with AI Agent:

```
You: "Execute the Architecture Hygiene driver"
Agent: [Reads ARCHITECTURE_HYGIENE_DRIVER.md file]
Agent: "I'll analyze the project structure. May I proceed?"
You: "Yes"
Agent: [Executes analysis, reorganizes files, generates report]
Agent: "Completed! Report: [list of changes]"
```

---

## 🔄 Recommended Flow

### To Prepare Code for Deployment:

1. **Use Auto Deploy Driver** (`AUTO/AUTODEPLOY.md`)
   - Executes everything automatically in correct sequence
   - Recommended for most cases
   - **How to use:** Provide the `AUTO/AUTODEPLOY.md` file to the agent and say "Execute this driver"

### To Only Organize Architecture:

1. **Use Architecture Hygiene Driver** (`ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`)
   - Only reorganization, no commit
   - **How to use:** Provide the `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md` file to the agent and say "Execute this driver"

### To Only Make Commit:

1. **Use Commit & Push Driver** (`COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`)
   - Only commit, no reorganization
   - **How to use:** Provide the `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md` file to the agent and say "Execute this driver"

### To Create a New Theme:

1. **Use Theme Creation Driver** (`THEME_CREATION/THEME_CREATION_DRIVER.md`)
   - Creates complete structure for new theme
   - **How to use:** Provide the `THEME_CREATION/THEME_CREATION_DRIVER.md` file to the agent and answer questions about the theme

### To Set Up Environment from Scratch:

1. **Use Environment Setup Driver** (`SETUP/INSTALL.md`)
   - Configures entire environment automatically
   - **How to use:** Drag the `SETUP/INSTALL.md` file to the prompt and press Enter! The agent will execute everything automatically (only asks for external credentials)

## ⚙️ Detailed Instructions by Driver

### 🧼 Architecture Hygiene Driver

**Step by step:**

1. Provide the `ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md` file to the agent
2. The agent will:
   - Analyze entire folder structure
   - Identify misplaced files
   - Check broken references
   - Reorganize as needed
   - Create/update documentation
   - Generate complete report
3. Review the report before approving changes

**Suggested command for agent:**
```
Execute the driver: docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md
```

---

### 📘 Commit & Push Driver

**Step by step:**

1. Provide the `COMMIT_AND_PUSH/COMMIT_AND_PUSH.md` file to the agent
2. The agent will ask questions:
   - "Which files were modified?"
   - "Is this a large change?"
   - "What type of change? (feat, fix, docs, etc.)"
3. The agent will:
   - Validate that `agent-os/` won't be committed
   - Create branch if necessary
   - Generate standardized commit message
   - Suggest Pull Request creation
4. Review the commit message before approving

**Suggested command for agent:**
```
Execute the driver: docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md
```

---

### 🎨 Theme Creation Driver

**Step by step:**

1. Provide the `THEME_CREATION/THEME_CREATION_DRIVER.md` file to the agent
2. The agent will ask questions about:
   - Theme name
   - Color palette
   - Orb variations
   - Decorative objects
   - Special effects
   - Easter eggs
   - Creator credits
3. The agent will:
   - Create structure in `agent-os/specs/YYYY-MM-DD-[theme-id]/`
   - Generate all necessary documentation
   - Update system references
   - Validate everything is correct
4. Review the generated specification

**Suggested command for agent:**
```
Execute the driver: docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md
```

---

### ⚙️ Environment Setup Driver

**Step by step:**

1. Provide the `SETUP/INSTALL.md` file to the agent (or drag the file to the prompt)
2. The agent will automatically:
   - Validate prerequisites (Node.js, pnpm, Git)
   - Install dependencies
   - Generate `NEXTAUTH_SECRET` automatically
   - Create `.env` file with complete template
   - Run Prisma migrations
   - Validate build and TypeScript
3. The agent will only ask for:
   - Database connection string (if not exists)
   - OAuth credentials (X/Twitter) (if not exists)
   - Upstash Redis credentials (optional)
4. Review the final report

**Suggested command for agent:**
```
Execute the driver: docs/DRIVERS/SETUP/INSTALL.md
```

**Or simply:** Drag the `INSTALL.md` file to the prompt and press Enter!

---

### 🚀 Auto Deploy Driver

**Step by step:**

1. Provide the `AUTO/AUTODEPLOY.md` file to the agent
2. The agent will automatically execute:
   - **Step 1:** Architecture Hygiene Driver
   - **Step 2:** Commit & Push Driver
3. The agent will:
   - Generate report for each step
   - Validate all changes
   - Create consolidated final report
4. Review the final report before approving

**Suggested command for agent:**
```
Execute the driver: docs/DRIVERS/AUTO/AUTODEPLOY.md
```

---

## ⚠️ Important Rules

### What should NEVER be committed:

- ❌ `agent-os/` folder (internal Agent OS configurations)
- ❌ `.env` and `.env.*` files (credentials)
- ❌ Temporary files and logs
- ❌ Internal Agent OS drivers

### The agent should always:

- ✅ Ask questions before executing
- ✅ Validate each step before proceeding
- ✅ Generate report of changes
- ✅ Follow all mandatory rules

## 📚 Other Drivers

**Note:** The Theme Creation Driver is not executed by Auto Deploy, only when needed to create new themes.

## 🔗 Useful Links

- [Architecture Hygiene Driver (PT)](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md)
- [Architecture Hygiene Driver (EN)](ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.en.md)
- [Commit & Push Driver (PT)](COMMIT_AND_PUSH/COMMIT_AND_PUSH.md)
- [Commit & Push Driver (EN)](COMMIT_AND_PUSH/COMMIT_AND_PUSH.en.md)
- [Auto Deploy Driver (PT)](AUTO/AUTODEPLOY.md)
- [Auto Deploy Driver (EN)](AUTO/AUTODEPLOY.en.md)
- [Theme Creation Driver (PT)](THEME_CREATION/THEME_CREATION_DRIVER.md)
- [Theme Creation Driver (EN)](THEME_CREATION/THEME_CREATION_DRIVER.en.md)
- [Environment Setup Driver (PT)](SETUP/INSTALL.md)
- [Environment Setup Driver (EN)](SETUP/INSTALL.en.md) (coming soon)

## 📝 Notes

- All drivers follow the same instruction pattern
- All have PT and EN versions
- All have explicit mandatory rules
- All ask questions before executing
- All generate reports of changes

