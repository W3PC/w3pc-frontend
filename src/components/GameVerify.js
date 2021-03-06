import React, { useEffect, useState } from 'react'
import { useContractRead } from 'wagmi'
import gameAbi from '../constants/abis/Game.json'
import gameDirectoryAbi from '../constants/abis/GameDirectory.json'
import styled from 'styled-components'
import { gameDirectoryAddress, zeroAddress } from '../constants'

const GameVerify = ({ gameId }) => {
  // This componenet is what i initially used to verify that a contract is one of our contracts
  // To prevent from someone from tricking us into interacting with a naughty contract
  // This method no longer works since game contracts no longer have an owner function but im keeping in here for reference

  const [loading, setLoading] = useState(true)
  const [validContract, setValidContract] = useState(true)

  const owner = useContractRead(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'owner',
    {
      watch: false,
      onError(error) {
        console.log(error)
        setValidContract(false)
        setLoading(false)
      },
    }
  )

  const hostedGame = useContractRead(
    {
      addressOrName: gameDirectoryAddress,
      contractInterface: gameDirectoryAbi,
    },
    'hostedGames',
    {
      args: owner?.data,
      enabled: owner?.data,
      watch: false,
    }
  )

  useEffect(() => {
    if (!hostedGame) {
      return
    }
    if (hostedGame.data === zeroAddress) {
      setValidContract(false)
      setLoading(false)
    }
    if (hostedGame.data === gameId) {
      setLoading(false)
      setValidContract(true)
    }
  }, [hostedGame, gameId])
  return (
    <Container>
      {loading && <div>Loading...</div>}
      {!loading && validContract && <div>Game Found!!</div>}
      {!loading && !validContract && <div>Not a Valid Game COntract</div>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
  font-size: 1.5rem;
  padding-top: 5%;
`

export default GameVerify
