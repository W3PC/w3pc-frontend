import React, { useState } from 'react'
import styled from 'styled-components'
import { erc20ABI, useContractWrite, useProvider } from 'wagmi'
import { BigNumber } from 'ethers'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress, usdcAddress } from '../constants'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import Button from './Button'

const BuyForm = ({ userUsdc, update }) => {
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('unapproved')
  const addRecentTransaction = useAddRecentTransaction()

  const number = BigNumber.from(5)

  console.log(number)
  const provider = useProvider()

  const onInputChange = (e) => {
    //Make sure they didnt input a decimal
    const rounded = Math.round(e.target.value)

    if (rounded < 0) {
      setValue('')
    } else if (rounded > userUsdc.data.div(1000000).toNumber()) {
      setValue(userUsdc.data.div(1000000).toNumber())
    } else {
      if (rounded === 0) {
        setValue('')
      } else {
        setValue(rounded)
      }
    }
  }

  const approveUsdc = useContractWrite(
    {
      addressOrName: usdcAddress,
      contractInterface: erc20ABI,
    },
    'approve',
    {
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          buyTokens:
            'There was an error approving your transaction please try again',
        })
        setValue('')
        setStatus('unapproved')
      },
      onSuccess(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Approved ${value} USDC to be spent on CHIPS`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                setStatus('approved')
              }
            })
            .catch((e) => {
              setErrors({
                buyTokens:
                  'There was an error with your approval please try again',
              })
              setStatus('unapproved')
            })
        }
      },
    }
  )

  const buyChips = () => {
    if (value === '' || value === 0) {
      return
    }
    if (status === 'success') {
      setStatus('unapproved')
    }

    if (status === 'approved') {
      setStatus('buying')
      writeBuyChips.write({
        args: [value],
      })
    } else {
      setStatus('approving')
      approveUsdc.write({
        args: [cashierAddress, BigNumber.from(value).mul(10 ** 6)],
      })
    }
  }

  const writeBuyChips = useContractWrite(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
      signerOrProvider: provider,
    },
    'getChips',
    {
      onSettled(data) {
        if (data) {
          addRecentTransaction({
            hash: data.hash,
            description: `Bought ${value} CHIPS`,
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
              setStatus('approved')
              setErrors({
                buyTokens:
                  'There was an error with your transaction Please try again',
              })
            })
        }
      },
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          buyTokens:
            'There was an error completing your transaction please try again',
        })
        setStatus('approved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gasLimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  return (
    <>
      <div>Buy CHIPS with USDC</div>
      <Input
        type='number'
        onChange={(e) => onInputChange(e)}
        value={value}
        disabled={status !== 'unapproved' && status !== 'success'}
      />
      {status === 'approved' && (
        <div style={{ color: 'green' }}>
          Txn approved click again to complete
        </div>
      )}
      {errors.buyTokens && (
        <div style={{ color: 'red' }}>{errors.buyTokens}</div>
      )}
      <Button
        style={{ marginTop: '5%' }}
        green
        onClick={buyChips}
        disabled={status === 'approving' || status === 'buying'}
      >
        {!value || status === 'approved' || status === 'success'
          ? 'Buy CHIPS'
          : status === 'unapproved' && value
          ? 'Approve'
          : status === 'approving'
          ? 'Approving'
          : 'Confirming Txn...'}
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
  margin-top: 1rem;
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
export default BuyForm
