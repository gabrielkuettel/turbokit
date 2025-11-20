import 'dotenv/config'
import { Config } from '@algorandfoundation/algokit-utils'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { consoleLogger } from '@algorandfoundation/algokit-utils/types/logging'
import { deploy } from './src/deploy'

Config.configure({
  logger: consoleLogger,
  debug: true,
  traceAll: true,
})

registerDebugEventHandlers()

deploy().catch((error) => {
  console.error(error)
  process.exit(1)
})
