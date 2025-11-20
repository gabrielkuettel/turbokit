# TurboKit

**AlgoKit + Turborepo = TurboKit**

A monorepo toolkit for building Algorand smart contracts with the power of Turborepo. TurboKit combines the smart contract development capabilities of [AlgoKit](https://developer.algorand.org/docs/get-details/algokit/) with the build system optimizations of [Turborepo](https://turborepo.org/).

## Overview

TurboKit provides a monorepo structure for Algorand smart contract development. Instead of using AlgoKit's project generation templates, TurboKit re-implements the same functionality within a Turborepo-powered monorepo, giving you:

- **Cached Builds**: Turborepo caches build outputs, so unchanged contracts never rebuild
- **Parallel Builds**: All contracts build simultaneously, not sequentially
- **Smart Task Orchestration**: Automatic dependency management and task parallelization
- **Filtering**: Run commands for specific contracts or subsets of your codebase
- **Remote Caching**: Share build caches across your team and CI/CD pipelines

### Why TurboKit?

Traditional AlgoKit workflows build contracts sequentially, which can be slow in monorepos with multiple contracts. TurboKit leverages Turborepo's task orchestration to:

- Build multiple contracts in parallel
- Cache build artifacts so unchanged contracts skip rebuilding
- Provide fine-grained control over which contracts to build, test, or deploy
- Scale efficiently as your contract portfolio grows

## What's Inside?

This Turborepo includes the following packages/apps:

### Apps

- `apps/docs`: A [Next.js](https://nextjs.org/) documentation app
- `apps/web`: Another [Next.js](https://nextjs.org/) web application

### Packages

- `@turbokit/ui`: A React component library shared by both `web` and `docs` applications
- `@turbokit/eslint-config`: Shared ESLint configurations
- `@turbokit/prettier-config`: Shared Prettier configuration
- `@turbokit/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Contracts

Contracts are located in the `contracts/` directory. Each contract is a workspace package that can be built, tested, and deployed independently.

## Requirements

- Node.js >= 18 (>= 22.14.0 for contracts)
- npm >= 10.9.0

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Generate a New Contract

Generate a new smart contract package:

```bash
turbo gen contract
```

This will prompt you for:

- Contract name (e.g., `hello-world`)
- Description

### Generate Environment Files

Generate environment files for your contracts:

```bash
turbo gen contract-env-file
```

This will prompt you to:

- Choose a specific contract or all existing contracts
- Select which network environment files to generate (localnet, testnet, mainnet, custom)

## Turbo Commands

TurboKit uses Turborepo to run tasks across the monorepo. All commands can be run from the root using `turbo run <task>` or via npm scripts.

### Build

Build all apps, packages, and contracts:

```bash
# Using turbo directly
turbo run build

# Using npm script
npm run build
```

The build task:

- Compiles TypeScript contracts to TEAL
- Generates TypeScript client code
- Builds Next.js applications

### Development

Start development servers:

```bash
# Using turbo directly
turbo run dev

# Using npm script
npm run dev
```

### Testing

Run all tests across the monorepo:

```bash
# Using turbo directly
turbo run test

# Using npm script
npm run test
```

### Code Quality

Lint, format, and type-check:

```bash
# Lint all packages
turbo run lint
npm run lint

# Format code (runs prettier)
npm run format

# Type check all packages
turbo run check-types
npm run check-types
```

### Deployment

Deploy all contracts (builds first):

```bash
# Using turbo directly
turbo run deploy

# Using npm script
npm run deploy
```

## Using Filters

Turborepo's filtering allows you to run tasks for specific packages or contracts. See the [Turborepo filtering documentation](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters) for complete details.

### Filter by Package Name

Run a task for a specific package:

```bash
# Build only the hello-world contract
turbo run build --filter=@turbokit/hello-world

# Or use the shorthand
turbo run build --filter=hello-world
```

### Filter by Directory

Run tasks for all packages in a directory:

```bash
# Build all contracts
turbo run build --filter="./contracts/*"

# Build all apps
turbo run build --filter="./apps/*"

# Build all packages
turbo run build --filter="./packages/*"
```

For more advanced filtering options, see the [Turborepo filtering documentation](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters).

## Generators

TurboKit includes generators to scaffold new contracts and manage environment files.

### Generate Contract

Create a new Algorand smart contract package:

```bash
turbo gen contract
```

This creates:

- Contract source files (`.algo.ts`, `.spec.ts`, `.e2e.spec.ts`)
- Deployment script (`deploy.ts`)
- Configuration files (`package.json`, `tsconfig.json`, `vitest.config.ts`, etc.)
- README with contract documentation

### Generate Environment Files

Generate environment configuration files for contracts:

```bash
turbo gen contract-env-file
```

This will:

- Prompt you to select a contract or generate for all contracts
- Allow you to choose which network files to generate (localnet, testnet, mainnet, custom)
- Create `.env.*` files in the contract directory

Example environment files:

- `.env.localnet` - For local development with algokit localnet
- `.env.testnet` - For testnet deployment
- `.env.mainnet` - For mainnet deployment
- `.env.<custom>` - For custom network configurations

## Project Structure

```
turbokit/
├── apps/                  # Applications
│   ├── docs/             # Next.js documentation app
│   └── web/              # Next.js web application
├── packages/             # Shared packages
│   ├── eslint-config/    # ESLint configurations
│   ├── prettier-config/  # Prettier configuration
│   ├── typescript-config/# TypeScript configurations
│   └── ui/               # React component library
├── contracts/            # Smart contracts
│   └── hello-world/      # Example contract
│       ├── src/          # Contract source files
│       ├── artifacts/    # Compiled outputs
│       └── package.json  # Contract package config
├── turbo/                # Turborepo configuration
│   └── generators/       # Code generators
│       ├── contract/     # Contract generator templates
│       └── contract-env-file/  # Env file generator templates
├── turbo.json            # Turborepo task configuration
└── package.json          # Root package configuration
```

## Useful Links

Learn more about the technologies powering TurboKit:

- [Turborepo Documentation](https://turborepo.org/docs)
- [AlgoKit Documentation](https://developer.algorand.org/docs/get-details/algokit/)
- [Turborepo Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Turborepo Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Turborepo Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Turborepo Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Turborepo Configuration](https://turborepo.com/docs/reference/configuration)
- [Turborepo CLI Reference](https://turborepo.com/docs/reference/command-line-reference)
