import React from 'react'
import { createClient, Provider } from 'wagmi'
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

const WagmiProvider = (props) => {
  const avalancheChain = {
    blockExplorers: {
      default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
      // eslint-disable-next-line
      default: { name: 'SnowTrace', url: 'https://snowtrace.io/' },
    },
    id: 43114,
    name: 'Avalanche',
    nativeCurrency: {
      decimals: 18,
      name: 'Avalanche',
      symbol: 'Avax',
    },
    rpcUrls: {
      default: 'https://api.avax.network/ext/bc/C/rpc',
    },
    testnet: false,
  }
  const defaultChain =
    process.env.NODE_ENV === 'development' ? avalancheChain : avalancheChain

  const { chains, provider } = configureChains(
    [defaultChain],
    [
      apiProvider.jsonRpc((chain) => ({ rpcUrl: chain.rpcUrls.default })),
      apiProvider.fallback(),
    ]
  )

  const { connectors } = getDefaultWallets({
    appName: 'Web3 Poker Social',
    chains,
  })

  const client = createClient({
    // AutoConnect must be true due to a bug in Wagmi not assigning Client.connector properly otherwise, will try and make a pull request on their github to fix
    autoConnect: true,
    connectors,
    provider,
  })

  return (
    <Provider client={client}>
      <RainbowKitProvider
        chains={chains}
        showRecentTransactions={true}
        {...props}
      />
    </Provider>
  )
}

export default WagmiProvider
