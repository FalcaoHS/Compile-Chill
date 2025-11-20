# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Publicado]

### Adicionado
- Documentação em inglês e espanhol (README.en.md, README.es.md)
- Guias de contribuição em múltiplos idiomas (CONTRIBUTING.en.md, CONTRIBUTING.es.md)
- Código de Conduta (CODE_OF_CONDUCT.md)
- Template para Pull Requests (.github/PULL_REQUEST_TEMPLATE.md)
- Guia de configuração do GitHub (docs/GITHUB_SETUP.md)
- Scripts adicionais no package.json (format, type-check, db:studio, etc.)
- Configuração do Prettier (.prettierrc, .prettierignore)
- EditorConfig (.editorconfig)
- Melhorias no .gitignore

### Melhorado
- README.md principal com badges e melhor organização
- SECURITY.md com informações mais detalhadas
- package.json com mais metadados e scripts úteis

## [0.1.0] - 2025-01-XX

### Adicionado
- Sistema de autenticação OAuth via X (Twitter) com NextAuth.js v5
- Sistema de temas (5 temas: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- 10 jogos temáticos para desenvolvedores
- Sistema de rankings global e por jogo
- Validação de scores server-side (anti-cheat)
- Perfis de usuário com histórico de jogos
- Rate limiting com Upstash Redis
- Documentação completa em português

### Tecnologias
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- TailwindCSS
- Framer Motion
- Zustand
- Matter.js

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Descontinuado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades

