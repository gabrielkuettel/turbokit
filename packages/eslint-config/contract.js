import globals from 'globals';
import { config as baseConfig } from './base.js';

/**
 * ESLint configuration for Algorand smart contracts.
 * Extends the base configuration with contract-specific rules.
 *
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      '@typescript-eslint/explicit-member-accessibility': 'warn',
    },
  },
];
