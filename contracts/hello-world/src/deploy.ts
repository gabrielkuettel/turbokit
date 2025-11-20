import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { HelloWorldFactory } from '../artifacts/HelloWorld.client'

export async function deploy() {
  const algorand = AlgorandClient.fromEnvironment()
  const deployer = await algorand.account.fromEnvironment('DEPLOYER')

  const typedFactory = algorand.client.getTypedAppFactory(HelloWorldFactory, {
    defaultSender: deployer.addr,
  })

  console.log('\n', `🚀 Deploying ${typedFactory.appName} Application...`, '\n')

  const { appClient, result } = await typedFactory.deploy({
    appName: typedFactory.appName,
    onUpdate: 'append',
    onSchemaBreak: 'append',
    suppressLog: true,
  })

  if (['create', 'replace'].includes(result.operationPerformed)) {
    await algorand.send.payment({
      amount: (1).algo(),
      sender: deployer.addr,
      receiver: appClient.appAddress,
    })
  }

  const { appId, appAddress, appName } = appClient

  console.table({
    name: appName,
    id: appId.toString(),
    address: appAddress.toString(),
    deployer: deployer.addr.toString(),
  })

  const response = await appClient.send.hello({
    args: { name: 'world' },
  })

  console.log(`Response: ${response.return}`)
}
