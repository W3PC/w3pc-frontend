import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractRead, useContractWrite, useProvider } from 'wagmi'
import { useChainState } from '../hooks/useChainState'
import gameDirectoryAbi from '../constants/abis/GameDirectory.json'
import gameAbi from '../constants/abis/Game.json'
import cashierAbi from '../constants/abis/Cashier.json'
import {
  cashierAddress,
  gameDirectoryAddress,
  zeroAddress,
  zeroUserAddress,
} from '../constants'
import HostPanel from '../components/HostPanel'
import CopyButton from '../components/CopyButton'
import { Button, Group, Title, Stack, Center } from '@mantine/core'

const HostGame = () => {
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const { userName } = useChainState()

  const { account } = useChainState()
  const provider = useProvider()

  const hostedGame = useContractRead(
    {
      addressOrName: gameDirectoryAddress,
      contractInterface: gameDirectoryAbi,
    },
    'hostedGames',
    {
      args: account?.data?.address,
      enabled: account?.data?.address ? true : false,
    }
  )
  const createGame = useContractWrite(
    {
      addressOrName: gameDirectoryAddress,
      contractInterface: gameDirectoryAbi,
      signerOrProvider: provider,
    },
    'createGame',
    {
      onSuccess(data) {
        if (data) {
          data.wait().then((data) => {
            setLoading(false)
            hostedGame.refetch()
          })
        }
      },
      onError(error, data) {
        console.log(error)
        console.log(data)
        setErrors(
          'There was an error trying to create you game please try again'
        )
      },
    }
  )

  const totalGameCredits = useContractRead(
    {
      addressOrName: hostedGame?.data,
      contractInterface: gameAbi,
    },
    'totalGameCredits',
    {
      enabled:
        hostedGame?.data && hostedGame.data !== zeroAddress ? true : false,
    }
  )

  const totalGameChips = useContractRead(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'balanceOf',
    {
      enabled:
        hostedGame?.data && hostedGame.data !== zeroAddress ? true : false,
      args: [hostedGame?.data],
    }
  )
  const handleClick = (e) => {
    e.preventDefault()
    if (!userName.data || userName.data === zeroUserAddress) {
      setErrors('Please make an account first')
      return
    }
    setErrors('')
    setLoading(true)
    createGame.write()
  }
  return (
    <>
      {hostedGame.data === zeroAddress && hostedGame.data && (
        <Center>
          <Stack>
            <Title order={1}>Your Hosted Game</Title>
            <Title order={2} color='red'>
              No Game Detected
            </Title>
            <Button
              onClick={(e) => handleClick(e)}
              disabled={createGame.isLoading}
            >
              {loading ? 'Creating...' : 'Create Game'}
            </Button>
          </Stack>
        </Center>
      )}
      {hostedGame.data !== zeroAddress && hostedGame.data && (
        <>
          <Group position='center' align='baseline' spacing={50}>
            <Stack spacing='xs'>
              <Title order={3}>Game ID:</Title>
              <Title order={4} style={{ fontWeight: 'bold' }}>
                {`${hostedGame?.data?.substring(0, 14)}...`}
              </Title>
              <Group>
                <CopyButton text={hostedGame.data} />
                <Button radius='xl' size='xs' compact>
                  Contract
                </Button>
              </Group>
            </Stack>

            <Stack spacing='xs'>
              <Title order={3}>Total CHIPS in Game</Title>
              <Title
                order={4}
                style={{ fontWeight: 'bold', alignSelf: 'center' }}
              >
                {totalGameCredits?.data?.toNumber()} CHIPS
              </Title>
            </Stack>
            <Stack spacing='xs'>
              <Title order={3}>Unassigned CHIPS</Title>
              <Title
                order={4}
                style={{ fontWeight: 'bold', alignSelf: 'center' }}
              >
                {totalGameChips?.data?.sub(totalGameCredits?.data).toNumber()}{' '}
                CHIPS
              </Title>
            </Stack>
          </Group>
          <HostPanel
            gameId={hostedGame.data}
            totalGameCredits={totalGameCredits}
            totalGameChips={totalGameChips}
          />
        </>
      )}
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
    </>
  )
}

const Container = styled.div`
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  align-items: center;
  width: auto;
  @media (min-width: 576px) {
    margin: font-size: 1.1rem;
  }
  @media (min-width: 768px) {
    font-size: 1.3rem;
  }
  @media (min-width: 992px) {
    font-size: 1.5rem;
  }
`
const GameInfo = styled.div`
  display: flex;
  flex-direction: row;
  @media (min-width: 576px) {
  }
  @media (min-width: 768px) {
  }
  @media (min-width: 992px) {
    width: 70%;
    padding-left: 30%;
  }
`
const GameId = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
`

export default HostGame
