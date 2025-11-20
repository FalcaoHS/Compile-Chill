# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Social Impact page (`/impacto-social`) with information about support for communities with limited digital access
- Complete multilingual documentation:
  - Guides in Portuguese (PT), English (EN), Spanish (ES), Swahili (SW), Amharic (AM)
  - Sections on considerations for regions with limited digital access
  - Information about Ethiopia, Uganda, and Tanzania
- Documentation in English and Spanish (README.en.md, README.es.md)
- Contribution guides in multiple languages (CONTRIBUTING.en.md, CONTRIBUTING.es.md)
- Code of Conduct (CODE_OF_CONDUCT.md)
- Pull Request template (.github/PULL_REQUEST_TEMPLATE.md)
- GitHub setup guide (docs/setup/GITHUB_SETUP.md)
- Additional scripts in package.json (format, type-check, db:studio, etc.)
- Prettier configuration (.prettierrc, .prettierignore)
- EditorConfig (.editorconfig)
- Improvements to .gitignore

### Improved
- Main README.md with badges and better organization
- READMEs updated with Social Impact section
- Organized documentation: implementations moved to corresponding specs
- Updated references (agent-os/specs → specs)
- SECURITY.md with more detailed information
- package.json with more metadata and useful scripts

### Organized
- Implementation documentation moved to corresponding specs:
  - Anti-cheat cleanup → `specs/2025-11-18-game-score-validation-system/implementation/`
  - Session isolation docs → `specs/2025-11-19-session-isolation-security-fix/implementation/`
- Clean and organized folder structure
- Fixed broken references

## [0.1.0] - 2025-01-XX

### Added
- OAuth authentication system via X (Twitter) with NextAuth.js v5
- Theme system (5 themes: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- 10 themed games for developers
- Global and per-game ranking system
- Server-side score validation (anti-cheat)
- User profiles with game history
- Rate limiting with Upstash Redis
- Complete documentation in Portuguese

### Technologies
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- TailwindCSS
- Framer Motion
- Zustand
- Matter.js

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerabilities

