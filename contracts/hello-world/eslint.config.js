import { config as baseConfig } from '@turbokit/eslint-config/base'
import { config as contractConfig } from '@turbokit/eslint-config/contract'

/** @type {import("eslint").Linter.Config[]} */
export default [...baseConfig, ...contractConfig]
