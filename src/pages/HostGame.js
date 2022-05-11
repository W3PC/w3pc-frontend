import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractRead, useContractWrite, useProvider } from 'wagmi'
import { useChainState } from '../hooks/useChainState'
import gameDirectoryAbi from '../constants/abis/GameDirectory.json'
import gameAbi from '../constants/abis/Game.json'
import { gameDirectoryAddress, zeroAddress } from '../constants'

const HostGame = () => {
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

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
      enabled: account?.data?.address,
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
        setErrors({
          ...errors,
          createGame:
            'There was an error trying to create you game please try again',
        })
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
      disabled: !hostedGame && hostedGame === zeroAddress,
    }
  )

  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text)
    } else {
      return document.execCommand('copy', true, text)
    }
  }

  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(hostedGame.data)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 1500)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleClick = (e) => {
    e.preventDefault()
    setLoading(true)
    createGame.write()
  }

  return (
    <Container>
      {hostedGame.data === zeroAddress && (
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
      {hostedGame.data !== zeroAddress && (
        <GameInfo>
          <GameId>
            <div>GAME ID:</div>
            <div style={{ fontWeight: 'bold' }}>
              {`${hostedGame?.data?.substring(0, 14)}...`}
            </div>
            <div>
              <Button
                style={{ fontSize: '1rem' }}
                onClick={() => handleCopyClick()}
              >
                {isCopied ? 'Copied!' : 'Copy to Clipboard'}
              </Button>
              <Button style={{ fontSize: '1rem', marginLeft: 10 }}>
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
      )}
    </Container>
  )
}

const Container = styled.div`
  margin-top: 5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: auto;
`
const Button = styled.button`
  color: white;
  background: #4786ff;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 2em;
  margin-top: 0.5em;
`
const GameInfo = styled.div`
  display: flex;
  flex-direction: row;
  width: 70%;
  padding-left: 30%;
`
const GameId = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
`

export default HostGame
