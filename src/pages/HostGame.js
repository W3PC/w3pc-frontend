import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractRead, useContractWrite, useProvider } from 'wagmi'
import { useChainState } from '../hooks/useChainState'
import gameDirectoryAbi from '../constants/abis/GameDirectory.json'
import gameAbi from '../constants/abis/Game.json'
import {
  gameDirectoryAddress,
  zeroAddress,
  zeroUserAddress,
} from '../constants'
import HostPanel from '../components/HostPanel'
import CopyButton from '../components/CopyButton'
import Button from '../components/Button'

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
    <Container>
      {hostedGame.data === zeroAddress && hostedGame.data && (
        <div>
          <div>Your Hosted Game</div>
          <h2 style={{ color: 'red' }}>No Game Detected</h2>
          <Button
            onClick={(e) => handleClick(e)}
            disabled={createGame.isLoading}
          >
            {loading ? 'Creating...' : 'Create Game'}
          </Button>
        </div>
      )}
      {hostedGame.data !== zeroAddress && hostedGame.data && (
        <>
          <GameInfo>
            <GameId>
              <div>GAME ID:</div>
              <div style={{ fontWeight: 'bold' }}>
                {`${hostedGame?.data?.substring(0, 14)}...`}
              </div>
              <div>
                <CopyButton text={hostedGame.data} />
                <Button copy style={{ marginLeft: '1rem' }}>
                  Contract
                </Button>
              </div>
            </GameId>

            <GameId style={{ marginLeft: '10%' }}>
              <div>Total CHIPS in Game</div>
              <div style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                {totalGameCredits?.data?.toNumber()} CHIPS
              </div>
            </GameId>
          </GameInfo>
          <HostPanel gameId={hostedGame.data} />
        </>
      )}
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
    </Container>
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
