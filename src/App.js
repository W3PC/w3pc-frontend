import '@rainbow-me/rainbowkit/styles.css'
import WagmiProvider from './WagmiProvider'
import { ChainContextProvider } from './hooks/useChainState'
import Layout from './Layout'
import { createClient, Provider as UrqlProvider } from 'urql'
function App() {
  const client = createClient({
    url: process.env.REACT_APP_SUBGRAPH_URL,
  })

  return (
    <WagmiProvider>
      <UrqlProvider value={client}>
        <ChainContextProvider>
          <Layout />
        </ChainContextProvider>
      </UrqlProvider>
    </WagmiProvider>
  )
}

export default App
