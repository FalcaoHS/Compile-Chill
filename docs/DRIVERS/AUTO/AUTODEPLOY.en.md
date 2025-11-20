🚀 Auto Deploy Driver — Compile & Chill

Author: Hudson "Shuk" Falcão
Date: November 19, 2025
Version: 1.0
Purpose: Automatic driver that sequentially executes architecture hygiene and organized commit processes, ensuring code is always clean, organized, and ready for deployment.

🤖 IMPORTANT: Instructions for AI Agent

**⚠️ MANDATORY RULES - AGENT MUST FOLLOW EXACTLY:**

1. **The agent MUST execute drivers in correct sequence!**
   - FIRST: Architecture Hygiene Driver
   - SECOND: Commit & Push Driver
   - NEVER skip steps
   - NEVER reverse order

2. **The agent MUST ask questions before executing each step!**
   - NEVER execute without asking first
   - NEVER assume what the user wants
   - ALWAYS ask before executing any action

3. **The agent MUST validate each step before proceeding!**
   - ALWAYS validate that previous step was completed
   - ALWAYS check for errors before continuing
   - NEVER proceed if there are unresolved problems

4. **The agent MUST generate complete report at the end!**
   - List all changes made
   - Document decisions taken
   - Create validation checklist

**Expected flow (MANDATORY to follow):**
1. Agent asks if user wants to execute Auto Deploy
2. Agent executes Architecture Hygiene Driver (with questions)
3. Agent validates that hygiene was completed
4. Agent executes Commit & Push Driver (with questions)
5. Agent generates complete report of changes

**The agent should NEVER:**
- ❌ Execute without asking first
- ❌ Skip steps or reverse order
- ❌ Proceed without validating previous step
- ❌ Assume what the user wants
- ❌ Execute commits without following commit driver

🎯 How It Works

This driver automates the complete code preparation process for deployment:

1. **Architecture Hygiene** (`ARCHITECTURE_HYGIENE_DRIVER.md`)
   - Reorganizes files and folders
   - Fixes names and references
   - Updates documentation
   - Validates structure

2. **Organized Commit** (`COMMIT_AND_PUSH.md`)
   - Creates appropriate branch
   - Generates standardized commit message
   - Validates files (especially `agent-os/`)
   - Pushes and suggests PR

**Benefits:**
- ✅ Code always organized before committing
- ✅ Commits always standardized
- ✅ Complete process automated
- ✅ Fewer errors and rework

📋 Complete Auto Deploy Flow

### STEP 1: Initialization

**Question 1:** "Do you want to execute complete Auto Deploy? (Hygiene + Commit)"
- If YES: Proceed
- If NO: Ask which specific step user wants

**Question 2:** "Are there uncommitted changes at the moment?"
- Check: `git status`
- If there are, inform user
- Ask if user wants to include in commit

### STEP 2: Architecture Hygiene Driver

**Execute driver:** `docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`

**The agent MUST:**
1. Read and follow ALL instructions from Architecture Hygiene Driver
2. Ask ALL necessary questions
3. Execute complete structure analysis
4. Reorganize files (if necessary and authorized)
5. Update documentation
6. Validate everything is aligned
7. Generate hygiene report

**After completing, validate:**
- [ ] Folder structure is correct
- [ ] Files are in correct places
- [ ] File names are standardized
- [ ] References are correct
- [ ] Documentation is updated

**Question 3:** "Was hygiene completed successfully? Do you want to proceed to commit?"
- If there are problems, resolve before proceeding
- If everything OK, proceed to next step

### STEP 3: Commit & Push Driver

**Execute driver:** `docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`

**The agent MUST:**
1. Read and follow ALL instructions from Commit & Push Driver
2. Ask ALL necessary questions (9 mandatory questions)
3. Check `agent-os/` before committing
4. Create appropriate branch (if large change)
5. Generate standardized commit message
6. Validate files to be committed
7. Execute commit and push (if authorized)
8. Suggest PR creation

**After completing, validate:**
- [ ] Commit was successful
- [ ] Branch was created (if necessary)
- [ ] `agent-os/` was NOT committed
- [ ] Commit message follows pattern
- [ ] Push was performed

### STEP 4: Final Report

**The agent MUST generate complete report:**

```
📊 Auto Deploy Report

✅ Architecture Hygiene:
- Files moved: [list]
- Files renamed: [list]
- References updated: [list]
- Documentation created/updated: [list]

✅ Commit & Push:
- Branch created: [name]
- Files committed: [number]
- Commit message: [message]
- Push performed: [yes/no]
- PR suggested: [link]

⚠️ Pending Actions:
- [list of actions that need to be done manually]
```

🚫 What Should NEVER be Done

**The agent should NEVER:**
- ❌ Execute commits without following commit driver
- ❌ Commit `agent-os/` (even if user asks)
- ❌ Skip validation steps
- ❌ Proceed without resolving previous step problems
- ❌ Execute without asking user
- ❌ Assume what the user wants

📁 File Structure

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
      AUTODEPLOY.md (this file)
      AUTODEPLOY.en.md
```

🔗 References

- Architecture Hygiene Driver: `docs/DRIVERS/ARCHYGIENE/ARCHITECTURE_HYGIENE_DRIVER.md`
- Commit & Push Driver: `docs/DRIVERS/COMMIT_AND_PUSH/COMMIT_AND_PUSH.md`
- Theme Creation Driver: `docs/DRIVERS/THEME_CREATION/THEME_CREATION_DRIVER.md` (not executed in this driver)

📋 Final Validation Checklist

Before finalizing Auto Deploy, verify:

**Hygiene:**
- [ ] Folder structure is correct
- [ ] Files are organized
- [ ] References are updated
- [ ] Documentation is complete

**Commit:**
- [ ] Branch was created (if necessary)
- [ ] Commit message follows pattern
- [ ] `agent-os/` was NOT committed
- [ ] `.env` was NOT committed
- [ ] Only relevant files were committed
- [ ] Push was successful

**General:**
- [ ] All steps were completed
- [ ] No errors were ignored
- [ ] Report was generated
- [ ] User was informed of all changes

🚀 Conclusion

This driver automates the complete code preparation process for deployment, ensuring:

- ✅ Code always organized
- ✅ Commits always standardized
- ✅ Complete process automated
- ✅ Fewer errors and rework
- ✅ Reliable deployment

**Remember:**
- The agent MUST execute drivers in correct sequence
- The agent MUST ask questions before each step
- The agent MUST validate each step before proceeding
- The agent MUST generate complete report at the end

**Location of this file:**
- `/docs/DRIVERS/AUTO/AUTODEPLOY.en.md`
- Link in main README

