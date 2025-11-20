# ============================================
# Compile & Chill - Vigezo vya Mazingira
# ============================================
# 
# MAELEKEZO:
# 1. Nakili faili hii kwa .env katika mizizi ya mradi
# 2. Badilisha maadili ya mfano na maadili yako halisi
# 3. KAMWE usiweke faili .env kwenye Git (tayari iko kwenye .gitignore)
#
# ============================================

# ============================================
# Muunganisho wa Hifadhidata
# ============================================
# Mfuatano wa muunganisho wa PostgreSQL
# Mfano na Neon: postgresql://mtumiaji:nenosiri@ep-xxx-xxx.us-east-2.aws.neon.tech/compileandchill?sslmode=require
# Mfano wa ndani: postgresql://mtumiaji:nenosiri@localhost:5432/compileandchill?schema=public
DATABASE_URL="postgresql://mtumiaji:nenosiri@localhost:5432/compileandchill?schema=public"

# ============================================
# Usanidi wa NextAuth
# ============================================
# URL ya msingi ya programu
# Maendeleo: http://localhost:3000
# Uzalishaji: https://kikoa-chako.com
NEXTAUTH_URL="http://localhost:3000"

# Siri ya usimbaji wa vikao
# Tengeneza na: openssl rand -base64 32
# Au tumia: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="weka-hapa-siri-iliyotengenezwa-na-openssl-au-zana-ya-wavuti"

# ============================================
# Hati za OAuth 2.0 za X (Twitter)
# ============================================
# Pata hati hizi kwenye: https://developer.twitter.com/en/portal/dashboard
# MUHIMU: Tumia hati za OAuth 2.0 (sio API Key/Secret)
# Sanidi Callback URI: http://localhost:3000/api/auth/callback/twitter
X_CLIENT_ID="weka-hapa-oauth-2-0-client-id-kutoka-twitter"
X_CLIENT_SECRET="weka-hapa-oauth-2-0-client-secret-kutoka-twitter"

# ============================================
# Upstash Redis (Kikomo cha Kiwango)
# ============================================
# Hiari kwa maendeleo, inapendekezwa kwa uzalishaji
# Pata kwenye: https://upstash.com/
# Unda hifadhidata ya Redis na nakili URL na Token
UPSTASH_REDIS_REST_URL="weka-hapa-url-ya-upstash-redis"
UPSTASH_REDIS_REST_TOKEN="weka-hapa-token-ya-upstash-redis"

# ============================================
# Mazingira ya Node
# ============================================
# Otomatiki katika uzalishaji (Vercel), lakini inaweza kuwekwa kwa mikono
# NODE_ENV="development"  # au "production"
