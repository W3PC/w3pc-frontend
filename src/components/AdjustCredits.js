import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractWrite } from 'wagmi'
import Button from './Button'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress } from '../constants'
import gameAbi from '../constants/abis/Game.json'
import { BigNumber } from 'ethers'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

const AdjustCredits = ({ gameId, updateValues }) => {
  const [inputValue, setInputValue] = useState('')
  const [depositStatus, setDepositStatus] = useState('unapproved')
  const [withdrawStatus, setWithdrawStatus] = useState('unapproved')
  const [errors, setErrors] = useState('')
  const addRecentTransaction = useAddRecentTransaction()

  const onInputChange = (e) => {
    //Make sure they didnt input a decimal
    const rounded = Math.round(e.target.value)
    if (rounded < 0) {
      setInputValue('')
    } else {
      if (rounded === 0) {
        setInputValue('')
      } else {
        setInputValue(rounded)
      }
    }
  }

  const approveChipsWrite = useContractWrite(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'approve',
    {
      onError(error) {
        console.log(error)
        setErrors(
          'There was an error approving your transaction please try again'
        )
        setInputValue('')
        setDepositStatus('unapproved')
      },
      onSuccess(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Approved ${inputValue} CHIPS to be sent to Game: ${gameId}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setDepositStatus('approved')
              }
            })
            .catch((e) => {
              setErrors(
                'There was an error with your approval please try again'
              )
              setDepositStatus('unapproved')
            })
        }
      },
    }
  )

  const addChipsWrite = useContractWrite(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'addChips',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Added ${inputValue} CHIPS to Game: ${gameId}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setInputValue('')
                setErrors('')
                setDepositStatus('success')
                updateValues()
              }
            })
            .catch((error) => {
              setDepositStatus('approved')
              setErrors(
                'There was an error with your transaction Please try again'
              )
            })
        }
      },
      onError(error) {
        console.log(error)
        setErrors(
          'There was an error completing your transaction please try again'
        )
        setDepositStatus('approved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gasLimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  const returnChipsWrite = useContractWrite(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'returnChips',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Withdrew ${inputValue} CHIPS from Game: ${gameId} `,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setInputValue('')
                setErrors('')
                setWithdrawStatus('success')
                updateValues()
              }
            })
            .catch((error) => {
              setWithdrawStatus('unapproved')
              setErrors(
                'There was an error with your transaction Please try again'
              )
            })
        }
      },
      onError(error) {
        console.log(error)
        setErrors(
          'There was an error completing your transaction please try again'
        )
        setWithdrawStatus('unapproved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gasLimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  const addChips = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    if (depositStatus === 'success') {
      setDepositStatus('unapproved')
    }

    if (depositStatus === 'unapproved') {
      setDepositStatus('approving')
      approveChipsWrite.write({ args: [gameId, BigNumber.from(inputValue)] })
    } else if (depositStatus === 'approved') {
      setDepositStatus('buying')
      addChipsWrite.write({ args: [BigNumber.from(inputValue)] })
    }
  }
  const withdrawChips = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    if (depositStatus === 'success') {
      setDepositStatus('unapproved')
    }

    setWithdrawStatus('withdrawing')
    returnChipsWrite.write({ args: [BigNumber.from(inputValue)] })
  }

  console.log(depositStatus)

  return (
    <>
      <div>Adjust Credits</div>
      <div>
        <Input
          value={inputValue}
          type='number'
          onChange={(e) => onInputChange(e)}
          disabled={
            (depositStatus !== 'unapproved' && depositStatus !== 'success') ||
            (withdrawStatus !== 'unapproved' && withdrawStatus !== 'success')
          }
        />
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: '5%',
        }}
      >
        <Button
          green
          style={{ marginRight: '1rem' }}
          onClick={(e) => addChips(e)}
          disabled={depositStatus === 'approving' || depositStatus === 'buying'}
        >
          {inputValue && depositStatus === 'unapproved'
            ? 'Approve'
            : depositStatus === 'approved'
            ? 'Add Chips'
            : depositStatus === 'buying'
            ? 'Completing...'
            : depositStatus === 'approving'
            ? 'Approving...'
            : 'Deposit'}
        </Button>
        <Button
          green
          onClick={(e) => withdrawChips(e)}
          disabled={withdrawStatus === 'withdrawing'}
        >
          {withdrawChips === 'withdrawing' ? 'Completing Txn...' : 'Withdraw'}
        </Button>
      </div>
      <div>
        {(withdrawStatus === 'success' || depositStatus === 'success') && (
          <div style={{ color: 'green' }}>Your transaction was successful!</div>
        )}
        {errors && (
          <div style={{ color: 'red', fontSize: '1rem' }}>{errors}</div>
        )}
      </div>
    </>
  )
}

const Input = styled.input`
  font-size: 1rem;
  margin-top: 1rem;
  max-width: 150px;
  @media (min-width: 576px) {
    max-width: 275px;
  }
  @media (min-width: 768px) {
    max-width: 375px;
  }
  @media (min-width: 992px) {
    font-size: 1.5rem;
  }
`

export default AdjustCredits
