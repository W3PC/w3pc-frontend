import React, { useState } from 'react'
import { useQuery } from 'urql'
import { utils } from 'ethers'
import PlayerRow from './PlayerRow'
import styled from 'styled-components'

const HostPanel = ({ gameId }) => {
  const [errors, setErrors] = useState('')

  const setErrorFunc = (error) => {
    setErrors(error)
  }

  //subgraph is saving address' in all lowercase. We should prolly fix that in mapping for now we will just lowercase our address'
  const playerQuery = `
  query{
    game(id: "${gameId.toLowerCase()}") {
        players {
          credits
          player {
            id
            name
          }
        }
      }
    }`
  const [result] = useQuery({
    query: playerQuery,
  })

  const { data, fetching, error } = result

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <>
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
      <PlayerTable>
        <tbody>
          {data.game?.players &&
            data.game.players.map((player) => (
              <PlayerRow
                userName={utils.parseBytes32String(player.player.name)}
                id={player.player.id}
                credits={player.credits}
                key={player.player.id}
                gameAddress={gameId.toLowerCase()}
                setErrors={setErrorFunc}
              />
            ))}
        </tbody>
      </PlayerTable>
    </>
  )
}

const PlayerTable = styled.table`
  font-size: 1rem;
  width: 100%;
  padding-top: 5rem;
  @media (min-width: 576px) {
    margin: font-size: 1.3rem;
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
    width: 80%;
  }
  @media (min-width: 992px) {
    font-size: 2rem;
    width: 70%;
  }
`

export default HostPanel
