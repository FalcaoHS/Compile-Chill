# የለውጥ መዝገብ

ሁሉም በዚህ ፕሮጀክት ውስጥ የሚከሰቱ አስፈላጊ ለውጦች በዚህ ፋይል ውስጥ ይመዘግባሉ።

ቅርጸቱ በ [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) ላይ የተመሰረተ ነው፣
እና ይህ ፕሮጀክት በ [Semantic Versioning](https://semver.org/) ይከተላል።

## [ያልታተመ]

### ተጨመረ
- የማህበራዊ ተጽዕኖ ገጽ (`/impacto-social`) ከተገደበ ዲጂታል መዳረሻ ያላቸው ማህበረሰቦች ላይ ድጋፍ ስለ መረጃ
- ሙሉ ባለብዙ ቋንቋ ሰነዶች:
  - መመሪያዎች በፖርቱጊዝ (PT)፣ እንግሊዝኛ (EN)፣ ስፓኒሽ (ES)፣ ስዋሂሊ (SW)፣ አማርኛ (AM)
  - ለተገደቡ ዲጂታል መዳረሻ ያላቸው ክልሎች ስለ ግምቶች ክፍሎች
  - ስለ ኢትዮጵያ፣ ኡጋንዳ እና ታንዛኒያ መረጃ
- በእንግሊዝኛ እና በስፓኒሽ ሰነዶች (README.en.md, README.es.md)
- በብዙ ቋንቋዎች የአስተዋጽኦ መመሪያዎች (CONTRIBUTING.en.md, CONTRIBUTING.es.md)
- የአገባብ ኮድ (CODE_OF_CONDUCT.md)
- የ Pull Request አብነት (.github/PULL_REQUEST_TEMPLATE.md)
- የ GitHub ማዋቀር መመሪያ (docs/setup/GITHUB_SETUP.md)
- በ package.json ውስጥ ተጨማሪ scripts (format, type-check, db:studio, ወዘተ.)
- የ Prettier ማዋቀር (.prettierrc, .prettierignore)
- EditorConfig (.editorconfig)
- በ .gitignore ላይ ማሻሻያዎች

### ተሻሽሏል
- ዋናው README.md ከ badges እና የተሻለ አደራጅት ጋር
- READMEs ከማህበራዊ ተጽዕኖ ክፍል ጋር ተዘምነዋል
- የተደራጀ ሰነድ: አፈጻጸሞች ወደ ተዛማጅ specs ተዛውረዋል
- የተዘምኑ ማጣቀሻዎች (agent-os/specs → specs)
- SECURITY.md ከዝርዝር መረጃ ጋር
- package.json ከተጨማሪ metadata እና ጠቃሚ scripts ጋር

### ተደራጅቷል
- የአፈጻጸም ሰነድ ወደ ተዛማጅ specs ተዛውሯል:
  - የ anti-cheat ማጽዳት → `specs/2025-11-18-game-score-validation-system/implementation/`
  - የክፍለ-ጊዜ መለየት ሰነዶች → `specs/2025-11-19-session-isolation-security-fix/implementation/`
- ንጹህ እና የተደራጀ የፎልደር መዋቅር
- የተሰበሩ ማጣቀሻዎች ተስተካክለዋል

## [0.1.0] - 2025-01-XX

### ተጨመረ
- የ OAuth ምስክርነት ስርዓት በ X (Twitter) በ NextAuth.js v5
- የገጽታ ስርዓት (ገጽታዎች 5: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- ለገንቢዎች 10 የገጽታ ጨዋታዎች
- የአለም አቀፍ እና በጨዋታ የሆነ የደረጃ ስርዓት
- የግራድ ማረጋገጫ በሰርቨር ጎን (anti-cheat)
- የተጠቃሚ መገለጫዎች ከጨዋታ ታሪክ ጋር
- የመጠን ገደብ ከ Upstash Redis
- በፖርቱጊዝ ሙሉ ሰነድ

### ቴክኖሎጂዎች
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- TailwindCSS
- Framer Motion
- Zustand
- Matter.js

---

## የለውጥ ዓይነቶች

- `ተጨመረ` ለአዳዲስ ባህሪያት
- `ተቀየረ` ለነባሪ ተግባራት ላይ ለውጦች
- `ተተወ` ለቅርብ ጊዜ ሊወገዱ ለሚችሉ ባህሪያት
- `ተወግዷል` ለአሁን ለተወገዱ ባህሪያት
- `ተስተካክሏል` ለማንኛውም የስህተት ማስተካከያዎች
- `ደህንነት` ለአደጋዎች

