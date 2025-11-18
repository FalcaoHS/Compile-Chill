# SEO Configuration

Documentação sobre a configuração de SEO do Compile & Chill.

## Arquivos de SEO

### 1. `app/layout.tsx`
Contém os metadados principais do site:
- **Title**: Template com suporte a títulos dinâmicos
- **Description**: Descrição otimizada para SEO
- **Keywords**: Palavras-chave relevantes
- **Open Graph**: Metadados para compartilhamento no Facebook, LinkedIn, etc.
- **Twitter Cards**: Metadados para compartilhamento no X/Twitter
- **Robots**: Configuração de indexação

### 2. `app/robots.ts`
Arquivo de instruções para crawlers:
- Permite indexação de todas as páginas públicas
- Bloqueia acesso a `/api/`, `/_next/`, `/admin/`
- Configuração específica para Googlebot
- Referência ao sitemap

### 3. `app/sitemap.ts`
Sitemap dinâmico gerado automaticamente:
- Páginas estáticas (Home, Ranking, Profile)
- Páginas de jogos (geradas dinamicamente)
- Prioridades e frequência de atualização configuradas

## URLs Geradas

O sitemap gera automaticamente:
- `/` (Home)
- `/ranking`
- `/profile`
- `/jogos/{game-id}` (para cada jogo)

## Variáveis de Ambiente

Certifique-se de ter configurado:
```env
NEXTAUTH_URL=https://seu-dominio.com
```

Isso é usado para:
- `metadataBase` nos metadados
- URLs absolutas no sitemap
- URLs canônicas

## Imagens Open Graph

Você precisa criar uma imagem Open Graph:
- **Localização**: `/public/og-image.png`
- **Tamanho recomendado**: 1200x630px
- **Formato**: PNG ou JPG
- **Conteúdo**: Logo + texto "Compile & Chill - Portal de Descompressão para Desenvolvedores"

## Verificação no Google Search Console

1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione sua propriedade (URL do site)
3. Verifique a propriedade usando um dos métodos:
   - **HTML tag**: Adicione o código no campo `verification.google` em `app/layout.tsx`
   - **HTML file**: Faça upload do arquivo fornecido
   - **DNS**: Adicione o registro TXT no DNS

## Twitter/X Card Verification

Para verificar se os Twitter Cards estão funcionando:
1. Acesse [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Cole a URL do seu site
3. Verifique se a imagem e descrição aparecem corretamente

## Melhorias Futuras

### Structured Data (JSON-LD)
Considere adicionar structured data para:
- **Organization**: Informações sobre o site
- **WebSite**: Busca no site
- **Game**: Informações sobre cada jogo
- **Person**: Perfis de usuários (se público)

### Performance
- Otimizar imagens (WebP, lazy loading)
- Implementar lazy loading de componentes
- Adicionar preconnect para domínios externos

### Analytics
- Google Analytics 4
- Vercel Analytics (já integrado se usar Vercel)

## Checklist de SEO

- [x] Metadados completos no layout
- [x] Robots.txt configurado
- [x] Sitemap dinâmico
- [x] Open Graph tags
- [x] Twitter Cards
- [ ] Imagem OG criada (`/public/og-image.png`)
- [ ] Google Search Console configurado
- [ ] Structured Data (JSON-LD)
- [ ] Verificação de propriedade no Google
- [ ] Teste de Twitter Cards

## Testes

### Testar Robots.txt
```
https://seu-dominio.com/robots.txt
```

### Testar Sitemap
```
https://seu-dominio.com/sitemap.xml
```

### Testar Metadados
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

