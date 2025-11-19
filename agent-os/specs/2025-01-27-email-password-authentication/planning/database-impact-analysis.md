# Análise de Impacto: Tabelas de Usuário e Autenticação

## 📊 Tabelas Relacionadas ao Usuário

### 1. **users** (User Model)
**Campos Atuais:**
- `id` (Int, PK, auto-increment)
- `name` (String, obrigatório)
- `avatar` (String, opcional)
- `xId` (String, **único, obrigatório**) ⚠️ **PROBLEMA PRINCIPAL**
- `xUsername` (String, opcional)
- `theme` (String, opcional)
- `showPublicHistory` (Boolean, default: true)
- `createdAt`, `updatedAt` (DateTime)

**Relacionamentos:**
- `accounts[]` → Account (1:N)
- `sessions[]` → Session (1:N)
- `scores[]` → Score (1:N)
- `scoreValidationFails[]` → ScoreValidationFail (1:N)

**Índices:**
- `@@index([xId])` - Busca rápida por xId
- `@@index([id])` - Busca rápida por ID

---

### 2. **accounts** (Account Model - NextAuth)
**Campos:**
- `id` (String, PK, cuid)
- `userId` (Int, FK → User.id)
- `type` (String) - Tipo de conta (ex: "oauth")
- `provider` (String) - **"twitter"** atualmente
- `providerAccountId` (String) - ID do usuário no provider
- `refresh_token`, `access_token` (String?, Text)
- `expires_at`, `token_type`, `scope`, `id_token`, `session_state`

**Constraints:**
- `@@unique([provider, providerAccountId])` - Um providerAccountId por provider
- `@@index([userId])` - Busca rápida por userId

**Status:** ✅ **JÁ SUPORTA MÚLTIPLOS PROVIDERS!**
- A tabela Account já está preparada para múltiplos providers
- O constraint único é por `[provider, providerAccountId]`, não apenas `providerAccountId`
- Isso significa que o mesmo usuário pode ter:
  - 1 conta Twitter (`provider: "twitter"`)
  - 1 conta Google (`provider: "google"`)
  - 1 conta Email/Senha (`provider: "credentials"`)

---

### 3. **sessions** (Session Model - NextAuth)
**Campos:**
- `id` (String, PK, cuid)
- `sessionToken` (String, único)
- `userId` (Int, FK → User.id)
- `expires` (DateTime)

**Status:** ✅ **INDEPENDENTE DO PROVIDER**
- Sessões não dependem do provider
- Qualquer provider cria sessão da mesma forma
- Funciona igual para Twitter, Google, ou Credentials

---

### 4. **scores** (Score Model)
**Campos:**
- `id`, `userId` (FK → User.id), `gameId`, `score`, etc.

**Status:** ✅ **INDEPENDENTE DO PROVIDER**
- Scores são vinculados ao `userId`, não ao provider
- Não importa como o usuário fez login

---

### 5. **score_validation_fails** (ScoreValidationFail Model)
**Status:** ✅ **INDEPENDENTE DO PROVIDER**
- Mesma situação dos scores

---

## 🔍 Pontos de Dependência do X/Twitter

### 1. **Schema Prisma - Campo `xId` Obrigatório** 🚨

**Problema:**
```prisma
xId String @unique  // OBRIGATÓRIO - não pode ser null
```

**Impacto:**
- ❌ Usuários Google não teriam `xId`
- ❌ Usuários Email/Senha não teriam `xId`
- ❌ Migração necessária para tornar opcional

**Solução:**
```prisma
xId String? @unique  // Tornar opcional
```

---

### 2. **Auth Adapter - `getUserByAccount`** ⚠️

**Localização:** `lib/auth-adapter.ts:205-232`

**Código Atual:**
```typescript
async getUserByAccount({ providerAccountId, provider }) {
  if (provider === "twitter") {
    const user = await prisma.user.findUnique({
      where: { xId: providerAccountId },
      // ...
    })
  }
  // Fallback para default adapter
}
```

**Impacto:**
- ⚠️ Funciona apenas para Twitter
- ✅ Google usaria o fallback (default adapter)
- ✅ Mas o default adapter busca por `Account`, não por `xId`
- ✅ **Isso já funciona!** O NextAuth padrão busca na tabela Account

**Análise:**
- O código atual já tem fallback para default adapter
- Google funcionaria, mas seria menos eficiente (busca em Account em vez de índice direto)
- **Não é crítico**, mas poderia otimizar

---

### 3. **Auth Adapter - `createUser`** ⚠️

**Localização:** `lib/auth-adapter.ts:86-162`

**Código Atual:**
```typescript
async createUser(user) {
  const xId = (user as any).xId
  if (xId) {
    // Cria com xId
  } else {
    // Fallback para default adapter
  }
}
```

**Impacto:**
- ⚠️ Se não tiver `xId`, usa default adapter
- ❌ Mas default adapter vai falhar porque `xId` é obrigatório no schema!
- **CRÍTICO:** Precisa tornar `xId` opcional antes de adicionar Google

---

### 4. **Auth Config - Callback `signIn`** ⚠️

**Localização:** `auth.config.ts:70-251`

**Código Atual:**
```typescript
async signIn({ user, account, profile }) {
  if (account?.provider === "twitter" && account.providerAccountId) {
    // Lógica específica do Twitter
    // Extrai xId, xUsername, busca via API do Twitter, etc.
  }
  return true
}
```

**Impacto:**
- ✅ Google não entra neste `if`, então retorna `true` direto
- ✅ **Funciona!** Mas não atualiza dados do Google (name, avatar)
- ⚠️ Seria bom adicionar lógica similar para Google

---

### 5. **API Routes - Uso de `xId` e `xUsername`** ⚠️

#### 5.1 `/api/users/me` (app/api/users/me/route.ts)
**Linhas 23-24, 49-51:**
```typescript
select: {
  xId: true,
  xUsername: true,
  // ...
},
// ...
handle: dbUser.xUsername || dbUser.xId, // Fallback para xId
xId: dbUser.xId,
xUsername: dbUser.xUsername,
```

**Impacto:**
- ⚠️ Retorna `xId` e `xUsername` na resposta
- ⚠️ Usa `xId` como fallback para `handle`
- ✅ **Não quebra**, mas retorna `null` para usuários Google
- ⚠️ Frontend pode depender desses campos

#### 5.2 `/api/users/[id]` (app/api/users/[id]/route.ts)
**Linhas 31, 49, 110:**
```typescript
select: {
  xId: true,
  // ...
},
// ...
handle: dbUser.xId,  // Usa xId diretamente
```

**Impacto:**
- ⚠️ Retorna `xId` na resposta pública
- ⚠️ Usa `xId` como `handle` (identificador público)
- ❌ **Problema:** Usuários Google não teriam `handle` válido
- ⚠️ Precisa de fallback (email ou outro identificador)

---

### 6. **Frontend - Dependências de `xId`/`xUsername`**

**Arquivos que podem usar:**
- `app/page.tsx` - Home page
- `app/profile/page.tsx` - Página de perfil
- `components/ProfileButton.tsx` - Botão de perfil
- Outros componentes que exibem dados do usuário

**Impacto:**
- ⚠️ Precisa verificar se há código que assume `xId` sempre existe
- ⚠️ Precisa adicionar fallbacks (email, name, etc.)

---

## 📋 Comparação: Google OAuth vs Credentials Provider

### Google OAuth

**Mudanças Necessárias:**

1. **Schema Prisma:**
   ```prisma
   xId String? @unique  // Tornar opcional
   email String? @unique  // Adicionar (opcional, para compatibilidade)
   ```

2. **Auth Config:**
   - Adicionar provider Google
   - Adicionar callback `signIn` para Google (similar ao Twitter)
   - Extrair name, email, avatar do Google

3. **Auth Adapter:**
   - `createUser`: Ajustar para não exigir `xId`
   - `getUserByAccount`: Otimizar para Google (opcional)

4. **API Routes:**
   - `/api/users/me`: Adicionar fallback para email quando não tiver `xId`
   - `/api/users/[id]`: Usar email ou name como `handle` quando não tiver `xId`

5. **Frontend:**
   - Verificar componentes que usam `xId`/`xUsername`
   - Adicionar fallbacks

**Complexidade:** Média  
**Tempo:** 2-3 horas  
**Impacto:** Médio (múltiplos arquivos)

---

### Credentials Provider (Email/Senha)

**Mudanças Necessárias:**

1. **Schema Prisma:**
   ```prisma
   xId String? @unique  // Tornar opcional
   email String? @unique  // Adicionar (obrigatório para credentials)
   password String?      // Hash da senha (obrigatório para credentials)
   ```

2. **Auth Config:**
   - Adicionar Credentials Provider
   - Validar email/senha
   - Hash de senha com bcrypt

3. **Auth Adapter:**
   - `createUser`: Ajustar para não exigir `xId`
   - Criar usuário com email/password quando for credentials

4. **Páginas:**
   - Criar `/signup` - Cadastro
   - Modificar `/` - Adicionar opção de login com email

5. **API Routes:**
   - Mesmas mudanças do Google (fallbacks para `xId`)

6. **Validação:**
   - Email único
   - Senha forte
   - Hash com bcrypt

**Complexidade:** Média-Alta  
**Tempo:** 2-3 horas  
**Impacto:** Médio (múltiplos arquivos + páginas novas)

---

## 🎯 Impacto Resumido

### Tabelas que NÃO Precisam Mudar:
- ✅ **accounts** - Já suporta múltiplos providers
- ✅ **sessions** - Independente do provider
- ✅ **scores** - Vinculado ao userId, não ao provider
- ✅ **score_validation_fails** - Vinculado ao userId

### Tabelas que PRECISAM Mudar:
- ⚠️ **users** - Tornar `xId` opcional, adicionar `email` e `password`

### Código que PRECISA Ajustar:

#### Crítico (Quebra sem mudança):
1. **Schema Prisma** - `xId` obrigatório
2. **Auth Adapter `createUser`** - Assume `xId` existe

#### Importante (Funciona mas incompleto):
3. **API `/api/users/[id]`** - Usa `xId` como `handle` (precisa fallback)
4. **API `/api/users/me`** - Retorna `xId` (precisa fallback)
5. **Auth Config `signIn`** - Só atualiza dados do Twitter

#### Opcional (Melhorias):
6. **Auth Adapter `getUserByAccount`** - Otimizar para Google
7. **Frontend** - Verificar dependências de `xId`/`xUsername`

---

## 💡 Recomendação Final

### Para Google OAuth:
- ✅ Mais fácil (não precisa gerenciar senhas)
- ✅ Reutiliza estrutura OAuth existente
- ⚠️ Mas ainda precisa tornar `xId` opcional
- ⚠️ Precisa ajustar APIs para fallbacks

### Para Credentials Provider:
- ⚠️ Mais trabalho (páginas de cadastro, validação, hash)
- ✅ Atende exatamente o que usuário pediu (email/senha)
- ⚠️ Mesmas mudanças de schema que Google
- ⚠️ Mesmas mudanças de API que Google

### Conclusão:
**Ambos têm impacto similar no banco de dados e APIs.**  
**A diferença está na implementação do provider e nas páginas de UI.**

**Recomendação:** Escolher baseado na necessidade do usuário:
- **Google:** Se quiser algo rápido sem gerenciar senhas
- **Credentials:** Se quiser email/senha como pedido

