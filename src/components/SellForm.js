import React, { useState } from 'react'
import { useContractWrite, useProvider } from 'wagmi'
import cashierAbi from '../constants/abis/Cashier.json'
import { cashierAddress } from '../constants'
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit'
import { Title, NumberInput, Button } from '@mantine/core'
import {
  showPendingTxn,
  updatePendingTxn,
} from '../notifications/txnNotification'

const SellForm = ({ userChips, update }) => {
  const [value, setValue] = useState(0)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('unapproved')
  const addRecentTransaction = useAddRecentTransaction()

  const provider = useProvider()

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
          const hash = data.hash
          showPendingTxn(hash)
          addRecentTransaction({
            hash: hash,
            description: `Sold ${value} CHIPS`,
          })
          data
            .wait()
            .then((data) => {
              if (data) {
                updatePendingTxn(hash)
                setValue(0)
                setErrors({})
                setStatus('success')
                update()
              }
            })
            .catch((error) => {
              updatePendingTxn(hash, true)
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
        setValue(0)
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
      <Title order={2} align='center'>
        Sell CHIPS with USDC
      </Title>
      <NumberInput
        onChange={(v) => setValue(v)}
        value={value}
        min={0}
        max={userChips?.data?.toNumber()}
        disabled={status !== 'unapproved' && status !== 'success'}
        precision={0}
        hideControls
        error={errors?.sellTokens}
      />
      <Button onClick={sellChips} loading={status === 'buying'}>
        {status === 'buying' ? 'Confirming Txn...' : 'Sell Chips'}
      </Button>
    </>
  )
}

export default SellForm
