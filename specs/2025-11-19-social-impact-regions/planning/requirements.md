# Spec Requirements: Social Impact / Regions of Interest

## Initial Description

Nosso projeto busca apoiar comunidades com **acesso limitado a recursos digitais**. Aqui estão três países onde vemos grande oportunidade de impacto:

- **Etiópia** — acesso digital baixo, muitos jovens sem conexão.  

- **Uganda** — barreiras de infraestrutura e alto custo de dados.  

- **Tanzânia** — comunidades rurais com acesso limitado e grande interesse por tecnologia.

Esses países falam línguas como **amárico**, **inglês**, **suaíli** e outras locais. Se você é desenvolvedor, tradutor ou educador e quer contribuir voltado para essas regiões, considere:  

1. Produzir documentação / tutoriais em inglês + línguas locais relevantes  

2. Criar pacotes ou versões "light" da ferramenta para uso offline ou com baixa largura de banda  

3. Conectar com ONGs locais, escolas, ou projetos de educação digital para distribuir esse conteúdo

## Requirements Discussion

### First Round Questions

**Q1:** Escopo da funcionalidade: assumo que isso será uma nova seção/página no site (ex.: `/impacto-social` ou `/regioes-interesse`) que apresenta os países-alvo e formas de contribuir. Está correto, ou deve ser integrado em uma página existente (ex.: "Sobre")?

**Answer:** 
- Recomendado uma nova página/seção dedicada, como `/impacto-social` ou `/regioes-interesse`
- É melhor do que misturar no "Sobre", porque permite expandir depois sem bagunçar o fluxo principal
- No README, isso aparece como uma seção específica ("🌍 Impacto Social")

**Q2:** Suporte multilíngue: vejo que já há documentação em PT, EN e ES. Para Etiópia, Uganda e Tanzânia, devemos adicionar amárico e suaíli além do inglês? Ou começar apenas com inglês e planejar a expansão?

**Answer:**
- NÃO é necessário começar com amárico ou suaíli agora
- Comece apenas com inglês, que já cobre Etiópia, Uganda e parte da Tanzânia no contexto educacional/tech
- Planejamento recomendado:
  - Fase 1 → Somente inglês
  - Fase 2 → Adicionar suaíli (impacta muito Tanzânia e parte do Quênia)
  - Fase 3 → Adicionar amárico (impacta Etiópia)
- Boa prática: listar a intenção futura no roadmap, mas não implementar já

**Q3:** Versões "light" offline: assumo que isso envolve criar builds otimizados dos jogos (menos assets, modo offline, menor consumo de dados). Isso deve ser uma opção na interface (ex.: "Modo Economia de Dados") ou builds separados para download?

**Answer:**
- Melhor opção: um botão no produto ("Modo Economia de Dados")
- Isso facilita para usuários com internet fraca, escolas, ONGs que vão utilizar direto no navegador
- Alternativa secundária: Builds separados somente se realmente necessário (ex.: distribuição via pendrive)
- Resumo: Começar com "Modo Economia de Dados" na interface. Deixar builds separados apenas como futura possibilidade

**Q4:** Documentação multilíngue: assumo que devemos criar guias/tutoriais específicos para essas regiões na pasta `docs/` (ex.: `docs/GUIA_INICIANTE_AM.md`, `docs/GUIA_INICIANTE_SW.md`). Está correto, ou devemos estruturar de outra forma?

**Answer:**
- Suposição está correta e a estruturação proposta funciona perfeitamente
- Recomenda-se colocar tudo em docs/ assim:
  - `docs/GUIA_INICIANTE_EN.md`
  - `docs/GUIA_INICIANTE_AM.md` (amárico — futuro)
  - `docs/GUIA_INICIANTE_SW.md` (suaíli — futuro)
- Pode começar só com EN
- PT e ES continuam separados como já existem

**Q5:** Conexão com ONGs/escolas: assumo que isso será uma seção informativa com contatos, links e formas de parceria, sem integração técnica no momento. Está correto, ou devemos incluir formulários de contato ou integração com APIs de terceiros?

**Answer:**
- Está exatamente correto
- Somente seção informativa por enquanto:
  - lista de ONGs relevantes
  - email para contato
  - instruções de parceria
  - como baixar as versões leves
  - como traduzir o projeto
- Nenhuma integração técnica com APIs agora
- Futuro: formulário de contato simples (opcional)

**Q6:** Priorização de países: assumo que começamos com os três países mencionados (Etiópia, Uganda, Tanzânia) e expandimos depois. Está correto, ou há outros países prioritários?

**Answer:**
- Sim, está correto
- Começar com: Etiópia, Uganda, Tanzânia
- Se quiser expandir, os próximos países naturais seriam:
  - Quênia (Kiswahili)
  - Nigéria
  - Ruanda (muito envolvida em tecnologia educacional)
- Mas isso é futuro

**Q7:** Integração com o produto atual: assumo que isso é uma iniciativa de impacto social que complementa o produto (jogos para desenvolvedores), não alterando a funcionalidade principal. Está correto?

**Answer:**
- Correto
- Isso não altera o core do produto (jogos, ambiente de aprendizado)
- É uma camada social/educacional e documental

**Q8:** Exclusões: há algo que não deve ser incluído nesta fase? Por exemplo, tradução completa da interface dos jogos, sistema de doações, ou integração com plataformas de educação específicas?

**Answer:**
- NÃO incluir agora:
  - Tradução completa do UI do produto para amárico ou suaíli
  - Sistema de doações
  - Integração com plataformas educacionais (Coursera, Khan Academy, etc.)
  - Registro formal com ONGs
  - Ferramentas internas específicas para escolas
  - Distribuição offline via APK, EXE ou pendrive (apenas planejar)
- Sim incluir agora:
  - Página `/impacto-social`
  - Documentação explicando os países
  - Plano de suporte multilíngue futuro
  - Guia para contribuidores focado nessas regiões
  - Botão ou modo "Economia de Dados" (planejado)

### Existing Code to Reference

**Similar Features Identified:**
- Página "Sobre" (`app/sobre/page.tsx`) - tem suporte básico de idiomas (PT/EN) e pode servir como referência para estrutura de página multilíngue
- Documentação existente em `docs/` - estrutura de guias multilíngues já estabelecida (GUIA_INICIANTE_PT.md, BEGINNER_GUIDE_EN.md, GUIA_INICIANTE_ES.md)
- README com seções multilíngues - padrão de organização de conteúdo em múltiplos idiomas

No similar existing features identified for reference beyond the documentation structure.

### Follow-up Questions

Nenhuma pergunta de follow-up foi necessária. Todas as respostas foram claras e completas.

## Visual Assets

### Files Provided:
Nenhum arquivo visual foi encontrado na pasta `planning/visuals/`.

### Visual Insights:
Nenhum asset visual fornecido para análise.

## Requirements Summary

### Functional Requirements
- Criar nova página `/impacto-social` ou `/regioes-interesse` dedicada ao impacto social
- Apresentar informações sobre os três países-alvo: Etiópia, Uganda e Tanzânia
- Incluir seção informativa sobre ONGs e escolas com:
  - Lista de ONGs relevantes
  - Email para contato
  - Instruções de parceria
  - Como baixar versões leves
  - Como traduzir o projeto
- Criar documentação em inglês na pasta `docs/` (GUIA_INICIANTE_EN.md já existe, pode ser expandido)
- Planejar suporte multilíngue futuro (suaíli e amárico) no roadmap
- Planejar implementação de "Modo Economia de Dados" na interface (não implementar agora, apenas planejar)
- Adicionar seção "🌍 Impacto Social" no README principal

### Reusability Opportunities
- Reutilizar estrutura de página similar à página "Sobre" (`app/sobre/page.tsx`) para suporte multilíngue básico
- Seguir padrão de documentação já estabelecido em `docs/` para novos guias
- Usar estrutura de README multilíngue como referência para organização de conteúdo

### Scope Boundaries
**In Scope:**
- Nova página/seção dedicada ao impacto social
- Documentação em inglês sobre os países-alvo
- Seção informativa sobre ONGs e escolas
- Plano de suporte multilíngue futuro (documentado, não implementado)
- Planejamento de "Modo Economia de Dados" (documentado, não implementado)
- Seção no README sobre impacto social

**Out of Scope:**
- Tradução completa do UI do produto para amárico ou suaíli
- Sistema de doações
- Integração com plataformas educacionais (Coursera, Khan Academy, etc.)
- Registro formal com ONGs
- Ferramentas internas específicas para escolas
- Distribuição offline via APK, EXE ou pendrive
- Implementação imediata de "Modo Economia de Dados"
- Implementação imediata de traduções para suaíli e amárico
- Formulário de contato (futuro opcional)
- Expansão para outros países além dos três mencionados (futuro)

### Technical Considerations
- Usar Next.js App Router para criar nova página (seguindo padrão do projeto)
- Manter consistência com estrutura de documentação existente em `docs/`
- Seguir padrões de estilo e convenções do projeto (TailwindCSS, tema-aware styling)
- Não requer integração com APIs externas ou sistemas de terceiros
- Página será principalmente informativa (estática ou com conteúdo dinâmico simples)
- Considerar responsividade e acessibilidade seguindo padrões do projeto
- Manter consistência com sistema de temas existente

