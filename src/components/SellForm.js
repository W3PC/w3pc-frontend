import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractWrite, useProvider } from 'wagmi'
import { BigNumber } from 'ethers'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress } from '../constants'
import Button from './Button'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'

const SellForm = ({ userChips, update }) => {
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('unapproved')
  const addRecentTransaction = useAddRecentTransaction()

  const provider = useProvider()

  const onInputChange = (e) => {
    //Make sure they didnt input a decimal
    const rounded = Math.round(e.target.value)
    console.log(rounded)
    if (rounded < 0) {
      setValue('')
    } else if (rounded > userChips.data.toNumber()) {
      setValue(userChips.data.toNumber())
    } else {
      if (rounded === 0) {
        setValue('')
      } else {
        setValue(rounded)
      }
    }
  }

  const sellChips = () => {
    if (value === '' || value === 0) {
      return
    }
    if (status === 'success') {
      setStatus('unapproved')
    }
    setStatus('buying')
    writeSellChips.write({
      args: [value],
    })
  }

  const writeSellChips = useContractWrite(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
      signerOrProvider: provider,
    },
    'exchangeChips',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Sold ${value} CHIPS`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setValue('')
                setErrors({})
                setStatus('success')
                update()
              }
            })
            .catch((error) => {
              console.log(error)
              setStatus('unapproved')
              setErrors({
                sellTokens:
                  'There was an error with your transaction Please try again',
              })
            })
        }
      },
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          sellTokens:
            'There was an error completing your transaction please try again',
        })
        setValue('')
        setStatus('unapproved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gaslimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  return (
    <>
      <div>Sell CHIPS with USDC</div>
      <Input
        type='number'
        onChange={(e) => onInputChange(e)}
        value={value}
        disabled={status !== 'unapproved' && status !== 'success'}
      />
      {errors.sellTokens && (
        <div style={{ color: 'red' }}>{errors.sellTokens}</div>
      )}
      <Button
        style={{ marginTop: '5%' }}
        green
        onClick={sellChips}
        disabled={status === 'buying'}
      >
        {status === 'buying' ? 'Confirming Txn...' : 'Sell Chips'}
      </Button>
      {status === 'success' && (
        <div style={{ color: 'green' }}>Transaction was a success!</div>
      )}
    </>
  )
}

const Input = styled.input`
  font-size: 1rem;
  line-height: 1rem;
  max-width: 120px;
  @media (min-width: 576px) {
    max-width: 200px;
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
    line-height: 1.5rem;
    max-width: 300px;
  }
  @media (min-width: 992px) {
    font-size: 2rem;
    line-height: 2rem;
    max-width: 475px;
  }
`
export default SellForm
