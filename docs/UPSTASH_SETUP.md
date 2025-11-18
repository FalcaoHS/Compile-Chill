# Configuração do Upstash Redis

Guia passo a passo para configurar rate limiting com Upstash Redis.

## 1. Criar conta no Upstash

1. Acesse [https://console.upstash.com/](https://console.upstash.com/)
2. Faça login ou crie uma conta (gratuita)

## 2. Criar banco Redis

1. No console, clique em **"+ Create Database"**
2. Configure:
   - **Name**: `compile-and-chill-redis` (ou outro nome de sua escolha)
   - **Type**: `Regional` (recomendado para melhor performance)
   - **Region**: Escolha a região mais próxima dos seus usuários
     - Ex: `us-east-1` (Norte da Virgínia)
     - Ex: `sa-east-1` (São Paulo) - se tiver usuários no Brasil
   - **Primary region**: Selecione a mesma região
3. Clique em **"Create"**

## 3. Obter credenciais

Após criar o banco, você verá uma página com as credenciais:

- **REST URL**: `https://xxxxx-xxxxx.upstash.io`
- **REST TOKEN**: `AXxxxxx...` (token longo)

⚠️ **IMPORTANTE**: Copie essas credenciais imediatamente. O token só é mostrado uma vez!

## 4. Adicionar variáveis de ambiente

### Local (.env)

Adicione ao arquivo `.env` na raiz do projeto:

```env
UPSTASH_REDIS_REST_URL="https://seu-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="seu-token-aqui"
```

### Produção (Vercel/outros)

1. **Vercel**:
   - Vá em Settings → Environment Variables
   - Adicione:
     - `UPSTASH_REDIS_REST_URL`
     - `UPSTASH_REDIS_REST_TOKEN`
   - Selecione os ambientes (Production, Preview, Development)
   - Clique em "Save"

2. **Outros provedores**:
   - Adicione as mesmas variáveis no painel de configuração do seu provedor

## 5. Verificar funcionamento

Após adicionar as variáveis:

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Você NÃO deve mais ver o aviso:
   ```
   ⚠️  Upstash Redis not configured. Rate limiting is DISABLED.
   ```

3. Teste fazendo várias requisições rápidas a um endpoint protegido (ex: `/api/scores`). Após o limite, você deve receber um erro 429.

## 6. Planos e limites (Free Tier)

O plano gratuito do Upstash inclui:
- **10,000 comandos/dia**
- **256 MB de storage**
- **Perfeito para começar!**

Se precisar de mais, os planos pagos começam em $0.20/100k comandos.

## Troubleshooting

### Aviso ainda aparece após configurar

1. Verifique se as variáveis estão no `.env` (não `.env.local`)
2. Reinicie o servidor completamente
3. Verifique se não há espaços extras nas variáveis
4. Confirme que as credenciais estão corretas

### Erro de conexão

1. Verifique se o REST URL está correto (deve começar com `https://`)
2. Verifique se o token está completo (não cortado)
3. Confirme que o banco Redis está ativo no console do Upstash

### Rate limit não funciona

1. Verifique os logs do servidor para erros
2. Teste fazendo requisições rápidas (ex: 15 requisições em 1 minuto para `/api/scores`)
3. Verifique no console do Upstash se os comandos estão sendo contados

## Referências

- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [Upstash Rate Limiting](https://docs.upstash.com/ratelimit)
- [Console Upstash](https://console.upstash.com/)

