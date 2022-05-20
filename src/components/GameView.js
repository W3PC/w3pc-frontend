import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useQuery } from 'urql'
import { useContractRead } from 'wagmi'
import { useChainState } from '../hooks/useChainState'
import { utils } from 'ethers'
import gameAbi from '../constants/abis/Game.json'
import CopyButton from './CopyButton'
import AdjustCredits from './AdjustCredits'
import VerifyButton from './VerifyButton'
import { Grid, Title, Text, Stack, Paper } from '@mantine/core'

const GameView = ({ gameId, setGameLoaded }) => {
  const { account } = useChainState()
  const gameQuery = `
  query{
    game(id: "${gameId.toLowerCase()}") {
      id
      host {
        id
        name
      }
      playerCount
      totalCredits
      }
    }`

  const [result] = useQuery({
    query: gameQuery,
    requestPolicy: 'cache-and-network',
  })

  const gameCredits = useContractRead(
    {
      addressOrName: utils.getAddress(gameId),
      contractInterface: gameAbi,
    },
    'gameCredits',
    {
      args: [account?.data?.address],
      enabled:
        account?.data?.address && !result.fetching && result.data
          ? true
          : false,
    }
  )
  const totalGameCredits = useContractRead(
    {
      addressOrName: utils.getAddress(gameId),
      contractInterface: gameAbi,
    },
    'totalGameCredits'
  )

  useEffect(() => {
    if (result?.data?.game) {
      setGameLoaded(true)
    }
  }, [result?.data?.game, setGameLoaded])

  const updateValues = () => {
    gameCredits.refetch()
    totalGameCredits.refetch()
  }

  if (result.fetching) return <div>Loading...</div>
  if (result.error)
    return <div>There was an error fetching game contract...{result.error}</div>
  if (!result.fetching && !result.data.game)
    return <div style={{ color: 'red' }}>That is not a valid game contract</div>

  return (
    <Grid justify='center'>
      <Grid.Col span={6} lg={3}>
        <Stack spacing='xl'>
          <div>
            <Title order={3}>Game ID:</Title>
            <Title order={4}>{`${gameId.substring(0, 14)}...`}</Title>
            <CopyButton text={gameId} />
          </div>
          <div>
            <Title order={3}>Total credits in Game</Title>
            <Title order={4}>
              {totalGameCredits?.data
                ? totalGameCredits.data.toNumber()
                : result.data.game.totalCredits}{' '}
              CHIPS
            </Title>
          </div>
          <div>
            <Title order={3}>Your credits in Game</Title>
            <Title order={4}>
              {gameCredits.isFetched
                ? gameCredits.data.toString() + ' CHIPS'
                : null}
            </Title>
          </div>
        </Stack>
      </Grid.Col>
      <Grid.Col span={6} lg={3}>
        <Stack spacing='xl'>
          <div>
            <Title order={3}>Host:</Title>
            <Title order={4}>
              {utils.parseBytes32String(result?.data?.game?.host?.name)}
            </Title>
            <VerifyButton />
          </div>
          <div>
            <Title order={3}>Current Players:</Title>
            <Title order={4}>{result.data.game.playerCount}</Title>
          </div>
          <AdjustCredits
            playerId={account?.data?.address}
            gameId={gameId}
            updateValues={updateValues}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  )
}

export default GameView
