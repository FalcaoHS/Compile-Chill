# Análise de Opções: Autenticação Email/Senha

## Contexto Atual

- **Sistema de Auth:** NextAuth.js v5 (beta)
- **Provider Atual:** Twitter/X OAuth
- **Banco de Dados:** PostgreSQL com Prisma
- **Modelo User:** Tem `xId` como campo obrigatório e único
- **Requisitos:** Fácil, seguro, sem SMTP, mínimo transtorno

## Opções de Implementação

### Opção 1: Credentials Provider do NextAuth (RECOMENDADA) ⭐

**Vantagens:**
- ✅ Já integrado ao NextAuth.js (sem bibliotecas extras)
- ✅ Reutiliza toda infraestrutura de sessão existente
- ✅ Compatível com o sistema atual
- ✅ Sem necessidade de SMTP (sem verificação de email)
- ✅ Implementação relativamente simples

**Desafios:**
- ⚠️ Precisa tornar `xId` opcional no modelo User
- ⚠️ Precisa adicionar campos `email` e `password` (hash) ao User
- ⚠️ Precisa criar lógica de hash de senha (bcrypt)
- ⚠️ Precisa criar páginas de cadastro/login

**Complexidade:** Média-Baixa
**Tempo Estimado:** 2-3 horas
**Impacto no Sistema:** Baixo (compatível com usuários X existentes)

---

### Opção 2: Magic Link (Email sem SMTP) ❌

**Por que não:**
- ❌ Requer SMTP para enviar links
- ❌ Usuário pediu especificamente sem SMTP
- ❌ Mais complexo que necessário

**Complexidade:** Alta
**Tempo Estimado:** 4-6 horas
**Impacto no Sistema:** Médio

---

### Opção 3: OAuth com Google/GitHub como alternativa ⚠️

**Vantagens:**
- ✅ Não precisa gerenciar senhas
- ✅ Reutiliza estrutura OAuth existente
- ✅ Mais seguro (sem senhas no banco)

**Desvantagens:**
- ❌ Usuário ainda depende de serviço externo
- ❌ Não resolve o problema se usuário não tem conta Google/GitHub
- ❌ Usuário pediu especificamente email/senha

**Complexidade:** Baixa
**Tempo Estimado:** 1-2 horas
**Impacto no Sistema:** Baixo

---

## Recomendação: Opção 1 (Credentials Provider)

### Por quê?

1. **Atende exatamente o que o usuário pediu:** Email e senha
2. **Sem SMTP:** Não precisa verificar email
3. **Seguro:** NextAuth gerencia sessões, bcrypt para senhas
4. **Compatível:** Funciona junto com login X existente
5. **Mínimo transtorno:** Aproveita infraestrutura existente

### Mudanças Necessárias

#### 1. Schema Prisma
```prisma
model User {
  // ... campos existentes ...
  xId       String?  @unique  // Tornar opcional
  email     String?  @unique  // Adicionar email (opcional, único)
  password  String?           // Hash da senha (opcional)
  // ... resto dos campos ...
}
```

#### 2. NextAuth Config
- Adicionar Credentials Provider
- Manter Twitter Provider (ambos funcionam juntos)

#### 3. Páginas
- `/signup` - Cadastro com nome, email, senha
- Modificar `/` para mostrar opções: "Entrar com X" ou "Entrar com Email"

#### 4. Validação
- Validar email único
- Validar senha forte (mínimo 8 caracteres)
- Hash com bcrypt antes de salvar

### Segurança

- ✅ Senhas hasheadas com bcrypt (salt automático)
- ✅ Sessões gerenciadas pelo NextAuth (mesmo sistema do X)
- ✅ Cookies seguros (já configurado)
- ✅ Validação de entrada (email format, senha strength)
- ⚠️ Sem verificação de email (aceitável para MVP, pode adicionar depois)

### Compatibilidade

- ✅ Usuários X existentes continuam funcionando
- ✅ Novos usuários podem escolher X ou Email/Senha
- ✅ Mesma sessão, mesma experiência após login

---

## Alternativa Simplificada (Se precisar de algo ainda mais rápido)

### Opção 1.5: Email como identificador único, sem senha complexa

**Variação:** Permitir senhas mais simples inicialmente, focar em fazer funcionar rápido.

**Trade-off:** Menos seguro, mas mais rápido de implementar.

**Recomendação:** Não. Melhor fazer direito desde o início com bcrypt.

---

## Próximos Passos Sugeridos

1. ✅ Inicializar spec (FEITO)
2. ⏭️ Pesquisar requisitos detalhados
3. ⏭️ Criar spec completa
4. ⏭️ Implementar mudanças no schema
5. ⏭️ Implementar Credentials Provider
6. ⏭️ Criar páginas de cadastro/login
7. ⏭️ Testar compatibilidade com usuários X

---

## Perguntas para o Usuário

1. **Senha mínima:** Qual complexidade? (8 caracteres? Maiúsculas/números?)
2. **Recuperação de senha:** Precisa? (se sim, aí precisaria SMTP)
3. **Validação de email:** Precisa verificar se email é válido? (sem SMTP, só formato)
4. **UI/UX:** Manter botão X e adicionar "ou entrar com email" abaixo?

