import React from 'react'
import { createClient, Provider, chain } from 'wagmi'
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'

const WagmiProvider = (props) => {
  const defaultChain =
    process.env.NODE_ENV === 'development' ? chain.hardhat : chain.polygon

  const { chains, provider } = configureChains(
    [defaultChain],
    [
      apiProvider.alchemy(process.env.REACT_APP_ALCHEMY_KEY),
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
