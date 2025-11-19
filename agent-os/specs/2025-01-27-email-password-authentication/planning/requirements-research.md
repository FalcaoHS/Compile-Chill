# Spec Requirements: Autenticação Email/Senha + Google OAuth

## Initial Description

Alguns usuários estão reclamando que o login do X não funciona, quero dar uma alternativa rápida pra eles como um cadastro de usuário, nome, e-mail e senha para entrar. Só que o sistema está todo voltado pra informações que veem do X, seguindo arquivo MD anexado, planeja algo e me sugira opções, fáceis, seguras e sem muito transtorno na configuração e execução. sem ter que usar SMTP ou coisa parecida.

**Decisão Final:** Implementar AMBOS - Email/Senha (Credentials Provider) e Google OAuth.

---

## Requirements Discussion

### First Round Questions

**Q1:** Qual opção de autenticação você prefere? Credentials Provider (email/senha), Google OAuth, ou ambos?

**Answer:** Ambos - Email/Senha e Google OAuth.

**Q2:** Precisa de verificação de email via SMTP?

**Answer:** Não, sem SMTP. Apenas validação de formato e domínio.

**Q3:** Quais regras de senha você prefere? Complexas (maiúsculas, números, símbolos) ou simples?

**Answer:** Regras simples - mínimo 6 caracteres, máximo 100, sem exigências especiais.

**Q4:** Precisa de sistema "Permanecer logado" (Remember Me)?

**Answer:** Sim, com checkbox no login. Sessão de 30 dias se marcado, 24 horas se não.

**Q5:** Como armazenar avatares? URL, base64, ou outro formato?

**Answer:** Base64 nas tabelas do banco.

**Q6:** Após autenticar com Google, precisa solicitar nome e foto do usuário?

**Answer:** Sim, solicitar nome a ser exibido e foto/avatar (com opções de escolher avatar ou usar foto do Google).

**Q7:** O nome do usuário deve ser criptografado no banco?

**Answer:** Sim, nome deve ser criptografado (dado sensível).

**Q8:** Validação de email deve verificar se o domínio existe?

**Answer:** Sim, validar bem o email, incluindo evitar domínios inexistentes.

---

### Existing Code to Reference

**Similar Features Identified:**

- **Feature:** X OAuth Authentication - Path: `agent-os/specs/2025-11-17-x-oauth-authentication/`
- **Components to potentially reuse:**
  - `components/LoginButton.tsx` - Padrão de botão de login com loading state
  - `components/ProfileButton.tsx` - Padrão de botão de perfil com dropdown
  - `components/Header.tsx` - Integração de botões de autenticação no header
- **Backend logic to reference:**
  - `auth.config.ts` - Configuração do NextAuth com Twitter provider
  - `lib/auth-adapter.ts` - Adapter customizado para NextAuth
  - `app/api/users/me/route.ts` - API de dados do usuário autenticado
  - `app/api/users/[id]/route.ts` - API de perfil público do usuário

**Padrões a seguir:**
- Usar NextAuth.js v5 (beta) como base
- Reutilizar estrutura de sessão existente
- Manter compatibilidade com usuários X existentes
- Seguir padrões de validação e segurança já estabelecidos

---

### Follow-up Questions

**Follow-up 1:** Como você quer que o fluxo de login funcione? Manter botão X e adicionar opções abaixo, ou criar página de login separada?

**Answer:** Manter botão X e adicionar opções (Google e Email/Senha) na mesma página.

**Follow-up 2:** Para o cadastro, criar página separada `/signup` ou modal/formulário na home?

**Answer:** Página separada `/signup`.

---

## Visual Assets

### Files Provided:
No visual assets provided.

### Visual Insights:
No visual assets to analyze. Design will follow existing patterns from LoginButton and ProfileButton components, maintaining theme-aware styling with TailwindCSS.

---

## Requirements Summary

### Functional Requirements

**Autenticação Email/Senha:**
- Página de cadastro `/signup` com formulário completo
- Campos: Nome (criptografado), Email (validado), Senha (hash bcrypt), Confirmar Senha, Avatar (base64)
- Validação de email: formato + verificação DNS de domínio
- Regras de senha simples: 6-100 caracteres
- Hash de senha com bcrypt antes de salvar
- Criptografia de nome com AES-256
- Sistema "Permanecer logado" (30 dias vs 24 horas)

**Autenticação Google OAuth:**
- Adicionar Google Provider ao NextAuth
- Após autenticação bem-sucedida, redirecionar para `/setup-profile` (primeira vez)
- Solicitar nome a ser exibido (criptografado) e escolha de avatar
- Opções de avatar: usar foto do Google, escolher avatar pré-definido, ou upload personalizado
- Se já configurou, pular tela de setup

**Banco de Dados:**
- Tornar `xId` opcional no schema User
- Adicionar campos: `email` (único, opcional), `passwordHash` (bcrypt), `nameEncrypted` (AES-256), `avatar` (base64, @db.Text)
- Manter compatibilidade com usuários X existentes

**APIs:**
- Ajustar `/api/users/me` para descriptografar nome e lidar com usuários sem `xId`
- Ajustar `/api/users/[id]` para descriptografar nome e usar fallback quando não tiver `xId`
- Criar validação de email robusta (formato + DNS)

**UI/UX:**
- Manter botão "Entrar com X" existente
- Adicionar botão "Entrar com Google"
- Adicionar link "Ou entrar com Email e Senha"
- Formulário de login com checkbox "Permanecer logado"
- Página de cadastro com seletor de avatar (base64)
- Página de setup de perfil para Google (primeira vez)

### Reusability Opportunities

**Componentes existentes a reutilizar:**
- `components/LoginButton.tsx` - Padrão de botão de autenticação (criar variantes para Google e Email)
- `components/ProfileButton.tsx` - Já funciona, não precisa mudar
- `components/Header.tsx` - Adicionar novos botões de login

**Lógica backend a reutilizar:**
- Estrutura de NextAuth existente
- Adapter customizado (`lib/auth-adapter.ts`) - ajustar para suportar múltiplos providers
- Padrões de validação e segurança já estabelecidos
- Estrutura de sessão (já funciona para qualquer provider)

**Padrões de design:**
- Theme-aware styling com TailwindCSS
- Loading states e error handling
- Responsive design
- Acessibilidade (keyboard navigation, ARIA labels)

### Scope Boundaries

**In Scope:**
- Email/Senha authentication (Credentials Provider)
- Google OAuth authentication
- Criptografia de nome (AES-256)
- Hash de senha (bcrypt)
- Validação robusta de email (formato + DNS)
- Sistema "Permanecer logado" (Remember Me)
- Armazenamento de avatar em base64
- Setup de perfil após Google OAuth (primeira vez)
- Seletor de avatar (pré-definidos + upload)
- Compatibilidade com usuários X existentes
- Ajustes nas APIs para suportar múltiplos providers

**Out of Scope:**
- Verificação de email via SMTP
- Recuperação de senha (requer SMTP)
- Validação de email em tempo real durante digitação (apenas no submit)
- Múltiplos avatares por usuário
- Edição de perfil após cadastro (futuro)
- Integração com outros providers OAuth (GitHub, etc.)

### Technical Considerations

**Integração com sistema existente:**
- NextAuth.js v5 (beta) já configurado
- Prisma ORM com PostgreSQL
- Estrutura de sessão em banco de dados
- Tabela `accounts` já suporta múltiplos providers (constraint único por provider)

**Tecnologias adicionais necessárias:**
- `bcrypt` para hash de senhas
- `crypto` (Node.js built-in) para criptografia AES-256
- `dns` (Node.js built-in) para verificação de domínio de email
- Google OAuth credentials (variáveis de ambiente)

**Constraints e limitações:**
- `xId` atualmente obrigatório - precisa tornar opcional
- APIs assumem `xId` sempre existe - precisa adicionar fallbacks
- Adapter customizado assume `xId` - precisa ajustar para aceitar usuários sem `xId`

**Segurança:**
- Senhas nunca em texto plano (sempre hash bcrypt)
- Nome sempre criptografado (AES-256)
- Validação de entrada em todas as APIs
- Rate limiting em endpoints de autenticação
- Proteção CSRF (NextAuth já inclui)

**Performance:**
- Cache de validação de domínio de email (24h)
- Timeout de 5 segundos para verificação DNS
- Base64 de avatar limitado a 2MB
- Sessões otimizadas (já configurado no NextAuth)

---

## Additional Requirements (From Detailed Planning)

### Validação de Email Detalhada
- Formato: Regex padrão de email
- Domínio: Verificação DNS (MX ou A record)
- Cache: Domínios válidos por 24h
- Timeout: 5 segundos máximo
- Fallback: Se DNS falhar, aceitar email (não bloquear usuário)

### Sistema "Permanecer Logado"
- Checkbox no formulário de login
- Com "Remember Me": Sessão de 30 dias (cookie persistente)
- Sem "Remember Me": Sessão de 24 horas (cookie de sessão)
- Implementação via `maxAge` no NextAuth session config

### Armazenamento de Avatar em Base64
- Formato: `data:image/[tipo];base64,[dados]`
- Limites: Máx 2MB, tipos jpg/png/webp
- Conversão automática no upload
- Avatares pré-definidos também em base64

### Criptografia de Nome
- Algoritmo: AES-256-GCM
- Chave: 32 bytes (256 bits) em variável de ambiente
- IV: Único por registro (gerar aleatório)
- Armazenar IV junto com dados criptografados

---

## Branch Information

**Branch:** `feature/email-password-google-auth` ✅

**Status:** Requisitos coletados e documentados. Pronto para criação da spec completa.

