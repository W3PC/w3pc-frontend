import React, { useState } from 'react'
import styled from 'styled-components'
import GameVerify from '../components/GameVerify'

const JoinGame = () => {
  const [gameId, setGameId] = useState('')
  const [searchedGame, setSearchedGame] = useState('')

  const handleClick = (e) => {
    e.preventDefault()
    setSearchedGame(gameId)
  }

  return (
    <Container>
      <div>Enter a Game ID Below</div>
      <div>
        <input value={gameId} onChange={(e) => setGameId(e.target.value)} />
      </div>
      <Button onClick={handleClick}>View Game</Button>
      {searchedGame && <GameVerify gameId={searchedGame} />}
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
const Button = styled.button`
  color: white;
  background: #4786ff;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 1.5em;
  margin-top: 0.5em;
`

export default JoinGame
