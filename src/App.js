import WagmiProvider from './WagmiProvider'
import { ChainContextProvider } from './hooks/useChainState'
import Layout from './Layout'

console.log(process.env.REACT_APP_RPC_URL)
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
