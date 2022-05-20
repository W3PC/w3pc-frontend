import React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import { AppShell, Footer, useMantineTheme } from '@mantine/core'

import PageHeader from '../pages/PageHeader'
import Cashier from '../pages/Cashier'
import JoinGame from '../pages/JoinGame'
import HostGame from '../pages/HostGame'
import CreateAccount from '../pages/CreateAccount'

const Layout = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      header={<PageHeader />}
      fixed
    >
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
    </AppShell>
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
