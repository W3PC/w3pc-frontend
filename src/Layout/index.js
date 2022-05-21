import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { AppShell } from '@mantine/core'

import PageHeader from '../pages/PageHeader'
import Cashier from '../pages/Cashier'
import JoinGame from '../pages/JoinGame'
import HostGame from '../pages/HostGame'

const Layout = () => {
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
        <Route path='/'>
          <Cashier />
        </Route>
      </Switch>
    </AppShell>
  )
}

export default Layout
