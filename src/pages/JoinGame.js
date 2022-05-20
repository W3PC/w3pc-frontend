import React, { useState } from 'react'
import GameView from '../components/GameView'
import { useChainState } from '../hooks/useChainState'
import { zeroUserAddress } from '../constants'
import { utils } from 'ethers'
import { Button, TextInput, Container } from '@mantine/core'

const JoinGame = () => {
  const [gameId, setGameId] = useState('')
  const [searchedGame, setSearchedGame] = useState('')
  const [gameLoaded, setGameLoaded] = useState(false)
  const { userName } = useChainState()
  const [errors, setErrors] = useState('')

  const handleClick = (e) => {
    e.preventDefault()
    if (!userName?.data || userName.data === zeroUserAddress) {
      setErrors('Please make an account first')
      return
    }
    if (!utils.isAddress(gameId)) {
      setErrors(
        'That is not a valid Game contract. Please input the address you recieved from the host.'
      )
      return
    }
    setErrors('')
    setSearchedGame(gameId)
  }

  const setGameLoadedFunc = (set) => {
    setGameLoaded(set)
  }

  const handleInput = (e) => {
    setErrors('')
    setGameId(e.target.value)
  }

  return (
    <>
      {!gameLoaded && (
        <Container style={{ height: '100%' }}>
          <div>
            <TextInput
              value={gameId}
              onChange={(v) => handleInput(v)}
              error={errors}
              label='Game ID'
              description="The game contract's address"
            />
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button m='lg' onClick={handleClick}>
                View Game
              </Button>
            </div>
          </div>
        </Container>
      )}
      {searchedGame && (
        <GameView gameId={searchedGame} setGameLoaded={setGameLoadedFunc} />
      )}
    </>
  )
}

export default JoinGame
