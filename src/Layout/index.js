import React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import Header from '../pages/Header'
import Cashier from '../pages/Cashier'
import JoinGame from '../pages/JoinGame'
import HostGame from '../pages/HostGame'
import CreateAccount from '../pages/CreateAccount'

const Layout = () => {
  return (
    <Container>
      <Header />
      <Body>
        <Switch>
          <Route path='/join'>
            <JoinGame />
          </Route>
          <Route path='/host'>
            <HostGame />
          </Route>
          <Route path='/createAccount'>
            <CreateAccount />
          </Route>
          <Route path='/'>
            <Cashier />
          </Route>
        </Switch>
      </Body>
    </Container>
  )
}

export default Layout

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`
const Body = styled.div`
  height: 80vh;
  width: 100%;
`
