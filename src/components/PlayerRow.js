import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractWrite, useContractRead } from 'wagmi'
import gameAbi from '../constants/abis/Game.json'
import { utils, BigNumber } from 'ethers'
import { addCreditsErr, deductCreditsErr } from '../constants'

const PlayerRow = ({ userName, credits, id, gameAddress, setErrors }) => {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const gameCredits = useContractRead(
    {
      addressOrName: '0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81',
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
      addressOrName: '0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81',
      contractInterface: gameAbi,
    },
    'addCredits',
    {
      onSuccess(data) {
        console.log('here')
        if (data) {
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
      addressOrName: '0xd8058efe0198ae9dD7D563e1b4938Dcbc86A1F81',
      contractInterface: gameAbi,
    },
    'deductCredits',
    {
      onSuccess(data) {
        if (data) {
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

  return (
    <>
      <tr>
        <th>{userName}</th>
        <td>
          {gameCredits.isFetched ? gameCredits.data.toString() : credits} Chips
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
            <Button
              value={loading ? 'Completing...' : 'Add Credits'}
              type='submit'
              onClick={(e) => addCredits(e)}
              disabled={loading}
            />
          </form>
        </td>
        <td>
          <form>
            <Button
              style={{ backgroundColor: '#a65a49', borderColor: '#a65a49' }}
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

const Button = styled.input`
  height: 2rem;
  color: white;
  background-color: #24803d;
  border: 1px solid #24803d;
  border-radius: 5px;
`

export default PlayerRow
