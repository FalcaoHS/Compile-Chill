# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Não Publicado]

### Adicionado
- Página de Impacto Social (`/impacto-social`) com informações sobre apoio a comunidades com acesso digital limitado
- Documentação multilíngue completa:
  - Guias em Português (PT), Inglês (EN), Espanhol (ES), Swahili (SW), Amharic (AM)
  - Seções sobre considerações para regiões com acesso digital limitado
  - Informações sobre Etiópia, Uganda e Tanzânia
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
- READMEs atualizados com seção de Impacto Social
- Documentação organizada: implementações movidas para specs correspondentes
- Referências atualizadas (agent-os/specs → specs)
- SECURITY.md com informações mais detalhadas
- package.json com mais metadados e scripts úteis

### Organizado
- Documentação de implementação movida para specs correspondentes:
  - Anti-cheat cleanup → `specs/2025-11-18-game-score-validation-system/implementation/`
  - Session isolation docs → `specs/2025-11-19-session-isolation-security-fix/implementation/`
- Estrutura de pastas limpa e organizada
- Referências quebradas corrigidas

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

