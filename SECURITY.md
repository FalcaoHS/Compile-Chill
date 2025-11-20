# Security Policy

## 🔒 Política de Segurança

A segurança é uma prioridade para o Compile & Chill. Valorizamos a segurança do projeto e da comunidade.

## 🛡️ Versões Suportadas

Atualmente, estamos fornecendo atualizações de segurança para:

| Versão | Suporte          |
| ------ | ---------------- |
| 0.1.x  | :white_check_mark: |

## 🚨 Reportando Vulnerabilidades

Se você descobriu uma vulnerabilidade de segurança, **NÃO** abra uma issue pública. Em vez disso, siga estas etapas:

1. **Entre em contato diretamente** através de um dos seguintes métodos:
   - Email: falcaoh@gmail.com
   - Abra uma [Security Advisory](https://github.com/seu-usuario/compile-and-chill/security/advisories/new) no GitHub

2. **Inclua as seguintes informações**:
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sugestões de correção (se houver)

3. **Tempo de resposta esperado**:
   - Confirmação inicial: 48 horas
   - Análise e correção: 7-14 dias (dependendo da severidade)

## ✅ Boas Práticas de Segurança

### Para Desenvolvedores

- ⚠️ **Nunca commite credenciais** no código
- ⚠️ Use variáveis de ambiente para dados sensíveis
- ⚠️ Valide todas as entradas do usuário
- ⚠️ Use HTTPS em produção
- ⚠️ Mantenha dependências atualizadas
- ⚠️ Revise código antes de fazer merge

### Para Usuários

- ⚠️ Não compartilhe suas credenciais
- ⚠️ Use senhas fortes (se aplicável)
- ⚠️ Mantenha seu ambiente atualizado
- ⚠️ Reporte comportamentos suspeitos

## 🔍 Áreas de Foco de Segurança

- Autenticação OAuth (NextAuth.js)
- Validação de scores (anti-cheat)
- Rate limiting (Upstash Redis)
- Sanitização de inputs
- Proteção CSRF
- Headers de segurança HTTP

## 📋 Checklist de Segurança

Antes de fazer deploy:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] `NEXTAUTH_SECRET` gerado e seguro
- [ ] Credenciais OAuth configuradas corretamente
- [ ] Rate limiting ativo
- [ ] HTTPS configurado
- [ ] Dependências atualizadas
- [ ] Headers de segurança configurados
- [ ] Validação de inputs implementada

## 🙏 Agradecimentos

Agradecemos a todos que ajudam a manter o Compile & Chill seguro reportando vulnerabilidades de forma responsável.
