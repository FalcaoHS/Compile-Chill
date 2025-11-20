📘 Official Theme Creation Guide — Compile & Chill

Author: Hudson "Shuk" Falcão
Date: November 19, 2025
Version: 2.0
Purpose: Create a simple, organized, and accessible standard for community contributors to create new visual themes for Compile & Chill — allowing each developer to leave their mark, with credits displayed within the site.

🎨 How it works

This document is a DRIVER to generate new themes using AI or manual creation.
Simply answer the questions below and provide this complete document to an AI agent.
The agent will:

✅ Generate the complete technical specification of the theme
✅ Create the correct folder structure in `agent-os/specs/`
✅ Organize all documentation files
✅ Update system references
✅ Ensure everything is aligned and documented

The answers will be used to generate:

❇️ Theme color palette
🎭 Orb variations
🏺 Decorative objects on the court
⚡ Special effects and particles
✨ Optional easter eggs
📝 Creator credits (name + GitHub/X)
📁 Complete file and folder structure

This format must be followed whenever creating a new theme.

🤖 IMPORTANT: Instructions for AI Agent

**⚠️ MANDATORY RULES - AGENT MUST FOLLOW EXACTLY:**

1. **The agent MUST ask questions before creating files!**
   - NEVER create files without asking first
   - NEVER assume what the user wants
   - ALWAYS ask before executing any action

2. **The agent MUST create folder structure correctly!**
   - ALWAYS create in `agent-os/specs/YYYY-MM-DD-[theme-id]/`
   - ALWAYS follow documented structure
   - NEVER create files in wrong location

3. **The agent MUST verify and organize existing files!**
   - ALWAYS check if there are files in wrong locations
   - ALWAYS fix file names with typos
   - ALWAYS remove empty folders
   - ALWAYS check for broken references

4. **The agent MUST follow complete flow!**
   - Don't skip any step
   - Don't assume answers
   - Always wait for user confirmation

**The agent should NEVER:**
- ❌ Create files without asking first
- ❌ Create incorrect folder structure
- ❌ Skip validation steps
- ❌ Assume what the user wants
- ❌ Create duplicate files or files in wrong locations

**Expected flow (MANDATORY to follow):**
1. Agent asks about theme (if doesn't have all information)
2. Agent creates folder structure
3. Agent verifies existing files
4. Agent organizes files if necessary
5. Agent creates/updates documentation
6. Agent validates everything is aligned
7. Agent generates report of changes

---

When processing this driver, the agent MUST:

1. **Create folder structure** in `agent-os/specs/YYYY-MM-DD-[theme-id]/`:
   ```
   agent-os/specs/YYYY-MM-DD-[theme-id]/
   ├── planning/
   │   ├── raw-idea.md (content provided by contributor)
   │   ├── requirements.md (generated from answers)
   │   ├── answers/ (if there are questions/answers)
   │   └── visuals/ (for visual assets, if any)
   ├── implementation/ (created during implementation)
   ├── spec.md (complete technical specification)
   └── tasks.md (task breakdown)
   ```

2. **Verify and organize existing files**:
   - Move files to correct folders if they're in the wrong place
   - Fix file names with typos
   - Remove empty folders
   - Check for broken references

3. **Update system documentation**:
   - Verify if `lib/themes.ts` is updated
   - Check if necessary tests exist
   - Ensure documentation is aligned

4. **Validate structure**:
   - All files must be in correct folders
   - File names must follow kebab-case pattern
   - References between documents must be correct

🧩 Required Information Checklist

(Must be included in issue/pull request or sent to AI)

👤 1. Theme Author

Your name (as it should appear on the site):

GitHub:

X/Twitter:

Theme motivation (1 sentence):

🎨 2. Theme Identity

Theme Name:

Suggested ID (kebab-case, e.g., "neo-forest", "galactic-force"):

Summary in 1 sentence (theme essence):
Example: "Neon cosmic energy mixed with digital glitch."

🌈 3. Base Palette (minimum 4 colors)

(Provide simple names + hex)

Primary color:

Secondary color:

Background color:

Accent (details/particles):

Additional colors (optional):
- Highlight:
- Border:
- Glow:
- Muted:

Suggestion: you can ask the LLM to generate the palette after describing the theme.

🪐 4. Orb Variations (1 to 10 variations)

(The orb contains the user's photo in the center — here you describe the "ring/ornament" around it)

For each variation describe:

Variation name (kebab-case, e.g., "sacred-usb", "golden-keycap"):

Short visual description:

Geometric style/shapes:

Special effects (glow, particles, pulse, etc. — optional):

Example: "Green circuit ring in radial form with small electrical impulses."

🏺 5. Theme Decorative Objects (1 to 5 objects)

For each object describe:

Name (kebab-case):

Visual representation (simple shapes; no IP):

Suggested location on court (e.g., bottom left corner):

Layer (background/midground/foreground):

Is it animated? (yes/no):

If animated, describe the animation:

🌬 6. Special Effects (optional)

(Can happen when the ball bounces, hits the basket, or hits the rim)

List ideas such as:

- Sparks
- Lightning
- Shock waves
- Glow
- Thematic particles
- Temporary filters

For each effect, specify:
- Trigger (when it happens):
- Visual description:
- Duration:

🪄 7. Optional Easter Egg

(Appears rarely, chance between 0.1% and 1%)

Describe:

The rare event:

What animation happens:

Approximate duration:

Activation chance (0.1% to 1%):

Is it unique per user? (yes/no):

Example: "A sacred pixel monument appears for 1.5s and explodes into fractals."

📱 8. Mobile Behavior

Choose:

A) Disable effects in mobile-lite (recommended for performance)

B) Keep reduced effects (50% particles, simplified animations)

C) Fully simplified version (static objects only)

🔏 9. Security/IP Observations

Confirm:

- [ ] The theme does NOT use registered trademark images
- [ ] The theme is inspired, does not reproduce logos/licenses
- [ ] All objects are abstract geometric shapes
- [ ] No direct references to protected IP
- [ ] All elements are procedural (Canvas 2D, no assets)

🧪 Final format expected by AI (to generate the theme)

Copy and paste the template below and fill it in:

```markdown
# New Theme — Template

## 1. Author
Name:
GitHub:
X/Twitter:
Motivation:

## 2. Identity
Theme Name:
Theme ID:
Summary:

## 3. Palette
Primary:
Secondary:
Background:
Accent:
Highlight:
Border:
Glow:
Muted:

## 4. Orb Variations
1. Name:
   - Description:
   - Shapes:
   - Effects:
2. Name:
   - Description:
   - Shapes:
   - Effects:
(…up to 10)

## 5. Decorative Objects
1. Name:
   - Representation:
   - Location:
   - Layer:
   - Animated: yes/no
   - Animation (if applicable):

## 6. Special Effects
- Effect 1:
  - Trigger:
  - Description:
  - Duration:
- Effect 2:
  - Trigger:
  - Description:
  - Duration:

## 7. Easter Egg
- Event:
- Animation:
- Duration:
- Chance:
- Unique per user: yes/no

## 8. Mobile
Mode: A/B/C

## 9. IP/Safety
- [x] Does not use protected IP
- [x] Abstract geometric shapes
- [x] Procedural rendering
```

📋 Post-Generation Validation Checklist

After the agent generates the specification, verify:

- [ ] Folder structure created correctly in `agent-os/specs/`
- [ ] `spec.md` file created with complete specification
- [ ] `tasks.md` file created with task breakdown
- [ ] `planning/requirements.md` file created
- [ ] All files are in correct folders
- [ ] File names follow kebab-case pattern
- [ ] No broken references
- [ ] Documentation is aligned with other existing themes

🔗 Useful References

- Existing theme structure: `agent-os/specs/2025-11-20-indiana-jones-theme/`
- Theme system: `lib/themes.ts`
- Orb canvas: `components/DevOrbsCanvas.tsx`
- Decorative objects documentation: `agent-os/specs/2025-11-20-theme-decorative-objects/`

