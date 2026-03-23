# Contributing to Terminal Portfolio Template

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Ways to Contribute

- **Bug Reports:** Open an issue describing the bug, steps to reproduce, and expected behavior.
- **Feature Requests:** Open an issue with a clear description of the proposed feature.
- **Pull Requests:** Bug fixes, new components, documentation improvements are all welcome.
- **Themes:** Share your custom color palettes or terminal themes.

## Development Setup

```bash
git clone https://github.com/H-Freax/TermHub.git
cd TermHub
npm install
npm run dev
```

## Pull Request Guidelines

1. **Fork & branch:** Create a feature branch from `main` (e.g., `feature/add-timeline-component`).
2. **Keep it focused:** One PR per feature or fix. Avoid mixing unrelated changes.
3. **Test your changes:** Run `npm run build` to ensure TypeScript compiles without errors.
4. **Commit messages:** Use clear, imperative-mood messages:
   - `fix: resolve dark mode flicker on Projects page`
   - `feat: add responsive tab bar to Experience terminal`
   - `docs: update customization guide in README`
5. **No breaking changes to config:** If your change requires users to update `src/config/` or `src/data/` files, document the migration clearly.

## Code Style

- Follow existing patterns and naming conventions in the codebase.
- Use the centralized `terminalPalette` from `src/config/theme.ts` -- do not hardcode color values in components.
- Import personal info from `src/config/personal.ts` -- do not hardcode names, emails, or URLs.
- Keep components focused: one component, one responsibility.

## AI-Assisted Contributions

If your contribution uses AI-generated code:
- You must understand and be able to explain all code you submit.
- Disclose AI assistance in your PR description.
- Ensure AI-generated code follows the project's style and conventions.

## License

By contributing, you agree that your contributions will be licensed under the [GNU General Public License v3.0](LICENSE).
