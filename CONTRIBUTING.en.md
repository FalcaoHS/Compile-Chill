# Contributing to Compile & Chill

Thank you for considering contributing to Compile & Chill! 🎉

This document provides guidelines and information on how to contribute to the project.

## 📋 How to Contribute

### Reporting Bugs

If you found a bug, please:

1. Check if the bug hasn't already been reported in [Issues](https://github.com/seu-usuario/compile-and-chill/issues)
2. If not reported, create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected behavior vs. current behavior
   - Screenshots (if applicable)
   - Environment (OS, Node.js version, etc.)

### Suggesting Improvements

Suggestions are always welcome! To suggest an improvement:

1. Check if a similar issue already exists
2. Create a new issue with the `enhancement` tag
3. Describe in detail the proposed functionality and its use case

### Pull Requests

1. **Fork the repository**
2. **Create a branch** for your feature/fix:
   ```bash
   git checkout -b feature/my-feature
   # or
   git checkout -b fix/bug-fix
   ```
3. **Make your changes** following the project standards
4. **Test your changes** locally
5. **Commit your changes** with descriptive messages:
   ```bash
   git commit -m "feat: add new feature X"
   # or
   git commit -m "fix: fix bug Y"
   ```
6. **Push to your branch**:
   ```bash
   git push origin feature/my-feature
   ```
7. **Open a Pull Request** on GitHub

## 🎨 Code Standards

### TypeScript

- Use TypeScript for all new code
- Avoid `any` - use specific types
- Keep functions small and focused
- Add JSDoc comments for complex functions

### Formatting

- Use Prettier for automatic formatting
- Run `npm run format` before committing
- Keep lines to a maximum of 100 characters when possible

### File Structure

- React components in `components/`
- Business logic in `lib/`
- Pages in `app/`
- Custom hooks in `hooks/`
- Shared types in `types/`

### Naming Conventions

- Components: PascalCase (`GameCard.tsx`)
- Utility files: camelCase (`game-utils.ts`)
- Hooks: camelCase with `use` prefix (`useDrops.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_SCORE`)

## 🧪 Testing

- Test your changes locally before submitting
- Run `npm run lint` to check for errors
- Run `npm run type-check` to verify types
- Test in different browsers when applicable

## 📝 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) pattern:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code refactoring
- `test:` Adding or fixing tests
- `chore:` Build changes, dependencies, etc.

Examples:
```
feat: add achievements system
fix: fix score validation in Terminal 2048
docs: update README with new instructions
refactor: reorganize game components structure
```

## 🔍 Review Process

- Pull Requests will be reviewed by maintainers
- Feedback will be provided constructively
- You may be asked to make changes before merge
- Keep the discussion focused and respectful

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://authjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ❓ Questions?

If you have questions about how to contribute, you can:

- Open an issue with the `question` tag
- Check existing documentation
- Review previous issues and PRs

## 🙏 Acknowledgments

Thank you for contributing to make Compile & Chill better! Every contribution, no matter how small, is valuable.

