import React from 'react'
import BuyForm from '../components/BuyForm'
import SellForm from '../components/SellForm'
import { useChainState } from '../hooks/useChainState'
import { Grid, Stack, Title, Paper } from '@mantine/core'

const Cashier = () => {
  const chainState = useChainState()

  return (
    <Grid justify='center' align='center' style={{ height: 800 }}>
      <Grid.Col xs={10} sm={6} xl={4}>
        <Paper
          p='xl'
          shadow='0px 1px 3px rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 0px 20px 25px -5px, rgba(0, 0, 0, 0.14) 0px 10px 10px -5px'
        >
          <Stack spacing='xl' align='center'>
            <div>
              <Title order={2} align='center'>
                Total Chips in Circulation
              </Title>
              <Title order={3} align='center'>
                {chainState?.totalChips?.data?.toNumber()} CHIPS
              </Title>
            </div>

            <div>
              <Title order={2} align='center'>
                Your CHIPS in Wallet
              </Title>
              {chainState.account.data ? (
                <Title order={3} align='center'>
                  {chainState?.userChips?.data?.toNumber()} CHIPS
                </Title>
              ) : (
                <Title order={3} align='center'>
                  ????
                </Title>
              )}
            </div>
            <BuyForm
              userUsdc={chainState?.userUsdc}
              update={chainState.refetchData}
              allowance={chainState?.usdcAllowance}
            />
          </Stack>
        </Paper>
      </Grid.Col>

      <Grid.Col xs={10} sm={6} xl={4}>
        <Paper
          shadow='0px 1px 3px rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 0px 20px 25px -5px, rgba(0, 0, 0, 0.14) 0px 10px 10px -5px'
          p='xl'
        >
          <Stack align='center' spacing='xl'>
            <div>
              <Title order={2} align='center'>
                USDC in the Cashier
              </Title>
              <Title order={3} align='center'>
                {chainState?.cashierUsdc?.data?.div(1000000).toNumber()} USDC
              </Title>
            </div>
            <div>
              <Title order={2} align='center'>
                USDC in Wallet
              </Title>
              {chainState.account.data ? (
                <Title order={3} align='center'>
                  {chainState?.userUsdc?.data?.div(1000000).toNumber()} USDC
                </Title>
              ) : (
                <Title order={3} align='center'>
                  ????
                </Title>
              )}
            </div>
            <SellForm
              userChips={chainState.userChips}
              update={chainState.refetchData}
            />
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

export default Cashier
