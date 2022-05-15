import React, { useState } from 'react'
import styled from 'styled-components'
import GameView from '../components/GameView'
import Button from '../components/Button'
import { useChainState } from '../hooks/useChainState'
import { zeroUserAddress } from '../constants'
import { utils } from 'ethers'

const JoinGame = () => {
  const [gameId, setGameId] = useState('')
  const [searchedGame, setSearchedGame] = useState('')
  const [gameLoaded, setGameLoaded] = useState(false)
  const { userName } = useChainState()
  const [errors, setErrors] = useState('')

  const handleClick = (e) => {
    e.preventDefault()
    if (!userName.data || userName.data === zeroUserAddress) {
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

  return (
    <Container>
      {!gameLoaded && (
        <>
          <div style={{ paddingTop: '5%' }}>Enter a Game ID Below</div>
          <div>
            <Input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          </div>
          <Button
            green
            style={{ fontSize: '1.5em', marginTop: '1%' }}
            onClick={handleClick}
          >
            View Game
          </Button>
        </>
      )}
      {searchedGame && (
        <GameView gameId={searchedGame} setGameLoaded={setGameLoadedFunc} />
      )}
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
  font-size: 1.5rem;
  justify-content: center;
`
const Input = styled.input`
  font-size: 1.5rem;
  margin-top: 1rem;
`

export default JoinGame
