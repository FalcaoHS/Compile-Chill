# 📋 Especificações Técnicas

> 🇧🇷 [Português (PT-BR)](README.md) - Padrão / Default  
> 🇺🇸 [English (EN)](README.en.md)

Esta pasta contém todas as especificações detalhadas de features, planejamento e implementação do projeto Compile & Chill.

## 📁 Estrutura

Cada feature tem sua própria pasta nomeada com a data e o nome da feature (formato: `YYYY-MM-DD-feature-name`), contendo:

- **`planning/`** - Requisitos, ideias iniciais, decisões de design e referências visuais
- **`spec.md`** - Especificação técnica detalhada da feature
- **`tasks.md`** - Lista de tarefas para implementação
- **`implementation/`** - Documentação passo a passo da implementação
- **`verifications/`** - Testes e validações realizadas (quando aplicável)

## 🤖 Desenvolvimento com Agent OS

Este projeto foi desenvolvido usando **[Agent OS](https://github.com/buildermethods/agent-os)**, um sistema para melhor planejamento e execução de tarefas de desenvolvimento de software com agentes de IA.

### O que é Agent OS?

**Agent OS** transforma agentes de IA de programação de "estagiários confusos" em desenvolvedores produtivos. Com workflows estruturados que capturam seus padrões, sua stack e os detalhes únicos do seu codebase, o Agent OS fornece aos seus agentes as especificações necessárias para entregar código de qualidade na primeira tentativa—não na quinta.

**Repositório oficial**: [https://github.com/buildermethods/agent-os](https://github.com/buildermethods/agent-os)

### Características

- ✅ **Spec-Driven Development**: Desenvolvimento guiado por especificações detalhadas
- ✅ **Workflows Estruturados**: Processos organizados de planejamento e implementação
- ✅ **Padrões e Standards**: Captura e aplica padrões do projeto automaticamente
- ✅ **Documentação Automática**: Gera documentação técnica durante o desenvolvimento
- ✅ **Compatível com**: Claude Code, Cursor, ou qualquer outra ferramenta de IA

## 📚 Como Usar

Essas especificações servem como:

1. **Documentação Histórica**: Entenda como cada feature foi planejada e implementada
2. **Referência Técnica**: Consulte decisões de design e padrões estabelecidos
3. **Guia para Contribuidores**: Veja exemplos de como features foram desenvolvidas
4. **Base para Novas Features**: Use como referência para manter consistência

## 🔍 Features Documentadas

- Sistema de Temas
- Autenticação OAuth (X/Twitter)
- Jogos (Terminal 2048, Dev Pong, Bit Runner, etc.)
- Sistema de Rankings
- Validação de Scores
- Perfis de Usuário
- Impacto Social / Regiões de Interesse
- E muito mais...

---

**Nota**: Algumas referências históricas nos arquivos podem mencionar `agent-os/specs/`, mas a pasta foi movida para a raiz do projeto (`specs/`) para melhor organização e visibilidade no repositório open-source.

