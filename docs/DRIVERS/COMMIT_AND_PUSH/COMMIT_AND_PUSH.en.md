📘 Commit & Contribution Driver — Compile & Chill

Author: Hudson "Shuk" Falcão
Date: November 19, 2025
Version: 2.0
Purpose: Define a clear, simple, elegant, and sustainable standard for commits, branches, review, tests, and publishing, allowing contributors to maintain consistency and quality in the repository.

🤖 IMPORTANT: Instructions for AI Agent

**⚠️ MANDATORY RULES - AGENT MUST FOLLOW EXACTLY:**

1. **The agent MUST ask questions before committing!**
   - NEVER commit without asking first
   - NEVER assume what the user wants
   - ALWAYS ask before executing any Git command

2. **The agent MUST check `agent-os/` before each commit!**
   - ALWAYS run `git status` before committing
   - If `agent-os/` appears, REMOVE immediately: `git reset HEAD agent-os/`
   - NEVER commit if `agent-os/` is in the list

3. **The agent MUST create separate branch for large changes!**
   - More than 5 files = MANDATORY to create branch
   - New features = MANDATORY to create branch
   - Refactorings = MANDATORY to create branch
   - NEVER suggest direct commit to main for large changes

4. **The agent MUST follow the question flow below!**
   - Don't skip any step
   - Don't assume answers
   - Always wait for user confirmation

**Expected flow (MANDATORY to follow):**
1. Agent asks what changed
2. Agent asks commit type
3. Agent asks about branch
4. Agent asks if it's a large change
5. Agent validates what will be committed (checks `agent-os/`)
6. Agent generates commands
7. Agent asks for final confirmation

**The agent should NEVER:**
- ❌ Commit without asking first
- ❌ Commit `agent-os/` (even if user asks)
- ❌ Commit directly to main for large changes
- ❌ Skip validation steps
- ❌ Assume what the user wants

🚫 CRITICAL RULE: What Should NEVER be Committed

**IMPORTANT - Read carefully:**

❌ **NEVER commit the `agent-os/` folder**
- This folder contains internal Agent OS system configurations
- It is not part of the Compile & Chill project code
- Must be ignored by Git

❌ **NEVER commit driver files that are not from the system**
- Only drivers in `docs/DRIVERS/` related to the system should be committed
- Internal Agent OS drivers should not be committed

❌ **NEVER commit sensitive files:**
- `.env` and `.env.*` (already in .gitignore)
- API credentials and keys
- Temporary files
- Logs and cache

**Before each commit, the agent MUST check:**
```bash
git status
```

And ensure that NO files from the `agent-os/` folder are in the list of files to be committed.

If there are files from `agent-os/` in the list, the agent MUST:
1. Alert the user
2. Remove these files from staging: `git reset HEAD agent-os/`
3. Verify that `agent-os/` is in `.gitignore`
4. Only then proceed with the commit

🎯 1. Commit Naming Pattern

Using a model inspired by Conventional Commits, but adapted to the project style:

```
<type>: <short and objective description>
```

**Examples:**
```
feat: add 'star-wars' theme with 10 orb variations
fix: fix crash in DevOrbsCanvas when loading on mobile
perf: reduce particles in FPS Guardian to 35 FPS
style: adjust scoreboard alignment in neon theme
refactor: separate physics from main canvas
docs: add theme creation guide
test: add tests for score anti-cheat
chore: update internal dependencies
```

**Available types:**

- `feat:` - new feature
- `fix:` - bug fix
- `perf:` - optimization
- `style:` - visual and CSS adjustments
- `refactor:` - restructuring without behavior change
- `docs:` - documentation
- `test:` - unit tests
- `chore:` - internal routines
- `build:` - build/configuration adjustments

**Rules:**
- → Always write in simple Portuguese, short sentences
- → Use lowercase for type
- → No emojis in prefix
- → Maximum 72 characters in first line

🌱 2. Commit Description Pattern

After the main line, use commit body with:

- What was done
- Why it was done
- Impact on system
- Any special instructions

**Example:**

```
feat: add easter egg 'The Force Reveal'

- Introduces rare 0.4% event with ship appearing on canvas
- Activates only once per user
- Connects with particles system + FPS guardian
- Reorganizes Star Wars theme files
```

**Format:**
- Blank line after title
- Each item on a line starting with `-`
- Maximum 100 characters per line
- Use simple Portuguese

🌿 3. Branch Naming Pattern

Always create a branch with this structure:

```
type/area-short-description
```

**Examples:**
```
feat/theme-star-wars
feat/new-game-packet-switch
fix/canvas-mobile-lite
perf/particle-optimizer
refactor/split-devorbs-modules
docs/create-theme-guide
```

**Rules:**
- No accents
- No spaces
- All lowercase
- Always contextualized
- Maximum 50 characters
- Use hyphen to separate words

### 📦 When to Use Separate Branch (MANDATORY)

**ALWAYS create separate branch for:**

✅ **Large changes** (more than 5 files modified)
✅ **New features** (any `feat:`)
✅ **Refactorings** (any `refactor:`)
✅ **Changes affecting multiple modules**
✅ **New themes** (always in separate branch)
✅ **New games** (always in separate branch)
✅ **Architecture changes** (canvas, performance, auth)
✅ **Changes that might break existing functionality**

**NEVER commit directly to main for:**
- ❌ New features
- ❌ Refactorings
- ❌ Changes in multiple files
- ❌ Anything that needs review

**Can commit directly to main ONLY for:**
- ✅ Typo fixes in documentation
- ✅ Formatting adjustments (if very small)
- ✅ Minor dependency updates
- ⚠️ **Always with explicit user confirmation**

### 🔀 Flow for Large Changes

**For large changes, follow this flow:**

1. **Create specific branch:**
   ```bash
   git checkout -b feat/theme-star-wars-complete
   ```

2. **Make incremental commits in branch:**
   ```bash
   # Commit 1: Base structure
   git commit -m "feat: add star-wars theme base structure"
   
   # Commit 2: Orb variations
   git commit -m "feat: implement 10 orb variations for star-wars theme"
   
   # Commit 3: Decorative objects
   git commit -m "feat: add decorative objects for star-wars theme"
   ```

3. **Test completely in branch:**
   - Run all tests
   - Test manually
   - Check on different devices

4. **Push branch:**
   ```bash
   git push origin feat/theme-star-wars-complete
   ```

5. **Open Pull Request:**
   - Create PR on GitHub
   - Fill complete description
   - Wait for review and approval

6. **Merge only after approval:**
   - Never merge directly
   - Always via Pull Request
   - Wait for CI/CD to pass

💡 4. Checklist Before Commit (pre-commit)

**Before committing, always run:**

✔ **1. Check TypeScript errors**
```bash
pnpm ts:check
```

✔ **2. Check build**
```bash
pnpm build
```

✔ **3. ESLint**
```bash
pnpm lint
```

✔ **4. Prettier formatting**
```bash
pnpm format
```

✔ **5. Check files to be committed**
```bash
git status
```
- Verify that `agent-os/` is NOT in the list
- Verify that `.env` is NOT in the list
- Verify that only relevant files are being committed

✔ **6. Manually test critical pages:**
- Home
- DevOrbsCanvas
- Login (X OAuth)
- Terminal 2048
- Any altered game

✔ **7. Check mobile-lite (if canvas impact)**
- DevTools → Toggle Device Mode → iPhone SE
- Test in mobile-lite mode

🤖 5. DRIVER for Cursor Automation

**This is the bot prompt that will help whenever the dev types "commit":**

---

### 🔧 Cursor Commit Assistant — DRIVER

**⚠️ ATTENTION: This is a mandatory driver. Follow EXACTLY all steps below.**

When the user says "commit" or asks to commit, you MUST execute the following flow:

**DO NOT SKIP ANY STEP. DO NOT ASSUME ANSWERS. ALWAYS ASK.**

#### **STEP 1: Ask Questions (MANDATORY)**

**Question 1:** "What exactly changed?"
- Wait for user response
- Understand scope of changes

**Question 2:** "What is the commit type? (feat, fix, perf, refactor, style, docs, test, chore, build)"
- If user doesn't know, suggest based on changes
- Explain chosen type

**Question 3:** "What is the branch name? (or can I suggest based on type?)"
- If user doesn't have branch, suggest: `type/short-description`
- Validate branch name (no accents, spaces, all lowercase)

**Question 4:** "Do you want to create a new branch or use the current one?"
- Check current branch: `git branch --show-current`
- If it doesn't exist, create new one

**Question 5:** "Do you want me to check files before committing?"
- Always check `git status`
- **CRITICAL:** Check if `agent-os/` is in the list
- If it is, alert and remove before proceeding

#### **STEP 2: Generate Automatically**

After questions, generate:

1. **Complete commit message** (following this document's pattern)
2. **Standardized branch name** (if necessary)
3. **List of pre-commit steps** that should be run
4. **Complete Git commands** for terminal

#### **STEP 3: Final Validation**

**Question 6:** "Do you want me to generate complete commands for the terminal?"
- If yes, generate complete commands
- If no, just show commit message

**Question 7:** "Is this a large change? (more than 5 files, new feature, refactoring)"
- If YES: **MANDATORY to create separate branch**
- If NO: Ask if user wants to commit directly to main
- ⚠️ **ONLY allow direct commit to main if:**
  - Very small change (1-2 files)
  - Only documentation or typos
  - User explicitly confirms
- ⚠️ **NEVER suggest direct commit to main for:**
  - New features
  - Refactorings
  - Changes in multiple files
  - Anything that needs review

**Question 8:** "Do you want to commit and push directly to main?"
- ⚠️ **ONLY allow if user explicitly confirms**
- ⚠️ **NEVER suggest direct commit to main without confirmation**
- Always suggest creating branch and opening PR

**Question 9:** "Do you want to open a Pull Request now?"
- If yes, provide GitHub link to create PR
- If no, just push branch
- **For large changes, always suggest creating PR**

#### **STEP 4: Execution (if authorized)**

If user authorizes, execute:

```bash
# Check status
git status

# Check that agent-os/ is not in the list
# If it is, remove: git reset HEAD agent-os/

# Create branch (if necessary)
git checkout -b <branch-name>

# Add files (except agent-os/)
git add .

# Check again before committing
git status

# Commit
git commit -m "<commit message>"

# Push
git push origin <branch-name>
```

---

🛠 6. Optional Hooks to Automate (Husky)

You can enable Husky hooks to automate validations:

**Pre-commit:**
```bash
pnpm lint && pnpm format && pnpm ts:check
```

**Pre-push:**
```bash
pnpm build
```

**File `.husky/pre-commit`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm lint
pnpm format
pnpm ts:check
```

**File `.husky/pre-push`:**
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm build
```

**Note:** Adding `agent-os/` check in pre-commit would be ideal, but can also be done manually.

🧷 7. Recommended Flow for Any Contributor

**Complete step by step:**

1. **Fetch main:**
   ```bash
   git pull origin main
   ```

2. **Create branch:**
   ```bash
   git checkout -b feat/theme-star-wars
   ```

3. **Code**
   - Make necessary changes
   - Follow project standards

4. **Test**
   - Run tests
   - Test manually
   - Check on different devices

5. **Pre-commit**
   - Run complete checklist
   - Verify that `agent-os/` will not be committed

6. **Commit**
   - Use standardized message
   - Follow this document's format

7. **Push**
   ```bash
   git push origin feat/theme-star-wars
   ```

8. **Open PR**
   - Create Pull Request on GitHub
   - Fill PR description
   - Wait for review

⭐ 8. Benefits of this Driver

- ✅ Uniform contributors
- ✅ Clean and organized PRs
- ✅ Clear and well-documented issues
- ✅ No commit chaos
- ✅ No random branches
- ✅ Fewer bugs in production
- ✅ Reliable Vercel deployment
- ✅ Clean and useful Git history
- ✅ Facilitates code review

🚀 9. Final Validation Checklist

Before finalizing commit, verify:

- [ ] Commit message follows pattern
- [ ] Branch named correctly
- [ ] TypeScript without errors (`pnpm ts:check`)
- [ ] Build works (`pnpm build`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] `agent-os/` is NOT in files to be committed
- [ ] `.env` is NOT in files to be committed
- [ ] Only relevant files are being committed
- [ ] Manual tests performed
- [ ] Mobile-lite tested (if applicable)

📋 10. Conclusion

This driver:

- ✅ Standardizes commits and branches
- ✅ Organizes workflow
- ✅ Facilitates contribution
- ✅ Helps the team
- ✅ Helps AI
- ✅ Avoids rework
- ✅ Avoids bugs introduced by haste
- ✅ Protects against accidental commits of sensitive files

**Remember:**
- The agent MUST ask questions before committing
- The agent MUST verify that `agent-os/` will not be committed
- The agent MUST validate everything before executing Git commands

**Location of this file:**
- `/docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.en.md`
- Link in main README

