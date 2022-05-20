import '@rainbow-me/rainbowkit/styles.css'
import WagmiProvider from './WagmiProvider'
import { ChainContextProvider } from './hooks/useChainState'
import Layout from './Layout'
import { createClient, Provider as UrqlProvider } from 'urql'
import { MantineProvider, ColorSchemeProvider } from '@mantine/core'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'

function App() {
  const client = createClient({
    url: process.env.REACT_APP_SUBGRAPH_URL,
  })

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme',
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  })

  const toggleColorScheme = (ColorScheme) =>
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')

  useHotkeys([['mod+J', () => toggleColorScheme()]])

  return (
    <WagmiProvider>
      <UrqlProvider value={client}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider theme={{ colorScheme }} withGlobalStyles>
            <ChainContextProvider>
              <Layout />
            </ChainContextProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </UrqlProvider>
    </WagmiProvider>
  )
}

export default App
