# Contributing to CumulusFlow

We love your input! We want to make contributing to CumulusFlow as easy and transparent as possible.

## Development Process

1. Fork the repo
2. Clone your fork
3. Create a new branch: `git checkout -b my-feature`
4. Make your changes
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'Add feature'`
7. Push to your fork: `git push origin my-feature`
8. Create a Pull Request

## Local Development

```bash
# Clone the repository
git clone https://github.com/movestax/cumulusflow.git
cd cumulusflow

# Install dependencies
npm install

# Start development
npm run dev
```

## Project Structure

```
cumulusflow/
├── src/
│   ├── core/          # Core framework functionality
│   ├── middleware/    # Middleware implementations
│   ├── adapters/      # Platform adapters
│   ├── hooks/         # React hooks
│   └── cli/           # CLI implementation
├── docs/             # Documentation
├── examples/         # Example projects
└── tests/           # Test files
```

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test src/core/runtime.test.js

# Run with coverage
npm test -- --coverage
```

## Documentation

- Follow JSDoc standards for code documentation
- Update relevant documentation in `/docs`
- Add examples for new features

## Code Style

- Use ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Follow TypeScript best practices

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure CI passes
4. Get two maintainer approvals

## Community

- Join our [Discord](https://discord.gg/cumulusflow)
- Follow us on [Twitter](https://twitter.com/cumulusflow)
- Read our [blog](https://blog.cumulusflow.dev)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.