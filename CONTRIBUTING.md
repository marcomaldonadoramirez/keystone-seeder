# Contributing to Keystone-Seeder

Thank you for your interest in contributing to Keystone-Seeder! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Build the project: `pnpm build`

## Development Workflow

1. Create a new branch for your feature/fix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `pnpm test`
4. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
5. Push to your fork and submit a pull request

## Pull Request Guidelines

- Include tests for any new functionality
- Update documentation as needed
- Follow the existing code style
- Keep pull requests focused - one feature/fix per PR

## Code Style

- We use ESLint and Prettier for code formatting
- Run `pnpm lint` before committing
- TypeScript is required for all new code

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test coverage should not decrease

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions/methods
- Update CHANGELOG.md for notable changes

## Need Help?

Feel free to open an issue for:
- Questions about contributing
- Bug reports
- Feature requests

Thank you for contributing!