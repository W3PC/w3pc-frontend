import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractWrite, useContract, useSigner } from 'wagmi'
import gameAbi from '../constants/abis/Game.json'
import { utils, BigNumber, providers } from 'ethers'

const PlayerRow = ({ userName, credits, id, gameAddress, refetch }) => {
  const [inputValue, setInputValue] = useState('')
  const [errors, setErrors] = useState('')
  const signer = useSigner()

  const gameContract = useContract({
    addressOrName: gameAddress,
    contractInterface: gameAbi,
    signerOrProvider: signer.data,
  })

  console.log(gameAddress)

  const ethersDeductCredits = async (e) => {
    e.preventDefault()
    console.log(gameContract)
    await gameContract
      .deductCredits(utils.getAddress(id), BigNumber.from(+inputValue))
      .then((data) => {
        if (data) {
          debugger
          data
            .wait()
            .then((data) => {
              console.log(data)
            })
            .catch((error) => {
              console.log(error)
            })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const addCreditsWrite = useContractWrite(
    {
      addressOrName: gameAddress,
      contractInterface: gameAbi,
    },
    'addCredits',
    {
      onSuccess(data) {
        if (data) {
          data
            .wait()
            .then((data) => {
              if (data) {
                refetch()
              }
            })
            .catch((error) => {
              console.log(error)
              setErrors('There was an error adding credits please try again')
            })
        }
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
          data
            .wait()
            .then((data) => {
              if (data) {
                refetch()
              }
            })
            .catch((error) => {
              console.log(error)
              setErrors(
                'There was an error subtracting credits, please try again'
              )
            })
        }
      },
    }
  )

  const addCredits = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
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

    console.log(utils.getAddress(id), BigNumber.from(inputValue))

    deductCreditsWrite.write({
      args: [utils.getAddress(id), BigNumber.from(inputValue)],
    })
  }

  return (
    <>
      <tr>
        <th>{userName}</th>
        <td>{credits} Chips</td>
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
              value='Add Credits'
              type='submit'
              onClick={(e) => addCredits(e)}
            />
          </form>
        </td>
        <td>
          <form>
            <Button
              style={{ backgroundColor: '#a65a49', borderColor: '#a65a49' }}
              value='Deduct Credits'
              type='submit'
              onClick={(e) => ethersDeductCredits(e)}
              disabled={!signer.isFetched}
            />
          </form>
        </td>
      </tr>
      {errors && <div style={{ color: 'red' }}>{errors}</div>}
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
