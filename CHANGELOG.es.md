# Registro de Cambios

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Sin Publicar]

### Añadido
- Página de Impacto Social (`/impacto-social`) con información sobre apoyo a comunidades con acceso digital limitado
- Documentación multilíngüe completa:
  - Guías en Portugués (PT), Inglés (EN), Español (ES), Swahili (SW), Amárico (AM)
  - Secciones sobre consideraciones para regiones con acceso digital limitado
  - Información sobre Etiopía, Uganda y Tanzania
- Documentación en inglés y español (README.en.md, README.es.md)
- Guías de contribución en múltiples idiomas (CONTRIBUTING.en.md, CONTRIBUTING.es.md)
- Código de Conducta (CODE_OF_CONDUCT.md)
- Plantilla para Pull Requests (.github/PULL_REQUEST_TEMPLATE.md)
- Guía de configuración de GitHub (docs/setup/GITHUB_SETUP.md)
- Scripts adicionales en package.json (format, type-check, db:studio, etc.)
- Configuración de Prettier (.prettierrc, .prettierignore)
- EditorConfig (.editorconfig)
- Mejoras en .gitignore

### Mejorado
- README.md principal con badges y mejor organización
- READMEs actualizados con sección de Impacto Social
- Documentación organizada: implementaciones movidas a specs correspondientes
- Referencias actualizadas (agent-os/specs → specs)
- SECURITY.md con información más detallada
- package.json con más metadatos y scripts útiles

### Organizado
- Documentación de implementación movida a specs correspondientes:
  - Limpieza anti-cheat → `specs/2025-11-18-game-score-validation-system/implementation/`
  - Documentos de aislamiento de sesión → `specs/2025-11-19-session-isolation-security-fix/implementation/`
- Estructura de carpetas limpia y organizada
- Referencias rotas corregidas

## [0.1.0] - 2025-01-XX

### Añadido
- Sistema de autenticación OAuth vía X (Twitter) con NextAuth.js v5
- Sistema de temas (5 temas: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev)
- 10 juegos temáticos para desarrolladores
- Sistema de rankings global y por juego
- Validación de puntuaciones del lado del servidor (anti-cheat)
- Perfiles de usuario con historial de juegos
- Rate limiting con Upstash Redis
- Documentación completa en portugués

### Tecnologías
- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js v5
- TailwindCSS
- Framer Motion
- Zustand
- Matter.js

---

## Tipos de Cambios

- `Añadido` para nuevas funcionalidades
- `Modificado` para cambios en funcionalidades existentes
- `Descontinuado` para funcionalidades que serán removidas
- `Removido` para funcionalidades removidas
- `Corregido` para correcciones de bugs
- `Seguridad` para vulnerabilidades

