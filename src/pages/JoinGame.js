import React, { useState } from 'react'
import styled from 'styled-components'
import GameView from '../components/GameView'

const JoinGame = () => {
  const [gameId, setGameId] = useState('')
  const [searchedGame, setSearchedGame] = useState('')
  const [gameLoaded, setGameLoaded] = useState(false)

  const handleClick = (e) => {
    e.preventDefault()
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
            <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
          </div>
          <Button onClick={handleClick}>View Game</Button>
        </>
      )}
      {searchedGame && (
        <GameView gameId={searchedGame} setGameLoaded={setGameLoadedFunc} />
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: auto;
  align-items: center;
  font-size: 1.5rem;
`
const Button = styled.button`
  color: white;
  background: #4786ff;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 1.5em;
  margin-top: 0.5em;
`

export default JoinGame
