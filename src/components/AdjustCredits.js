import React, { useState, useEffect } from 'react'
import { useContractWrite, useContractRead } from 'wagmi'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress } from '../constants'
import gameAbi from '../constants/abis/Game.json'
import { BigNumber, constants } from 'ethers'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { Button, Group, NumberInput, Text, Title } from '@mantine/core'

const AdjustCredits = ({ gameId, updateValues, playerId }) => {
  const [inputValue, setInputValue] = useState('')
  const [depositStatus, setDepositStatus] = useState('unapproved')
  const [withdrawStatus, setWithdrawStatus] = useState('unapproved')
  const [tipStatus, setTipStatus] = useState('unapproved')
  const [errors, setErrors] = useState('')
  const addRecentTransaction = useAddRecentTransaction()

  const approvals = useContractRead(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'allowance',
    {
      enabled: playerId ? true : false,
      args: [playerId, gameId],
      onError(error) {
        console.log(error)
      },
      watch: true,
    }
  )
  useEffect(() => {
    if (approvals?.data && depositStatus === 'unapproved') {
      if (inputValue > +0 && approvals.data.gt(inputValue)) {
        setDepositStatus('approved')
      }
    }
  }, [approvals?.data, inputValue, depositStatus])

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

  const tipChipsWrite = useContractWrite(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'tip',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Tipped ${inputValue} CHIPS to Game: ${gameId}`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setInputValue('')
                setErrors('')
                setTipStatus('success')
                updateValues()
              }
            })
            .catch((error) => {
              setTipStatus('unapproved')
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
        setTipStatus('unapproved')
      },
    }
  )

  const postChipsWrite = useContractWrite(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'postChips',
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

  const withdrawChipsWrite = useContractWrite(
    {
      addressOrName: gameId,
      contractInterface: gameAbi,
    },
    'withdrawChips',
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

  const postChips = (e) => {
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
      approveChipsWrite.write({ args: [gameId, constants.MaxUint256] })
    } else if (depositStatus === 'approved') {
      setDepositStatus('buying')
      postChipsWrite.write({ args: [BigNumber.from(inputValue)] })
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
    withdrawChipsWrite.write({ args: [BigNumber.from(inputValue)] })
  }

  const tipChips = (e) => {
    e.preventDefault()
    if (!inputValue || inputValue < 0 || window.isNaN(inputValue)) {
      setErrors('Please input a valid amount')
      return
    }
    if (tipStatus === 'success') {
      setDepositStatus('unapproved')
    }

    setTipStatus('tipping')
    tipChipsWrite.write({ args: [BigNumber.from(inputValue)] })
  }

  return (
    <>
      <Title order={3}>Adjust Credits</Title>

      <NumberInput
        value={inputValue}
        onChange={(v) => setInputValue(v)}
        disabled={
          depositStatus === 'buying' ||
          withdrawStatus === 'withdrawing' ||
          tipStatus === 'tipping'
        }
        hideControls
        precision={0}
        error={errors}
      />
      <Group spacing='lg'>
        <Button
          color={'teal'}
          onClick={(e) => postChips(e)}
          disabled={depositStatus === 'buying'}
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
          color='violet'
          onClick={(e) => withdrawChips(e)}
          disabled={withdrawStatus === 'withdrawing'}
        >
          {withdrawStatus === 'withdrawing' ? 'Completing Txn...' : 'Withdraw'}
        </Button>
        <Button
          color='grape'
          onClick={(e) => tipChips(e)}
          disabled={tipStatus === 'tipping'}
        >
          {tipStatus === 'tipping' ? 'Completing Txn...' : 'Tip Game'}
        </Button>
      </Group>
      <div>
        {(withdrawStatus === 'success' || depositStatus === 'success') && (
          <Text color='green'>Your transaction was successful!</Text>
        )}
      </div>
    </>
  )
}
export default AdjustCredits
