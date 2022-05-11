import React, { useState } from 'react'
import styled from 'styled-components'
import { useContractWrite, useProvider } from 'wagmi'
import { BigNumber } from 'ethers'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress } from '../constants'

const SellForm = ({ userChips, update }) => {
  const [value, setValue] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('unapproved')

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

  const approveChips = useContractWrite(
    {
      addressOrName: cashierAddress,
      contractInterface: cashierAbi,
    },
    'approve',
    {
      onError(error) {
        console.log(error)
        setErrors({
          ...errors,
          sellTokens:
            'There was an error approving your transaction please try again',
        })
        setValue('')
        setStatus('unapproved')
      },
      onSuccess(data) {
        if (data) {
          data
            .wait()
            .then((data) => {
              if (data) {
                setStatus('approved')
              }
            })
            .catch((e) => {
              setErrors({
                sellTokens:
                  'There was an error with your approval please try again',
              })
              setStatus('unapproved')
            })
        }
      },
    }
  )
  const sellChips = () => {
    if (value === '' || value === 0) {
      return
    }

    if (status === 'success') {
      setStatus('unapproved')
    }

    if (status === 'approved') {
      setStatus('buying')
      writeSellChips.write({
        args: [value],
      })
    } else {
      setStatus('approving')
      approveChips.write({
        args: [cashierAddress, BigNumber.from(value)],
      })
    }
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
              setStatus('approved')
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
        setStatus('approved')
      },
      overrides(data) {
        //Was going over gas estimations causing txn to fail. Quick fix but we may want to think of a better way to do this like if txn fails prompt the user to raise gas limits so we have more accurate estimations
        return { gaslimit: data.gasLimit.mul(1.5) }
      },
    }
  )

  return (
    <>
      <h2>Sell CHIPS with USDC</h2>
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
      {errors.sellTokens && (
        <div style={{ color: 'red' }}>{errors.sellTokens}</div>
      )}
      <Button
        onClick={sellChips}
        disabled={status === 'approving' || status === 'buying'}
      >
        {!value || status === 'approved' || status === 'success'
          ? 'Sell CHIPS'
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
  font-size: 1.2rem;
  line-height: 2em;
`
const Button = styled.button`
  color: white;
  background: #4786ff;
  border: 1px solid #4786ff;
  border-radius: 5px;
  font-size: 2em;
  margin-top: 0.5em;
`

export default SellForm
