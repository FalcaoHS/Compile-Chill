# 🎓 Guía Completa para Principiantes - Compile & Chill

> **¡No te preocupes!** Esta guía fue hecha especialmente para ti que estás empezando. Vamos a explicar TODO, paso a paso, con calma. Al final, tendrás el proyecto corriendo localmente y entenderás qué hace cada cosa! 🚀

## 📚 Índice

1. [¿Por qué existe esta guía?](#por-qué-existe-esta-guía)
2. [Qué vas a aprender](#qué-vas-a-aprender)
3. [Prerrequisitos (lo que necesitas tener)](#prerrequisitos)
4. [Paso 1: Entendiendo qué vamos a instalar](#paso-1-entendiendo-qué-vamos-a-instalar)
5. [Paso 2: Instalando Node.js](#paso-2-instalando-nodejs)
6. [Paso 3: Clonando el repositorio](#paso-3-clonando-el-repositorio)
7. [Paso 4: Instalando las dependencias](#paso-4-instalando-las-dependencias)
8. [Paso 5: Configurando la base de datos](#paso-5-configurando-la-base-de-datos)
9. [Paso 6: Configurando autenticación OAuth](#paso-6-configurando-autenticación-oauth)
10. [Paso 7: Configurando variables de entorno](#paso-7-configurando-variables-de-entorno)
11. [Paso 8: Configurando la base de datos](#paso-8-configurando-la-base-de-datos)
12. [Paso 9: Ejecutando el proyecto](#paso-9-ejecutando-el-proyecto)
13. [Conceptos importantes explicados](#conceptos-importantes-explicados)
14. [Solución de problemas](#solución-de-problemas)

---

## ¿Por qué existe esta guía?

Esta guía fue creada porque creemos que **cualquier persona puede aprender programación**, siempre que tenga:
- ✅ Paciencia
- ✅ Ganas de aprender
- ✅ Una guía bien explicada (¡que es esta!)

**¡No necesitas ser un experto!** Esta guía asume que estás empezando y explica cada concepto desde cero.

---

## Qué vas a aprender

Al final de esta guía, vas a:
- ✅ Entender qué es Node.js y por qué lo necesitamos
- ✅ Saber qué son las dependencias y cómo funcionan
- ✅ Comprender qué es una base de datos y por qué usamos PostgreSQL
- ✅ Entender autenticación OAuth (inicio de sesión con X/Twitter)
- ✅ Saber qué son las variables de entorno y por qué son importantes
- ✅ ¡Tener el proyecto corriendo localmente en tu máquina!

---

## Prerrequisitos

### Lo que NECESITAS tener:

1. **Una computadora** (Windows, Mac o Linux)
2. **Conexión a internet**
3. **Una cuenta en GitHub** (gratis, la crearemos si no la tienes)
4. **Una cuenta en X (Twitter)** (para autenticación)
5. **¡Paciencia y ganas de aprender!** 😊

### Lo que NO necesitas tener:

- ❌ Conocimiento avanzado de programación
- ❌ Experiencia previa con Node.js
- ❌ Haber ejecutado proyectos antes
- ❌ Saber qué es una base de datos

**¡Aprenderás todo esto aquí!**

### Consideraciones Especiales para Regiones con Acceso Digital Limitado

Esta guía está diseñada para ser accesible para desarrolladores, educadores y estudiantes en **Etiopía, Uganda y Tanzania**, donde el acceso digital puede ser limitado. Aquí hay algunos consejos:

**Si tienes internet lenta o inestable:**
- Descarga el instalador de Node.js durante horas de menor tráfico cuando sea posible
- Considera usar un administrador de descargas para archivos grandes
- El paso `npm install` puede tomar más tiempo - esto es normal, ten paciencia
- Los servicios de base de datos en la nube (Neon, Supabase) funcionan bien incluso con conexiones más lentas

**Si tienes datos limitados:**
- Usa bases de datos en la nube (Neon/Supabase) en lugar de PostgreSQL local para ahorrar ancho de banda
- El proyecto está diseñado para funcionar eficientemente con recursos limitados
- Considera usar "Modo Economía de Datos" cuando esté disponible (característica planificada)

**Si estás en una institución educativa u ONG:**
- Este proyecto es perfecto para enseñar conceptos de programación
- Todas las herramientas utilizadas son gratuitas y de código abierto
- Puede adaptarse para uso offline en el futuro
- Consulta nuestra [página de Impacto Social](/impacto-social) para oportunidades de asociación

**Recuerda:** La comunidad de programación es global y solidaria. ¡No dudes en pedir ayuda!

---

## Paso 1: Entendiendo qué vamos a instalar

Antes de empezar, vamos a entender **qué** vamos a instalar y **por qué**. Esto te ayudará a entender qué está pasando en cada paso.

### Node.js - ¿Qué es y por qué lo necesitamos?

**¿Qué es?**
Node.js es un "entorno de ejecución" para JavaScript. Piensa en él como un "motor" que permite ejecutar JavaScript fuera del navegador (en tu computadora).

**¿Por qué lo necesitamos?**
- Nuestro proyecto está hecho en JavaScript/TypeScript
- Necesitamos algo para "ejecutar" este código
- Node.js hace esto por nosotros

**Analogía simple:**
Si JavaScript es la "gasolina", Node.js es el "motor del auto". ¡Sin el motor, la gasolina no funciona!

### npm - ¿Qué es y por qué lo necesitamos?

**¿Qué es?**
npm significa "Node Package Manager" (Gestor de Paquetes de Node). Es una herramienta que viene con Node.js.

**¿Por qué lo necesitamos?**
- Nuestro proyecto usa "bibliotecas" (código hecho por otras personas)
- npm descarga e instala estas bibliotecas por nosotros
- Es como una "tienda de aplicaciones" para código

**Analogía simple:**
Si Node.js es el "motor", npm es el "mecánico" que instala las "piezas" (bibliotecas) que el motor necesita.

### Git - ¿Qué es y por qué lo necesitamos?

**¿Qué es?**
Git es un sistema de control de versiones. Permite descargar código de repositorios (como GitHub).

**¿Por qué lo necesitamos?**
- El código del proyecto está en GitHub
- Necesitamos "descargar" este código a nuestra máquina
- Git hace esto por nosotros

**Analogía simple:**
Git es como un "gestor de descargas" especializado en código. Descarga todo el proyecto para que trabajes en él.

---

## Paso 2: Instalando Node.js

### ¿Por qué instalar Node.js primero?

¡Porque es la base de todo! Sin él, nada funciona. Es como intentar conducir sin tener un auto.

### Cómo instalar (Windows)

1. **Accede al sitio oficial:**
   - Ve a: https://nodejs.org/
   - Verás dos botones: "LTS" y "Current"
   - **Haz clic en "LTS"** (Long Term Support = Soporte de Largo Plazo = más estable)

2. **Descarga el instalador:**
   - El archivo será algo como: `node-v20.x.x-x64.msi`
   - Haz doble clic en él para instalar

3. **Sigue el asistente de instalación:**
   - Haz clic en "Next" en todas las pantallas
   - **IMPORTANTE:** Deja marcada la opción "Automatically install the necessary tools"
   - Haz clic en "Install"
   - Espera a que termine la instalación

4. **Verifica que funcionó:**
   - Abre "Símbolo del sistema" (cmd) o PowerShell
   - Escribe: `node --version`
   - Deberías ver algo como: `v20.x.x`
   - Escribe: `npm --version`
   - Deberías ver algo como: `10.x.x`

   **¡Si aparecen los números, está funcionando! 🎉**

### Cómo instalar (Mac)

1. **Opción A - Usando el sitio oficial (recomendado):**
   - Ve a: https://nodejs.org/
   - Haz clic en "LTS"
   - Descarga el archivo `.pkg`
   - Abre el archivo y sigue el asistente

2. **Opción B - Usando Homebrew (si ya lo tienes):**
   ```bash
   brew install node
   ```

3. **Verifica que funcionó:**
   - Abre Terminal
   - Escribe: `node --version`
   - Escribe: `npm --version`

### Cómo instalar (Linux)

1. **Usando el gestor de paquetes (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Verifica que funcionó:**
   ```bash
   node --version
   npm --version
   ```

### ¿Qué acabamos de hacer?

Instalamos Node.js y npm. Ahora tu computadora puede:
- ✅ Ejecutar código JavaScript
- ✅ Instalar bibliotecas usando npm

---

## Paso 3: Clonando el repositorio

### ¿Qué es "clonar"?

"Clonar" significa hacer una **copia completa** del proyecto de GitHub a tu computadora. Es como descargar, pero de una forma especial que mantiene la conexión con el repositorio original.

### ¿Por qué necesitamos clonar?

Porque el código está en GitHub (en la nube) y lo necesitamos en nuestra máquina para trabajar.

### Cómo clonar (método fácil - usando GitHub Desktop)

1. **Instala GitHub Desktop:**
   - Ve a: https://desktop.github.com/
   - Descarga e instala

2. **Inicia sesión en GitHub Desktop:**
   - Usa tu cuenta de GitHub

3. **Clona el repositorio:**
   - En GitHub Desktop, haz clic en "File" > "Clone Repository"
   - Pega la URL: `https://github.com/FalcaoHS/Compile-Chill`
   - Elige dónde guardar (ej: `C:\Users\TuNombre\Documents\Compile-Chill`)
   - Haz clic en "Clone"

### Cómo clonar (método avanzado - usando Git en terminal)

1. **Abre el terminal/Símbolo del sistema**

2. **Navega hasta donde quieres guardar el proyecto:**
   ```bash
   cd Documents
   # o
   cd Desktop
   ```

3. **Clona el repositorio:**
   ```bash
   git clone https://github.com/FalcaoHS/Compile-Chill.git
   ```

4. **Entra en la carpeta del proyecto:**
   ```bash
   cd Compile-Chill
   ```

### ¿Qué acabamos de hacer?

Descargamos todo el código del proyecto a nuestra máquina. Ahora tenemos:
- ✅ Todos los archivos del proyecto
- ✅ La estructura de carpetas
- ✅ El código fuente completo

---

## Paso 4: Instalando las dependencias

### ¿Qué son las "dependencias"?

Las dependencias son **bibliotecas** (código hecho por otras personas) que nuestro proyecto necesita para funcionar. Es como piezas de un rompecabezas - cada una tiene una función específica.

### Ejemplos de dependencias de nuestro proyecto:

- **Next.js**: Framework para crear aplicaciones web
- **React**: Biblioteca para crear interfaces
- **Prisma**: Herramienta para trabajar con bases de datos
- **NextAuth**: Sistema de autenticación
- ¡Y muchas otras!

### ¿Por qué necesitamos instalarlas?

Porque estas bibliotecas no vienen con el código del proyecto. Se descargan por separado cuando instalas.

### Cómo instalar:

1. **Abre el terminal/Símbolo del sistema**

2. **Navega hasta la carpeta del proyecto:**
   ```bash
   cd Compile-Chill
   # o la ruta donde clonaste
   ```

3. **Instala las dependencias:**
   ```bash
   npm install
   ```

   **¿Qué hace este comando?**
   - Lee el archivo `package.json` (que lista todas las dependencias)
   - Descarga cada biblioteca de internet
   - Las instala en la carpeta `node_modules`
   - Puede tardar unos minutos (¡es normal!)

4. **Espera a que termine la instalación:**
   - Verás muchas líneas de texto
   - Al final, debería aparecer algo como: "added 500 packages"

### ¿Qué acabamos de hacer?

Instalamos todas las bibliotecas que el proyecto necesita. Ahora tenemos:
- ✅ Next.js instalado
- ✅ React instalado
- ✅ Prisma instalado
- ✅ Todas las otras dependencias

**Tiempo estimado:** 2-5 minutos (depende de tu internet)

**Nota para regiones con conexiones más lentas:** Si estás en Etiopía, Uganda o Tanzania y tienes internet más lenta, este paso puede tomar 10-15 minutos. ¡Esto es completamente normal! Ten paciencia y déjalo completar. La instalación funcionará de la misma manera independientemente de la velocidad de conexión.

---

## Paso 5: Configurando la base de datos

### ¿Qué es una base de datos?

Una base de datos es como una **hoja de cálculo gigante** donde guardamos información. En nuestro caso, vamos a guardar:
- Datos de usuarios
- Puntuaciones de juegos
- Historial de partidas

### ¿Por qué necesitamos una base de datos?

Porque necesitamos **guardar información** que persiste incluso después de que el servidor se apaga. ¡Sin base de datos, cada vez que cierres el proyecto, perderías todos los datos!

### ¿Qué es PostgreSQL?

PostgreSQL es un **tipo específico** de base de datos. Es gratis, confiable y muy usado. Piensa en él como un "archivador" súper organizado.

### Opciones para configurar la base de datos:

Tenemos 3 opciones. Vamos a explicar cada una:

#### Opción A: Neon (Recomendado para principiantes) ⭐

**¿Qué es Neon?**
Neon es un servicio que ofrece PostgreSQL "en la nube" (en línea). Es gratis y muy fácil de usar.

**¿Por qué es recomendado?**
- ✅ No necesitas instalar nada en tu computadora
- ✅ Funciona inmediatamente
- ✅ Gratis para empezar
- ✅ Interfaz visual fácil

**Cómo configurarlo:**

1. **Accede al sitio:**
   - Ve a: https://neon.tech/
   - Haz clic en "Sign Up" (Registrarse)

2. **Crea una cuenta:**
   - Puedes usar tu cuenta de GitHub (¡más fácil!)
   - O crear cuenta con email

3. **Crea un nuevo proyecto:**
   - Haz clic en "New Project"
   - Elige un nombre (ej: "compile-chill-dev")
   - Elige la región más cercana a ti
     - **Para Etiopía, Uganda, Tanzania:** Elige la región disponible más cercana (a menudo las regiones de Europa o Medio Oriente funcionan bien)
     - No te preocupes si la región exacta no está disponible - cualquier región funcionará
   - Haz clic en "Create Project"

4. **Copia la cadena de conexión:**
   - En la pantalla del proyecto, verás "Connection string"
   - Haz clic en "Copy" al lado de la cadena de conexión
   - Será algo como: `postgresql://usuario:contraseña@ep-xxx.neon.tech/dbname?sslmode=require`
   - **¡GUARDA ESTO!** Lo usaremos después

**¿Qué acabamos de hacer?**
Creamos una base de datos en línea que está lista para usar. ¡Es como alquilar un espacio de almacenamiento en la nube!

#### Opción B: Supabase

**¿Qué es Supabase?**
Similar a Neon, pero con más características. También es gratis y fácil.

**Cómo configurarlo:**

1. Ve a: https://supabase.com/
2. Crea una cuenta
3. Crea un nuevo proyecto
4. Ve a Settings > Database > Connection string
5. Copia la cadena de conexión

#### Opción C: PostgreSQL Local (Avanzado)

**¿Qué es?**
Instalar PostgreSQL directamente en tu computadora.

**¿Por qué no recomendamos para principiantes?**
- Más complejo de configurar
- Necesitas instalar software adicional
- Más probabilidad de errores

**Si quieres intentarlo de todas formas:**
1. Descarga PostgreSQL: https://www.postgresql.org/download/
2. Instala siguiendo el asistente
3. Crea una base de datos llamada `compileandchill`
4. Anota usuario, contraseña y puerto

---

## Paso 6: Configurando autenticación OAuth

### ¿Qué es OAuth?

OAuth es un sistema que permite **iniciar sesión usando cuentas de otros servicios**. En nuestro caso, usaremos X (Twitter) para iniciar sesión.

**¿Por qué usar OAuth?**
- ✅ El usuario no necesita crear nueva cuenta
- ✅ Más seguro (X maneja la seguridad)
- ✅ Más rápido (un clic y listo)

### ¿Qué vamos a hacer?

Vamos a crear una "aplicación" en X que permite a nuestro sitio iniciar sesión con cuentas de X.

### Paso a paso detallado:

#### 1. Acceder al Portal de Desarrolladores de Twitter

1. **Accede:**
   - Ve a: https://developer.twitter.com/en/portal/dashboard
   - Inicia sesión con tu cuenta de X (Twitter)

2. **¿Qué es este portal?**
   - Es un panel donde los desarrolladores crean "apps" (aplicaciones)
   - Nuestra "app" será Compile & Chill
   - X nos dará "credenciales" (claves) para iniciar sesión

#### 2. Crear un proyecto (si no tienes uno)

1. **Haz clic en "Create Project"**
2. **Completa:**
   - **Project name:** Compile & Chill (o cualquier nombre)
   - **Use case:** Elige "Making a bot" o "Exploring the API"
   - **Description:** Portal de juegos para desarrolladores
3. **Haz clic en "Next"**
4. **Acepta los términos**
5. **Haz clic en "Create Project"**

#### 3. Crear una App dentro del proyecto

1. **Dentro del proyecto, haz clic en "Add App"**
2. **Completa:**
   - **App name:** compile-chill-dev (o cualquier nombre)
   - **Description:** App de desarrollo para Compile & Chill
3. **Haz clic en "Create App"**

#### 4. Configurar OAuth 2.0 (¡MUY IMPORTANTE!)

**¿Por qué es importante este paso?**
Sin configurar OAuth 2.0, no tendremos las credenciales correctas para hacer que el inicio de sesión funcione.

1. **En la página de la App, haz clic en la pestaña "Settings"** (al lado de "Keys and tokens")

2. **Busca "User authentication settings"**
   - Puede estar escrito "OAuth 2.0 Settings"
   - Haz clic en "Set up" o "Edit"

3. **Configura:**
   - **Type of App:** Selecciona "Web App, Automated App or Bot"
   - **App permissions:** Deja "Read" seleccionado
   - **Callback URI / Redirect URL:** `http://localhost:3000/api/auth/callback/twitter`
     - ⚠️ **IMPORTANTE:** ¡Copia exactamente esto, sin espacios!
   - **Website URL:** `http://localhost:3000`
     - Si no acepta, prueba `http://127.0.0.1:3000`
     - O déjalo en blanco si es opcional

4. **Haz clic en "Save"**
   - ⚠️ **MUY IMPORTANTE:** ¡Guarda! Sin guardar, las credenciales no aparecen!

#### 5. Obtener las credenciales OAuth 2.0

**¿Por qué necesitamos estas credenciales?**
Son como "claves" que permiten a nuestro sitio comunicarse con X para iniciar sesión.

1. **Vuelve a la pestaña "Keys and tokens"**

2. **Busca la sección "OAuth 2.0 Client ID and Client Secret"**
   - ⚠️ **ATENCIÓN:** ¡No uses "API Key" o "Bearer Token"!
   - Necesitas específicamente "OAuth 2.0 Client ID" y "OAuth 2.0 Client Secret"

3. **Copia las credenciales:**
   - **Client ID:** Será algo como `abc123xyz...`
   - **Client Secret:** Haz clic en "Reveal" para ver, será algo como `def456uvw...`
   - **¡GUARDA ESTAS CREDENCIALES!** Las usaremos en el siguiente paso

**¿Qué acabamos de hacer?**
Creamos una "aplicación" en X que permite a nuestro sitio iniciar sesión. ¡Es como crear una "clave" que permite a nuestro sitio acceder a información básica de la cuenta de X del usuario!

---

## Paso 7: Configurando variables de entorno

### ¿Qué son las variables de entorno?

Las variables de entorno son **configuraciones secretas** que el proyecto necesita, pero que no deben compartirse públicamente. Es como contraseñas y claves que se guardan en una caja fuerte.

### ¿Por qué usamos variables de entorno?

Porque alguna información es **sensible** (como contraseñas de base de datos) y no debe estar en el código que va a GitHub. Las variables de entorno se quedan solo en tu máquina.

### ¿Qué vamos a configurar?

Vamos a crear un archivo `.env` (punto env) con todas las configuraciones que el proyecto necesita.

### Paso a paso:

1. **En la carpeta del proyecto, crea un archivo llamado `.env`**
   - ⚠️ **IMPORTANTE:** ¡El nombre debe ser exactamente `.env` (con el punto al inicio)!
   - En Windows, puede ser difícil crear archivo que empiece con punto
   - Solución: Usa un editor de texto (VS Code, Notepad++) y guarda como `.env`

2. **Abre el archivo `.env` y pega lo siguiente:**

```env
# ============================================
# CONFIGURACIÓN DE LA BASE DE DATOS
# ============================================
# Pega aquí la cadena de conexión que copiaste de Neon/Supabase
# Ejemplo: postgresql://usuario:contraseña@ep-xxx.neon.tech/dbname?sslmode=require
DATABASE_URL="pega-aquí-tu-cadena-de-conexión-de-neon"

# ============================================
# CONFIGURACIÓN DE NEXTAUTH (Sistema de Autenticación)
# ============================================
# URL donde el proyecto va a correr (desarrollo local)
NEXTAUTH_URL="http://localhost:3000"

# Clave secreta para encriptar sesiones
# Genera una usando: openssl rand -base64 32
# O usa: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="pega-aquí-el-secret-generado"

# ============================================
# CREDENCIALES DE X (TWITTER) OAuth
# ============================================
# Pega aquí las credenciales OAuth 2.0 que obtuviste en el paso 6
X_CLIENT_ID="pega-aquí-el-client-id-de-twitter"
X_CLIENT_SECRET="pega-aquí-el-client-secret-de-twitter"

# ============================================
# UPSTASH REDIS (Opcional para desarrollo)
# ============================================
# Rate limiting - previene abuso del sistema
# Si no quieres configurar ahora, déjalo vacío
# El sistema funcionará, pero sin rate limiting
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

3. **Completa cada variable:**

   **a) DATABASE_URL:**
   - Pega la cadena de conexión que copiaste de Neon
   - Debe quedar entre comillas: `DATABASE_URL="postgresql://..."`

   **b) NEXTAUTH_SECRET:**
   - Genera una clave secreta:
     - **Windows (PowerShell):**
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
       ```
     - **Mac/Linux:**
       ```bash
       openssl rand -base64 32
       ```
     - **En línea (si no tienes openssl):**
       - Ve a: https://generate-secret.vercel.app/32
       - Copia la cadena generada
   - Pega en `.env` entre comillas

   **c) X_CLIENT_ID y X_CLIENT_SECRET:**
   - Pega las credenciales que obtuviste en el paso 6
   - Cada una entre comillas

4. **Guarda el archivo**

### ¿Qué hace cada variable? (Explicación detallada)

**DATABASE_URL:**
- Es la "dirección" de la base de datos
- Contiene usuario, contraseña, servidor y nombre de la base de datos
- Prisma usa esto para conectarse a la base de datos

**NEXTAUTH_URL:**
- Es la URL donde el proyecto corre
- En desarrollo: `http://localhost:3000`
- En producción: sería `https://tu-dominio.com`

**NEXTAUTH_SECRET:**
- Es una clave secreta para encriptar sesiones de usuarios
- Como una "contraseña maestra" que protege los inicios de sesión
- Debe ser única y segura (por eso la generamos aleatoriamente)

**X_CLIENT_ID y X_CLIENT_SECRET:**
- Son las "credenciales" que X nos dio
- Permiten a nuestro sitio comunicarse con X
- Como un "usuario y contraseña" para acceder a la API de X

**UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN:**
- Son para rate limiting (limitar solicitudes)
- Previenen que alguien abuse del sistema
- Opcionales para desarrollo

### ⚠️ IMPORTANTE: Seguridad

- ❌ **NUNCA** hagas commit del archivo `.env` en GitHub!
- ✅ El archivo `.gitignore` ya está configurado para ignorar `.env`
- ✅ Mantén tus credenciales seguras
- ✅ Usa credenciales diferentes para desarrollo y producción

---

## Paso 8: Configurando la base de datos

### ¿Qué vamos a hacer?

Vamos a crear las **tablas** en la base de datos. Las tablas son como "hojas de cálculo" donde guardamos datos organizados.

### ¿Por qué necesitamos hacer esto?

Porque la base de datos empieza vacía. Necesitamos crear la estructura (tablas) antes de poder guardar datos.

### ¿Qué son las "migrations"?

Las migrations son "scripts" que crean o modifican la estructura de la base de datos. Es como un "proyecto de construcción" que dice dónde poner cada cosa.

### Paso a paso:

1. **Abre el terminal en la carpeta del proyecto**

2. **Ejecuta el comando de migration:**
   ```bash
   npx prisma migrate dev
   ```

   **¿Qué hace este comando?**
   - Lee el archivo `prisma/schema.prisma` (que define la estructura)
   - Crea las tablas en la base de datos
   - Aplica índices (para búsquedas rápidas)
   - Crea relaciones entre tablas
   - Genera Prisma Client automáticamente

3. **Cuando pregunte el nombre de la migration:**
   - Escribe algo como: `init` o `initial_setup`
   - Presiona Enter

4. **Espera a que termine:**
   - Verás mensajes como "Creating migration..."
   - Al final, debería aparecer "Migration applied successfully"

### ¿Qué se creó?

Prisma creó estas tablas en la base de datos:

- **users**: Guarda datos de usuarios (nombre, avatar, etc.)
- **accounts**: Guarda información de autenticación OAuth
- **sessions**: Guarda sesiones de usuarios iniciados
- **scores**: Guarda puntuaciones de juegos
- **score_validation_fails**: Guarda intentos de trampa bloqueados

### Si da error:

**Error: "Can't reach database server"**
- Verifica que `DATABASE_URL` en `.env` sea correcta
- Verifica que copiaste la cadena de conexión completa
- Prueba la conexión en el panel de Neon

**Error: "P1001: Can't reach database server"**
- La base de datos puede estar pausada (Neon pausa después de inactividad)
- Accede al panel de Neon y "resume" el proyecto
- Intenta de nuevo

**Error: "Migration failed"**
- Verifica que no haya otra migration pendiente
- Prueba: `npx prisma migrate reset` (¡cuidado: borra datos!)
- O: `npx prisma db push` (alternativa más simple)

### Generar Prisma Client (si es necesario):

Si Prisma Client no se generó automáticamente:

```bash
npx prisma generate
```

**¿Qué es Prisma Client?**
Es un "cliente" (herramienta) que permite a nuestro código JavaScript hablar con la base de datos. Es como un "traductor" entre JavaScript y SQL.

---

## Paso 9: Ejecutando el proyecto

### ¡Llegó el momento! 🎉

¡Ahora vamos a **ejecutar el proyecto** y ver todo funcionando!

### Paso a paso:

1. **Abre el terminal en la carpeta del proyecto**

2. **Ejecuta el comando de desarrollo:**
   ```bash
   npm run dev
   ```

   **¿Qué hace este comando?**
   - Inicia el servidor de desarrollo
   - Compila el código TypeScript a JavaScript
   - Se queda "escuchando" cambios en los archivos
   - Cuando guardas un archivo, recarga automáticamente

3. **Espera a que compile:**
   - Verás muchas líneas de texto
   - Busca: "Ready" o "Local: http://localhost:3000"
   - ¡Cuando aparezca, está listo!

4. **Abre el navegador:**
   - Ve a: http://localhost:3000
   - ¡Deberías ver la página inicial de Compile & Chill!

### ¿Qué deberías ver?

- ✅ Página inicial con lista de juegos
- ✅ Header con botón "Iniciar sesión con X"
- ✅ ¡Todo funcionando!

### Probando el inicio de sesión:

1. **Haz clic en "Iniciar sesión con X"**
2. **Serás redirigido a X**
3. **Autoriza la aplicación**
4. **Serás redirigido de vuelta**
5. **¡Deberías ver tu perfil en el header!**

### Si algo no funciona:

¡Ve la sección [Solución de problemas](#solución-de-problemas) abajo!

---

## Conceptos importantes explicados

### ¿Qué es Next.js?

**Next.js** es un framework (estructura) para crear aplicaciones web con React. Facilita:
- Enrutamiento (navegación entre páginas)
- Renderizado en el servidor
- Optimizaciones automáticas

**Analogía:** Si React es el "motor", Next.js es el "auto completo" con todas las piezas ya montadas.

### ¿Qué es React?

**React** es una biblioteca para crear interfaces de usuario. Permite crear componentes reutilizables.

**Analogía:** React es como "bloques de LEGO" - montas piezas pequeñas para hacer algo grande.

### ¿Qué es TypeScript?

**TypeScript** es JavaScript con "tipos". Ayuda a encontrar errores antes de ejecutar el código.

**Analogía:** Si JavaScript es escribir a mano, TypeScript es usar un corrector ortográfico.

### ¿Qué es Prisma?

**Prisma** es una herramienta que facilita trabajar con bases de datos. Traduce JavaScript a SQL automáticamente.

**Analogía:** Prisma es como un "traductor" que convierte JavaScript en comandos de base de datos.

### ¿Qué es NextAuth?

**NextAuth** es un sistema de autenticación. Maneja inicio de sesión, sesiones y seguridad.

**Analogía:** NextAuth es como un "portero" que verifica si puedes entrar y te da un "pase" (sesión).

### ¿Qué son las migrations?

**Migrations** son scripts que modifican la estructura de la base de datos de forma controlada y reversible.

**Analogía:** Las migrations son como "versiones" de la base de datos. Cada migration agrega o modifica algo.

---

## Solución de problemas

### Error: "Cannot find module"

**Causa:** Dependencias no instaladas.

**Solución:**
```bash
npm install
```

### Error: "Port 3000 is already in use"

**Causa:** Otro proceso está usando el puerto 3000.

**Solución:**
- Cierra otros proyectos Next.js
- O cambia el puerto: `npm run dev -- -p 3001`

### Error: "DATABASE_URL is missing"

**Causa:** Archivo `.env` no existe o es incorrecto.

**Solución:**
- Verifica que el archivo `.env` exista en la raíz del proyecto
- Verifica que `DATABASE_URL` esté definida
- Reinicia el servidor después de crear/editar `.env`

### Error: "Invalid credentials" en el inicio de sesión

**Causa:** Credenciales OAuth incorrectas o Callback URL errónea.

**Solución:**
1. Verifica que estés usando credenciales OAuth 2.0 (no API Key)
2. Verifica que el Callback URL en Twitter sea: `http://localhost:3000/api/auth/callback/twitter`
3. Reinicia el servidor después de cambiar `.env`

### Error: "Prisma Client not generated"

**Causa:** Prisma Client no fue generado.

**Solución:**
```bash
npx prisma generate
```

### Error: "Migration failed"

**Causa:** Problema con la conexión o estructura de la base de datos.

**Solución:**
```bash
npx prisma db push
```
Esto aplica el schema directamente sin crear migration.

### El proyecto no carga en el navegador

**Causa:** El servidor no inició correctamente.

**Solución:**
1. Detén el servidor (Ctrl+C)
2. Limpia la caché: `rm -rf .next` (Mac/Linux) o `rmdir /s .next` (Windows)
3. Reinstala dependencias: `rm -rf node_modules && npm install`
4. Intenta de nuevo: `npm run dev`

### Error de compilación TypeScript

**Causa:** Errores de tipo en el código.

**Solución:**
```bash
npm run type-check
```
Esto muestra todos los errores de tipo. Corrígelos antes de ejecutar.

---

## 🎉 ¡Felicitaciones!

Si llegaste hasta aquí y el proyecto está corriendo, **¡lo lograste!** 🎊

### Lo que aprendiste:

- ✅ Cómo instalar y usar Node.js
- ✅ Cómo clonar proyectos de GitHub
- ✅ Cómo instalar dependencias
- ✅ Cómo configurar una base de datos
- ✅ Cómo configurar autenticación OAuth
- ✅ Cómo usar variables de entorno
- ✅ Cómo ejecutar un proyecto Next.js

### Próximos pasos:

1. **Explora el código:** Abre los archivos y ve cómo funciona
2. **Haz cambios:** Intenta modificar algo y ve el resultado
3. **Lee la documentación:** Cada biblioteca tiene documentación excelente
4. **Practica:** ¡Cuanto más practiques, más aprendes!

### Recuerda:

- ❌ **¡No tengas miedo de equivocarte!** Los errores son parte del aprendizaje
- ✅ **¡Pregunta!** La comunidad está aquí para ayudar
- ✅ **¡Investiga!** Google y Stack Overflow son tus amigos
- ✅ **¡Practica!** La práctica lleva a la perfección

### ¿Necesitas ayuda?

- Abre un issue en GitHub
- Lee la documentación oficial
- Pregunta en la comunidad
- **Para desarrolladores en Etiopía, Uganda, Tanzania:** Consulta nuestra [página de Impacto Social](/impacto-social) para apoyo regional y oportunidades de asociación

### Contribuyendo al Acceso Regional

Si eres desarrollador, traductor o educador en Etiopía, Uganda o Tanzania, considera:
- Traducir documentación a idiomas locales (Amárico, Suajili)
- Crear tutoriales específicos para desafíos regionales
- Conectar con ONGs locales y escuelas para distribuir este contenido
- Consulta nuestra [página de Impacto Social](/impacto-social) para más formas de contribuir

**¡Puedes hacerlo! ¡Sigue aprendiendo! 🚀**

---

*Esta guía fue hecha con mucho cariño para ayudarte a empezar. Si tienes sugerencias de mejora, ¡por favor comparte!*

