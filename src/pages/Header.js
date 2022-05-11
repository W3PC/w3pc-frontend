import React from 'react'
import tw from "tailwind-styled-components"
import { Link } from 'react-router-dom'

import WalletConnect from '../components/WalletConnect'

const Header = () => {
  return (
    <Container>
      <div
        style={{
          width: '33%',
          display: 'flex',
          justifyContent: 'space-around',
          paddingLeft: '5%',
        }}
      >
        <PageRoute to='/'>Cashier</PageRoute>
        <PageRoute to='/join'>Join Game</PageRoute>
        <PageRoute to='/host'>Host Game</PageRoute>
      </div>
      <WalletConnect />
    </Container>
  )
}

const Container = tw.div`
  flex
  flex-row
`

const PageRoute = tw(Link)`
  font-size: 1.5em;
  text-decoration: none;
`

export default Header
