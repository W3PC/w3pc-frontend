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
    if (result.data) {
      setGameLoaded(true)
    }
  }, [result.data, setGameLoaded])

  const updateValues = () => {
    gameCredits.refetch()
    totalGameCredits.refetch()
  }

  if (result.fetching) return <div>Loading...</div>
  if (result.error)
    return <div>There was an error fetching game contract...{result.error}</div>
  if (!result.fetching && !result.data)
    return <div>That is not a valid game contract</div>

  return (
    <Container>
      <GameInfo style={{ alignItems: 'center' }}>
        <GameData>
          <div>GAME ID:</div>
          <div style={{ fontWeight: 'bold' }}>{`${gameId.substring(
            0,
            14
          )}...`}</div>
          <div>
            <CopyButton text={gameId} />
          </div>
        </GameData>
        <GameData>
          <div>Total credits in Game</div>
          <div style={{ fontWeight: 'bold' }}>
            {totalGameCredits?.data
              ? totalGameCredits.data.toNumber()
              : result.data.game.totalCredits}{' '}
            CHIPS
          </div>
        </GameData>
        <GameData>
          <div>Your credits in Game</div>
          <div style={{ fontWeight: 'bold' }}>
            {gameCredits.isFetched
              ? gameCredits.data.toString() + ' CHIPS'
              : null}
          </div>
        </GameData>
      </GameInfo>
      <GameInfo>
        <GameData>
          <div>Game Host:</div>
          <div style={{ fontWeight: 'bold' }}>
            {utils.parseBytes32String(result?.data?.game?.host?.name)}
          </div>
          <VerifyButton />
        </GameData>
        <GameData>
          <div>Current Players:</div>
          <div style={{ fontWeight: 'bold' }}>
            {result.data.game.playerCount}
          </div>
        </GameData>
        <GameData>
          <AdjustCredits
            playerId={account?.data?.address}
            gameId={gameId}
            updateValues={updateValues}
          />
        </GameData>
      </GameInfo>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
`
const GameInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  width: 50%;
  @media (min-width: 576px) {
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
  @media (min-width: 992px) {
    width: 25%;
    font-size: 1.5rem;
  }
`
const GameData = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-top: 2.5rem;
`

export default GameView
