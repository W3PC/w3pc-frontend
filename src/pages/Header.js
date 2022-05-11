import React from 'react'
import styled from 'styled-components'
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

const Container = styled.div`
  display: flex;
  width: 90%;
  height: 10vh;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid black;
`

const PageRoute = styled(Link)`
  font-size: 1.5em;
  text-decoration: none;
`

export default Header
