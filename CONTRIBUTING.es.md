# Contribuyendo a Compile & Chill

¡Gracias por considerar contribuir a Compile & Chill! 🎉

Este documento proporciona directrices e información sobre cómo contribuir al proyecto.

## 📋 Cómo Contribuir

### Reportar Errores

Si encontraste un error, por favor:

1. Verifica si el error no ha sido reportado ya en [Issues](https://github.com/seu-usuario/compile-and-chill/issues)
2. Si no ha sido reportado, crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs. comportamiento actual
   - Capturas de pantalla (si aplica)
   - Entorno (OS, versión de Node.js, etc.)

### Sugerir Mejoras

¡Las sugerencias siempre son bienvenidas! Para sugerir una mejora:

1. Verifica si ya existe un issue similar
2. Crea un nuevo issue con la etiqueta `enhancement`
3. Describe detalladamente la funcionalidad propuesta y su caso de uso

### Pull Requests

1. **Haz fork del repositorio**
2. **Crea una rama** para tu feature/fix:
   ```bash
   git checkout -b feature/mi-funcionalidad
   # o
   git checkout -b fix/correccion-error
   ```
3. **Haz tus cambios** siguiendo los estándares del proyecto
4. **Prueba tus cambios** localmente
5. **Haz commit de tus cambios** con mensajes descriptivos:
   ```bash
   git commit -m "feat: agrega nueva funcionalidad X"
   # o
   git commit -m "fix: corrige error Y"
   ```
6. **Haz push a tu rama**:
   ```bash
   git push origin feature/mi-funcionalidad
   ```
7. **Abre un Pull Request** en GitHub

## 🎨 Estándares de Código

### TypeScript

- Usa TypeScript para todo el código nuevo
- Evita `any` - usa tipos específicos
- Mantén funciones pequeñas y enfocadas
- Agrega comentarios JSDoc para funciones complejas

### Formato

- Usa Prettier para formato automático
- Ejecuta `npm run format` antes de hacer commit
- Mantén líneas con máximo 100 caracteres cuando sea posible

### Estructura de Archivos

- Componentes React en `components/`
- Lógica de negocio en `lib/`
- Páginas en `app/`
- Hooks personalizados en `hooks/`
- Tipos compartidos en `types/`

### Convenciones de Nomenclatura

- Componentes: PascalCase (`GameCard.tsx`)
- Archivos utilitarios: camelCase (`game-utils.ts`)
- Hooks: camelCase con prefijo `use` (`useDrops.ts`)
- Constantes: UPPER_SNAKE_CASE (`MAX_SCORE`)

## 🧪 Pruebas

- Prueba tus cambios localmente antes de enviar
- Ejecuta `npm run lint` para verificar errores
- Ejecuta `npm run type-check` para verificar tipos
- Prueba en diferentes navegadores cuando sea aplicable

## 📝 Mensajes de Commit

Seguimos el patrón [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de error
- `docs:` Cambios en documentación
- `style:` Formato, punto y coma faltante, etc.
- `refactor:` Refactorización de código
- `test:` Adición o corrección de pruebas
- `chore:` Cambios en build, dependencias, etc.

Ejemplos:
```
feat: agrega sistema de logros
fix: corrige validación de puntuación en Terminal 2048
docs: actualiza README con nuevas instrucciones
refactor: reorganiza estructura de componentes de juegos
```

## 🔍 Proceso de Revisión

- Los Pull Requests serán revisados por mantenedores
- El feedback se proporcionará de forma constructiva
- Puede solicitarse que hagas cambios antes del merge
- Mantén la discusión enfocada y respetuosa

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de NextAuth.js](https://authjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ ¿Preguntas?

Si tienes preguntas sobre cómo contribuir, puedes:

- Abrir un issue con la etiqueta `question`
- Verificar la documentación existente
- Revisar issues y PRs anteriores

## 🙏 Agradecimientos

¡Gracias por contribuir a hacer Compile & Chill mejor! Cada contribución, por pequeña que sea, es valiosa.

