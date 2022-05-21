import React, { useState } from 'react'
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
import CreateAccount from './CreateAccount'

const HostGame = () => {
  const [errors, setErrors] = useState('')
  const [loading, setLoading] = useState(false)
  const { userName, account } = useChainState()

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
      watch: true,
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
      watch: true,
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
  if (
    (!userName?.data || userName?.data === zeroUserAddress) &&
    userName?.isFetched
  ) {
    return <CreateAccount />
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
export default HostGame
