# Contribuindo para Compile & Chill

Obrigado por considerar contribuir para o Compile & Chill! 🎉

Este documento fornece diretrizes e informações sobre como contribuir para o projeto.

## 📋 Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor:

1. Verifique se o bug já não foi reportado nas [Issues](https://github.com/seu-usuario/compile-and-chill/issues)
2. Se não foi reportado, crie uma nova issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. comportamento atual
   - Screenshots (se aplicável)
   - Ambiente (OS, versão do Node.js, etc.)

### Sugerindo Melhorias

Sugestões são sempre bem-vindas! Para sugerir uma melhoria:

1. Verifique se já existe uma issue similar
2. Crie uma nova issue com a tag `enhancement`
3. Descreva detalhadamente a funcionalidade proposta e seu caso de uso

### Pull Requests

1. **Fork o repositório**
2. **Crie uma branch** para sua feature/fix:
   ```bash
   git checkout -b feature/minha-feature
   # ou
   git checkout -b fix/correcao-bug
   ```
3. **Faça suas alterações** seguindo os padrões do projeto
4. **Teste suas alterações** localmente
5. **Commit suas mudanças** com mensagens descritivas:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   # ou
   git commit -m "fix: corrige bug Y"
   ```
6. **Push para sua branch**:
   ```bash
   git push origin feature/minha-feature
   ```
7. **Abra um Pull Request** no GitHub

## 🎨 Padrões de Código

### TypeScript

- Use TypeScript para todo o código novo
- Evite `any` - use tipos específicos
- Mantenha funções pequenas e focadas
- Adicione comentários JSDoc para funções complexas

### Formatação

- Use Prettier para formatação automática
- Execute `npm run format` antes de commitar
- Mantenha linhas com no máximo 100 caracteres quando possível

### Estrutura de Arquivos

- Componentes React em `components/`
- Lógica de negócio em `lib/`
- Páginas em `app/`
- Hooks customizados em `hooks/`
- Tipos compartilhados em `types/`

### Convenções de Nomenclatura

- Componentes: PascalCase (`GameCard.tsx`)
- Arquivos utilitários: camelCase (`game-utils.ts`)
- Hooks: camelCase com prefixo `use` (`useDrops.ts`)
- Constantes: UPPER_SNAKE_CASE (`MAX_SCORE`)

## 🧪 Testes

- Teste suas alterações localmente antes de submeter
- Execute `npm run lint` para verificar erros
- Execute `npm run type-check` para verificar tipos
- Teste em diferentes navegadores quando aplicável

## 📝 Mensagens de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Mudanças na documentação
- `style:` Formatação, ponto e vírgula faltando, etc.
- `refactor:` Refatoração de código
- `test:` Adição ou correção de testes
- `chore:` Mudanças em build, dependências, etc.

Exemplos:
```
feat: adiciona sistema de conquistas
fix: corrige validação de score no Terminal 2048
docs: atualiza README com novas instruções
refactor: reorganiza estrutura de componentes de jogos
```

## 🔍 Processo de Revisão

- Pull Requests serão revisados por mantenedores
- Feedback será fornecido de forma construtiva
- Pode ser solicitado que você faça alterações antes do merge
- Mantenha a discussão focada e respeitosa

## 📚 Recursos

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do NextAuth.js](https://authjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Dúvidas?

Se tiver dúvidas sobre como contribuir, você pode:

- Abrir uma issue com a tag `question`
- Verificar a documentação existente
- Revisar issues e PRs anteriores

## 🙏 Agradecimentos

Obrigado por contribuir para tornar o Compile & Chill melhor! Cada contribuição, por menor que seja, é valiosa.

