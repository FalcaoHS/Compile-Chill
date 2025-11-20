# 🔍 SEO Configuration - Compile & Chill

Documentação completa sobre a configuração de SEO do Compile & Chill.

---

## 🗺️ Navegação Rápida

- [Arquivos de Configuração](#arquivos-de-configuração)
- [Metadados Implementados](#metadados-implementados)
- [Structured Data (JSON-LD)](#structured-data-json-ld)
- [Sitemap e Robots](#sitemap-e-robots)
- [Open Graph e Social Sharing](#open-graph-e-social-sharing)
- [Configuração e Variáveis](#configuração-e-variáveis)
- [Verificação e Testes](#verificação-e-testes)
- [Checklist de SEO](#checklist-de-seo)
- [Melhorias Futuras](#melhorias-futuras)

---

## 📁 Arquivos de Configuração

### 1. `app/layout.tsx`
**Localização:** `app/layout.tsx`  
**Função:** Metadados principais do site

**Contém:**
- ✅ **Title**: Template com suporte a títulos dinâmicos (`%s | Compile & Chill`)
- ✅ **Description**: Descrição otimizada para SEO
- ✅ **Keywords**: Array de palavras-chave relevantes
- ✅ **Open Graph**: Metadados para compartilhamento (Facebook, LinkedIn, etc.)
- ✅ **Twitter Cards**: Metadados para compartilhamento no X/Twitter
- ✅ **Robots**: Configuração de indexação e Googlebot
- ✅ **Verification**: Google Search Console verification code
- ✅ **Icons**: Favicon e logo configurados

**Palavras-chave atuais:**
- desenvolvedores, jogos para devs, descompressão
- hacker games, cyber games, jogos retro
- terminal games, ranking de desenvolvedores
- break time games, dev games

---

### 2. `app/robots.ts`
**Localização:** `app/robots.ts`  
**Função:** Instruções para crawlers e bots

**Configuração:**
- ✅ Permite indexação de todas as páginas públicas
- ✅ Bloqueia acesso a `/api/`, `/_next/`, `/admin/`
- ✅ Configuração específica para Googlebot
- ✅ Referência ao sitemap (`/sitemap.xml`)

**Regras:**
```typescript
- User Agent: * (todos)
  - Allow: /
  - Disallow: /api/, /_next/, /admin/
  
- User Agent: Googlebot
  - Allow: /
  - Disallow: /api/, /_next/
```

---

### 3. `app/sitemap.ts`
**Localização:** `app/sitemap.ts`  
**Função:** Sitemap dinâmico gerado automaticamente

**Páginas incluídas:**

**Páginas Estáticas:**
- `/` (Home) - Prioridade: 1.0, Frequência: daily
- `/jogos` - Prioridade: 0.9, Frequência: weekly
- `/ranking` - Prioridade: 0.8, Frequência: hourly
- `/blog` - Prioridade: 0.7, Frequência: weekly
- `/sobre` - Prioridade: 0.6, Frequência: monthly
- `/contato` - Prioridade: 0.5, Frequência: monthly
- `/impacto-social` - Prioridade: 0.6, Frequência: monthly
- `/termos` - Prioridade: 0.3, Frequência: yearly
- `/privacidade` - Prioridade: 0.3, Frequência: yearly

**Páginas Dinâmicas:**
- `/jogos/{game-id}` - Para cada jogo (10 jogos)
  - Prioridade: 0.7, Frequência: weekly

**Posts do Blog:**
- `/blog/meu-comeco`
- `/blog/1-dia-desenvolvimento`
- `/blog/ia-copiloto-criativo`
- `/blog/sistema-fisica-compile-chill`
  - Prioridade: 0.6, Frequência: monthly

---

### 4. `components/StructuredData.tsx`
**Localização:** `components/StructuredData.tsx`  
**Função:** Structured Data (JSON-LD) para rich snippets

**Schemas Implementados:**
- ✅ **Organization Schema**: Informações sobre o site
  - Nome, URL, logo, descrição
  - Links para redes sociais (Twitter)
- ✅ **WebSite Schema**: Informações do website
  - Nome, URL, descrição
  - SearchAction configurado (`/jogos?search={term}`)

**Schemas Futuros (planejados):**
- ⏳ **Game Schema**: Informações sobre cada jogo
- ⏳ **Person Schema**: Perfis de usuários (se público)

---

## 📊 Metadados Implementados

### Title Template
```typescript
default: "Compile & Chill"
template: "%s | Compile & Chill"
```

**Exemplos:**
- Home: "Compile & Chill"
- Jogo: "Terminal 2048 | Compile & Chill"
- Ranking: "Ranking | Compile & Chill"

### Description
> "Portal de descompressão para desenvolvedores. Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X."

### Metadata Base
```typescript
metadataBase: new URL(process.env.NEXTAUTH_URL || "https://compileandchill.dev")
```

### Canonical URLs
- Configurado para todas as páginas
- URL base: `process.env.NEXTAUTH_URL`

---

## 🏷️ Structured Data (JSON-LD)

### Status: ✅ Implementado

**Arquivo:** `components/StructuredData.tsx`  
**Incluído em:** `app/layout.tsx` (no `<head>`)

**Schemas Ativos:**

1. **Organization Schema**
   ```json
   {
     "@type": "Organization",
     "name": "Compile & Chill",
     "url": "https://compileandchill.dev",
     "logo": "https://compileandchill.dev/logo.png",
     "sameAs": ["https://twitter.com/compileandchill"]
   }
   ```

2. **WebSite Schema**
   ```json
   {
     "@type": "WebSite",
     "name": "Compile & Chill",
     "potentialAction": {
       "@type": "SearchAction",
       "target": "https://compileandchill.dev/jogos?search={search_term_string}"
     }
   }
   ```

**Benefícios:**
- Rich snippets nos resultados de busca
- Knowledge Graph do Google
- Busca integrada no site

---

## 🗺️ Sitemap e Robots

### Sitemap
**URL:** `https://compileandchill.dev/sitemap.xml`  
**Tipo:** Dinâmico (gerado automaticamente)  
**Total de URLs:** ~23 páginas

**Estrutura:**
- Páginas estáticas: 9
- Páginas de jogos: 10
- Posts do blog: 4

### Robots.txt
**URL:** `https://compileandchill.dev/robots.txt`  
**Status:** ✅ Configurado

**Permissões:**
- ✅ Indexação permitida para páginas públicas
- ✅ Bloqueio de `/api/`, `/_next/`, `/admin/`
- ✅ Referência ao sitemap incluída

---

## 📱 Open Graph e Social Sharing

### Open Graph Tags
**Status:** ✅ Implementado

**Configuração:**
- **Type:** `website`
- **Locale:** `pt_BR`
- **Site Name:** "Compile & Chill"
- **Image:** `/og.png` (1200x630px)
- **Title:** "Compile & Chill - Portal de Descompressão para Desenvolvedores"
- **Description:** Descrição otimizada

### Twitter Cards
**Status:** ✅ Implementado

**Configuração:**
- **Card Type:** `summary_large_image`
- **Creator:** `@compileandchill`
- **Image:** `/og.png`
- **Title e Description:** Configurados

### Imagem Open Graph
**Localização:** `/public/og.png`  
**Tamanho:** 1200x630px (recomendado)  
**Formato:** PNG ou JPG  
**Status:** ⚠️ Verificar se existe

**Conteúdo sugerido:**
- Logo do Compile & Chill
- Texto: "Compile & Chill - Portal de Descompressão para Desenvolvedores"
- Estética hacker/cyber

---

## ⚙️ Configuração e Variáveis

### Variáveis de Ambiente Necessárias

```env
NEXTAUTH_URL=https://compileandchill.dev
```

**Uso:**
- `metadataBase` nos metadados
- URLs absolutas no sitemap
- URLs canônicas
- Structured Data

### Google Analytics
**Status:** ✅ Implementado  
**Componente:** `components/GoogleAnalytics.tsx`  
**Incluído em:** `app/layout.tsx`

**ID de Verificação Google:**
- `G-QDK4PWT6K9` (configurado em `app/layout.tsx`)

---

## ✅ Verificação e Testes

### Google Search Console
**Status:** ⚠️ Configuração pendente

**Passos:**
1. Acesse [Google Search Console](https://search.google.com/search-console)
2. Adicione sua propriedade (URL do site)
3. Verifique a propriedade usando:
   - **HTML tag**: Já configurado (`verification.google` em `app/layout.tsx`)
   - **HTML file**: Upload do arquivo fornecido
   - **DNS**: Adicione o registro TXT no DNS

**Verification Code:** `G-QDK4PWT6K9` (já no código)

### Twitter/X Card Validator
**URL:** [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**Como testar:**
1. Acesse o validador
2. Cole a URL do site
3. Verifique se a imagem e descrição aparecem corretamente

### Ferramentas de Teste

**Robots.txt:**
```
https://compileandchill.dev/robots.txt
```

**Sitemap:**
```
https://compileandchill.dev/sitemap.xml
```

**Metadados:**
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## ✅ Checklist de SEO

### Implementado ✅
- [x] Metadados completos no layout (`app/layout.tsx`)
- [x] Robots.txt configurado (`app/robots.ts`)
- [x] Sitemap dinâmico (`app/sitemap.ts`)
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Structured Data (JSON-LD) - Organization e WebSite
- [x] Google Analytics integrado
- [x] Google Search Console verification code configurado
- [x] Canonical URLs
- [x] Metadata base configurado
- [x] Icons e favicon configurados

### Pendente ⚠️
- [ ] Imagem OG criada e verificada (`/public/og.png`)
- [ ] Google Search Console propriedade verificada
- [ ] Teste de Twitter Cards realizado
- [ ] Teste de Facebook Sharing realizado
- [ ] Structured Data testado no Google Rich Results Test
- [ ] Game Schema adicionado (para cada jogo)
- [ ] Person Schema adicionado (se perfis forem públicos)

---

## 🚀 Melhorias Futuras

### Structured Data Adicional
**Prioridade:** Média

**Schemas a adicionar:**
- **Game Schema**: Informações sobre cada jogo
  - Nome, descrição, imagem
  - Categoria, dificuldade
  - Rating (se implementado)
- **Person Schema**: Perfis de usuários (se público)
  - Nome, avatar, descrição
  - Links para redes sociais
- **BreadcrumbList**: Navegação hierárquica
- **Article Schema**: Para posts do blog

### Performance SEO
**Prioridade:** Alta

**Otimizações:**
- ✅ Lazy loading de componentes (já implementado)
- ⏳ Otimizar imagens (WebP, compressão)
- ⏳ Preconnect para domínios externos
- ⏳ Resource hints (dns-prefetch, preconnect)

### Analytics e Monitoramento
**Prioridade:** Média

**Ferramentas:**
- ✅ Google Analytics 4 (implementado)
- ⏳ Vercel Analytics (se usar Vercel)
- ⏳ Search Console integrado
- ⏳ Core Web Vitals monitoring

### Internacionalização (i18n)
**Prioridade:** Baixa

**Melhorias:**
- ⏳ Suporte a múltiplos idiomas
- ⏳ Hreflang tags
- ⏳ Sitemaps por idioma

---

## 📝 Notas Técnicas

### Arquivos Principais
- **Metadados:** `app/layout.tsx`
- **Robots:** `app/robots.ts`
- **Sitemap:** `app/sitemap.ts`
- **Structured Data:** `components/StructuredData.tsx`
- **Google Analytics:** `components/GoogleAnalytics.tsx`

### Dependências
- Next.js Metadata API
- Schema.org vocabularies
- Open Graph protocol
- Twitter Card protocol

### URLs Importantes
- **Base URL:** `process.env.NEXTAUTH_URL` ou `https://compileandchill.dev`
- **Sitemap:** `${baseUrl}/sitemap.xml`
- **Robots:** `${baseUrl}/robots.txt`
- **OG Image:** `${baseUrl}/og.png`

---

## 🔗 Links Úteis

### Documentação
- [Next.js Metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)

### Ferramentas de Teste
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Consoles e Dashboards
- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com/)

---

**Última atualização:** 2025-01-XX  
**Status geral:** ✅ **Bem configurado** (faltam apenas verificações e testes)
