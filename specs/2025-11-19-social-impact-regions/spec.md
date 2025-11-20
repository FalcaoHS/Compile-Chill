# Specification: Social Impact / Regions of Interest

## Goal

Create a dedicated page and documentation structure to support communities with limited digital access in Ethiopia, Uganda, and Tanzania, providing information about the project, partnership opportunities, and future multilingual support plans.

## User Stories

- As a developer, educator, or NGO representative from Ethiopia, Uganda, or Tanzania, I want to learn about how Compile & Chill can support communities with limited digital access, so that I can understand partnership opportunities and contribute to expanding access
- As a contributor, I want to find clear guidance on how to translate documentation and create lightweight versions of the tool, so that I can help make the project accessible to these regions

## Specific Requirements

**New Impact Social Page**

- Create new page at `/impacto-social` using Next.js App Router following existing page structure patterns
- Page should be primarily informational with static or simple dynamic content
- Include sections for: target countries overview (Ethiopia, Uganda, Tanzania), partnership information, future multilingual roadmap, contributor guidelines
- Use theme-aware styling consistent with existing pages (TailwindCSS, theme system integration)
- Ensure responsive design following mobile-first approach with standard breakpoints
- Add page to sitemap.ts with appropriate priority and change frequency

**Target Countries Information Section**

- Display information about three target countries: Ethiopia, Uganda, Tanzania
- Include context about digital access challenges: low connectivity, infrastructure barriers, high data costs, rural communities
- Mention languages spoken: Amharic, English, Swahili, and other local languages
- Keep content focused on educational/tech context, not requiring full UI translation initially

**Partnership and NGO Section**

- Provide informational section (no technical integrations) with: list of relevant NGOs, contact email, partnership instructions, how to download lightweight versions, how to translate the project
- Structure as static content with clear call-to-action for contact
- No form submission or API integration required in this phase
- Future optional: simple contact form (out of scope for now)

**Multilingual Support Implementation - Phase 1 (English)**

- Ensure English documentation is complete and accessible for Ethiopia, Uganda, and Tanzania
- Expand `docs/BEGINNER_GUIDE_EN.md` if needed to include region-specific context
- Verify English content covers educational/tech context for these regions
- English already covers Ethiopia, Uganda, and part of Tanzania in educational/tech context

**Multilingual Support Implementation - Phase 2 (Swahili)**

- Create Swahili beginner guide: `docs/GUIA_INICIANTE_SW.md` (or `BEGINNER_GUIDE_SW.md`)
- Follow existing documentation structure from PT/EN/ES guides
- Translate core content: setup instructions, concepts, troubleshooting
- Swahili impacts Tanzania significantly and part of Kenya
- Maintain consistent formatting and structure with existing guides
- Add Swahili link to README language section if applicable

**Multilingual Support Implementation - Phase 3 (Amharic)**

- Create Amharic beginner guide: `docs/GUIA_INICIANTE_AM.md` (or `BEGINNER_GUIDE_AM.md`)
- Follow existing documentation structure from other language guides
- Translate core content: setup instructions, concepts, troubleshooting
- Amharic impacts Ethiopia significantly
- Maintain consistent formatting and structure with existing guides
- Add Amharic link to README language section if applicable

**Data Economy Mode Planning**

- Document planned "Data Economy Mode" feature for future implementation
- Describe as interface button/option for users with weak internet, schools, NGOs using browser directly
- Note that separate builds (APK, EXE, USB distribution) are future possibility only
- Do not implement the feature, only document the plan

**README Integration**

- Add "🌍 Impacto Social" section to main README.md
- Link to new `/impacto-social` page
- Maintain consistency with existing multilingual README structure (PT, EN, ES versions)

**Documentation Structure**

- Expand existing English documentation in `docs/BEGINNER_GUIDE_EN.md` if needed for these regions
- Keep PT and ES guides separate as they currently exist
- Follow established documentation patterns from existing guides in `docs/` folder
- Implement all three phases of multilingual support: Phase 1 (English - verify/expand), Phase 2 (Swahili - create), Phase 3 (Amharic - create)

## Visual Design

No visual assets provided.

## Existing Code to Leverage

**Page "Sobre" (`app/sobre/page.tsx`)**

- Reference basic multilingual support pattern (PT/EN toggle) for page structure
- Use similar theme-aware styling approach with `useThemeStore` and `THEMES` integration
- Follow tab-based content organization pattern if multiple sections needed
- Reuse responsive layout structure with `max-w-6xl mx-auto` container pattern

**Documentation Structure (`docs/` folder)**

- Follow established pattern of separate markdown files per language (GUIA_INICIANTE_PT.md, BEGINNER_GUIDE_EN.md, GUIA_INICIANTE_ES.md)
- Maintain consistent documentation formatting and structure
- Use same naming conventions for future language guides

**README Multilingual Pattern**

- Reference existing README structure with language links at top
- Follow pattern of separate README files per language (README.md, README.en.md, README.es.md)
- Maintain consistent section organization across language versions

**Next.js App Router Page Structure**

- Follow existing page patterns from `app/sobre/page.tsx`, `app/ranking/page.tsx`, `app/contato/page.tsx`
- Use client components with theme integration when needed
- Maintain consistent metadata structure following `app/layout.tsx` patterns
- Ensure proper TypeScript typing following project conventions

**Sitemap Integration**

- Add new page to `app/sitemap.ts` following existing static page pattern
- Use appropriate priority (0.5-0.6) and changeFrequency ('monthly') for informational content
- Follow existing URL structure and metadata format

## Out of Scope

- Full UI translation of the product interface to Amharic or Swahili
- Donation system or payment integration
- Integration with educational platforms (Coursera, Khan Academy, etc.)
- Formal NGO registration system or database
- School-specific internal tools or features
- Offline distribution via APK, EXE, or USB drive builds
- Immediate implementation of "Data Economy Mode" feature (only planning/documentation)
- Contact form with backend processing (future optional feature)
- Expansion to other countries beyond Ethiopia, Uganda, Tanzania (future consideration)
- API integrations with third-party services for NGO management
- Real-time collaboration features for translators

