import WagmiProvider from './WagmiProvider'
import { ChainContextProvider } from './hooks/useChainState'
import Layout from './Layout'
function App() {
  return (
    <WagmiProvider>
      <ChainContextProvider>
        <Layout />
      </ChainContextProvider>
    </WagmiProvider>
  )
}

export default App
