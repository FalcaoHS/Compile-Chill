# Prisma Schema

## ⚠️ Nota sobre o Linter

Se você estiver vendo um erro do linter sobre `url` no datasource sendo "não suportado", isso é um **falso positivo**.

Este projeto usa **Prisma 6.19.0**, onde `url` no datasource é **válido e necessário**. O erro aparece porque o Prisma Language Server no editor pode estar usando regras do Prisma 7.

### Validação

O schema está **correto e válido**. Você pode verificar executando:

```bash
npx prisma validate
```

Isso confirmará que o schema está válido para Prisma 6.19.0.

### Prisma 7 vs Prisma 6

- **Prisma 6.x**: `url` no datasource é **obrigatório e válido**
- **Prisma 7+**: Usa `prisma.config.ts` para configuração de conexão

Como estamos no Prisma 6.19.0, o schema atual está **correto**.

### Ignorando o Erro no Editor

Se o erro do linter estiver incomodando, você pode:

1. **VS Code**: O arquivo `.vscode/settings.json` já está configurado para ignorar esse aviso
2. **Outros editores**: Configure o Prisma Language Server para usar a versão 6.x

### Migração Futura

Quando migrarmos para Prisma 7+, precisaremos:
1. Criar `prisma.config.ts`
2. Remover `url` do datasource
3. Passar a configuração para o `PrismaClient` constructor

Mas por enquanto, o schema está **correto** para Prisma 6.19.0.

