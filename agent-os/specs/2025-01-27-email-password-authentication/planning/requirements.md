# Requisitos: Autenticação Email/Senha + Google OAuth

## 📋 Decisão Final

**Implementar AMBOS:**
- ✅ Email/Senha (Credentials Provider)
- ✅ Google OAuth

**Branch:** `feature/email-password-google-auth` ✅

---

## 🔐 Requisitos de Segurança

### 1. Criptografia de Dados Sensíveis

#### Senha
- ✅ **Obrigatório:** Hash com bcrypt antes de salvar no banco
- ✅ Salt automático (bcrypt já inclui)
- ✅ Nunca armazenar senha em texto plano
- ✅ **Regras Simples de Senha:**
  - Mínimo 6 caracteres
  - Máximo 100 caracteres
  - Aceita qualquer caractere (letras, números, símbolos)
  - Sem exigência de maiúsculas, números ou símbolos especiais

#### Nome
- ✅ **Obrigatório:** Criptografar nome no banco de dados
- ✅ Usar criptografia AES-256 ou similar
- ✅ Chave de criptografia em variável de ambiente
- ✅ Descriptografar apenas quando necessário para exibição

**Nota:** Criptografia de nome é uma medida de privacidade adicional. O nome será descriptografado automaticamente quando necessário para exibição.

---

## 🔗 Validação e Vinculação de Conta X (Twitter)

### Requisito: Validação Opcional do X para Usuários Não-X

**Contexto:**
- Usuários que autenticam com X já entram direto no sistema (ranking, etc)
- Usuários que se cadastram por Email/Password ou Google podem não ter conta X inicialmente
- Esses usuários devem poder validar/vincular sua conta X posteriormente nas configurações

**Fluxo de Validação do X:**

1. **Acesso às Configurações:**
   - Usuário acessa `/profile` (página de perfil próprio)
   - Seção "Configurações" ou "Contas Conectadas"
   - Mostrar status atual: "X não validado" ou "X validado"

2. **Botão de Validar X:**
   - Se usuário não tem `xId` vinculado, mostrar botão "Validar Conta X"
   - Botão abre popup de autenticação X (mesmo fluxo do login, mas apenas para validação)
   - Após autenticação bem-sucedida no popup:
     - Buscar informações do X (xId, xUsername, avatar se disponível)
     - Atualizar registro do usuário com essas informações
     - Vincular Account do X ao User existente
     - Não criar novo usuário, apenas atualizar o existente

3. **Validação Bem-Sucedida:**
   - Atualizar perfil do usuário com:
     - `xId` (obrigatório após validação)
     - `xUsername` (se disponível)
     - Avatar do X (se disponível e usuário não tiver avatar customizado)
   - Usuário agora aparece no ranking e em todas as funcionalidades que requerem X
   - Mostrar mensagem de sucesso: "Conta X validada com sucesso!"

4. **Comportamento Após Validação:**
   - Usuário pode usar qualquer método de login (Email, Google, ou X)
   - Todas as contas ficam vinculadas ao mesmo User
   - Ranking e funcionalidades sociais passam a funcionar normalmente

**Implementação Técnica:**

- Criar endpoint `/api/users/validate-x` (POST) que:
  - Requer autenticação
  - Recebe `xId` e `xUsername` do callback do OAuth
  - Atualiza User atual (não cria novo)
  - Cria/atualiza Account do X vinculado ao User
  - Retorna sucesso/erro

- Modificar callback do X OAuth para:
  - Verificar se usuário já está autenticado (sessão ativa)
  - Se sim, tratar como validação (não criar novo usuário)
  - Se não, tratar como login normal

- Adicionar componente `XValidationButton` na página de perfil:
  - Mostrar apenas se usuário não tem `xId`
  - Abrir popup de autenticação X
  - Após callback, chamar endpoint de validação
  - Atualizar UI para mostrar status atualizado

**Casos de Uso:**
- Usuário cria conta com Email/Password → depois valida X → aparece no ranking
- Usuário cria conta com Google → depois valida X → pode usar qualquer método de login
- Usuário já tem X validado → não mostra opção de validar novamente

## 🎨 Requisitos de UI/UX

### 1. Fluxo de Autenticação Google

**Após autenticação bem-sucedida com Google:**

1. **Tela de Configuração de Perfil** (primeira vez):
   - Campo: "Nome a ser exibido" (obrigatório)
   - Campo: "Foto/Avatar" com opções:
     - ✅ Usar foto do Google (padrão)
     - ✅ Escolher avatar personalizado (galeria de avatares)
     - ✅ Upload de imagem personalizada
   - Botão: "Salvar e continuar"

2. **Comportamento:**
   - Se usuário já configurou antes, pular esta tela
   - Armazenar preferência de avatar
   - Criptografar nome antes de salvar

### 2. Fluxo de Cadastro Email/Senha

**Página `/signup`:**

1. **Formulário de Cadastro:**
   - Campo: "Nome" (obrigatório) - será criptografado
   - Campo: "Email" (obrigatório, único)
   - Campo: "Senha" (obrigatório, mínimo 8 caracteres)
   - Campo: "Confirmar Senha" (obrigatório)
   - Seção: "Escolha seu Avatar"
     - Opções de avatares pré-definidos (grid de seleção)
     - Opção: "Upload de imagem personalizada"
   - Botão: "Criar Conta"

2. **Validações:**
   - Email válido (formato + domínio existente) e único
   - Senha simples (mínimo 6 caracteres)
   - Senhas devem coincidir
   - Nome não pode estar vazio
   - Avatar convertido para base64 antes de salvar

### 3. Fluxo de Login Email/Senha

**Página de Login (modificar `/` ou criar `/login`):**

1. **Opções de Login:**
   - Botão: "Entrar com X" (existente)
   - Botão: "Entrar com Google" (novo)
   - Link: "Ou entrar com Email e Senha"

2. **Formulário de Login Email/Senha:**
   - Campo: "Email"
   - Campo: "Senha"
   - Checkbox: "Permanecer logado" (Remember Me)
   - Link: "Esqueceu a senha?" (desabilitado por enquanto, sem SMTP)
   - Botão: "Entrar"

---

## 🗄️ Requisitos de Banco de Dados

### Schema Prisma Atualizado

```prisma
model User {
  id        Int      @id @default(autoincrement())
  
  // Dados criptografados
  nameEncrypted String?  // Nome criptografado (AES-256)
  passwordHash  String?  // Hash da senha (bcrypt)
  
  // Identificadores
  xId       String?  @unique  // Tornar opcional
  xUsername String?
  email     String?  @unique  // Email (único, opcional, validado)
  
  // Avatar
  avatar    String?  @db.Text  // Base64 da imagem (data:image/png;base64,...)
  
  // Preferências
  theme            String?
  showPublicHistory Boolean @default(true)
  
  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relacionamentos
  accounts Account[]
  sessions Session[]
  scores   Score[]
  scoreValidationFails ScoreValidationFail[]
  
  @@index([xId])
  @@index([email])
  @@index([id])
  @@map("users")
}
```

### Campos Adicionais Necessários

- `nameEncrypted`: String? - Nome criptografado
- `passwordHash`: String? - Hash da senha (bcrypt)
- `email`: String? @unique - Email (opcional, único, validado)
- `avatar`: String? @db.Text - Avatar em base64 (data:image/png;base64,...)

---

## 🔧 Requisitos Técnicos

### 1. Variáveis de Ambiente

**Novas variáveis necessárias:**

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Criptografia de Nome
ENCRYPTION_KEY=your-32-byte-encryption-key  # Para AES-256
ENCRYPTION_IV=your-16-byte-iv                 # Para AES-256

# Configuração de Senha
PASSWORD_MIN_LENGTH=6
PASSWORD_MAX_LENGTH=100

# Validação de Email
EMAIL_VALIDATION_ENABLED=true  # Habilitar verificação de domínio
```

### 2. Bibliotecas Necessárias

```json
{
  "dependencies": {
    "bcrypt": "^5.1.1",           // Hash de senhas
    "crypto": "built-in",         // Criptografia AES (Node.js)
    "dns": "built-in",            // Verificação de domínio de email
    "next-auth": "beta",          // Já existe
    "@auth/prisma-adapter": "..." // Já existe
  }
}
```

### 3. Providers NextAuth

**Adicionar ao `auth.config.ts`:**

1. **Google Provider:**
   ```typescript
   Google({
     clientId: process.env.GOOGLE_CLIENT_ID!,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
   })
   ```

2. **Credentials Provider:**
   ```typescript
   Credentials({
     name: "Email",
     credentials: {
       email: { label: "Email", type: "email" },
       password: { label: "Senha", type: "password" }
     },
     async authorize(credentials) {
       // Validar email/senha
       // Retornar usuário ou null
     }
   })
   ```

---

## 📁 Estrutura de Arquivos

### Novos Arquivos Necessários

```
lib/
  encryption.ts          # Funções de criptografia/descriptografia
  password.ts          # Funções de hash/validação de senha
  email-validation.ts  # Validação robusta de email (formato + domínio)
  avatar.ts           # Conversão de imagem para base64
  avatars.ts           # Lista de avatares pré-definidos

app/
  signup/
    page.tsx           # Página de cadastro
  login/
    page.tsx           # Página de login (opcional)
  setup-profile/
    page.tsx           # Configuração de perfil após Google OAuth

components/
  auth/
    SignupForm.tsx     # Formulário de cadastro
    LoginForm.tsx       # Formulário de login
    AvatarPicker.tsx    # Seletor de avatar
    ProfileSetup.tsx    # Setup de perfil (Google)
```

---

## 🔄 Fluxos de Autenticação

### Fluxo 1: Google OAuth

1. Usuário clica "Entrar com Google"
2. Redireciona para Google OAuth
3. Usuário autoriza
4. Callback do Google retorna dados básicos
5. **Se primeira vez:**
   - Redirecionar para `/setup-profile`
   - Usuário escolhe nome e avatar
   - Salvar com criptografia
   - Criar sessão
6. **Se já configurou:**
   - Buscar dados do banco
   - Criar sessão direto

### Fluxo 2: Email/Senha

1. Usuário acessa `/signup`
2. Preenche nome, email, senha, escolhe avatar
3. Validações no frontend
4. Enviar para API `/api/auth/signup`
5. Backend:
   - Validar email único
   - Hash da senha (bcrypt)
   - Criptografar nome
   - Criar usuário
   - Criar sessão NextAuth
6. Redirecionar para home

### Fluxo 3: Login Email/Senha

1. Usuário acessa página de login
2. Preenche email e senha
3. Opcionalmente marca "Permanecer logado"
4. NextAuth Credentials Provider valida
5. Comparar hash da senha
6. Criar sessão com duração baseada em "Remember Me":
   - **Com "Permanecer logado":** Sessão de 30 dias
   - **Sem "Permanecer logado":** Sessão de 24 horas
7. Redirecionar para home

---

## ✅ Checklist de Implementação

### Fase 1: Preparação
- [ ] Criar branch `feature/email-password-google-auth` ✅
- [ ] Atualizar documentação de requisitos ✅
- [ ] Definir estrutura de arquivos

### Fase 2: Banco de Dados
- [ ] Atualizar schema Prisma
- [ ] Tornar `xId` opcional
- [ ] Adicionar `email`, `passwordHash`, `nameEncrypted`
- [ ] Criar migration
- [ ] Testar migration

### Fase 3: Criptografia
- [ ] Implementar `lib/encryption.ts`
- [ ] Função de criptografar nome
- [ ] Função de descriptografar nome
- [ ] Testes de criptografia

### Fase 4: Senhas
- [ ] Implementar `lib/password.ts`
- [ ] Função de hash (bcrypt)
- [ ] Função de validação (regras simples: 6-100 caracteres)
- [ ] Testes de validação

### Fase 4.5: Validação de Email
- [ ] Implementar `lib/email-validation.ts`
- [ ] Validação de formato (regex)
- [ ] Verificação de domínio existente (DNS lookup)
- [ ] Cache de domínios válidos (evitar múltiplas verificações)
- [ ] Testes de validação

### Fase 4.6: Avatares Base64
- [ ] Implementar `lib/avatar.ts`
- [ ] Função de conversão de imagem para base64
- [ ] Validação de tamanho de arquivo (máx 2MB)
- [ ] Validação de tipo de arquivo (jpg, png, webp)
- [ ] Compressão de imagem (opcional, para otimizar)

### Fase 5: NextAuth
- [ ] Adicionar Google Provider
- [ ] Adicionar Credentials Provider
- [ ] Implementar "Remember Me" (sessão de 30 dias vs 24h)
- [ ] Ajustar callbacks
- [ ] Ajustar adapter para suportar múltiplos providers

### Fase 6: UI - Avatares
- [ ] Criar lista de avatares pré-definidos (em base64)
- [ ] Componente `AvatarPicker`
- [ ] Suporte a upload de imagem (converter para base64)
- [ ] Preview de avatar antes de salvar
- [ ] Validação de tamanho/tipo no frontend

### Fase 7: UI - Cadastro
- [ ] Página `/signup`
- [ ] Formulário de cadastro
- [ ] Validações frontend (email, senha simples, avatar base64)
- [ ] Feedback de validação de email (verificando domínio...)
- [ ] Integração com API

### Fase 8: UI - Login
- [ ] Modificar página de login
- [ ] Adicionar opções (X, Google, Email)
- [ ] Formulário de login email/senha
- [ ] Checkbox "Permanecer logado"
- [ ] Indicador visual de duração da sessão

### Fase 9: UI - Setup Profile (Google)
- [ ] Página `/setup-profile`
- [ ] Formulário de nome e avatar
- [ ] Lógica de primeira vez vs retorno

### Fase 10: APIs
- [ ] Ajustar `/api/users/me` para descriptografar nome
- [ ] Ajustar `/api/users/[id]` para descriptografar nome
- [ ] Criar `/api/auth/signup` (se necessário)

### Fase 11: Testes
- [ ] Testar cadastro email/senha
- [ ] Testar login email/senha
- [ ] Testar Google OAuth
- [ ] Testar setup de perfil
- [ ] Testar compatibilidade com usuários X existentes
- [ ] Testar criptografia/descriptografia

### Fase 12: Documentação
- [ ] Atualizar README
- [ ] Documentar variáveis de ambiente
- [ ] Documentar fluxos de autenticação

---

## 🎯 Prioridades

**Alta Prioridade:**
1. Criptografia de nome e senha
2. Schema do banco
3. Providers NextAuth
4. Fluxo básico de cadastro/login

**Média Prioridade:**
5. Setup de perfil Google
6. Seletor de avatares
7. Validações e UX

**Baixa Prioridade:**
8. Upload de imagem personalizada
9. Melhorias de UI/UX

---

## 📝 Notas Importantes

1. **Criptografia de Nome:**
   - Usar AES-256-GCM para segurança adicional
   - Chave deve ser de 32 bytes (256 bits)
   - IV deve ser único por registro (gerar aleatório)
   - Armazenar IV junto com dados criptografados

2. **Hash de Senha:**
   - Usar bcrypt com salt rounds 10-12
   - Nunca armazenar senha em texto plano
   - Validar força antes de hash

3. **Compatibilidade:**
   - Usuários X existentes devem continuar funcionando
   - `xId` será opcional, mas mantido para usuários X
   - APIs devem ter fallbacks quando `xId` não existir

4. **Avatares:**
   - **Armazenamento:** Base64 no banco de dados
   - Lista pré-definida de avatares (10-20 opções, já em base64)
   - Upload de imagem: converter para base64 antes de salvar
   - Foto do Google: converter para base64 ao salvar
   - Formato: `data:image/png;base64,iVBORw0KGgoAAAANS...`
   - Limite de tamanho: 2MB (comprimido)
   - Tipos aceitos: jpg, png, webp

5. **Validação de Email:**
   - **Formato:** Regex padrão de email
   - **Domínio:** Verificação DNS (MX ou A record)
   - **Cache:** Armazenar domínios válidos por 24h (evitar múltiplas verificações)
   - **Timeout:** Máximo 5 segundos para verificação DNS
   - **Fallback:** Se DNS falhar, aceitar email (não bloquear usuário)

6. **Regras de Senha (Simples):**
   - Mínimo: 6 caracteres
   - Máximo: 100 caracteres
   - Aceita: Letras, números, símbolos, espaços
   - **Não exige:** Maiúsculas, números, símbolos especiais
   - Mensagem: "Senha deve ter entre 6 e 100 caracteres"

7. **Sistema "Permanecer Logado":**
   - **Com checkbox marcado:**
     - Sessão de 30 dias
     - Cookie persistente
   - **Sem checkbox:**
     - Sessão de 24 horas
     - Cookie de sessão (fecha ao fechar navegador)
   - Implementar via `maxAge` no NextAuth session config

---

---

## 📧 Validação de Email Detalhada

### Requisitos de Validação

1. **Validação de Formato:**
   ```typescript
   // Regex padrão de email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   ```

2. **Verificação de Domínio:**
   - Extrair domínio do email (ex: `gmail.com` de `user@gmail.com`)
   - Verificar se domínio tem registros DNS:
     - **Prioridade:** Verificar MX record (mail exchange)
     - **Fallback:** Verificar A record (se não tiver MX)
   - **Timeout:** Máximo 5 segundos
   - **Cache:** Armazenar resultado por 24 horas

3. **Implementação:**
   ```typescript
   // lib/email-validation.ts
   import dns from 'dns/promises'
   
   async function validateEmailDomain(email: string): Promise<boolean> {
     const domain = email.split('@')[1]
     
     try {
       // Verificar MX record
       const mxRecords = await Promise.race([
         dns.resolveMx(domain),
         new Promise((_, reject) => 
           setTimeout(() => reject(new Error('Timeout')), 5000)
         )
       ])
       
       return mxRecords.length > 0
     } catch {
       // Se MX falhar, verificar A record
       try {
         await Promise.race([
           dns.resolve4(domain),
           new Promise((_, reject) => 
             setTimeout(() => reject(new Error('Timeout')), 5000)
           )
         ])
         return true
       } catch {
         // Se ambos falharem, aceitar mesmo assim (não bloquear usuário)
         return true
       }
     }
   }
   ```

4. **Cache de Domínios:**
   - Usar Map ou Redis (se disponível)
   - Chave: domínio
   - Valor: `{ valid: boolean, timestamp: number }`
   - TTL: 24 horas

5. **Comportamento:**
   - ✅ Se domínio válido: Aceitar email
   - ✅ Se domínio inválido: Rejeitar email
   - ✅ Se timeout/erro: Aceitar email (não bloquear usuário)
   - ⚠️ Mostrar feedback ao usuário: "Verificando email..." durante validação

---

## 🔐 Sistema "Permanecer Logado" (Remember Me)

### Implementação no NextAuth

1. **Configuração de Sessão:**
   ```typescript
   // auth.config.ts
   session: {
     strategy: "database",
     maxAge: 30 * 24 * 60 * 60, // 30 dias (padrão)
     updateAge: 24 * 60 * 60,    // Atualizar a cada 24h
   }
   ```

2. **Lógica de "Remember Me":**
   - Passar parâmetro `rememberMe` no Credentials Provider
   - Ajustar `maxAge` da sessão baseado no parâmetro:
     - **Com "Remember Me":** 30 dias
     - **Sem "Remember Me":** 24 horas

3. **Implementação no Credentials Provider:**
   ```typescript
   Credentials({
     async authorize(credentials) {
       const { email, password, rememberMe } = credentials
       
       // Validar email/senha...
       
       // Criar sessão com duração baseada em rememberMe
       // Isso será gerenciado pelo NextAuth automaticamente
       return user
     }
   })
   ```

4. **Ajuste Dinâmico de Sessão:**
   - No callback `signIn`, verificar se `rememberMe` está presente
   - Ajustar `maxAge` da sessão criada
   - **Desafio:** NextAuth não permite ajustar `maxAge` por sessão individual
   - **Solução Alternativa:** Usar cookie customizado ou ajustar no `createSession` do adapter

5. **Cookie Configuration:**
   ```typescript
   cookies: {
     sessionToken: {
       options: {
         // Se "Remember Me": cookie persistente
         // Se não: cookie de sessão (expira ao fechar navegador)
         maxAge: rememberMe ? 30 * 24 * 60 * 60 : undefined,
       }
     }
   }
   ```

6. **UI/UX:**
   - Checkbox "Permanecer logado" no formulário de login
   - Tooltip explicativo: "Mantenha-me conectado por 30 dias"
   - Indicador visual quando logado com "Remember Me"

---

## 🖼️ Armazenamento de Avatar em Base64

### Requisitos Técnicos

1. **Formato de Armazenamento:**
   ```typescript
   // Formato: data:image/[tipo];base64,[dados]
   // Exemplo: data:image/png;base64,iVBORw0KGgoAAAANS...
   ```

2. **Limites:**
   - **Tamanho máximo:** 2MB (antes de base64)
   - **Tipos aceitos:** jpg, jpeg, png, webp
   - **Dimensões recomendadas:** 200x200px a 500x500px

3. **Conversão:**
   ```typescript
   // lib/avatar.ts
   function convertImageToBase64(file: File): Promise<string> {
     return new Promise((resolve, reject) => {
       // Validar tamanho (máx 2MB)
       if (file.size > 2 * 1024 * 1024) {
         reject(new Error('Imagem muito grande (máx 2MB)'))
         return
       }
       
       // Validar tipo
       const validTypes = ['image/jpeg', 'image/png', 'image/webp']
       if (!validTypes.includes(file.type)) {
         reject(new Error('Tipo de arquivo inválido'))
         return
       }
       
       const reader = new FileReader()
       reader.onload = () => {
         resolve(reader.result as string) // Já vem como data:image/...
       }
       reader.onerror = reject
       reader.readAsDataURL(file)
     })
   }
   ```

4. **Otimização (Opcional):**
   - Comprimir imagem antes de converter para base64
   - Redimensionar para tamanho máximo (500x500px)
   - Usar biblioteca como `browser-image-compression`

5. **Avatares Pré-definidos:**
   - Lista de 10-20 avatares já em base64
   - Armazenar em `lib/avatars.ts` ou arquivo JSON
   - Usuário pode escolher durante cadastro/setup

---

## 🔗 Referências

- NextAuth.js Credentials Provider: https://next-auth.js.org/configuration/providers/credentials
- NextAuth.js Google Provider: https://next-auth.js.org/providers/google
- NextAuth.js Session Configuration: https://next-auth.js.org/configuration/options#session
- bcrypt: https://www.npmjs.com/package/bcrypt
- Node.js crypto: https://nodejs.org/api/crypto.html
- Node.js DNS: https://nodejs.org/api/dns.html
- Base64 Encoding: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL

