# 🎓 Mwongozo Kamili wa Mwanzo - Compile & Chill

> **Usiwe na wasiwasi!** Mwongozo huu umeundwa hasa kwa wewe unaanza tu. Tutaeleza KILA KITU, hatua kwa hatua, kwa utulivu. Mwishowe, utakuwa na mradi ukiendesha ndani ya kompyuta yako na utaelewa kila kitu kinachofanya! 🚀

## 📚 Orodha ya Yaliyomo

1. [Kwa nini mwongozo huu upo?](#kwa-nini-mwongozo-huu-upo)
2. [Utajifunza nini](#utajifunza-nini)
3. [Mahitaji (unachohitaji)](#mahitaji)
4. [Hatua ya 1: Kuelewa tutaweka nini](#hatua-ya-1-kuelewa-tutaweka-nini)
5. [Hatua ya 2: Kuweka Node.js](#hatua-ya-2-kuweka-nodejs)
6. [Hatua ya 3: Kuiga repository](#hatua-ya-3-kuiga-repository)
7. [Hatua ya 4: Kuweka dependencies](#hatua-ya-4-kuweka-dependencies)
8. [Hatua ya 5: Kuweka database](#hatua-ya-5-kuweka-database)
9. [Hatua ya 6: Kuweka OAuth authentication](#hatua-ya-6-kuweka-oauth-authentication)
10. [Hatua ya 7: Kuweka environment variables](#hatua-ya-7-kuweka-environment-variables)
11. [Hatua ya 8: Kuweka database](#hatua-ya-8-kuweka-database)
12. [Hatua ya 9: Kuendesha mradi](#hatua-ya-9-kuendesha-mradi)
13. [Dhana muhimu zilizo elezwa](#dhana-muhimu-zilizo-elezwa)
14. [Kutatua matatizo](#kutatua-matatizo)

---

## Kwa nini mwongozo huu upo?

Mwongozo huu umeundwa kwa sababu tunaamini **kila mtu anaweza kujifunza programu**, mradi awe na:
- ✅ Subira
- ✅ Hamu ya kujifunza
- ✅ Mwongozo ulioelezwa vizuri (ambao ni huu!)

**Huhitaji kuwa mtaalamu!** Mwongozo huu unachukulia unaanza tu na unaeleza kila dhana kutoka mwanzo.

---

## Utajifunza nini

Mwisho wa mwongozo huu, utajua:
- ✅ Kuelewa Node.js ni nini na kwa nini tunahitaji
- ✅ Kujua dependencies ni nini na zinavyofanya kazi
- ✅ Kuelewa database ni nini na kwa nini tunatumia PostgreSQL
- ✅ Kuelewa OAuth authentication (kuingia na X/Twitter)
- ✅ Kujua environment variables ni nini na kwa nini ni muhimu
- ✅ Kuwa na mradi ukiendesha ndani ya kompyuta yako!

---

## Mahitaji

### Unachohitaji kuwa nacho:

1. **Kompyuta** (Windows, Mac, au Linux)
2. **Muunganisho wa intaneti**
3. **Akaunti ya GitHub** (bure, tutaunda ikiwa huna)
4. **Akaunti ya X (Twitter)** (kwa authentication)
5. **Subira na hamu ya kujifunza!** 😊

### Unachohitaji kuwa nacho:

- ❌ Ujuzi wa juu wa programu
- ❌ Uzoefu wa awali na Node.js
- ❌ Kuendesha miradi hapo awali
- ❌ Kujua database ni nini

**Utajifunza yote haya hapa!**

### Kuzingatia Maalum kwa Maeneo yenye Ufikiaji Mdogo wa Dijitali

Mwongozo huu umeundwa kuwa wa ufikiaji kwa watengenezaji, waalimu, na wanafunzi nchini **Ethiopia, Uganda, na Tanzania**, ambapo ufikiaji wa dijitali unaweza kuwa mdogo. Hapa kuna vidokezo:

**Ikiwa una intaneti ya polepole au isiyo imara:**
- Pakua Node.js installer wakati wa masaa yasiyo na watu wengi iwezekanavyo
- Fikiria kutumia download manager kwa faili kubwa
- Hatua ya `npm install` inaweza kuchukua muda mrefu - hii ni ya kawaida, kuwa na subira
- Huduma za database za wingu (Neon, Supabase) zinafanya kazi vizuri hata na muunganisho wa polepole

**Ikiwa una data ndogo:**
- Tumia database za wingu (Neon/Supabase) badala ya PostgreSQL ya ndani ili kuokoa bandwidth
- Mradi umeundwa kufanya kazi kwa ufanisi na rasilimali ndogo
- Fikiria kutumia "Data Economy Mode" inapopatikana (kipengele kilicho na mpango)

**Ikiwa uko katika taasisi ya elimu au NGO:**
- Mradi huu ni bora kwa kufundisha dhana za programu
- Zana zote zilizotumika ni bure na open-source
- Inaweza kubadilishwa kwa matumizi ya nje ya intaneti baadaye
- Angalia [ukurasa wetu wa Impact Social](/impacto-social) kwa fursa za ushirikiano

**Kumbuka:** Jumuiya ya programu ni ya kimataifa na inasaidia. Usisite kuuliza msaada!

---

## Hatua ya 1: Kuelewa tutaweka nini

Kabla ya kuanza, tuelewe **tutaweka nini** na **kwa nini**. Hii itakusaidia kuelewa kinachotokea katika kila hatua.

### Node.js - Ni nini na kwa nini tunahitaji?

**Ni nini?**
Node.js ni "runtime environment" ya JavaScript. Fikiria kama "engine" inayoruhusu kuendesha JavaScript nje ya browser (kwenye kompyuta yako).

**Kwa nini tunahitaji?**
- Mradi wetu umeundwa kwa JavaScript/TypeScript
- Tunahitaji kitu cha "kuendesha" code hii
- Node.js hufanya hii kwa ajili yetu

**Mfano rahisi:**
Ikiwa JavaScript ni "mafuta", Node.js ni "engine ya gari". Bila engine, mafuta hayafanyi kazi!

### npm - Ni nini na kwa nini tunahitaji?

**Ni nini?**
npm inamaanisha "Node Package Manager". Ni zana inayokuja na Node.js.

**Kwa nini tunahitaji?**
- Mradi wetu unatumia "libraries" (code iliyotengenezwa na watu wengine)
- npm inapakua na kuweka libraries hizi kwa ajili yetu
- Ni kama "duka la programu" kwa code

**Mfano rahisi:**
Ikiwa Node.js ni "engine", npm ni "fundi" anaye weka "sehemu" (libraries) ambazo engine inahitaji.

### Git - Ni nini na kwa nini tunahitaji?

**Ni nini?**
Git ni mfumo wa udhibiti wa toleo. Inaruhusu kupakua code kutoka repositories (kama GitHub).

**Kwa nini tunahitaji?**
- Code ya mradi iko kwenye GitHub
- Tunahitaji "kupakua" code hii kwenye mashine yetu
- Git hufanya hii kwa ajili yetu

**Mfano rahisi:**
Git ni kama "download manager" maalum kwa code. Inapakua mradi mzima ili uweze kufanya kazi.

---

## Hatua ya 2: Kuweka Node.js

### Kwa nini kuweka Node.js kwanza?

Kwa sababu ndio msingi wa kila kitu! Bila hii, hakuna kitu kinachofanya kazi. Ni kama kujaribu kuendesha gari bila kuwa na gari.

### Jinsi ya kuweka (Windows)

1. **Tembelea tovuti rasmi:**
   - Nenda: https://nodejs.org/
   - Utaona vitufe viwili: "LTS" na "Current"
   - **Bofya "LTS"** (Long Term Support = imara zaidi)

2. **Pakua installer:**
   - Faili itakuwa kitu kama: `node-v20.x.x-x64.msi`
   - Bofya mara mbili ili kuweka

3. **Fuata wizard ya uwekaji:**
   - Bofya "Next" kwenye skrini zote
   - **MUHIMU:** Weka alama chaguo "Automatically install the necessary tools"
   - Bofya "Install"
   - Subiri uwekaji ukomae

4. **Thibitisha ilifanya kazi:**
   - Fungua "Command Prompt" (cmd) au PowerShell
   - Andika: `node --version`
   - Unapaswa kuona kitu kama: `v20.x.x`
   - Andika: `npm --version`
   - Unapaswa kuona kitu kama: `10.x.x`

   **Ikiwa unaona nambari, inafanya kazi! 🎉**

### Jinsi ya kuweka (Mac)

1. **Chaguo A - Kwa kutumia tovuti rasmi (inapendekezwa):**
   - Nenda: https://nodejs.org/
   - Bofya "LTS"
   - Pakua faili `.pkg`
   - Fungua faili na fuata wizard

2. **Chaguo B - Kwa kutumia Homebrew (ikiwa tayari unayo):**
   ```bash
   brew install node
   ```

3. **Thibitisha ilifanya kazi:**
   - Fungua Terminal
   - Andika: `node --version`
   - Andika: `npm --version`

### Jinsi ya kuweka (Linux)

1. **Kwa kutumia package manager (Ubuntu/Debian):**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Thibitisha ilifanya kazi:**
   ```bash
   node --version
   npm --version
   ```

### Tulifanya nini?

Tuliweka Node.js na npm. Sasa kompyuta yako inaweza:
- ✅ Kuendesha JavaScript code
- ✅ Kuweka libraries kwa kutumia npm

---

## Hatua ya 3: Kuiga repository

### "Cloning" ni nini?

"Cloning" inamaanisha kutengeneza **nakala kamili** ya mradi kutoka GitHub hadi kompyuta yako. Ni kama kupakua, lakini kwa njia maalum inayodumisha muunganisho na repository ya asili.

### Kwa nini tunahitaji kuiga?

Kwa sababu code iko kwenye GitHub (kwenye wingu) na tunahitaji kwenye mashine yetu ili kufanya kazi.

### Jinsi ya kuiga (njia rahisi - kwa kutumia GitHub Desktop)

1. **Weka GitHub Desktop:**
   - Nenda: https://desktop.github.com/
   - Pakua na uweke

2. **Ingia kwenye GitHub Desktop:**
   - Tumia akaunti yako ya GitHub

3. **Iga repository:**
   - Kwenye GitHub Desktop, bofya "File" > "Clone Repository"
   - Bandika URL: `https://github.com/FalcaoHS/Compile-Chill`
   - Chagua mahali pa kuokoa (mfano: `C:\Users\YourName\Documents\Compile-Chill`)
   - Bofya "Clone"

### Jinsi ya kuiga (njia ya juu - kwa kutumia Git kwenye terminal)

1. **Fungua terminal/Command Prompt**

2. **Nenda mahali unapotaka kuokoa mradi:**
   ```bash
   cd Documents
   # au
   cd Desktop
   ```

3. **Iga repository:**
   ```bash
   git clone https://github.com/FalcaoHS/Compile-Chill.git
   ```

4. **Ingia kwenye folda ya mradi:**
   ```bash
   cd Compile-Chill
   ```

### Tulifanya nini?

Tulipakua code yote ya mradi kwenye mashine yetu. Sasa tuna:
- ✅ Faili zote za mradi
- ✅ Muundo wa folda
- ✅ Code kamili ya chanzo

---

## Hatua ya 4: Kuweka dependencies

### "Dependencies" ni nini?

Dependencies ni **libraries** (code iliyotengenezwa na watu wengine) ambazo mradi wetu unahitaji ili kufanya kazi. Ni kama vipande vya puzzle - kila kimoja kina kazi maalum.

### Mifano ya dependencies za mradi wetu:

- **Next.js**: Framework ya kutengeneza programu za wavuti
- **React**: Library ya kutengeneza interfaces
- **Prisma**: Zana ya kufanya kazi na database
- **NextAuth**: Mfumo wa authentication
- Na nyingine nyingi!

### Kwa nini tunahitaji kuweka?

Kwa sababu libraries hizi hazikuja na code ya mradi. Zinapakuliwa tofauti unapokuweka.

### Jinsi ya kuweka:

1. **Fungua terminal/Command Prompt**

2. **Nenda kwenye folda ya mradi:**
   ```bash
   cd Compile-Chill
   # au njia ambapo uliiga
   ```

3. **Weka dependencies:**
   ```bash
   npm install
   ```

   **Amri hii inafanya nini?**
   - Inasoma faili `package.json` (ambayo inaorodhesha dependencies zote)
   - Inapakua kila library kutoka intaneti
   - Inaweka kwenye folda `node_modules`
   - Inaweza kuchukua dakika chache (hii ni ya kawaida!)

4. **Subiri uwekaji ukomae:**
   - Utaona mistari mingi ya maandishi
   - Mwisho, unapaswa kuona kitu kama: "added 500 packages"

### Tulifanya nini?

Tuliweka libraries zote ambazo mradi unahitaji. Sasa tuna:
- ✅ Next.js imewekwa
- ✅ React imewekwa
- ✅ Prisma imewekwa
- ✅ Dependencies zote zingine

**Muda unaotarajiwa:** dakika 2-5 (inategemea intaneti yako)

**Kumbuka kwa maeneo yenye muunganisho wa polepole:** Ikiwa uko Ethiopia, Uganda, au Tanzania na una intaneti ya polepole, hatua hii inaweza kuchukua dakika 10-15. Hii ni ya kawaida kabisa! Kuwa na subira na uache ikome. Uwekaji utafanya kazi kwa njia ile ile bila kujali kasi ya muunganisho.

---

## Hatua ya 5: Kuweka database

### Database ni nini?

Database ni kama **spreadsheet kubwa** ambapo tunahifadhi taarifa. Katika kesi yetu, tutahifadhi:
- Data za watumiaji
- Alama za michezo
- Historia ya mechi

### Kwa nini tunahitaji database?

Kwa sababu tunahitaji **kuhifadhi taarifa** zinazoendelea hata baada ya server kuzima. Bila database, kila wakati unapofunga mradi, ungepoteza data zote!

### PostgreSQL ni nini?

PostgreSQL ni **aina maalum** ya database. Ni bure, imara, na inatumika sana. Fikiria kama "kabati la faili" lenye utaratibu mkubwa.

### Chaguzi za kuweka database:

Tuna chaguzi 3. Hebu tueleze kila moja:

#### Chaguo A: Neon (Inapendekezwa kwa wanaoanza) ⭐

**Neon ni nini?**
Neon ni huduma inayotoa PostgreSQL "kwenye wingu" (mtandaoni). Ni bure na rahisi sana kutumia.

**Kwa nini inapendekezwa?**
- ✅ Huhitaji kuweka chochote kwenye kompyuta yako
- ✅ Inafanya kazi mara moja
- ✅ Bure kuanza
- ✅ Interface rahisi ya kuona

**Jinsi ya kuweka:**

1. **Tembelea tovuti:**
   - Nenda: https://neon.tech/
   - Bofya "Sign Up"

2. **Tengeneza akaunti:**
   - Unaweza kutumia akaunti yako ya GitHub (rahisi zaidi!)
   - Au tengeneza akaunti na email

3. **Tengeneza mradi mpya:**
   - Bofya "New Project"
   - Chagua jina (mfano: "compile-chill-dev")
   - Chagua eneo karibu nawe
     - **Kwa Ethiopia, Uganda, Tanzania:** Chagua eneo linalopatikana karibu zaidi (mara nyingi maeneo ya Ulaya au Middle East yanafanya kazi vizuri)
     - Usiwe na wasiwasi ikiwa eneo halipo hasa - eneo lolote litafanya kazi
   - Bofya "Create Project"

4. **Nakili connection string:**
   - Kwenye skrini ya mradi, utaona "Connection string"
   - Bofya "Copy" karibu na connection string
   - Itakuwa kitu kama: `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`
   - **HIFADHI HII!** Tutaitumia baadaye

**Tulifanya nini?**
Tulitengeneza database ya mtandaoni iliyo tayari kutumika. Ni kama kukodisha nafasi ya wingu!

#### Chaguo B: Supabase

**Supabase ni nini?**
Sawa na Neon, lakini na vipengele vingi zaidi. Pia bure na rahisi.

**Jinsi ya kuweka:**

1. Tembelea: https://supabase.com/
2. Tengeneza akaunti
3. Tengeneza mradi mpya
4. Nenda Settings > Database > Connection string
5. Nakili connection string

#### Chaguo C: PostgreSQL ya Ndani (Ya Juu)

**Ni nini?**
Kuweka PostgreSQL moja kwa moja kwenye kompyuta yako.

**Kwa nini haipendekezwi kwa wanaoanza?**
- Ngumu zaidi kuweka
- Unahitaji kuweka programu za ziada
- Nafasi kubwa zaidi ya makosa

**Ikiwa unataka kujaribu hata hivyo:**
1. Pakua PostgreSQL: https://www.postgresql.org/download/
2. Weka kwa kufuata wizard
3. Tengeneza database inayoitwa `compileandchill`
4. Andika username, password, na port

---

## Hatua ya 6: Kuweka OAuth authentication

### OAuth ni nini?

OAuth ni mfumo unaoruhusu **kuingia kwa kutumia akaunti za huduma zingine**. Katika kesi yetu, tutatumia X (Twitter) kwa kuingia.

**Kwa nini kutumia OAuth?**
- ✅ Mtumiaji hahitaji kutengeneza akaunti mpya
- ✅ Salama zaidi (X inashughulikia usalama)
- ✅ Haraka zaidi (bofya moja na imekwisha)

### Tutafanya nini?

Tutatengeneza "application" kwenye X inayoruhusu tovuti yetu kuingia na akaunti za X.

### Hatua kwa hatua kwa undani:

#### 1. Ingia Twitter Developer Portal

1. **Tembelea:**
   - Nenda: https://developer.twitter.com/en/portal/dashboard
   - Ingia na akaunti yako ya X (Twitter)

2. **Portal hii ni nini?**
   - Ni dashboard ambapo watengenezaji hutengeneza "apps" (programu)
   - "App" yetu itakuwa Compile & Chill
   - X itatupa "credentials" (funguo) za kuingia

#### 2. Tengeneza mradi (ikiwa huna)

1. **Bofya "Create Project"**
2. **Jaza:**
   - **Jina la mradi:** Compile & Chill (au jina lolote)
   - **Matumizi:** Chagua "Making a bot" au "Exploring the API"
   - **Maelezo:** Portal ya michezo kwa watengenezaji
3. **Bofya "Next"**
4. **Kubali masharti**
5. **Bofya "Create Project"**

#### 3. Tengeneza App ndani ya mradi

1. **Ndani ya mradi, bofya "Add App"**
2. **Jaza:**
   - **Jina la App:** compile-chill-dev (au jina lolote)
   - **Maelezo:** App ya maendeleo ya Compile & Chill
3. **Bofya "Create App"**

#### 4. Weka OAuth 2.0 (MUHIMU SANA!)

**Kwa nini hatua hii ni muhimu?**
Bila kuweka OAuth 2.0, hatutakuwa na credentials sahihi za kufanya kuingia kufanya kazi.

1. **Kwenye ukurasa wa App, bofya tab "Settings"** (karibu na "Keys and tokens")

2. **Tafuta "User authentication settings"**
   - Inaweza kuandikwa kama "OAuth 2.0 Settings"
   - Bofya "Set up" au "Edit"

3. **Weka:**
   - **Aina ya App:** Chagua "Web App, Automated App or Bot"
   - **Ruhusa za App:** Acha "Read" imechaguliwa
   - **Callback URI / Redirect URL:** `http://localhost:3000/api/auth/callback/twitter`
     - ⚠️ **MUHIMU:** Nakili hii hasa, hakuna nafasi!
   - **Website URL:** `http://localhost:3000`
     - Ikiwa haikubali, jaribu `http://127.0.0.1:3000`
     - Au acha tupu ikiwa ni hiari

4. **Bofya "Save"**
   - ⚠️ **MUHIMU SANA:** Hifadhi! Bila kuhifadhi, credentials hazitaonekana!

#### 5. Pata credentials za OAuth 2.0

**Kwa nini tunahitaji credentials hizi?**
Ni kama "funguo" zinazoruhusu tovuti yetu kuwasiliana na X kwa kuingia.

1. **Rudi kwenye tab "Keys and tokens"**

2. **Tafuta sehemu "OAuth 2.0 Client ID and Client Secret"**
   - ⚠️ **MAKINI:** Usitumie "API Key" au "Bearer Token"!
   - Unahitaji hasa "OAuth 2.0 Client ID" na "OAuth 2.0 Client Secret"

3. **Nakili credentials:**
   - **Client ID:** Itakuwa kitu kama `abc123xyz...`
   - **Client Secret:** Bofya "Reveal" ili kuona, itakuwa kitu kama `def456uvw...`
   - **HIFADHI CREDENTIALS HIZI!** Tutazitumia katika hatua inayofuata

**Tulifanya nini?**
Tulitengeneza "application" kwenye X inayoruhusu tovuti yetu kuingia. Ni kama kutengeneza "funguo" inayoruhusu tovuti yetu kupata taarifa za msingi kutoka akaunti ya X ya mtumiaji.

---

## Hatua ya 7: Kuweka environment variables

### Environment variables ni nini?

Environment variables ni **mipangilio ya siri** ambayo mradi unahitaji, lakini haipaswi kushirikiwa hadharani. Ni kama nywila na funguo zilizohifadhiwa kwenye kasha la salama.

### Kwa nini tunatumia environment variables?

Kwa sababu baadhi ya taarifa ni **nyeti** (kama nywila za database) na haipaswi kuwa kwenye code inayoenda GitHub. Environment variables zinaendelea tu kwenye mashine yako.

### Tutafanya nini?

Tutatengeneza faili `.env` (dot env) na mipangilio yote ambayo mradi unahitaji.

### Hatua kwa hatua:

1. **Kwenye folda ya mradi, tengeneza faili inayoitwa `.env`**
   - ⚠️ **MUHIMU:** Jina lazima liwe `.env` hasa (na nukta mwanzoni!)
   - Kwenye Windows, inaweza kuwa ngumu kutengeneza faili inayoanza na nukta
   - Suluhisho: Tumia kihariri cha maandishi (VS Code, Notepad++) na hifadhi kama `.env`

2. **Fungua faili `.env` na bandika yafuatayo:**

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
# Bandika hapa connection string uliyonakili kutoka Neon/Supabase
# Mfano: postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
DATABASE_URL="bandika-neon-connection-string-yako-hapa"

# ============================================
# NEXTAUTH CONFIGURATION (Mfumo wa Authentication)
# ============================================
# URL ambapo mradi utaendesha (maendeleo ya ndani)
NEXTAUTH_URL="http://localhost:3000"

# Ufunguo wa siri wa kusimbua sessions
# Tengeneza moja kwa kutumia: openssl rand -base64 32
# Au tumia: https://generate-secret.vercel.app/32
NEXTAUTH_SECRET="bandika-ufunguo-uliotengenezwa-hapa"

# ============================================
# X (TWITTER) OAuth CREDENTIALS
# ============================================
# Bandika hapa credentials za OAuth 2.0 ulizopata katika hatua ya 6
X_CLIENT_ID="bandika-twitter-client-id-yako-hapa"
X_CLIENT_SECRET="bandika-twitter-client-secret-yako-hapa"

# ============================================
# UPSTASH REDIS (Hiari kwa maendeleo)
# ============================================
# Kikomo cha kiwango - huzuia matumizi mabaya ya mfumo
# Ikiwa hutaki kuweka sasa, acha tupu
# Mfumo utafanya kazi, lakini bila kikomo cha kiwango
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

3. **Jaza kila variable:**

   **a) DATABASE_URL:**
   - Bandika connection string uliyonakili kutoka Neon
   - Inapaswa kuwa kwenye alama za nukuu: `DATABASE_URL="postgresql://..."`

   **b) NEXTAUTH_SECRET:**
   - Tengeneza ufunguo wa siri:
     - **Windows (PowerShell):**
       ```powershell
       [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
       ```
     - **Mac/Linux:**
       ```bash
       openssl rand -base64 32
       ```
     - **Mtandaoni (ikiwa huna openssl):**
       - Tembelea: https://generate-secret.vercel.app/32
       - Nakili kamba iliyotengenezwa
   - Bandika kwenye `.env` kwenye alama za nukuu

   **c) X_CLIENT_ID na X_CLIENT_SECRET:**
   - Bandika credentials ulizopata katika hatua ya 6
   - Kila moja kwenye alama za nukuu

4. **Hifadhi faili**

### Kila variable inafanya nini? (Maelezo ya undani)

**DATABASE_URL:**
- Ni "anwani" ya database
- Ina user, password, server, na jina la database
- Prisma inatumia hii kuunganisha na database

**NEXTAUTH_URL:**
- Ni URL ambapo mradi unaendesha
- Katika maendeleo: `http://localhost:3000`
- Katika uzalishaji: itakuwa `https://your-domain.com`

**NEXTAUTH_SECRET:**
- Ni ufunguo wa siri wa kusimbua sessions za watumiaji
- Kama "nywila kuu" inayolinda kuingia
- Lazima iwe ya kipekee na salama (ndiyo maana tunatengeneza kwa nasibu)

**X_CLIENT_ID na X_CLIENT_SECRET:**
- Ni "credentials" X alitupatia
- Zinaruhusu tovuti yetu kuwasiliana na X
- Kama "username na password" za kupata API ya X

**UPSTASH_REDIS_REST_URL na UPSTASH_REDIS_REST_TOKEN:**
- Zinahusika na kikomo cha kiwango (kupunguza maombi)
- Zinazuia mtu kutumia mfumo vibaya
- Hiari kwa maendeleo

### ⚠️ MUHIMU: Usalama

- ❌ **KAMWE** usiweke faili `.env` kwenye GitHub!
- ✅ Faili `.gitignore` tayari imewekwa kwa kupuuza `.env`
- ✅ Weka credentials zako salama
- ✅ Tumia credentials tofauti kwa maendeleo na uzalishaji

---

## Hatua ya 8: Kuweka database

### Tutafanya nini?

Tutatengeneza **meza** kwenye database. Meza ni kama "spreadsheets" ambapo tunahifadhi data iliyopangwa.

### Kwa nini tunahitaji kufanya hii?

Kwa sababu database huanza tupu. Tunahitaji kutengeneza muundo (meza) kabla ya kuhifadhi data.

### "Migrations" ni nini?

Migrations ni "scripts" zinazotengeneza au kubadilisha muundo wa database. Ni kama "mradi wa ujenzi" unaosema mahali pa kuweka kila kitu.

### Hatua kwa hatua:

1. **Fungua terminal kwenye folda ya mradi**

2. **Endesha amri ya migration:**
   ```bash
   npx prisma migrate dev
   ```

   **Amri hii inafanya nini?**
   - Inasoma faili `prisma/schema.prisma` (ambayo inafafanua muundo)
   - Hutengeneza meza kwenye database
   - Inatumia indexes (kwa utafutaji wa haraka)
   - Hutengeneza uhusiano kati ya meza
   - Hutengeneza Prisma Client moja kwa moja

3. **Unapoombwa jina la migration:**
   - Andika kitu kama: `init` au `initial_setup`
   - Bofya Enter

4. **Subiri kukamilika:**
   - Utaona ujumbe kama "Creating migration..."
   - Mwisho, unapaswa kuona "Migration applied successfully"

### Kilitengenezwa nini?

Prisma ilitengeneza meza hizi kwenye database:

- **users**: Inahifadhi data za watumiaji (jina, avatar, nk)
- **accounts**: Inahifadhi taarifa za OAuth authentication
- **sessions**: Inahifadhi sessions za watumiaji waliokwisha kuingia
- **scores**: Inahifadhi alama za michezo
- **score_validation_fails**: Inahifadhi majaribio ya udanganyifu yaliyozuiwa

### Ikiwa unapata makosa:

**Kosa: "Can't reach database server"**
- Angalia ikiwa `DATABASE_URL` kwenye `.env` ni sahihi
- Angalia ikiwa umenakili connection string kamili
- Jaribu muunganisho kwenye panel ya Neon

**Kosa: "P1001: Can't reach database server"**
- Database inaweza kuwa imesimamishwa (Neon inasimamisha baada ya kutokuwa na shughuli)
- Ingia kwenye panel ya Neon na "resume" mradi
- Jaribu tena

**Kosa: "Migration failed"**
- Angalia ikiwa hakuna migration nyingine inayosubiri
- Jaribu: `npx prisma migrate reset` (makini: inafuta data!)
- Au: `npx prisma db push` (badala rahisi zaidi)

### Tengeneza Prisma Client (ikiwa inahitajika):

Ikiwa Prisma Client haikutengenezwa moja kwa moja:

```bash
npx prisma generate
```

**Prisma Client ni nini?**
Ni "client" (zana) inayoruhusu code yetu ya JavaScript kuongea na database. Ni kama "mtafsiri" kati ya JavaScript na SQL.

---

## Hatua ya 9: Kuendesha mradi

### Wakati umefika! 🎉

Sasa tutaendesha mradi na kuona kila kitu kikifanya kazi!

### Hatua kwa hatua:

1. **Fungua terminal kwenye folda ya mradi**

2. **Endesha amri ya maendeleo:**
   ```bash
   npm run dev
   ```

   **Amri hii inafanya nini?**
   - Inaanza development server
   - Inabadilisha code ya TypeScript kuwa JavaScript
   - "Inasikiliza" mabadiliko ya faili
   - Unapohifadhi faili, inapakia upya moja kwa moja

3. **Subiri uandishi:**
   - Utaona mistari mingi ya maandishi
   - Tafuta: "Ready" au "Local: http://localhost:3000"
   - Inapoonekana, ime tayari!

4. **Fungua browser:**
   - Nenda: http://localhost:3000
   - Unapaswa kuona ukurasa wa nyumbani wa Compile & Chill!

### Unapaswa kuona nini?

- ✅ Ukurasa wa nyumbani na orodha ya michezo
- ✅ Header na kitufe "Sign in with X"
- ✅ Kila kitu kikifanya kazi!

### Kujaribu kuingia:

1. **Bofya "Sign in with X"**
2. **Utaelekezwa kwenye X**
3. **Idhinisha application**
4. **Utaelekezwa kurudi**
5. **Unapaswa kuona wasifu wako kwenye header!**

### Ikiwa kitu hakifanyi kazi:

Angalia sehemu ya [Kutatua matatizo](#kutatua-matatizo) hapa chini!

---

## Dhana muhimu zilizo elezwa

### Next.js ni nini?

**Next.js** ni framework (muundo) wa kutengeneza programu za wavuti na React. Inarahisisha:
- Routing (kuhamia kati ya kurasa)
- Server-side rendering
- Uboreshaji wa moja kwa moja

**Mfano:** Ikiwa React ni "engine", Next.js ni "gari kamili" na sehemu zote zimeunganishwa tayari.

### React ni nini?

**React** ni library ya kutengeneza interfaces za watumiaji. Inaruhusu kutengeneza vipengele vinavyoweza kutumika tena.

**Mfano:** React ni kama "vipande vya LEGO" - unavikusanya vipande vidogo kutengeneza kitu kikubwa.

### TypeScript ni nini?

**TypeScript** ni JavaScript na "types". Inasaidia kupata makosa kabla ya kuendesha code.

**Mfano:** Ikiwa JavaScript ni kuandika kwa mkono, TypeScript ni kutumia kichunguzi cha maandishi.

### Prisma ni nini?

**Prisma** ni zana inayorahisisha kufanya kazi na database. Inabadilisha JavaScript kuwa SQL moja kwa moja.

**Mfano:** Prisma ni kama "mtafsiri" anayebadilisha JavaScript kuwa amri za database.

### NextAuth ni nini?

**NextAuth** ni mfumo wa authentication. Inashughulikia kuingia, sessions, na usalama.

**Mfano:** NextAuth ni kama "mlinzi wa mlango" anayeangalia ikiwa unaweza kuingia na anakupa "kipande" (session).

### Migrations ni nini?

**Migrations** ni scripts zinazobadilisha muundo wa database kwa njia iliyodhibitiwa na inayoweza kurudi nyuma.

**Mfano:** Migrations ni kama "matoleo" ya database. Kila migration huongeza au hubadilisha kitu.

---

## Kutatua matatizo

### Kosa: "Cannot find module"

**Sababu:** Dependencies hazijawekwa.

**Suluhisho:**
```bash
npm install
```

### Kosa: "Port 3000 is already in use"

**Sababu:** Mchakato mwingine unatumia port 3000.

**Suluhisho:**
- Funga miradi mingine ya Next.js
- Au badilisha port: `npm run dev -- -p 3001`

### Kosa: "DATABASE_URL is missing"

**Sababu:** Faili `.env` haipo au si sahihi.

**Suluhisho:**
- Angalia ikiwa faili `.env` ipo kwenye mizizi ya mradi
- Angalia ikiwa `DATABASE_URL` imefafanuliwa
- Anza upya server baada ya kutengeneza/kuhariri `.env`

### Kosa: "Invalid credentials" wakati wa kuingia

**Sababu:** Credentials za OAuth zisizo sahihi au Callback URL isiyo sahihi.

**Suluhisho:**
1. Angalia ikiwa unatumia credentials za OAuth 2.0 (sio API Key)
2. Angalia ikiwa Callback URL kwenye Twitter ni: `http://localhost:3000/api/auth/callback/twitter`
3. Anza upya server baada ya kubadilisha `.env`

### Kosa: "Prisma Client not generated"

**Sababu:** Prisma Client haikutengenezwa.

**Suluhisho:**
```bash
npx prisma generate
```

### Kosa: "Migration failed"

**Sababu:** Tatizo na muunganisho au muundo wa database.

**Suluhisho:**
```bash
npx prisma db push
```
Hii inatumia schema moja kwa moja bila kutengeneza migration.

### Mradi haupaki kwenye browser

**Sababu:** Server haijaanza vizuri.

**Suluhisho:**
1. Simamisha server (Ctrl+C)
2. Futa cache: `rm -rf .next` (Mac/Linux) au `rmdir /s .next` (Windows)
3. Weka upya dependencies: `rm -rf node_modules && npm install`
4. Jaribu tena: `npm run dev`

### Kosa la uandishi wa TypeScript

**Sababu:** Makosa ya aina kwenye code.

**Suluhisho:**
```bash
npm run type-check
```
Hii inaonyesha makosa yote ya aina. Yarekebishe kabla ya kuendesha.

---

## 🎉 Hongera!

Ikiwa umefika hapa na mradi unakimbia, **umefanikiwa!** 🎊

### Ulijifunza nini:

- ✅ Jinsi ya kuweka na kutumia Node.js
- ✅ Jinsi ya kuiga miradi kutoka GitHub
- ✅ Jinsi ya kuweka dependencies
- ✅ Jinsi ya kuweka database
- ✅ Jinsi ya kuweka OAuth authentication
- ✅ Jinsi ya kutumia environment variables
- ✅ Jinsi ya kuendesha mradi wa Next.js

### Hatua zifuatazo:

1. **Chunguza code:** Fungua faili na uone inavyofanya kazi
2. **Fanya mabadiliko:** Jaribu kubadilisha kitu na uone matokeo
3. **Soma nyaraka:** Kila library ina nyaraka bora
4. **Jifunze:** Zaidi unavyojifunza, zaidi unajifunza!

### Kumbuka:

- ❌ **Usiogope kufanya makosa!** Makosa ni sehemu ya kujifunza
- ✅ **Uliza!** Jumuiya iko hapa kusaidia
- ✅ **Chunguza!** Google na Stack Overflow ni rafiki zako
- ✅ **Jifunze!** Mazoezi hufanya mtaalamu

### Unahitaji msaada?

- Fungua issue kwenye GitHub
- Soma nyaraka rasmi
- Uliza jumuiya
- **Kwa watengenezaji nchini Ethiopia, Uganda, Tanzania:** Angalia [ukurasa wetu wa Impact Social](/impacto-social) kwa msaada wa kikanda na fursa za ushirikiano

### Kuchangia Ufikiaji wa Kikanda

Ikiwa wewe ni mtengenezaji, mtafsiri, au mwalimu nchini Ethiopia, Uganda, au Tanzania, fikiria:
- Kutafsiri nyaraka kwa lugha za ndani (Amharic, Swahili)
- Kutengeneza mafunzo maalum kwa changamoto za kikanda
- Kuunganisha na NGOs za ndani na shule ili kusambaza maudhui haya
- Angalia [ukurasa wetu wa Impact Social](/impacto-social) kwa njia zaidi za kuchangia

**Unaweza! Endelea kujifunza! 🚀**

---

*Mwongozo huu umeundwa kwa uangalifu mkubwa ili kukusaidia kuanza. Ikiwa una mapendekezo ya uboreshaji, tafadhali shiriki!*

