# ⚙️ Setup e Configuração

> 🇧🇷 [Português (PT-BR)](README.md) - Padrão / Default  
> 🇺🇸 [English (EN)](README.en.md)

Documentação sobre configuração e setup de serviços externos e ferramentas do Compile & Chill.

---

## 📁 Estrutura

```
setup/
├── README.md              # Este arquivo
├── UPSTASH_SETUP.md       # Configuração do Upstash Redis (Rate Limiting)
└── GITHUB_SETUP.md        # Configuração do GitHub (CI/CD, Actions, etc.)
```

---

## 📋 Documentos Disponíveis

### 1. Upstash Redis
**Arquivo:** `UPSTASH_SETUP.md`  
**Descrição:** Guia passo a passo para configurar rate limiting com Upstash Redis.

**Conteúdo:**
- Criação de conta no Upstash
- Configuração do banco Redis
- Obtenção de credenciais
- Configuração de variáveis de ambiente
- Verificação de funcionamento
- Troubleshooting

**Quando usar:**
- Ao configurar rate limiting pela primeira vez
- Ao migrar para produção
- Ao resolver problemas de conexão com Redis

---

### 2. GitHub Setup
**Arquivo:** `GITHUB_SETUP.md`  
**Descrição:** Configuração do GitHub para o projeto.

**Conteúdo:**
- Configuração de repositório
- CI/CD e GitHub Actions
- Configurações de segurança
- Workflows

**Quando usar:**
- Ao configurar o repositório pela primeira vez
- Ao configurar CI/CD
- Ao trabalhar com GitHub Actions

---

## 🔗 Links Relacionados

- [Documentação Técnica](../reference/) - SEO, APIs, etc.
- [Guias para Iniciantes](../) - Guias completos de setup
- [Backlog](../../backlog/) - Features e melhorias futuras

---

**Última atualização:** 2025-01-XX

