import React from 'react'
import { createClient, Provider, chain } from 'wagmi'
import { providers } from 'ethers'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

console.log(process.env.REACT_APP_RPC_URL)

const WagmiProvider = (props) => {
  //List of chains from wagmi
  const chains =
    process.env.NODE_ENV === 'development' ? [chain.hardhat] : [chain.polygon]

  const client = createClient({
    // AutoConnect must be true due to a bug in Wagmi not assigning Client.connector properly otherwise, will try and make a pull request on their github to fix
    autoConnect: true,

    connectors() {
      const chain = chains[0]
      const rpcUrl = process.env.REACT_APP_RPC_URL
      return [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'Web3-Poker-Social',
            chainId: chain.id,
            jsonRpcUrl: rpcUrl,
          },
        }),
        new WalletConnectConnector({
          chains,
          options: {
            qrcode: true,
            rpc: { [chain.id]: rpcUrl },
          },
        }),
        new InjectedConnector({
          chains,
          options: { name: 'Injected' },
        }),
      ]
    },
    provider(config) {
      if (process.env.NODE_ENV === 'development') {
        return new providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL, {
          chainId: 31337,
          name: 'dev',
        })
      } else {
        return new providers.AlchemyProvider(
          137,
          process.env.REACT_APP_ALCHEMY_KEY
        )
      }
    },
  })

  return <Provider client={client} {...props} />
}

export default WagmiProvider
