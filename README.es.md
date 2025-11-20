# 🎮 Compile & Chill

> Portal de descompresión para desarrolladores con juegos temáticos, sistema de rankings y autenticación vía X (Twitter).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io/)

## ✨ Acerca del Proyecto

Compile & Chill es un portal creado especialmente para desarrolladores que quieren unos minutos de relajación sin salir del "ambiente dev". El proyecto combina juegos ligeros, estética hacker/cyber, personalización de temas, rankings globales, inicio de sesión simplificado vía X (Twitter) y compartir social.

### 🎯 Características Principales

- 🎮 **10 Juegos Temáticos**: Terminal 2048, Crypto Miner, Dev Pong, Stack Overflow Dodge y más
- 🎨 **5 Temas Visuales**: Cyber Hacker, Pixel Lab, Neon Future, Terminal Minimal, Blueprint Dev
- 🏆 **Sistema de Rankings**: Rankings globales y por juego con validación anti-trampa
- 🔐 **Autenticación OAuth**: Inicio de sesión único vía X (Twitter) con NextAuth.js v5
- 📊 **Perfiles de Usuario**: Historial de juegos, mejores puntuaciones y estadísticas
- 🎯 **Validación de Puntuaciones**: Sistema robusto de validación server-side para prevenir trampas
- ⚡ **Rendimiento**: Optimizado con Next.js 14 App Router y TypeScript

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** o **yarn** (viene con Node.js)
- **PostgreSQL** ([Descargar](https://www.postgresql.org/download/)) o usa un servicio como [Neon](https://neon.tech/), [Supabase](https://supabase.com/), o [Railway](https://railway.app/)
- Cuenta en **X (Twitter)** para obtener credenciales OAuth

## 🚀 Guía de Configuración Paso a Paso

### 1. Instalar Dependencias

Clona el repositorio (si aún no lo has hecho) e instala las dependencias:

```bash
npm install
```

### 2. Configurar Base de Datos PostgreSQL

#### Opción A: PostgreSQL Local

1. Instala PostgreSQL en tu sistema
2. Crea una base de datos:
   ```sql
   CREATE DATABASE compileandchill;
   ```
3. Anota las credenciales (usuario, contraseña, host, puerto)

#### Opción B: Servicio Cloud (Recomendado para desarrollo)

**Neon (PostgreSQL Serverless - Gratis):**
1. Visita [https://neon.tech](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la cadena de conexión proporcionada

**Supabase (PostgreSQL - Gratis):**
1. Visita [https://supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Ve a Settings > Database > Connection string
5. Copia la cadena de conexión (formato URI)

**Railway (PostgreSQL - Gratis):**
1. Visita [https://railway.app](https://railway.app)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto > Add PostgreSQL
4. Copia la DATABASE_URL proporcionada

### 3. Obtener Credenciales OAuth de X (Twitter)

1. **Accede al Portal de Desarrolladores de Twitter:**
   - Enlace: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
   - Inicia sesión con tu cuenta de X (Twitter)

2. **Usar Proyecto Existente o Crear Nueva App:**
   
   **Opción A: Si YA TIENES un proyecto:**
   - Selecciona tu proyecto existente en el dashboard
   - Dentro del proyecto, busca "Apps" o "Applications" (generalmente en la barra lateral o arriba)
   - Puedes:
     - **Usar una app existente**: Haz clic en la app y ve a "Settings" > "User authentication settings"
     - **Crear una nueva app dentro del proyecto**: 
       - Busca "Add App", "Create App", o botón "+" dentro de la sección de Apps
       - Si no lo encuentras, puedes usar una app existente y solo configurar diferentes URLs de callback
       - **Consejo**: Puedes usar la misma app para múltiples proyectos, solo configura diferentes Callback URLs
   
   **Opción B: Si NO TIENES un proyecto:**
   - Haz clic en "Create Project" o "New Project"
   - Completa la información del proyecto
   - Luego, crea una nueva App dentro del proyecto
   - Completa la información de la App:
     - **App name**: Compile & Chill (o cualquier nombre)
     - **App description**: Portal de descompresión para desarrolladores
     - **Website URL**: `http://localhost:3000` (para desarrollo)
     - **Callback URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANTE**

3. **Configurar OAuth 2.0 (OBLIGATORIO - haz esto PRIMERO):**
   - Dentro de tu App, ve a la pestaña **"Settings"** (al lado de "Keys and tokens")
   - Busca **"User authentication settings"** o **"OAuth 2.0 Settings"**
   - Haz clic en **"Set up"** o **"Edit"** para configurar OAuth 2.0
   - Configura rápidamente:
     - **Type of App**: Selecciona **"Web App, Automated App or Bot"** (Confidential client)
     - **App permissions**: Deja **"Read"** seleccionado (por defecto)
     - **Callback URI / Redirect URL**: `http://localhost:3000/api/auth/callback/twitter` ⚠️ **IMPORTANTE**
     - **Website URL**: 
       - Si no acepta `http://localhost:3000`, prueba:
       - `http://127.0.0.1:3000` (IP local)
       - O usa un servicio temporal como `http://localhost` (sin puerto)
       - O déjalo en blanco si es opcional
       - ⚠️ **¡Lo más importante es que el Callback URI esté correcto!**
   - **Guarda los cambios** (¡muy importante!)
   - ⚠️ **ATENCIÓN**: ¡Las credenciales OAuth 2.0 (Client ID y Client Secret) solo aparecen DESPUÉS de configurar OAuth 2.0!

4. **Obtener Credenciales OAuth 2.0:**
   - Después de configurar OAuth 2.0, vuelve a la pestaña **"Keys and tokens"**
   - Busca la sección **"OAuth 2.0 Client ID and Client Secret"** o **"OAuth 2.0 credentials"**
   - Verás:
     - **Client ID** (será tu `X_CLIENT_ID`)
     - **Client Secret** (será tu `X_CLIENT_SECRET`) - puede tener un botón "Reveal" para mostrar
   - ⚠️ **IMPORTANTE**: 
     - **NO uses** "Consumer Keys" (API Key and Secret) - estas son para API v1.1
     - **NO uses** "Bearer Token" o "Access Token and Secret" - estas son diferentes
     - Necesitas específicamente las credenciales **OAuth 2.0** (Client ID y Client Secret)
     - Si la sección OAuth 2.0 no aparece, vuelve al paso 3 y asegúrate de haber guardado la configuración
     - ¡Mantén estas credenciales seguras y nunca las commitees en Git!

### 4. Configurar Upstash Redis (para Rate Limiting)

**Opción A: Upstash (Recomendado - Gratis):**
1. Visita [https://upstash.com](https://upstash.com)
2. Crea una cuenta gratuita
3. Crea una nueva base de datos Redis
4. Copia la **REST URL** y **REST TOKEN** proporcionados
5. Agrega estas variables a tu `.env` (ver paso 6)

**Opción B: Omitir Rate Limiting (Desarrollo):**
- Si no quieres configurar rate limiting ahora, puedes dejar las variables vacías
- El sistema funcionará, pero rate limiting no estará activo
- ⚠️ **Importante**: Configura Upstash antes de hacer deploy en producción

### 5. Generar NEXTAUTH_SECRET

Genera una clave secreta segura para NextAuth:

**En Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**En Linux/Mac:**
```bash
openssl rand -base64 32
```

**Alternativa online (si no tienes openssl):**
- Visita [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)
- Copia la cadena generada

### 6. Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database Connection
# Reemplaza con tus valores reales
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/compileandchill?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="pega-aquí-el-secret-generado-en-paso-4"

# X OAuth Credentials (obtenidas en paso 3)
X_CLIENT_ID="pega-aquí-el-client-id-de-twitter"
X_CLIENT_SECRET="pega-aquí-el-client-secret-de-twitter"

# Upstash Redis (para Rate Limiting - opcional para desarrollo)
# Obtén en: https://upstash.com/
UPSTASH_REDIS_REST_URL="pega-aquí-el-url-de-upstash-redis"
UPSTASH_REDIS_REST_TOKEN="pega-aquí-el-token-de-upstash-redis"
```

**Ejemplo con Neon:**
```env
DATABASE_URL="postgresql://usuario:contraseña@ep-xxx-xxx.us-east-2.aws.neon.tech/compileandchill?sslmode=require"
```

**⚠️ IMPORTANTE:**
- Nunca commitees el archivo `.env` en Git (ya está en `.gitignore`)
- Mantén tus credenciales seguras
- Usa credenciales diferentes para desarrollo y producción

### 7. Ejecutar Migraciones de Prisma

Configura la base de datos ejecutando las migraciones:

```bash
npx prisma migrate dev
```

Esto:
- Creará todas las tablas necesarias (users, accounts, sessions, verification_tokens)
- Aplicará los índices y constraints
- Generará automáticamente Prisma Client

**Si obtienes un error de conexión:**
- Verifica si PostgreSQL está corriendo
- Confirma que `DATABASE_URL` es correcta
- Prueba la conexión: `npx prisma db pull` (debe listar las tablas)

### 8. Generar Prisma Client (si es necesario)

Si Prisma Client no fue generado automáticamente:

```bash
npx prisma generate
```

### 9. Ejecutar el Proyecto

Inicia el servidor de desarrollo:

```bash
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

## ✅ Verificación

Después de seguir todos los pasos, deberías poder:

1. ✅ Acceder a http://localhost:3000 sin errores
2. ✅ Ver el botón "Iniciar sesión con X" en el header y home
3. ✅ Hacer clic en el botón y ser redirigido a X para autorizar
4. ✅ Después de autorizar, ser redirigido de vuelta y ver tu perfil en el header

## 🔧 Solución de Problemas

### Error: "No pudiste otorgar acceso a la aplicación" o "Invalid credentials"
**Solución paso a paso:**

1. **Verifica la Callback URL en el Portal de Desarrolladores de Twitter:**
   - Ve a Settings > User authentication settings
   - El Callback URI debe estar EXACTAMENTE: `http://localhost:3000/api/auth/callback/twitter`
   - ⚠️ **IMPORTANTE**: 
     - Debe comenzar con `http://` (no `https://`)
     - Debe tener `/api/auth/callback/twitter` al final
     - No puede tener espacios o caracteres extra
     - Guarda los cambios después de editar

2. **Verifica si estás usando las credenciales OAuth 2.0 correctas:**
   - En `.env`, debes usar:
     - `X_CLIENT_ID` = OAuth 2.0 Client ID (no API Key)
     - `X_CLIENT_SECRET` = OAuth 2.0 Client Secret (no API Key Secret)
   - Estas credenciales aparecen DESPUÉS de configurar OAuth 2.0 en Settings
   - ¡Si copiaste "API Key" y "API Key Secret", esas están mal! Necesitas las credenciales OAuth 2.0

3. **Verifica si el Type of App es correcto:**
   - Debe ser "Web App, Automated App or Bot" (Confidential client)
   - No puede ser "Native App"

4. **Reinicia el servidor después de cambiar .env:**
   ```bash
   # Detén el servidor (Ctrl+C) y ejecuta de nuevo:
   npm run dev
   ```

### Error: "Database connection failed"
- Verifica si PostgreSQL está corriendo
- Confirma `DATABASE_URL` en `.env`
- Prueba la conexión manualmente

### Error: "NEXTAUTH_SECRET is missing"
- Asegúrate de que el archivo `.env` existe en la raíz
- Verifica si la variable `NEXTAUTH_SECRET` está definida
- Reinicia el servidor después de crear/editar `.env`

### Error: "Prisma Client not generated"
```bash
npx prisma generate
```

### Ver logs de Prisma
Prisma está configurado para registrar queries en desarrollo. Revisa la consola.

## 📚 Enlaces Útiles

- **Portal de Desarrolladores de Twitter**: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
- **NextAuth.js v5 Docs**: [https://authjs.dev](https://authjs.dev)
- **Prisma Docs**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Neon (PostgreSQL Serverless)**: [https://neon.tech](https://neon.tech)
- **Supabase**: [https://supabase.com](https://supabase.com)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **Zustand** - Gestión de estado
- **Matter.js** - Física para juegos

### Backend
- **Next.js API Routes** - API serverless
- **Prisma** - ORM para PostgreSQL
- **NextAuth.js v5** - Autenticación OAuth
- **Zod** - Validación de schemas

### Infraestructura
- **PostgreSQL** - Base de datos
- **Upstash Redis** - Rate limiting
- **Vercel** - Deploy (recomendado)

## 📁 Estructura del Proyecto

```
compile-and-chill/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── jogos/             # Páginas de juegos
│   └── ...
├── components/             # Componentes React
│   ├── games/             # Componentes específicos de juegos
│   └── ...
├── lib/                    # Utilidades y lógica
│   ├── games/             # Lógica de juegos
│   ├── game-validators/   # Validación de puntuaciones
│   └── ...
├── hooks/                  # React hooks personalizados
├── prisma/                 # Schema y migraciones
├── public/                 # Archivos estáticos
└── types/                  # Definiciones TypeScript
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo
npm run build            # Crea build de producción
npm run start            # Inicia servidor de producción

# Calidad de Código
npm run lint             # Ejecuta ESLint
npm run lint:fix          # Corrige problemas de ESLint
npm run type-check        # Verifica tipos TypeScript
npm run format            # Formatea código con Prettier
npm run format:check      # Verifica formato

# Base de Datos
npm run db:generate       # Genera Prisma Client
npm run db:push           # Aplica cambios en schema
npm run db:migrate        # Ejecuta migraciones
npm run db:studio         # Abre Prisma Studio
```

## 🤖 Desarrollo con IA

Este proyecto fue **completamente desarrollado usando herramientas de IA** como copilotos de código. Todo el código fue "vibecodado" con:

- **[Cursor](https://cursor.sh)** - Editor de código con IA integrada
- **[ChatGPT](https://chat.openai.com)** - Asistente de IA de OpenAI
- **[Gemini](https://gemini.google.com)** - Modelo de IA de Google
- **[Canvas](https://canvas.app)** - Herramienta de diseño y prototipado con IA

### ⚠️ Importante

Por haber sido desarrollado principalmente con asistencia de IA, **pueden existir errores, inconsistencias o código no optimizado** en algunas partes del proyecto. ¡Las contribuciones, correcciones y mejoras son muy bienvenidas!

## 🤝 Contribuyendo

¡Las contribuciones son bienvenidas! Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para directrices sobre cómo contribuir al proyecto.

**Idiomas disponibles:**
- [Español](CONTRIBUTING.es.md) (este)
- [English](CONTRIBUTING.en.md)
- [Português](CONTRIBUTING.md)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🔐 Seguridad

- ⚠️ Nunca commitees credenciales en Git
- ⚠️ Usa variables de entorno diferentes para dev/prod
- ⚠️ Mantén `NEXTAUTH_SECRET` seguro y único
- ⚠️ Configura HTTPS en producción
- ⚠️ Revisa [SECURITY.md](SECURITY.md) para más información sobre seguridad

## 👤 Autor

**Hudson Falcão Silva**

📧 **Email:** [falcaoh@gmail.com](mailto:falcaoh@gmail.com)

## 🙏 Agradecimientos

- Todos los contribuidores que ayudan a mejorar este proyecto
- La comunidad open-source por todas las herramientas increíbles utilizadas

## 🌐 Otros Idiomas

- [Português (PT-BR)](README.md) - Por defecto
- [English (EN)](README.en.md)

## 🎓 ¿Eres Principiante? ¿Empezando en Programación?

**¡No te preocupes!** Creamos guías completas y detalladas especialmente para ti:

- 🇧🇷 **[Guía Completa para Principiantes (Português)](docs/GUIA_INICIANTE_PT.md)** - Explicaciones paso a paso, conceptos explicados, solución de problemas
- 🇺🇸 **[Complete Beginner's Guide (English)](docs/BEGINNER_GUIDE_EN.md)** - Step-by-step explanations, concepts explained, troubleshooting
- 🇪🇸 **[Guía Completa para Principiantes (Español)](docs/GUIA_INICIANTE_ES.md)** - Explicaciones paso a paso, conceptos explicados, solución de problemas
- 🇹🇿 **[Mwongozo Kamili wa Mwanzo (Swahili)](docs/BEGINNER_GUIDE_SW.md)** - Guía completa para principiantes, todos los conceptos explicados, solución de problemas
- 🇪🇹 **[ሙሉ የጀማሪ መመሪያ (Amharic)](docs/BEGINNER_GUIDE_AM.md)** - Guía completa para principiantes, todos los conceptos explicados, solución de problemas

**Lo que encontrarás en las guías:**
- ✅ Explicación de cada concepto (Node.js, npm, Git, etc.)
- ✅ Paso a paso detallado con ejemplos
- ✅ Por qué cada cosa es necesaria (no solo cómo hacerlo)
- ✅ Solución de problemas completa para problemas comunes
- ✅ Analogías simples para entender conceptos complejos
- ✅ Calmando y animando a desarrolladores principiantes

**¡Si sigues la guía, terminarás con el sistema corriendo localmente!** 🚀

## 🌍 Impacto Social / Regiones de Interés

Nuestro proyecto busca apoyar comunidades con **acceso limitado a recursos digitales**. Estamos enfocados en tres países donde vemos gran oportunidad de impacto:

- **🇪🇹 Etiopía** — acceso digital bajo, muchos jóvenes sin conexión
- **🇺🇬 Uganda** — barreras de infraestructura y alto costo de datos
- **🇹🇿 Tanzania** — comunidades rurales con acceso limitado y gran interés por la tecnología

**Cómo contribuir:**
- 📝 Producir documentación y tutoriales en inglés + idiomas locales (amárico, suajili)
- 💾 Crear versiones "light" de la herramienta para uso offline o con baja ancho de banda
- 🤝 Conectar con ONGs locales, escuelas o proyectos de educación digital

**Más información:** Visita nuestra [página de Impacto Social](/impacto-social) para más información sobre asociaciones y formas de contribuir.

---

**Nota:** Esta es la versión en español. Para otros idiomas, consulta los enlaces arriba.

