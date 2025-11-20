# ============================================
# Compile & Chill - Variables de Entorno
# ============================================
# 
# INSTRUCCIONES:
# 1. Copia este archivo a .env en la raÃ­z del proyecto
# 2. Reemplaza los valores de ejemplo con tus valores reales
# 3. NUNCA commitees el archivo .env en Git (ya estÃ¡ en .gitignore)
#
# ============================================

# ============================================
# ConexiÃ³n a Base de Datos
# ============================================
# Cadena de conexiÃ³n PostgreSQL
# Ejemplo con Neon: postgresql://usuario:contraseÃ±a@ep-xxx-xxx.us-east-2.aws.neon.tech/compileandchill?sslmode=require
# Ejemplo local: postgresql://usuario:contraseÃ±a@localhost:5432/compileandchill?schema=public
DATABASE_URL="postgresql://usuario:contraseÃ±a@localhost:5432/compileandchill?schema=public"

# ============================================
# ConfiguraciÃ³n NextAuth
# ============================================
# URL base de la aplicaciÃ³n
# Desarrollo: http://localhost:3000
# ProducciÃ³n: https://tu-dominio.com
NEXTAUTH_URL="http://localhost:3000"

# Secret para cifrado de sesiones
# Genera con: openssl rand -base64 32
# O usa: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="pega-aqui-el-secret-generado-con-openssl-o-herramienta-online"

# ============================================
# Credenciales OAuth 2.0 de X (Twitter)
# ============================================
# ObtÃ©n estas credenciales en: https://developer.twitter.com/en/portal/dashboard
# IMPORTANTE: Usa las credenciales OAuth 2.0 (no API Key/Secret)
# Configura el Callback URI: http://localhost:3000/api/auth/callback/twitter
X_CLIENT_ID="pega-aqui-el-oauth-2-0-client-id-de-twitter"
X_CLIENT_SECRET="pega-aqui-el-oauth-2-0-client-secret-de-twitter"

# ============================================
# Upstash Redis (Rate Limiting)
# ============================================
# Opcional para desarrollo, recomendado para producciÃ³n
# ObtÃ©n en: https://upstash.com/
# Crea una base de datos Redis y copia la URL y Token
UPSTASH_REDIS_REST_URL="pega-aqui-la-url-de-upstash-redis"
UPSTASH_REDIS_REST_TOKEN="pega-aqui-el-token-de-upstash-redis"

# ============================================
# Entorno Node
# ============================================
# AutomÃ¡tico en producciÃ³n (Vercel), pero puede definirse manualmente
# NODE_ENV="development"  # o "production"
