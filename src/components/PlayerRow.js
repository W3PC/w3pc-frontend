import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useContractWrite, useContractRead } from 'wagmi'
import gameAbi from '../constants/abis/Game.json'
import { utils, BigNumber } from 'ethers'
import { addCreditsErr, deductCreditsErr } from '../constants'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import Button from './Button'

const PlayerRow = ({ userName, credits, id, gameAddress, setErrors }) => {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [verify, setVerify] = useState('unverified')
  const addRecentTransaction = useAddRecentTransaction()

  const gameCredits = useContractRead(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'gameCredits',
    {
      args: [id],
      enabled: id && gameAddress ? true : false,
    }
  )

  const addCreditsWrite = useContractWrite(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'addCredits',
    {
      onSuccess(data) {
        console.log('here')
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Added ${inputValue} game credits to ${id}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                console.log(data)
                gameCredits.refetch()
                setLoading(false)
                setInputValue('')
              }
            })
            .catch((error) => {
              console.log(error)
              setErrors('There was an error adding credits please try again')
            })
        }
      },
      onError(error) {
        console.log(error)
        if (error.message === addCreditsErr) {
          setErrors(
            'There is not enough credits in the game contract to add that many credits.'
          )
        } else {
          setErrors('There was an error adding credits please try again')
        }
        setLoading(false)
      },
    }
  )
  const deductCreditsWrite = useContractWrite(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'deductCredits',
    {
      onSuccess(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Deducted ${inputValue} game credits from ${id}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                console.log(data)
                gameCredits.refetch()
                setLoading(false)
                setInputValue('')
              }
            })
            .catch((error) => {
              console.log(error)
              setLoading(false)
              setErrors(
                'There was an error subtracting credits, please try again'
              )
            })
        }
      },
      onError(error) {
        console.log(error)
        if (error.message === deductCreditsErr) {
          setErrors('You cannot deduct more than a player has')
        } else {
          setErrors('There was an error deducting credits please try again')
        }
        setLoading(false)
      },
    }
  )

  const addCredits = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    setErrors('')
    setLoading(true)
    addCreditsWrite.write({
      args: [utils.getAddress(id), BigNumber.from(inputValue)],
    })
  }
  const deductCredits = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    setErrors('')
    setLoading(true)
    deductCreditsWrite.write({
      args: [utils.getAddress(id), BigNumber.from(inputValue)],
    })
  }

  const verifyPlayer = (e) => {
    e.preventDefault()

    const signedMsg = window.prompt(
      'Please enter the signed message you recieved from the player'
    )

    if (signedMsg) {
      const date = new Date()
      date.setUTCMinutes(0, 0, 0)
      const rounded = date / 1000
      const signersAddress = utils.verifyMessage(
        `Hey I am who I say I am-${rounded}`,
        signedMsg
      )
      if (signersAddress === utils.getAddress(id)) {
        setVerify('passed')
      } else {
        // check for the previous hour timestamp incase they got the code towards the end of an hour
        const previousHour = rounded - 3600
        const newSignersAddress = utils.verifyMessage(
          `Hey I am who I say I am-${rounded}`,
          signedMsg
        )
        if (newSignersAddress === utils.getAddress(id)) {
          setVerify('passed')
        } else {
          setVerify('failed')
        }
      }
    }
  }

  return (
    <>
      <tr>
        <th>
          {userName}
          <Button
            onClick={(e) => verifyPlayer(e)}
            copy
            style={
              verify === 'passed'
                ? { backgroundColor: '#24803d', borderColor: '#24803d' }
                : verify === 'failed'
                ? { backgroundColor: '#a65a49', borderColor: '#a65a49' }
                : {}
            }
          >
            {verify === 'unverified'
              ? 'Verify'
              : verify === 'passed'
              ? 'Verified'
              : 'Failed'}
          </Button>
        </th>
        <td>
          {gameCredits.isFetched ? gameCredits.data.toString() : credits}{' '}
          Credits
        </td>
        <td>
          <form>
            <input
              style={{ height: '2rem', width: '100%', boxSizing: 'border-box' }}
              type='number'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </form>
        </td>
        <td>
          <form>
            <TableButton
              value={loading ? 'Completing...' : 'Add Credits'}
              type='submit'
              onClick={(e) => addCredits(e)}
              disabled={loading}
            />
            <TableButton
              red
              value={loading ? 'Completing....' : 'Deduct Credits'}
              type='submit'
              onClick={(e) => deductCredits(e)}
              disabled={loading}
            />
          </form>
        </td>
      </tr>
    </>
  )
}

const TableButton = styled.input`
  height: 2rem;
  color: white;
  background-color: #24803d;
  border: 1px solid #24803d;
  border-radius: 5px;
  width: 50%;

  &:hover {
    background-color: #245e3d;
    border-color: #245e3d;
  }

  ${(props) =>
    props.red &&
    css`
      background-color: #a65a49;
      border-color: #a65a49;

      &:hover {
        background-color: #c47b6a;
        border-color: #c47b6a;
      }
    `}
`

export default PlayerRow
