import React, { useState } from 'react'
import { useQuery } from 'urql'
import { utils } from 'ethers'
import PlayerRow from './PlayerRow'
import {
  Accordion,
  Group,
  Text,
  Container,
  Loader,
  Center,
} from '@mantine/core'

const HostPanel = ({ gameId, totalGameCredits, totalGameChips }) => {
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
  if (fetching)
    return (
      <Center>
        <Loader size='xl' m='xl' />
      </Center>
    )
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <>
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
      <Container p='xl'>
        <Accordion>
          {data?.game?.players?.map((player) => (
            <Accordion.Item
              label={
                <AccordionLabel
                  userName={utils.parseBytes32String(player.player.name)}
                  credits={player.credits}
                />
              }
              key={player.player.id}
            >
              <PlayerRow
                id={player.player.id}
                credits={player.credits}
                key={player.player.id}
                gameAddress={gameId.toLowerCase()}
                setErrors={setErrorFunc}
                totalGameCredits={totalGameCredits}
                totalGameChips={totalGameChips}
              />
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </>
  )
}

const AccordionLabel = ({ gameCredits, userName, credits }) => {
  return (
    <Group noWrap>
      <Text>{userName}</Text>
      <Text>{credits} Credits</Text>
    </Group>
  )
}

export default HostPanel
