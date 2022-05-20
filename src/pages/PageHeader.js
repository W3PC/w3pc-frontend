import React, { useState } from 'react'
import { Header, Text, Grid, Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import MobileMenu from '../components/MobileMenu'

import RainbowConnect from '../components/RainbowConnect'
import { useHistory } from 'react-router-dom'

const PageHeader = () => {
  const history = useHistory()
  const isBigScreen = useMediaQuery('(min-width: 576px)', true)
  const [currentPage, setCurrentPage] = useState(history.location.pathname)

  const navigate = (page) => {
    if (history.location.pathname === page) return
    setCurrentPage(page)
    history.push(page)
  }

  return (
    <Header height={64}>
      <Grid justify='center' align='center' style={{ height: '100%' }} m={0}>
        {!isBigScreen && (
          <Grid.Col span={1}>
            <MobileMenu navigate={navigate} />
          </Grid.Col>
        )}
        <Grid.Col
          span={6}
          xs={2}
          md={4}
          lg={3}
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          <Text size='xl' weight='bold'>
            W3PC
          </Text>
        </Grid.Col>
        {isBigScreen && (
          <Grid.Col
            span={5}
            xs={5}
            md={4}
            lg={3}
            style={{
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <Button
              variant={currentPage === '/' ? 'light' : 'subtle'}
              onClick={() => navigate('/')}
            >
              Cashier
            </Button>
            <Button
              variant={currentPage === '/join' ? 'light' : 'subtle'}
              onClick={() => navigate('/join')}
            >
              Join Game
            </Button>
            <Button
              variant={currentPage === '/host' ? 'light' : 'subtle'}
              onClick={() => navigate('/host')}
            >
              Host Game
            </Button>
          </Grid.Col>
        )}
        <Grid.Col
          span={5}
          xs={5}
          md={4}
          lg={3}
          style={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <RainbowConnect />
        </Grid.Col>
      </Grid>
    </Header>
  )
}

export default PageHeader
